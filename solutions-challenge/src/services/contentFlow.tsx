import { GoogleGenerativeAI } from "@google/generative-ai";
import CacheService from './cache';
import OutlineGenerator from './outlineGenerator';
import ContentGenerator from './contentGenerator';
import ImageGenerationService from './imageGeneration';
import ContentRefinement from './contentRefinement';
import PageRenderer from './pageRenderer';
import PromptRefinement from './promptRefinement';
import { animationService } from './animationService';
import { quizGenerator } from './quizGenerator';

interface PageContent {
  page: number;
  rawContent: string;
  refinedContent?: string;
  quiz?: any;
}

interface Subtopic {
  title: string;
  page: number;
  summary: string;
  requires: string[];
}

interface Topic {
  title: string;
  subtopics: Subtopic[];
}

interface Content {
  title: string;
  level: string;
  contentType: string;
  topics: Topic[];
  totalPages: number;
}

// Level display mapping
const LEVEL_DISPLAY: Record<string, string> = {
  "explain-like-im-5": "Explain Like I'm 5",
  "school-kid": "School Kid",
  "high-school": "High School",
  "graduate-student": "Graduate Student",
  "expert": "Expert",
};

export default class ContentFlowService {
  private originalPrompt: string;
  private level: string;
  private contentType: string;
  private refinedPrompt: string | null = null;
  private cache: CacheService;
  
  // State updater functions
  private setProgress: (progress: number) => void;
  private setContent: (content: Content | null) => void;
  private setPageContents: (pageContents: PageContent[] | ((prev: PageContent[]) => PageContent[])) => void;
  private setError: (error: string | null) => void;
  private imageService: ImageGenerationService;

  constructor(
    originalPrompt: string,
    level: string,
    contentType: string,
    setProgress: (progress: number) => void,
    setContent: (content: Content | null) => void,
    setPageContents: (pageContents: PageContent[] | ((prev: PageContent[]) => PageContent[])) => void,
    setError: (error: string | null) => void
  ) {
    this.originalPrompt = originalPrompt;
    this.level = level;
    this.contentType = contentType;
    this.setProgress = setProgress;
    this.setContent = setContent;
    this.setPageContents = setPageContents;
    this.setError = setError;
    this.cache = new CacheService();
    this.imageService = new ImageGenerationService();
  }  
  
  // Start the content generation flow
  public async start(): Promise<void> {
    try {
      await this.refinePrompt();
      // The outline generation will trigger page content generation through state updates
    } catch (err) {
      this.setError(`Failed to start content generation: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Step 1: Refine the original prompt
  private async refinePrompt(): Promise<void> {
    const cacheKey = `refinedPrompt-${this.originalPrompt}`;
    this.setProgress(10);
    
    try {
      const cachedRefined = this.cache.get(cacheKey);
      
      if (cachedRefined) {
        this.refinedPrompt = cachedRefined;
        this.setProgress(20);
        await this.generateOutline(cachedRefined);
      } else {
        const refinedNew = await PromptRefinement.refinePrompt(
          this.originalPrompt, 
          this.level, 
          this.contentType
        );
        
        this.refinedPrompt = refinedNew;
        this.cache.set(cacheKey, refinedNew);
        this.setProgress(20);
        await this.generateOutline(refinedNew);
      }
    } catch (err) {
      this.setError(`Failed to refine prompt: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Step 2: Generate the content outline
  private async generateOutline(refined: string): Promise<void> {
    const cacheKey = `content-${this.originalPrompt}-${this.level}-${this.contentType}`;
    
    try {
      const cachedOutline = this.cache.get(cacheKey);
      
      if (cachedOutline) {
        this.setContent(JSON.parse(cachedOutline));
        this.setProgress(40);
        
        // Trigger page generation via the content state update
        const content = JSON.parse(cachedOutline);
        setTimeout(() => this.generateDetailedContent(content), 0);
      } else {
        const outlineData = await OutlineGenerator.generateOutline(
          refined, 
          this.level, 
          this.contentType
        );
        
        if (!outlineData || !outlineData.topics) {
          throw new Error("Outline data is invalid or missing topics.");
        }

        const newContent: Content = {
          title: this.originalPrompt,
          level: this.getLevelDisplay(this.level),
          contentType: this.contentType === "concise" ? "Quick Read" : "Detailed Explanation",
          topics: outlineData.topics,
          totalPages: outlineData.totalPages ?? 0,
        };

        this.cache.set(cacheKey, JSON.stringify(newContent));
        this.setContent(newContent);
        this.setProgress(40);
        
        // Trigger page generation immediately
        setTimeout(() => this.generateDetailedContent(newContent), 0);
      }
    } catch (err) {
      this.setError(`Failed to generate outline: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Step 3: Generate detailed page content with concurrent processing
  private async generateDetailedContent(content: Content): Promise<void> {
    if (!this.refinedPrompt) {
      this.setError("No refined prompt available");
      return;
    }

    // Validate page numbers before processing
    const pageNumbers = new Set<number>();
    let hasDuplicatePages = false;
    let currentPage = 1;

    // First pass: validate and fix page numbers
    for (const topic of content.topics) {
      console.log("📚 Processing topic:", topic.title);
      for (const subtopic of topic.subtopics) {
        console.log("📄 Processing subtopic:", {
          title: subtopic.title,
          page: subtopic.page,
          requires: subtopic.requires
        });
        
        if (pageNumbers.has(subtopic.page)) {
          console.error(`❌ Duplicate page number found: ${subtopic.page} for subtopic "${subtopic.title}"`);
          hasDuplicatePages = true;
        }
        pageNumbers.add(subtopic.page);
        subtopic.page = currentPage++; // Force sequential page numbers
      }
    }

    if (hasDuplicatePages) {
      console.warn('⚠️ Fixed duplicate page numbers by reassigning sequentially');
      content.totalPages = currentPage - 1;
    }

    const totalSubtopics = content.topics.reduce((count, topic) => count + topic.subtopics.length, 0);
    let completedPages = 0;

    // Flatten all subtopics into a single array for processing
    const allSubtopics = content.topics.flatMap(topic => topic.subtopics);

    try {
      // Process pages in order
      for (const subtopic of allSubtopics) {
        const cacheKey = `page-${this.originalPrompt}-${this.level}-${this.contentType}-${subtopic.page}-${subtopic.title}`;
        const cachedPage = this.cache.get(cacheKey);

        if (cachedPage) {
          const pageData = JSON.parse(cachedPage);
          this.addPageToState(pageData);
          
          completedPages++;
          this.setProgress(40 + (completedPages / totalSubtopics) * 60);
          continue;
        }

        console.log(`📝 Generating content for page ${subtopic.page}: ${subtopic.title}`);
        console.log("📋 Subtopic requirements:", subtopic.requires);
        
        // Generate the page content
        const rawContent = await ContentGenerator.generatePageContent(
          this.refinedPrompt,
          this.level,
          this.contentType,
          subtopic.title,
          subtopic.summary,
          subtopic.page,
          subtopic.requires || []
        );

        // Process images if required
        let contentWithImages = rawContent;
        if (subtopic.requires?.includes("Image")) {
          console.log("🖼️ Processing images for page:", subtopic.page);
          contentWithImages = await this.imageService.processContent(rawContent);
        }

        // Process animations if required
        let contentWithAnimations = contentWithImages;
        if (subtopic.requires?.includes("Animation")) {
          console.log("🎬 Processing animations for page:", subtopic.page);
          contentWithAnimations = await animationService.processAnimationPlaceholders(contentWithImages);
        }

        // Generate quiz if this is the last subtopic of a topic
        let quiz = null;
        const isLastSubtopic = this.isLastSubtopicOfTopic(content.topics, subtopic);
        console.log("📝 Quiz generation check:", {
          subtopicTitle: subtopic.title,
          isLastSubtopic,
          requires: subtopic.requires,
          topicTitle: content.topics.find(t => 
            t.subtopics.some(s => s.page === subtopic.page)
          )?.title
        });

        if (isLastSubtopic) {
          console.log("📝 Generating quiz for topic:", {
            subtopicTitle: subtopic.title,
            topicTitle: content.topics.find(t => 
              t.subtopics.some(s => s.page === subtopic.page)
            )?.title,
            contentLength: contentWithAnimations.length
          });
          
          try {
            const quizData = await quizGenerator.generateQuiz(
              subtopic.title,
              contentWithAnimations,
              this.level
            );
            if (quizData) {
              console.log("✅ Quiz generated successfully:", {
                title: quizData.quizTitle,
                questionCount: quizData.questions.length,
                questions: quizData.questions.map((q, index) => ({
                  questionNumber: index + 1,
                  question: q.question,
                  answers: q.answers,
                  correctAnswer: q.correctAnswer,
                  explanation: q.explanation,
                  point: q.point
                }))
              });
              quiz = quizData;
            } else {
              console.warn("⚠️ Quiz generation returned null or undefined");
            }
          } catch (error) {
            console.error("❌ Error generating quiz:", error);
            console.error("Error details:", error instanceof Error ? error.message : String(error));
          }
        } else {
          console.log("ℹ️ Skipping quiz generation - not the last subtopic of topic");
        }

        // Refine the content
        const refinedContent = await ContentRefinement.refineContent(contentWithAnimations);

        const pageData: PageContent = {
          page: subtopic.page,
          rawContent: contentWithAnimations,
          refinedContent,
          quiz
        };

        // Cache the page data - stringify the entire object including quiz
        this.cache.set(cacheKey, JSON.stringify(pageData));
        
        // Add to state - the quiz will be parsed back to an object
        this.addPageToState(pageData);
        
        completedPages++;
        this.setProgress(40 + (completedPages / totalSubtopics) * 60);
      }
    } catch (error) {
      console.error("❌ Error in content generation:", error);
      this.setError(`Failed to generate content: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Helper method to add a page to state if not already there
  private addPageToState(pageData: PageContent): void {
    this.setPageContents(prev => {
      if (prev.some(p => p.page === pageData.page)) return prev;
      return [...prev, pageData];
    });
  }

  // Helper function to get display value for level
  private getLevelDisplay(levelCode: string): string {
    return LEVEL_DISPLAY[levelCode] || levelCode;
  }

  // Helper method to check if a subtopic is the last one in its main topic
  private isLastSubtopicOfTopic(topics: Topic[], subtopic: Subtopic): boolean {
    console.log("🔍 Checking if subtopic is last in topic:", {
      subtopicTitle: subtopic.title,
      subtopicPage: subtopic.page,
      allTopics: topics.map(t => ({
        title: t.title,
        subtopics: t.subtopics.map(s => ({
          title: s.title,
          page: s.page
        }))
      }))
    });
    
    for (const topic of topics) {
      const subtopics = topic.subtopics;
      if (subtopics.length === 0) continue;
      
      const lastSubtopic = subtopics[subtopics.length - 1];
      console.log("📚 Checking topic:", {
        topicTitle: topic.title,
        lastSubtopicTitle: lastSubtopic.title,
        lastSubtopicPage: lastSubtopic.page,
        currentSubtopicTitle: subtopic.title,
        currentSubtopicPage: subtopic.page,
        isLast: lastSubtopic.page === subtopic.page
      });
      
      if (lastSubtopic.page === subtopic.page) {
        console.log("✅ Found matching last subtopic in topic:", topic.title);
        return true;
      }
    }
    console.log("❌ Not the last subtopic of any topic");
    return false;
  }
}
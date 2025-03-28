import PromptRefinement from "./promptRefinement";
import OutlineGenerator from "./outlineGenerator";
import ContentGenerator from "./contentGenerator";
import ContentRefinement from "./contentRefinement";
import PageRenderer from "./pageRenderer";
import CacheService from "./cache";
import ImageGenerationService from "./imageGeneration";

interface PageContent {
  page: number;
  rawContent: string;
  refinedContent?: string;
}

interface Content {
  title: string;
  level: string;
  contentType: string;
  topics: any[]; 
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
    const cacheKey = `outline-${this.originalPrompt}`;
    
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

    const totalSubtopics = content.topics.reduce((count, topic) => count + topic.subtopics.length, 0);
    let completedPages = 0;

    // Flatten all subtopics into a single array for processing
    const allSubtopics = content.topics.flatMap(topic => topic.subtopics);

    try {
      // Create generation promises for all pages
      const pagePromises = allSubtopics.map(async (subtopic) => {
        const cacheKey = `page-${this.originalPrompt}-${subtopic.page}`;
        const cachedPage = this.cache.get(cacheKey);

        if (cachedPage) {
          // Return cached page if available
          const pageData = JSON.parse(cachedPage);
          this.addPageToState(pageData);
          
          completedPages++;
          const progressValue = 40 + (completedPages / totalSubtopics) * 50;
          this.setProgress(Math.min(90, progressValue));
          
          return pageData;
        } else {
          try {
            // Generate the page content
            const rawContent = await ContentGenerator.generatePageContent(
              this.refinedPrompt!,
              this.level,
              this.contentType,
              subtopic.title,
              subtopic.summary,
              subtopic.page,
              subtopic.requires
            );

            // Process the content
            const refinedContent = await ContentRefinement.refineContent(rawContent);
            const contentWithImages = await this.imageService.processContent(refinedContent);
            const styledContent = PageRenderer.applyStyles(contentWithImages);

            // Create page data object
            const pageData = {
              page: subtopic.page,
              rawContent,
              refinedContent: styledContent
            };

            // Cache the result
            this.cache.set(cacheKey, JSON.stringify(pageData));
            this.addPageToState(pageData);
            
            completedPages++;
            const progressValue = 40 + (completedPages / totalSubtopics) * 50;
            this.setProgress(Math.min(90, progressValue));
            
            return pageData;
          } catch (err) {
            // Handle errors gracefully
            console.error(`Error generating page ${subtopic.page}:`, err);
            
            const errorPageData = {
              page: subtopic.page,
              rawContent: `Error generating content for "${subtopic.title}"`,
              refinedContent: `<p>Error generating content for "${subtopic.title}". Please try again later.</p>`
            };
            
            this.addPageToState(errorPageData);
            
            completedPages++;
            const progressValue = 40 + (completedPages / totalSubtopics) * 50;
            this.setProgress(Math.min(90, progressValue));
            
            return errorPageData;
          }
        }
      });

      // Process all pages concurrently
      const allPages = await Promise.all(pagePromises);
      
      // Set final state
      this.setPageContents(allPages);
      this.setProgress(100);
    } catch (err) {
      this.setError(`Failed to generate content: ${err instanceof Error ? err.message : String(err)}`);
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
}
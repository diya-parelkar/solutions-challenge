import PromptRefinement from "./promptRefinement";
import OutlineGenerator from "./outlineGenerator";
import ContentGenerator from "./contentGenerator";
import ContentRefinement from "./contentRefinement";
import PageRenderer from "./pageRenderer";
import CacheService from "./cache";

// Define interfaces for the service
interface PageContent {
  page: number;
  rawContent: string;
  refinedContent?: string;
}

interface Content {
  title: string;
  level: string;
  contentType: string;
  topics: any[]; // Using any for brevity, but you should define the full type
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

  // Step 3: Generate detailed page content
  private async generateDetailedContent(content: Content): Promise<void> {
    if (!this.refinedPrompt) return;

    let allPages: PageContent[] = [];
    let completedPages = 0;
    const totalSubtopics = content.topics.reduce((count, topic) => count + topic.subtopics.length, 0);

    // Process topics and subtopics in order
    for (const topic of content.topics) {
      for (const subtopic of topic.subtopics) {
        const cacheKey = `page-${this.originalPrompt}-${subtopic.page}`;
        const cachedPage = this.cache.get(cacheKey);

        if (cachedPage) {
          const pageData = JSON.parse(cachedPage);
          allPages.push(pageData);
          
          // Add to state if not already there
          this.addPageToState(pageData);
        } else {
          try {
            // Generate raw content for the page
            const rawContent = await ContentGenerator.generatePageContent(
              this.refinedPrompt,
              this.level,
              this.contentType,
              subtopic.title,
              subtopic.summary,
              subtopic.page,
              subtopic.requires
            );

            // Refine the raw content
            const refinedContent = await ContentRefinement.refineContent(rawContent);

            // Apply styles to the refined content
            const styledContent = PageRenderer.applyStyles(refinedContent);

            const pageData = { 
              page: subtopic.page, 
              rawContent, 
              refinedContent: styledContent 
            };
            
            // Save to cache
            this.cache.set(cacheKey, JSON.stringify(pageData));
            
            allPages.push(pageData);
            
            // Update the current state with the new page
            this.addPageToState(pageData);
          } catch (err) {
            // Create error page
            const pageData = { 
              page: subtopic.page, 
              rawContent: `Error generating content for "${subtopic.title}"`, 
              refinedContent: `<p>Error generating content for "${subtopic.title}". Please try again later.</p>` 
            };
            
            allPages.push(pageData);
            this.addPageToState(pageData);
          }
        }
        
        // Update progress
        completedPages++;
        const progressValue = 40 + (completedPages / totalSubtopics) * 50;
        this.setProgress(Math.min(90, progressValue));
      }
    }

    // Final update with all pages
    this.setPageContents(allPages);
    this.setProgress(100);
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
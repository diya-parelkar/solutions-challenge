import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PromptRefinement from "../services/promptRefinement";
import OutlineGenerator from "../services/outlineGenerator";
import ContentGenerator from "../services/contentGenerator";
import ContentRefinement from "../services/contentRefinement";
import PageRenderer from "@/services/pageRenderer";
import PageRendererComponent from './../services/pageRendererComponent';

// Type definitions
interface PageContent {
  page: number;
  rawContent: string;
  refinedContent?: string;
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

// Cache key generators
const getCacheKeys = (originalPrompt: string, subtopicPage?: number) => {
  return {
    refinedPrompt: `refinedPrompt-${originalPrompt}`,
    outline: `outline-${originalPrompt}`,
    page: subtopicPage ? `page-${originalPrompt}-${subtopicPage}` : undefined
  };
};

// Level display mapping
const LEVEL_DISPLAY: Record<string, string> = {
  "explain-like-im-5": "Explain Like I'm 5",
  "school-kid": "School Kid",
  "high-school": "High School",
  "graduate-student": "Graduate Student",
  "expert": "Expert",
};

export default function GeneratedWebsite() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const originalPrompt: string = queryParams.get("prompt") || "Default Topic";
  const level: string = queryParams.get("level") || "school-kid";
  const contentType: string = queryParams.get("contentType") || "concise";

  // State management
  const [loading, setLoading] = useState<boolean>(true);
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const hasFetchedContent = useRef(false);

  // Initialize content generation
  useEffect(() => {
    if (!hasFetchedContent.current) {
      hasFetchedContent.current = true;
      generateContent();
    }
  }, []);

  // Main content generation flow
  const generateContent = async () => {
    try {
      await refinePrompt();
      // Content generation will continue in the useEffect that watches for content changes
    } catch (err) {
      setError(`Failed to start content generation: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

  // Generate page content when outline is ready
  useEffect(() => {
    if (content) {
      generateDetailedContent();
    }
  }, [content]);

  // Step 1: Refine the original prompt
  const refinePrompt = async () => {
    const cacheKeys = getCacheKeys(originalPrompt);
    setProgress(10);
    
    try {
      const cachedRefined = localStorage.getItem(cacheKeys.refinedPrompt);
      
      if (cachedRefined) {
        console.log(`✅ CACHE: Loaded refined prompt for "${originalPrompt}"`);
        setRefinedPrompt(cachedRefined);
        setProgress(20);
        await generateOutline(cachedRefined);
      } else {
        console.log(`🔄 GENERATING: Refining prompt for "${originalPrompt}"...`);
        const refinedNew = await PromptRefinement.refinePrompt(originalPrompt, level, contentType);
        console.log(`✅ COMPLETED: Refined prompt for "${originalPrompt}"`);
        
        setRefinedPrompt(refinedNew);
        localStorage.setItem(cacheKeys.refinedPrompt, refinedNew);
        setProgress(20);
        await generateOutline(refinedNew);
      }
    } catch (err) {
      setError(`❌ ERROR: Failed to refine prompt: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

  // Step 2: Generate the content outline
  const generateOutline = async (refined: string) => {
    const cacheKeys = getCacheKeys(originalPrompt);
    setLoading(true);
    
    try {
      const cachedOutline = localStorage.getItem(cacheKeys.outline);
      
      if (cachedOutline) {
        console.log(`✅ CACHE: Loaded outline for "${originalPrompt}"`);
        setContent(JSON.parse(cachedOutline));
        setProgress(40);
      } else {
        console.log(`🔄 GENERATING: Creating outline for "${originalPrompt}"...`);
        const outlineData = await OutlineGenerator.generateOutline(refined, level, contentType);
        
        if (!outlineData || !outlineData.topics) {
          throw new Error("Outline data is invalid or missing topics.");
        }

        const newContent: Content = {
          title: originalPrompt,
          level: getLevelDisplay(level),
          contentType: contentType === "concise" ? "Quick Read" : "Detailed Explanation",
          topics: outlineData.topics,
          totalPages: outlineData.totalPages ?? 0,
        };

        console.log(`✅ COMPLETED: Created outline with ${newContent.totalPages} pages`);
        setContent(newContent);
        localStorage.setItem(cacheKeys.outline, JSON.stringify(newContent));
        setProgress(40);
      }
    } catch (err) {
      setError(`❌ ERROR: Failed to generate outline: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

  // Step 3: Generate detailed page content
  const generateDetailedContent = async () => {
    if (!content || !refinedPrompt) return;

    let allPages: PageContent[] = [];
    let completedPages = 0;
    const totalSubtopics = content.topics.reduce((count, topic) => count + topic.subtopics.length, 0);

    // Process topics and subtopics in order
    for (const topic of content.topics) {
      for (const subtopic of topic.subtopics) {
        const cacheKeys = getCacheKeys(originalPrompt, subtopic.page);
        
        if (!cacheKeys.page) continue;
        const cachedPage = localStorage.getItem(cacheKeys.page);

        if (cachedPage) {
          console.log(`✅ CACHE: Loaded page ${subtopic.page} - "${subtopic.title}"`);
          const pageData = JSON.parse(cachedPage);
          allPages.push(pageData);
          
          // Make sure we update the state as we go to show progress
          setPageContents(prev => {
            // Avoid duplicates
            if (prev.some(p => p.page === subtopic.page)) return prev;
            return [...prev, pageData];
          });
        } else {
          console.log(`🔄 GENERATING: Creating page ${subtopic.page} - "${subtopic.title}"...`);
          try {
            // Generate raw content for the page
            const rawContent = await ContentGenerator.generatePageContent(
              refinedPrompt,
              level,
              contentType,
              subtopic.title,
              subtopic.summary,
              subtopic.page,
              subtopic.requires
            );

            console.log(`✅ PROGRESS: Raw content ready for page ${subtopic.page}`);

            // Refine the raw content
            const refinedContent = await ContentRefinement.refineContent(rawContent);
            console.log(`✅ PROGRESS: Content refined for page ${subtopic.page}`);

            // Apply styles to the refined content
            const styledContent = PageRenderer.applyStyles(refinedContent);
            console.log(`✅ COMPLETED: Page ${subtopic.page} fully generated and styled`);

            const pageData = { 
              page: subtopic.page, 
              rawContent, 
              refinedContent: styledContent 
            };
            
            // Save to cache
            localStorage.setItem(cacheKeys.page, JSON.stringify(pageData));
            
            allPages.push(pageData);
            
            // Update the current state with the new page
            setPageContents(prev => {
              if (prev.some(p => p.page === subtopic.page)) return prev;
              return [...prev, pageData];
            });
          } catch (err) {
            console.error(`❌ ERROR: Failed generating page ${subtopic.page}:`, err);
            
            // Create error page
            const pageData = { 
              page: subtopic.page, 
              rawContent: `Error generating content for "${subtopic.title}"`, 
              refinedContent: `<p>Error generating content for "${subtopic.title}". Please try again later.</p>` 
            };
            
            allPages.push(pageData);
            
            // Update with error page
            setPageContents(prev => {
              if (prev.some(p => p.page === subtopic.page)) return prev;
              return [...prev, pageData];
            });
          }
        }
        
        // Update progress
        completedPages++;
        const progressValue = 40 + (completedPages / totalSubtopics) * 50;
        setProgress(Math.min(90, progressValue));
      }
    }

    console.log(`✅ SUMMARY: Generated ${allPages.length} total pages for "${originalPrompt}"`);
    setPageContents(allPages);
    setProgress(100);
    setLoading(false);
  };

  // Update loading state when page contents change
  useEffect(() => {
    if (pageContents.length > 0) {
      setLoading(false);
    }
  }, [pageContents]);

  // Helper function to get display value for level
  const getLevelDisplay = (levelCode: string): string => {
    return LEVEL_DISPLAY[levelCode] || levelCode;
  };

  // Get current page content and title
  const currentPageContent = pageContents.find((p) => p.page === currentPage);
  const currentSubtopic = content?.topics
    .flatMap(topic => topic.subtopics)
    .find(subtopic => subtopic.page === currentPage);
  
  const subtopicTitle = currentSubtopic?.title || `Page ${currentPage}`;

  // Page navigation handlers
  const handleNextPage = () => {
    if (content && currentPage < content.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const navigateToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && content && pageNumber <= content.totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Get loading status message
  const getLoadingStatusMessage = () => {
    if (progress < 20) return "Refining prompt...";
    if (progress < 40) return "Generating outline...";
    if (progress < 90) return "Generating content...";
    return "Finalizing content...";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto">
        <div className="text-primary-foreground text-2xl font-bold">
          {content?.title
            ? content.title.replace(/\b\w/g, (char) => char.toUpperCase())
            : originalPrompt.replace(/\b\w/g, (char) => char.toUpperCase())}
        </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="bg-primary-foreground text-primary">
              {content?.level || getLevelDisplay(level)}
            </Badge>
            <Badge variant="outline" className="bg-primary-foreground text-primary">
              {content?.contentType || (contentType === "concise" ? "Quick Read" : "Detailed")}
            </Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">
        {loading && (
          <div className="space-y-4 my-8">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-center">{getLoadingStatusMessage()}</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md my-4">
            <p>{error}</p>
          </div>
        )}

        {!loading && content && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {content.topics.map((topic) => (
                      <div key={topic.title} className="space-y-1">
                        <h3 className="font-medium">{topic.title}</h3>
                        <ul className="pl-4 space-y-1">
                          {topic.subtopics.map((subtopic) => (
                            <li 
                              key={subtopic.page}
                              className={`cursor-pointer hover:text-primary ${currentPage === subtopic.page ? 'font-bold text-primary' : ''}`}
                              onClick={() => navigateToPage(subtopic.page)}
                            >
                              {subtopic.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3 space-y-4">
              {currentPageContent ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>{subtopicTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <PageRendererComponent htmlContent={currentPageContent?.refinedContent || ""} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevPage}
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </Button>
                    <span className="py-2">
                      Page {currentPage} of {content.totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={handleNextPage}
                      disabled={currentPage >= content.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8">
                    <p className="text-center text-muted-foreground">
                      {pageContents.length > 0 
                        ? "Select a page from the navigation menu" 
                        : "Loading page content..."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
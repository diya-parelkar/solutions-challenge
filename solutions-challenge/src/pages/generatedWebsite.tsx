import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageRendererComponent from './../services/pageRendererComponent';
import ContentFlowService from '../services/contentFlow';
import CacheService from '../services/cache';
import Chatbot from "../components/chatbot";

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
      const contentFlow = new ContentFlowService(
        originalPrompt,
        level,
        contentType,
        setProgress,
        setContent,
        setPageContents,
        setError
      );
      
      await contentFlow.start();
    } catch (err) {
      setError(`Failed to start content generation: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
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
                      <PageRendererComponent htmlContent={currentPageContent?.refinedContent || ""} />
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
            <Chatbot />
          </div>
        )}
      </main>
    </div>
  );
}
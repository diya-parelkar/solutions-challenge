import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageRendererComponent from './../services/pageRendererComponent';
import ContentFlowService from '../services/contentFlow';
import Chatbot from "../components/chatbot";
import { Plus, Minus, BookOpen, ChevronLeft, ChevronRight, Settings } from "lucide-react";

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

// Theme options
const THEMES = {
  default: {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600",
    secondary: "bg-slate-50",
    accent: "text-indigo-600",
    contentBg: "bg-white",
    navActive: "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600",
  },
  earth: {
    primary: "bg-gradient-to-r from-emerald-600 to-teal-600",
    secondary: "bg-stone-50",
    accent: "text-emerald-600",
    contentBg: "bg-white",
    navActive: "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600",
  },
  warm: {
    primary: "bg-gradient-to-r from-amber-500 to-orange-600",
    secondary: "bg-orange-50",
    accent: "text-amber-600",
    contentBg: "bg-white",
    navActive: "bg-amber-50 text-amber-700 border-l-4 border-amber-600",
  },
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
  const [fontSize, setFontSize] = useState<number>(16);
  const [currentTheme, setCurrentTheme] = useState<string>("default");
  const [showSettings, setShowSettings] = useState<boolean>(false);
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
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const navigateToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && content && pageNumber <= content.totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  // Font size handlers
  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 1);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 1);
    }
  };

  // Get loading status message
  const getLoadingStatusMessage = () => {
    if (progress < 20) return "Refining prompt...";
    if (progress < 40) return "Generating outline...";
    if (progress < 90) return "Generating content...";
    return "Finalizing content...";
  };

  // Get current theme
  const theme = THEMES[currentTheme as keyof typeof THEMES];

  return (
    <div className={`min-h-screen flex flex-col ${theme.secondary}`}>
        <header className={`${theme.primary} text-white py-2 px-4 shadow-md sticky top-0 z-10`}>
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-black hover:bg-white/20 border-white/30 flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <ChevronLeft className="h-6 w-6" />
              <span>Back</span>
            </Button>
            <div>
              <div className="text-white text-2xl font-bold">
                {content?.title
                  ? content.title.replace(/\b\w/g, (char) => char.toUpperCase())
                  : originalPrompt.replace(/\b\w/g, (char) => char.toUpperCase())}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {content?.level || getLevelDisplay(level)}
                </Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {content?.contentType || (contentType === "concise" ? "Quick Read" : "Detailed")}
                </Badge>
              </div>
            </div>
            </div>
            <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20" 
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings style={{ width: '24px', height: '24px' }} />
            </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings panel */}
      {showSettings && (
        <div className="container mx-auto px-4 py-2 bg-white/80 backdrop-blur-sm shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Font Size:</span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 12}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{fontSize}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={increaseFontSize}
                  disabled={fontSize >= 24}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Theme:</span>
              <div className="flex gap-2">
                {Object.keys(THEMES).map((theme) => (
                  <Button 
                    key={theme}
                    variant={currentTheme === theme ? "default" : "outline"}
                    size="sm"
                    className="capitalize"
                    onClick={() => setCurrentTheme(theme)}
                  >
                    {theme}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 container mx-auto p-4 md:p-8">
        {loading && (
          <div className="space-y-4 my-8">
            <Card className="p-8">
              <Progress value={progress} className="w-full h-2" />
              <p className="text-center mt-4 font-medium">{getLoadingStatusMessage()}</p>
              <div className="flex justify-center mt-8">
                <div className="animate-pulse flex space-x-4 w-full max-w-lg">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md my-4">
            <p>{error}</p>
          </div>
        )}
 
        {!loading && content && (
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
            {/* Desktop Navigation */}
            <div className="hidden md:block md:col-span-3 space-y-4 max-h-[calc(100vh-8rem)] sticky top-24">
            <Card className={`overflow-hidden border-0 shadow-md ${theme.contentBg}`}>
                <CardHeader className={`pb-3 border-b`}>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-xl">Navigation</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[60vh] overflow-y-auto py-2">
                    <div className="bg-gray-50 mx-4 my-2 p-3 rounded-md">
                      <span className="text-sm text-gray-500">Current Page:</span>
                      <div className="font-medium">{currentPage} of {content?.totalPages || 0}</div>
                    </div>
                    {content?.topics.map((topic) => (
                      <div key={topic.title} className="space-y-1 px-4 py-2">
                        <h3 className={`font-semibold ${theme.accent} text-base px-2`}>{topic.title}</h3>
                        <ul className="space-y-1 border-l-2 border-gray-200 ml-2">
                          {topic.subtopics.map((subtopic) => (
                            <li 
                              key={subtopic.page}
                              onClick={() => navigateToPage(subtopic.page)}
                              className={`pl-3 pr-2 py-2 rounded cursor-pointer transition-all text-sm flex items-center justify-between ${
                                currentPage === subtopic.page
                                  ? theme.navActive
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <span>{subtopic.title}</span>
                              {currentPage === subtopic.page && (
                                <span className="w-2 h-2 rounded-full bg-current"></span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-7 space-y-4">
              {currentPageContent ? (
                <Card className={`border-0 shadow-md ${theme.contentBg} max-w-5xl mx-auto`}>
                  <CardHeader className="border-b pb-4">
                    <CardTitle className="text-2xl">{subtopicTitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div 
                      style={{ fontSize: `${fontSize}px` }}
                      className="prose max-w-none"
                    >
                      <PageRendererComponent htmlContent={currentPageContent?.refinedContent || ""} />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className={`border-0 shadow-md ${theme.contentBg}`}>
                  <CardContent className="p-8">
                    <p className="text-center text-gray-500">
                      {pageContents.length > 0 
                        ? "Select a page from the navigation menu" 
                        : "Loading page content..."}
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {/* Navigation controls */}
              <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-md max-w-5xl mx-auto">
                <Button 
                  variant="outline" 
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="px-4 py-2 bg-gray-100 rounded-md">
                  Page {currentPage} of {content.totalPages}
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleNextPage}
                  disabled={currentPage >= content.totalPages}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Chatbot promptTitle={originalPrompt} level={level} />
          </div>
        )}
      </main>
    </div>
  );
}
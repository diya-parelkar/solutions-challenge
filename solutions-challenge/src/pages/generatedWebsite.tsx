import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import PageRendererComponent from './../services/pageRendererComponent';
import ContentFlowService from '../services/contentFlow';
import Chatbot from "../components/chatbot";
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  BookOpen, 
  Sparkles, 
  Lightbulb, 
  Zap,
  ArrowLeft,
  Menu,
  X,
  Sun,
  Moon,
  Type,
  Layout,
  Maximize2,
  Minimize2,
  Bookmark,
  BookmarkCheck,
  Share2,
  Download,
  Printer,
  ChevronDown,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const { theme, setTheme } = useTheme();

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
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const hasFetchedContent = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});

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

  // Toggle bookmark
  const toggleBookmark = (pageNumber: number) => {
    setBookmarks(prev => 
      prev.includes(pageNumber) 
        ? prev.filter(p => p !== pageNumber)
        : [...prev, pageNumber]
    );
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Toggle topic open/closed
  const toggleTopicOpen = (topicTitle: string) => {
    setOpenTopics(prev => ({
      ...prev,
      [topicTitle]: !prev[topicTitle]
    }));
  };

  return (
    <div 
      className="min-h-screen bg-white dark:bg-[#1a1a1a] transition-colors duration-300"
      style={{ 
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-[#1a1a1a]/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  {content?.title || originalPrompt}
                </h1>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/10">
                    {content?.level || getLevelDisplay(level)}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/5 text-blue-500 border-blue-500/10">
                    {content?.contentType || (contentType === "concise" ? "Quick Read" : "Detailed")}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setShowBookmarks(!showBookmarks)}
              >
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Typography
                  </h3>
                  <div className="space-y-2">
                    <label className="text-sm">Font Size</label>
                    <Slider
                      value={[fontSize]}
                      min={12}
                      max={24}
                      step={1}
                      onValueChange={([value]) => setFontSize(value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Line Height</label>
                    <Slider
                      value={[lineHeight * 100]}
                      min={100}
                      max={200}
                      step={5}
                      onValueChange={([value]) => setLineHeight(value / 100)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Layout className="h-4 w-4" />
                    Layout
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Navigation</span>
                    <Switch
                      checked={showNavigation}
                      onCheckedChange={setShowNavigation}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fullscreen Mode</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Export Options
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.print()}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {/* Implement PDF export */}}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <Progress value={progress} className="h-2" />
                <p className="text-center mt-4 font-medium text-gray-600 dark:text-gray-300">
                  {getLoadingStatusMessage()}
                </p>
                <div className="mt-8 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-5/6 animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg"
          >
            <p>{error}</p>
          </motion.div>
        )}

        {!loading && content && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Navigation Sidebar */}
            <AnimatePresence>
              {showNavigation && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="lg:col-span-3"
                >
                  <div className="sticky top-24">
                    <Card className="border-2 border-gray-200/80 dark:border-white/10 shadow-xl bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/30 to-gray-200/30 dark:from-white/5 dark:to-white/10 pointer-events-none"></div>
                      <CardContent className="p-0 relative">
                        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pb-4">
                          <div className="p-6 border-b border-gray-200/80 dark:border-white/10">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" />
                                  Learning Progress
                                </span>
                                <div className="font-serif text-lg text-gray-900 dark:text-gray-100 mt-1">
                                  {currentPage} of {content.totalPages}
                                </div>
                              </div>
                              <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(currentPage / content.totalPages) * 100}%` }}
                                  className="h-full bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-300 dark:to-gray-400 transition-all"
                                />
                              </div>
                            </div>
                          </div>
                          <nav className="p-6" aria-label="Course Contents">
                            <ul className="space-y-8">
                              {content.topics.map((topic) => (
                                <li key={topic.title}>
                                  <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-serif text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                      <Lightbulb className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                      {topic.title}
                                    </h3>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                                      onClick={() => toggleTopicOpen(topic.title)}
                                      aria-label={`${openTopics[topic.title] ? 'Collapse' : 'Expand'} ${topic.title}`}
                                    >
                                      {openTopics[topic.title] ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRightIcon className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  <AnimatePresence>
                                    {openTopics[topic.title] !== false && (
                                      <motion.ul
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 pl-4 border-l-2 border-emerald-500/20 dark:border-emerald-500/30"
                                      >
                                        {topic.subtopics.map((subtopic) => (
                                          <li key={subtopic.page}>
                                            <div className="relative">
                                              <button
                                                onClick={() => navigateToPage(subtopic.page)}
                                                className={`w-full text-left px-3 py-2 rounded-md text-base transition-all flex items-center justify-between group
                                                  ${currentPage === subtopic.page
                                                    ? "text-gray-900 dark:text-gray-100 font-medium bg-emerald-50 dark:bg-emerald-900/20"
                                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                                                  }`}
                                                aria-current={currentPage === subtopic.page ? "page" : undefined}
                                              >
                                                <span className="font-serif flex items-center gap-2">
                                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                                                  {subtopic.title}
                                                </span>
                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={`h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity
                                                          ${bookmarks.includes(subtopic.page) ? "text-emerald-500" : "text-gray-400"}`}
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          toggleBookmark(subtopic.page);
                                                        }}
                                                        aria-label={bookmarks.includes(subtopic.page) ? "Remove bookmark" : "Add bookmark"}
                                                      >
                                                        {bookmarks.includes(subtopic.page) ? (
                                                          <BookmarkCheck className="h-4 w-4" />
                                                        ) : (
                                                          <Bookmark className="h-4 w-4" />
                                                        )}
                                                      </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      {bookmarks.includes(subtopic.page) ? "Remove bookmark" : "Add bookmark"}
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>
                                              </button>
                                            </div>
                                          </li>
                                        ))}
                                      </motion.ul>
                                    )}
                                  </AnimatePresence>
                                </li>
                              ))}
                            </ul>
                          </nav>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className={`${showNavigation ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
              {currentPageContent ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-8 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-[#1a1a1a] rounded-lg"></div>
                      <div className="relative p-8">
                        <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-4">
                          {subtopicTitle}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            {content?.level || getLevelDisplay(level)}
                          </span>
                          <span className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            {content?.contentType || (contentType === "concise" ? "Quick Read" : "Detailed")}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="prose dark:prose-invert max-w-none 
                      prose-headings:font-serif prose-headings:text-gray-900 dark:prose-headings:text-white
                      prose-p:text-gray-700 dark:prose-p:text-white prose-p:leading-relaxed
                      prose-a:text-gray-900 dark:prose-a:text-white prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-900 dark:prose-strong:text-white
                      prose-code:text-gray-900 dark:prose-code:text-white prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                      prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700
                      prose-img:rounded-lg prose-img:shadow-md
                      prose-blockquote:border-l-2 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
                      prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50
                      prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                      prose-ul:marker:text-gray-500 dark:prose-ul:marker:text-gray-400
                      prose-ol:marker:text-gray-500 dark:prose-ol:marker:text-gray-400
                      prose-li:text-gray-700 dark:prose-li:text-white
                      prose-table:border prose-table:border-gray-200 dark:prose-table:border-gray-700
                      prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:text-gray-900 dark:prose-th:text-white
                      prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:text-gray-900 dark:prose-td:text-white">
                      <PageRendererComponent htmlContent={currentPageContent?.refinedContent || ""} />
                    </div>

                    {/* Navigation Controls */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                      <Button 
                        variant="ghost" 
                        onClick={handlePrevPage}
                        disabled={currentPage <= 1}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {currentPage} of {content.totalPages}
                        </span>
                        <div className="w-32 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentPage / content.totalPages) * 100}%` }}
                            className="h-full bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-300 dark:to-gray-400 transition-all"
                          />
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        onClick={handleNextPage}
                        disabled={currentPage >= content.totalPages}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
                        aria-label="Next page"
                      >
                        Next
                        <ChevronRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="max-w-3xl mx-auto text-center text-gray-500 dark:text-gray-400 py-12">
                  {pageContents.length > 0
                    ? "Select a topic from the navigation menu"
                    : "Loading content..."}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Chatbot */}
      <div className="fixed bottom-8 right-8 z-50">
        <Chatbot promptTitle={originalPrompt} level={level} />
      </div>
    </div>
  );
}
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
import { useThemeContext } from '../components/ThemeProvider';
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
  ChevronRight as ChevronRightIcon,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CacheService from '../services/cache';

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
  const { mode, colorblind, toggleMode, toggleColorblind, getClasses, getCombinedClasses } = useThemeContext();

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

  // Add loading state for navigation
  const [isNavigating, setIsNavigating] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Add state for tracking active topic
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  // Initialize content generation
  useEffect(() => {
    if (!hasFetchedContent.current) {
      hasFetchedContent.current = true;
      loadOrGenerateContent();
    }
  }, []);

  // Load cached content or generate new content
  const loadOrGenerateContent = async () => {
    try {
      const cache = new CacheService();
      const contentKey = `content-${originalPrompt}-${level}-${contentType}`;
      console.log(`🔍 Checking cache for content key: ${contentKey}`);
      const cachedContent = cache.get(contentKey);

      if (cachedContent) {
        console.log('✅ Found cached content, loading pages...');
        // Load cached content
        const parsedContent = JSON.parse(cachedContent);
        setContent(parsedContent);
        setProgress(100);
        setLoading(false);

        // Load cached page contents
        const allPages: PageContent[] = [];
        let loadedPages = 0;
        let missingPages = 0;

        // Process each topic and subtopic to ensure correct page loading
        for (const topic of parsedContent.topics) {
          for (const subtopic of topic.subtopics) {
            const pageKey = `page-${originalPrompt}-${level}-${contentType}-${subtopic.page}-${subtopic.title}`;
            console.log(`🔍 Checking cache for page key: ${pageKey}`);
            const cachedPage = cache.get(pageKey);
            
            if (cachedPage) {
              console.log(`✅ Found cached page for: ${subtopic.title} (Page ${subtopic.page})`);
              allPages.push(JSON.parse(cachedPage));
              loadedPages++;
            } else {
              console.log(`⚠️ Missing cached page for: ${subtopic.title} (Page ${subtopic.page})`);
              missingPages++;
            }
          }
        }

        console.log(`📊 Cache loading summary:
          - Total pages: ${parsedContent.totalPages}
          - Loaded pages: ${loadedPages}
          - Missing pages: ${missingPages}
        `);

        if (missingPages > 0) {
          console.log('⚠️ Some pages are missing from cache, regenerating content...');
          generateContent();
          return;
        }

        setPageContents(allPages);
      } else {
        console.log('⚠️ No cached content found, generating new content...');
        // Generate new content
        generateContent();
      }
    } catch (err) {
      console.error('❌ Error loading content:', err);
      setError(`Failed to load content: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

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

  // Enhanced navigation handlers with loading state
  const handleNextPage = async () => {
    if (isNavigating || !content || currentPage >= content.totalPages) return;
    
    setIsNavigating(true);
    try {
      const nextPage = currentPage + 1;
      console.log(`🔄 Attempting to navigate to next page: ${nextPage}`);
      const nextPageContent = pageContents.find(p => p.page === nextPage);
      if (nextPageContent) {
        console.log(`✅ Next page ${nextPage} content found, navigating...`);
        setCurrentPage(nextPage);
        window.scrollTo(0, 0);
      } else {
        console.log(`⚠️ Page ${nextPage} not yet loaded`);
      }
    } finally {
      setIsNavigating(false);
    }
  };

  const handlePrevPage = async () => {
    if (isNavigating || currentPage <= 1) return;
    
    setIsNavigating(true);
    try {
      const prevPage = currentPage - 1;
      console.log(`🔄 Attempting to navigate to previous page: ${prevPage}`);
      const prevPageContent = pageContents.find(p => p.page === prevPage);
      if (prevPageContent) {
        console.log(`✅ Previous page ${prevPage} content found, navigating...`);
        setCurrentPage(prevPage);
        window.scrollTo(0, 0);
      } else {
        console.log(`⚠️ Page ${prevPage} not yet loaded`);
      }
    } finally {
      setIsNavigating(false);
    }
  };

  const navigateToPage = async (pageNumber: number) => {
    if (isNavigating || !content || pageNumber < 1 || pageNumber > content.totalPages) return;
    
    setIsNavigating(true);
    try {
      console.log(`🔄 Attempting to navigate to page: ${pageNumber}`);
      const targetPageContent = pageContents.find(p => p.page === pageNumber);
      if (targetPageContent) {
        console.log(`✅ Page ${pageNumber} content found, navigating...`);
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
      } else {
        console.log(`⚠️ Page ${pageNumber} not yet loaded`);
      }
    } finally {
      setIsNavigating(false);
    }
  };

  // Update loading state when page contents change
  useEffect(() => {
    if (pageContents.length > 0) {
      console.log(`📄 Total pages loaded: ${pageContents.length}`);
      setIsPageLoading(false);
    }
  }, [pageContents]);

  // Update loading state when navigating
  useEffect(() => {
    console.log(`🔄 Navigation started to page: ${currentPage}`);
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      console.log(`✅ Navigation completed to page: ${currentPage}`);
      setIsPageLoading(false);
    }, 500); // Minimum loading time to prevent flicker

    return () => clearTimeout(timer);
  }, [currentPage]);

  // Add loading indicator to navigation buttons
  const renderNavigationButton = (direction: 'prev' | 'next', handler: () => void, disabled: boolean) => (
    <Button 
      variant="ghost" 
      onClick={handler}
      disabled={disabled || isNavigating || isPageLoading}
      className={getCombinedClasses('text.primary', 'px-3 py-2 rounded-md text-base transition-all flex items-center justify-between group font-medium disabled:opacity-50 disabled:cursor-not-allowed')}
      aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} page`}
    >
      <span className="font-serif flex items-center gap-2">
        {direction === 'prev' ? (
          <>
            <ChevronLeft className="h-5 w-5" />
            Previous
          </>
        ) : (
          <>
            Next
            <ChevronRight className="h-5 w-5" />
          </>
        )}
      </span>
    </Button>
  );

  // Update current page if current page content is not loaded
  useEffect(() => {
    if (!currentPageContent && pageContents.length > 0) {
      // Find the first available page that's loaded
      const firstLoadedPage = pageContents[0].page;
      setCurrentPage(firstLoadedPage);
    }
  }, [pageContents, currentPageContent]);

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

  // Update active topic when current page changes
  useEffect(() => {
    if (content) {
      const currentTopic = content.topics.find(topic => 
        topic.subtopics.some(subtopic => subtopic.page === currentPage)
      );
      if (currentTopic) {
        console.log(`📚 Current topic updated: ${currentTopic.title}`);
        setActiveTopic(currentTopic.title);
        // Ensure the topic is open in the navigation
        setOpenTopics(prev => ({
          ...prev,
          [currentTopic.title]: true
        }));
      }
    }
  }, [currentPage, content]);

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${getClasses('background.primary')}`}
      style={{ 
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
      }}
    >
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-lg ${getClasses('background.header')} border-b ${getClasses('border.primary')}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className={getCombinedClasses('text.secondary', 'hover:bg-gray-100 dark:hover:bg-gray-800')}
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className={getCombinedClasses('text.primary', 'text-2xl font-bold')}>
                  {content?.title || originalPrompt}
                </div>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className={getCombinedClasses('badge.emerald', '')}>
                    {content?.level || getLevelDisplay(level)}
                  </Badge>
                  <Badge variant="outline" className={getCombinedClasses('badge.blue', '')}>
                    {content?.contentType || (contentType === "concise" ? "Quick Read" : "Detailed")}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={getCombinedClasses('text.secondary', 'hover:bg-gray-100 dark:hover:bg-gray-800')}
                onClick={() => setShowBookmarks(!showBookmarks)}
              >
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={getCombinedClasses('text.secondary', 'hover:bg-gray-100 dark:hover:bg-gray-800')}
                onClick={toggleMode}
              >
                {mode === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={getCombinedClasses('text.secondary', 'hover:bg-gray-100 dark:hover:bg-gray-800')}
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
            className={`fixed top-[72px] left-0 right-0 z-50 ${getClasses('background.header')} backdrop-blur-lg border-b ${getClasses('border.primary')} shadow-lg`}
            style={{ fontSize: '14px' }}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className={`font-medium flex items-center gap-2 ${getClasses('text.primary')}`}>
                    <Type className="h-4 w-4" />
                    Typography
                  </h3>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFontSize(prev => Math.max(12, prev - 1))}
                      className="h-8 w-8"
                    >
                      <span className="text-lg">-</span>
                    </Button>
                    <span className={`text-sm font-medium ${getClasses('text.secondary')}`}>{fontSize}px</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFontSize(prev => Math.min(24, prev + 1))}
                      className="h-8 w-8"
                    >
                      <span className="text-lg">+</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className={`font-medium flex items-center gap-2 ${getClasses('text.primary')}`}>
                    <Eye className="h-4 w-4" />
                    Accessibility
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${getClasses('text.secondary')}`}>Colorblind Mode</span>
                    <Button
                      variant={colorblind ? "default" : "outline"}
                      size="sm"
                      onClick={toggleColorblind}
                      className={`${
                        colorblind
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {colorblind ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`container mx-auto px-4 py-6 transition-all duration-300 ${showSettings ? 'mt-[120px]' : ''}`}>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <Card className={`border-0 shadow-lg ${getClasses('background.card')} backdrop-blur-sm`}>
              <CardContent className="p-8">
                <Progress value={progress} className="h-2" />
                <p className={`text-center mt-4 font-medium ${getClasses('text.secondary')}`}>
                  {getLoadingStatusMessage()}
                </p>
                <div className="mt-8 space-y-4">
                  <div className={`h-4 ${getClasses('states.loading.skeleton')} rounded-full w-3/4 animate-pulse`}></div>
                  <div className="space-y-2">
                    <div className={`h-4 ${getClasses('states.loading.skeleton')} rounded-full animate-pulse`}></div>
                    <div className={`h-4 ${getClasses('states.loading.skeleton')} rounded-full animate-pulse`}></div>
                    <div className={`h-4 ${getClasses('states.loading.skeleton')} rounded-full w-5/6 animate-pulse`}></div>
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
                              {content.topics.map((topic) => {
                                console.log(`📚 Rendering topic: ${topic.title} with ${topic.subtopics.length} subtopics`);
                                return (
                                  <li key={topic.title}>
                                    <div className="flex items-center justify-between mb-3">
                                      <h3 className={`font-serif text-lg flex items-center gap-2 ${
                                        activeTopic === topic.title 
                                          ? 'text-gray-900 dark:text-gray-100' 
                                          : 'text-gray-700 dark:text-gray-300'
                                      }`}>
                                        <Lightbulb className={`h-4 w-4 ${
                                          activeTopic === topic.title 
                                            ? 'text-emerald-500' 
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`} />
                                        {topic.title}
                                      </h3>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-6 w-6 ${
                                          activeTopic === topic.title 
                                            ? 'text-emerald-500' 
                                            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                                        }`}
                                        onClick={() => {
                                          console.log(`📑 Toggling topic: ${topic.title}`);
                                          toggleTopicOpen(topic.title);
                                        }}
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
                                          {topic.subtopics.map((subtopic) => {
                                            // Ensure each subtopic has its own unique page number
                                            const pageNumber = subtopic.page;
                                            console.log(`📄 Subtopic "${subtopic.title}" mapped to page ${pageNumber}`);
                                            
                                            const isPageLoaded = pageContents.some(p => p.page === pageNumber);
                                            const isActive = currentPage === pageNumber;
                                            
                                            console.log(`🔍 Subtopic "${subtopic.title}" status:
                                              - Page number: ${pageNumber}
                                              - Is loaded: ${isPageLoaded}
                                              - Is active: ${isActive}
                                              - Available pages: ${pageContents.map(p => p.page).join(', ')}
                                            `);

                                            return (
                                              <li key={`${topic.title}-${pageNumber}-${subtopic.title}`}>
                                                <div className="relative">
                                                  <button
                                                    onClick={() => {
                                                      console.log(`🔍 Clicked subtopic: ${subtopic.title} (Page ${pageNumber})`);
                                                      console.log(`📄 Page loaded: ${isPageLoaded}`);
                                                      console.log(`🎯 Currently active: ${isActive}`);
                                                      if (isPageLoaded) {
                                                        navigateToPage(pageNumber);
                                                      } else {
                                                        console.log(`⚠️ Cannot navigate - page ${pageNumber} not loaded`);
                                                      }
                                                    }}
                                                    className={`w-full text-left px-3 py-2 rounded-md text-base transition-all flex items-center justify-between group
                                                      ${isActive
                                                        ? "text-gray-900 dark:text-gray-100 font-medium bg-emerald-50 dark:bg-emerald-900/20"
                                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                                                      }
                                                      ${!isPageLoaded ? "opacity-50 cursor-not-allowed" : ""}`}
                                                    aria-current={isActive ? "page" : undefined}
                                                    disabled={!isPageLoaded}
                                                  >
                                                    <span className="font-serif flex items-center gap-2">
                                                      <span className={`w-1.5 h-1.5 rounded-full ${
                                                        isActive 
                                                          ? 'bg-emerald-500' 
                                                          : 'bg-emerald-500/50'
                                                      }`}></span>
                                                      {subtopic.title}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                      <Tooltip>
                                                        <TooltipTrigger asChild>
                                                          <div
                                                            className={`h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer
                                                              ${bookmarks.includes(pageNumber) ? "text-emerald-500" : "text-gray-400"}`}
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              console.log(`🔖 Toggling bookmark for page ${pageNumber}`);
                                                              toggleBookmark(pageNumber);
                                                            }}
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                              if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                console.log(`🔖 Toggling bookmark for page ${pageNumber} (keyboard)`);
                                                                toggleBookmark(pageNumber);
                                                              }
                                                            }}
                                                            aria-label={bookmarks.includes(pageNumber) ? "Remove bookmark" : "Add bookmark"}
                                                          >
                                                            {bookmarks.includes(pageNumber) ? (
                                                              <BookmarkCheck className="h-4 w-4" />
                                                            ) : (
                                                              <Bookmark className="h-4 w-4" />
                                                            )}
                                                          </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                          {bookmarks.includes(pageNumber) ? "Remove bookmark" : "Add bookmark"}
                                                        </TooltipContent>
                                                      </Tooltip>
                                                    </div>
                                                  </button>
                                                </div>
                                              </li>
                                            );
                                          })}
                                        </motion.ul>
                                      )}
                                    </AnimatePresence>
                                  </li>
                                );
                              })}
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
                  <div className="max-w-7xl mx-auto">
                    <div className="mb-8 relative">
                      <div className="border-2 border-gray-200/80 dark:border-white/10 shadow-xl bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm overflow-hidden relative rounded-lg">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100/30 to-gray-200/30 dark:from-white/5 dark:to-white/10 pointer-events-none"></div>
                        <div className="relative p-8">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                              {content?.topics.find(topic => 
                                topic.subtopics.some(subtopic => subtopic.page === currentPage)
                              )?.title || 'Current Topic'}
                            </span>
                          </div>
                          <div className={getCombinedClasses('text.primary', 'font-serif text-5xl flex items-center gap-2')}>
                            {subtopicTitle}
                          </div>
                          <div className={getCombinedClasses('text.secondary', 'text-sm font-medium flex items-center gap-4 mt-4')}>
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
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mr-32">
                        <div className={getCombinedClasses('text.primary', 'prose dark:prose-invert max-w-none text-lg font-serif')}
                          style={{ 
                            fontSize: `${fontSize}px`,
                            lineHeight: lineHeight 
                          }}>
                          <PageRendererComponent htmlContent={currentPageContent?.refinedContent || ""} />
                        </div>
                      </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className={getCombinedClasses('border.primary', 'mt-12 pt-8 border-t flex items-center justify-between')}>
                      {renderNavigationButton('prev', handlePrevPage, currentPage <= 1 || !pageContents.some(p => p.page === currentPage - 1))}
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {currentPage} of {content.totalPages}
                        </span>
                        <div className="w-32 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentPage / content.totalPages) * 100}%` }}
                            className={`h-full bg-gradient-to-r ${
                              colorblind
                                ? 'from-blue-400 to-blue-500 dark:from-blue-300 dark:to-blue-400'
                                : 'from-emerald-400 to-emerald-500 dark:from-emerald-300 dark:to-emerald-400'
                            } transition-all`}
                          />
                        </div>
                      </div>
                      {renderNavigationButton('next', handleNextPage, currentPage >= content.totalPages || !pageContents.some(p => p.page === currentPage + 1))}
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
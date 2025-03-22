import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PromptRefinement from "../services/promptRefinement";
import OutlineGenerator from "../services/outlineGenerator";
import ContentGenerator from "../services/contentGenerator";
import PageRenderer from "../services/pageRenderer";

interface PageContent {
  page: number;
  content: string;
}

interface Topic {
  title: string;
  subtopics: {
    title: string;
    page: number;
    summary: string;
    requires: string[];
  }[];
}

interface Content {
  title: string;
  level: string;
  contentType: string;
  topics: Topic[];
  totalPages: number;
}

export default function GeneratedWebsite() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const originalPrompt: string = queryParams.get("prompt") || "Default Topic";
  const level: string = queryParams.get("level") || "school-kid";
  const contentType: string = queryParams.get("contentType") || "concise";

  const [loading, setLoading] = useState<boolean>(true);
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0); // ✅ Track current page

  useEffect(() => {
    refinePrompt();
  }, []);

  useEffect(() => {
    if (content) {
      generateDetailedContent();
    }
  }, [content]);

  const refinePrompt = async () => {
    try {
      const refined = await PromptRefinement.refinePrompt(originalPrompt, level, contentType);
      setRefinedPrompt(refined);
      generateOutline(refined);
    } catch (err) {
      setError("❌ Failed to refine prompt: " + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  };

  const generateOutline = async (refined: string) => {
    setLoading(true);
    try {
      const outlineData = await OutlineGenerator.generateOutline(refined, level, contentType);
      if (!outlineData || !outlineData.topics) throw new Error("Outline data is null or undefined.");

      setContent({
        title: originalPrompt,
        level: getLevelDisplay(level),
        contentType: contentType === "concise" ? "Quick Read" : "Detailed Explanation",
        topics: outlineData.topics,
        totalPages: outlineData.totalPages ?? 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const generateDetailedContent = async () => {
    if (!content) return;

    for (const topic of content.topics) {
      for (const subtopic of topic.subtopics) {
        const rawContent = await ContentGenerator.generatePageContent(
          refinedPrompt!,
          level,
          contentType,
          subtopic.title,
          subtopic.summary,
          subtopic.page,
          subtopic.requires
        );
  
        const styledContent = PageRenderer.applyStyles(rawContent); // ✅ Apply styles
  
        setPageContents((prev) => [...prev, { page: subtopic.page, content: styledContent }]);
      }
    }
  };

  const getLevelDisplay = (levelCode: string): string => {
    const levels: Record<string, string> = {
      "explain-like-im-5": "Explain Like I'm 5",
      "school-kid": "School Kid",
      "high-school": "High School",
      "graduate-student": "Graduate Student",
      "expert": "Expert",
    };
    return levels[levelCode] || levelCode;
  };

  // ✅ Get the current page content
  const currentPageContent = pageContents.find((p) => p.page === currentPage);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Generating Your Learning Website</h2>
        <Progress value={65} className="w-full mb-4" />
        <p className="text-sm text-muted-foreground">This may take a moment</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/")}>Back to Home</Button>
          <Badge variant="outline">{content?.level}</Badge>
          <Badge variant="outline">{content?.contentType}</Badge>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">
        {currentPage === 0 ? (
          // ✅ Index Page
          <Card className="p-6">
            <CardContent>
              <h2 className="text-3xl font-bold mb-4">{content?.title}</h2>
              <p className="text-lg mb-6">Explore topics covered in this module:</p>
              {content?.topics.map((topic, i) => (
                <div key={i} className="mb-4">
                  <h3 className="text-xl font-semibold">{topic.title}</h3>
                  <ul className="list-disc pl-6">
                    {topic.subtopics.map((sub, j) => (
                      <li key={j}>
                        <Button variant="link" onClick={() => setCurrentPage(sub.page)}>📖 {sub.title}</Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          // ✅ Individual Page Content
          <Card className="p-6">
            <CardContent>
              <h3 className="text-2xl font-bold mb-4">📖 Page {currentPage}</h3>
              <div
                className="prose max-w-none bg-gray-100 p-4 rounded-lg shadow-sm"
                dangerouslySetInnerHTML={{
                  __html: currentPageContent?.content || "<p>Loading content...</p>",
                }}
              />
            </CardContent>

            {/* ✅ Navigation Controls */}
            <div className="flex justify-between mt-6">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                ← Previous
              </Button>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(content?.totalPages || 0, prev + 1))}
                disabled={currentPage === content?.totalPages}
              >
                Next →
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

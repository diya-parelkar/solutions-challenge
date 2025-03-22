import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from "@/components/ui/card";
import PromptRefinement from "../services/promptRefinement";

interface Section {
  id: number;
  content: string;
  hasQuiz: boolean;
  hasSimulation: boolean;
}

interface Content {
  title: string;
  level: string;
  contentType: string;
  sections: Section[];
  progress: number;
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

  useEffect(() => {
    refinePrompt();
  }, []);

  const refinePrompt = async () => {
    try {
      const refined = await PromptRefinement.refinePrompt(originalPrompt, level, contentType);
      setRefinedPrompt(refined);
      generateContent(refined);
    } catch (err) {
      setError("❌ Failed to refine prompt: " + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  };

  const generateContent = async (refined: string) => {
    setLoading(true);
    setTimeout(() => {
      setContent({
        title: originalPrompt, 
        level: getLevelDisplay(level),
        contentType: contentType === "concise" ? "Quick Read" : "Detailed Explanation",
        sections: generateMockSections(refined, contentType),
        progress: 0,
      });
      setLoading(false);
    }, 2000);
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

  const generateMockSections = (refinedPrompt: string, contentType: string): Section[] => {
    const isDetailed = contentType === "detailed";
    return Array.from({ length: isDetailed ? 5 : 3 }, (_, i) => ({
      id: i + 1,
      content: isDetailed
        ? `Detailed explanation for topic: "${content?.title}". This covers in-depth concepts and real-world applications.`
        : `Concise summary for topic: "${content?.title}". Key points and essential takeaways.`,
      hasQuiz: i % 2 === 0,
      hasSimulation: i % 3 === 0,
    }));
  };

  const handleProgressUpdate = (newProgress: number) => {
    if (content) {
      setContent((prev) => prev && { ...prev, progress: newProgress });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Generating Your Learning Website</h2>
        <p className="text-muted-foreground mb-6">Refining "{originalPrompt}" into an educational topic...</p>
        <Progress value={65} className="w-full mb-4" />
        <p className="text-sm text-muted-foreground">This may take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => navigate("/")}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <span className="ml-2">Back to Home</span>
          </Button>
          <Badge variant="outline">{content?.level}</Badge>
          <Badge variant="outline">{content?.contentType}</Badge>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">
        {refinedPrompt && (
          <Card className="w-full max-w-xl mb-6">
            <CardHeader>
              <CardDescription>We've refined your topic to create the best educational content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{refinedPrompt}</p>
            </CardContent>
          </Card>
        )}

        {content?.sections.map((section) => (
          <div key={section.id} id={`section-${section.id}`} className="mt-8">
            <Card>
              <CardContent>
                <p>{section.content}</p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2">
                  {section.hasQuiz && <Badge>Quiz</Badge>}
                  {section.hasSimulation && <Badge>Simulation</Badge>}
                </div>
                <Button className="ml-auto" onClick={() => handleProgressUpdate(Math.min(100, content.progress + 10))}>
                  Mark as Read
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </main>
    </div>
  );
}

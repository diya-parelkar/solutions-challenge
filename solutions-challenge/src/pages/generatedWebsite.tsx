import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from "@/components/ui/card";
import PromptRefinement from "../services/promptRefinement";
import OutlineGenerator from "../services/outlineGenerator";

interface Section {
  id: number;
  content: string;
  hasQuiz: boolean;
  hasSimulation: boolean;
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

  useEffect(() => {
    if (content) {
      console.log("Content state updated:", content);
    }
  }, [content]);

  useEffect(() => {
    refinePrompt();
  }, []);

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
      console.log("🔹 Generating outline for:", refined);
  
      const outlineData = await OutlineGenerator.generateOutline(refined, level, contentType);
      console.log("✅ Outline Data:", outlineData);
  
      if (!outlineData || !outlineData.topics) throw new Error("Outline data is null or undefined.");
  
      setContent({
        title: originalPrompt,
        level: getLevelDisplay(level),
        contentType: contentType === "concise" ? "Quick Read" : "Detailed Explanation",
        topics: outlineData.topics,
        totalPages: outlineData.totalPages ?? 0, // Ensure totalPages is set
      });
  
    } catch (err) {
      console.error("❌ Failed to generate outline:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false); // Always stop loading, even on error
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
        <p className="text-muted-foreground mb-6">{error || "Unknown error occurred."}</p>
        <Button onClick={() => navigate("/")}>Return Home</Button>
      </div>
    );
  }  

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/")}>Back to Home</Button>
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

        {content?.topics.map((topic, i) => (
          <Card key={i} className="mb-6">
            <CardContent>
              <p className="font-semibold">{topic.title}</p>
              {topic.subtopics.map((sub, j) => (
                <p key={j}>📖 Page {sub.page}: {sub.summary} {sub.requires.length > 0 && `(${sub.requires.join(", ")})`}</p>
              ))}
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}

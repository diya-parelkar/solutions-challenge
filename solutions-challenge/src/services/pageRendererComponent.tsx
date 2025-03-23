import React, { useEffect, useRef } from "react";
import PageRenderer from "./pageRenderer"; // Ensure correct import

const PageRendererComponent: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
  const renderedHtml = PageRenderer.renderPage(htmlContent);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Checking for KaTeX...");

      const loadKatex = async () => {
        try {
          // Check if KaTeX is already loaded
          if (!(window as any).katex) {
            console.log("📥 Loading KaTeX...");
            
            // Create a promise to load KaTeX
            const loadScript = (src: string): Promise<void> => {
              return new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
                document.head.appendChild(script);
              });
            };
            
            // Load CSS
            const katexCSS = document.createElement("link");
            katexCSS.rel = "stylesheet";
            katexCSS.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
            document.head.appendChild(katexCSS);
            
            // Load scripts in sequence
            await loadScript("https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js");
            await loadScript("https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js");
            
            console.log("✅ KaTeX loaded!");
          } else {
            console.log("✅ KaTeX already loaded!");
          }
          
          // Render math expressions
          renderMath();
        } catch (error) {
          console.error("❌ Error loading KaTeX:", error);
        }
      };

      const renderMath = () => {
        if ((window as any).renderMathInElement && contentRef.current) {
          console.log("✅ Rendering Math...");
          
          // Wait a moment for the DOM to settle
          setTimeout(() => {
            try {
              (window as any).renderMathInElement(contentRef.current, {
                delimiters: [
                  { left: "\\(", right: "\\)", display: false },
                  { left: "\\[", right: "\\]", display: true },
                  { left: "$", right: "$", display: false },
                  { left: "$$", right: "$$", display: true },
                ],
                throwOnError: false,
                trust: true,
                strict: false
              });
              console.log("✅ Math rendered successfully!");
            } catch (err) {
              console.error("❌ Error rendering math:", err);
            }
          }, 100);
        } else {
          console.error("❌ KaTeX auto-render script not found or content ref not available.");
        }
      };

      loadKatex();
    }
  }, [htmlContent]);

  return <div ref={contentRef} dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
};

export default PageRendererComponent;
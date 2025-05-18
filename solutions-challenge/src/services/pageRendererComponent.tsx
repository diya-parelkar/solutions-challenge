import React, { useEffect, useRef } from "react";
import PageRenderer from "./pageRenderer";
import { useTheme } from "next-themes";

const PageRendererComponent: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
  const { theme } = useTheme();
  const renderedHtml = PageRenderer.renderPage(htmlContent);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.setAttribute('data-theme', theme || 'light');
      // Force a re-render of math and code highlighting
      if ((window as any).renderMathInElement) {
        (window as any).renderMathInElement(contentRef.current);
      }
      if ((window as any).hljs) {
        contentRef.current.querySelectorAll("pre code").forEach((block) => {
          (window as any).hljs.highlightElement(block as HTMLElement);
        });
      }
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Checking for KaTeX and Highlight.js...");

      const loadScript = (src: string): Promise<void> =>
        new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
          document.head.appendChild(script);
        });

      const loadCSS = (href: string) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      };

      const loadKaTeX = async () => {
        if (!(window as any).katex) {
          console.log("📥 Loading KaTeX...");
          loadCSS("https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css");
          await loadScript("https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js");
          await loadScript("https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js");
          console.log("✅ KaTeX loaded!");
        } else {
          console.log("✅ KaTeX already loaded!");
        }
      };

      const loadHighlightJS = async () => {
        if (!(window as any).hljs) {
          console.log("📥 Loading Highlight.js...");
          loadCSS("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css");
          loadCSS("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css");
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js");

          const languages = [
            "python", "javascript", "typescript", "java", "cpp", "c", "html", "css",
            "sql", "bash", "shell", "json", "xml", "go", "ruby", "php"
          ];
          for (const lang of languages) {
            await loadScript(`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/${lang}.min.js`);
          }

          console.log("✅ Highlight.js loaded!");
        } else {
          console.log("✅ Highlight.js already loaded!");
        }
      };

      const renderMath = () => {
        if ((window as any).renderMathInElement && contentRef.current) {
          console.log("✅ Rendering Math...");
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
        }
      };

      const highlightCode = () => {
        console.log("✅ Attempting to highlight code...");
        setTimeout(() => {
          if ((window as any).hljs && contentRef.current) {
            console.log("✅ Highlighting code...");
            const stylesheet = theme === 'dark' 
              ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css'
              : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css';
            
            const existingStylesheet = document.getElementById('hljs-theme');
            if (existingStylesheet) {
              existingStylesheet.remove();
            }

            const link = document.createElement('link');
            link.id = 'hljs-theme';
            link.rel = 'stylesheet';
            link.href = stylesheet;
            document.head.appendChild(link);

            contentRef.current.querySelectorAll("pre code").forEach((block) => {
              (window as any).hljs.highlightElement(block as HTMLElement);
            });
            console.log("✅ Code highlighted!");
          } else {
            console.error("❌ Highlight.js not loaded.");
          }
        }, 300);
      };

      const loadLibraries = async () => {
        try {
          await loadKaTeX();
          await loadHighlightJS();
          renderMath();
          highlightCode();
        } catch (error) {
          console.error("❌ Error loading libraries:", error);
        }
      };

      loadLibraries();
    }
  }, [htmlContent, theme]);

  return (
    <div className="relative">
      <div 
        ref={contentRef} 
        dangerouslySetInnerHTML={{ __html: renderedHtml }} 
        className="relative"
        data-theme={theme}
      />
    </div>
  );
};

export default PageRendererComponent;
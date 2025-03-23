import React, { useEffect } from "react";
import PageRenderer from "./pageRenderer"; // Ensure correct import

const PageRendererComponent: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
  const renderedHtml = PageRenderer.renderPage(htmlContent);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Checking for KaTeX...");

      const loadKatex = () => {
        if (!(window as any).katex) {
          console.log("📥 Loading KaTeX...");

          // Load KaTeX CSS (Removed integrity)
          const katexCSS = document.createElement("link");
          katexCSS.rel = "stylesheet";
          katexCSS.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
          document.head.appendChild(katexCSS);

          // Load KaTeX Core
          const katexScript = document.createElement("script");
          katexScript.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
          katexScript.async = true;
          document.head.appendChild(katexScript);

          // Load KaTeX Auto-Render
          const autoRenderScript = document.createElement("script");
          autoRenderScript.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js";
          autoRenderScript.async = true;
          autoRenderScript.onload = () => {
            console.log("✅ KaTeX Auto-render Loaded!");
            renderMath();
          };
          document.head.appendChild(autoRenderScript);

          katexScript.onload = () => {
            console.log("✅ KaTeX Loaded!");
          };
        } else {
          console.log("✅ KaTeX Already Loaded!");
          renderMath();
        }
      };

      const renderMath = () => {
        if ((window as any).renderMathInElement) {
          console.log("✅ Rendering Math...");
          (window as any).renderMathInElement(document.body, {
            delimiters: [
              { left: "\\(", right: "\\)", display: false },
              { left: "\\[", right: "\\]", display: true },
              { left: "$", right: "$", display: false },
              { left: "$$", right: "$$", display: true },
            ],
            throwOnError: false,
          });
        } else {
          console.error("❌ KaTeX auto-render function not found.");
        }
      };

      loadKatex();
    }
  }, [htmlContent]);

  return <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
};

export default PageRendererComponent;

import React, { useEffect, useRef } from "react";
import PageRenderer from "./pageRenderer";

const PageRendererComponent: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
  const renderedHtml = PageRenderer.renderPage(htmlContent);
  const contentRef = useRef<HTMLDivElement>(null);

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

      const loadCSS = (href: string, id: string) => {
        let existingLink = document.getElementById(id);
        if (!existingLink) {
          const link = document.createElement("link");
          link.id = id;
          link.rel = "stylesheet";
          link.href = href;
          document.head.appendChild(link);
        }
      };

      const loadHighlightJS = async () => {
        if (!(window as any).hljs) {
          console.log("📥 Loading Highlight.js...");
          loadCSS("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css", "hljs-theme");
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js");

          const languages = ["python", "javascript", "typescript", "java", "cpp", "c", "html", "css", "sql", "bash", "shell", "json", "xml", "go", "ruby", "php"];
          for (const lang of languages) {
            await loadScript(`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/${lang}.min.js`);
          }

          console.log("✅ Highlight.js loaded!");
        } else {
          console.log("✅ Highlight.js already loaded!");
        }
      };

      const highlightCode = () => {
        console.log("✅ Attempting to highlight code...");
        setTimeout(() => {
          if ((window as any).hljs && contentRef.current) {
            contentRef.current.querySelectorAll("pre code").forEach((block) => {
              (window as any).hljs.highlightElement(block as HTMLElement);
            });
            addCodeBlockThemeToggle();
            console.log("✅ Code highlighted!");
          } else {
            console.error("❌ Highlight.js not loaded.");
          }
        }, 300);
      };

      const addCodeBlockThemeToggle = () => {
        if (contentRef.current) {
          const preBlocks = contentRef.current.querySelectorAll("pre");

          preBlocks.forEach((preBlock) => {
            if (preBlock.querySelector(".theme-toggle-button")) return;

            // Wrap pre block in a container
            const container = document.createElement("div");
            container.className = "relative";

            // Create theme toggle button
            const themeToggleButton = document.createElement("button");
            themeToggleButton.className = "theme-toggle-button absolute top-2 right-2 z-10 p-1 rounded text-xs bg-gray-200 dark:bg-gray-700";
            themeToggleButton.textContent = "Dark Mode";

            // Set default theme
            preBlock.classList.add("hljs-light");

            // Toggle theme on click
            themeToggleButton.addEventListener("click", () => {
              const themeLink = document.getElementById("hljs-theme") as HTMLLinkElement;

              if (preBlock.classList.contains("hljs-light")) {
                preBlock.classList.remove("hljs-light");
                preBlock.classList.add("hljs-dark");
                themeToggleButton.textContent = "Light Mode";
                themeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css";
              } else {
                preBlock.classList.remove("hljs-dark");
                preBlock.classList.add("hljs-light");
                themeToggleButton.textContent = "Dark Mode";
                themeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css";
              }

              // Re-highlight the code block
              if ((window as any).hljs) {
                const codeBlock = preBlock.querySelector("code");
                if (codeBlock) {
                  (window as any).hljs.highlightElement(codeBlock);
                }
              }
            });

            // Insert the toggle button above the code block
            container.appendChild(themeToggleButton);
            preBlock.parentNode?.insertBefore(container, preBlock);
            container.appendChild(preBlock);
          });
        }
      };

      const loadLibraries = async () => {
        try {
          await loadHighlightJS();
          highlightCode();
        } catch (error) {
          console.error("❌ Error loading libraries:", error);
        }
      };

      loadLibraries();
    }
  }, [htmlContent]);

  return (
    <div>
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      <style>{`
        /* Light Theme */
        .hljs-light {
          background: #f5f5f5 !important;
          color: #333 !important;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          font-size: 14px;
          border: 1px solid #ddd;
        }

        /* Dark Theme */
        .hljs-dark {
          background: #282c34 !important;
          color: #abb2bf !important;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          font-size: 14px;
          border: 1px solid #444;
        }

        /* Button Styling */
        .theme-toggle-button {
          position: absolute;
          top: 5px;
          right: 10px;
          background: rgb(101, 99, 99);
          color: #FFFFFF;
          border: none;
          font-size: 14px;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 4px;
        }

        .theme-toggle-button:hover {
          background:rgb(83, 73, 73);
        }
      `}</style>
    </div>
  );
};

export default PageRendererComponent;

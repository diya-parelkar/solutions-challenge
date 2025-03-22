class PageRenderer {
    applyStyles(htmlContent: string): string {
      // ✅ Remove unnecessary markdown-style backticks
      let cleanedHtml = htmlContent.replace(/```html|```/g, "").trim();
  
      // ✅ Convert inline and block math to MathJax format
      cleanedHtml = cleanedHtml
        .replace(/\$\$(.*?)\$\$/g, '\\[ $1 \\]') // Block equations
        .replace(/\$(.*?)\$/g, '\\( $1 \\)'); // Inline equations
  
      const styledContent = `
        <style>
          :root {
            --color-primary: var(--primary);
            --color-text: var(--foreground);
            --color-bg: var(--background);
            --color-border: var(--border);
            --color-muted: var(--muted);
            --color-accent: var(--accent);
            --color-secondary: var(--secondary);
          }
  
          body {
            font-family: "Inter", sans-serif;
            line-height: 1.75;
            padding: 24px;
            background-color: var(--color-bg);
            color: var(--color-text);
          }
  
          h1, h2, h3 {
            font-weight: 600;
            color: var(--color-primary);
          }
  
          h1 {
            font-size: 1.875rem;
            margin-bottom: 16px;
          }
  
          h2 {
            font-size: 1.5rem;
            margin-bottom: 12px;
            border-bottom: 2px solid var(--color-border);
            padding-bottom: 6px;
          }
  
          h3 {
            font-size: 1.25rem;
            margin-bottom: 8px;
          }
  
          /* ✅ Improved paragraph color */
          p {
            font-size: 1rem;
            margin-bottom: 16px;
            color: var(--color-text);
          }
  
          ul {
            padding-left: 24px;
            margin-bottom: 16px;
          }
  
          ul li {
            font-size: 1rem;
            margin-bottom: 6px;
            list-style: disc;
          }
  
          strong {
            color: var(--color-text);
            font-weight: 700;
          }
  
          .highlight {
            background-color: var(--color-accent);
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: 500;
          }
  
          .box {
            background: var(--color-secondary);
            padding: 16px;
            border-left: 4px solid var(--color-primary);
            border-radius: 6px;
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.05);
            margin: 16px 0;
          }
  
          .important {
            color: var(--destructive);
            font-weight: bold;
            font-size: 1.125rem;
          }
  
          .content {
            max-width: 800px;
            margin: auto;
            padding: 16px;
            background: var(--card);
            border-radius: 8px;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
          }
  
          /* ✅ MathJax Styling */
          .math-inline {
            font-size: 1rem;
            font-weight: 500;
            color: var(--color-text);
          }
  
          .math-block {
            display: block;
            text-align: center;
            font-size: 1.2rem;
            margin: 12px 0;
            color: var(--color-text);
          }
        </style>
  
        <!-- ✅ Load MathJax for math rendering -->
        <script async src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
        <script async id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
  
        <div class="content">
          ${cleanedHtml}
        </div>
      `;
  
      return styledContent;
    }
  }
  
  export default new PageRenderer();
  
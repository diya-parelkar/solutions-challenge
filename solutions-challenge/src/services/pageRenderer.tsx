class PageRenderer {
    renderPage(htmlContent: string): string {
        // Step 1: Remove Markdown-style triple backticks if present
        htmlContent = htmlContent.replace(/^```html\s*|```$/g, '').trim();

        // Step 2: Extract the <body> content if it exists
        const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        let cleanedHtml = bodyMatch ? bodyMatch[1].trim() : htmlContent;

        // Step 3: Remove <head> section and any redundant script tags for KaTeX
        cleanedHtml = cleanedHtml.replace(/<head>[\s\S]*?<\/head>/i, '');
        cleanedHtml = cleanedHtml.replace(/<script[^>]*src=['"]https:\/\/cdn.jsdelivr.net\/npm\/katex[^"]*['"][^>]*><\/script>/g, '');

        return this.applyStyles(cleanedHtml);
    }

    applyStyles(htmlContent: string): string {
        const styledContent = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rendered Page</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css" integrity="sha384-zh0CIslj+VczCZtlzBcjt5ppRcsAmDnRem7ESsYwWwg3m/OaJ2l4x7YBZl9Kxxib" crossorigin="anonymous">

            <!-- The loading of KaTeX is deferred to speed up page rendering -->
            <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js" integrity="sha384-Rma6DA2IPUwhNxmrB/7S3Tno0YY7sFu9WSYMCuulLhIqYSGZ2gKCJWIqhBWqMQfh" crossorigin="anonymous"></script>

            <!-- To automatically render math in text elements, include the auto-render extension: -->
            <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/contrib/auto-render.min.js" integrity="sha384-hCXGrW6PitJEwbkoStFjeJxv+fSOOQKOPbJxSfM6G5sWZjAyWhXiTIIAmQqnlLlh" crossorigin="anonymous"
                onload="renderMathInElement(document.body);"></script>
            <style>
                :root {
                    --color-primary: #007bff;
                    --color-text: #333;
                    --color-bg: #fff;
                    --color-border: #ddd;
                    --color-muted: #777;
                    --color-accent: #f0f0f0;
                    --color-secondary: #f9f9f9;
                }
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: var(--color-text);
                    background: var(--color-bg);
                    padding: 20px;
                }
                .box {
                    border: 1px solid var(--color-border);
                    padding: 10px;
                    background: var(--color-accent);
                }
                .highlight {
                    background: yellow;
                    font-weight: bold;
                }
                .important {
                    color: red;
                    font-weight: bold;
                }
                pre {
                    background: var(--color-secondary);
                    padding: 10px;
                    border-radius: 5px;
                    overflow-x: auto;
                }
                blockquote {
                    border-left: 4px solid var(--color-primary);
                    padding-left: 10px;
                    color: var(--color-muted);
                }
            </style>
        </head>
        <body>
            ${htmlContent}
            <script>
                window.onload = function () {
                console.log("Checking if KaTeX is loaded...");
                
                if (typeof katex !== "undefined") {
                    console.log("✅ KaTeX loaded successfully!");
                } else {
                    console.error("❌ KaTeX not loaded.");
                }

                if (typeof renderMathInElement !== "undefined") {
                    console.log("✅ renderMathInElement function exists!");
                    renderMathInElement(document.body, {
                        delimiters: [
                            { left: '\\(', right: '\\)', display: false },  
                            { left: '\\[', right: '\\]', display: true },
                            { left: '$', right: '$', display: false },
                            { left: '$$', right: '$$', display: true }
                        ],
                        throwOnError: false
                    });
                } else {
                    console.error("❌ renderMathInElement is not defined.");
                }
            };

            </script>
        </body>
        </html>`;

        return styledContent;
    }
}


export default new PageRenderer();
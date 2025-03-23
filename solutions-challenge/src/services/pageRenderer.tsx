class PageRenderer {
    renderPage(htmlContent: string): string {
        // Step 1: Remove Markdown-style triple backticks if present
        htmlContent = htmlContent.replace(/```html\s*|```$/g, '').trim();

        // Step 2: Extract the <body> content if it exists
        const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        let cleanedHtml = bodyMatch ? bodyMatch[1].trim() : htmlContent;

        // Step 3: Wrap in a proper div container if not already wrapped
        if (!cleanedHtml.startsWith('<div')) {
            cleanedHtml = `<div class="content-container">${cleanedHtml}</div>`;
        }

        // Step 4: Add basic HTML structure if content seems like plain text
        if (!cleanedHtml.includes('<')) {
            cleanedHtml = `<div class="content-container">
                <h1>${cleanedHtml.split('\n')[0] || 'Content'}</h1>
                ${cleanedHtml.split('\n').slice(1).map(line => `<p>${line}</p>`).join('')}
            </div>`;
        }

        // Step 5: Ensure all math expressions have proper spacing for KaTeX
        cleanedHtml = cleanedHtml.replace(/\\(\(|\[)(.*?)\\(\)|\])/g, (match) => {
            // Add spacing around math expressions for better rendering
            return match.startsWith('\\(') ? 
                ` \\(${match.slice(2, -2)}\\) ` : 
                ` \\[${match.slice(2, -2)}\\] `;
        });

        return this.applyStyles(cleanedHtml);
    }

    applyStyles(htmlContent: string): string {
        const styledContent = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rendered Page</title>
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
                
                /* Base styles with higher specificity */
                body .content-container {
                    font-family: Arial, sans-serif !important;
                    line-height: 1.6 !important;
                    color: var(--color-text) !important;
                    background: var(--color-bg) !important;
                    padding: 20px !important;
                    max-width: 100% !important;
                    overflow-wrap: break-word !important;
                }
                
                /* Headings with stronger specificity */
                body .content-container h1,
                body .content-container h2,
                body .content-container h3,
                body .content-container h4,
                body .content-container h5,
                body .content-container h6 {
                    margin-top: 1.5em !important;
                    margin-bottom: 0.75em !important;
                    font-weight: bold !important;
                    line-height: 1.3 !important;
                }
                
                body .content-container h1 { font-size: 2em !important; }
                body .content-container h2 { font-size: 1.5em !important; }
                body .content-container h3 { font-size: 1.3em !important; }
                
                /* Paragraph spacing */
                body .content-container p {
                    margin-bottom: 1em !important;
                    text-align: left !important;
                }
                
                /* List styles */
                body .content-container ul,
                body .content-container ol {
                    padding-left: 2em !important;
                    margin-bottom: 1em !important;
                }
                
                body .content-container li {
                    margin-bottom: 0.5em !important;
                }
                
                /* Tables */
                body .content-container table {
                    border-collapse: collapse !important;
                    width: 100% !important;
                    margin-bottom: 1em !important;
                }
                
                body .content-container th,
                body .content-container td {
                    border: 1px solid var(--color-border) !important;
                    padding: 8px !important;
                }
                
                /* Code blocks */
                body .content-container pre {
                    background: var(--color-secondary) !important;
                    padding: 15px !important;
                    border-radius: 5px !important;
                    overflow-x: auto !important;
                    margin-bottom: 1em !important;
                }
                
                /* Blockquotes */
                body .content-container blockquote {
                    border-left: 4px solid var(--color-primary) !important;
                    padding-left: 1em !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                    color: var(--color-muted) !important;
                }
                
                /* Links */
                body .content-container a {
                    color: var(--color-primary) !important;
                    text-decoration: underline !important;
                }
                
                /* Images */
                body .content-container img {
                    max-width: 100% !important;
                    height: auto !important;
                    display: block !important;
                    margin: 1em auto !important;
                }
                
                /* Special box */
                body .content-container .box {
                    border: 1px solid var(--color-border) !important;
                    padding: 15px !important;
                    background: var(--color-accent) !important;
                    border-radius: 5px !important;
                    margin-bottom: 1em !important;
                }

                /* Citations and references */
                body .content-container cite {
                    font-style: italic !important;
                }

                body .content-container strong {
                    font-weight: bold !important;
                }
                
                /* Force text color for all elements to ensure readability */
                body .content-container * {
                    color: var(--color-text) !important;
                }
                
                body .content-container h1, 
                body .content-container h2,
                body .content-container h3,
                body .content-container h4,
                body .content-container h5,
                body .content-container h6 {
                    color: var(--color-text) !important;
                }
                
                /* Fix math rendering */
                body .katex {
                    font-size: 1.1em !important;
                    line-height: 1.4 !important;
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
                        
                        // Apply KaTeX with more precise delimiters and options
                        if (typeof renderMathInElement !== "undefined") {
                            console.log("✅ renderMathInElement function exists!");
                            renderMathInElement(document.body, {
                                delimiters: [
                                    { left: '\\(', right: '\\)', display: false },  
                                    { left: '\\[', right: '\\]', display: true },
                                    { left: '$', right: '$', display: false },
                                    { left: '$$', right: '$$', display: true }
                                ],
                                throwOnError: false,
                                trust: true,
                                strict: false,
                                macros: {
                                    "\\pi": "\\pi"
                                }
                            });
                        } else {
                            console.error("❌ renderMathInElement is not defined.");
                        }
                    } else {
                        console.error("❌ KaTeX not loaded.");
                    }
                };
            </script>
        </body>
        </html>`;

        return styledContent;
    }
}

export default new PageRenderer();
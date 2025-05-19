class PageRenderer {
    renderPage(htmlContent: string): string {
        htmlContent = this.cleanHtmlContent(htmlContent);
        return this.applyStyles(htmlContent);
    }

    private cleanHtmlContent(htmlContent: string): string {
        // Remove markdown code block markers
        htmlContent = htmlContent
            .replace(/```html\s*/gi, '')
            .replace(/^```+$/gm, '')
            .replace(/```+$/g, '')
            .trim();

        // Extract body content if present
        const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        let cleanedHtml = bodyMatch ? bodyMatch[1].trim() : htmlContent;

        // Remove any existing content-container divs
        cleanedHtml = cleanedHtml.replace(/<div class="content-container">([\s\S]*?)<\/div>/g, '$1');

        // Wrap content in container if needed
        if (!cleanedHtml.startsWith('<div')) {
            cleanedHtml = `<div class="flex-1 overflow-y-auto text-gray-900 dark:text-white">${cleanedHtml}</div>`;
        }

        // Handle plain text content
        if (!cleanedHtml.includes('<')) {
            cleanedHtml = `<div class="flex-1 overflow-y-auto text-gray-900 dark:text-white">
                <h1 class="text-gray-900 dark:text-white">${cleanedHtml.split('\n')[0] || 'Content'}</h1>
                ${cleanedHtml
                    .split('\n')
                    .slice(1)
                    .map(line => `<p class="text-gray-900 dark:text-white">${line}</p>`)
                    .join('')}
            </div>`;
        }

        // Fix math delimiters
        cleanedHtml = cleanedHtml.replace(/\\(\(|\[)(.*?)\\(\)|\])/g, match => {
            return match.startsWith('\\(')
                ? ` \\(${match.slice(2, -2)}\\) `
                : ` \\[${match.slice(2, -2)}\\] `;
        });

        return cleanedHtml;
    }

    private applyStyles(htmlContent: string): string {
        return `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rendered Page</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css" crossorigin="anonymous">
            <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js" crossorigin="anonymous"></script>
            <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/contrib/auto-render.min.js" crossorigin="anonymous"
                onload="renderMathInElement(document.body);"></script>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: transparent;
                    font-family: system-ui, -apple-system, sans-serif;
                }

                .flex-1 {
                    flex: 1;
                }

                .overflow-y-auto {
                    overflow-y: auto;
                }

                /* Typography */
                .flex-1 h1,
                .flex-1 h2,
                .flex-1 h3,
                .flex-1 h4,
                .flex-1 h5,
                .flex-1 h6 {
                    margin: 1.2em 0 0.5em 0;
                    font-weight: bold;
                    line-height: 1.4;
                    color: var(--color-foreground);
                }

                .flex-1 h2 { font-size: 1.875rem; }
                .flex-1 h3 { font-size: 1.5rem; }
                .flex-1 h4 { font-size: 1.25rem; }
                .flex-1 h5 { font-size: 1.125rem; }
                .flex-1 h6 { font-size: 1rem; }

                .flex-1 p {
                    margin: 1em 0;
                    text-align: left;
                }

                /* Lists */
                .flex-1 ul,
                .flex-1 ol {
                    list-style-position: outside;
                    padding-left: 1.5em;
                    margin: 1em 0;
                }

                .flex-1 li {
                    margin-bottom: 0.5em;
                }

                /* Tables */
                .flex-1 table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 1.5em 0;
                }

                .flex-1 th,
                .flex-1 td {
                    padding: 10px;
                    text-align: left;
                }

                /* Code blocks */
                .flex-1 pre {
                    padding: 1em;
                    border-radius: 6px;
                    overflow-x: auto;
                    margin: 1.5em 0;
                }

                /* Blockquotes */
                .flex-1 blockquote {
                    padding-left: 1em;
                    margin: 1.5em 0;
                }

                /* Links */
                .flex-1 a {
                    text-decoration: underline;
                }

                /* Citations */
                .flex-1 cite {
                    font-style: italic;
                }

                /* Strong text */
                .flex-1 strong {
                    font-weight: bold;
                }

                /* Math */
                .katex {
                    font-size: 1.1em;
                    line-height: 1.4;
                }
            </style>
        </head>
        <body>
            ${htmlContent}
            <script>
                window.onload = function () {
                    if (typeof katex !== "undefined" && typeof renderMathInElement !== "undefined") {
                        renderMathInElement(document.body, {
                            delimiters: [
                                { left: '\\\\(', right: '\\\\)', display: false },
                                { left: '\\\\[', right: '\\\\]', display: true },
                                { left: '$', right: '$', display: false },
                                { left: '$$', right: '$$', display: true }
                            ],
                            throwOnError: false,
                            trust: true,
                            strict: false,
                            macros: {
                                "\\\\pi": "\\\\pi"
                            }
                        });
                    }
                };
            </script>
        </body>
        </html>`;
    }
}

export default new PageRenderer();

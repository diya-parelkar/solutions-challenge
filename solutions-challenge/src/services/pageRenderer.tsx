class PageRenderer {
    renderPage(htmlContent: string): string {
        htmlContent = htmlContent
            .replace(/```html\s*/gi, '')
            .replace(/^```+$/gm, '')
            .replace(/```+$/g, '')
            .trim();

        const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        let cleanedHtml = bodyMatch ? bodyMatch[1].trim() : htmlContent;

        if (!cleanedHtml.startsWith('<div')) {
            cleanedHtml = `<div class="content-container">${cleanedHtml}</div>`;
        }

        if (!cleanedHtml.includes('<')) {
            cleanedHtml = `<div class="content-container">
                <h1>${cleanedHtml.split('\n')[0] || 'Content'}</h1>
                ${cleanedHtml
                    .split('\n')
                    .slice(1)
                    .map(line => `<p>${line}</p>`)
                    .join('')}
            </div>`;
        }

        cleanedHtml = cleanedHtml.replace(/\\(\(|\[)(.*?)\\(\)|\])/g, match => {
            return match.startsWith('\\(')
                ? ` \\(${match.slice(2, -2)}\\) `
                : ` \\[${match.slice(2, -2)}\\] `;
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
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css" crossorigin="anonymous">
            <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js" crossorigin="anonymous"></script>
            <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/contrib/auto-render.min.js" crossorigin="anonymous"
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
                    margin: 0;
                    padding: 0;
                    background: var(--color-bg);
                    font-family: Arial, sans-serif;
                    color: var(--color-text);
                }

                .content-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 0em 2em;
                    background: var(--color-bg);
                    line-height: 1.7;
                    overflow-wrap: break-word;
                }

                .content-container h1,
                .content-container h2,
                .content-container h3,
                .content-container h4,
                .content-container h5,
                .content-container h6 {
                    margin: 1.2em 0 0.5em 0;
                    font-weight: bold;
                    line-height: 1.4;
                    color: var(--color-text);
                }

                .content-container h1 { font-size: 2em; }
                .content-container h2 { font-size: 1.7em; }
                .content-container h3 { font-size: 1.4em; }
                .content-container h4 { font-size: 1.2em; }
                .content-container h5 { font-size: 1em; }
                .content-container h6 { font-size: 0.9em; }

                .content-container p {
                    margin: 1em 0;
                    text-align: left;
                }

                .content-container ul {
                    list-style-type: disc;
                    list-style-position: outside;
                    padding-left: 1.5em;
                    margin: 1em 0;
                }

                .content-container ol {
                    list-style-type: decimal;
                    list-style-position: outside;
                    padding-left: 1.5em;
                    margin: 1em 0;
                }

                .content-container li {
                    margin-bottom: 0.5em;
                }

                .content-container table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 1.5em 0;
                }

                .content-container th,
                .content-container td {
                    border: 1px solid var(--color-border);
                    padding: 10px;
                    text-align: left;
                }

                .content-container pre {
                    background: var(--color-secondary);
                    padding: 1em;
                    border-radius: 6px;
                    overflow-x: auto;
                    margin: 1.5em 0;
                }

                .content-container blockquote {
                    border-left: 4px solid var(--color-primary);
                    padding-left: 1em;
                    margin: 1.5em 0;
                    color: var(--color-muted);
                    background: var(--color-accent);
                }

                .content-container a {
                    color: var(--color-primary);
                    text-decoration: underline;
                }

                .content-container img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 1.5em auto;
                }

                .content-container .box {
                    border: 1px solid var(--color-border);
                    padding: 1em;
                    background: var(--color-accent);
                    border-radius: 6px;
                    margin: 1.5em 0;
                }

                .content-container cite {
                    font-style: italic;
                }

                .content-container strong {
                    font-weight: bold;
                }

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
        return styledContent;
    }
}

export default new PageRenderer();

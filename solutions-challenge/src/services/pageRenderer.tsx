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

                :root[data-theme="dark"] {
                    --color-primary: #3b82f6;
                    --color-text: #f3f4f6 !important;
                    --color-bg: #1a1a1a;
                    --color-border: #374151;
                    --color-muted: #d1d5db;
                    --color-accent: #1f2937;
                    --color-secondary: #111827;
                }

                body {
                    margin: 0;
                    padding: 0;
                    background: transparent;
                    font-family: Arial, sans-serif;
                    color: var(--color-text) !important;
                }

                .content-container {
                    width: 100% !important;
                    max-width: 1400px !important;
                    margin: 0 auto;
                    padding: 0 1rem;
                    background: transparent;
                    line-height: 1.7;
                    overflow-wrap: break-word;
                }

                /* Responsive breakpoints */
                @media (min-width: 640px) {
                    .content-container {
                        padding: 0 1.5rem !important;
                    }
                }

                @media (min-width: 768px) {
                    .content-container {
                        padding: 0 2rem !important;
                    }
                }

                @media (min-width: 1024px) {
                    .content-container {
                        padding: 0 2rem !important;
                        max-width: 1400px !important;
                    }
                }

                @media (min-width: 1280px) {
                    .content-container {
                        padding: 0 2.5rem !important;
                        max-width: 1400px !important;
                    }
                }

                @media (min-width: 1536px) {
                    .content-container {
                        padding: 0 3rem !important;
                        max-width: 1400px !important;
                    }
                }

                /* Ensure content is readable on very small screens */
                @media (max-width: 480px) {
                    .content-container {
                        padding: 0 1rem !important;
                        font-size: 0.95rem;
                    }
                }

                [data-theme="dark"] .content-container {
                    color: #f3f4f6 !important;
                }

                .content-container * {
                    color: inherit !important;
                }

                [data-theme="dark"] .content-container * {
                    color: #f3f4f6 !important;
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
                }

                [data-theme="dark"] .content-container h1,
                [data-theme="dark"] .content-container h2,
                [data-theme="dark"] .content-container h3,
                [data-theme="dark"] .content-container h4,
                [data-theme="dark"] .content-container h5,
                [data-theme="dark"] .content-container h6 {
                    color: #f3f4f6 !important;
                }

                .content-container p {
                    margin: 1em 0;
                    text-align: left;
                }

                [data-theme="dark"] .content-container p {
                    color: #f3f4f6 !important;
                }

                .content-container ul,
                .content-container ol {
                    list-style-position: outside;
                    padding-left: 1.5em;
                    margin: 1em 0;
                }

                [data-theme="dark"] .content-container ul,
                [data-theme="dark"] .content-container ol {
                    color: #f3f4f6 !important;
                }

                .content-container li {
                    margin-bottom: 0.5em;
                }

                [data-theme="dark"] .content-container li {
                    color: #f3f4f6 !important;
                }

                .content-container table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 1.5em 0;
                }

                [data-theme="dark"] .content-container table {
                    color: #f3f4f6 !important;
                }

                .content-container th,
                .content-container td {
                    border: 1px solid var(--color-border);
                    padding: 10px;
                    text-align: left;
                }

                [data-theme="dark"] .content-container th,
                [data-theme="dark"] .content-container td {
                    color: #f3f4f6 !important;
                }

                .content-container pre {
                    background: var(--color-secondary);
                    padding: 1em;
                    border-radius: 6px;
                    overflow-x: auto;
                    margin: 1.5em 0;
                }

                [data-theme="dark"] .content-container pre {
                    color: #f3f4f6 !important;
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
                    padding: 1.5em;
                    background: var(--color-accent);
                    border-radius: 8px;
                    margin: 1.5em 0;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                [data-theme="dark"] .content-container .box {
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(31, 41, 55, 0.8);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
                    color: #f3f4f6 !important;
                    backdrop-filter: blur(8px);
                }

                [data-theme="dark"] .content-container .box * {
                    color: #f3f4f6 !important;
                }

                .content-container cite {
                    font-style: italic;
                }

                [data-theme="dark"] .content-container cite {
                    color: #f3f4f6 !important;
                }

                .content-container strong {
                    font-weight: bold;
                }

                [data-theme="dark"] .content-container strong {
                    color: #f3f4f6 !important;
                }

                .katex {
                    font-size: 1.1em;
                    line-height: 1.4;
                }

                [data-theme="dark"] .katex {
                    color: #f3f4f6 !important;
                }

                .content-container code {
                    background: var(--color-secondary);
                    padding: 0.2em 0.4em;
                    border-radius: 3px;
                }

                /* Highlight styles */
                .content-container .highlight {
                    background-color: rgba(59, 130, 246, 0.2);
                    color: inherit;
                    padding: 0.1em 0.2em;
                    border-radius: 2px;
                }

                [data-theme="dark"] .content-container .highlight {
                    background-color: rgba(59, 130, 246, 0.3);
                    color: inherit;
                }

                /* Override any Tailwind prose styles */
                .prose * {
                    color: inherit !important;
                }

                [data-theme="dark"] .prose * {
                    color: #f3f4f6 !important;
                }

                /* Ensure content width is not constrained by parent elements */
                .content-container > * {
                    max-width: none !important;
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

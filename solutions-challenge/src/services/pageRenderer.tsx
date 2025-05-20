class PageRenderer {
    renderPage(htmlContent: string): string {
        try {
            console.log('🔄 Starting page rendering...');
            console.log('Input content length:', htmlContent.length);
            
            htmlContent = this.cleanHtmlContent(htmlContent);
            console.log('Content cleaned, length:', htmlContent.length);
            
            return htmlContent;
        } catch (error) {
            console.error('❌ Error rendering page:', error);
            return this.renderErrorPage(error);
        }
    }

    private renderErrorPage(error: unknown): string {
        return `
        <div class="error-container">
            <h1 class="error-title">Error Rendering Page</h1>
            <p>We encountered an error while rendering the page content.</p>
            <div class="error-details">
                ${error instanceof Error ? error.message : String(error)}
            </div>
        </div>`;
    }

    private cleanHtmlContent(htmlContent: string): string {
        try {
            console.log('Cleaning HTML content...');
            
            // Remove markdown code block markers
            htmlContent = htmlContent
                .replace(/```html\s*/gi, '')
                .replace(/^```+$/gm, '')
                .replace(/```+$/g, '')
                .trim();
            console.log('Markdown markers removed');

            // Extract body content if present
            const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            let cleanedHtml = bodyMatch ? bodyMatch[1].trim() : htmlContent;
            console.log('Body content extracted');

            // Remove any existing content-container divs
            cleanedHtml = cleanedHtml.replace(/<div class="content-container">([\s\S]*?)<\/div>/g, '$1');
            console.log('Content container divs removed');

            // Remove h1 titles since they're displayed in the header
            cleanedHtml = cleanedHtml.replace(/<h1[^>]*>.*?<\/h1>/gi, '');
            console.log('H1 titles removed');

            // Convert markdown-style bold text to HTML bold tags
            cleanedHtml = cleanedHtml.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
            console.log('Bold text converted');

            // Wrap content in container if needed
            if (!cleanedHtml.startsWith('<div')) {
                cleanedHtml = `<div class="content-wrapper prose dark:prose-invert max-w-none">${cleanedHtml}</div>`;
                console.log('Content wrapped in container');
            }

            // Handle plain text content
            if (!cleanedHtml.includes('<')) {
                console.log('Converting plain text to HTML');
                cleanedHtml = `<div class="content-wrapper prose dark:prose-invert max-w-none">
                    ${cleanedHtml
                        .split('\n')
                        .map(line => {
                            // Convert markdown-style bold text in plain text content
                            line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
                            return `<p class="text-gray-900 dark:text-white">${line}</p>`;
                        })
                        .join('')}
                </div>`;
            }

            // Fix math delimiters
            cleanedHtml = cleanedHtml.replace(/\\(\(|\[)(.*?)\\(\)|\])/g, match => {
                return match.startsWith('\\(')
                    ? ` \\(${match.slice(2, -2)}\\) `
                    : ` \\[${match.slice(2, -2)}\\] `;
            });
            console.log('Math delimiters fixed');

            return cleanedHtml;
        } catch (error) {
            console.error('Error cleaning HTML content:', error);
            return this.renderErrorPage(error);
        }
    }
}

export default new PageRenderer();
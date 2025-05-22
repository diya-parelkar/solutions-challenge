import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { animationService } from '../services/animationService';

interface TextModifierProps {
  onClose: () => void;
  onModify: (newText: string) => void;
  selectedText: string;
  position: { x: number; y: number };
  level: string;
  contentType: string;
}

const TextModifier: React.FC<TextModifierProps> = ({ 
  onClose, 
  onModify, 
  selectedText, 
  position,
  level,
  contentType 
}) => {
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_BEAUTIFY_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Level display mapping
  const LEVEL_DISPLAY: Record<string, string> = {
    "explain-like-im-5": "Explain Like I'm 5",
    "school-kid": "School Kid",
    "high-school": "High School",
    "graduate-student": "Graduate Student",
    "expert": "Expert",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;

    console.log('🔄 Starting text modification process...');
    console.log(`📝 Original text: "${selectedText}"`);
    console.log(`💡 Instruction: "${instruction}"`);
    console.log(`📚 Level: ${LEVEL_DISPLAY[level] || level}`);
    console.log(`📖 Content Type: ${contentType === "concise" ? "Quick Read" : "Detailed"}`);

    // Check if API key is available
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ Gemini API key is not set in environment variables');
      return;
    }
    console.log('🔑 API key is available');

    setIsLoading(true);
    try {
      const prompt = `
        Original text: "${selectedText}"
        Instruction: ${instruction}
        Target Level: ${LEVEL_DISPLAY[level] || level}
        Content Type: ${contentType === "concise" ? "Quick Read" : "Detailed"}
        
        IMPORTANT: You must return the response in HTML format only. Do not use markdown or any other formatting.
        
        Please modify the text according to the instruction while maintaining the following:
        1. Adjust the complexity and language to match the target level (${LEVEL_DISPLAY[level] || level})
        2. Keep the content style consistent with the content type (${contentType === "concise" ? "Quick Read" : "Detailed"})
        3. Preserve the core meaning and information
        4. You MUST use these exact HTML structures and classes:
           - Main container:
             <div class="content-wrapper prose dark:prose-invert max-w-none">
               [Your content here]
             </div>
           
           - Headings:
             <h2 class="content-subtitle text-2xl font-semibold mt-4 mb-4 text-gray-800 dark:text-gray-200">
               <img src="https://cdn.jsdelivr.net/gh/icons8/flat-color-icons@master/svg/idea.svg" class="flat-color-icon" alt="Idea icon" />
               Subtitle
             </h2>
           
           - Lists:
             <ul class="content-list space-y-2 my-4 text-gray-700 dark:text-gray-300">
               <li class="content-list-item">
                 <img src="https://cdn.jsdelivr.net/gh/icons8/flat-color-icons@master/svg/checkmark.svg" class="flat-color-icon" alt="Checkmark icon" />
                 List item
               </li>
             </ul>
           
           - Blockquotes:
             <blockquote class="content-quote border-l-4 border-primary-500 dark:border-primary-400 pl-4 my-4 italic text-gray-700 dark:text-gray-300">
               <img src="https://cdn.jsdelivr.net/gh/icons8/flat-color-icons@master/svg/advertising.svg" class="flat-color-icon" alt="Quote icon" />
               Quote content
             </blockquote>
           
           - Important text:
             <div class="content-highlight bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg my-4 text-gray-800 dark:text-gray-200">
               <img src="https://cdn.jsdelivr.net/gh/icons8/flat-color-icons@master/svg/info.svg" class="flat-color-icon" alt="Important icon" />
               Important information
             </div>
           
           - Code blocks:
             <div class="content-code bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 font-mono text-sm text-gray-800 dark:text-gray-200">
               <img src="https://cdn.jsdelivr.net/gh/icons8/flat-color-icons@master/svg/code.svg" class="flat-color-icon" alt="Code icon" />
               <pre><code>Code content</code></pre>
             </div>
           
           - Links:
             <a href="#" class="content-link text-primary-600 dark:text-primary-400 hover:underline">
               <img src="https://cdn.jsdelivr.net/gh/icons8/flat-color-icons@master/svg/link.svg" class="flat-color-icon" alt="Link icon" />
               Link text
             </a>

           - Animations (use these placeholders that will be processed separately):
             <div class="content-animation my-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
               <div class="flex items-center justify-between mb-4">
                 <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                   <img src="https://cdn.jsdelivr.net/gh/icons8/flat-color-icons@master/svg/movie.svg" class="flat-color-icon" alt="Animation icon" />
                   [animation: {search_term} : {detailed_prompt}]
                 </h4>
               </div>
               <div class="animation-placeholder">
                 [animation: {search_term} : {detailed_prompt}]
               </div>
               <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">Animation caption here</p>
             </div>
        
        IMPORTANT FORMATTING RULES:
        1. Always wrap the entire content in the main container div
        2. Use the exact class names and structure shown above
        3. Include the appropriate icon for each element using the full CDN URL
        4. Maintain proper spacing and hierarchy
        5. Do not use markdown or any other formatting
        6. For animations:
           - Use the [animation: search_term : detailed_prompt] format
           - search_term should be a short keyword for finding relevant animations
           - detailed_prompt should describe what the animation should show
           - Place animations in appropriate sections of the content
           - Include a descriptive caption
        
        Return ONLY the modified text with HTML formatting. Do not include any markdown, explanations, or additional text.
        The response must start with the main container div and contain only HTML content.
      `;

      console.log('🤖 Sending request to Gemini API...');
      console.log('📤 Prompt:', prompt);
      
      const result = await model.generateContent(prompt);
      console.log('📥 Raw API response:', result);
      
      const response = await result.response.text();
      console.log(`✅ Received response from Gemini API: "${response.trim()}"`);

      if (!response.trim()) {
        throw new Error('Empty response from API');
      }

      // Clean up any markdown artifacts
      const cleanResponse = response.trim()
        // Remove markdown code blocks with language specifiers
        .replace(/```html\s*/g, '')
        .replace(/```js\s*/g, '')
        .replace(/```javascript\s*/g, '')
        .replace(/```typescript\s*/g, '')
        .replace(/```ts\s*/g, '')
        .replace(/```tsx\s*/g, '')
        .replace(/```jsx\s*/g, '')
        .replace(/```css\s*/g, '')
        .replace(/```\s*/g, '')
        // Remove any remaining backticks
        .replace(/`/g, '')
        // Remove any markdown-style formatting
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/__/g, '')
        .replace(/_/g, '')
        // Remove any markdown-style lists
        .replace(/^[-*+]\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        // Remove any extra whitespace
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      // Process animation placeholders
      const processedContent = await animationService.processAnimationPlaceholders(cleanResponse);

      // Log the raw response content
      console.log('📄 Raw response content:', {
        content: processedContent,
        length: processedContent.length,
        containsHTML: processedContent.includes('<'),
        containsMarkdown: processedContent.includes('```') || processedContent.includes('**') || processedContent.includes('*'),
        firstChars: processedContent.substring(0, 100)
      });

      // Log any potential formatting issues
      if (processedContent.includes('```')) {
        console.warn('⚠️ Response contains markdown code blocks');
      }
      if (processedContent.includes('**')) {
        console.warn('⚠️ Response contains markdown bold syntax');
      }
      if (processedContent.includes('*')) {
        console.warn('⚠️ Response contains markdown italic syntax');
      }
      if (!processedContent.includes('<')) {
        console.warn('⚠️ Response does not contain HTML tags');
      }

      console.log('📤 Calling onModify with formatted text...');
      onModify(processedContent);
      console.log('🔒 Closing popup...');
      onClose();
    } catch (error) {
      console.error('❌ Error modifying text:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
    } finally {
      setIsLoading(false);
      console.log('🏁 Text modification process completed');
    }
  };

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -100%)',
        marginTop: '-10px'
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Selected text: "{selectedText.length > 50 ? selectedText.substring(0, 50) + '...' : selectedText}"
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Level: {LEVEL_DISPLAY[level] || level} | Type: {contentType === "concise" ? "Quick Read" : "Detailed"}
        </div>
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="What do you want to change?"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          autoFocus
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !instruction.trim()}
            className="px-3 py-1 text-sm bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Modifying...' : 'Modify'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextModifier; 
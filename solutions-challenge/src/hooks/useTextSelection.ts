import { useState, useCallback, useEffect, useRef } from 'react';

interface SelectionState {
  text: string;
  position: { x: number; y: number };
  range: Range | null;
}

export const useTextSelection = () => {
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const storedRange = useRef<Range | null>(null);

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      console.log('🔍 No text selected or selection collapsed');
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const selectedText = selection.toString();

    console.log('📌 Text selection detected:');
    console.log(`📝 Selected text: "${selectedText}"`);
    console.log(`📍 Position: x=${rect.left + rect.width / 2}, y=${rect.top}`);

    // Store the range for later use
    storedRange.current = range.cloneRange();

    setSelection({
      text: selectedText,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top
      },
      range: storedRange.current
    });
  }, []);

  const modifyText = useCallback((newText: string) => {
    if (!storedRange.current) {
      console.log('⚠️ Cannot modify text: No stored selection range');
      return;
    }

    console.log('🔄 Modifying text:');
    console.log(`📝 Original text: "${selection?.text}"`);
    console.log(`📝 New text: "${newText}"`);
    console.log('📍 Using stored selection range');

    try {
      // Create a temporary container to parse HTML
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = newText;

      // Function to add classes to elements
      const addClassesToElement = (element: Element) => {
        // Add classes based on element type
        if (element.tagName === 'H2') {
          element.classList.add('content-subtitle', 'text-2xl', 'font-semibold', 'mt-2', 'mb-4');
        } else if (element.tagName === 'H3') {
          element.classList.add('content-heading', 'text-xl', 'font-medium', 'mt-6', 'mb-3');
        } else if (element.tagName === 'UL') {
          element.classList.add('content-list', 'space-y-2', 'my-4');
        } else if (element.tagName === 'LI') {
          element.classList.add('content-list-item');
        } else if (element.tagName === 'BLOCKQUOTE') {
          element.classList.add('content-quote', 'border-l-4', 'border-primary-500', 'dark:border-primary-400', 'pl-4', 'my-4', 'italic');
        } else if (element.tagName === 'DIV' && element.classList.contains('content-highlight')) {
          element.classList.add('bg-yellow-100', 'dark:bg-yellow-900/30', 'p-4', 'rounded-lg', 'my-4');
        } else if (element.tagName === 'TABLE') {
          element.classList.add('content-table', 'w-full', 'border-collapse');
        } else if (element.tagName === 'TH') {
          element.classList.add('content-table-header', 'p-4', 'text-left', 'font-semibold', 'border-b', 'text-gray-900', 'dark:text-gray-100');
        } else if (element.tagName === 'TD') {
          element.classList.add('content-table-cell', 'p-4', 'text-gray-900', 'dark:text-gray-300');
        }

        // Recursively process child elements
        Array.from(element.children).forEach(addClassesToElement);
      };

      // Process all elements in the container
      Array.from(tempContainer.children).forEach(addClassesToElement);

      // If the new text is a single text node, wrap it in a span
      if (tempContainer.childNodes.length === 1 && tempContainer.firstChild?.nodeType === Node.TEXT_NODE) {
        const span = document.createElement('span');
        span.textContent = newText;
        console.log('📦 Created new span element for plain text:', span);
        
        storedRange.current.deleteContents();
        storedRange.current.insertNode(span);
      } else {
        // For HTML content, insert each node
        console.log('📦 Inserting HTML content:', tempContainer.innerHTML);
        
        storedRange.current.deleteContents();
        
        // Insert each child node
        while (tempContainer.firstChild) {
          storedRange.current.insertNode(tempContainer.firstChild);
        }
      }

      console.log('✅ Text modification applied successfully');
    } catch (error) {
      console.error('❌ Error during text modification:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
    }
    
    setSelection(null);
    storedRange.current = null;
    console.log('🧹 Selection state and stored range cleared');
  }, [selection]);

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [handleSelection]);

  return {
    selection,
    modifyText,
    clearSelection: () => {
      setSelection(null);
      storedRange.current = null;
    }
  };
}; 
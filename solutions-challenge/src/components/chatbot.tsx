import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown"; 
import { MessageSquare, X, Minus, Send } from "lucide-react";
import GeminiChatbotService from "../services/geminiChatbot";
import { Button } from "@/components/ui/button";
import { Rnd } from "react-rnd"; 
import "react-resizable/css/styles.css";

interface ChatbotProps {
  promptTitle: string;
  level: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ promptTitle, level }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ type: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  // Track chatbot dimensions and position
  const [size, setSize] = useState({ width: 380, height: 500 });
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 520 });

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Set welcome message when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: "bot",
          text: `👋 Hello! I'm here to help with **${promptTitle}** at a **${level}** level. Ask me anything!`,
        },
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInput("");

    // Include context in the user message
    const fullMessage = `**Context:** This is about ${promptTitle} at a ${level} level.\n\n**User:** ${userMessage}`;
    
    const botResponse = await GeminiChatbotService.getResponse(fullMessage, promptTitle, level);
    setMessages((prev) => [...prev, { type: "bot", text: botResponse }]);
  };

  // Handle input submission on Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed z-[20]">
      {isOpen ? (
        <Rnd
          size={{ width: size.width, height: isMinimized ? 60 : size.height }}
          position={position}
          onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
          onResizeStop={(e, direction, ref, delta, pos) => {
            setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
            setPosition(pos);
          }}
          default={{
            x: window.innerWidth - 400,
            y: window.innerHeight - 520,
            width: 30,
            height: 50,
          }}
          minWidth={320}
          minHeight={60}
          maxWidth={600}
          maxHeight={400}
          className="bg-white shadow-2xl rounded-xl border border-gray-200 overflow-hidden"
          enableResizing={{ topLeft: true, bottomRight: true }}
        >
          {/* Header */}
          <div className="bg-primary text-white flex justify-between items-center p-3 shadow-sm">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Ask Anything!</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-primary-foreground/20 rounded-full p-1 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary-foreground/20 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Container */}
              <div 
                ref={chatRef} 
                className="h-[calc(100%-100px)] overflow-y-auto p-4 space-y-3 bg-gray-50"
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`
                        max-w-[85%] p-3 rounded-xl 
                        ${
                          msg.type === "user"
                            ? "bg-primary text-white rounded-tr-none"
                            : "bg-white text-black border shadow-sm rounded-tl-none"
                        }
                      `}
                    >
                      <ReactMarkdown 
                        components={{
                          a: ({node, ...props}) => (
                            <a 
                              {...props} 
                              className="text-blue-500 hover:underline"
                              target="_blank" 
                              rel="noopener noreferrer"
                            />
                          )
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Type your message..."
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                    className="
                      bg-primary text-white p-2 rounded-full 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:bg-primary-foreground/90 transition-colors
                    "
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </Rnd>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="
            fixed bottom-4 right-4
            bg-primary text-white 
            p-4 rounded-full 
            shadow-2xl hover:shadow-lg 
            transition-all 
            hover:scale-105 
          "
        >
          <MessageSquare className="w-7 h-7" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
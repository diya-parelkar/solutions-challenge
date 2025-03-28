import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown"; 
import { MessageSquare, X, Minus } from "lucide-react";
import GeminiChatbotService from "../services/geminiChatbot";
import { Button } from "@/components/ui/button";
import { Rnd } from "react-rnd"; // Import Rnd for top-left resizing
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
  const [size, setSize] = useState({ width: 320, height: 400 });
  const [position, setPosition] = useState({ x: window.innerWidth - 340, y: window.innerHeight - 420 });

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

  return (
    <div className="fixed z-50">
      {isOpen ? (
        <Rnd
          size={{ width: size.width, height: isMinimized ? 50 : size.height }}
          position={position}
          onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })} // Update position on drag
          onResizeStop={(e, direction, ref, delta, pos) => {
            setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
            setPosition(pos);
          }}
          default={{
            x: window.innerWidth - 340, // Adjust initial position
            y: window.innerHeight - 420,
            width: 320,
            height: 400,
          }}
          minWidth={280}
          minHeight={50}
          maxWidth={500}
          maxHeight={600}
          className="bg-white shadow-lg rounded-lg border p-2"
          enableResizing={{ topLeft: true, bottomRight: true }} // Enable top-left & bottom-right resizing
        >
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-bold">Chatbot</h3>
            <div className="flex gap-2">
              <Minus className="cursor-pointer" onClick={() => setIsMinimized(!isMinimized)} />
              <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
          </div>

          {!isMinimized && (
            <>
              <div ref={chatRef} className="h-64 overflow-y-auto space-y-2 p-2 border-b">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg max-w-[75%] md:max-w-[85%] ${
                      msg.type === "user"
                        ? "bg-blue-500 text-white self-end ml-auto"
                        : "bg-gray-200 text-black self-start mr-auto"
                    }`}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ))}
              </div>

              <div className="flex items-center mt-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border p-2 rounded-l"
                  placeholder="Ask me something..."
                />
                <Button onClick={handleSendMessage} className="rounded-r">
                  Send
                </Button>
              </div>
            </>
          )}
        </Rnd>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 rounded-full p-3 shadow-lg bg-primary text-white"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default Chatbot;

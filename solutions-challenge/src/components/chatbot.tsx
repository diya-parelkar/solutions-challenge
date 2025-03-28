import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import GeminiChatbotService from "../services/geminiChatbot";
import { Button } from "@/components/ui/button";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ type: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    console.log("handleSendMessage triggered!");
  
    if (!input.trim()) {
      console.log("Empty input, returning.");
      return;
    }
  
    const userMessage = input;
    setMessages([...messages, { type: "user", text: userMessage }]);
    setInput("");
  
    console.log("Sending message to Gemini:", userMessage);
  
    const botResponse = await GeminiChatbotService.getResponse(userMessage);
    console.log("Received bot response:", botResponse);
  
    setMessages((prev) => [...prev, { type: "bot", text: botResponse }]);
  };  

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {isOpen ? (
        <div className="w-80 bg-white shadow-lg rounded-lg border p-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-bold">Chatbot</h3>
            <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
          </div>

          <div className="h-64 overflow-y-auto space-y-2 p-2 border-b">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-black self-start"
                }`}
              >
                {msg.text}
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
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full p-3 shadow-lg bg-primary text-white"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default Chatbot;

import React, { useState, useEffect, useRef } from "react";
import "./AIChatbox.css";

export default function AIChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi there! I'm your AI fitness assistant. How can I help you achieve your goals today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY || "";
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.href, // Required for OpenRouter
          "X-Title": "FitTrack React App", // Required for OpenRouter
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // Using standard llama-3 model which works with OpenRouter
          model: "meta-llama/llama-3-8b-instruct",
          messages: [
            { role: "system", content: "You are a professional, motivating fitness and nutrition coach. Provide concise, helpful advice." },
            ...messages,
            userMessage
          ]
        })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from AI");
      }

      const data = await response.json();
      const aiContent = data.choices[0].message.content;

      setMessages(prev => [...prev, { role: "assistant", content: aiContent }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting to my servers right now. Please make sure the API key is configured correctly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chatbox-container">
      {/* Chat Window */}
      <div className={`ai-chat-window ${isOpen ? "open" : ""}`}>
        <div className="ai-chat-header">
          <div className="ai-header-info">
            <span className="ai-bot-icon">🤖</span>
            <h3>FitBot AI</h3>
          </div>
          <button className="ai-close-btn" onClick={() => setIsOpen(false)}>×</button>
        </div>

        <div className="ai-chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`ai-message ${msg.role}`}>
              <div className="ai-message-content">
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message assistant">
              <div className="ai-message-content loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about workouts, diet..."
            rows={1}
          />
          <button 
            className="ai-send-btn" 
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            ➤
          </button>
        </div>
      </div>

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button className="ai-toggle-btn" onClick={() => setIsOpen(true)}>
          <span className="ai-toggle-icon">💬</span>
        </button>
      )}
    </div>
  );
}

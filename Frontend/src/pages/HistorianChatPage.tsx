import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const HistorianChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/chat/historian", {
        question: input,
        history: messages,
        topic: topic,
      });
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.answer,
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-display font-bold text-gold mb-4">
          Ask the Historian
        </h1>
        <p className="text-soft/70">
          Chat with an AI historian for detailed answers and insights
        </p>
      </motion.div>

      <div className="flex-1 flex flex-col glass-panel rounded-2xl p-6">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-soft/50 py-8">
              <p>Start a conversation with the AI Historian</p>
              <p className="text-sm mt-2">Ask any historical question!</p>
            </div>
          ) : (
            messages.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-xl ${
                    message.role === "user"
                      ? "bg-gold/20 text-gold border border-gold/30"
                      : "bg-white/5 text-soft border border-white/10"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 text-soft border border-white/10 p-4 rounded-xl">
                <p>Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask your historical question..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-soft placeholder-soft/40 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 text-gold hover:from-gold/30 hover:to-gold/20 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistorianChatPage;

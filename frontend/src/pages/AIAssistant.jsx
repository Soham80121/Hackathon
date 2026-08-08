import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

const SUGGESTED_QUESTIONS = [
  "What is our remote work policy?",
  "How many vacation days do I get?",
  "What are the core working hours?",
  "How do I apply for parental leave?"
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", text: "Hi there! I'm your HR Policy Assistant. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const processedKeys = useRef(new Set());

  const location = useLocation();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (location.state?.initialQuery && !processedKeys.current.has(location.key)) {
      processedKeys.current.add(location.key);
      handleSendMessage(location.state.initialQuery);
      // Clear state so it doesn't re-trigger on navigation
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, location.key, navigate]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const endpoint = (user.role === "admin" || user.role === "hr") ? "/api/copilot" : "/api/assistant/chat";
      const response = await api.post(endpoint, { message: text });
      const aiMsg = { 
        id: Date.now() + 1, 
        role: "assistant", 
        text: response.data.message
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: "Sorry, I am having trouble connecting to the server."
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="w-full flex justify-center flex-1 min-h-0">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg flex flex-col flex-1 max-h-full max-w-4xl w-full overflow-hidden">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-slate-800 shrink-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-darktext-primary">
            {user.role === "admin" ? "Admin Copilot" : user.role === "hr" ? "HR Copilot" : "AI Policy Assistant"}
          </h2>
          <p className="text-gray-500 dark:text-darktext-muted mt-2">
            {user.role === "admin" || user.role === "hr" 
              ? "Ask questions about workforce data, policies, and generate employee reports instantly." 
              : "Ask questions about company policies securely and instantly."}
          </p>
        </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-6 py-4 shadow-sm ${
                      msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-sm" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-darktext-primary rounded-bl-sm"
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm px-6 py-5 shadow-sm flex gap-1.5 items-center">
                    <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions & Input */}
            <div className="p-6 sm:p-8 bg-gray-50 dark:bg-slate-900/50 shrink-0 border-t border-gray-100 dark:border-slate-800">
              
              {messages.length === 1 && !isLoading && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-slate-600 dark:text-darktext-muted hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={onSubmit} className="flex gap-3 relative">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask something about policies..."
                  disabled={isLoading}
                  className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-6 py-4 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-100 dark:bg-slate-800 disabled:cursor-not-allowed text-[15px]"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white p-4 rounded-2xl transition-colors shadow-sm flex items-center justify-center shrink-0 w-[56px] h-[56px]"
                >
                  <PaperAirplaneIcon className="w-6 h-6" />
                </button>
              </form>
            </div>
            
      </div>
    </div>
  );
}

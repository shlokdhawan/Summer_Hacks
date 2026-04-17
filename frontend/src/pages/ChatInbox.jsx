import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, History, Search, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';

const ChatInbox = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your Inbox Memory. I've indexed your communications across Gmail, Telegram, and Slack. You can ask me things like 'What did Shlok say about the project deadlines?' or 'Summarize all recent discussions regarding budget.'", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setSources([]);

    try {
      const res = await api.post('/rag/chat', { query: input });
      const botMessage = { 
        role: 'assistant', 
        content: res.data.answer, 
        timestamp: new Date(),
        sources: res.data.sources 
      };
      setMessages(prev => [...prev, botMessage]);
      if (res.data.sources) {
        setSources(res.data.sources);
      }
    } catch (err) {
      console.error("Chat failed", err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I had trouble accessing your inbox memory. Please ensure your backend is running and Pinecone/Gemini is configured.", 
        timestamp: new Date() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-curator-bg text-curator-text-primary overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        <div className="p-8 border-b border-curator-border bg-curator-bg/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-curator-teal/10 rounded-2xl border border-curator-teal/20 text-curator-teal">
              <MessageSquare size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Inbox Memory</h1>
              <p className="text-sm text-curator-text-secondary">AI-powered semantic recall of all your communications</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar pb-32">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border ${
                    msg.role === 'user' 
                    ? 'bg-curator-bg border-curator-border text-curator-text-secondary' 
                    : 'bg-curator-teal/10 border-curator-teal/30 text-curator-teal shadow-[0_0_20px_rgba(0,212,180,0.1)]'
                  }`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`p-6 rounded-3xl border ${
                    msg.role === 'user'
                    ? 'bg-curator-card border-curator-border text-curator-text-primary'
                    : 'bg-curator-card/50 border-curator-teal/10 text-curator-text-primary backdrop-blur-sm shadow-xl'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-curator-border/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-curator-text-secondary mb-3 flex items-center gap-2">
                          <History size={12} />
                          Contextual Sources
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.slice(0, 3).map((source, si) => (
                            <div key={si} className="px-3 py-1.5 rounded-xl bg-curator-bg border border-curator-border text-[10px] text-curator-teal font-bold truncate max-w-[200px]">
                              {source.subject || "No Subject"}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-curator-teal/10 border border-curator-teal/30 flex items-center justify-center text-curator-teal animate-pulse">
                    <Bot size={20} />
                  </div>
                  <div className="flex items-center gap-2 p-4">
                     <div className="w-2 h-2 bg-curator-teal rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-curator-teal rounded-full animate-bounce [animation-delay:0.2s]"></div>
                     <div className="w-2 h-2 bg-curator-teal rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
               </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pt-0 bg-gradient-to-t from-curator-bg via-curator-bg to-transparent">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your emails, slack messages or chats..."
              className="w-full bg-curator-card border border-curator-border rounded-2xl py-5 pl-6 pr-20 text-sm focus:outline-none focus:border-curator-teal/50 transition-all shadow-2xl backdrop-blur-xl"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-curator-teal text-curator-bg rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:hover:scale-100 shadow-[0_0_20px_rgba(0,212,180,0.3)]"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Right Sidebar - Sources Detail */}
      <div className="hidden xl:flex w-80 bg-curator-card border-l border-curator-border flex-col p-8 space-y-8 overflow-y-auto custom-scrollbar">
         <div>
            <h2 className="text-[10px] font-black text-curator-text-secondary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <ShieldCheck size={14} className="text-curator-teal" />
               Knowledge Base
            </h2>
            <div className="p-6 rounded-3xl bg-curator-teal/5 border border-curator-teal/10 space-y-4">
               <div className="space-y-1">
                  <p className="text-xs font-black text-curator-text-primary">Cross-Channel Memory</p>
                  <p className="text-[10px] text-curator-text-secondary leading-relaxed">Gathering context from Gmail, Telegram, and Slack using Pinecone RAG.</p>
               </div>
               <div className="pt-4 border-t border-curator-teal/10">
                  <div className="flex justify-between items-center text-[10px] font-bold text-curator-teal uppercase tracking-widest mb-1">
                     <span>Index Status</span>
                     <span>Ready</span>
                  </div>
                  <div className="h-1 bg-curator-bg rounded-full overflow-hidden">
                     <div className="h-full bg-curator-teal w-full shadow-[0_0_10px_rgba(0,212,180,0.5)]"></div>
                  </div>
               </div>
            </div>
         </div>

         <div>
            <h2 className="text-[10px] font-black text-curator-text-secondary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <Search size={14} />
               Related Messages
            </h2>
            <div className="space-y-4">
               {sources.length === 0 ? (
                 <p className="text-[10px] text-curator-text-secondary italic text-center py-8">Ask a question to see related messages here.</p>
               ) : (
                 sources.map((src, i) => (
                   <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="p-4 rounded-2xl bg-curator-bg border border-curator-border hover:border-curator-teal/30 transition-all group"
                   >
                      <p className="text-[10px] font-black text-curator-teal uppercase tracking-widest mb-1">{src.source}</p>
                      <p className="text-xs font-bold text-curator-text-primary truncate mb-1 group-hover:text-curator-teal transition-colors">{src.subject || "No Subject"}</p>
                      <p className="text-[10px] text-curator-text-secondary line-clamp-2 leading-relaxed">{src.snippet}</p>
                   </motion.div>
                 ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChatInbox;

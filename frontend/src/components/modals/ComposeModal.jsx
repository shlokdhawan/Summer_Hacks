import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Paperclip, Mail, MessageSquare, Phone, Globe, ChevronDown, Zap } from 'lucide-react';

const ComposeModal = ({ isOpen, onClose }) => {
  const [source, setSource] = useState('gmail');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isExpanding, setIsExpanding] = useState(false);

  const sources = [
    { id: 'gmail', label: 'Gmail', icon: Mail, color: 'text-curator-red' },
    { id: 'slack', label: 'Slack', icon: MessageSquare, color: 'text-curator-teal' },
    { id: 'whatsapp', label: 'WhatsApp', icon: Phone, color: 'text-curator-green' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 text-curator-text-primary">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-curator-bg/80 backdrop-blur-xl"
      />
      
      <motion.div 
        layoutId="compose-modal"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-curator-card border-x sm:border-t border-curator-border w-full h-full sm:h-auto sm:max-w-2xl rounded-none sm:rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-curator-border">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-curator-teal/10 rounded-xl text-curator-teal">
                <Zap size={20} />
             </div>
             <h2 className="text-xl font-black text-curator-text-primary tracking-tight">New Message</h2>
          </div>
          <button onClick={onClose} className="p-2 text-curator-text-secondary hover:text-curator-text-primary transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Channel Selector */}
          <div className="flex gap-2">
            {sources.map(s => (
              <button
                key={s.id}
                onClick={() => setSource(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  source === s.id 
                    ? 'bg-curator-bg border-curator-teal text-curator-teal shadow-lg' 
                    : 'border-curator-border text-curator-text-secondary hover:border-curator-teal/30'
                }`}
              >
                <s.icon size={14} className={s.color} />
                {s.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
             <div className="relative">
                <input 
                  type="text" 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Recipient (Email, @Username, or Phone)"
                  className="w-full bg-curator-bg border border-curator-border rounded-xl py-3 px-4 text-sm text-curator-text-primary focus:outline-none focus:border-curator-teal/50 transition-all placeholder:text-curator-text-secondary/30"
                />
             </div>
             {source === 'gmail' && (
               <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 className="relative"
               >
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject line"
                    className="w-full bg-curator-bg border border-curator-border rounded-xl py-3 px-4 text-sm text-curator-text-primary focus:outline-none focus:border-curator-teal/50 transition-all placeholder:text-curator-text-secondary/30"
                  />
               </motion.div>
             )}
             <div className="relative">
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Craft your message..."
                  className="w-full bg-curator-bg border border-curator-border rounded-2xl py-4 px-4 text-sm text-curator-text-primary focus:outline-none focus:border-curator-teal/50 transition-all min-h-[200px] placeholder:text-curator-text-secondary/30 resize-none"
                />
                
                {/* AI Overlay Suggestion */}
                <AnimatePresence>
                  {!message && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute left-4 top-20 flex flex-col gap-3 pointer-events-none"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-black text-curator-teal uppercase tracking-widest bg-curator-teal/5 px-3 py-1.5 rounded-lg border border-curator-teal/20">
                        <Sparkles size={12} /> AI Suggestions
                      </div>
                      <div className="space-y-2 opacity-30">
                         <div className="w-48 h-3 bg-curator-border rounded"></div>
                         <div className="w-32 h-3 bg-curator-border rounded"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-curator-border flex items-center justify-between bg-curator-bg/50">
          <div className="flex gap-2">
            <button className="p-3 text-curator-text-secondary hover:bg-curator-card rounded-xl transition-all border border-transparent hover:border-curator-border">
              <Paperclip size={20} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-curator-teal/10 text-curator-teal rounded-xl text-xs font-black uppercase tracking-widest border border-curator-teal/20 hover:bg-curator-teal/20 transition-all">
               <Sparkles size={16} /> Draft with Claude
            </button>
          </div>
          <button className="bg-curator-teal text-curator-bg px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:shadow-[0_10px_30px_rgba(0,212,180,0.3)] transition-all">
            Send Message <Send size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ComposeModal;

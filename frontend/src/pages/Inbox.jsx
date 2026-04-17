import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Calendar, MoreHorizontal, Sparkles, Send, Zap, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import TagBadge from '../components/ui/TagBadge';
import { formatDistanceToNow, parseISO } from 'date-fns';

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const fetchRealMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/messages/sync');
      if (res.data.items) {
        setMessages(res.data.items);
      }
    } catch (err) {
      console.error("Sync failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealMessages();
  }, []);

  const filteredMessages = filter === 'Priority' 
    ? messages.filter(m => (m.priority_score || 0) >= 80 || m.category === 'urgent')
    : messages;

  if (loading) {
    return (
      <div className="flex h-full -mx-10 -mt-10 overflow-hidden w-[calc(100%+5rem)] animate-pulse">
        <div className="flex-1 px-8 pb-12 pt-10 flex flex-col gap-6">
          <div className="h-8 w-48 bg-curator-border rounded mb-4"></div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-curator-card rounded-2xl border border-curator-border"></div>
          ))}
        </div>
        <div className="w-96 bg-curator-card border-l border-curator-border h-full p-8 hidden lg:block">
          <div className="h-6 w-3/4 bg-curator-border rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-curator-border rounded mb-8"></div>
          <div className="space-y-4">
             <div className="h-24 bg-curator-bg rounded-xl border border-curator-border"></div>
             <div className="h-48 bg-curator-bg rounded-xl border border-curator-border"></div>
          </div>
        </div>
      </div>
    );
  }

  const activeMessage = filteredMessages[0];

  return (
    <div className="flex h-full bg-curator-bg text-curator-text-primary overflow-hidden">
      {/* Feed Column */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-32 pt-6 flex flex-col gap-4 custom-scrollbar">
        {/* Status Area */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="font-headline text-3xl font-black text-curator-text-primary tracking-tight">Good Morning</h1>
            <p className="text-sm text-curator-text-secondary mt-1">You have <span className="text-curator-teal font-black">3 urgent</span> items requiring attention.</p>
          </div>
          <div className="flex gap-2 bg-curator-card border border-curator-border p-1 rounded-xl">
             {['All', 'Priority'].map(f => (
               <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg transition-all ${filter === f ? 'bg-curator-bg text-curator-teal shadow-lg' : 'text-curator-text-secondary hover:text-curator-text-primary'}`}
               >
                 {f}
               </button>
             ))}
          </div>
        </div>

        {/* Message Feed */}
        {filteredMessages.map((msg, i) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/inbox/${msg.id}`)}
            className={`group relative bg-curator-card rounded-2xl p-4 sm:p-6 border transition-all duration-300 cursor-pointer ${
              ((msg.priority_score || 0) >= 80 || msg.category === 'urgent') ? 'border-curator-teal/30 shadow-[0_8px_30px_rgba(0,0,0,0.3)] bg-curator-teal/[0.02]' : 'border-curator-border/50 hover:border-curator-border'
            }`}
          >
            {((msg.priority_score || 0) >= 80 || msg.category === 'urgent') && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-curator-teal rounded-r-full shadow-[0_0_15px_rgba(0,212,180,0.5)]"></div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-curator-bg border border-curator-border flex items-center justify-center">
                  {msg.source === 'gmail' && <Mail size={18} className="text-curator-red" />}
                  {msg.source === 'slack' && <MessageSquare size={18} className="text-curator-teal" />}
                </div>
                <div>
                  <p className="font-bold text-curator-text-primary text-sm group-hover:text-curator-teal transition-colors">
                    {msg.sender_display || msg.sender_handle || 'Unknown'} 
                    <span className="text-curator-text-secondary font-medium text-xs ml-3 opacity-50">
                      {msg.created_at ? formatDistanceToNow(parseISO(msg.created_at), { addSuffix: true }) : 'Just now'}
                    </span>
                  </p>
                  <TagBadge type={(msg.priority_score || 0) >= 80 ? 'urgent' : msg.tone || 'default'}>{msg.category || 'inbox'}</TagBadge>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-black text-curator-text-primary mb-2 tracking-tight line-clamp-1">{msg.subject || '(No Subject)'}</h3>
            <p className="text-sm text-curator-text-secondary line-clamp-2 leading-relaxed opacity-80">
              <span className="text-curator-teal font-bold mr-2 tracking-widest uppercase text-[10px]">AI Summary:</span>
              {msg.summary || msg.body_text?.slice(0, 100)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Right Side Panel (Active Thread Preview) */}
      <div className="hidden lg:flex w-[400px] bg-curator-card border-l border-curator-border flex-col shadow-2xl relative z-10">
        <div className="p-8 border-b border-curator-border">
          <div className="flex justify-between items-start mb-6">
             <TagBadge type="urgent">Active Priority</TagBadge>
             <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/inbox/${activeMessage?.id}/analysis`)}
                  className="p-2 text-curator-teal hover:bg-curator-teal/10 rounded-xl transition-all border border-transparent hover:border-curator-teal/20"
                >
                  <Sparkles size={20} />
                </button>
                <button className="p-2 text-curator-text-secondary hover:bg-curator-bg rounded-xl border border-transparent hover:border-curator-border transition-all">
                  <MoreHorizontal size={20} />
                </button>
             </div>
          </div>
          <h2 className="text-2xl font-black text-curator-text-primary leading-tight tracking-tight">{activeMessage?.subject}</h2>
        </div>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
           <div className="bg-curator-teal/5 border border-curator-teal/20 p-6 rounded-3xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
                 <Sparkles size={80} />
              </div>
              <div className="flex items-center gap-2 mb-4 text-curator-teal font-black text-xs uppercase tracking-widest">
                 <Sparkles size={16} />
                 Curator Deep Context
              </div>
              <p className="text-sm text-curator-text-primary leading-relaxed font-medium">
                 {activeMessage?.summary || "No AI summary available for this message."}
              </p>
           </div>

           <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-curator-bg border border-curator-border flex items-center justify-center font-black text-xs text-curator-teal">
                   {(activeMessage?.sender_display || activeMessage?.sender_handle || 'UNK').substring(0, 2).toUpperCase()}
                 </div>
                 <div>
                    <p className="text-sm font-black text-curator-text-primary">{activeMessage?.sender_display || activeMessage?.sender_handle || 'Unknown'}</p>
                    <p className="text-[10px] font-bold text-curator-text-secondary uppercase tracking-widest">
                       {activeMessage?.created_at ? formatDistanceToNow(parseISO(activeMessage.created_at), { addSuffix: true }) : ''}
                    </p>
                 </div>
              </div>
              <div className="pl-14 text-sm text-curator-text-secondary leading-relaxed space-y-4">
                 <p>{activeMessage?.body_text}</p>
              </div>
           </div>
        </div>

        <div className="p-8 border-t border-curator-border bg-curator-bg/30 backdrop-blur-md">
           <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-curator-text-secondary uppercase tracking-widest">
              <Zap size={14} className="text-curator-teal" />
              Smart Actions
           </div>
           <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-xl bg-curator-bg border border-curator-border text-xs text-curator-text-secondary hover:border-curator-teal/50 transition-all truncate">
                 "I'll have those numbers for you shortly."
              </button>
              <div className="relative">
                 <input 
                  type="text" 
                  placeholder="Type a custom reply..." 
                  className="w-full bg-curator-bg border border-curator-border rounded-xl py-3 pl-4 pr-12 text-xs text-curator-text-primary focus:outline-none focus:border-curator-teal/50 transition-all"
                 />
                 <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-curator-teal hover:scale-110 transition-transform">
                    <Send size={16} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;

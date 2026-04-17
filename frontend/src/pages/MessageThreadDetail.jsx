import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MoreHorizontal, Sparkles, Send, Zap, Mail, MessageSquare, Phone, ChevronRight, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockMessages } from '../data/mockData';
import TagBadge from '../components/ui/TagBadge';

const MessageThreadDetail = () => {
  const [loading, setLoading] = useState(true);
  const { threadId } = useParams();
  const navigate = useNavigate();
  
  const message = mockMessages.find(m => m.id === threadId) || mockMessages[0];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [threadId]);

  if (loading) {
    return (
      <div className="flex flex-col h-full animate-pulse">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-8 bg-curator-border rounded"></div>
          <div className="w-48 h-8 bg-curator-border rounded"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-curator-card rounded-3xl p-8 border border-curator-border h-64"></div>
            <div className="bg-curator-card rounded-3xl p-8 border border-curator-border h-32"></div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-curator-card rounded-3xl p-8 border border-curator-border h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/inbox')}
          className="flex items-center gap-2 text-curator-text-secondary hover:text-curator-teal transition-colors font-bold text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Inbox
        </button>
        <div className="flex gap-2">
          <button className="p-2 text-curator-text-secondary hover:bg-curator-card rounded-xl border border-curator-border transition-all">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-curator-card border border-curator-border rounded-3xl p-8 shadow-xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-curator-bg border border-curator-border flex items-center justify-center">
                   {message.source === 'gmail' && <Mail className="text-curator-red" />}
                   {message.source === 'slack' && <MessageSquare className="text-curator-teal" />}
                </div>
                <div>
                  <h1 className="text-2xl font-black text-curator-text-primary tracking-tight">{message.subject}</h1>
                  <p className="text-sm text-curator-text-secondary">{message.sender} • {message.time}</p>
                </div>
              </div>
              <TagBadge type={message.status}>{message.status}</TagBadge>
            </div>

            <div className="prose prose-invert max-w-none text-curator-text-secondary leading-relaxed mb-8">
               <p>Hi team,</p>
               <p>Reviewing the latest draft for the board meeting tomorrow. We are almost there, but I noticed we are still missing the finalized revenue projections on slide 14.</p>
               <p>Also, the user growth chart on slide 18 is a bit too dense. Can we simplify it to just show MAU vs DAU over the last 4 quarters?</p>
               <p>I need final sign-off by 2 PM EST today. Thanks!</p>
            </div>

            <div className="border-t border-curator-border pt-6">
              <div className="relative">
                <textarea 
                  className="w-full bg-curator-bg border border-curator-border rounded-2xl p-4 text-sm text-curator-text-primary focus:outline-none focus:border-curator-teal/50 transition-all min-h-[120px] placeholder:text-curator-text-secondary/30"
                  placeholder="Type your reply..."
                ></textarea>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button className="bg-curator-teal text-curator-bg font-black px-6 py-2 rounded-xl text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,212,180,0.3)] transition-all">
                    Send <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-curator-teal/5 border border-curator-teal/20 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={64} />
            </div>
            <div className="flex items-center gap-2 mb-4 text-curator-teal font-black text-sm uppercase tracking-widest">
              <Sparkles size={16} />
              AI Insights
            </div>
            <p className="text-sm text-curator-text-primary leading-relaxed mb-6 font-medium">
              Sarah needs "Revenue Projections" for slide 14. Your last update from Finance mentioned these would be ready by 1 PM.
            </p>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-curator-text-secondary uppercase tracking-tighter">Draft Suggestion</h4>
              <button className="w-full text-left p-3 rounded-xl bg-curator-card border border-curator-border text-xs text-curator-text-secondary hover:border-curator-teal/50 transition-all">
                "I'll have those numbers from Finance after our 1 PM sync."
              </button>
              <button 
                onClick={() => navigate(`/inbox/${threadId}/analysis`)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-curator-teal text-curator-bg text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all"
              >
                Full AI Analysis <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MessageThreadDetail;


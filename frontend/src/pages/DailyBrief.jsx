import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Zap, MessageSquare, ChevronRight, RefreshCw, CheckCircle2, LayoutGrid } from 'lucide-react';
import { api } from '../api';

const DailyBrief = () => {
  const [loading, setLoading] = useState(false);
  const [briefText, setBriefText] = useState(null);

  const fetchBrief = async () => {
    try {
      setLoading(true);
      const res = await api.get('/messages/brief');
      if (res.data.brief) {
        setBriefText(res.data.brief);
      }
    } catch (err) {
      console.error("Brief failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, []);

  const handleRefresh = () => {
    fetchBrief();
  };

  const briefs = [
    { title: 'Executive Summary', icon: Sparkles, content: 'You have 3 high-priority items. The Q3 Board Deck approval is needed by 2 PM. Marketing figures have been revised to $450k.', color: 'text-curator-teal' },
    { title: 'Meetings & Syncs', icon: Calendar, content: 'Finance Sync at 1:00 PM (Critical for revenue data). Design Review at 4:30 PM (FYI).', color: 'text-curator-amber' },
    { title: 'Action Required', icon: Zap, content: 'Approve marketing spend reduction. Review slide 18 chart density. Confirm lunch with Alex.', color: 'text-curator-red' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center pt-20">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-8"
        >
          <Sparkles size={48} className="text-curator-teal shadow-[0_0_20px_rgba(0,212,180,0.4)]" />
        </motion.div>
        <h2 className="text-2xl font-black text-curator-text-primary mb-4 tracking-tight">Regenerating with Claude...</h2>
        <p className="text-curator-text-secondary mb-12">Synthesizing your communications and prioritizing your workload.</p>
        
        <div className="grid grid-cols-1 gap-6 w-full">
           {[1, 2, 3].map(i => (
             <div key={i} className="bg-curator-card border border-curator-border/50 rounded-2xl p-6 h-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-curator-teal/5 to-transparent animate-shimmer -translate-x-full"></div>
                <div className="w-1/4 h-4 bg-curator-border/50 rounded mb-4"></div>
                <div className="w-full h-3 bg-curator-border/30 rounded mb-2"></div>
                <div className="w-5/6 h-3 bg-curator-border/30 rounded"></div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-4 md:px-0 pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 pt-6">
        <div>
          <div className="flex items-center gap-2 text-curator-teal font-black text-xs uppercase tracking-[0.2em] mb-2">
            <Sparkles size={14} />
            AI Daily Synthesis
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-black text-curator-text-primary tracking-tight">Your Daily Brief</h1>
        </div>
        <button 
          onClick={handleRefresh}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-curator-card border border-curator-border rounded-xl text-xs font-bold text-curator-text-secondary hover:text-curator-teal transition-all group"
        >
          <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          Regenerate Brief
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-curator-card border border-curator-border p-6 md:p-8 rounded-3xl shadow-xl hover:border-curator-teal/30 transition-all flex flex-col h-full group"
        >
          <div className="p-3 w-fit rounded-xl bg-curator-bg border border-curator-border mb-6 group-hover:scale-110 transition-transform">
            <Sparkles size={24} className="text-curator-teal" />
          </div>
          <h3 className="font-bold text-curator-text-primary text-xl mb-4">Curated Inbox Zero Brief</h3>
          
          <div className="text-sm text-curator-text-secondary leading-relaxed flex-1 markdown-body">
            {briefText ? (
              <div dangerouslySetInnerHTML={{ __html: briefText.replace(/\n/g, '<br/>') }} />
            ) : (
              <p>No brief available.</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="bg-curator-teal/5 border border-curator-teal/20 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
           <CheckCircle2 size={120} />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-curator-teal flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,212,180,0.3)]">
             <MessageSquare size={32} className="text-curator-bg" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-black text-curator-text-primary mb-2">Ready to clear your plate?</h3>
            <p className="text-sm text-curator-text-secondary leading-relaxed max-w-xl">
              We identified 12 notifications that are likely trivial updates. You can archive them all at once to achieve Inbox Zero.
            </p>
          </div>
          <button className="px-8 py-3 bg-curator-teal text-curator-bg font-black rounded-2xl hover:shadow-2xl transition-all whitespace-nowrap">
            Archive All Trivial
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyBrief;


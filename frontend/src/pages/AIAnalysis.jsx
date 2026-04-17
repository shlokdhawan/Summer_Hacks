import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Clock, Target, Link2, FileText, ChevronRight, Zap, ZapOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockMessages } from '../data/mockData';

const AIAnalysis = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const message = mockMessages.find(m => m.id === threadId) || mockMessages[0];

  const timeline = [
    { time: '09:15 AM', event: 'Sarah Jenkins requested Q3 figures.', status: 'pending' },
    { time: '11:30 AM', event: 'David Chen provided revised marketing spend ($450k).', status: 'completed' },
    { time: '12:45 PM', event: 'AI detected discrepancy in slide 14 revenue data.', status: 'alert' },
  ];

  const relatedArtifacts = [
    { name: 'Q3_Marketing_Final.pdf', type: 'PDF', size: '2.4 MB' },
    { name: 'Revenue_Projections_V2.xlsx', type: 'Excel', size: '1.1 MB' },
    { name: 'Board_Deck_Draft_Final.pptx', type: 'PPT', size: '15.8 MB' },
  ];

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto px-4 md:px-0 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 pt-6">
        <button 
          onClick={() => navigate(`/inbox/${threadId}`)}
          className="flex items-center gap-2 text-curator-text-secondary hover:text-curator-teal transition-colors font-bold text-sm"
        >
          <ArrowLeft size={18} /> Back to Thread
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-curator-teal/10 rounded-xl text-curator-teal self-end sm:self-auto">
          <Sparkles size={16} />
          <span className="text-xs font-black uppercase tracking-widest">Claude Full Analysis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Analysis */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h1 className="text-4xl font-black text-curator-text-primary tracking-tight mb-4">Thread Deep Dive</h1>
            <p className="text-lg text-curator-text-secondary leading-relaxed">
              This thread revolves around the final sign-off for the Q3 Board Deck. The primary blocker was the Marketing Allocation, which has now been resolved by David.
            </p>
          </section>

          {/* Timeline */}
          <section className="bg-curator-card border border-curator-border rounded-3xl p-8 relative overflow-hidden">
             <h3 className="text-xs font-black text-curator-teal uppercase tracking-[0.2em] mb-8">Interaction Timeline</h3>
             <div className="space-y-8 relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-curator-border"></div>
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-6 relative z-10">
                     <div className={`w-6 h-6 rounded-full border-4 border-curator-bg flex items-center justify-center ${
                       item.status === 'completed' ? 'bg-curator-teal' : item.status === 'alert' ? 'bg-curator-red' : 'bg-curator-border'
                     }`}></div>
                     <div>
                        <span className="text-[10px] font-black text-curator-text-secondary uppercase tracking-widest block mb-1">{item.time}</span>
                        <p className={`text-sm font-bold ${item.status === 'alert' ? 'text-curator-red' : 'text-curator-text-primary'}`}>{item.event}</p>
                     </div>
                  </div>
                ))}
             </div>
          </section>

          {/* Key Topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-curator-card border border-curator-border p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-curator-teal/10 text-curator-teal">
                    <Target size={20} />
                  </div>
                  <h3 className="font-bold text-curator-text-primary">Key Decisions</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2 text-sm text-curator-text-secondary">
                    <CheckCircle2 size={16} className="text-curator-teal shrink-0 mt-0.5" />
                    Marketing spend capped at $450k.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-curator-text-secondary">
                    <CheckCircle2 size={16} className="text-curator-teal shrink-0 mt-0.5" />
                    Slide 18 chart simplified to DAU/MAU.
                  </li>
                </ul>
             </div>
             <div className="bg-curator-red/5 border border-curator-red/20 p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-curator-red/10 text-curator-red">
                    <Zap size={20} />
                  </div>
                  <h3 className="font-bold text-curator-text-primary">Open Risks</h3>
                </div>
                <ul className="space-y-4 text-sm text-curator-text-secondary">
                   <li className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-curator-red shrink-0 mt-0.5" />
                      Slide 14 revenue projections still mismatch finance data.
                   </li>
                </ul>
             </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-curator-card border border-curator-border rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xs font-black text-curator-text-secondary uppercase tracking-[0.2em] mb-6">Related Artifacts</h3>
              <div className="space-y-4">
                 {relatedArtifacts.map((file, i) => (
                   <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-curator-bg/50 border border-transparent hover:border-curator-border transition-all cursor-pointer group">
                      <div className="p-3 rounded-xl bg-curator-bg border border-curator-border group-hover:text-curator-teal transition-colors">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-xs font-bold text-curator-text-primary truncate">{file.name}</p>
                         <p className="text-[10px] text-curator-text-secondary font-medium">{file.type} • {file.size}</p>
                      </div>
                      <Link2 size={14} className="text-curator-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-curator-teal p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,212,180,0.3)] relative overflow-hidden group cursor-pointer">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                <Zap size={120} />
              </div>
              <h3 className="text-xl font-black text-curator-bg mb-2">Smart Action</h3>
              <p className="text-curator-bg/70 text-sm leading-relaxed mb-6">
                Generate a summary email for the Board based on these findings?
              </p>
              <button className="w-full py-4 bg-curator-bg text-curator-teal font-black rounded-2xl uppercase tracking-[0.1em] text-xs shadow-xl flex items-center justify-center gap-2 group-hover:bg-curator-card transition-colors">
                Generate Draft <ChevronRight size={16} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;

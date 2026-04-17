import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Building, User, MailCheck, Clock, TrendingUp, BarChart2, MessageSquare, ChevronRight, Send, ExternalLink } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockContacts, mockMessages } from '../data/mockData';
import TagBadge from '../components/ui/TagBadge';

const SenderProfile = () => {
  const { senderId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Threads');
  
  const contact = mockContacts.find(c => c.id === senderId) || mockContacts[0];
  const contactThreads = mockMessages.filter(m => m.sender === contact.name);

  const tabs = ['Threads', 'About', 'Insights'];

  const stats = [
    { label: 'Total Threads', value: contact.threads, icon: MessageSquare },
    { label: 'Last Contact', value: `${contact.lastContact}d ago`, icon: Clock },
    { label: 'Importance', value: `${contact.importance}/10`, icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto pb-20">
      {/* Top Profile Card */}
      <div className="bg-curator-card border border-curator-border rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <User size={120} />
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          <img 
            src={contact.avatar} 
            alt={contact.name}
            className="w-32 h-32 rounded-3xl object-cover border-4 border-curator-teal/20 shadow-xl"
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
              <h1 className="text-4xl font-black text-curator-text-primary tracking-tight">{contact.name}</h1>
              <TagBadge type="teal">Score {contact.importance}/10</TagBadge>
            </div>
            <p className="text-lg text-curator-text-secondary mb-6">{contact.role} at {contact.company}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
              {contact.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-curator-bg border border-curator-border rounded-lg text-[10px] font-bold text-curator-text-secondary uppercase tracking-widest">{tag}</span>
              ))}
            </div>

            <div className="flex gap-4">
              <button className="flex-1 md:flex-none px-8 py-3 bg-curator-teal text-curator-bg font-black rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_10px_30px_rgba(0,212,180,0.3)] transition-all">
                <Send size={18} /> Send Message
              </button>
              <button className="p-3 bg-curator-bg border border-curator-border text-curator-text-secondary rounded-2xl hover:text-curator-teal hover:border-curator-teal transition-all">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 w-full md:w-48">
             {stats.map((s, i) => (
                <div key={i} className="bg-curator-bg/50 border border-curator-border p-4 rounded-2xl text-center md:text-left">
                  <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                    <s.icon size={14} className="text-curator-teal" />
                    <span className="text-[10px] font-bold text-curator-text-secondary uppercase tracking-widest">{s.label}</span>
                  </div>
                  <p className="text-xl font-black text-curator-text-primary">{s.value}</p>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-curator-border mb-8 px-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === tab ? 'text-curator-teal' : 'text-curator-text-secondary hover:text-curator-text-primary'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-curator-teal rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'Threads' && (
          <motion.div 
            key="threads"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {contactThreads.map(msg => (
              <div 
                key={msg.id}
                onClick={() => navigate(`/inbox/${msg.id}`)}
                className="bg-curator-card border border-curator-border p-6 rounded-2xl hover:border-curator-teal/50 transition-all cursor-pointer group flex justify-between items-center"
              >
                <div>
                   <h4 className="font-bold text-curator-text-primary group-hover:text-curator-teal transition-colors mb-1">{msg.subject}</h4>
                   <p className="text-sm text-curator-text-secondary line-clamp-1">{msg.snippet}</p>
                </div>
                <div className="flex items-center gap-4 text-right shrink-0">
                  <span className="text-xs text-curator-text-secondary font-bold">{msg.time}</span>
                  <ChevronRight size={18} className="text-curator-text-secondary" />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'About' && (
          <motion.div 
            key="about"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
               <div className="bg-curator-card border border-curator-border p-6 rounded-3xl">
                  <h3 className="text-xs font-black text-curator-teal uppercase tracking-[0.2em] mb-6">Contact Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-curator-text-secondary">
                      <Mail size={18} />
                      <span className="text-sm">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-curator-text-secondary">
                      <Phone size={18} />
                      <span className="text-sm">{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-4 text-curator-text-secondary">
                      <Building size={18} />
                      <span className="text-sm">{contact.company}</span>
                    </div>
                  </div>
               </div>
            </div>
            <div className="bg-curator-teal/5 border border-curator-teal/20 p-6 rounded-3xl">
               <h3 className="text-xs font-black text-curator-teal uppercase tracking-[0.2em] mb-6">AI Context</h3>
               <p className="text-sm text-curator-text-primary leading-relaxed">
                 Sarah is one of your most frequent contacts. Most interactions revolve around project management and final sign-offs. Her tone is generally professional and action-oriented.
               </p>
               <div className="mt-6 flex flex-wrap gap-2">
                 {['Fast responder', 'High priority'].map(tag => (
                   <span key={tag} className="text-[10px] font-bold bg-curator-teal/20 text-curator-teal px-2 py-1 rounded-lg"># {tag}</span>
                 ))}
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Insights' && (
          <motion.div 
            key="insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Response Time and Volume */}
               <div className="bg-curator-card border border-curator-border p-8 rounded-3xl">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xs font-black text-curator-text-secondary uppercase tracking-[0.2em]">Activity Volume (30d)</h3>
                    <div className="flex gap-1"> {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-curator-teal/30"></div>)}</div>
                  </div>
                  <div className="flex items-end justify-between h-40 gap-2">
                    {contact.stats.volume30d.map((v, i) => (
                      <div key={i} className="flex-1 relative group">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(v / 30) * 100}%` }}
                          className="w-full bg-curator-teal/40 group-hover:bg-curator-teal rounded-t-lg transition-colors border-t border-curator-teal/50"
                        ></motion.div>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-curator-teal opacity-0 group-hover:opacity-100 transition-opacity">
                          {v}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] font-bold text-curator-text-secondary uppercase tracking-tighter opacity-50 px-2">
                    <span>4w ago</span>
                    <span>Recent</span>
                  </div>
               </div>

               {/* Tone breakdown */}
               <div className="bg-curator-card border border-curator-border p-8 rounded-3xl">
                  <h3 className="text-xs font-black text-curator-text-secondary uppercase tracking-[0.2em] mb-10">Tone Analysis</h3>
                  <div className="space-y-8">
                     {[
                       { label: 'Professional', value: contact.stats.toneBreakdown.professional, color: 'bg-curator-teal' },
                       { label: 'Neutral', value: contact.stats.toneBreakdown.neutral, color: 'bg-curator-amber' },
                       { label: 'Urgent', value: contact.stats.toneBreakdown.urgent, color: 'bg-curator-red' },
                     ].map(t => (
                       <div key={t.label} className="space-y-2">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-widest px-1">
                             <span className="text-curator-text-secondary">{t.label}</span>
                             <span className="text-curator-text-primary">{t.value}%</span>
                          </div>
                          <div className="h-2 bg-curator-bg border border-curator-border rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${t.value}%` }}
                                className={`h-full ${t.color}`} 
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Most active hours */}
            <div className="bg-curator-card border border-curator-border p-8 rounded-3xl">
               <h3 className="text-xs font-black text-curator-text-secondary uppercase tracking-[0.2em] mb-10">Most Active Hours</h3>
               <div className="flex items-end justify-between h-32 gap-3 px-2">
                  {contact.stats.activeHours.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3">
                       <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(h / 20) * 100}%` }}
                          className={`w-full rounded-full ${h > 12 ? 'bg-curator-teal shadow-[0_0_15px_rgba(0,212,180,0.3)]' : 'bg-curator-teal/20'}`}
                       />
                       <span className="text-[10px] font-bold text-curator-text-secondary opacity-50">{i * 4}h</span>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SenderProfile;

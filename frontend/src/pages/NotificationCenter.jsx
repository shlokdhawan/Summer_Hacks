import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Filter, AlertTriangle, AtSign, MessageCircle, Info, MoreHorizontal } from 'lucide-react';
import { mockNotifications } from '../data/mockData';
import EmptyState from '../components/ui/EmptyState';

const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Urgent', 'Mentions', 'System'];
  
  const filteredNotifications = activeTab === 'All' 
    ? mockNotifications 
    : mockNotifications.filter(n => n.type === activeTab.toLowerCase());

  const groups = ['Today', 'Yesterday', 'Earlier'];

  const getIcon = (type) => {
    switch (type) {
      case 'urgent': return <AlertTriangle size={18} className="text-curator-red" />;
      case 'mention': return <AtSign size={18} className="text-curator-teal" />;
      case 'system': return <Bell size={18} className="text-curator-text-secondary" />;
      default: return <Info size={18} />;
    }
  };

  const getBorder = (type) => {
    switch (type) {
      case 'urgent': return 'border-l-curator-red';
      case 'mention': return 'border-l-curator-teal';
      default: return 'border-l-curator-border';
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="font-headline text-2xl md:text-3xl font-black text-curator-text-primary tracking-tight">Notifications</h1>
          <p className="text-xs md:text-sm text-curator-text-secondary">Stay updated with system events and mentions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-curator-teal/10 hover:bg-curator-teal/20 text-[10px] md:text-xs font-black uppercase tracking-widest text-curator-teal rounded-xl transition-all whitespace-nowrap">
          <Check size={14} /> Mark all read
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-curator-card border border-curator-border w-fit max-w-full overflow-x-auto scrollbar-hide mb-10 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 md:px-6 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-curator-bg text-curator-teal shadow-lg border border-curator-teal/20' 
                : 'text-curator-text-secondary hover:text-curator-text-primary hover:bg-curator-bg/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {groups.map((group) => {
          const groupNotifications = filteredNotifications.filter(n => n.group === group);
          if (groupNotifications.length === 0) return null;

          return (
            <div key={group} className="space-y-4">
              <h3 className="text-[10px] font-black text-curator-text-secondary uppercase tracking-[0.2em] px-2">{group}</h3>
              <div className="space-y-3">
                {groupNotifications.map((notif) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={notif.id}
                    className={`bg-curator-card border border-curator-border border-l-4 rounded-xl p-5 flex items-start gap-4 hover:border-curator-teal/30 transition-all cursor-pointer group shadow-lg ${getBorder(notif.type)}`}
                  >
                    <div className={`p-3 rounded-xl bg-curator-bg border border-curator-border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-1">
                        <h4 className="font-bold text-curator-text-primary text-sm group-hover:text-curator-teal transition-colors truncate pr-4">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-curator-text-secondary font-bold flex-shrink-0">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-curator-text-secondary leading-relaxed line-clamp-2 md:line-clamp-none">
                        {notif.description}
                      </p>
                    </div>
                    {notif.unread && (
                      <div className="w-2.5 h-2.5 bg-curator-teal rounded-full mt-2 shadow-[0_0_10px_rgba(0,212,180,0.5)]"></div>
                    )}
                    <button className="opacity-0 group-hover:opacity-100 p-2 text-curator-text-secondary">
                      <MoreHorizontal size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredNotifications.length === 0 && (
          <EmptyState 
            icon="Bell"
            title="You're all caught up"
            subtext="No new notifications at the moment."
          />
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;

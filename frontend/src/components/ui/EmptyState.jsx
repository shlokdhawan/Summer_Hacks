import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

const EmptyState = ({ icon = 'Inbox', title, subtext, actionLabel, onAction }) => {
  const Icon = LucideIcons[icon] || LucideIcons.Inbox;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-curator-card border border-curator-border flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-curator-teal/5 group-hover:bg-curator-teal/10 transition-colors"></div>
        <Icon size={32} className="text-curator-teal relative z-10" />
      </div>
      <h3 className="font-headline text-xl font-bold text-curator-text-primary mb-2">{title}</h3>
      <p className="font-body text-curator-text-secondary max-w-sm leading-relaxed mb-8">
        {subtext}
      </p>
      {actionLabel && (
        <button 
          onClick={onAction}
          className="bg-curator-teal text-curator-bg font-bold px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(0,212,180,0.3)] hover:scale-105 transition-all duration-300"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;

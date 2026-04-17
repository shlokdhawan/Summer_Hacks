import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox, Sparkles, Network, Settings, Search, Plus } from 'lucide-react';
import ComposeModal from '../modals/ComposeModal';

export default function AppLayout() {
  const location = useLocation();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const mobileNavItems = [
    { to: '/inbox', icon: Inbox, label: 'Inbox' },
    { to: '/daily-brief', icon: Sparkles, label: 'Brief' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/relation-graph', icon: Network, label: 'Graph' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="flex h-screen w-full bg-curator-bg text-curator-text-primary overflow-x-hidden">
      {/* Sidebar - Desktop (Fixed) & Mobile (Drawer) */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden"
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col md:ml-[240px] relative min-w-0 pb-20 md:pb-0">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 p-0 md:p-8 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <ComposeModal 
          isOpen={isComposeOpen} 
          onClose={() => setIsComposeOpen(false)} 
        />

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-curator-bg/80 backdrop-blur-xl border-t border-curator-border h-16 flex md:hidden items-center justify-around px-2 z-50">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive ? 'text-curator-teal' : 'text-curator-text-secondary'
                }`
              }
            >
              <item.icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Global Compose FAB */}
        <button 
          onClick={() => setIsComposeOpen(true)}
          className="fixed bottom-20 right-6 md:bottom-10 md:right-10 w-14 h-14 rounded-2xl bg-curator-teal text-curator-bg shadow-[0_8px_30px_rgba(0,212,180,0.4)] hover:shadow-[0_8px_40px_rgba(0,212,180,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center z-40 group"
        >
          <Plus size={28} className="transition-transform duration-300 group-hover:rotate-90" />
        </button>
      </div>
    </div>
  );
}



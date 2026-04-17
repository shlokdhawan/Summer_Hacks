import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Inbox, Sparkles, Network, Settings, Search, Bell, X, MessageSquare } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function Sidebar({ isMobileOpen, onClose }) {
  const { user } = useUser();
  const navItems = [
    { to: '/inbox', icon: Inbox, label: 'Inbox' },
    { to: '/chat-inbox', icon: MessageSquare, label: 'Inbox Memory' },
    { to: '/daily-brief', icon: Sparkles, label: 'Daily Brief' },
    { to: '/relation-graph', icon: Network, label: 'Relation Graph' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <nav className={`
      fixed left-0 top-0 h-full w-[260px] md:w-[240px] bg-curator-card border-r border-curator-border py-8 px-4 z-50 transition-transform duration-300
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0 ${isMobileOpen ? 'flex' : 'hidden'} md:flex flex-col
    `}>
      <div className="flex items-center justify-between mb-10 px-2">
        <Link to="/" onClick={onClose} className="flex items-center gap-3 group/logo transition-transform hover:scale-[1.02] active:scale-95">
          <div className="w-10 h-10 rounded-xl bg-curator-teal flex items-center justify-center shadow-[0_0_20px_rgba(0,212,180,0.3)] group-hover/logo:shadow-[0_0_30px_rgba(0,212,180,0.5)] transition-all">
            <Sparkles className="text-curator-bg" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-curator-text-primary leading-tight">Curator</h2>
            <p className="text-[10px] text-curator-teal font-bold uppercase tracking-widest opacity-80">AI Unified</p>
          </div>
        </Link>
        <button 
          onClick={onClose}
          className="md:hidden p-2 text-curator-text-secondary hover:text-curator-teal transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <ul className="flex flex-col gap-1 flex-grow">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'text-curator-teal bg-curator-teal/10 border border-curator-teal/20'
                    : 'text-curator-text-secondary hover:text-curator-text-primary hover:bg-curator-border/30'
                }`
              }
            >
              <item.icon size={20} className={`transition-transform duration-300 group-hover:scale-110`} />
              <span className="font-headline text-sm font-semibold">{item.label}</span>
            </NavLink>
          </li>
        ))}
        {/* Mobile-only items that are pages in the new spec */}
        <li className="md:hidden">
          <NavLink to="/search" className="flex items-center gap-3 px-4 py-3 text-curator-text-secondary">
            <Search size={20} />
            <span className="font-headline text-sm font-semibold">Search</span>
          </NavLink>
        </li>
        <li className="md:hidden">
          <NavLink to="/notifications" className="flex items-center gap-3 px-4 py-3 text-curator-text-secondary">
            <Bell size={20} />
            <span className="font-headline text-sm font-semibold">Notifications</span>
          </NavLink>
        </li>
      </ul>
      
      <div className="mt-auto p-4 bg-curator-bg/50 rounded-2xl border border-curator-border/50">
        <div className="flex items-center gap-3 mb-3">
          <img 
            alt="User" 
            className="w-8 h-8 rounded-full border border-curator-teal/30 object-cover" 
            src={user.avatarUrl} 
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-curator-text-primary truncate">{user.name}</p>
            <p className="text-[10px] text-curator-text-secondary truncate">{user.plan}</p>
          </div>
        </div>
        <button className="w-full py-2 bg-curator-teal/10 text-curator-teal text-[10px] font-bold uppercase tracking-tighter rounded-lg border border-curator-teal/20 hover:bg-curator-teal hover:text-curator-bg transition-all">
          Upgrade Hub
        </button>
      </div>
    </nav>
  );
}


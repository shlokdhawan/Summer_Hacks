import { Bell, Search, Settings, Sparkles, MessageSquare, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <header className="bg-curator-bg/80 backdrop-blur-xl border-b border-curator-border w-full h-20 sticky top-0 z-40 flex justify-between items-center px-4 md:px-10">
      {/* Mobile Title & Menu */}
      <div className="flex items-center gap-3 md:hidden">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-curator-text-secondary hover:text-curator-teal transition-colors"
        >
          <Menu size={24} />
        </button>
        <Link to="/" className="flex items-center gap-2 group/logo">
          <Sparkles size={20} className="text-curator-teal group-hover/logo:scale-110 transition-transform" />
          <span className="font-headline text-lg font-bold text-curator-text-primary">Curator</span>
        </Link>
      </div>

      {/* Desktop Search */}
      <div className="hidden md:flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-curator-text-secondary group-focus-within:text-curator-teal transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search messages, people, or AI insights..." 
            className="w-full bg-curator-card border border-curator-border rounded-xl py-2 pl-10 pr-4 text-sm text-curator-text-primary focus:outline-none focus:border-curator-teal/50 transition-all placeholder:text-curator-text-secondary/50"
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/search?q=${e.target.value}`)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="md:hidden text-curator-text-secondary hover:text-curator-text-primary p-2">
          <Search size={20} onClick={() => navigate('/search')} />
        </button>
        <Link to="/notifications" className="relative p-2 text-curator-text-secondary hover:text-curator-text-primary transition-colors group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-curator-red rounded-full border-2 border-curator-bg"></span>
        </Link>
        <div className="hidden md:flex h-8 w-px bg-curator-border mx-2"></div>
        <button 
          onClick={() => navigate('/settings')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-curator-border hover:bg-curator-card transition-all"
        >
          <Settings size={16} className="text-curator-text-secondary" />
          <span className="text-xs font-bold text-curator-text-primary">Settings</span>
        </button>
      </div>
    </header>
  );
}


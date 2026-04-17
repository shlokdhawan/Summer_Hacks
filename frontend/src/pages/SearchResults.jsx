import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, X, Mail, MessageSquare, Phone, Send, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import EmptyState from '../components/ui/EmptyState';
import TagBadge from '../components/ui/TagBadge';
import { formatDistanceToNow, parseISO } from 'date-fns';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  const recentSearches = [
    'Q3 Board Deck', 'Sarah Jenkins', 'Budget', 'Marketing Sync', 'API Keys'
  ];

  const filterChips = [
    'All', 'Gmail', 'Slack', 'WhatsApp', 'Telegram', 'Urgent', 'This Week'
  ];

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (q) => {
    setLoading(true);
    try {
      const res = await api.post('/rag/query', {
        query: q,
        top_k: 10
      });
      setResults(res.data.hits || []);
    } catch (err) {
      console.error("Search failed", err);
      alert("Search failed. Ensure backend vector store is available.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const highlightMatch = (text, term) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === term.toLowerCase() 
            ? <span key={i} className="bg-curator-teal/20 text-curator-teal rounded px-0.5">{part}</span>
            : part
        )}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      {/* Search Bar */}
      <div className="relative mb-8 pt-4">
        <Search className="absolute left-4 top-[2.4rem] text-curator-teal" size={24} />
        <input 
          autoFocus
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="Search your unified universe..."
          className="w-full bg-curator-card border border-curator-border rounded-2xl py-5 pl-14 pr-16 text-xl text-curator-text-primary focus:outline-none focus:border-curator-teal/50 transition-all shadow-2xl placeholder:text-curator-text-secondary/30"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-[2.4rem] p-2 text-curator-text-secondary hover:text-curator-text-primary"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-10">
        {filterChips.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              filter === f 
                ? 'bg-curator-teal text-curator-bg border-curator-teal' 
                : 'bg-curator-card text-curator-text-secondary border-curator-border hover:border-curator-teal/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Results or Recents */}
      <div className="flex-1">
        {!query && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xs font-black text-curator-text-secondary uppercase tracking-widest mb-6">Recent Searches</h3>
            {recentSearches.map((s) => (
              <button 
                key={s}
                onClick={() => { setQuery(s); handleSearch(s); }}
                className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-curator-card group transition-colors text-left"
              >
                <Clock size={18} className="text-curator-text-secondary group-hover:text-curator-teal transition-colors" />
                <span className="text-curator-text-primary font-medium">{s}</span>
                <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-curator-text-secondary" />
              </button>
            ))}
          </motion.div>
        )}

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-curator-card rounded-2xl border border-curator-border animate-pulse"></div>
            ))}
          </div>
        )}

        {query && !loading && results.length === 0 && (
          <EmptyState 
            icon="Search"
            title="No results found"
            subtext={`We couldn't find anything matching "${query}". Try different keywords or filters.`}
          />
        )}

        {query && !loading && results.length > 0 && (
          <div className="space-y-4 pb-20">
            <p className="text-xs text-curator-text-secondary mb-4">{results.length} results found</p>
            {results.map((msg, idx) => (
              <div 
                key={msg.message_id || idx}
                onClick={() => navigate(`/inbox/${msg.message_id || msg.id}`)}
                className="bg-curator-card border border-curator-border/50 rounded-2xl p-6 hover:border-curator-teal/50 transition-all cursor-pointer group shadow-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-curator-bg flex items-center justify-center">
                        {msg.source === 'gmail' && <Mail size={14} className="text-curator-red" />}
                        {msg.source === 'slack' && <MessageSquare size={14} className="text-curator-teal" />}
                     </div>
                     <span className="text-sm font-bold text-curator-text-primary">{msg.sender_display || msg.sender || 'Unknown'}</span>
                     <TagBadge type={msg.source}>{msg.source}</TagBadge>
                  </div>
                  <span className="text-[10px] text-curator-text-secondary font-bold">
                    {msg.created_at ? formatDistanceToNow(parseISO(msg.created_at), { addSuffix: true }) : ''}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-curator-text-primary mb-2">
                  {highlightMatch(msg.subject || '(No Subject)', query)}
                </h4>
                <p className="text-sm text-curator-text-secondary line-clamp-2 leading-relaxed">
                  {highlightMatch(msg.snippet || '', query)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

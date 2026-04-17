import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, AlertCircle, CheckCircle2, 
  ChevronRight, ExternalLink, Filter, Search,
  Bell, MoreVertical, Trash2, MapPin
} from 'lucide-react';
import { api } from '../api';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events/reminders');
      // Sort by time
      const sorted = [...res.data].sort((a, b) => new Date(a.event_time) - new Date(b.event_time));
      setReminders(sorted);
    } catch (err) {
      console.error("Failed to fetch reminders:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReminders = reminders.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'sent') return r.status === 'sent';
    return true;
  });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col min-h-full w-full max-w-6xl mx-auto pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 px-6 pt-10">
        <div className="space-y-1">
          <h1 className="font-headline text-3xl md:text-5xl font-black text-curator-text-primary tracking-tight">
            Event Reminders
          </h1>
          <p className="text-sm text-curator-text-secondary">
            Intelligently extracted from your incoming communications.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === 'all' ? 'bg-curator-teal text-curator-bg shadow-lg shadow-curator-teal/20' : 'bg-curator-card text-curator-text-secondary border border-curator-border hover:border-curator-teal/50'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === 'pending' ? 'bg-curator-teal text-curator-bg shadow-lg shadow-curator-teal/20' : 'bg-curator-card text-curator-text-secondary border border-curator-border hover:border-curator-teal/50'
              }`}
            >
              Pending
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-curator-teal/20 border-t-curator-teal rounded-full animate-spin mb-4"></div>
          <p className="text-xs font-black text-curator-teal uppercase tracking-widest">Analyzing your schedule...</p>
        </div>
      ) : filteredReminders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-24 h-24 bg-curator-card border border-curator-border rounded-[2rem] flex items-center justify-center text-curator-text-secondary/20 mb-8 border-dashed">
                <Calendar size={48} />
            </div>
            <h2 className="text-xl font-bold text-curator-text-primary mb-2">No active reminders</h2>
            <p className="text-sm text-curator-text-secondary max-w-sm">Every time the AI detects a date in your messages, it will appear here and in your calendar.</p>
        </div>
      ) : (
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredReminders.map((reminder, idx) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-curator-card border border-curator-border rounded-[2.5rem] p-7 hover:border-curator-teal/30 hover:shadow-2xl hover:shadow-curator-teal/5 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl bg-curator-bg border border-curator-border group-hover:scale-110 group-hover:bg-curator-teal/5 transition-all`}>
                    <Calendar size={24} className="text-curator-teal" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase px-2 py-1 bg-curator-bg border border-curator-border rounded-md text-curator-text-secondary">
                        {reminder.intent}
                    </span>
                    {reminder.calendar_event_id && (
                        <div className="p-1 px-2 bg-green-500/10 text-green-500 rounded-md">
                            <CheckCircle2 size={12} />
                        </div>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-black text-curator-text-primary leading-tight mb-4 group-hover:text-curator-teal transition-colors">
                  {reminder.event_title}
                </h3>

                <div className="space-y-3 pt-4 border-t border-curator-border mt-auto">
                    <div className="flex items-center gap-3 text-curator-text-secondary">
                        <Clock size={14} className="text-curator-teal" />
                        <span className="text-xs font-bold">{formatDate(reminder.event_time)}</span>
                        <span className="text-[10px] opacity-70 px-2 py-0.5 bg-curator-bg rounded border border-curator-border uppercase font-black">
                            {formatTime(reminder.event_time)}
                        </span>
                    </div>
                </div>

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-curator-text-secondary hover:text-curator-red transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Reminders;

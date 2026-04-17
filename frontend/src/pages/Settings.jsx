import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, Bell, Shield, User, Globe, Mail, 
  MessageSquare, Phone, Plus, ChevronRight, Check, X, 
  ShieldCheck, Zap, Camera, Lock, Smartphone, Key, 
  Eye, EyeOff, Trash2, Save, CreditCard, ExternalLink
} from 'lucide-react';
import TagBadge from '../components/ui/TagBadge';

import { useUser } from '../context/UserContext';

const Settings = () => {
  const { user, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Local form state
  const [formData, setFormData] = useState({
    name: user.name,
    title: user.title,
    email: user.email,
    bio: user.bio
  });

  const tabs = [
    { id: 'Profile', icon: User },
    { id: 'Channels', icon: Globe },
    { id: 'Security', icon: Shield },
    { id: 'Notifications', icon: Bell },
    { id: 'AI Settings', icon: Zap },
  ];

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      updateUser(formData);
      setIsSaving(false);
    }, 800);
  };

  const renderProfile = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 md:space-y-8"
    >
      <section className="bg-curator-card border border-curator-border rounded-2xl md:rounded-3xl p-5 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-curator-teal/20 bg-curator-bg flex items-center justify-center">
              <img 
                src={user.avatarUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-curator-teal text-curator-bg rounded-2xl shadow-lg border-2 border-curator-bg hover:scale-110 transition-transform">
              <Camera size={18} />
            </button>
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-curator-teal uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-curator-bg border border-curator-border rounded-xl px-4 py-3 text-sm text-curator-text-primary focus:border-curator-teal outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-curator-teal uppercase tracking-widest ml-1">Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-curator-bg border border-curator-border rounded-xl px-4 py-3 text-sm text-curator-text-primary focus:border-curator-teal outline-none transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-curator-teal uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-curator-bg border border-curator-border rounded-xl px-4 py-3 text-sm text-curator-text-primary focus:border-curator-teal outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-curator-teal uppercase tracking-widest ml-1">Professional Bio</label>
              <textarea 
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-curator-bg border border-curator-border rounded-xl px-4 py-3 text-sm text-curator-text-primary focus:border-curator-teal outline-none transition-colors resize-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-curator-card border border-curator-border rounded-2xl md:rounded-3xl p-5 md:p-8">
        <h3 className="text-[10px] md:text-xs font-black text-curator-text-primary uppercase tracking-widest mb-6">Subscriptions & Usage</h3>
        <div className="flex items-center justify-between p-6 bg-curator-bg border border-curator-border rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-curator-teal/10 text-curator-teal rounded-xl">
              <CreditCard size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-curator-text-primary">Pro Plan</h4>
                <TagBadge text="Active" type="success" />
              </div>
              <p className="text-xs text-curator-text-secondary mt-1">Next billing date: May 12, 2026</p>
            </div>
          </div>
          <button className="text-[10px] font-black text-curator-teal uppercase tracking-widest hover:bg-curator-teal/5 px-4 py-2 rounded-lg border border-curator-teal/20 transition-all">
            Manage Billing
          </button>
        </div>
      </section>
    </motion.div>
  );

  const renderChannels = () => {
    const channels = [
      { name: 'Gmail', icon: Mail, color: 'text-curator-red', status: 'connected', email: 'personal@gmail.com' },
      { name: 'Slack', icon: MessageSquare, color: 'text-curator-teal', status: 'connected', email: 'Acme Corp Workspace' },
      { name: 'WhatsApp', icon: Phone, color: 'text-curator-green', status: 'disconnected' },
      { name: 'Telegram', icon: Globe, color: 'text-sky-400', status: 'disconnected' },
    ];

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        <section>
          <h3 className="text-xs font-black text-curator-teal uppercase tracking-[0.2em] mb-8">Connected Instances</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {channels.map(channel => (
              <div 
                key={channel.name} 
                className={`bg-curator-card border rounded-3xl p-6 transition-all group ${
                  channel.status === 'connected' ? 'border-curator-border hover:border-curator-teal/30' : 'border-curator-border opacity-50'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl bg-curator-bg border border-curator-border group-hover:scale-110 transition-transform`}>
                    <channel.icon size={24} className={channel.color} />
                  </div>
                  {channel.status === 'connected' ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-curator-teal/10 text-curator-teal rounded-lg text-[10px] font-black uppercase">
                       <Check size={12} /> Live
                    </div>
                  ) : (
                    <button className="flex items-center gap-2 px-3 py-1 bg-curator-bg border border-curator-border text-curator-text-secondary rounded-lg text-[10px] font-black uppercase hover:border-curator-teal hover:text-curator-teal transition-all">
                       <Plus size={12} /> Connect
                    </button>
                  )}
                </div>
                <h4 className="text-lg font-black text-curator-text-primary mb-1">{channel.name}</h4>
                <p className="text-xs text-curator-text-secondary font-medium">{channel.email || 'Not connected'}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-curator-card border border-curator-border rounded-3xl p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck size={120} />
           </div>
           <div className="relative z-10">
              <h3 className="text-sm font-black text-curator-text-primary uppercase tracking-widest mb-4">Privacy & Security</h3>
              <p className="text-sm text-curator-text-secondary leading-relaxed max-w-lg mb-8">
                The Infinite Curator uses end-to-end encryption for all synchronized messages. Metadata used for AI analysis never leaves your private cloud instance.
              </p>
              <button className="text-xs font-black text-curator-teal uppercase tracking-widest hover:underline flex items-center gap-2">
                View Privacy Manifesto <ChevronRight size={14} />
              </button>
           </div>
        </section>
      </motion.div>
    );
  };

  const renderSecurity = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <section className="bg-curator-card border border-curator-border rounded-3xl p-8">
        <h3 className="text-xs font-black text-curator-teal uppercase tracking-[0.2em] mb-8">Authentication</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-curator-bg border border-curator-border rounded-xl">
                <Smartphone size={20} className="text-curator-text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-curator-text-primary">Two-Factor Authentication</h4>
                <p className="text-xs text-curator-text-secondary">Add an extra layer of security to your account.</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-curator-teal rounded-full relative cursor-pointer flex items-center px-1">
              <div className="w-4 h-4 bg-curator-bg rounded-full ml-auto shadow-sm"></div>
            </div>
          </div>

          <div className="pt-6 border-t border-curator-border">
            <h4 className="text-xs font-bold text-curator-text-primary uppercase tracking-wider mb-4">Change Password</h4>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="New password"
                  className="w-full bg-curator-bg border border-curator-border rounded-xl px-4 py-3 text-sm text-curator-text-primary focus:border-curator-teal outline-none transition-colors"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-curator-text-secondary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button className="px-6 py-3 bg-curator-bg border border-curator-border rounded-xl text-xs font-black text-curator-text-primary uppercase tracking-widest hover:border-curator-teal transition-all">
                Update
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-curator-card border border-curator-border rounded-3xl p-8">
        <h3 className="text-xs font-black text-curator-teal uppercase tracking-[0.2em] mb-8">Active Sessions</h3>
        <div className="space-y-4">
          {[
            { device: 'MacBook Pro 16"', location: 'San Francisco, CA', time: 'Current session', icon: Smartphone },
            { device: 'iPhone 15 Pro', location: 'San Francisco, CA', time: '2 hours ago', icon: Smartphone },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-curator-bg border border-curator-border rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-curator-card flex items-center justify-center text-curator-text-secondary">
                  <session.icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-curator-text-primary">{session.device}</h4>
                  <p className="text-[10px] text-curator-text-secondary uppercase tracking-widest">{session.location} • {session.time}</p>
                </div>
              </div>
              <button className="p-2 text-curator-text-secondary hover:text-curator-red transition-colors">
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-curator-red/5 border border-curator-red/10 rounded-3xl p-8">
        <h3 className="text-xs font-black text-curator-red uppercase tracking-[0.2em] mb-4">Danger Zone</h3>
        <p className="text-sm text-curator-text-secondary mb-6">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button className="flex items-center gap-2 px-6 py-3 bg-curator-red/10 text-curator-red rounded-xl text-xs font-black uppercase tracking-widest hover:bg-curator-red hover:text-white transition-all">
          <Trash2 size={16} /> Delete Account
        </button>
      </section>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <section className="bg-curator-card border border-curator-border rounded-3xl p-8">
        <h3 className="text-xs font-black text-curator-teal uppercase tracking-[0.2em] mb-8">Notification Channels</h3>
        <div className="space-y-8">
          {[
            { tag: 'Email', title: 'Daily Digest', desc: 'Summary of all important threads from the last 24 hours.', enabled: true },
            { tag: 'Push', title: 'Priority Alerts', desc: 'Instant notification for high-priority AI detected messages.', enabled: true },
            { tag: 'Desktop', title: 'Activity Badges', desc: 'Show unread count in browser tab and dock.', enabled: false },
          ].map((notif, i) => (
            <div key={i} className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <h4 className="text-sm font-bold text-curator-text-primary">{notif.title}</h4>
                   <span className="text-[9px] px-2 py-0.5 bg-curator-bg border border-curator-border rounded-md text-curator-text-secondary uppercase font-black">{notif.tag}</span>
                </div>
                <p className="text-xs text-curator-text-secondary max-w-sm">{notif.desc}</p>
              </div>
              <div className={`w-12 h-6 rounded-full relative cursor-pointer flex items-center px-1 transition-colors ${notif.enabled ? 'bg-curator-teal' : 'bg-curator-border'}`}>
                <div className={`w-4 h-4 bg-curator-bg rounded-full shadow-sm transition-transform ${notif.enabled ? 'ml-auto' : 'ml-0'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-curator-card border border-curator-border rounded-3xl p-8">
        <h3 className="text-xs font-black text-curator-teal uppercase tracking-[0.2em] mb-6">Quiet Hours</h3>
        <p className="text-sm text-curator-text-secondary mb-6">Mute all notifications during specific hours to focus.</p>
        <div className="flex items-center gap-4">
          <input 
            type="time" 
            defaultValue="22:00"
            className="bg-curator-bg border border-curator-border rounded-xl px-4 py-2 text-sm text-curator-text-primary outline-none focus:border-curator-teal"
          />
          <span className="text-curator-text-secondary text-sm font-bold">to</span>
          <input 
            type="time" 
            defaultValue="08:00"
            className="bg-curator-bg border border-curator-border rounded-xl px-4 py-2 text-sm text-curator-text-primary outline-none focus:border-curator-teal"
          />
        </div>
      </section>
    </motion.div>
  );

  const renderAISettings = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
       <section className="bg-curator-card border border-curator-border rounded-3xl p-8">
          <h3 className="text-xs font-black text-curator-teal uppercase tracking-[0.2em] mb-8">Intelligence Model</h3>
          <div className="space-y-4">
             {[
               { name: 'Claude 3.5 Sonnet', type: 'C', color: 'bg-orange-500/10 text-orange-500', desc: 'Recommended for Synthesis', selected: true },
               { name: 'GPT-4o', type: 'G', color: 'bg-purple-500/10 text-purple-500', desc: 'Available in Pro Tier', selected: false, locked: true },
             ].map((model, i) => (
               <div 
                 key={i} 
                 className={`flex items-center justify-between p-4 bg-curator-bg border rounded-2xl transition-all ${
                   model.selected ? 'border-curator-teal shadow-[0_0_15px_rgba(0,212,180,0.1)]' : 'border-curator-border/50 opacity-60 grayscale'
                 }`}
               >
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${model.color}`}>{model.type}</div>
                     <div>
                        <h4 className="text-sm font-bold text-curator-text-primary">{model.name}</h4>
                        <p className="text-[10px] text-curator-text-secondary uppercase tracking-widest">{model.desc}</p>
                     </div>
                  </div>
                  {model.selected ? (
                    <div className="w-6 h-6 rounded-full border-2 border-curator-teal flex items-center justify-center">
                       <div className="w-3 h-3 bg-curator-teal rounded-full shadow-[0_0_10px_rgba(0,212,180,0.5)]"></div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-curator-border"></div>
                  )}
               </div>
             ))}
          </div>
       </section>

       <section className="bg-curator-card border border-curator-border rounded-3xl p-8">
          <h3 className="text-xs font-black text-curator-teal uppercase tracking-[0.2em] mb-8">Analysis Depth</h3>
          <div className="grid grid-cols-3 gap-4">
            {['Concise', 'Balanced', 'Analytical'].map((depth) => (
              <button 
                key={depth}
                className={`py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${
                  depth === 'Balanced' 
                    ? 'border-curator-teal bg-curator-teal/5 text-curator-teal' 
                    : 'border-curator-border text-curator-text-secondary hover:border-curator-teal/30'
                }`}
              >
                {depth}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-curator-text-secondary mt-6 italic">
            * Higher depth models may increase latency for real-time thread summaries.
          </p>
       </section>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-full w-full max-w-5xl mx-auto pb-32 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 md:mb-12 px-5 md:px-10 pt-6">
        <div className="space-y-1">
          <h1 className="font-headline text-2xl md:text-4xl font-black text-curator-text-primary tracking-tight">Settings</h1>
          <p className="text-xs md:text-sm text-curator-text-secondary">Manage connections and intelligence preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 md:px-6 py-2.5 bg-curator-teal text-curator-bg rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-curator-teal/20"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-curator-bg border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </div>
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Tabs - Persistent on Desktop, Horizontal Scroll on Mobile */}
        <div className="px-5 md:px-0 lg:w-64 w-full">
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide flex-nowrap w-full">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-2.5 lg:px-6 lg:py-4 rounded-xl lg:rounded-2xl text-[10px] lg:text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-curator-teal/10 text-curator-teal border border-curator-teal/20 shadow-lg' 
                    : 'text-curator-text-secondary hover:bg-curator-card border border-transparent hover:border-curator-border'
                }`}
              >
                <tab.icon size={14} className="lg:w-[18px] lg:h-[18px]" />
                {tab.id}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-[600px] px-5 md:px-0">
          <AnimatePresence mode="wait">
            {activeTab === 'Profile' && renderProfile()}
            {activeTab === 'Channels' && renderChannels()}
            {activeTab === 'Security' && renderSecurity()}
            {activeTab === 'Notifications' && renderNotifications()}
            {activeTab === 'AI Settings' && renderAISettings()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;


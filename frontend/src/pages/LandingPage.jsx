import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { connectGmail } from '../api';
import { 
  Zap, Shield, Globe, Sparkles, ArrowRight, Inbox, 
  Network, MessageSquare, ChevronRight, PlayCircle 
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      title: "AI Synthesis",
      desc: "Turn 100+ unread messages into a 30-second brief.",
      icon: Zap,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      size: "col-span-2 row-span-1"
    },
    {
      title: "Relation Graph",
      desc: "Visualize communication patterns across your network.",
      icon: Network,
      color: "text-curator-teal",
      bg: "bg-curator-teal/10",
      size: "col-span-2 row-span-2"
    },
    {
      title: "Privacy First",
      desc: "Zero-knowledge encryption for all sync data.",
      icon: Shield,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      size: "col-span-2 row-span-1"
    },
    {
      title: "Multi-Channel",
      desc: "Connect Slack, Gmail, and WhatsApp in seconds.",
      icon: Globe,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      size: "col-span-4 row-span-1"
    }
  ];

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-curator-bg text-curator-text-primary custom-scrollbar">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-curator-bg/50 backdrop-blur-xl border-b border-curator-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 md:gap-3 group/logo transition-transform hover:scale-[1.02]">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-curator-teal flex items-center justify-center shadow-[0_0_20px_rgba(0,212,180,0.3)] group-hover/logo:shadow-[0_0_30px_rgba(0,212,180,0.5)] transition-all">
              <Sparkles className="text-curator-bg" size={20} />
            </div>
            <span className="font-headline text-lg md:text-xl font-black tracking-tight">Curator</span>
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={() => navigate('/inbox')}
              className="hidden sm:block text-sm font-bold text-curator-text-secondary hover:text-curator-teal transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => { connectGmail(); navigate('/inbox'); }}
              className="px-4 md:px-6 py-2 md:py-2.5 bg-curator-teal text-curator-bg rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-curator-teal/20"
            >
              Sign In with Google
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 px-4 md:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] aura-glow opacity-50 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div {...fadeIn}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-curator-teal/10 border border-curator-teal/20 text-curator-teal text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              Intelligence as a Layer
            </span>
            <h1 className="font-headline text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              Reclaim your <br />
              <span className="text-gradient">Bandwidth.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-curator-text-secondary leading-relaxed mb-12">
              The Infinite Curator is an AI-unified inbox that synthesizes noise into intelligence. 
              Gmail, Slack, and WhatsApp, filtered and simplified for the modern mind.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => { connectGmail(); navigate('/inbox'); }}
                className="group flex items-center gap-3 px-8 py-4 bg-curator-teal text-curator-bg rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,212,180,0.4)] transition-all"
              >
                Sign In with Google <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center gap-3 px-8 py-4 bg-curator-card border border-curator-border rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-curator-border transition-all">
                <PlayCircle size={18} /> Watch Trailer
              </button>
            </div>
          </motion.div>

          {/* Tool Mockup Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-24 relative p-4 bg-curator-border/50 rounded-[40px] border border-curator-border shadow-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-curator-bg via-transparent to-transparent z-10 pointer-events-none" />
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
              alt="Dashboard Preview" 
              className="rounded-[30px] w-full shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-headline text-4xl font-black tracking-tight mb-4">Core Intelligence</h2>
          <p className="text-curator-text-secondary">A unified platform for the digital-first professional.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`p-6 md:p-8 bg-curator-card border border-curator-border rounded-[32px] hover:border-curator-teal/50 transition-all group md:${feature.size}`}
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-sm text-curator-text-secondary leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-5xl mx-auto p-8 md:p-24 bg-curator-teal rounded-[40px] md:rounded-[60px] text-curator-bg text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] group-hover:scale-150 transition-transform duration-700" />
          <h2 className="font-headline text-3xl md:text-6xl font-black tracking-tighter mb-8 relative z-10">
            Stop scrolling. <br /> Start curating.
          </h2>
          <button 
            onClick={() => navigate('/inbox')}
            className="px-12 py-5 bg-curator-bg text-curator-teal rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all relative z-10"
          >
            Enter the Curator
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-curator-border border-dashed">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-curator-teal/20 text-curator-teal flex items-center justify-center">
               <Sparkles size={18} />
             </div>
             <span className="font-headline font-black text-sm uppercase tracking-widest">The Infinite Curator</span>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-curator-text-secondary">
            <a href="#" className="hover:text-curator-teal transition-colors">Twitter</a>
            <a href="#" className="hover:text-curator-teal transition-colors">Manifesto</a>
            <a href="#" className="hover:text-curator-teal transition-colors">Security</a>
          </div>
          <div className="text-[10px] font-bold text-curator-text-secondary">
            © 2026 INFINITE AI CORP. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

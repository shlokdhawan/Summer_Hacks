import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, MessageSquare, Phone, Send, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { channels } from '../data/mockData';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [connected, setConnected] = useState([]);
  const navigate = useNavigate();

  const toggleConnect = (id) => {
    if (connected.includes(id)) {
      setConnected(connected.filter(i => i !== id));
    } else {
      setConnected([...connected, id]);
    }
  };

  const steps = [
    { title: 'Welcome', description: 'Step 1 of 3' },
    { title: 'Connect Channels', description: 'Step 2 of 3' },
    { title: 'Preferences', description: 'Step 3 of 3' },
  ];

  const containerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  };

  return (
    <div className="fixed inset-0 bg-curator-bg flex flex-col items-center justify-center p-6 z-[100]">
      {/* Step Indicator */}
      <div className="absolute top-12 left-0 right-0 flex justify-center gap-2 px-6">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={`h-1.5 w-16 rounded-full transition-all duration-500 ${step > i ? 'bg-curator-teal' : 'bg-curator-border'}`}></div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center text-center max-w-lg"
          >
            <div className="w-24 h-24 rounded-3xl bg-curator-teal flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(0,212,180,0.3)]">
              <Sparkles size={48} className="text-curator-bg" />
            </div>
            <h1 className="font-headline text-5xl font-black text-curator-text-primary mb-4 tracking-tighter">
              The Infinite Curator
            </h1>
            <p className="font-body text-xl text-curator-text-secondary mb-12 leading-relaxed">
              Your AI-powered communication hub. Unified, prioritized, and summarized.
            </p>
            <button 
              onClick={() => setStep(2)}
              className="group bg-curator-teal text-curator-bg font-black text-lg px-10 py-4 rounded-2xl flex items-center gap-3 hover:shadow-[0_0_30px_rgba(0,212,180,0.4)] hover:scale-105 transition-all duration-300"
            >
              Get Started
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <h2 className="font-headline text-3xl font-bold text-curator-text-primary mb-2">Connect Your Channels</h2>
            <p className="font-body text-curator-text-secondary mb-12">Select the platforms you want the AI to curate for you.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-12">
              {channels.map((ch) => {
                const isConnected = connected.includes(ch.id);
                return (
                  <div 
                    key={ch.id}
                    onClick={() => toggleConnect(ch.id)}
                    className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer group flex items-center gap-4 ${
                      isConnected ? 'bg-curator-teal/5 border-curator-teal' : 'bg-curator-card border-curator-border hover:border-curator-teal/30'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-curator-bg border border-curator-border flex items-center justify-center group-hover:scale-110 transition-transform">
                      {ch.id === 'gmail' && <Mail className="text-white" size={24} />}
                      {ch.id === 'slack' && <MessageSquare className="text-white" size={24} />}
                      {ch.id === 'whatsapp' && <Phone className="text-white" size={24} />}
                      {ch.id === 'telegram' && <Send className="text-white" size={24} />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline font-bold text-curator-text-primary">{ch.name}</h3>
                      <p className="text-xs text-curator-text-secondary">{ch.description}</p>
                    </div>
                    <div className={`w-24 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-center transition-all ${
                      isConnected ? 'bg-curator-teal text-curator-bg' : 'bg-curator-border text-curator-text-secondary'
                    }`}>
                      {isConnected ? 'Connected ✓' : 'Connect'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-6">
              <button 
                onClick={() => setStep(3)}
                className="bg-curator-teal text-curator-bg font-black px-12 py-4 rounded-2xl hover:shadow-[0_10px_30px_rgba(0,212,180,0.3)] hover:scale-105 transition-all"
              >
                Continue to Preferences
              </button>
              <button onClick={() => setStep(3)} className="text-curator-text-secondary hover:text-curator-teal transition-colors text-sm font-medium underline underline-offset-4">
                Skip for now
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center max-w-xl w-full"
          >
            <h2 className="font-headline text-3xl font-bold text-curator-text-primary mb-2">Final Preferences</h2>
            <p className="font-body text-curator-text-secondary mb-12 text-center">Customize how the Curator interacts with your data.</p>
            
            <div className="w-full space-y-8 mb-12 bg-curator-card p-8 rounded-3xl border border-curator-border">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-curator-text-primary">AI Tone</h4>
                  <p className="text-xs text-curator-text-secondary">How the AI summarizes your threads</p>
                </div>
                <div className="flex bg-curator-bg p-1 rounded-xl border border-curator-border">
                  <button className="px-4 py-1.5 bg-curator-teal text-curator-bg text-xs font-bold rounded-lg shadow-lg">Executive</button>
                  <button className="px-4 py-1.5 text-curator-text-secondary text-xs font-bold">Friendly</button>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-4">
                  <h4 className="font-bold text-curator-text-primary">Daily Brief Time</h4>
                  <span className="text-curator-teal font-bold">8:30 AM</span>
                </div>
                <input type="range" className="w-full accent-curator-teal bg-curator-border h-1.5 rounded-full appearance-none cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between mb-4">
                  <h4 className="font-bold text-curator-text-primary">Notification Intensity</h4>
                  <span className="text-curator-text-secondary text-xs uppercase font-bold">Balanced</span>
                </div>
                <input type="range" className="w-full accent-curator-teal bg-curator-border h-1.5 rounded-full appearance-none cursor-pointer" />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(2)}
                className="p-4 bg-curator-card border border-curator-border rounded-2xl text-curator-text-secondary hover:text-curator-text-primary"
              >
                <ArrowLeft size={24} />
              </button>
              <button 
                onClick={() => navigate('/inbox')}
                className="flex-1 bg-curator-teal text-curator-bg font-black px-12 py-4 rounded-2xl hover:shadow-[0_10px_30px_rgba(0,212,180,0.3)] hover:scale-105 transition-all text-center"
              >
                Launch My Inbox
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;

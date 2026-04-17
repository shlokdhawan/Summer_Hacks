import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Users, Search, Filter, User, ChevronRight, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const RelationGraph = () => {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState(null);
  const [apiNodes, setApiNodes] = useState([]);

  React.useEffect(() => {
    const fetchRelations = async () => {
      try {
        const res = await api.get('/messages/relations');
        // map backend D3 nodes into the UI format
        if (res.data.nodes) {
          const mappedNodes = res.data.nodes.map(n => ({
            id: n.id,
            name: n.id,
            importance: Math.random() * 10,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(n.id)}&background=random`,
            role: 'Contact',
            company: 'Network',
            tags: ['messaging']
          })).slice(0, 12);
          setApiNodes(mappedNodes);
        }
      } catch(err) {
        console.error("Failed to load relations", err);
      }
    };
    fetchRelations();
  }, []);

  // Responsive radius calculation
  const getRadius = () => {
    if (typeof window === 'undefined') return 280;
    return window.innerWidth < 768 ? 140 : 220;
  };

  const [radius, setRadius] = useState(getRadius());

  React.useEffect(() => {
    const handleResize = () => setRadius(getRadius());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nodes = apiNodes.map((contact, i) => {
    const angle = (i / Math.max(1, apiNodes.length)) * (2 * Math.PI);
    return {
      ...contact,
      x: Math.cos(angle) * (radius || 220),
      y: Math.sin(angle) * (radius || 220),
    };
  });

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-curator-bg px-4 md:px-0">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,180,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      {/* Header UI */}
      <div className="relative z-10 md:px-10 flex flex-col md:flex-row justify-between items-start gap-8 pt-6">
        <div className="pointer-events-none">
           <div className="flex items-center gap-2 text-curator-teal font-black text-xs uppercase tracking-[0.2em] mb-2">
            <Share2 size={14} />
            Network Intelligence
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-black text-curator-text-primary tracking-tight">Relation Graph</h1>
          <p className="text-sm text-curator-text-secondary mt-2 max-w-md pointer-events-auto">Visualizing your communication hubs and organizational connections.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto pointer-events-auto">
           <div className="relative flex-1 md:flex-none">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-curator-text-secondary" />
              <input 
                type="text" 
                placeholder="Find contact..." 
                className="w-full md:w-64 bg-curator-card border border-curator-border rounded-xl py-3 pl-12 pr-6 text-sm text-curator-text-primary focus:outline-none focus:border-curator-teal/50 transition-all"
              />
           </div>
           <button className="p-3 bg-curator-teal text-curator-bg rounded-xl shadow-[0_0_20px_rgba(0,212,180,0.3)] hover:scale-105 transition-transform">
             <Filter size={18} />
           </button>
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1 relative flex items-center justify-center min-h-[500px] md:min-h-[700px]">
         {/* Center Node */}
         <div className="relative z-20 w-16 h-16 md:w-24 md:h-24 rounded-full bg-curator-teal flex items-center justify-center shadow-[0_0_60px_rgba(0,212,180,0.4)] border-4 md:border-8 border-curator-bg group cursor-pointer hover:scale-110 transition-transform">
            <User className="text-curator-bg w-8 h-8 md:w-12 md:h-12" />
            <div className="absolute -bottom-10 whitespace-nowrap text-[10px] md:text-xs font-black text-curator-text-primary uppercase tracking-[0.1em]">You (System)</div>
         </div>

         {/* Connection Lines (SVG) */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <defs>
               <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D4B4" />
                  <stop offset="100%" stopColor="transparent" />
               </linearGradient>
            </defs>
            {nodes.map((node, i) => (
               <motion.line 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.5, duration: 1 }}
                  key={`line-${i}`}
                  x1="50%" 
                  y1="50%" 
                  x2={`calc(50% + ${node.x}px)`} 
                  y2={`calc(50% + ${node.y}px)`} 
                  stroke="url(#lineGrad)" 
                  strokeWidth="1"
               />
            ))}
         </svg>

         {/* Nodes */}
         {nodes.map((node, i) => (
            <motion.div 
               key={node.id}
               initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
               animate={{ scale: 1, opacity: 1, x: node.x, y: node.y }}
               transition={{ delay: i * 0.1, type: 'spring', damping: 12 }}
               onClick={() => setSelectedNode(node)}
               className={`absolute z-20 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-curator-card border-2 cursor-pointer group hover:scale-125 hover:z-30 transition-all ${
                 selectedNode?.id === node.id ? 'border-curator-teal shadow-[0_0_30px_rgba(0,212,180,0.3)]' : 'border-curator-border hover:border-curator-teal/50'
               }`}
            >
               <img src={node.avatar} alt={node.name} className="w-full h-full rounded-2xl object-cover opacity-80 group-hover:opacity-100" />
               <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black text-curator-text-primary uppercase tracking-tighter bg-curator-bg border border-curator-border px-2 py-0.5 rounded shadow-lg">{node.name}</span>
               </div>
               
               {/* Pulsing Importance Ring */}
               {node.importance > 8 && (
                 <div className="absolute -inset-2 rounded-3xl border border-curator-teal/30 animate-ping pointer-events-none"></div>
               )}
            </motion.div>
         ))}

         {/* Selected Persona Card */}
         <AnimatePresence>
           {selectedNode && (
             <motion.div 
               initial={{ x: '100%', opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: '100%', opacity: 0 }}
               className="fixed inset-y-0 right-0 w-full sm:w-80 bg-curator-card border-l border-curator-border shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-[60] p-6 md:p-10 flex flex-col pt-24"
             >
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                   <img src={selectedNode.avatar} className="w-20 h-20 md:w-24 md:h-24 rounded-3xl mb-6 border-2 border-curator-teal shadow-xl object-cover" alt="" />
                   <h2 className="text-xl md:text-2xl font-black text-curator-text-primary tracking-tight mb-2">{selectedNode.name}</h2>
                   <p className="text-xs md:text-sm text-curator-text-secondary mb-6">{selectedNode.role} at {selectedNode.company}</p>
                   
                   <div className="space-y-6">
                      <div className="bg-curator-bg border border-curator-border p-4 rounded-2xl">
                         <span className="text-[10px] font-black text-curator-text-secondary uppercase tracking-widest block mb-2">Social Density</span>
                         <div className="flex items-center gap-3">
                            <Users size={16} className="text-curator-teal" />
                            <span className="text-lg md:text-xl font-black text-curator-text-primary">High Hub</span>
                         </div>
                      </div>
                      
                      <div className="space-y-3">
                         <span className="text-[10px] font-black text-curator-text-secondary uppercase tracking-widest block mb-2">Key Topics</span>
                         <div className="flex flex-wrap gap-2">
                            {selectedNode.tags.map(tag => (
                               <span key={tag} className="text-[9px] md:text-[10px] bg-curator-bg border border-curator-border px-2 py-1 rounded-lg text-curator-text-secondary"># {tag}</span>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
                
                <div className="space-y-3 mt-10">
                   <button 
                     onClick={() => navigate(`/sender/${selectedNode.id}`)}
                     className="w-full py-4 bg-curator-teal text-curator-bg font-black rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                   >
                     View Profile <ChevronRight size={14} />
                   </button>
                   <button 
                     onClick={() => setSelectedNode(null)}
                     className="w-full py-4 bg-curator-bg border border-curator-border text-curator-text-secondary font-bold rounded-2xl text-xs uppercase"
                   >
                     Close
                   </button>
                </div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      {/* Global Stats Overlay - Only on Tablet/Desktop */}
      <div className="hidden sm:block absolute left-6 md:left-10 bottom-6 md:bottom-10 z-10 space-y-4 pointer-events-none">
         <div className="bg-curator-bg/80 backdrop-blur-md border border-curator-border p-6 rounded-3xl w-64 pointer-events-auto">
            <h4 className="text-[10px] font-black text-curator-text-secondary uppercase tracking-widest mb-4">Network Health</h4>
            <div className="space-y-3">
               <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                     <span className="text-curator-text-secondary">Connectivity</span>
                     <span className="text-curator-teal">84%</span>
                  </div>
                  <div className="h-1 bg-curator-card rounded-full overflow-hidden">
                     <div className="h-full bg-curator-teal w-[84%]"></div>
                  </div>
               </div>
               <p className="text-[10px] text-curator-text-secondary opacity-50 italic">Most interactions are Hub-and-Spoke oriented around your account.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RelationGraph;

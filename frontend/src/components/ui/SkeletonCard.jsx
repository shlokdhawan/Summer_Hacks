import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <div className="bg-curator-card/50 rounded-xl p-5 border border-curator-border/50 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-curator-border/50"></div>
          <div className="flex flex-col gap-2">
            <div className="w-24 h-3 bg-curator-border/50 rounded"></div>
            <div className="w-16 h-2 bg-curator-border/30 rounded"></div>
          </div>
        </div>
        <div className="w-12 h-4 bg-curator-border/50 rounded-full"></div>
      </div>
      <div className="w-3/4 h-5 bg-curator-border/50 rounded mb-3"></div>
      <div className="w-full h-3 bg-curator-border/30 rounded mb-2"></div>
      <div className="w-5/6 h-3 bg-curator-border/30 rounded mb-4"></div>
      <div className="flex gap-3">
        <div className="w-20 h-8 bg-curator-border/50 rounded-lg"></div>
        <div className="w-20 h-8 bg-curator-border/30 rounded-lg"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;

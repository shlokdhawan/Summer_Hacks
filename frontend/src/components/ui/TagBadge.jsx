import React from 'react';

const TagBadge = ({ type, children }) => {
  const getStyles = () => {
    switch (type?.toLowerCase()) {
      case 'urgent':
        return 'bg-curator-red/10 text-curator-red border-curator-red/20';
      case 'fyi':
        return 'bg-curator-amber/10 text-curator-amber border-curator-amber/20';
      case 'success':
        return 'bg-curator-green/10 text-curator-green border-curator-green/20';
      case 'teal':
        return 'bg-curator-teal/10 text-curator-teal border-curator-teal/20';
      default:
        return 'bg-curator-border/30 text-curator-text-secondary border-curator-border/50';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStyles()}`}>
      {children}
    </span>
  );
};

export default TagBadge;

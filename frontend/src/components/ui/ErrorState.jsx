import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, WifiOff, FileSearch, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const APIErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center h-full">
    <div className="w-16 h-16 rounded-full bg-curator-red/10 flex items-center justify-center mb-6">
      <AlertTriangle size={32} className="text-curator-red" />
    </div>
    <h3 className="font-headline text-xl font-bold text-curator-text-primary mb-2">Something went wrong</h3>
    <p className="font-body text-curator-text-secondary mb-8">We couldn't load the information. Please try again.</p>
    <button 
      onClick={onRetry}
      className="bg-curator-red text-white font-bold px-8 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
    >
      Retry
    </button>
  </div>
);

export const OfflineState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center h-full">
    <div className="w-16 h-16 rounded-full bg-curator-amber/10 flex items-center justify-center mb-6">
      <WifiOff size={32} className="text-curator-amber" />
    </div>
    <h3 className="font-headline text-xl font-bold text-curator-text-primary mb-2">You're offline</h3>
    <p className="font-body text-curator-text-secondary mb-8">Please check your internet connection and try again.</p>
    <button 
      onClick={onRetry}
      className="bg-curator-amber text-curator-bg font-bold px-8 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
    >
      Retry Connection
    </button>
  </div>
);

export const NotFoundState = () => (
  <div className="flex flex-col items-center justify-center p-12 text-center h-full">
    <div className="w-16 h-16 rounded-full bg-curator-teal/10 flex items-center justify-center mb-6">
      <FileSearch size={32} className="text-curator-teal" />
    </div>
    <h3 className="font-headline text-xl font-bold text-curator-text-primary mb-2">Page not found</h3>
    <p className="font-body text-curator-text-secondary mb-8">The screen you're looking for doesn't exist.</p>
    <Link 
      to="/inbox"
      className="bg-curator-teal text-curator-bg font-bold px-8 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(0,212,180,0.3)] transition-all"
    >
      Back to Inbox
    </Link>
  </div>
);

export const SessionExpiredState = ({ onReconnect }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center h-full">
    <div className="w-16 h-16 rounded-full bg-curator-border/20 flex items-center justify-center mb-6">
      <Lock size={32} className="text-curator-text-secondary" />
    </div>
    <h3 className="font-headline text-xl font-bold text-curator-text-primary mb-2">Session expired</h3>
    <p className="font-body text-curator-text-secondary mb-8">Please reconnect your channels to continue using The Infinite Curator.</p>
    <button 
      onClick={onReconnect}
      className="bg-curator-teal text-curator-bg font-bold px-8 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(0,212,180,0.3)] transition-all"
    >
      Reconnect Channels
    </button>
  </div>
);

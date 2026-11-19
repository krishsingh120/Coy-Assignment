'use client';

import React from 'react';
import { Sparkles, RotateCcw, HeartHandshake } from 'lucide-react';

export default function EmptyFeed({ onResetDemo, isResetting = false }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] px-6 text-center animate-fade-in bg-white rounded-3xl border border-slate-200/80 shadow-sm max-w-sm mx-auto p-8">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-rose-500 mb-5 shadow-inner">
        <Sparkles className="w-10 h-10 animate-bounce-subtle" />
      </div>

      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
        You're All Caught Up!
      </h2>
      <p className="text-slate-500 text-xs leading-relaxed mb-6 max-w-xs">
        You've reviewed every candidate in your area. Check your <strong className="text-rose-600 font-semibold">Matches</strong> tab to see who liked you back, or reset your demo feed below.
      </p>

      {/* Reset Demo Button */}
      <button
        onClick={onResetDemo}
        disabled={isResetting}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition active:scale-95 disabled:opacity-50"
      >
        <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
        <span>{isResetting ? 'Resetting...' : 'Reset Demo Swipes'}</span>
      </button>

      <div className="mt-6 flex items-center gap-1.5 text-[11px] text-slate-400">
        <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
        <span>Private matching guaranteed</span>
      </div>
    </div>
  );
}

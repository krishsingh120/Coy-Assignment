'use client';

import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

export default function EmptyFeed({ onReset, isResetting }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] px-6 text-center animate-fade-in bg-white rounded-3xl border border-slate-200 shadow-sm max-w-sm mx-auto p-8">
      <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-rose-500 mb-5">
        <Sparkles className="w-10 h-10 animate-bounce-subtle" />
      </div>

      <h2 className="text-2xl font-black text-slate-900 mb-2">You're All Caught Up!</h2>
      <p className="text-slate-500 text-xs mb-6 max-w-xs">
        You've reviewed all profiles. Check your <strong className="text-rose-600">Matches</strong> tab or reset your feed below.
      </p>

      <button
        onClick={onReset}
        disabled={isResetting}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-2xl shadow transition active:scale-95 disabled:opacity-50"
      >
        <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
        <span>{isResetting ? 'Resetting...' : 'Reset Demo Swipes'}</span>
      </button>
    </div>
  );
}

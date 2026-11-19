'use client';

import React from 'react';
import { X, Heart } from 'lucide-react';

export default function SwipeControls({ onSwipe, disabled = false }) {
  return (
    <div className="flex items-center justify-center gap-6 mt-4 z-20">
      {/* Pass / Nope Button */}
      <button
        onClick={() => onSwipe('PASS')}
        disabled={disabled}
        aria-label="Pass on profile"
        title="Pass (Swipe Left or Left Arrow)"
        className="w-16 h-16 rounded-full bg-white border-2 border-rose-200 text-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/10 hover:bg-rose-50 hover:border-rose-300 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none group"
      >
        <X className="w-8 h-8 stroke-[2.5] group-hover:scale-110 transition-transform" />
      </button>

      {/* Like Button */}
      <button
        onClick={() => onSwipe('LIKE')}
        disabled={disabled}
        aria-label="Like profile"
        title="Like (Swipe Right or Right Arrow)"
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none group"
      >
        <Heart className="w-8 h-8 fill-white group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}

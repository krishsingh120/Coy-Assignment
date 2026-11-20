'use client';

import React from 'react';
import { X, Heart } from 'lucide-react';

export default function SwipeControls({ onSwipe, disabled }) {
  return (
    <div className="flex items-center justify-center gap-6 mt-4 z-20">
      <button
        onClick={() => onSwipe('PASS')}
        disabled={disabled}
        aria-label="Pass"
        className="w-16 h-16 rounded-full bg-white border-2 border-rose-200 text-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-50 hover:scale-105 active:scale-95 transition disabled:opacity-40"
      >
        <X className="w-8 h-8 stroke-[2.5]" />
      </button>

      <button
        onClick={() => onSwipe('LIKE')}
        disabled={disabled}
        aria-label="Like"
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition disabled:opacity-40"
      >
        <Heart className="w-8 h-8 fill-white" />
      </button>
    </div>
  );
}

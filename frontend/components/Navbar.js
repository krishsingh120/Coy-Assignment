'use client';

import React from 'react';
import { Flame, Heart, Home, RotateCcw } from 'lucide-react';

export default function Navbar({ tab, setTab, matchesCount = 0, onReset, isResetting }) {
  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTab('discover')}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center shadow-md shadow-rose-500/20">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-black text-slate-900 flex items-center gap-1.5">
              Coy
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                Discover
              </span>
            </span>
          </div>

          <button
            onClick={onReset}
            disabled={isResetting}
            title="Reset demo"
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-6 py-2 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            onClick={() => setTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              tab === 'home' ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[11px]">Home</span>
          </button>

          <button
            onClick={() => setTab('discover')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition relative ${
              tab === 'discover' ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Flame className={`w-6 h-6 ${tab === 'discover' ? 'fill-rose-500' : ''}`} />
            <span className="text-[11px]">Discover</span>
          </button>

          <button
            onClick={() => setTab('matches')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition relative ${
              tab === 'matches' ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <Heart className={`w-6 h-6 ${tab === 'matches' ? 'fill-rose-500' : ''}`} />
              {matchesCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {matchesCount}
                </span>
              )}
            </div>
            <span className="text-[11px]">Matches</span>
          </button>
        </div>
      </nav>
    </>
  );
}

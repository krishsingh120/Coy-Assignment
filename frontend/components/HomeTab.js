'use client';

import React from 'react';
import { Flame, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function HomeTab({ onGoToDiscover, demoUser }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 text-center animate-fade-in">
      {/* Decorative Icon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-400 flex items-center justify-center shadow-xl shadow-rose-500/25 rotate-3 hover:rotate-0 transition-transform">
          <Flame className="w-12 h-12 text-white fill-white" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md border-2 border-white">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
        Welcome to Coy
      </h1>
      <p className="text-slate-500 text-sm max-w-xs mb-6 leading-relaxed">
        Discover crushes on campus with 100% privacy. Unilateral likes are never revealed until a mutual match occurs.
      </p>

      {/* Demo user card */}
      {demoUser && (
        <div className="w-full max-w-xs bg-white rounded-2xl border border-slate-200 p-3.5 mb-8 flex items-center gap-3 shadow-sm">
          <img
            src={demoUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={demoUser.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-rose-500"
          />
          <div className="text-left overflow-hidden">
            <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Logged In As</div>
            <div className="text-sm font-bold text-slate-900 truncate">{demoUser.name}, {demoUser.age}</div>
            <div className="text-xs text-slate-500 truncate">{demoUser.bio}</div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={onGoToDiscover}
        className="w-full max-w-xs flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-500/30 transition transform active:scale-95"
      >
        <span>Explore Discover</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
        <HeartHandshake className="w-4 h-4 text-rose-400" />
        <span>Strict zero-leak mutual matching</span>
      </div>
    </div>
  );
}

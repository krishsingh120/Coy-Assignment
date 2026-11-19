'use client';

import React from 'react';
import { Heart, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function MatchModal({ matchData, demoUser, onClose, onViewMatches }) {
  if (!matchData) return null;

  const matchedProfile = matchData.profile || {};
  const userPhoto = demoUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
  const matchedPhoto = matchedProfile.photo || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 text-center text-white border border-rose-500/30 shadow-2xl overflow-hidden animate-scale-up">
        {/* Glow behind */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Celebration Header */}
        <div className="relative z-10 flex items-center justify-center gap-1.5 text-rose-400 font-extrabold text-sm tracking-wider uppercase mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Mutual Connection</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <h2 className="relative z-10 text-3xl font-black tracking-tight text-white mb-2">
          It's a Match!
        </h2>
        <p className="relative z-10 text-slate-300 text-xs mb-6 font-medium">
          You and <strong className="text-rose-400">{matchedProfile.name}</strong> liked each other.
        </p>

        {/* Both Avatars with Heart badge */}
        <div className="relative z-10 flex items-center justify-center gap-3 my-6">
          {/* Demo User Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-rose-500 to-amber-400 shadow-xl shadow-rose-500/20">
              <img
                src={userPhoto}
                alt="You"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="block mt-1.5 text-xs font-semibold text-slate-300">You</span>
          </div>

          {/* Heart Badge in Center */}
          <div className="w-10 h-10 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center shadow-lg -mx-4 z-20 animate-bounce-subtle">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>

          {/* Matched Profile Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-rose-500 to-teal-400 shadow-xl shadow-teal-500/20">
              <img
                src={matchedPhoto}
                alt={matchedProfile.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="block mt-1.5 text-xs font-semibold text-slate-300 truncate max-w-[90px]">
              {matchedProfile.name}
            </span>
          </div>
        </div>

        {/* College / City Tag */}
        {matchedProfile.cityOrCollege && (
          <div className="relative z-10 text-[11px] font-semibold text-slate-400 mb-6 bg-white/5 py-1.5 px-3 rounded-full border border-white/10 inline-block">
            {matchedProfile.cityOrCollege}
          </div>
        )}

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col gap-2.5">
          <button
            onClick={onViewMatches}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-500/30 transition transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>View in Matches</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition active:scale-95"
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
}

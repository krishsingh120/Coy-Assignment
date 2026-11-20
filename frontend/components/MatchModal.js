'use client';

import React from 'react';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';

export default function MatchModal({ match, user, onClose, onViewMatches }) {
  if (!match) return null;

  const profile = match.profile || {};
  const userPhoto = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
  const profilePhoto = profile.photo || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 text-center text-white border border-rose-500/30 shadow-2xl animate-scale-up">
        <div className="flex items-center justify-center gap-1.5 text-rose-400 font-extrabold text-sm uppercase mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Mutual Connection</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <h2 className="text-3xl font-black mb-2">It's a Match!</h2>
        <p className="text-slate-300 text-xs mb-6">
          You and <strong className="text-rose-400">{profile.name}</strong> liked each other.
        </p>

        <div className="flex items-center justify-center gap-3 my-6">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-rose-500 to-amber-400 shadow-xl">
            <img src={userPhoto} alt="You" className="w-full h-full object-cover rounded-full" />
          </div>

          <div className="w-10 h-10 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center shadow-lg -mx-4 z-20 animate-bounce-subtle">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>

          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-rose-500 to-teal-400 shadow-xl">
            <img src={profilePhoto} alt={profile.name} className="w-full h-full object-cover rounded-full" />
          </div>
        </div>

        {profile.cityOrCollege && (
          <div className="text-[11px] font-semibold text-slate-400 mb-6 bg-white/5 py-1.5 px-3 rounded-full border border-white/10 inline-block">
            {profile.cityOrCollege}
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onViewMatches}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg active:scale-95 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>View in Matches</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-2xl bg-white/10 text-slate-200 text-xs font-bold active:scale-95 transition"
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
}

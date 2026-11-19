'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Sparkles, AlertCircle, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

export default function MatchesTab({ onGoToDiscover }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMatches();
      setMatches(data.matches || []);
    } catch (err) {
      setError(err.message || 'Failed to load matches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Your Matches</h1>
          <p className="text-xs text-slate-500 font-medium">
            Mutual connections only &bull; Zero unilateral leaks
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>{matches.length} {matches.length === 1 ? 'Match' : 'Matches'}</span>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-center my-6">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
          <p className="text-xs font-semibold mb-3">{error}</p>
          <button
            onClick={fetchMatches}
            className="text-xs font-bold bg-rose-600 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-rose-700 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && matches.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[440px] text-center p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-rose-500 mb-4 shadow-inner">
            <Heart className="w-8 h-8 animate-bounce-subtle" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Matches Yet</h2>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs mb-6">
            Matches happen when you and another person both like each other. Coy keeps all likes private until it's mutual!
          </p>
          <button
            onClick={onGoToDiscover}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold text-xs py-3 px-6 rounded-2xl shadow-md shadow-rose-500/25 hover:from-rose-500 hover:to-rose-600 transition active:scale-95"
          >
            <span>Start Swiping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Matches Grid */}
      {!loading && !error && matches.length > 0 && (
        <div className="grid grid-cols-2 gap-3.5">
          {matches.map((item) => {
            const profile = item.profile || {};
            return (
              <div
                key={item.matchId}
                onClick={() => setSelectedMatch(profile)}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-slate-900 border border-slate-200/60"
              >
                <img
                  src={profile.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Match badge */}
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                </div>

                {/* Details */}
                <div className="absolute bottom-2.5 inset-x-2.5 text-white">
                  <div className="text-sm font-black flex items-baseline gap-1">
                    <span className="truncate">{profile.name}</span>
                    <span className="text-xs font-normal text-slate-300">{profile.age}</span>
                  </div>
                  {profile.cityOrCollege && (
                    <div className="text-[10px] text-slate-300 truncate font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                      <span className="truncate">{profile.cityOrCollege}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Match Detail Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-up border border-slate-200">
            {/* Header image */}
            <div className="relative h-64 bg-slate-900">
              <img
                src={selectedMatch.photo}
                alt={selectedMatch.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <button
                onClick={() => setSelectedMatch(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition"
              >
                &times;
              </button>
              <div className="absolute bottom-3 left-4 text-white">
                <div className="text-xl font-black">{selectedMatch.name}, {selectedMatch.age}</div>
                {selectedMatch.cityOrCollege && (
                  <div className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>{selectedMatch.cityOrCollege}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="p-5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About</div>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                {selectedMatch.bio}
              </p>

              {selectedMatch.interests && selectedMatch.interests.length > 0 && (
                <>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Interests</div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {selectedMatch.interests.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full border border-rose-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <button
                onClick={() => setSelectedMatch(null)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

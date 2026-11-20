'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';

export default function MatchesTab({ onDiscover }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMatches();
      setMatches(data.matches || []);
    } catch (err) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-24 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Your Matches</h1>
          <p className="text-xs text-slate-500">Mutual connections only</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>{matches.length} {matches.length === 1 ? 'Match' : 'Matches'}</span>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-center my-6">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
          <p className="text-xs font-semibold mb-3">{error}</p>
          <button onClick={fetchMatches} className="text-xs font-bold bg-rose-600 text-white px-4 py-2 rounded-xl">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && matches.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[440px] text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-rose-500 mb-4">
            <Heart className="w-8 h-8 animate-bounce-subtle" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Matches Yet</h2>
          <p className="text-slate-500 text-xs max-w-xs mb-6">
            Matches happen when you and another person both like each other.
          </p>
          <button
            onClick={onDiscover}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold text-xs py-3 px-6 rounded-2xl shadow active:scale-95 transition"
          >
            <span>Start Swiping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {!loading && !error && matches.length > 0 && (
        <div className="grid grid-cols-2 gap-3.5">
          {matches.map((item) => {
            const p = item.profile || {};
            return (
              <div
                key={item.matchId}
                onClick={() => setSelected(p)}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow cursor-pointer bg-slate-900"
              >
                <img src={p.photo} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                </div>
                <div className="absolute bottom-2.5 inset-x-2.5 text-white">
                  <div className="text-sm font-black flex items-baseline gap-1">
                    <span className="truncate">{p.name}</span>
                    <span className="text-xs text-slate-300">{p.age}</span>
                  </div>
                  {p.cityOrCollege && (
                    <div className="text-[10px] text-slate-300 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-rose-400" />
                      <span className="truncate">{p.cityOrCollege}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="relative h-64 bg-slate-900">
              <img src={selected.photo} alt={selected.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center"
              >
                &times;
              </button>
              <div className="absolute bottom-3 left-4 text-white">
                <div className="text-xl font-black">{selected.name}, {selected.age}</div>
                {selected.cityOrCollege && (
                  <div className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>{selected.cityOrCollege}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">About</div>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">{selected.bio}</p>

              {selected.interests?.length > 0 && (
                <>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1.5">Interests</div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {selected.interests.map((tag, i) => (
                      <span key={i} className="text-[11px] font-medium bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full border border-rose-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <button
                onClick={() => setSelected(null)}
                className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl shadow"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

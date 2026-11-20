'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ProfileCard from './ProfileCard';
import SwipeControls from './SwipeControls';
import EmptyFeed from './EmptyFeed';
import { api } from '../lib/api';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function DiscoverTab({ onMatch, onReset, isResetting }) {
  const [profiles, setProfiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swiping, setSwiping] = useState(false);
  const [direction, setDirection] = useState(null);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFeed();
      setProfiles(data.profiles || []);
      setIndex(0);
    } catch (err) {
      setError(err.message || 'Could not load profiles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const current = profiles[index];
  const next = profiles[index + 1];

  const handleSwipe = useCallback(
    async (dir) => {
      if (swiping || !current) return;

      const profile = current;
      setSwiping(true);
      setDirection(dir);

      try {
        const res = await api.swipe(profile._id, dir);

        setTimeout(() => {
          setIndex((prev) => prev + 1);
          setSwiping(false);
          setDirection(null);

          if (res.matched && res.match) {
            onMatch(res.match);
          }
        }, 320);
      } catch (err) {
        setSwiping(false);
        setDirection(null);
        setError(err.message || 'Failed to submit swipe');
      }
    },
    [swiping, current, onMatch]
  );

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-24 flex flex-col items-center justify-start min-h-[calc(100vh-140px)]">
      {loading && (
        <div className="w-full max-w-sm h-[540px] bg-slate-200 rounded-3xl animate-pulse flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          <span className="text-xs font-semibold text-slate-500">Loading profiles...</span>
        </div>
      )}

      {!loading && error && (
        <div className="w-full max-w-sm bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-3xl text-center shadow-sm my-auto">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">Error</h3>
          <p className="text-xs text-slate-600 mb-4">{error}</p>
          <button onClick={fetchFeed} className="w-full py-2.5 px-4 bg-rose-600 text-white text-xs font-bold rounded-xl">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && current && (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full max-w-sm h-[540px]">
            {next && <ProfileCard key={next._id} profile={next} isTop={false} />}
            <ProfileCard
              key={current._id}
              profile={current}
              isTop={true}
              onSwipe={handleSwipe}
              direction={direction}
              disabled={swiping}
            />
          </div>

          <SwipeControls onSwipe={handleSwipe} disabled={swiping} />
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            Drag card or use buttons &bull; &larr; Pass &bull; Like &rarr;
          </p>
        </div>
      )}

      {!loading && !error && !current && (
        <EmptyFeed
          onReset={async () => {
            await onReset();
            await fetchFeed();
          }}
          isResetting={isResetting}
        />
      )}
    </div>
  );
}

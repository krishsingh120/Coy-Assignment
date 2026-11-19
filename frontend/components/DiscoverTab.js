'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProfileCard from './ProfileCard';
import SwipeControls from './SwipeControls';
import EmptyFeed from './EmptyFeed';
import { api } from '../lib/api';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function DiscoverTab({ onMatchOccurred, onResetDemo, isResetting, onViewMatches }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation lock and direction state
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Load feed from API
  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFeed();
      setProfiles(data.profiles || []);
      setCurrentIndex(0);
    } catch (err) {
      setError(err.message || 'Could not load profiles. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Current and next profile
  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  // Core Swipe Handler
  const handleSwipe = useCallback(
    async (direction) => {
      // Guard against race conditions / multiple swipes on the same card
      if (isSwiping || !currentProfile) return;

      const profileToSwipe = currentProfile;
      setIsSwiping(true);
      setSwipeDirection(direction);

      try {
        // Submit swipe to backend API
        const response = await api.swipe(profileToSwipe._id, direction);

        // Allow exit animation to complete smoothly (300ms)
        setTimeout(() => {
          // Advance feed
          setCurrentIndex((prev) => prev + 1);
          setIsSwiping(false);
          setSwipeDirection(null);

          // If mutual match confirmed by backend, trigger celebration modal
          if (response.matched && response.match) {
            onMatchOccurred(response.match);
          }
        }, 320);
      } catch (err) {
        console.error('Swipe error:', err);
        // Reset card animation on failure so user isn't stuck
        setIsSwiping(false);
        setSwipeDirection(null);
        setError(err.message || 'Failed to submit swipe. Please try again.');
      }
    },
    [isSwiping, currentProfile, onMatchOccurred]
  );

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-24 flex flex-col items-center justify-start min-h-[calc(100vh-140px)]">
      {/* Loading Skeleton */}
      {loading && (
        <div className="w-full max-w-sm h-[540px] bg-slate-200 rounded-3xl animate-pulse flex flex-col items-center justify-center text-slate-400 gap-3 border border-slate-300/40">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          <span className="text-xs font-semibold text-slate-500">Curating profiles near you...</span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="w-full max-w-sm bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-3xl text-center shadow-sm my-auto">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-900 mb-1">Connection Issue</h3>
          <p className="text-xs text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchFeed}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Active Profile Stack */}
      {!loading && !error && currentProfile && (
        <div className="w-full flex flex-col items-center">
          {/* Card Stack Container (Holds top card and next card for depth) */}
          <div className="relative w-full max-w-sm h-[540px]">
            {/* Background card (peeking through) */}
            {nextProfile && (
              <ProfileCard
                key={nextProfile._id}
                profile={nextProfile}
                isTopCard={false}
              />
            )}

            {/* Top draggable active card */}
            <ProfileCard
              key={currentProfile._id}
              profile={currentProfile}
              isTopCard={true}
              onSwipe={handleSwipe}
              swipeDirection={swipeDirection}
              disabled={isSwiping}
            />
          </div>

          {/* Tactile Buttons for desktop / quick mobile tapping */}
          <SwipeControls onSwipe={handleSwipe} disabled={isSwiping} />

          {/* Mobile swipe helper tip */}
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            Drag card or use buttons &bull; &larr; Pass &bull; Like &rarr;
          </p>
        </div>
      )}

      {/* Empty State when all profiles swiped */}
      {!loading && !error && !currentProfile && (
        <EmptyFeed
          onResetDemo={async () => {
            await onResetDemo();
            await fetchFeed();
          }}
          isResetting={isResetting}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import HomeTab from '../components/HomeTab';
import DiscoverTab from '../components/DiscoverTab';
import MatchesTab from '../components/MatchesTab';
import MatchModal from '../components/MatchModal';
import { api } from '../lib/api';

export default function App() {
  const [tab, setTab] = useState('discover');
  const [user, setUser] = useState(null);
  const [matchesCount, setMatchesCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [feedKey, setFeedKey] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const [meRes, matchesRes] = await Promise.allSettled([
        api.getMe(),
        api.getMatches()
      ]);

      if (meRes.status === 'fulfilled' && meRes.value.user) {
        setUser(meRes.value.user);
      }
      if (matchesRes.status === 'fulfilled' && matchesRes.value.matches) {
        setMatchesCount(matchesRes.value.matches.length);
      }
    } catch (err) {
      console.warn('Data load error:', err.message);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onMatch = useCallback((matchData) => {
    setCurrentMatch(matchData);
    setMatchesCount((c) => c + 1);
  }, []);

  const onReset = useCallback(async () => {
    setIsResetting(true);
    try {
      await api.resetDemo();
      setMatchesCount(0);
      setFeedKey((k) => k + 1);
      await loadData();
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setIsResetting(false);
    }
  }, [loadData]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        tab={tab}
        setTab={setTab}
        matchesCount={matchesCount}
        onReset={onReset}
        isResetting={isResetting}
      />

      <main className="flex-1 max-w-md w-full mx-auto">
        {tab === 'home' && (
          <HomeTab onDiscover={() => setTab('discover')} user={user} />
        )}

        {tab === 'discover' && (
          <DiscoverTab
            key={feedKey}
            onMatch={onMatch}
            onReset={onReset}
            isResetting={isResetting}
          />
        )}

        {tab === 'matches' && (
          <MatchesTab onDiscover={() => setTab('discover')} />
        )}
      </main>

      {currentMatch && (
        <MatchModal
          match={currentMatch}
          user={user}
          onClose={() => setCurrentMatch(null)}
          onViewMatches={() => {
            setCurrentMatch(null);
            setTab('matches');
          }}
        />
      )}
    </div>
  );
}

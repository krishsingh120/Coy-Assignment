'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import HomeTab from '../components/HomeTab';
import DiscoverTab from '../components/DiscoverTab';
import MatchesTab from '../components/MatchesTab';
import MatchModal from '../components/MatchModal';
import { api } from '../lib/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [demoUser, setDemoUser] = useState(null);
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [feedKey, setFeedKey] = useState(0);

  // Fetch logged in demo user and match count
  const refreshUserData = useCallback(async () => {
    try {
      const [meRes, matchesRes] = await Promise.allSettled([
        api.getMe(),
        api.getMatches()
      ]);

      if (meRes.status === 'fulfilled' && meRes.value.user) {
        setDemoUser(meRes.value.user);
      }
      if (matchesRes.status === 'fulfilled' && matchesRes.value.matches) {
        setMatchCount(matchesRes.value.matches.length);
      }
    } catch (err) {
      console.warn('Initial data load warning:', err.message);
    }
  }, []);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // Handle mutual match triggered from Discover tab
  const handleMatchOccurred = useCallback((matchData) => {
    setCurrentMatch(matchData);
    setMatchCount((prev) => prev + 1);
  }, []);

  // Handle demo reset
  const handleResetDemo = useCallback(async () => {
    setIsResetting(true);
    try {
      await api.resetDemo();
      setMatchCount(0);
      setFeedKey((k) => k + 1);
      await refreshUserData();
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setIsResetting(false);
    }
  }, [refreshUserData]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar & Bottom Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        matchCount={matchCount}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto">
        {activeTab === 'home' && (
          <HomeTab
            onGoToDiscover={() => setActiveTab('discover')}
            demoUser={demoUser}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverTab
            key={feedKey}
            onMatchOccurred={handleMatchOccurred}
            onResetDemo={handleResetDemo}
            isResetting={isResetting}
            onViewMatches={() => setActiveTab('matches')}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesTab
            onGoToDiscover={() => setActiveTab('discover')}
          />
        )}
      </main>

      {/* Mutual Match Celebration Modal */}
      {currentMatch && (
        <MatchModal
          matchData={currentMatch}
          demoUser={demoUser}
          onClose={() => setCurrentMatch(null)}
          onViewMatches={() => {
            setCurrentMatch(null);
            setActiveTab('matches');
          }}
        />
      )}
    </div>
  );
}

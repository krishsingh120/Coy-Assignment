'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Sparkles, AlertCircle, Heart, X } from 'lucide-react';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

export default function ProfileCard({
  profile,
  isTopCard = true,
  onSwipe,
  swipeDirection = null,
  disabled = false
}) {
  const [photoSrc, setPhotoSrc] = useState(profile?.photo || FALLBACK_PHOTO);
  const [imageError, setImageError] = useState(false);

  // Drag state for gesture-driven swiping
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    if (profile?.photo) {
      setPhotoSrc(profile.photo);
      setImageError(false);
    }
  }, [profile]);

  // Pointer event handlers
  const handlePointerDown = (e) => {
    if (!isTopCard || disabled) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setDragOffset({ x: 0, y: 0 });
    // Capture pointer so drag remains smooth outside card bounds
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !isTopCard || disabled) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    const dx = currentX - dragStartRef.current.x;
    const dy = currentY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e) => {
    if (!isDragging || !isTopCard || disabled) return;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Ignored if already released
    }

    const threshold = 90; // Pixels required to trigger swipe
    if (dragOffset.x > threshold) {
      onSwipe('LIKE');
    } else if (dragOffset.x < -threshold) {
      onSwipe('PASS');
    } else {
      // Reset position smoothly
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Keyboard navigation accessibility
  useEffect(() => {
    if (!isTopCard || disabled) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        onSwipe('LIKE');
      } else if (e.key === 'ArrowLeft') {
        onSwipe('PASS');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTopCard, disabled, onSwipe]);

  // Calculate dynamic transform and stamps
  let cardTransform = '';
  let transitionStyle = isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.25s ease';
  let opacity = 1;

  if (swipeDirection) {
    // Flying out after button press or swipe trigger
    const exitX = swipeDirection === 'LIKE' ? 800 : -800;
    const exitRotate = swipeDirection === 'LIKE' ? 30 : -30;
    cardTransform = `translate3d(${exitX}px, 40px, 0) rotate(${exitRotate}deg)`;
    transitionStyle = 'transform 0.4s ease-in, opacity 0.35s ease-in';
    opacity = 0;
  } else if (isTopCard) {
    const rotate = dragOffset.x * 0.08;
    cardTransform = `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotate}deg)`;
  } else {
    // Card stacked behind top card
    cardTransform = 'scale(0.95) translate3d(0, 14px, 0)';
    opacity = 0.9;
  }

  // Stamp badge opacities
  const likeOpacity = isTopCard
    ? swipeDirection === 'LIKE'
      ? 1
      : dragOffset.x > 0
      ? Math.min(dragOffset.x / 80, 1)
      : 0
    : 0;

  const passOpacity = isTopCard
    ? swipeDirection === 'PASS'
      ? 1
      : dragOffset.x < 0
      ? Math.min(Math.abs(dragOffset.x) / 80, 1)
      : 0
    : 0;

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        transform: cardTransform,
        transition: transitionStyle,
        opacity: opacity,
        zIndex: isTopCard ? 20 : 10
      }}
      className={`absolute inset-0 w-full h-[540px] max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl bg-slate-900 select-none cursor-grab active:cursor-grabbing border border-slate-800/40`}
    >
      {/* Background Image with Fallback */}
      <img
        src={photoSrc}
        alt={profile.name}
        onError={() => {
          if (!imageError) {
            setImageError(true);
            setPhotoSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=800&background=f43f5e&color=fff`);
          }
        }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      {/* LIKE Stamp Badge */}
      <div
        style={{ opacity: likeOpacity }}
        className="absolute top-6 left-6 -rotate-12 z-30 transition-opacity pointer-events-none"
      >
        <div className="border-4 border-emerald-400 bg-emerald-500/30 backdrop-blur-sm text-emerald-400 font-black tracking-widest text-2xl px-4 py-1.5 rounded-xl uppercase shadow-lg flex items-center gap-1.5">
          <Heart className="w-6 h-6 fill-emerald-400" />
          <span>LIKE</span>
        </div>
      </div>

      {/* NOPE / PASS Stamp Badge */}
      <div
        style={{ opacity: passOpacity }}
        className="absolute top-6 right-6 rotate-12 z-30 transition-opacity pointer-events-none"
      >
        <div className="border-4 border-rose-500 bg-rose-600/30 backdrop-blur-sm text-rose-500 font-black tracking-widest text-2xl px-4 py-1.5 rounded-xl uppercase shadow-lg flex items-center gap-1.5">
          <X className="w-6 h-6 stroke-[3]" />
          <span>NOPE</span>
        </div>
      </div>

      {/* Profile Details at bottom */}
      <div className="absolute bottom-0 inset-x-0 p-5 text-white pointer-events-none z-20">
        {/* Name and Age */}
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-2xl font-black tracking-tight">{profile.name}</h2>
          <span className="text-2xl font-medium text-slate-200">{profile.age}</span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 ml-1 mb-1.5 animate-pulse" title="Online" />
        </div>

        {/* Location or College */}
        {profile.cityOrCollege && (
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-3">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{profile.cityOrCollege}</span>
          </div>
        )}

        {/* Short Bio */}
        <p className="text-xs text-slate-200/90 leading-relaxed line-clamp-3 mb-3 font-normal">
          {profile.bio}
        </p>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {profile.interests.slice(0, 4).map((interest, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold bg-white/15 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-white/10"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

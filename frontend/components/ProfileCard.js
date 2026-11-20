'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Heart, X } from 'lucide-react';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

export default function ProfileCard({ profile, isTop = true, onSwipe, direction, disabled }) {
  const [photo, setPhoto] = useState(profile?.photo || FALLBACK_PHOTO);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (profile?.photo) setPhoto(profile.photo);
  }, [profile]);

  const onPointerDown = (e) => {
    if (!isTop || disabled) return;
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0 });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging || !isTop || disabled) return;
    setDrag({
      x: e.clientX - startRef.current.x,
      y: e.clientY - startRef.current.y
    });
  };

  const onPointerUp = (e) => {
    if (!dragging || !isTop || disabled) return;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (drag.x > 90) {
      onSwipe('LIKE');
    } else if (drag.x < -90) {
      onSwipe('PASS');
    } else {
      setDrag({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (!isTop || disabled) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') onSwipe('LIKE');
      if (e.key === 'ArrowLeft') onSwipe('PASS');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isTop, disabled, onSwipe]);

  let transform = '';
  let transition = dragging ? 'none' : 'transform 0.3s ease, opacity 0.25s ease';
  let opacity = 1;

  if (direction) {
    const exitX = direction === 'LIKE' ? 800 : -800;
    const rotate = direction === 'LIKE' ? 30 : -30;
    transform = `translate3d(${exitX}px, 40px, 0) rotate(${rotate}deg)`;
    transition = 'transform 0.35s ease-in, opacity 0.3s ease-in';
    opacity = 0;
  } else if (isTop) {
    transform = `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${drag.x * 0.08}deg)`;
  } else {
    transform = 'scale(0.95) translate3d(0, 14px, 0)';
    opacity = 0.9;
  }

  const likeOpacity = isTop
    ? direction === 'LIKE' ? 1 : drag.x > 0 ? Math.min(drag.x / 80, 1) : 0
    : 0;

  const passOpacity = isTop
    ? direction === 'PASS' ? 1 : drag.x < 0 ? Math.min(Math.abs(drag.x) / 80, 1) : 0
    : 0;

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ transform, transition, opacity, zIndex: isTop ? 20 : 10 }}
      className="absolute inset-0 w-full h-[540px] max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl bg-slate-900 select-none cursor-grab active:cursor-grabbing border border-slate-800"
    >
      <img
        src={photo}
        alt={profile.name}
        onError={() => setPhoto(`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=800`)}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      <div style={{ opacity: likeOpacity }} className="absolute top-6 left-6 -rotate-12 z-30 transition-opacity pointer-events-none">
        <div className="border-4 border-emerald-400 bg-emerald-500/30 text-emerald-400 font-black text-2xl px-4 py-1.5 rounded-xl uppercase flex items-center gap-1.5 shadow">
          <Heart className="w-6 h-6 fill-emerald-400" />
          <span>LIKE</span>
        </div>
      </div>

      <div style={{ opacity: passOpacity }} className="absolute top-6 right-6 rotate-12 z-30 transition-opacity pointer-events-none">
        <div className="border-4 border-rose-500 bg-rose-600/30 text-rose-500 font-black text-2xl px-4 py-1.5 rounded-xl uppercase flex items-center gap-1.5 shadow">
          <X className="w-6 h-6 stroke-[3]" />
          <span>NOPE</span>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-5 text-white pointer-events-none z-20">
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-2xl font-black">{profile.name}</h2>
          <span className="text-2xl text-slate-200">{profile.age}</span>
        </div>

        {profile.cityOrCollege && (
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-2">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{profile.cityOrCollege}</span>
          </div>
        )}

        <p className="text-xs text-slate-200 line-clamp-3 mb-3">{profile.bio}</p>

        {profile.interests?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.slice(0, 4).map((tag, i) => (
              <span key={i} className="text-[11px] font-semibold bg-white/15 text-white px-2.5 py-0.5 rounded-full border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

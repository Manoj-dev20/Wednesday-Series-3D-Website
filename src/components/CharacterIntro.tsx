/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';

// ✅ FIX: Proper GSAP type (NO GSAP import error)
type GSAPType = typeof import('gsap').gsap;

// ✅ FIX: Window typing
declare global {
  interface Window {
    __gsapRef?: GSAPType;
  }
}

// ============================================================
// DATA
// ============================================================

interface CharacterData {
  name: string;
  surname: string;
  role: string;
  quote: string;
  stat1: { value: string; label: string };
  stat2: { value: string; label: string };
  details: string[];
  abilities: string[];
  image: string;
}

const CHARACTERS: CharacterData[] = [
  {
    name: 'Wednesday',
    surname: 'Addams',
    role: 'Protagonist · Nevermore Academy',
    quote: '"I don\'t smile. I plot."',
    stat1: { value: '16', label: 'Age' },
    stat2: { value: '∞', label: 'Power' },
    details: ['Nevermore Academy', 'Addams Family', 'Outcast'],
    abilities: ['Psychic Visions', 'Exceptional Intelligence', 'Cello Prodigy'],
    image: '/characters/wednesday.png',
  },
  {
    name: 'Tyler',
    surname: 'Galpin',
    role: 'Anti-Hero · The Hyde',
    quote: '"Monsters aren\'t born. They\'re made."',
    stat1: { value: 'Hyde', label: 'Threat' },
    stat2: { value: 'Dormant', label: 'Status' },
    details: ['Jericho Town', "Sheriff's Son", 'Weathervane Café'],
    abilities: ['Hyde Transformation', 'Superhuman Strength', 'Deception'],
    image: '/characters/tyler.png',
  },
  {
    name: 'Enid',
    surname: 'Sinclair',
    role: 'Ally · Werewolf',
    quote: '"You need me more than you think."',
    stat1: { value: 'Max', label: 'Energy' },
    stat2: { value: '∞', label: 'Loyalty' },
    details: ['Nevermore Academy', 'Werewolf Clan', 'Room 17'],
    abilities: ['Partial Shift', 'Empathy', 'Unbreakable Spirit'],
    image: '/characters/enid.png',
  },
];

interface ShotConfig {
  label: string;
  wrap: { x: number; y: number; scale: number };
  halo: { scale: number; opacity: number };
  texts: string[];
}

const SHOTS: ShotConfig[] = [
  { label: 'CAM · 001 — WIDE', wrap: { x: 0, y: 0, scale: 1 }, halo: { scale: 1, opacity: 0.7 }, texts: ['role', 'name', 'surname'] },
  { label: 'CAM · 002 — FACE CLOSE', wrap: { x: -18, y: -50, scale: 1.32 }, halo: { scale: 0.7, opacity: 0.25 }, texts: ['name', 'stat1', 'stat2'] },
  { label: 'CAM · 003 — PAN RIGHT', wrap: { x: 60, y: 18, scale: 1.22 }, halo: { scale: 1.2, opacity: 0.18 }, texts: ['role', 'detail'] },
  { label: 'CAM · 004 — PAN LEFT', wrap: { x: -65, y: 28, scale: 1.18 }, halo: { scale: 0.88, opacity: 0.5 }, texts: ['quote', 'abilities'] },
  { label: 'CAM · 005 — PULL BACK', wrap: { x: 0, y: 35, scale: 0.86 }, halo: { scale: 1.6, opacity: 0.9 }, texts: ['role', 'name', 'surname', 'quote'] },
];

const TOTAL_SCROLL = CHARACTERS.length * SHOTS.length * 300;

// ============================================================
// COMPONENT
// ============================================================

export default function CharacterIntro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const charWrapRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const halo2Ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const currentCharIdx = useRef(0);
  const currentShotIdx = useRef(0);

  const [isReady, setIsReady] = useState(false);

  const showShot = useCallback((charIdx: number, shotIdx: number) => {
    const gsap = window.__gsapRef;
    if (!gsap || !charWrapRef.current) return;

    const char = CHARACTERS[charIdx];
    const shot = SHOTS[shotIdx];

    gsap.to(charWrapRef.current, {
      x: shot.wrap.x,
      y: shot.wrap.y,
      scale: shot.wrap.scale,
      duration: 1,
    });

    gsap.to(haloRef.current, {
      scale: shot.halo.scale,
      opacity: shot.halo.opacity,
      duration: 1,
    });

    gsap.to(halo2Ref.current, {
      scale: shot.halo.scale * 1.1,
      opacity: shot.halo.opacity * 0.3,
      duration: 1,
    });

    if (imgRef.current) {
      imgRef.current.src = char.image;
    }

    currentCharIdx.current = charIdx;
    currentShotIdx.current = shotIdx;
  }, []);

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import('gsap');
      const stMod = await import('gsap/ScrollTrigger');

      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      window.__gsapRef = gsap;

      showShot(0, 0);
      setIsReady(true);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const totalShots = CHARACTERS.length * SHOTS.length;
          let shotNum = Math.floor(self.progress * totalShots);
          shotNum = Math.min(shotNum, totalShots - 1);

          const charIdx = Math.floor(shotNum / SHOTS.length);
          const shotIdx = shotNum % SHOTS.length;

          showShot(charIdx, shotIdx);
        },
      });
    };

    init();
  }, [showShot]);

  return (
    <div ref={sectionRef} style={{ height: `calc(100vh + ${TOTAL_SCROLL}px)` }}>
      <div className="sticky top-0 h-screen bg-black flex items-center justify-center">
        <div ref={charWrapRef} className="relative">
          <div ref={halo2Ref} className="absolute w-[480px] h-[480px] border border-white/10 rounded-full" />
          <div ref={haloRef} className="absolute w-[360px] h-[360px] border border-white/20 rounded-full" />
          <img
            ref={imgRef}
            src={CHARACTERS[0].image}
            alt="character"
            className="relative z-10 h-[80vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
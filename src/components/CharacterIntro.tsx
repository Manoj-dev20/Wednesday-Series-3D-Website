/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';

// ✅ GSAP type fix
type GSAPType = typeof import('gsap').gsap;

declare global {
  interface Window {
    __gsapRef?: GSAPType;
  }
}

// ================= DATA =================

interface CharacterData {
  name: string;
  surname: string;
  role: string;
  quote: string;
  stat1: { value: string; label: string };
  stat2: { value: string; label: string };
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
    image: '/characters/wednesday.png',
  },
  {
    name: 'Tyler',
    surname: 'Galpin',
    role: 'The Hyde',
    quote: '"Monsters aren\'t born. They\'re made."',
    stat1: { value: 'Hyde', label: 'Threat' },
    stat2: { value: 'Dormant', label: 'Status' },
    image: '/characters/tyler.png',
  },
  {
    name: 'Enid',
    surname: 'Sinclair',
    role: 'Werewolf',
    quote: '"You need me more than you think."',
    stat1: { value: 'Max', label: 'Energy' },
    stat2: { value: '∞', label: 'Loyalty' },
    image: '/characters/enid.png',
  },
];

// ================= COMPONENT =================

export default function CharacterIntro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const charWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const textRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [isReady, setIsReady] = useState(false);

  const showCharacter = useCallback((index: number) => {
    const gsap = window.__gsapRef;
    if (!gsap || !charWrapRef.current) return;

    const char = CHARACTERS[index];

    // 🎥 Camera movement
    gsap.to(charWrapRef.current, {
      scale: 1.1,
      duration: 1,
    });

    // 🖼 Image change
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (imgRef.current) {
            imgRef.current.src = char.image;
            gsap.to(imgRef.current, { opacity: 1, duration: 0.5 });
          }
        },
      });
    }

    // 📝 TEXT UPDATE
    const els = textRefs.current;

    if (els.name) els.name.innerText = char.name;
    if (els.surname) els.surname.innerText = char.surname;
    if (els.role) els.role.innerText = char.role;
    if (els.quote) els.quote.innerText = char.quote;
    if (els.stat1) els.stat1.innerText = `${char.stat1.value} — ${char.stat1.label}`;
    if (els.stat2) els.stat2.innerText = `${char.stat2.value} — ${char.stat2.label}`;

    // ✨ TEXT ANIMATION
    Object.values(els).forEach((el) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      );
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      const gsapMod = await import('gsap');
      const stMod = await import('gsap/ScrollTrigger');

      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      window.__gsapRef = gsap;

      setIsReady(true);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const total = CHARACTERS.length;
          const index = Math.floor(self.progress * total);
          showCharacter(Math.min(index, total - 1));
        },
      });
    };

    init();
  }, [showCharacter]);

  return (
    <div ref={sectionRef} style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen bg-black flex items-center justify-center relative">

        {/* IMAGE */}
        <div ref={charWrapRef}>
          <img
            ref={imgRef}
            src={CHARACTERS[0].image}
            alt="character"
            className="h-[80vh] object-contain"
          />
        </div>

        {/* TEXT UI */}
        <div className="absolute inset-0 text-white pointer-events-none">

          <div ref={(el) =>{
             textRefs.current.role = el}} className="absolute top-10 left-10 text-sm opacity-70" />

          <div ref={(el) =>{
             textRefs.current.name = el}} className="absolute top-20 left-10 text-5xl font-light" />
          <div ref={(el) =>{
             textRefs.current.surname = el}} className="absolute top-36 left-10 text-xl tracking-[6px] opacity-50" />

          <div ref={(el) => {
            textRefs.current.quote = el}} className="absolute bottom-20 left-10 text-sm italic opacity-60" />

          <div ref={(el) => {
            textRefs.current.stat1 = el}} className="absolute right-10 top-1/2 text-sm text-right" />
          <div ref={(el) => {
            textRefs.current.stat2 = el}} className="absolute right-10 top-[60%] text-sm text-right" />

        </div>

      </div>
    </div>
  );
}
'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

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
  texts: string[]; // keys of text blocks to show
}

const SHOTS: ShotConfig[] = [
  {
    label: 'CAM · 001 — WIDE',
    wrap: { x: 0, y: 0, scale: 1 },
    halo: { scale: 1, opacity: 0.7 },
    texts: ['role', 'name', 'surname'],
  },
  {
    label: 'CAM · 002 — FACE CLOSE',
    wrap: { x: -18, y: -50, scale: 1.32 },
    halo: { scale: 0.7, opacity: 0.25 },
    texts: ['name', 'stat1', 'stat2'],
  },
  {
    label: 'CAM · 003 — PAN RIGHT',
    wrap: { x: 60, y: 18, scale: 1.22 },
    halo: { scale: 1.2, opacity: 0.18 },
    texts: ['role', 'detail'],
  },
  {
    label: 'CAM · 004 — PAN LEFT',
    wrap: { x: -65, y: 28, scale: 1.18 },
    halo: { scale: 0.88, opacity: 0.5 },
    texts: ['quote', 'abilities'],
  },
  {
    label: 'CAM · 005 — PULL BACK',
    wrap: { x: 0, y: 35, scale: 0.86 },
    halo: { scale: 1.6, opacity: 0.9 },
    texts: ['role', 'name', 'surname', 'quote'],
  },
];

const ALL_TEXT_KEYS = ['index', 'role', 'name', 'surname', 'quote', 'stat1', 'stat2', 'detail', 'abilities'];
const SCROLL_PER_SHOT = 300;
const TOTAL_SCROLL = CHARACTERS.length * SHOTS.length * SCROLL_PER_SHOT; // 4500

// ============================================================
// COMPONENT
// ============================================================

export default function CharacterIntro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const charWrapRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const halo2Ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const camLabelRef = useRef<HTMLDivElement>(null);

  const textRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentCharIdx = useRef(0);
  const currentShotIdx = useRef(0);

  const [isReady, setIsReady] = useState(false);

  // Set a text ref
  const setTextRef = useCallback((key: string) => (el: HTMLDivElement | null) => {
    textRefs.current[key] = el;
  }, []);

  // Set a dot ref
  const setDotRef = useCallback((i: number) => (el: HTMLDivElement | null) => {
    dotRefs.current[i] = el;
  }, []);

  // ---- SHOW SHOT (no animation lock — safe to call anytime) ----
  const showShot = useCallback((charIdx: number, shotIdx: number, direction: number = 1, instant = false) => {
    const gsapModule = (window as any).__gsapRef;
    if (!gsapModule) return;
    const gsap = gsapModule;

    const char = CHARACTERS[charIdx];
    const shot = SHOTS[shotIdx];
    const charChanged = charIdx !== currentCharIdx.current;

    const dur = instant ? 0 : 1.1;

    // 1. Animate camera wrap
    gsap.to(charWrapRef.current, {
      x: shot.wrap.x,
      y: shot.wrap.y,
      scale: shot.wrap.scale,
      duration: dur,
      ease: 'power3.inOut',
      overwrite: 'auto',
    });

    // 2. Animate halos
    gsap.to(haloRef.current, {
      scale: shot.halo.scale,
      opacity: shot.halo.opacity,
      duration: dur,
      ease: 'power3.inOut',
      overwrite: 'auto',
    });
    gsap.to(halo2Ref.current, {
      scale: shot.halo.scale * 1.12,
      opacity: shot.halo.opacity * 0.35,
      duration: instant ? 0 : 1.2,
      ease: 'power3.inOut',
      overwrite: 'auto',
    });

    // 3. Hide outgoing text blocks
    ALL_TEXT_KEYS.forEach((key) => {
      if (!shot.texts.includes(key)) {
        const el = textRefs.current[key];
        if (el) {
          gsap.to(el, { opacity: 0, x: direction * -16, duration: instant ? 0 : 0.28, ease: 'power2.in', overwrite: 'auto' });
        }
      }
    });

    // 4. Swap character image if changed
    if (charChanged && imgRef.current) {
      if (instant) {
        imgRef.current.src = char.image;
      } else {
        gsap.to(imgRef.current, {
          opacity: 0,
          duration: 0.25,
          overwrite: 'auto',
          onComplete: () => {
            if (imgRef.current) {
              imgRef.current.src = char.image;
              gsap.to(imgRef.current, { opacity: 1, duration: 0.4 });
            }
          },
        });
      }
    }

    // 5. Update text content
    const updateTextContent = () => {
      const els = textRefs.current;
      if (els.index) els.index.innerHTML = `${String(charIdx + 1).padStart(2, '0')} / ${String(CHARACTERS.length).padStart(2, '0')}`;
      if (els.role) els.role.innerHTML = char.role;
      if (els.name) els.name.innerHTML = char.name;
      if (els.surname) els.surname.innerHTML = char.surname;
      if (els.quote) els.quote.innerHTML = `<em>${char.quote}</em>`;
      if (els.stat1) els.stat1.innerHTML = `<span style="font-size:30px;font-weight:600;display:block;line-height:1.1">${char.stat1.value}</span><span style="font-size:9px;text-transform:uppercase;letter-spacing:3px;opacity:0.5;display:block;margin-top:4px">${char.stat1.label}</span>`;
      if (els.stat2) els.stat2.innerHTML = `<span style="font-size:30px;font-weight:600;display:block;line-height:1.1">${char.stat2.value}</span><span style="font-size:9px;text-transform:uppercase;letter-spacing:3px;opacity:0.5;display:block;margin-top:4px">${char.stat2.label}</span>`;
      if (els.detail) els.detail.innerHTML = char.details.map((d) => `<div style="margin-bottom:3px">${d}</div>`).join('');
      if (els.abilities) els.abilities.innerHTML = char.abilities.map((a) => `<div style="margin-bottom:3px">${a}</div>`).join('');
    };

    if (charChanged && !instant) {
      setTimeout(updateTextContent, 280);
    } else {
      updateTextContent();
    }

    // 6. Reveal incoming text blocks
    const revealDelay = instant ? 0 : (charChanged ? 400 : 300);
    setTimeout(() => {
      shot.texts.forEach((key, i) => {
        const el = textRefs.current[key];
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, x: instant ? 0 : direction * 20 },
            { opacity: 1, x: 0, duration: instant ? 0 : 0.5, delay: instant ? 0 : i * 0.09, ease: 'power3.out', overwrite: 'auto' }
          );
        }
      });
      const idxEl = textRefs.current.index;
      if (idxEl) {
        gsap.to(idxEl, { opacity: 1, x: 0, duration: instant ? 0 : 0.4, overwrite: 'auto' });
      }
    }, revealDelay);

    // 7. Update camera label
    if (camLabelRef.current) {
      if (instant) {
        camLabelRef.current.textContent = shot.label;
        camLabelRef.current.style.opacity = '1';
      } else {
        gsap.to(camLabelRef.current, {
          opacity: 0,
          duration: 0.15,
          overwrite: 'auto',
          onComplete: () => {
            if (camLabelRef.current) {
              camLabelRef.current.textContent = shot.label;
              gsap.to(camLabelRef.current, { opacity: 1, duration: 0.3 });
            }
          },
        });
      }
    }

    // 8. Update dot navigation
    const totalDots = CHARACTERS.length * SHOTS.length;
    const activeDot = charIdx * SHOTS.length + shotIdx;
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      if (i === activeDot) {
        dot.style.width = '18px';
        dot.style.borderRadius = '3px';
        dot.style.background = 'rgba(255,255,255,0.6)';
      } else {
        dot.style.width = '5px';
        dot.style.borderRadius = '50%';
        dot.style.background = 'rgba(255,255,255,0.2)';
      }
    });

    // 9. Update progress bar
    if (progressRef.current) {
      const pct = ((charIdx * SHOTS.length + shotIdx) / (totalDots - 1)) * 100;
      progressRef.current.style.width = `${pct}%`;
    }

    currentCharIdx.current = charIdx;
    currentShotIdx.current = shotIdx;
  }, []);

  // ---- GSAP SETUP ----
  useEffect(() => {
    let gsap: any;
    let ScrollTrigger: any;
    let trigger: any;

    const init = async () => {
      const gsapMod = await import('gsap');
      const stMod = await import('gsap/ScrollTrigger');
      gsap = gsapMod.gsap;
      ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // Store gsap globally for showShot
      (window as any).__gsapRef = gsap;

      // Initial state — instant, no animation
      showShot(0, 0, 1, true);
      setIsReady(true);

      let lastShotNum = -1;

      // Unpinned trigger using CSS sticky
      trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: false,
        onUpdate: (self: any) => {
          const totalShots = CHARACTERS.length * SHOTS.length;
          let shotNum = Math.floor(self.progress * totalShots);
          shotNum = Math.min(shotNum, totalShots - 1);
          shotNum = Math.max(shotNum, 0);

          if (shotNum !== lastShotNum) {
            const direction = shotNum > lastShotNum ? 1 : -1;
            lastShotNum = shotNum;
            const charIdx = Math.floor(shotNum / SHOTS.length);
            const shotIdx = shotNum % SHOTS.length;
            showShot(charIdx, shotIdx, direction);
          }
        },
      });
      
      // We still listen for load simply to refresh the start/end points 
      // of this trigger in case elements above change height massively.
      // But because it's not pinned by GSAP, it doesn't break.
      if (document.readyState !== 'complete') {
        window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      }
    };

    init();

    return () => {
      if (trigger) trigger.kill();
    };
  }, [showShot]);

  // ---- RENDER ----
  const totalDots = CHARACTERS.length * SHOTS.length;

  return (
    <div
      ref={sectionRef}
      style={{ height: `calc(100vh + ${TOTAL_SCROLL}px)` }}
      className="relative w-full"
    >
      <div
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{
          backgroundColor: '#060608',
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        {/* Progress bar */}
        <div
          className="absolute top-0 left-0 right-0 z-10"
          style={{ height: '1.5px', background: 'rgba(255,255,255,0.05)' }}
        >
          <div
            ref={progressRef}
            style={{
              height: '100%',
              width: '0%',
              background: 'rgba(255,255,255,0.28)',
              transition: 'width 0.5s ease',
            }}
          />
        </div>

        {/* Scene */}
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
          {/* Camera wrap — GSAP transforms this */}
          <div
            ref={charWrapRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{ willChange: 'transform' }}
          >
            {/* Outer halo */}
            <div
              ref={halo2Ref}
              className="absolute rounded-full"
              style={{
                width: '480px',
                height: '480px',
                border: '1px solid rgba(255,255,255,0.025)',
                opacity: 0.25,
              }}
            />
            {/* Inner halo */}
            <div
              ref={haloRef}
              className="absolute rounded-full"
              style={{
                width: '360px',
                height: '360px',
                border: '1px solid rgba(255,255,255,0.06)',
                opacity: 0.7,
              }}
            />
            {/* Character image */}
            <img
              ref={imgRef}
              src={CHARACTERS[0].image}
              alt="Character"
              style={{
                height: '110%',
                width: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0.92) contrast(1.05)',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>
        </div>

        {/* Vignettes */}
        {/* Left vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 3,
            background: 'linear-gradient(to right, #060608 0%, rgba(6,6,8,0.75) 28%, transparent 55%)',
          }}
        />
        {/* Right vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 3,
            background: 'linear-gradient(to left, #060608 0%, rgba(6,6,8,0.5) 18%, transparent 45%)',
          }}
        />
        {/* Top/Bottom vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 3,
            background: 'linear-gradient(to bottom, #060608 0%, transparent 18%, transparent 78%, #060608 100%)',
          }}
        />

        {/* Scan line */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: '50%',
            height: '1px',
            background: 'rgba(255,255,255,0.035)',
            zIndex: 4,
          }}
        />

        {/* Text layer */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          {/* Index */}
          <div
            ref={setTextRef('index')}
            className="absolute"
            style={{
              top: '32px',
              left: '40px',
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: '12px',
              letterSpacing: '3px',
              color: 'rgba(255,255,255,0.35)',
              opacity: 0,
            }}
          />

          {/* Role */}
          <div
            ref={setTextRef('role')}
            className="absolute"
            style={{
              top: '56px',
              left: '40px',
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: '11px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              opacity: 0,
            }}
          />

          {/* Name */}
          <div
            ref={setTextRef('name')}
            className="absolute"
            style={{
              top: '80px',
              left: '40px',
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: '52px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.1,
              textShadow: '0 0 40px rgba(255,255,255,0.1)',
              opacity: 0,
            }}
          />

          {/* Surname */}
          <div
            ref={setTextRef('surname')}
            className="absolute"
            style={{
              top: '140px',
              left: '42px',
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: '22px',
              fontWeight: 400,
              letterSpacing: '8px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              opacity: 0,
            }}
          />

          {/* Quote */}
          <div
            ref={setTextRef('quote')}
            className="absolute"
            style={{
              bottom: '80px',
              left: '40px',
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: '12px',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.4)',
              maxWidth: '320px',
              lineHeight: 1.6,
              opacity: 0,
            }}
          />

          {/* Stat 1 */}
          <div
            ref={setTextRef('stat1')}
            className="absolute"
            style={{
              right: '40px',
              top: '42%',
              fontFamily: "'EB Garamond', Georgia, serif",
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'right',
              opacity: 0,
            }}
          />

          {/* Stat 2 */}
          <div
            ref={setTextRef('stat2')}
            className="absolute"
            style={{
              right: '40px',
              top: '56%',
              fontFamily: "'EB Garamond', Georgia, serif",
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'right',
              opacity: 0,
            }}
          />

          {/* Detail */}
          <div
            ref={setTextRef('detail')}
            className="absolute"
            style={{
              bottom: '80px',
              right: '40px',
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              textAlign: 'right',
              lineHeight: 2,
              opacity: 0,
            }}
          />

          {/* Abilities */}
          <div
            ref={setTextRef('abilities')}
            className="absolute"
            style={{
              left: '40px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 2.2,
              opacity: 0,
            }}
          />
        </div>

        {/* Camera label */}
        <div
          ref={camLabelRef}
          className="absolute"
          style={{
            top: '32px',
            right: '40px',
            zIndex: 6,
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            letterSpacing: '3px',
            color: 'rgba(255,255,255,0.15)',
            textTransform: 'uppercase',
          }}
        />

        {/* Dot navigation */}
        <div
          className="absolute flex items-center"
          style={{
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            gap: '6px',
            zIndex: 10,
          }}
        >
          {Array.from({ length: totalDots }).map((_, i) => (
            <div
              key={i}
              ref={setDotRef(i)}
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

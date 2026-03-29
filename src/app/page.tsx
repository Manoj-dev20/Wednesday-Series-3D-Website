'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Preloader from '@/components/Preloader';
import GothicCursor from '@/components/GothicCursor';
import ChapterDots from '@/components/ChapterDots';
import ChapterScrollScene, { TextZone } from '@/components/ChapterScrollScene';
import CharacterIntro from '@/components/CharacterIntro';

// Frame path generator
const getFrame = (folder: string, index: number) =>
  `/3DSeries/${folder}/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

// Chapter configs
const CHAPTERS = [
  { folder: 'wednesday', totalFrames: 290, start: 1 },
  { folder: 'sword', totalFrames: 240, start: 1 },
  { folder: 'thing', totalFrames: 229, start: 1 },
] as const;

const TOTAL_FRAMES = 759;

// --- TEXT ZONES ---

const chapter1TextZones: TextZone[] = [
  {
    id: 'ch1-a',
    position: { bottom: '6%', left: '4%' },
    width: '38%',
    maxWidth: '400px',
    triggerStart: 0,
    triggerEnd: 40,
    mobilePosition: { width: '55%', left: '3%' },
    lines: [
      {
        text: 'WEDNESDAY',
        fontFamily: 'decorative',
        fontWeight: 700,
        fontSize: 'clamp(36px, 5.5vw, 72px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.9)',
      },
      {
        text: 'She sees what others fear to imagine.',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(14px, 2vw, 20px)',
        tracking: '0.2em',
        color: 'rgba(255,255,255,0.75)',
        italic: true,
        marginTop: '8px',
      },
    ],
  },
  {
    id: 'ch1-b',
    position: { bottom: '5%', left: '3%' },
    width: '35%',
    maxWidth: '360px',
    triggerStart: 85,
    triggerEnd: 130,
    mobilePosition: { width: '55%', left: '3%' },
    lines: [
      {
        text: 'NEVERMORE ACADEMY',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        tracking: '0.5em',
        color: 'rgba(255,255,255,0.6)',
      },
      {
        text: 'JERICHO, VERMONT',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(12px, 1.5vw, 15px)',
        tracking: '0.5em',
        color: 'rgba(255,255,255,0.45)',
        marginTop: '6px',
        hideOnMobile: true,
      },
    ],
  },
  {
    id: 'ch1-c',
    position: { top: '20%', right: '3%' },
    width: '30%',
    maxWidth: '340px',
    triggerStart: 155,
    triggerEnd: 200,
    mobilePosition: { width: '45%', right: '2%' },
    lines: [
      {
        text: 'CHAPTER I',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(12px, 1.5vw, 15px)',
        tracking: '0.6em',
        color: 'rgba(255,255,255,0.55)',
        marginBottom: '10px',
      },
      {
        text: 'Every weapon has a story.',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(14px, 2vw, 20px)',
        tracking: '0.2em',
        color: 'rgba(255,255,255,0.7)',
        italic: true,
      },
    ],
  },
];

const chapter2TextZones: TextZone[] = [
  {
    id: 'ch2-a',
    position: { top: '12%', left: '3%' },
    width: '32%',
    maxWidth: '340px',
    triggerStart: 0,
    triggerEnd: 35,
    mobilePosition: { width: '55%', left: '3%' },
    lines: [
      {
        text: 'CHAPTER II',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(12px, 1.5vw, 15px)',
        tracking: '0.6em',
        color: 'rgba(255,255,255,0.55)',
        marginBottom: '10px',
      },
      {
        text: 'Released into the storm.',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(14px, 2vw, 20px)',
        tracking: '0.2em',
        color: 'rgba(255,255,255,0.7)',
        italic: true,
      },
    ],
  },
  {
    id: 'ch2-b',
    position: { bottom: '32%', right: '3%' },
    width: '28%',
    maxWidth: '300px',
    triggerStart: 6,
    triggerEnd: 40,
    delay: 0.3,
    mobilePosition: { width: '45%', right: '2%' },
    lines: [
      {
        text: 'THE DESCENT',
        fontFamily: 'decorative',
        fontWeight: 700,
        fontSize: 'clamp(28px, 4vw, 52px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.85)',
      },
    ],
  },
  {
    id: 'ch2-c',
    position: { top: '5%', left: '3%' },
    width: '22%',
    maxWidth: '260px',
    triggerStart: 85,
    triggerEnd: 115,
    mobilePosition: { width: '55%', left: '3%' },
    lines: [
      {
        text: 'SPINNING',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.6)',
      },
      {
        text: 'FALLING',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.6)',
        marginTop: '4px',
      },
      {
        text: 'Gravity wins.',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(12px, 1.5vw, 15px)',
        tracking: '0.2em',
        color: 'rgba(255,255,255,0.5)',
        italic: true,
        marginTop: '8px',
        hideOnMobile: true,
      },
    ],
  },
  {
    id: 'ch2-d',
    position: { bottom: '5%', right: '3%' },
    width: '30%',
    maxWidth: '320px',
    triggerStart: 90,
    triggerEnd: 120,
    delay: 0.2,
    mobilePosition: { width: '45%', right: '2%' },
    lines: [
      {
        text: 'NO MERCY',
        fontFamily: 'decorative',
        fontWeight: 700,
        fontSize: 'clamp(26px, 3.8vw, 48px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.8)',
      },
    ],
  },
  {
    id: 'ch2-e',
    position: { top: '20%', left: '3%' },
    width: '35%',
    maxWidth: '380px',
    triggerStart: 200,
    triggerEnd: 'hold',
    mobilePosition: { width: '55%', left: '3%' },
    lines: [
      {
        text: 'THE BLADE',
        fontFamily: 'decorative',
        fontWeight: 700,
        fontSize: 'clamp(36px, 5.5vw, 72px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.9)',
      },
      {
        text: 'FALLS',
        fontFamily: 'decorative',
        fontWeight: 700,
        fontSize: 'clamp(36px, 5.5vw, 72px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.9)',
        marginTop: '4px',
      },
      {
        text: 'Into the dark where nothing waits.',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(13px, 1.8vw, 18px)',
        tracking: '0.15em',
        color: 'rgba(255,255,255,0.6)',
        italic: true,
        marginTop: '12px',
      },
    ],
  },
  {
    id: 'ch2-f',
    position: { bottom: '15%', right: '3%' },
    width: '25%',
    maxWidth: '280px',
    triggerStart: 210,
    triggerEnd: 'hold',
    enterDuration: 1.5,
    mobilePosition: { width: '42%', right: '2%' },
    lines: [
      {
        text: 'WEDNESDAY',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(12px, 1.5vw, 15px)',
        tracking: '0.5em',
        color: 'rgba(255,255,255,0.35)',
        hideOnMobile: true,
      },
      {
        text: 'SEASON II',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(12px, 1.5vw, 15px)',
        tracking: '0.5em',
        color: 'rgba(255,255,255,0.35)',
        marginTop: '4px',
        hideOnMobile: true,
      },
    ],
  },
];

const chapter3TextZones: TextZone[] = [
  {
    id: 'ch3-a',
    position: { top: '5%', left: '3%' },
    width: '28%',
    maxWidth: '320px',
    triggerStart: 75,
    triggerEnd: 110,
    mobilePosition: { width: '55%', left: '3%' },
    lines: [
      {
        text: 'CHAPTER III',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(12px, 1.5vw, 15px)',
        tracking: '0.6em',
        color: 'rgba(255,255,255,0.55)',
        marginBottom: '10px',
      },
      {
        text: "He crawls so she doesn't have to fall.",
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(13px, 1.8vw, 18px)',
        tracking: '0.15em',
        color: 'rgba(255,255,255,0.7)',
        italic: true,
      },
    ],
  },
  {
    id: 'ch3-b',
    position: { top: '5%', right: '3%' },
    width: '25%',
    maxWidth: '280px',
    triggerStart: 80,
    triggerEnd: 115,
    delay: 0.2,
    mobilePosition: { width: '45%', right: '2%' },
    lines: [
      {
        text: 'THING',
        fontFamily: 'decorative',
        fontWeight: 700,
        fontSize: 'clamp(42px, 6.5vw, 84px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.9)',
      },
    ],
  },
  {
    id: 'ch3-c',
    position: { top: '15%', right: '3%' },
    width: '40%',
    maxWidth: '400px',
    triggerStart: 85,
    triggerEnd: 115,
    mobilePosition: { width: '48%', right: '2%' },
    lines: [
      {
        text: 'LOYAL',
        fontFamily: 'decorative',
        fontWeight: 700,
        fontSize: 'clamp(40px, 6vw, 80px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.9)',
      },
      {
        text: 'BEYOND',
        fontFamily: 'decorative',
        fontWeight: 700,
        fontSize: 'clamp(40px, 6vw, 80px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.9)',
        marginTop: '4px',
      },
      {
        text: 'DEATH',
        fontFamily: 'decorative',
        fontWeight: 700,
        fontSize: 'clamp(40px, 6vw, 80px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.9)',
        marginTop: '4px',
      },
      {
        text: "Wednesday's most faithful ally.",
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(13px, 1.8vw, 18px)',
        tracking: '0.15em',
        color: 'rgba(255,255,255,0.6)',
        italic: true,
        marginTop: '14px',
      },
    ],
  },
  {
    id: 'ch3-d',
    position: { bottom: '5%', left: '3%' },
    width: '30%',
    maxWidth: '340px',
    triggerStart: 88,
    triggerEnd: 118,
    enterDuration: 1.5,
    mobilePosition: { width: '55%', left: '3%' },
    lines: [
      {
        text: 'THE ADDAMS FAMILY ASSOCIATE',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(11px, 1.4vw, 14px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.35)',
        hideOnMobile: true,
      },
    ],
  },
  {
    id: 'ch3-e',
    position: { top: '4%', left: '3%' },
    width: '28%',
    maxWidth: '310px',
    triggerStart: 170,
    triggerEnd: 'hold',
    mobilePosition: { width: '55%', left: '3%' },
    lines: [
      {
        text: 'CAUGHT.',
        fontFamily: 'decorative',
        fontWeight: 700,
        fontSize: 'clamp(36px, 5.5vw, 72px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.92)',
      },
      {
        text: 'He never misses.',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(13px, 1.8vw, 18px)',
        tracking: '0.15em',
        color: 'rgba(255,255,255,0.65)',
        italic: true,
        marginTop: '10px',
      },
    ],
  },
  {
    id: 'ch3-f',
    position: { top: '4%', right: '3%' },
    width: '30%',
    maxWidth: '330px',
    triggerStart: 175,
    triggerEnd: 'hold',
    delay: 0.3,
    mobilePosition: { width: '42%', right: '2%' },
    lines: [
      {
        text: 'WEDNESDAY',
        fontFamily: 'decorative',
        fontWeight: 700,
        fontSize: 'clamp(24px, 3.5vw, 42px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.9)',
      },
      {
        text: 'RETURNS',
        fontFamily: 'decorative',
        fontWeight: 700,
        fontSize: 'clamp(24px, 3.5vw, 42px)',
        tracking: '0.4em',
        color: 'rgba(255,255,255,0.9)',
        marginTop: '4px',
      },
      {
        text: 'Season II  ·  Now Streaming',
        fontFamily: 'cinzel',
        fontWeight: 400,
        fontSize: 'clamp(12px, 1.5vw, 15px)',
        tracking: '0.3em',
        color: 'rgba(255,255,255,0.55)',
        marginTop: '10px',
      },
    ],
  },
];

// ===== MAIN PAGE =====

export default function Home() {
  const [frames, setFrames] = useState<{
    wednesday: HTMLImageElement[];
    sword: HTMLImageElement[];
    thing: HTMLImageElement[];
  }>({ wednesday: [], sword: [], thing: [] });

  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const chapter1Ref = useRef<HTMLDivElement>(null);
  const chapter2Ref = useRef<HTMLDivElement>(null);
  const chapter3Ref = useRef<HTMLDivElement>(null);

  // Preload all frames
  useEffect(() => {
    let loaded = 0;
    const wednesdayFrames: HTMLImageElement[] = [];
    const swordFrames: HTMLImageElement[] = [];
    const thingFrames: HTMLImageElement[] = [];

    const onLoad = () => {
      loaded++;
      setProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
      if (loaded === TOTAL_FRAMES) {
        setFrames({
          wednesday: wednesdayFrames,
          sword: swordFrames,
          thing: thingFrames,
        });
        setTimeout(() => {
          setIsLoaded(true);
          setTimeout(() => setShowContent(true), 800);
        }, 300);
      }
    };

    // Load wednesday frames (1-290)
    for (let i = 1; i <= 290; i++) {
      const img = new Image();
      img.src = getFrame('wednesday', i);
      img.onload = onLoad;
      img.onerror = onLoad;
      wednesdayFrames.push(img);
    }

    // Load sword frames (1-240)
    for (let i = 1; i <= 240; i++) {
      const img = new Image();
      img.src = getFrame('sword', i);
      img.onload = onLoad;
      img.onerror = onLoad;
      swordFrames.push(img);
    }

    // Load thing frames (1-229)
    for (let i = 1; i <= 229; i++) {
      const img = new Image();
      img.src = getFrame('thing', i);
      img.onload = onLoad;
      img.onerror = onLoad;
      thingFrames.push(img);
    }
  }, []);

  return (
    <>
      <Preloader progress={progress} isLoaded={isLoaded} />
      <GothicCursor />

      {showContent && (
        <ChapterDots
          chapter1Ref={chapter1Ref}
          chapter2Ref={chapter2Ref}
          chapter3Ref={chapter3Ref}
        />
      )}

      <main
        className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* ========== HERO SECTION ========== */}
        <section
          className="h-screen flex flex-col items-center justify-center relative px-6"
          style={{ backgroundColor: '#080A12' }}
        >
          <motion.div
            className="text-center"
            initial="hidden"
            animate={showContent ? 'visible' : 'hidden'}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.3 },
              },
            }}
          >
            {/* Netflix label */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="mb-6 uppercase"
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontWeight: 400,
                fontSize: 'clamp(10px, 1.2vw, 11px)',
                letterSpacing: '0.6em',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              A NETFLIX ORIGINAL SERIES
            </motion.p>

            {/* WEDNESDAY title */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              style={{
                fontFamily: 'var(--font-cinzel-decorative)',
                fontWeight: 700,
                fontSize: 'clamp(48px, 8vw, 96px)',
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.9)',
                textShadow:
                  '0 0 60px rgba(255,255,255,0.18), 0 2px 12px rgba(0,0,0,1), 0 4px 24px rgba(0,0,0,0.95)',
              }}
            >
              WEDNESDAY
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="mt-4"
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontWeight: 400,
                fontStyle: 'italic',
                fontSize: 'clamp(14px, 2vw, 18px)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              The story begins in the dark.
            </motion.p>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p
              className="uppercase text-center"
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontWeight: 400,
                fontSize: '11px',
                letterSpacing: '0.4em',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              ↓ ENTER THE STORY
            </p>
          </motion.div>
        </section>

        {/* ========== CHAPTER 1 — WEDNESDAY ========== */}
        <div ref={chapter1Ref}>
          <ChapterScrollScene
            folder="wednesday"
            frames={frames.wednesday}
            totalFrames={290}
            bgColor="#080A12"
            textZones={chapter1TextZones}
            scrollHeightClass="h-[600vh]"
            mobileScrollHeightClass="h-[400vh]"
          />
        </div>

        {/* ========== BLACK TRANSITION 1 ========== */}
        <section className="h-[20vh] bg-black flex items-center justify-center px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-center"
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(14px, 2vw, 20px)',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textShadow: '0 0 60px rgba(255,255,255,0.18), 0 2px 12px rgba(0,0,0,1), 0 4px 24px rgba(0,0,0,0.95)',
            }}
          >
            And then — she let it go.
          </motion.p>
        </section>

        {/* ========== CHAPTER 2 — THE SWORD ========== */}
        <div ref={chapter2Ref}>
          <ChapterScrollScene
            folder="sword"
            frames={frames.sword}
            totalFrames={240}
            bgColor="#000000"
            textZones={chapter2TextZones}
            scrollHeightClass="h-[500vh]"
            mobileScrollHeightClass="h-[350vh]"
          />
        </div>

        {/* ========== BLACK TRANSITION 2 ========== */}
        <section className="h-[20vh] bg-black flex items-center justify-center px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-center"
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(14px, 2vw, 20px)',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textShadow: '0 0 60px rgba(255,255,255,0.18), 0 2px 12px rgba(0,0,0,1), 0 4px 24px rgba(0,0,0,0.95)',
            }}
          >
            Something was already waiting.
          </motion.p>
        </section>

        {/* ========== CHAPTER 3 — THING ========== */}
        <div ref={chapter3Ref}>
          <ChapterScrollScene
            folder="thing"
            frames={frames.thing}
            totalFrames={229}
            bgColor="#060C14"
            textZones={chapter3TextZones}
            scrollHeightClass="h-[500vh]"
            mobileScrollHeightClass="h-[350vh]"
          />
        </div>

        {/* ========== BLACK TRANSITION — INTO CHARACTER INTRO ========== */}
        <section className="h-[20vh] bg-black flex items-center justify-center px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-center"
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(14px, 2vw, 20px)',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textShadow: '0 0 60px rgba(255,255,255,0.18), 0 2px 12px rgba(0,0,0,1), 0 4px 24px rgba(0,0,0,0.95)',
            }}
          >
            Meet the ones who haunt the story.
          </motion.p>
        </section>

        {/* ========== CHARACTER INTRO ========== */}
        <CharacterIntro />

        {/* ========== FINAL CTA ========== */}
        <section
          className="min-h-screen flex flex-col items-center justify-center text-center px-6"
          style={{
            background: 'linear-gradient(to bottom, #0A0000, #1A0800)',
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="flex flex-col items-center"
          >
            {/* NOW STREAMING label */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="mb-6"
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontWeight: 400,
                fontSize: 'clamp(10px, 1.2vw, 11px)',
                letterSpacing: '0.8em',
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
              }}
            >
              NOW STREAMING
            </motion.p>

            {/* WEDNESDAY */}
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              style={{
                fontFamily: 'var(--font-cinzel-decorative)',
                fontWeight: 700,
                fontSize: 'clamp(48px, 8vw, 96px)',
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.92)',
                textShadow:
                  '0 0 60px rgba(255,255,255,0.18), 0 2px 12px rgba(0,0,0,1), 0 4px 24px rgba(0,0,0,0.95)',
              }}
            >
              WEDNESDAY
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="mt-3"
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontWeight: 400,
                fontStyle: 'italic',
                fontSize: 'clamp(14px, 2vw, 20px)',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              Season 2 is here.
            </motion.p>

            {/* CTA Button */}
            <motion.button
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="mt-10 uppercase pointer-events-auto max-w-[300px] w-full md:w-auto"
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontWeight: 600,
                fontSize: 'clamp(12px, 1.5vw, 15px)',
                letterSpacing: '0.3em',
                background: 'white',
                color: 'black',
                padding: '16px 48px',
                borderRadius: 0,
                border: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E50914';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'black';
              }}
              onClick={() =>
                window.open(
                  'https://www.netflix.com/title/81231974',
                  '_blank'
                )
              }
            >
              ▶ WATCH ON NETFLIX
            </motion.button>

            {/* Fine print */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="mt-4"
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontWeight: 400,
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              Free to watch with Netflix subscription.
            </motion.p>
          </motion.div>
        </section>
      </main>
    </>
  );
}

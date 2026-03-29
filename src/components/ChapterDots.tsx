'use client';

import { useEffect, useState } from 'react';

interface ChapterDotsProps {
  chapter1Ref: React.RefObject<HTMLDivElement>;
  chapter2Ref: React.RefObject<HTMLDivElement>;
  chapter3Ref: React.RefObject<HTMLDivElement>;
}

export default function ChapterDots({ chapter1Ref, chapter2Ref, chapter3Ref }: ChapterDotsProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;

      const refs = [chapter1Ref, chapter2Ref, chapter3Ref];
      for (let i = refs.length - 1; i >= 0; i--) {
        const el = refs[i].current;
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= windowH * 0.5) {
            setActiveChapter(i + 1);
            return;
          }
        }
      }
      setActiveChapter(0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapter1Ref, chapter2Ref, chapter3Ref]);

  if (!isDesktop) return null;

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {[1, 2, 3].map((ch) => (
        <div
          key={ch}
          className={`rounded-full transition-all duration-500 ${
            activeChapter === ch
              ? 'w-2 h-2 bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)]'
              : 'w-1.5 h-1.5 bg-white/20'
          }`}
        />
      ))}
    </div>
  );
}

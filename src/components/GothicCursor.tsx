'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function GothicCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const checkPointer = window.matchMedia('(pointer:fine)');
    setIsDesktop(checkPointer.matches);

    if (!checkPointer.matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 10);
      cursorY.set(e.clientY - 10);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  if (!isDesktop) return null;

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vertical bar of the cross */}
        <rect x="8.5" y="1" width="3" height="18" rx="0.5" fill="rgba(255,255,255,0.7)" />
        {/* Horizontal bar of the cross */}
        <rect x="3" y="7" width="14" height="3" rx="0.5" fill="rgba(255,255,255,0.7)" />
        {/* Center glow */}
        <circle cx="10" cy="8.5" r="2" fill="rgba(255,255,255,0.15)" />
      </svg>
    </motion.div>
  );
}

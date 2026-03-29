/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent, motion, AnimatePresence } from 'framer-motion';

export interface TextLine {
  text: string;
  fontFamily: 'decorative' | 'cinzel';
  fontWeight: 400 | 600 | 700;
  fontSize: string; // clamp(...)
  tracking: string; // letter-spacing
  color: string; // rgba or white/xx
  italic?: boolean;
  marginTop?: string;
  marginBottom?: string;
  hideOnMobile?: boolean;
}

export interface TextZone {
  id: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  width: string;
  maxWidth: string;
  triggerStart: number; // frameIndex
  triggerEnd: number | 'hold'; // frameIndex or 'hold' for till end
  lines: TextLine[];
  delay?: number; // seconds
  enterDuration?: number; // custom enter animation duration
  mobilePosition?: {
    width?: string;
    left?: string;
    right?: string;
  };
}

interface ChapterScrollSceneProps {
  folder: 'wednesday' | 'sword' | 'thing';
  frames: HTMLImageElement[];
  totalFrames: number;
  bgColor: string;
  textZones: TextZone[];
  scrollHeightClass: string;
  mobileScrollHeightClass: string;
}

export default function ChapterScrollScene({
  folder,
  frames,
  totalFrames,
  bgColor,
  textZones,
  scrollHeightClass,
  mobileScrollHeightClass,
}: ChapterScrollSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  // Canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Redraw current frame on resize
      if (frames.length > 0 && lastFrameRef.current >= 0) {
        drawFrame(lastFrameRef.current);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [frames]);

  const drawFrame = useCallback(
    (idx: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const clampedIdx = Math.min(Math.max(Math.floor(idx), 0), frames.length - 1);
      const img = frames[clampedIdx];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fill with bg color first
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image with object-cover logic (fill viewport, crop overflow)
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;

      let drawWidth, drawHeight, drawX, drawY;

      if (imgRatio > canvasRatio) {
        // image is wider than canvas — fit height, crop width
        drawHeight = canvas.height;
        drawWidth = img.naturalWidth * (canvas.height / img.naturalHeight);
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
      } else {
        // image is taller than canvas — fit width, crop height
        drawWidth = canvas.width;
        drawHeight = img.naturalHeight * (canvas.width / img.naturalWidth);
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    },
    [frames, bgColor]
  );

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const idx = Math.floor(latest);
    if (idx !== lastFrameRef.current) {
      lastFrameRef.current = idx;
      setCurrentFrame(idx);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        drawFrame(idx);
      });
    }
  });

  // Draw initial frame
  useEffect(() => {
    if (frames.length > 0) {
      drawFrame(0);
    }
  }, [frames, drawFrame]);

  const isZoneVisible = (zone: TextZone): boolean => {
    const end = zone.triggerEnd === 'hold' ? totalFrames : zone.triggerEnd;
    return currentFrame >= zone.triggerStart && currentFrame <= end;
  };

  const getFontFamily = (type: 'decorative' | 'cinzel') =>
    type === 'decorative' ? 'var(--font-cinzel-decorative)' : 'var(--font-cinzel)';

  return (
    <div
      ref={containerRef}
      className={`relative ${isMobile ? mobileScrollHeightClass : scrollHeightClass}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Sticky canvas */}
      <div className="sticky top-0 h-screen w-full">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Text zones overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {textZones.map((zone) => {
            const visible = isZoneVisible(zone);
            const mobilePos = isMobile && zone.mobilePosition ? zone.mobilePosition : {};

            return (
              <AnimatePresence key={zone.id}>
                {visible && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      enter: {
                        duration: zone.enterDuration || 0.9,
                        ease: 'easeOut',
                        delay: zone.delay || 0,
                      },
                      exit: { duration: 0.5 },
                      duration: zone.enterDuration || 0.9,
                      ease: 'easeOut',
                      delay: zone.delay || 0,
                    }}
                    className="absolute"
                    style={{
                      top: zone.position.top,
                      bottom: zone.position.bottom,
                      left: mobilePos.left || zone.position.left,
                      right: mobilePos.right || zone.position.right,
                      width: mobilePos.width || (isMobile ? undefined : zone.width),
                      maxWidth: zone.maxWidth,
                    }}
                  >
                    {zone.lines.map((line, lineIdx) => {
                      if (line.hideOnMobile && isMobile) return null;
                      return (
                        <div
                          key={lineIdx}
                          style={{
                            fontFamily: getFontFamily(line.fontFamily),
                            fontWeight: line.fontWeight,
                            fontSize: line.fontSize,
                            letterSpacing: line.tracking,
                            color: line.color,
                            fontStyle: line.italic ? 'italic' : 'normal',
                            marginTop: line.marginTop || '0',
                            marginBottom: line.marginBottom || '0',
                            textTransform: 'uppercase',
                            textShadow:
                              '0 0 60px rgba(255,255,255,0.18), 0 2px 12px rgba(0,0,0,1), 0 4px 24px rgba(0,0,0,0.95)',
                          }}
                        >
                          {line.text}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>
      </div>
    </div>
  );
}

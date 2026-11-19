import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface TiltSurfaceProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glowOpacity?: number;
}

/**
 * Subtle mouse-responsive 3D perspective tilt + cursor-following copper light sheen.
 * Automatically disables itself on touch devices (coarse pointer) and when prefers-reduced-motion is enabled.
 */
export const TiltSurface: React.FC<TiltSurfaceProps> = ({
  children,
  className = '',
  maxTilt = 4,
  glowOpacity = 0.14,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [canTilt, setCanTilt] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, hovered: false });

  useEffect(() => {
    if (typeof window === 'undefined' || shouldReduceMotion) {
      setCanTilt(false);
      return;
    }
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanTilt(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [shouldReduceMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * maxTilt * 2;
    const ry = (px - 0.5) * maxTilt * 2;
    setTilt({
      rx,
      ry,
      gx: px * 100,
      gy: py * 100,
      hovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, hovered: false });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        canTilt
          ? {
              perspective: '1200px',
            }
          : undefined
      }
      className={className}
    >
      <div
        style={
          canTilt
            ? {
                transform: `rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`,
                transition: tilt.hovered
                  ? 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)'
                  : 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d',
              }
            : undefined
        }
        className="relative h-full w-full"
      >
        {canTilt && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-300"
            style={{
              opacity: tilt.hovered ? 1 : 0,
              background: `radial-gradient(480px circle at ${tilt.gx}% ${tilt.gy}%, rgba(215, 134, 97, ${glowOpacity}), transparent 62%)`,
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
};

interface TextMaskRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const TextMaskReveal: React.FC<TextMaskRevealProps> = ({
  children,
  delay = 0,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.65,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

interface ParallaxFrameProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}

export const ParallaxFrame: React.FC<ParallaxFrameProps> = ({
  children,
  className = '',
  offset = 28,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={shouldReduceMotion ? undefined : { y }}
        className="w-full h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

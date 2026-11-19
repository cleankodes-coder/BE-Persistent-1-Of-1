import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight, MapPin } from 'lucide-react';
import { HERO_IMAGE } from '../data/services';
import { SafeImage } from './SafeImage';
import { TextMaskReveal } from './motion/MotionPrimitives';

interface HeroProps {
  onGetQuote: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetQuote, onExploreServices }) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.03, 1.1]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[92vh] lg:min-h-[96vh] flex items-end overflow-hidden border-b border-white/[0.09]"
    >
      {/* Full-bleed Photographic Composition with Controlled Parallax */}
      <motion.div
        style={shouldReduceMotion ? undefined : { y: bgY, scale: bgScale }}
        initial={shouldReduceMotion ? false : { scale: 1.07, opacity: 0.82 }}
        animate={{ scale: 1.03, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <SafeImage
          src={HERO_IMAGE}
          alt="Professional cleaner carefully polishing a honed marble kitchen island in a luxury London residence overlooking the skyline"
          loading="eager"
          className="w-full h-full object-cover object-center"
          containerClassName="w-full h-full"
        />
      </motion.div>

      {/* Atmospheric Depth Layering Scrims */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-r from-[#090A0B]/95 via-[#090A0B]/68 to-[#090A0B]/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-10 bg-gradient-to-t from-[#090A0B] via-[#090A0B]/25 to-[#090A0B]/45"
        aria-hidden="true"
      />

      {/* Editorial Foreground Composition */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-32 pb-14 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          {/* Left: Cinematic Headline & Actions */}
          <div className="lg:col-span-8">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-medium tracking-[0.2em] uppercase text-[#D78661] mb-6"
            >
              Be Persistent 1of1 LTD · The Art of a Cleaner Space
            </motion.p>

            <h1 className="font-display text-[clamp(2.85rem,6.2vw,5.75rem)] font-semibold leading-[1.01] tracking-[-0.03em] text-[#F4EFE8] mb-7">
              <TextMaskReveal delay={0.05}>
                <span>Beautiful Spaces.</span>
              </TextMaskReveal>
              <TextMaskReveal delay={0.14}>
                <span className="font-editorial italic font-medium text-[#F4EFE8] tracking-[-0.015em]">
                  Impeccably Clean.
                </span>
              </TextMaskReveal>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#D8D0C7] leading-relaxed max-w-xl mb-10"
            >
              Professional cleaning and property care across Croydon and Greater London —
              tailored residential, short-let, and commercial upkeep with straightforward direct
              communication.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                type="button"
                onClick={onGetQuote}
                className="group inline-flex items-center gap-3 px-7 py-4 text-sm font-medium text-[#F4EFE8] bg-[#B66343] hover:bg-[#D78661] rounded-md transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4EFE8]"
              >
                <span>Get a Personalised Quote</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={onExploreServices}
                className="inline-flex items-center gap-2.5 px-7 py-4 text-sm font-medium text-[#F4EFE8] bg-[#141414]/80 hover:bg-[#1D1C1A] border border-white/[0.14] hover:border-white/30 rounded-md backdrop-blur-md transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B66343]"
              >
                Explore Our Services
              </button>
            </motion.div>
          </div>

          {/* Right: Floating Architectural Coverage Card & Scroll Cue */}
          <div className="lg:col-span-4 flex flex-col lg:items-end justify-end gap-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full sm:max-w-xs bg-[#141414]/85 backdrop-blur-xl border border-white/[0.11] rounded-lg p-5 sm:p-6"
            >
              <div className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] uppercase text-[#D78661] mb-2">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Service Area</span>
              </div>
              <p className="font-display text-lg font-semibold text-[#F4EFE8] mb-2">
                Croydon &amp; Greater London
              </p>
              <p className="text-xs text-[#AFA7A0] leading-relaxed border-t border-white/[0.08] pt-3">
                Domestic · Deep Cleans · End of Tenancy · Airbnb &amp; Linen · Office · Light
                Maintenance
              </p>
            </motion.div>

            <button
              type="button"
              onClick={onExploreServices}
              className="hidden lg:inline-flex items-center gap-2.5 text-xs tracking-[0.14em] uppercase text-[#AFA7A0] hover:text-[#F4EFE8] transition-colors cursor-pointer group"
            >
              <span>Scroll to explore</span>
              <ArrowDown
                className="w-3.5 h-3.5 text-[#D78661] transition-transform duration-300 group-hover:translate-y-1"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

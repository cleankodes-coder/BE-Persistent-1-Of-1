import React from 'react';
import { motion } from 'motion/react';
import { DETAIL_CRAFT_IMAGE } from '../data/services';
import { ParallaxFrame } from './motion/MotionPrimitives';
import { SafeImage } from './SafeImage';

const CRAFT_PILLARS = [
  {
    code: '01',
    title: 'Surface-Appropriate Care',
    detail:
      'Honed stone, brassware, timber flooring, and lacquered joinery each require measured cleaning agents and soft microfibre handling.',
  },
  {
    code: '02',
    title: 'Methodical Room Sequencing',
    detail:
      'From high fixtures and extractor hoods down to skirting boards and floors, every visit follows a disciplined checklist.',
  },
  {
    code: '03',
    title: 'Quiet Handover Presentation',
    detail:
      'Linen alignment, clear worktops, dry chrome and copper fittings, and tidy room resets so spaces feel immediately composed.',
  },
];

export const CleaningCraftSection: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#141414] border-b border-white/[0.09]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Documentary Cleaning Detail Photograph */}
          <div className="lg:col-span-6">
            <ParallaxFrame
              offset={20}
              className="aspect-[4/3] rounded-xl border border-white/[0.09] bg-[#1D1C1A]"
            >
              <SafeImage
                src={DETAIL_CRAFT_IMAGE}
                alt="Close-up of careful detailing on brushed copper tapware and dark stone sink"
                fallbackTitle="Meticulous surface detailing"
                className="w-full h-[112%] -mt-[6%] object-cover"
                containerClassName="w-full h-full"
              />
            </ParallaxFrame>
          </div>

          {/* Right: Editorial Transformation Storytelling */}
          <div className="lg:col-span-6">
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#D78661] mb-4">
              Craft &amp; Method
            </p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.1rem)] font-semibold tracking-[-0.02em] leading-[1.1] text-[#F4EFE8] mb-6">
              The Difference Is in What You{' '}
              <span className="font-editorial italic font-medium text-[#D78661]">Notice</span>{' '}
              First.
            </h2>
            <p className="text-base text-[#AFA7A0] leading-relaxed mb-10 max-w-xl">
              Rather than rushing surface wipe-downs, our approach focuses on the fixtures,
              edges, and tactile finishes that define how a room feels when you step inside.
            </p>

            <div className="divide-y divide-white/[0.09] border-t border-b border-white/[0.09]">
              {CRAFT_PILLARS.map((pillar, idx) => (
                <motion.div
                  key={pillar.code}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className="py-5 grid grid-cols-12 gap-4 items-start"
                >
                  <span className="col-span-2 font-mono text-xs text-[#D78661] tabular-nums pt-0.5">
                    {pillar.code}
                  </span>
                  <div className="col-span-10">
                    <h3 className="font-display text-base font-semibold text-[#F4EFE8] mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[#AFA7A0] leading-relaxed">{pillar.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

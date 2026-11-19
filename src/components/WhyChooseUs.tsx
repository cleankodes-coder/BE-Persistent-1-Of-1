import React from 'react';
import { motion } from 'motion/react';
import { CalendarCheck, FileCheck2, MessageSquare, SlidersHorizontal, Sparkles } from 'lucide-react';
import { WHY_CHOOSE_IMAGE } from '../data/services';
import { ParallaxFrame, TextMaskReveal } from './motion/MotionPrimitives';
import { SafeImage } from './SafeImage';

const BENEFITS = [
  {
    icon: FileCheck2,
    title: 'Clear quotations',
    description:
      'Every request is reviewed against your actual property details so you receive a straightforward, transparent quote without vague guesswork.',
  },
  {
    icon: Sparkles,
    title: 'Personalised cleaning scope',
    description:
      'Focus areas adapt to your home, tenancy, short-let, or workspace — from oven degreasing to crisp linen turnovers.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Flexible service requests',
    description:
      'Book one-off resets, regular domestic or office schedules, or combine cleaning with practical light property maintenance.',
  },
  {
    icon: MessageSquare,
    title: 'Direct communication',
    description:
      'Speak directly with the team via WhatsApp or email with a clear reference number rather than passing through automated call centres.',
  },
  {
    icon: CalendarCheck,
    title: 'Reliable service coordination',
    description:
      'Clear arrival windows, key-collection notes, and confirmed access arrangements so every visit runs smoothly.',
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section
      id="why-choose-us"
      className="py-24 lg:py-32 bg-[#090A0B] border-b border-white/[0.09]"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Editorial Split: Oversized Statement Left + Full-Height Photo Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#D78661] mb-4">
                Why Choose Us
              </p>
              <h2 className="font-display text-[clamp(2.25rem,4.4vw,3.75rem)] font-semibold tracking-[-0.025em] leading-[1.06] text-[#F4EFE8] mb-6">
                <TextMaskReveal>
                  <span>Built on Consistency,</span>
                </TextMaskReveal>
                <TextMaskReveal delay={0.08}>
                  <span className="font-editorial italic font-medium text-[#D78661]">
                    Not Guesswork.
                  </span>
                </TextMaskReveal>
              </h2>
              <p className="text-base text-[#AFA7A0] leading-relaxed max-w-xl mb-10">
                Clients across Croydon and Greater London stay with us because expectations are
                agreed clearly upfront and every visit is handled with quiet care.
              </p>
            </div>

            {/* Refined Benefit Rows with Thin Dividers */}
            <div className="divide-y divide-white/[0.09] border-t border-b border-white/[0.09]">
              {BENEFITS.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="group py-5 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-5 items-start transition-colors hover:bg-[#141414]/60 px-2 -mx-2 rounded"
                  >
                    <div className="sm:col-span-5 flex items-center gap-3">
                      <Icon
                        className="w-4 h-4 text-[#B66343] group-hover:text-[#D78661] transition-colors shrink-0"
                        aria-hidden="true"
                      />
                      <h3 className="font-display text-sm sm:text-base font-semibold text-[#F4EFE8]">
                        {benefit.title}
                      </h3>
                    </div>
                    <p className="sm:col-span-7 text-xs sm:text-sm text-[#AFA7A0] leading-relaxed">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Full-Height Architectural Cleaning Photograph */}
          <div className="lg:col-span-5">
            <ParallaxFrame
              offset={22}
              className="h-full min-h-[420px] lg:min-h-[620px] rounded-xl border border-white/[0.09] bg-[#141414]"
            >
              <SafeImage
                src={WHY_CHOOSE_IMAGE}
                alt="Immaculate dark stone luxury bathroom vanity with brushed bronze tapware and rolled cotton towels"
                fallbackTitle="Consistent London property care"
                className="w-full h-[110%] -mt-[5%] object-cover"
                containerClassName="w-full h-full min-h-[420px]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#090A0B]/85 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-0 inset-x-0 p-7">
                <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#D78661] mb-1">
                  Croydon &amp; Greater London
                </p>
                <p className="text-sm text-[#F4EFE8]/90 max-w-xs">
                  Disciplined checklists, respectful care in your home, and direct team follow-up.
                </p>
              </div>
            </ParallaxFrame>
          </div>
        </div>
      </div>
    </section>
  );
};

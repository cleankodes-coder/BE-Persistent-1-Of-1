import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { TextMaskReveal } from './motion/MotionPrimitives';

const STAGES = [
  {
    number: '01',
    title: 'Select Your Service',
    description:
      'Choose domestic, deep cleaning, end of tenancy, Airbnb turnover, office cleaning, or light property maintenance.',
  },
  {
    number: '02',
    title: 'Tell Us About Your Space',
    description:
      'Share your postcode, room count, priority areas, and optional photos once — replacing fragmented messaging threads.',
  },
  {
    number: '03',
    title: 'Receive a Personalised Quote',
    description:
      'Our team reviews your property requirements and prepares a tailored quotation matched to your requested scope.',
  },
  {
    number: '04',
    title: 'Confirm Your Cleaning',
    description:
      'Agree on your scope, quotation, and arrival window directly with our team before any booking is finalised.',
  },
];

export const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 65%'],
  });

  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#090A0B] border-b border-white/[0.09]"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-20">
          <div className="lg:col-span-7">
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#D78661] mb-4">
              How It Works
            </p>
            <h2 className="font-display text-[clamp(2.15rem,4vw,3.4rem)] font-semibold tracking-[-0.025em] leading-[1.08] text-[#F4EFE8]">
              <TextMaskReveal>
                <span>Four Considered Steps</span>
              </TextMaskReveal>
              <TextMaskReveal delay={0.08}>
                <span className="font-editorial italic font-medium text-[#D78661]">
                  From Enquiry to Arrival.
                </span>
              </TextMaskReveal>
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#AFA7A0] leading-relaxed max-w-md lg:ml-auto">
              A structured process designed to gather everything required for an accurate quote on
              the first pass.
            </p>
          </div>
        </div>

        {/* Scroll-Linked Process Timeline */}
        <div className="relative">
          {/* Desktop Track + Animated Copper Line */}
          <div
            className="hidden lg:block relative h-[1px] w-full bg-white/[0.09] mb-12 overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              style={
                shouldReduceMotion
                  ? { scaleX: 1, transformOrigin: 'left' }
                  : { scaleX: lineScaleX, transformOrigin: 'left' }
              }
              className="absolute inset-0 bg-gradient-to-r from-[#B66343] via-[#D78661] to-[#B66343]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {STAGES.map((stage, index) => (
              <motion.div
                key={stage.number}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex flex-col"
              >
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[#F4EFE8]/90 tabular-nums">
                    {stage.number}
                  </span>
                  <span className="font-mono text-xs text-[#D78661]">/</span>
                </div>

                <h3 className="font-display text-lg font-semibold text-[#F4EFE8] mb-3">
                  {stage.title}
                </h3>
                <p className="text-sm text-[#AFA7A0] leading-relaxed">{stage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

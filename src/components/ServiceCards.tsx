import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../data/services';
import { ServiceId } from '../types/cleaning';
import { SafeImage } from './SafeImage';
import { TextMaskReveal, TiltSurface } from './motion/MotionPrimitives';

interface ServiceCardsProps {
  onSelectService: (serviceId: ServiceId) => void;
}

export const ServiceCards: React.FC<ServiceCardsProps> = ({ onSelectService }) => {
  const [domestic, deep, tenancy, airbnb, office, maintenance] = SERVICES;

  return (
    <section
      id="services"
      className="py-24 lg:py-32 bg-[#090A0B] border-b border-white/[0.09]"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#D78661] mb-4">
              Curated Services
            </p>
            <h2 className="font-display text-[clamp(2.15rem,4.2vw,3.6rem)] font-semibold tracking-[-0.025em] leading-[1.06] text-[#F4EFE8]">
              <TextMaskReveal>
                <span>Consider Every Detail,</span>
              </TextMaskReveal>
              <TextMaskReveal delay={0.08}>
                <span className="font-editorial italic font-medium text-[#D78661]">
                  Taken Care Of.
                </span>
              </TextMaskReveal>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pb-1">
            <p className="text-sm sm:text-base text-[#AFA7A0] leading-relaxed max-w-md lg:ml-auto">
              Six dedicated disciplines designed around real homes, tenancies, short-let
              turnovers, and commercial studios across Croydon and Greater London.
            </p>
          </div>
        </div>

        {/* Asymmetric Editorial Gallery */}
        <div className="space-y-6">
          {/* Row 1: 7-col Wide Feature + 5-col Tall Editorial Card (with 3D Tilt on Desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 01 Domestic Cleaning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <TiltSurface className="h-full rounded-xl" maxTilt={3.5}>
                <article className="group relative h-full min-h-[420px] lg:min-h-[480px] rounded-xl overflow-hidden bg-[#141414] border border-white/[0.09] hover:border-[#B66343]/55 transition-colors duration-300 flex flex-col justify-end">
                  <div className="absolute inset-0">
                    <SafeImage
                      src={domestic.image}
                      alt={domestic.imageAlt}
                      fallbackTitle={domestic.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      containerClassName="w-full h-full"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#090A0B] via-[#090A0B]/60 to-transparent"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="relative z-10 p-7 sm:p-9">
                    <div className="flex items-baseline justify-between gap-4 mb-3">
                      <span className="font-mono text-xs tracking-widest text-[#D78661] tabular-nums">
                        01 / RESIDENTIAL
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#F4EFE8] mb-3">
                      {domestic.name}
                    </h3>
                    <p className="text-sm sm:text-base text-[#D8D0C7] max-w-xl leading-relaxed mb-5">
                      {domestic.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/[0.12]">
                      <span className="text-xs text-[#AFA7A0]">
                        {domestic.highlights[0]} · {domestic.highlights[1]}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectService(domestic.id)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#B66343] hover:bg-[#D78661] text-xs font-medium text-[#F4EFE8] transition-colors cursor-pointer shrink-0"
                      >
                        <span>Request Quote</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              </TiltSurface>
            </motion.div>

            {/* 02 Deep Cleaning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <TiltSurface className="h-full rounded-xl" maxTilt={4}>
                <article className="group relative h-full min-h-[420px] lg:min-h-[480px] rounded-xl overflow-hidden bg-[#141414] border border-white/[0.09] hover:border-[#B66343]/55 transition-colors duration-300 flex flex-col justify-end">
                  <div className="absolute inset-0">
                    <SafeImage
                      src={deep.image}
                      alt={deep.imageAlt}
                      fallbackTitle={deep.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      containerClassName="w-full h-full"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#090A0B] via-[#090A0B]/65 to-[#090A0B]/15"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="relative z-10 p-7 sm:p-8">
                    <span className="block font-mono text-xs tracking-widest text-[#D78661] tabular-nums mb-3">
                      02 / INTENSIVE DETAIL
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-[#F4EFE8] mb-2.5">
                      {deep.name}
                    </h3>
                    <p className="text-sm text-[#D8D0C7] leading-relaxed mb-5">
                      {deep.description}
                    </p>
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/[0.12]">
                      <span className="text-xs text-[#AFA7A0] truncate">
                        {deep.highlights[0]}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectService(deep.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1D1C1A] hover:bg-[#B66343] border border-white/[0.12] hover:border-[#B66343] text-xs font-medium text-[#F4EFE8] transition-colors cursor-pointer shrink-0"
                      >
                        <span>Request Quote</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              </TiltSurface>
            </motion.div>
          </div>

          {/* Row 2: Three Editorial Portrait/4:3 Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[tenancy, airbnb, office].map((service, idx) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex flex-col rounded-xl overflow-hidden bg-[#141414] border border-white/[0.09] hover:border-[#B66343]/50 transition-colors duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#1D1C1A]">
                  <SafeImage
                    src={service.image}
                    alt={service.imageAlt}
                    fallbackTitle={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    containerClassName="w-full h-full"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80"
                    aria-hidden="true"
                  />
                  <span className="absolute top-4 left-4 font-mono text-xs text-[#F4EFE8]/90 bg-[#090A0B]/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 tabular-nums">
                    {String(idx + 3).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex-1 flex flex-col p-6 sm:p-7">
                  <h3 className="font-display text-xl font-semibold text-[#F4EFE8] mb-2.5">
                    {service.name}
                  </h3>
                  <p className="text-sm text-[#AFA7A0] leading-relaxed mb-5 flex-1">
                    {service.description}
                  </p>

                  <ul className="space-y-2 text-xs text-[#D8D0C7] border-t border-white/[0.08] pt-4 mb-6">
                    {service.highlights.slice(0, 2).map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="text-[#D78661] mt-0.5" aria-hidden="true">
                          —
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => onSelectService(service.id)}
                    className="w-full inline-flex items-center justify-between px-4 py-3 rounded-md bg-[#1D1C1A] hover:bg-[#B66343] border border-white/[0.09] hover:border-[#B66343] text-xs font-medium text-[#F4EFE8] transition-colors duration-200 cursor-pointer"
                  >
                    <span>Request Quote</span>
                    <ArrowUpRight className="w-4 h-4 text-[#D78661] group-hover:text-[#F4EFE8]" aria-hidden="true" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Row 3: Full-width Horizontal Architectural Feature (06 Light Property Maintenance) */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="group grid grid-cols-1 lg:grid-cols-12 rounded-xl overflow-hidden bg-[#141414] border border-white/[0.09] hover:border-[#B66343]/50 transition-colors duration-300"
          >
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[320px] overflow-hidden bg-[#1D1C1A]">
              <SafeImage
                src={maintenance.image}
                alt={maintenance.imageAlt}
                fallbackTitle={maintenance.name}
                className="w-full h-full object-cover lg:absolute lg:inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                containerClassName="w-full h-full"
              />
            </div>

            <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="font-mono text-xs tracking-widest text-[#D78661] tabular-nums">
                    06 / PRACTICAL PROPERTY CARE
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#F4EFE8] mb-3">
                  {maintenance.name}
                </h3>
                <p className="text-sm sm:text-base text-[#AFA7A0] leading-relaxed max-w-2xl mb-6">
                  {maintenance.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/[0.09] pt-5">
                  {maintenance.highlights.map((item) => (
                    <p key={item} className="text-xs text-[#D8D0C7] leading-relaxed">
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onSelectService(maintenance.id)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#1D1C1A] hover:bg-[#B66343] border border-white/[0.12] hover:border-[#B66343] text-xs sm:text-sm font-medium text-[#F4EFE8] transition-colors cursor-pointer"
                >
                  <span>Request Quote</span>
                  <ArrowUpRight className="w-4 h-4 text-[#D78661] group-hover:text-[#F4EFE8]" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
};

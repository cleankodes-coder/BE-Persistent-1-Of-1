import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO, CTA_BACKDROP_IMAGE } from '../data/services';
import { buildWhatsAppLink } from '../utils/enquiryStorage';
import { ParallaxFrame, TextMaskReveal } from './motion/MotionPrimitives';
import { SafeImage } from './SafeImage';

interface FinalCTAProps {
  onGetQuote: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onGetQuote }) => {
  const whatsappUrl = buildWhatsAppLink(
    `Hello ${BUSINESS_INFO.name}, I'd like to discuss a cleaning quotation.`
  );

  return (
    <section className="relative py-28 lg:py-40 overflow-hidden border-b border-white/[0.09]">
      <ParallaxFrame offset={26} className="absolute inset-0 z-0">
        <SafeImage
          src={CTA_BACKDROP_IMAGE}
          alt="Moody luxury London dining and kitchen space with warm pendant lighting"
          className="w-full h-[116%] -mt-[8%] object-cover"
          containerClassName="w-full h-full"
        />
      </ParallaxFrame>

      <div
        className="absolute inset-0 z-10 bg-gradient-to-t from-[#090A0B] via-[#090A0B]/78 to-[#090A0B]/60"
        aria-hidden="true"
      />

      <div className="relative z-20 max-w-[1100px] mx-auto px-5 sm:px-8 text-center">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#D78661] mb-5">
          Be Persistent 1of1 LTD · Croydon &amp; Greater London
        </p>

        <h2 className="font-display text-[clamp(2.5rem,5.4vw,4.75rem)] font-semibold tracking-[-0.03em] leading-[1.04] text-[#F4EFE8] mb-6">
          <TextMaskReveal>
            <span>
              Your Space Deserves{' '}
              <span className="font-editorial italic font-medium text-[#D78661]">Better.</span>
            </span>
          </TextMaskReveal>
        </h2>

        <p className="text-base sm:text-lg text-[#D8D0C7] max-w-xl mx-auto leading-relaxed mb-10">
          Share your property details through our guided quote studio or message our team directly
          on WhatsApp.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onGetQuote}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-md bg-[#B66343] hover:bg-[#D78661] text-sm font-medium text-[#F4EFE8] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Get My Personalised Quote</span>
            <ArrowRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-md bg-[#141414]/85 hover:bg-[#1D1C1A] border border-white/[0.14] hover:border-[#D78661] backdrop-blur-md text-sm font-medium text-[#F4EFE8] transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 text-[#D78661]" aria-hidden="true" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};

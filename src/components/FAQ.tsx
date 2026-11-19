import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import { TextMaskReveal } from './motion/MotionPrimitives';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Which areas do you cover?',
    answer:
      'We serve properties across Croydon and Greater London. Because availability varies by service type and schedule, simply enter your postcode in the quote request form and our team will confirm coverage for your property.',
  },
  {
    question: 'Which cleaning services are available?',
    answer:
      'We provide Domestic Cleaning, Deep Cleaning, End of Tenancy Cleaning, Airbnb Cleaning & Linen Change, Office Cleaning, and Light Property Maintenance.',
  },
  {
    question: 'How can I request a quote?',
    answer:
      'Use the guided quote studio on this page to select your service, share your postcode and property layout, choose a preferred date, and add optional notes or photos. You can also send your prepared enquiry directly to our WhatsApp number (+44 7376 739271) or email quotes@bepersistent1of1.co.uk.',
  },
  {
    question: 'Can I request regular cleaning?',
    answer:
      'Yes. For Domestic Cleaning, Office Cleaning, and Airbnb turnovers, you can indicate whether you need a one-off visit, weekly support, fortnightly upkeep, monthly cleaning, or ongoing per-turnover assistance.',
  },
  {
    question: 'Do you handle Airbnb turnovers?',
    answer:
      'Yes. Our Airbnb Cleaning & Linen Change service is structured around short-let checkouts and guest arrivals, including surface resets, bathroom sanitisation, bed-making, and linen change requests.',
  },
  {
    question: 'Can I provide photos of the property?',
    answer:
      'Yes, providing photos helps us prepare a more accurate quotation. In this website demonstration, photos can be previewed locally in Step 3 of the form; when continuing via WhatsApp, you can attach your selected photos manually inside the WhatsApp chat.',
  },
  {
    question: 'How are cleaning appointments confirmed?',
    answer:
      'All requests are reviewed by our team before a tailored quotation is issued. Appointments are only confirmed once you and our team agree on the scope, quotation, and available date window.',
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-24 lg:py-32 bg-[#090A0B] border-b border-white/[0.09]"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Editorial Heading */}
          <div className="lg:col-span-4">
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#D78661] mb-4">
              Questions
            </p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.1rem)] font-semibold tracking-[-0.025em] leading-[1.08] text-[#F4EFE8] mb-4">
              <TextMaskReveal>
                <span>Clear Answers</span>
              </TextMaskReveal>
              <TextMaskReveal delay={0.08}>
                <span className="font-editorial italic font-medium text-[#D78661]">
                  Upfront.
                </span>
              </TextMaskReveal>
            </h2>
            <p className="text-sm sm:text-base text-[#AFA7A0] leading-relaxed max-w-sm">
              Everything you need to know about coverage, quotations, and scheduling across
              Croydon and Greater London.
            </p>
          </div>

          {/* Right Minimal Accordion */}
          <div className="lg:col-span-8 divide-y divide-white/[0.09] border-t border-b border-white/[0.09]">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.question}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${idx}`}
                      id={`faq-trigger-${idx}`}
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full py-6 sm:py-7 flex items-center justify-between gap-6 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B66343] rounded-sm"
                    >
                      <span className="font-display text-lg sm:text-xl font-medium text-[#F4EFE8] group-hover:text-[#D78661] transition-colors">
                        {item.question}
                      </span>
                      <span className="w-8 h-8 rounded-md border border-white/[0.11] flex items-center justify-center shrink-0 text-[#AFA7A0] group-hover:border-[#D78661]/50 group-hover:text-[#D78661] transition-colors">
                        {isOpen ? (
                          <Minus className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Plus className="w-4 h-4" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${idx}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${idx}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 text-sm sm:text-base text-[#AFA7A0] leading-relaxed max-w-2xl">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

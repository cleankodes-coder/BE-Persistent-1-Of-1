import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { isValidUkPostcode, normalizePostcode } from '../utils/enquiryStorage';
import { TextMaskReveal } from './motion/MotionPrimitives';

interface ServiceAreasProps {
  onEnquireWithPostcode: (postcode: string) => void;
}

const HIGHLIGHTED_AREAS = [
  'Croydon & East Croydon',
  'South Croydon & Purley',
  'Crystal Palace & Norwood',
  'Streatham & Balham',
  'Bromley Borders',
  'Central & Greater London',
];

export const ServiceAreas: React.FC<ServiceAreasProps> = ({ onEnquireWithPostcode }) => {
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState('');
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) {
      setError('Please enter a UK postcode to begin your enquiry.');
      return;
    }
    if (!isValidUkPostcode(postcode)) {
      setError('Please enter a valid UK postcode format (for example, CR0 1AA or SW16 2HP).');
      return;
    }
    setError('');
    onEnquireWithPostcode(normalizePostcode(postcode));
  };

  return (
    <section
      id="service-areas"
      className="py-24 lg:py-32 bg-[#141414] border-b border-white/[0.09]"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Copy & Postcode Enquiry */}
          <div className="lg:col-span-6">
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#D78661] mb-4">
              Coverage &amp; Dispatch
            </p>
            <h2 className="font-display text-[clamp(2.15rem,4vw,3.35rem)] font-semibold tracking-[-0.025em] leading-[1.08] text-[#F4EFE8] mb-5">
              <TextMaskReveal>
                <span>Croydon &amp;</span>
              </TextMaskReveal>
              <TextMaskReveal delay={0.08}>
                <span className="font-editorial italic font-medium text-[#D78661]">
                  Greater London.
                </span>
              </TextMaskReveal>
            </h2>
            <p className="text-base text-[#AFA7A0] leading-relaxed mb-8 max-w-xl">
              Based around Croydon and attending residential, short-let, and commercial properties
              across Greater London. Enter your postcode to prefill your quote enquiry and confirm
              availability for your requested window.
            </p>

            {/* Area List */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 py-6 border-t border-b border-white/[0.09] mb-8">
              {HIGHLIGHTED_AREAS.map((area) => (
                <div key={area} className="flex items-center gap-2.5 text-sm text-[#D8D0C7]">
                  <MapPin className="w-3.5 h-3.5 text-[#D78661] shrink-0" aria-hidden="true" />
                  <span>{area}</span>
                </div>
              ))}
            </div>

            {/* Interactive Postcode Enquiry Bar */}
            <form onSubmit={handleSubmit} noValidate className="max-w-md">
              <label
                htmlFor="area-postcode-input"
                className="block text-xs font-medium text-[#D8D0C7] mb-2"
              >
                Enquire by Postcode
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="area-postcode-input"
                  type="text"
                  value={postcode}
                  onChange={(e) => {
                    setPostcode(e.target.value.toUpperCase());
                    if (error) setError('');
                  }}
                  placeholder="Enter postcode (e.g. CR0 1AA)"
                  className="flex-1 px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 font-mono uppercase focus:outline-none focus:border-[#D78661]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[#B66343] hover:bg-[#D78661] text-sm font-medium text-[#F4EFE8] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Start Quote
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              {error && (
                <p className="mt-2 text-xs text-[#D78661]" role="alert">
                  {error}
                </p>
              )}
              <p className="mt-2.5 text-xs text-[#AFA7A0]">
                Coverage depends on service scope and schedule — submitting a postcode opens the
                guided quote studio.
              </p>
            </form>
          </div>

          {/* Right Editorial Geographic Graphic */}
          <div className="lg:col-span-6">
            <div className="relative rounded-xl bg-[#090A0B] border border-white/[0.09] p-6 sm:p-8 overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <span className="block text-[11px] uppercase tracking-[0.16em] text-[#D78661]">
                    Regional Coverage Schematic
                  </span>
                  <span className="font-display text-lg font-semibold text-[#F4EFE8]">
                    Croydon &amp; Greater London
                  </span>
                </div>
                <span className="font-mono text-xs text-[#AFA7A0]">CR · SE · SW · EC</span>
              </div>

              <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-[#141414]/60 rounded-lg border border-white/[0.07] overflow-hidden">
                <svg
                  viewBox="0 0 480 360"
                  className="w-full h-full"
                  role="img"
                  aria-label="Schematic representation of Croydon and Greater London service areas"
                >
                  <defs>
                    <radialGradient id="copperAmbient" cx="50%" cy="62%" r="52%">
                      <stop offset="0%" stopColor="#B66343" stopOpacity="0.24" />
                      <stop offset="60%" stopColor="#B66343" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="#090A0B" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <g stroke="#FFFFFF" strokeOpacity="0.035" strokeWidth="1">
                    <line x1="0" y1="90" x2="480" y2="90" />
                    <line x1="0" y1="180" x2="480" y2="180" />
                    <line x1="0" y1="270" x2="480" y2="270" />
                    <line x1="120" y1="0" x2="120" y2="360" />
                    <line x1="240" y1="0" x2="240" y2="360" />
                    <line x1="360" y1="0" x2="360" y2="360" />
                  </g>

                  {/* Stylised Thames Curve */}
                  <path
                    d="M 10 135 Q 115 110 190 132 T 345 120 T 470 138"
                    fill="none"
                    stroke="#AFA7A0"
                    strokeOpacity="0.25"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  <rect width="480" height="360" fill="url(#copperAmbient)" />

                  {/* Animated Concentric Geometric Sweep */}
                  {!shouldReduceMotion && (
                    <motion.circle
                      cx="240"
                      cy="225"
                      r="55"
                      fill="none"
                      stroke="#D78661"
                      strokeWidth="1"
                      initial={{ r: 42, opacity: 0.55 }}
                      animate={{ r: 150, opacity: 0 }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}

                  <circle
                    cx="240"
                    cy="225"
                    r="145"
                    fill="none"
                    stroke="#B66343"
                    strokeOpacity="0.24"
                    strokeWidth="1"
                    strokeDasharray="5 5"
                  />
                  <circle
                    cx="240"
                    cy="225"
                    r="92"
                    fill="none"
                    stroke="#B66343"
                    strokeOpacity="0.42"
                    strokeWidth="1"
                  />
                  <circle
                    cx="240"
                    cy="225"
                    r="42"
                    fill="#B66343"
                    fillOpacity="0.14"
                    stroke="#D78661"
                    strokeOpacity="0.7"
                    strokeWidth="1.2"
                  />

                  <g transform="translate(240, 118)">
                    <circle cx="0" cy="0" r="3.5" fill="#F4EFE8" />
                    <text
                      x="12"
                      y="4"
                      fill="#F4EFE8"
                      fontSize="12"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                      fontWeight="600"
                    >
                      Greater London
                    </text>
                  </g>

                  <g transform="translate(178, 175)">
                    <circle cx="0" cy="0" r="2.5" fill="#AFA7A0" />
                    <text
                      x="-96"
                      y="4"
                      fill="#AFA7A0"
                      fontSize="11"
                      fontFamily="Manrope, sans-serif"
                    >
                      South London
                    </text>
                  </g>

                  <g transform="translate(328, 212)">
                    <circle cx="0" cy="0" r="2.5" fill="#AFA7A0" />
                    <text
                      x="10"
                      y="4"
                      fill="#AFA7A0"
                      fontSize="11"
                      fontFamily="Manrope, sans-serif"
                    >
                      South East
                    </text>
                  </g>

                  <g transform="translate(240, 225)">
                    <circle cx="0" cy="0" r="5" fill="#D78661" />
                    <text
                      x="12"
                      y="5"
                      fill="#F4EFE8"
                      fontSize="13"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                      fontWeight="600"
                    >
                      Croydon (CR)
                    </text>
                  </g>
                </svg>
              </div>

              <p className="mt-4 text-xs text-[#AFA7A0]">
                Illustrative coverage overview only — exact attendance is confirmed upon reviewing
                your postcode and schedule.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

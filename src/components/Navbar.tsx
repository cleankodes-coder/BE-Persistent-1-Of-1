import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Menu, MessageCircle, X } from 'lucide-react';
import { BUSINESS_INFO } from '../data/services';
import { buildWhatsAppLink } from '../utils/enquiryStorage';

interface NavbarProps {
  onRequestQuote: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Why Choose Us', href: '#why-choose-us' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
];

export const Navbar: React.FC<NavbarProps> = ({ onRequestQuote }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappHref = buildWhatsAppLink(
    `Hello ${BUSINESS_INFO.name}, I'd like to enquire about a cleaning service.`
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-[#090A0B]/88 backdrop-blur-xl border-b border-white/[0.09]'
          : 'bg-gradient-to-b from-[#090A0B]/70 to-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 h-[72px] flex items-center justify-between gap-8">
        {/* Zone 1: Compact Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="font-display text-base sm:text-[17px] font-semibold tracking-[-0.02em] text-[#F4EFE8] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B66343] rounded-sm"
        >
          Be Persistent <span className="text-[#D78661]">1of1</span>
        </a>

        {/* Zone 2: Single-line Architectural Nav */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-[0.01em] text-[#AFA7A0]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="relative py-1.5 hover:text-[#F4EFE8] transition-colors duration-200 whitespace-nowrap shrink-0 after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#D78661] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B66343] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Copper Primary CTA + WhatsApp Utility */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp with Be Persistent 1of1 LTD"
            title="Chat on WhatsApp"
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/[0.12] bg-[#090A0B]/40 text-[#F4EFE8] hover:border-[#D78661] hover:text-[#D78661] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B66343]"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onRequestQuote();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-[13px] font-medium text-[#F4EFE8] bg-[#B66343] hover:bg-[#D78661] rounded-md transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4EFE8]"
          >
            <span>Get a Free Quote</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/[0.12] bg-[#141414]/80 text-[#F4EFE8] hover:border-white/30 transition-colors cursor-pointer"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Menu className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Polished Mobile Navigation Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-[#090A0B]/98 backdrop-blur-2xl border-b border-white/[0.09] px-5 py-6"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col divide-y divide-white/[0.07]">
              {NAV_LINKS.map((link, idx) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="py-4 flex items-center justify-between text-lg font-display font-medium text-[#F4EFE8] hover:text-[#D78661] transition-colors"
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs text-[#AFA7A0]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </a>
              ))}
            </nav>

            <div className="pt-5 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-md border border-white/[0.12] bg-[#141414] text-sm font-medium text-[#F4EFE8] hover:border-[#D78661] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#D78661]" aria-hidden="true" />
                Chat on WhatsApp
                <ArrowUpRight className="w-3.5 h-3.5 text-[#AFA7A0]" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

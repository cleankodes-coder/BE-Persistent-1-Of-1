import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BUSINESS_INFO, SERVICES } from '../data/services';

interface FooterProps {
  onNavigateToDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToDashboard }) => {
  return (
    <footer className="bg-[#090A0B] text-[#AFA7A0]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-20 pb-12">
        {/* Oversized Editorial Wordmark */}
        <div className="pb-14 border-b border-white/[0.09] mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#D78661] mb-3">
              Professional Cleaning &amp; Light Property Maintenance
            </p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] font-semibold tracking-[-0.03em] leading-none text-[#F4EFE8]">
              Be Persistent <span className="text-[#D78661]">1of1</span> LTD
            </h2>
          </div>

          <a
            href={BUSINESS_INFO.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#F4EFE8] hover:text-[#D78661] transition-colors w-fit"
          >
            <span>www.bepersistent1of1.co.uk</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Navigation & Contact Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-white/[0.09]">
          <div className="lg:col-span-4">
            <h3 className="text-xs font-medium tracking-[0.14em] uppercase text-[#F4EFE8] mb-4">
              Coverage
            </h3>
            <p className="text-sm leading-relaxed max-w-sm">
              Serving residential homes, landlords, short-let hosts, and commercial spaces across
              Croydon and Greater London with straightforward direct communication.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-medium tracking-[0.14em] uppercase text-[#F4EFE8] mb-4">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <a href="#services" className="hover:text-[#F4EFE8] transition-colors">
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-medium tracking-[0.14em] uppercase text-[#F4EFE8] mb-4">
              Service Areas
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>Croydon</li>
              <li>South London</li>
              <li>Greater London</li>
              <li>
                <a
                  href="#service-areas"
                  className="text-[#D78661] hover:text-[#F4EFE8] transition-colors"
                >
                  Enquire by Postcode
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-medium tracking-[0.14em] uppercase text-[#F4EFE8] mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="block text-xs text-[#AFA7A0]/70">Phone &amp; WhatsApp</span>
                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F4EFE8] hover:text-[#D78661] transition-colors font-mono"
                >
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </li>
              <li>
                <span className="block text-xs text-[#AFA7A0]/70">Quotation Email</span>
                <a
                  href={`mailto:${BUSINESS_INFO.quoteEmail}`}
                  className="text-[#F4EFE8] hover:text-[#D78661] transition-colors break-all"
                >
                  {BUSINESS_INFO.quoteEmail}
                </a>
              </li>
              <li>
                <span className="block text-xs text-[#AFA7A0]/70">General Enquiries</span>
                <a
                  href={`mailto:${BUSINESS_INFO.generalEmail}`}
                  className="hover:text-[#F4EFE8] transition-colors break-all"
                >
                  {BUSINESS_INFO.generalEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line + Discreet Staff Dashboard Demo Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© {new Date().getFullYear()} {BUSINESS_INFO.name}</span>
            <span aria-hidden="true">·</span>
            <span>Website Concept Demo (Local Browser Storage Only)</span>
          </div>

          <a
            href="/staff-demo"
            onClick={(e) => {
              e.preventDefault();
              onNavigateToDashboard();
            }}
            className="inline-flex items-center gap-1.5 text-[#D8D0C7] hover:text-[#D78661] transition-colors font-medium"
          >
            <span>View Staff Dashboard Demo</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
};

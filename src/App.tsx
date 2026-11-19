import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { CleaningCraftSection } from './components/CleaningCraftSection';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Navbar } from './components/Navbar';
import { QuoteWizard } from './components/QuoteWizard';
import { ServiceAreas } from './components/ServiceAreas';
import { ServiceCards } from './components/ServiceCards';
import { WhyChooseUs } from './components/WhyChooseUs';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { CleaningEnquiry, FollowUpTask, ServiceId } from './types/cleaning';
import { loadEnquiries, loadFollowUps } from './utils/enquiryStorage';

type AppRoute = 'home' | 'staff-demo';

function getRouteFromPath(pathname: string): AppRoute {
  return pathname.startsWith('/staff-demo') ? 'staff-demo' : 'home';
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() =>
    getRouteFromPath(window.location.pathname)
  );
  const [enquiries, setEnquiries] = useState<CleaningEnquiry[]>(() => loadEnquiries());
  const [followUps, setFollowUps] = useState<FollowUpTask[]>(() => loadFollowUps());
  const [preselectedService, setPreselectedService] = useState<ServiceId | ''>('');
  const [preselectionNonce, setPreselectionNonce] = useState<number>(0);
  const [prefilledPostcode, setPrefilledPostcode] = useState<string>('');
  const [postcodeNonce, setPostcodeNonce] = useState<number>(0);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRouteFromPath(window.location.pathname));
      setEnquiries(loadEnquiries());
      setFollowUps(loadFollowUps());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (target: AppRoute) => {
    const targetPath = target === 'staff-demo' ? '/staff-demo' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    setEnquiries(loadEnquiries());
    setFollowUps(loadFollowUps());
    setRoute(target);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const scrollToElement = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForQuote = (serviceId: ServiceId) => {
    setPreselectedService(serviceId);
    setPreselectionNonce((n) => n + 1);
    scrollToElement('#quote-wizard');
  };

  const handlePostcodeEnquiry = (postcode: string) => {
    setPrefilledPostcode(postcode);
    setPostcodeNonce((n) => n + 1);
    scrollToElement('#quote-wizard');
  };

  const handleEnquirySubmitted = () => {
    setEnquiries(loadEnquiries());
    setFollowUps(loadFollowUps());
  };

  return (
    <MotionConfig reducedMotion="user">
      {route === 'staff-demo' ? (
        <DashboardLayout
          enquiries={enquiries}
          followUps={followUps}
          onEnquiriesChange={setEnquiries}
          onFollowUpsChange={setFollowUps}
          onBackToWebsite={() => navigateTo('home')}
        />
      ) : (
        <div className="min-h-screen bg-[#090A0B] text-[#F4EFE8] flex flex-col">
          <Navbar onRequestQuote={() => scrollToElement('#quote-wizard')} />

          <main className="flex-1">
            <Hero
              onGetQuote={() => scrollToElement('#quote-wizard')}
              onExploreServices={() => scrollToElement('#services')}
            />

            <ServiceCards onSelectService={handleSelectServiceForQuote} />

            <CleaningCraftSection />

            <WhyChooseUs />

            <QuoteWizard
              preselectedServiceId={preselectedService}
              preselectionNonce={preselectionNonce}
              prefilledPostcode={prefilledPostcode}
              postcodeNonce={postcodeNonce}
              onEnquirySubmitted={handleEnquirySubmitted}
              onNavigateToDashboard={() => navigateTo('staff-demo')}
            />

            <HowItWorks />

            <ServiceAreas onEnquireWithPostcode={handlePostcodeEnquiry} />

            <FAQ />

            <FinalCTA onGetQuote={() => scrollToElement('#quote-wizard')} />
          </main>

          <Footer onNavigateToDashboard={() => navigateTo('staff-demo')} />
        </div>
      )}
    </MotionConfig>
  );
}

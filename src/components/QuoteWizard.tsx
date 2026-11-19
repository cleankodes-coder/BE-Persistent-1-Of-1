import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ExternalLink,
  ImagePlus,
  Info,
  MessageCircle,
  Trash2,
} from 'lucide-react';
import { BUSINESS_INFO, QUOTE_STUDIO_IMAGE, SERVICES } from '../data/services';
import {
  CleaningEnquiry,
  PhotoMetadata,
  QuoteWizardFormData,
  ServiceId,
} from '../types/cleaning';
import {
  buildCustomerWhatsAppMessage,
  buildWhatsAppLink,
  createEnquiryFromWizard,
  formatUkDate,
  isValidEmail,
  isValidPhone,
  isValidUkPostcode,
  normalizePostcode,
} from '../utils/enquiryStorage';
import { FormProgress } from './FormProgress';
import { SafeImage } from './SafeImage';
import { TextMaskReveal } from './motion/MotionPrimitives';

interface QuoteWizardProps {
  preselectedServiceId?: ServiceId | '';
  preselectionNonce?: number;
  prefilledPostcode?: string;
  postcodeNonce?: number;
  onEnquirySubmitted?: (enquiry: CleaningEnquiry) => void;
  onNavigateToDashboard: () => void;
}

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const PRIORITY_AREAS_BY_SERVICE: Record<ServiceId | 'default', string[]> = {
  domestic: [
    'Kitchen & appliances',
    'Bathrooms & descaling',
    'Living areas & bedrooms',
    'Internal windows & sills',
    'Skirting boards & woodwork',
    'Floor care & vacuuming',
  ],
  deep: [
    'Oven, hob & extractor degreasing',
    'Bathroom limescale & grout',
    'Inside kitchen cupboards',
    'Skirting, doors & radiators',
    'Internal windows & frames',
    'High-touch light switches & handles',
  ],
  tenancy: [
    'Full kitchen & oven reset',
    'Bathrooms & sanitaryware',
    'Inside wardrobes & drawers',
    'Internal glazing & frames',
    'Skirting boards & sockets',
    'Hallway & floor detailing',
  ],
  airbnb: [
    'Bed stripping & linen making',
    'Towel folding & guest staging',
    'Bathroom sanitisation',
    'Kitchenette & dishware check',
    'Rubbish removal & bin reset',
    'Arrival readiness walkthrough',
  ],
  office: [
    'Desks & workstation surfaces',
    'Glass partitions & meeting rooms',
    'Washrooms & mirror care',
    'Kitchenette & breakroom',
    'Reception & entrance glass',
    'Bin emptying & floor care',
  ],
  maintenance: [
    'Cabinet hinges & drawer alignment',
    'Door handles & latches',
    'Bathroom silicone tidy-up',
    'Minor wall scuff touch-ups',
    'Light bulb replacements',
    'Combined light cleaning tidy',
  ],
  default: [
    'Kitchen & surfaces',
    'Bathrooms',
    'Living spaces',
    'Floors & carpets',
    'Internal windows',
  ],
};

const STEP_GUIDANCE: Record<number, string> = {
  1: 'Select the service closest to your needs — you can combine notes or maintenance requests in the next step.',
  2: 'Sharing your postcode and property layout upfront lets our team prepare an accurate quotation without back-and-forth.',
  3: 'Choose your ideal date window and optionally attach local photo previews of kitchens, bathrooms, or key areas.',
  4: 'Confirm how we should reach you. No automatic pricing or booking is assumed until our team reviews your scope.',
  5: 'Your demonstration enquiry is stored locally in this browser and ready to forward via WhatsApp or inspect in the Staff Dashboard.',
};

function getInitialFormData(
  preselectedServiceId?: ServiceId | '',
  prefilledPostcode?: string
): QuoteWizardFormData {
  return {
    serviceId: preselectedServiceId || '',
    postcode: prefilledPostcode || '',
    propertyType: '',
    bedrooms: '2',
    bathrooms: '1',
    approxSize: '',
    frequency: 'One-off',
    priorityAreas: [],
    additionalRequirements: '',
    workspaceDetails: '',
    linenRequired: 'Yes — host supplies spare linen set',
    turnoverWindow: '',
    maintenanceType: '',
    preferredDate: '',
    preferredTimeWindow: 'Morning (08:30 – 12:00)',
    urgency: 'Flexible',
    accessInstructions: '',
    photos: [],
    fullName: '',
    phone: '',
    email: '',
    preferredContactMethod: 'WhatsApp',
    message: '',
  };
}

export const QuoteWizard: React.FC<QuoteWizardProps> = ({
  preselectedServiceId,
  preselectionNonce = 0,
  prefilledPostcode,
  postcodeNonce = 0,
  onEnquirySubmitted,
  onNavigateToDashboard,
}) => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<QuoteWizardFormData>(() =>
    getInitialFormData(preselectedServiceId, prefilledPostcode)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoError, setPhotoError] = useState<string>('');
  const [submittedEnquiry, setSubmittedEnquiry] = useState<CleaningEnquiry | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (preselectedServiceId && preselectionNonce > 0) {
      setForm((prev) => ({
        ...prev,
        serviceId: preselectedServiceId,
        frequency:
          preselectedServiceId === 'tenancy'
            ? 'One-off (Move-out / Move-in)'
            : preselectedServiceId === 'airbnb'
              ? 'Ongoing / Per turnover'
              : prev.frequency === 'One-off (Move-out / Move-in)' ||
                  prev.frequency === 'Ongoing / Per turnover'
                ? 'One-off'
                : prev.frequency,
        propertyType:
          preselectedServiceId === 'office'
            ? 'Commercial office suite'
            : prev.propertyType === 'Commercial office suite'
              ? ''
              : prev.propertyType,
      }));
      setSubmittedEnquiry(null);
      setStep(1);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.serviceId;
        return next;
      });
    }
  }, [preselectedServiceId, preselectionNonce]);

  useEffect(() => {
    if (prefilledPostcode && postcodeNonce > 0) {
      setForm((prev) => ({ ...prev, postcode: prefilledPostcode }));
      setSubmittedEnquiry(null);
      setStep((curr) => (curr === 5 ? 1 : curr));
    }
  }, [prefilledPostcode, postcodeNonce]);

  const selectedService = SERVICES.find((s) => s.id === form.serviceId);
  const todayStr = new Date().toISOString().split('T')[0];

  const updateField = <K extends keyof QuoteWizardFormData>(
    key: K,
    value: QuoteWizardFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const togglePriorityArea = (area: string) => {
    setForm((prev) => {
      const exists = prev.priorityAreas.includes(area);
      return {
        ...prev,
        priorityAreas: exists
          ? prev.priorityAreas.filter((a) => a !== area)
          : [...prev.priorityAreas, area],
      };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList);
    if (form.photos.length + incoming.length > MAX_FILES) {
      setPhotoError(`You can attach up to ${MAX_FILES} photos for preview.`);
      e.target.value = '';
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const newPhotos: PhotoMetadata[] = [];

    for (const file of incoming) {
      if (!validTypes.includes(file.type)) {
        setPhotoError(`"${file.name}" is not a supported image format (use JPG, PNG, or WebP).`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setPhotoError(`"${file.name}" exceeds the 5 MB per-photo limit.`);
        continue;
      }
      newPhotos.push({
        id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        sizeBytes: file.size,
        type: file.type,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (newPhotos.length > 0) {
      setForm((prev) => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    }
    e.target.value = '';
  };

  const removePhoto = (photoId: string) => {
    setForm((prev) => {
      const target = prev.photos.find((p) => p.id === photoId);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return {
        ...prev,
        photos: prev.photos.filter((p) => p.id !== photoId),
      };
    });
  };

  const validateStep = (targetStep: number): boolean => {
    const nextErrors: Record<string, string> = {};

    if (targetStep === 1) {
      if (!form.serviceId) {
        nextErrors.serviceId = 'Please select the service you are enquiring about.';
      }
    }

    if (targetStep === 2) {
      if (!form.postcode.trim()) {
        nextErrors.postcode = 'Please enter your UK postcode.';
      } else if (!isValidUkPostcode(form.postcode)) {
        nextErrors.postcode =
          'Please enter a valid UK postcode (for example, CR0 1AA or SE19 3UB).';
      }

      if (!form.propertyType.trim()) {
        nextErrors.propertyType = 'Please select or describe your property type.';
      }

      if (form.serviceId === 'office' && !form.workspaceDetails.trim()) {
        nextErrors.workspaceDetails =
          'Please briefly describe your office or workspace layout.';
      }

      if (form.serviceId === 'maintenance' && !form.maintenanceType.trim()) {
        nextErrors.maintenanceType = 'Please describe the light maintenance tasks required.';
      }
    }

    if (targetStep === 3) {
      if (!form.preferredDate) {
        nextErrors.preferredDate = 'Please select a preferred date.';
      } else if (form.preferredDate < todayStr) {
        nextErrors.preferredDate = 'Preferred date cannot be in the past.';
      }
    }

    if (targetStep === 4) {
      if (!form.fullName.trim() || form.fullName.trim().length < 2) {
        nextErrors.fullName = 'Please enter your full name.';
      }
      if (!form.phone.trim()) {
        nextErrors.phone = 'Please provide a contact telephone or WhatsApp number.';
      } else if (!isValidPhone(form.phone)) {
        nextErrors.phone = 'Please enter a valid UK or international telephone number.';
      }
      if (!form.email.trim()) {
        nextErrors.email = 'Please provide your email address.';
      } else if (!isValidEmail(form.email)) {
        nextErrors.email = 'Please enter a valid email address.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(5, s + 1));
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const { enquiry } = createEnquiryFromWizard(form);
    setSubmittedEnquiry(enquiry);
    onEnquirySubmitted?.(enquiry);
    setStep(5);
  };

  const handleResetWizard = () => {
    form.photos.forEach((p) => {
      if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
    });
    setForm(getInitialFormData());
    setSubmittedEnquiry(null);
    setErrors({});
    setPhotoError('');
    setStep(1);
  };

  const priorityOptions =
    PRIORITY_AREAS_BY_SERVICE[form.serviceId || 'default'] || PRIORITY_AREAS_BY_SERVICE.default;

  const isResidentialRoomsRelevant =
    form.serviceId !== 'office' && form.serviceId !== 'maintenance';

  const propertyTypeOptions =
    form.serviceId === 'office'
      ? [
          'Commercial office suite',
          'Co-working or creative studio',
          'Retail or client-facing premises',
          'Shared building communal areas',
        ]
      : [
          'Studio or one-bedroom flat',
          'Two-bedroom flat',
          'Terraced or semi-detached house',
          'Detached house or townhouse',
          'Maisonette or duplex',
        ];

  const frequencyOptions =
    form.serviceId === 'tenancy'
      ? ['One-off (Move-out / Move-in)']
      : form.serviceId === 'airbnb'
        ? ['Ongoing / Per turnover', 'One-off turnover', 'Weekly schedule']
        : ['One-off', 'Weekly', 'Fortnightly', 'Monthly'];

  const leftBackdropImage = selectedService?.image || QUOTE_STUDIO_IMAGE;

  return (
    <section
      id="quote-wizard"
      className="py-24 lg:py-32 bg-[#141414] border-b border-white/[0.09]"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#D78661] mb-4">
              Personalised Quotation Studio
            </p>
            <h2 className="font-display text-[clamp(2.15rem,4vw,3.4rem)] font-semibold tracking-[-0.025em] leading-[1.08] text-[#F4EFE8]">
              <TextMaskReveal>
                <span>Your Cleaning Quote,</span>
              </TextMaskReveal>
              <TextMaskReveal delay={0.08}>
                <span className="font-editorial italic font-medium text-[#D78661]">
                  Made Simple.
                </span>
              </TextMaskReveal>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#AFA7A0] leading-relaxed max-w-md lg:ml-auto">
              Tell us a little about your property and what you need. We&apos;ll help you prepare
              the details for a personalised quote.
            </p>
          </div>
        </div>

        {/* Split-Screen Booking Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-xl overflow-hidden border border-white/[0.09] bg-[#090A0B]">
          {/* LEFT RAIL: Contextual Image + Vertical Progress + Live Scope Summary */}
          <aside className="lg:col-span-4 relative flex flex-col justify-between bg-[#090A0B] border-b lg:border-b-0 lg:border-r border-white/[0.09] overflow-hidden">
            {/* Subtle Contextual Image Backdrop */}
            <div className="absolute inset-0 z-0 opacity-30">
              <SafeImage
                src={leftBackdropImage}
                alt={selectedService?.imageAlt || 'Luxury London interior preparation'}
                className="w-full h-full object-cover transition-all duration-700"
                containerClassName="w-full h-full"
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#090A0B]/70 via-[#090A0B]/88 to-[#090A0B]"
                aria-hidden="true"
              />
            </div>

            <div className="relative z-10 p-6 sm:p-8 space-y-8">
              {/* Desktop Vertical Progress */}
              <div className="hidden lg:block">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#D78661] mb-4">
                  Step {step} of 5
                </p>
                <FormProgress
                  currentStep={step}
                  onStepClick={(target) => {
                    if (target < step) setStep(target);
                  }}
                  vertical
                />
              </div>

              {/* Contextual Guidance */}
              <div className="p-4 rounded-lg bg-[#141414]/90 border border-white/[0.09]">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#D78661] mb-1.5">
                  Guidance
                </p>
                <p className="text-xs sm:text-[13px] text-[#D8D0C7] leading-relaxed">
                  {STEP_GUIDANCE[step]}
                </p>
              </div>
            </div>

            {/* Live Selected Scope Summary */}
            <div className="relative z-10 p-6 sm:p-8 pt-0 lg:pt-6 border-t border-white/[0.08] bg-[#090A0B]/70">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#AFA7A0] mb-3">
                Current Selection
              </p>
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#AFA7A0]">Service</dt>
                  <dd className="text-[#F4EFE8] font-medium text-right">
                    {selectedService?.name || 'Not yet selected'}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#AFA7A0]">Postcode</dt>
                  <dd className="font-mono text-[#F4EFE8] text-right">
                    {form.postcode ? normalizePostcode(form.postcode) : '—'}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#AFA7A0]">Preferred Date</dt>
                  <dd className="text-[#F4EFE8] tabular-nums text-right">
                    {form.preferredDate ? formatUkDate(form.preferredDate) : '—'}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>

          {/* RIGHT CANVAS: Interactive Form Steps */}
          <div className="lg:col-span-8 p-6 sm:p-9 lg:p-11 bg-[#141414]/60">
            {/* Mobile Horizontal Progress */}
            <div className="lg:hidden">
              <FormProgress
                currentStep={step}
                onStepClick={(target) => {
                  if (target < step) setStep(target);
                }}
              />
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: SELECT SERVICE */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="mb-7">
                    <span className="font-mono text-xs text-[#D78661] block mb-1.5">
                      01 / SELECT SERVICE
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-[#F4EFE8]">
                      Which service do you require?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-7">
                    {SERVICES.map((service, idx) => {
                      const selected = form.serviceId === service.id;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => {
                            updateField('serviceId', service.id);
                            if (service.id === 'tenancy') {
                              updateField('frequency', 'One-off (Move-out / Move-in)');
                            } else if (service.id === 'airbnb') {
                              updateField('frequency', 'Ongoing / Per turnover');
                            } else if (
                              form.frequency === 'One-off (Move-out / Move-in)' ||
                              form.frequency === 'Ongoing / Per turnover'
                            ) {
                              updateField('frequency', 'One-off');
                            }
                          }}
                          aria-pressed={selected}
                          className={`group text-left p-5 rounded-lg border transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B66343] ${
                            selected
                              ? 'bg-[#1D1C1A] border-[#D78661] ring-1 ring-[#B66343]/50'
                              : 'bg-[#090A0B]/70 border-white/[0.09] hover:border-white/25 hover:bg-[#1D1C1A]/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <span className="font-mono text-[11px] text-[#D78661] tabular-nums">
                              0{idx + 1}
                            </span>
                            <span
                              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                selected
                                  ? 'bg-[#B66343] border-[#B66343] text-[#F4EFE8]'
                                  : 'border-white/20 group-hover:border-white/40'
                              }`}
                            >
                              {selected && <Check className="w-3 h-3" aria-hidden="true" />}
                            </span>
                          </div>
                          <span className="block font-display text-base font-semibold text-[#F4EFE8] mb-1.5">
                            {service.name}
                          </span>
                          <p className="text-xs text-[#AFA7A0] leading-relaxed line-clamp-2">
                            {service.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {errors.serviceId && (
                    <p
                      className="flex items-center gap-2 text-sm text-[#D78661] mb-5"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {errors.serviceId}
                    </p>
                  )}

                  <div className="flex justify-end pt-5 border-t border-white/[0.09]">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-[#B66343] hover:bg-[#D78661] text-sm font-medium text-[#F4EFE8] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>Continue to Property Details</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PROPERTY DETAILS */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="mb-7">
                    <span className="font-mono text-xs text-[#D78661] block mb-1.5">
                      02 / PROPERTY DETAILS · {selectedService?.shortLabel.toUpperCase()}
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-[#F4EFE8]">
                      Tell us about your space
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div>
                      <label
                        htmlFor="qw-postcode"
                        className="block text-xs font-medium text-[#D8D0C7] mb-2"
                      >
                        UK Postcode <span className="text-[#D78661]">*</span>
                      </label>
                      <input
                        id="qw-postcode"
                        type="text"
                        value={form.postcode}
                        onChange={(e) => updateField('postcode', e.target.value.toUpperCase())}
                        onBlur={() => {
                          if (isValidUkPostcode(form.postcode)) {
                            updateField('postcode', normalizePostcode(form.postcode));
                          }
                        }}
                        placeholder="e.g. CR0 1AA or SE19 3UB"
                        className="w-full px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 focus:outline-none focus:border-[#D78661] font-mono uppercase transition-colors"
                      />
                      {errors.postcode && (
                        <p className="mt-1.5 text-xs text-[#D78661]" role="alert">
                          {errors.postcode}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="qw-property-type"
                        className="block text-xs font-medium text-[#D8D0C7] mb-2"
                      >
                        Property Type <span className="text-[#D78661]">*</span>
                      </label>
                      <select
                        id="qw-property-type"
                        value={form.propertyType}
                        onChange={(e) => updateField('propertyType', e.target.value)}
                        className="w-full px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] focus:outline-none focus:border-[#D78661] transition-colors"
                      >
                        <option value="">Select property type</option>
                        {propertyTypeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.propertyType && (
                        <p className="mt-1.5 text-xs text-[#D78661]" role="alert">
                          {errors.propertyType}
                        </p>
                      )}
                    </div>

                    {isResidentialRoomsRelevant && (
                      <div>
                        <label
                          htmlFor="qw-bedrooms"
                          className="block text-xs font-medium text-[#D8D0C7] mb-2"
                        >
                          Number of Bedrooms
                        </label>
                        <select
                          id="qw-bedrooms"
                          value={form.bedrooms}
                          onChange={(e) => updateField('bedrooms', e.target.value)}
                          className="w-full px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] focus:outline-none focus:border-[#D78661]"
                        >
                          <option value="Studio">Studio</option>
                          <option value="1">1 Bedroom</option>
                          <option value="2">2 Bedrooms</option>
                          <option value="3">3 Bedrooms</option>
                          <option value="4">4 Bedrooms</option>
                          <option value="5+">5+ Bedrooms</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="qw-bathrooms"
                        className="block text-xs font-medium text-[#D8D0C7] mb-2"
                      >
                        {form.serviceId === 'office'
                          ? 'Number of Washrooms / WCs'
                          : 'Number of Bathrooms'}
                      </label>
                      <select
                        id="qw-bathrooms"
                        value={form.bathrooms}
                        onChange={(e) => updateField('bathrooms', e.target.value)}
                        className="w-full px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] focus:outline-none focus:border-[#D78661]"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4+">4+</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="qw-approx-size"
                        className="block text-xs font-medium text-[#D8D0C7] mb-2"
                      >
                        Approximate Size (optional)
                      </label>
                      <input
                        id="qw-approx-size"
                        type="text"
                        value={form.approxSize}
                        onChange={(e) => updateField('approxSize', e.target.value)}
                        placeholder="e.g. 750 sq ft or 3 floors"
                        className="w-full px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 focus:outline-none focus:border-[#D78661]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="qw-frequency"
                        className="block text-xs font-medium text-[#D8D0C7] mb-2"
                      >
                        Cleaning Frequency
                      </label>
                      <select
                        id="qw-frequency"
                        value={form.frequency}
                        onChange={(e) => updateField('frequency', e.target.value)}
                        className="w-full px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] focus:outline-none focus:border-[#D78661]"
                      >
                        {frequencyOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contextual Service Fields */}
                  {form.serviceId === 'office' && (
                    <div className="mb-6 p-5 rounded-lg bg-[#1D1C1A]/70 border border-white/[0.09]">
                      <label
                        htmlFor="qw-workspace"
                        className="block text-xs font-medium text-[#F4EFE8] mb-2"
                      >
                        Office &amp; Workspace Details <span className="text-[#D78661]">*</span>
                      </label>
                      <textarea
                        id="qw-workspace"
                        rows={3}
                        value={form.workspaceDetails}
                        onChange={(e) => updateField('workspaceDetails', e.target.value)}
                        placeholder="Describe number of desks, meeting rooms, kitchenette, reception, and preferred cleaning hours."
                        className="w-full px-4 py-3 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 focus:outline-none focus:border-[#D78661]"
                      />
                      {errors.workspaceDetails && (
                        <p className="mt-1.5 text-xs text-[#D78661]" role="alert">
                          {errors.workspaceDetails}
                        </p>
                      )}
                    </div>
                  )}

                  {form.serviceId === 'airbnb' && (
                    <div className="mb-6 p-5 rounded-lg bg-[#1D1C1A]/70 border border-white/[0.09] grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="qw-linen"
                          className="block text-xs font-medium text-[#F4EFE8] mb-2"
                        >
                          Linen &amp; Towel Requirement
                        </label>
                        <select
                          id="qw-linen"
                          value={form.linenRequired}
                          onChange={(e) => updateField('linenRequired', e.target.value)}
                          className="w-full px-4 py-3 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] focus:outline-none focus:border-[#D78661]"
                        >
                          <option value="Yes — host supplies spare linen set">
                            Yes — host supplies spare linen set
                          </option>
                          <option value="Yes — wash &amp; dry on-site if time permits">
                            Yes — wash &amp; dry on-site if time permits
                          </option>
                          <option value="Bed-making only, no laundry needed">
                            Bed-making only, no laundry needed
                          </option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="qw-turnover"
                          className="block text-xs font-medium text-[#F4EFE8] mb-2"
                        >
                          Typical Checkout / Check-in Window
                        </label>
                        <input
                          id="qw-turnover"
                          type="text"
                          value={form.turnoverWindow}
                          onChange={(e) => updateField('turnoverWindow', e.target.value)}
                          placeholder="e.g. 11:00 checkout to 15:00 check-in"
                          className="w-full px-4 py-3 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 focus:outline-none focus:border-[#D78661]"
                        />
                      </div>
                    </div>
                  )}

                  {form.serviceId === 'maintenance' && (
                    <div className="mb-6 p-5 rounded-lg bg-[#1D1C1A]/70 border border-white/[0.09]">
                      <label
                        htmlFor="qw-maintenance"
                        className="block text-xs font-medium text-[#F4EFE8] mb-2"
                      >
                        Type of Light Maintenance Required{' '}
                        <span className="text-[#D78661]">*</span>
                      </label>
                      <textarea
                        id="qw-maintenance"
                        rows={3}
                        value={form.maintenanceType}
                        onChange={(e) => updateField('maintenanceType', e.target.value)}
                        placeholder="List the practical tasks needed (e.g. kitchen cupboard hinge tightening, loose door handle, sealant tidy-up, light bulb replacement)."
                        className="w-full px-4 py-3 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 focus:outline-none focus:border-[#D78661]"
                      />
                      {errors.maintenanceType && (
                        <p className="mt-1.5 text-xs text-[#D78661]" role="alert">
                          {errors.maintenanceType}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Priority Areas */}
                  <div className="mb-6">
                    <span className="block text-xs font-medium text-[#D8D0C7] mb-3">
                      Priority Areas (select any that apply)
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {priorityOptions.map((area) => {
                        const active = form.priorityAreas.includes(area);
                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() => togglePriorityArea(area)}
                            aria-pressed={active}
                            className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#B66343]/22 border-[#D78661] text-[#F4EFE8]'
                                : 'bg-[#090A0B] border-white/[0.09] text-[#AFA7A0] hover:text-[#F4EFE8] hover:border-white/25'
                            }`}
                          >
                            {active && (
                              <Check className="w-3.5 h-3.5 text-[#D78661]" aria-hidden="true" />
                            )}
                            <span>{area}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional Requirements */}
                  <div className="mb-7">
                    <label
                      htmlFor="qw-requirements"
                      className="block text-xs font-medium text-[#D8D0C7] mb-2"
                    >
                      Additional Requirements (optional)
                    </label>
                    <textarea
                      id="qw-requirements"
                      rows={3}
                      value={form.additionalRequirements}
                      onChange={(e) => updateField('additionalRequirements', e.target.value)}
                      placeholder="Mention pets, delicate stone/timber surfaces, or specific rooms to prioritise."
                      className="w-full px-4 py-3 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 focus:outline-none focus:border-[#D78661]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-white/[0.09]">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/[0.14] text-sm font-medium text-[#D8D0C7] hover:text-[#F4EFE8] hover:border-white/30 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#B66343] hover:bg-[#D78661] text-sm font-medium text-[#F4EFE8] transition-colors cursor-pointer"
                    >
                      Continue to Date &amp; Photos
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: DATE & PHOTOS */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="mb-7">
                    <span className="font-mono text-xs text-[#D78661] block mb-1.5">
                      03 / PREFERRED SCHEDULE &amp; PHOTOS
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-[#F4EFE8]">
                      When would you like us to attend?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                    <div>
                      <label
                        htmlFor="qw-date"
                        className="block text-xs font-medium text-[#D8D0C7] mb-2"
                      >
                        Preferred Date <span className="text-[#D78661]">*</span>
                      </label>
                      <input
                        id="qw-date"
                        type="date"
                        min={todayStr}
                        value={form.preferredDate}
                        onChange={(e) => updateField('preferredDate', e.target.value)}
                        className="w-full px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] focus:outline-none focus:border-[#D78661] tabular-nums [color-scheme:dark]"
                      />
                      {errors.preferredDate && (
                        <p className="mt-1.5 text-xs text-[#D78661]" role="alert">
                          {errors.preferredDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="qw-time"
                        className="block text-xs font-medium text-[#D8D0C7] mb-2"
                      >
                        Preferred Time Window
                      </label>
                      <select
                        id="qw-time"
                        value={form.preferredTimeWindow}
                        onChange={(e) => updateField('preferredTimeWindow', e.target.value)}
                        className="w-full px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] focus:outline-none focus:border-[#D78661]"
                      >
                        <option value="Morning (08:30 – 12:00)">Morning (08:30 – 12:00)</option>
                        <option value="Midday (11:00 – 15:00)">Midday (11:00 – 15:00)</option>
                        <option value="Afternoon (13:00 – 17:00)">Afternoon (13:00 – 17:00)</option>
                        <option value="Evening (After 18:00)">Evening (After 18:00)</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="qw-urgency"
                        className="block text-xs font-medium text-[#D8D0C7] mb-2"
                      >
                        Timing Flexibility
                      </label>
                      <select
                        id="qw-urgency"
                        value={form.urgency}
                        onChange={(e) => updateField('urgency', e.target.value)}
                        className="w-full px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] focus:outline-none focus:border-[#D78661]"
                      >
                        <option value="Flexible">Flexible</option>
                        <option value="Within 7 days">Within 7 days</option>
                        <option value="This week">This week</option>
                        <option value="Urgent / Short notice">Urgent / Short notice</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-7">
                    <label
                      htmlFor="qw-access"
                      className="block text-xs font-medium text-[#D8D0C7] mb-2"
                    >
                      Access &amp; Parking Instructions (optional)
                    </label>
                    <input
                      id="qw-access"
                      type="text"
                      value={form.accessInstructions}
                      onChange={(e) => updateField('accessInstructions', e.target.value)}
                      placeholder="e.g. Concierge key collection, visitor bay available, buzzer instructions"
                      className="w-full px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 focus:outline-none focus:border-[#D78661]"
                    />
                  </div>

                  {/* Photo Previews */}
                  <div className="p-5 sm:p-6 rounded-lg bg-[#090A0B] border border-white/[0.09] mb-7">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h4 className="font-display text-base font-semibold text-[#F4EFE8] mb-1">
                          Optional Property Photos
                        </h4>
                        <p className="text-xs text-[#AFA7A0]">
                          JPG, PNG, or WebP up to 5 MB each (max 5 photos).
                        </p>
                      </div>
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handlePhotoUpload}
                          className="sr-only"
                          id="qw-photo-input"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#1D1C1A] hover:bg-[#2A2825] border border-white/[0.14] text-xs font-medium text-[#F4EFE8] transition-colors cursor-pointer"
                        >
                          <ImagePlus className="w-4 h-4 text-[#D78661]" aria-hidden="true" />
                          Select Photos
                        </button>
                      </div>
                    </div>

                    <p className="flex items-start gap-2 text-xs text-[#AFA7A0] bg-[#141414] border border-white/[0.08] rounded-md px-3.5 py-2.5 mb-4">
                      <Info className="w-4 h-4 text-[#D78661] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        Demo preview only: selected photographs remain locally in your browser and
                        are not uploaded to a remote server. Photo filenames are recorded with your
                        demo enquiry.
                      </span>
                    </p>

                    {photoError && (
                      <p className="flex items-center gap-2 text-xs text-[#D78661] mb-4" role="alert">
                        <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                        {photoError}
                      </p>
                    )}

                    {form.photos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {form.photos.map((photo) => (
                          <div
                            key={photo.id}
                            className="group relative rounded-md overflow-hidden border border-white/[0.12] bg-[#1D1C1A]"
                          >
                            <div className="aspect-square overflow-hidden">
                              {photo.previewUrl ? (
                                <img
                                  src={photo.previewUrl}
                                  alt={photo.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-[#AFA7A0]">
                                  Preview
                                </div>
                              )}
                            </div>
                            <div className="px-2 py-1.5 flex items-center justify-between gap-1 bg-[#141414]">
                              <span className="text-[11px] text-[#D8D0C7] truncate">
                                {photo.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removePhoto(photo.id)}
                                aria-label={`Remove ${photo.name}`}
                                className="p-1 text-[#AFA7A0] hover:text-[#D78661] cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-white/[0.09]">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/[0.14] text-sm font-medium text-[#D8D0C7] hover:text-[#F4EFE8] hover:border-white/30 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#B66343] hover:bg-[#D78661] text-sm font-medium text-[#F4EFE8] transition-colors cursor-pointer"
                    >
                      Continue to Contact Info
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: CONTACT INFORMATION */}
              {step === 4 && (
                <motion.form
                  key="step-4"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="mb-7">
                    <span className="font-mono text-xs text-[#D78661] block mb-1.5">
                      04 / CONTACT &amp; REVIEW
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-[#F4EFE8]">
                      Where should we send your quotation?
                    </h3>
                  </div>

                  <div className="space-y-5 mb-7">
                    <div>
                      <label
                        htmlFor="qw-name"
                        className="block text-xs font-medium text-[#D8D0C7] mb-2"
                      >
                        Full Name <span className="text-[#D78661]">*</span>
                      </label>
                      <input
                        id="qw-name"
                        type="text"
                        value={form.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 focus:outline-none focus:border-[#D78661]"
                      />
                      {errors.fullName && (
                        <p className="mt-1.5 text-xs text-[#D78661]" role="alert">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="qw-phone"
                          className="block text-xs font-medium text-[#D8D0C7] mb-2"
                        >
                          Telephone / WhatsApp <span className="text-[#D78661]">*</span>
                        </label>
                        <input
                          id="qw-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          placeholder="e.g. +44 7700 900077"
                          className="w-full px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 focus:outline-none focus:border-[#D78661]"
                        />
                        {errors.phone && (
                          <p className="mt-1.5 text-xs text-[#D78661]" role="alert">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="qw-email"
                          className="block text-xs font-medium text-[#D8D0C7] mb-2"
                        >
                          Email Address <span className="text-[#D78661]">*</span>
                        </label>
                        <input
                          id="qw-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="e.g. name@example.com"
                          className="w-full px-4 py-3.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 focus:outline-none focus:border-[#D78661]"
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-xs text-[#D78661]" role="alert">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-medium text-[#D8D0C7] mb-2">
                        Preferred Contact Method
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        {['WhatsApp', 'Phone Call', 'Email'].map((method) => {
                          const active = form.preferredContactMethod === method;
                          return (
                            <button
                              key={method}
                              type="button"
                              onClick={() => updateField('preferredContactMethod', method)}
                              className={`py-3 px-3 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                                active
                                  ? 'bg-[#B66343]/22 border-[#D78661] text-[#F4EFE8]'
                                  : 'bg-[#090A0B] border-white/[0.09] text-[#AFA7A0] hover:text-[#F4EFE8]'
                              }`}
                            >
                              {method}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="qw-message"
                        className="block text-xs font-medium text-[#D8D0C7] mb-2"
                      >
                        Additional Message (optional)
                      </label>
                      <textarea
                        id="qw-message"
                        rows={3}
                        value={form.message}
                        onChange={(e) => updateField('message', e.target.value)}
                        placeholder="Anything else you would like us to note before reviewing your enquiry."
                        className="w-full px-4 py-3 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 focus:outline-none focus:border-[#D78661]"
                      />
                    </div>

                    {/* Concise Enquiry Summary Strip */}
                    <div className="p-4 rounded-lg bg-[#090A0B] border border-white/[0.09] text-xs text-[#AFA7A0] leading-relaxed">
                      <span className="text-[#F4EFE8] font-medium">Review:</span>{' '}
                      {selectedService?.name} · {normalizePostcode(form.postcode)} ·{' '}
                      {form.propertyType} · {formatUkDate(form.preferredDate)} (
                      {form.preferredTimeWindow}) · {form.photos.length} local photo(s).{' '}
                      <span className="text-[#D8D0C7]">
                        Actual quotations require team review; this demo stores your enquiry
                        locally in your browser.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-white/[0.09]">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/[0.14] text-sm font-medium text-[#D8D0C7] hover:text-[#F4EFE8] hover:border-white/30 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-[#B66343] hover:bg-[#D78661] text-sm font-medium text-[#F4EFE8] transition-colors cursor-pointer"
                    >
                      Prepare Quote Enquiry
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </motion.form>
              )}

              {/* STEP 5: CONFIRMATION & WHATSAPP HANDOFF */}
              {step === 5 && submittedEnquiry && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/[0.09] mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-md bg-[#B66343]/18 border border-[#B66343]/55 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-[#D78661]" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#D78661] mb-1">
                          Enquiry Prepared (Demo)
                        </p>
                        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#F4EFE8]">
                          Thank you, {submittedEnquiry.fullName}.
                        </h3>
                      </div>
                    </div>

                    <div className="bg-[#090A0B] border border-white/[0.12] rounded-md px-4 py-2.5">
                      <span className="block text-[10px] uppercase tracking-wider text-[#AFA7A0]">
                        Reference
                      </span>
                      <span className="font-mono text-base font-medium text-[#F4EFE8] tabular-nums">
                        {submittedEnquiry.reference}
                      </span>
                    </div>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-[#090A0B] border border-white/[0.09] rounded-lg p-5 mb-6">
                    <div>
                      <dt className="text-xs text-[#AFA7A0]">Service</dt>
                      <dd className="text-[#F4EFE8] font-medium mt-0.5">
                        {submittedEnquiry.serviceName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#AFA7A0]">Postcode &amp; Property</dt>
                      <dd className="text-[#F4EFE8] mt-0.5">
                        <span className="font-mono">{submittedEnquiry.postcode}</span> ·{' '}
                        {submittedEnquiry.propertyType}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#AFA7A0]">Preferred Window</dt>
                      <dd className="text-[#F4EFE8] mt-0.5 flex items-center gap-1.5 tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-[#D78661]" aria-hidden="true" />
                        {formatUkDate(submittedEnquiry.preferredDate)} ·{' '}
                        {submittedEnquiry.preferredTimeWindow}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#AFA7A0]">Photos Noted</dt>
                      <dd className="text-[#F4EFE8] mt-0.5 tabular-nums">
                        {submittedEnquiry.photos.length} local photo(s) selected
                      </dd>
                    </div>
                  </dl>

                  <div className="p-4 rounded-lg bg-[#1D1C1A] border border-[#B66343]/40 text-xs text-[#D8D0C7] leading-relaxed mb-6">
                    <strong className="text-[#F4EFE8] font-medium">
                      Important regarding WhatsApp &amp; photos:
                    </strong>{' '}
                    Selected photo files are NOT automatically attached to WhatsApp links. Please
                    attach photographs manually inside WhatsApp if needed. Actual quotations and
                    appointments require business review by {BUSINESS_INFO.name}.
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <a
                      href={buildWhatsAppLink(buildCustomerWhatsAppMessage(submittedEnquiry))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-md bg-[#B66343] hover:bg-[#D78661] text-sm font-medium text-[#F4EFE8] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      Continue on WhatsApp
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
                    </a>

                    <button
                      type="button"
                      onClick={onNavigateToDashboard}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-md bg-[#090A0B] hover:bg-[#1D1C1A] border border-white/[0.14] text-sm font-medium text-[#F4EFE8] transition-colors cursor-pointer"
                    >
                      <span>View in Staff Dashboard Demo</span>
                      <ArrowRight className="w-4 h-4 text-[#D78661]" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetWizard}
                    className="text-xs font-medium text-[#AFA7A0] hover:text-[#F4EFE8] underline underline-offset-4 cursor-pointer"
                  >
                    Start another quote enquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

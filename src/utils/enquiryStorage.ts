import { BUSINESS_INFO, SERVICES } from '../data/services';
import { SEED_ENQUIRIES, SEED_FOLLOWUPS } from '../data/seedDemoData';
import {
  ActivityItem,
  CleaningEnquiry,
  EnquiryStatus,
  FollowUpTask,
  QuoteDraft,
  QuoteWizardFormData,
} from '../types/cleaning';

const ENQUIRIES_KEY = 'bp1of1_demo_enquiries_v1';
const FOLLOWUPS_KEY = 'bp1of1_demo_followups_v1';

export function formatUkDate(isoOrDate: string): string {
  if (!isoOrDate) return 'Flexible';
  const date = new Date(isoOrDate);
  if (Number.isNaN(date.getTime())) return isoOrDate;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatUkTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isValidUkPostcode(value: string): boolean {
  const trimmed = value.trim().toUpperCase();
  // Standard UK postcode regex (covers Croydon CR0, London SW16, SE19, EC2A, etc.)
  return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(trimmed);
}

export function normalizePostcode(value: string): string {
  const cleaned = value.trim().toUpperCase().replace(/\s+/g, '');
  if (cleaned.length > 3) {
    return `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`;
  }
  return cleaned;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[^\d]/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildCustomerWhatsAppMessage(enquiry: CleaningEnquiry): string {
  const lines = [
    `Hello ${BUSINESS_INFO.name}, I've completed a cleaning quote request on your website demo. Here are my details:`,
    '',
    `Reference: ${enquiry.reference}`,
    `Name: ${enquiry.fullName}`,
    `Service: ${enquiry.serviceName}`,
    `Postcode: ${enquiry.postcode}`,
    `Property: ${enquiry.propertyType}${
      enquiry.bedrooms && enquiry.bedrooms !== 'N/A' ? ` (${enquiry.bedrooms} bed, ${enquiry.bathrooms} bath)` : ''
    }`,
    `Frequency: ${enquiry.frequency}`,
    `Preferred Date: ${formatUkDate(enquiry.preferredDate)} (${enquiry.preferredTimeWindow})`,
    enquiry.priorityAreas.length > 0 ? `Priority Areas: ${enquiry.priorityAreas.join(', ')}` : '',
    enquiry.photos.length > 0
      ? `Photos noted (${enquiry.photos.length} selected locally — I will attach any photos directly in this WhatsApp chat if needed).`
      : '',
    enquiry.message ? `Notes: ${enquiry.message}` : '',
  ].filter(Boolean);

  return lines.join('\n');
}

export function generateFollowUpDraft(
  enquiry: Pick<CleaningEnquiry, 'fullName' | 'serviceName' | 'postcode' | 'reference' | 'preferredDate'>,
  taskTitle: string
): string {
  const lower = taskTitle.toLowerCase();
  if (lower.includes('quotation') || lower.includes('quote')) {
    return `Hi ${enquiry.fullName}, following up from ${BUSINESS_INFO.name} regarding your ${enquiry.serviceName} enquiry in ${enquiry.postcode} (Ref: ${enquiry.reference}). Please let us know if you have any questions or would like to review availability.`;
  }
  if (lower.includes('confirm') || lower.includes('date')) {
    return `Hi ${enquiry.fullName}, this is ${BUSINESS_INFO.name} checking in regarding your ${enquiry.serviceName} request in ${enquiry.postcode} (Ref: ${enquiry.reference}) for ${formatUkDate(
      enquiry.preferredDate
    )}. Please let us know if you would like to confirm access details.`;
  }
  return `Hi ${enquiry.fullName}, thank you for contacting ${BUSINESS_INFO.name}. We've received your enquiry for ${enquiry.serviceName} in ${enquiry.postcode} (Ref: ${enquiry.reference}). Our team will review your requirements and discuss the next steps with you.`;
}

export function generateDefaultScopeOfWork(enquiry: CleaningEnquiry): string {
  const parts = [
    `${enquiry.serviceName} for ${enquiry.propertyType.toLowerCase()} in ${enquiry.postcode}.`,
  ];
  if (enquiry.bedrooms && enquiry.bedrooms !== 'N/A') {
    parts.push(`Bedrooms: ${enquiry.bedrooms} · Bathrooms: ${enquiry.bathrooms}.`);
  }
  if (enquiry.approxSize) {
    parts.push(`Approximate size: ${enquiry.approxSize}.`);
  }
  if (enquiry.priorityAreas.length > 0) {
    parts.push(`Priority focus: ${enquiry.priorityAreas.join(', ')}.`);
  }
  if (enquiry.workspaceDetails) {
    parts.push(`Workspace details: ${enquiry.workspaceDetails}.`);
  }
  if (enquiry.linenRequired || enquiry.turnoverWindow) {
    parts.push(
      `Turnover details: ${[enquiry.linenRequired, enquiry.turnoverWindow].filter(Boolean).join(' · ')}.`
    );
  }
  if (enquiry.maintenanceType) {
    parts.push(`Maintenance scope: ${enquiry.maintenanceType}.`);
  }
  if (enquiry.additionalRequirements) {
    parts.push(`Additional notes: ${enquiry.additionalRequirements}`);
  }
  return parts.join('\n');
}

export function loadEnquiries(): CleaningEnquiry[] {
  try {
    const raw = localStorage.getItem(ENQUIRIES_KEY);
    if (!raw) {
      localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(SEED_ENQUIRIES));
      return SEED_ENQUIRIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_ENQUIRIES;
  } catch {
    return SEED_ENQUIRIES;
  }
}

export function saveEnquiries(enquiries: CleaningEnquiry[]): void {
  try {
    // Strip heavy base64 previewDataUrls if approaching storage limits, keeping metadata safely
    const safeCopy = enquiries.map((enq) => ({
      ...enq,
      photos: enq.photos.map((p) => ({
        id: p.id,
        name: p.name,
        sizeBytes: p.sizeBytes,
        type: p.type,
      })),
    }));
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(safeCopy));
  } catch {
    // Graceful fallback if localStorage quota is restricted
  }
}

export function loadFollowUps(): FollowUpTask[] {
  try {
    const raw = localStorage.getItem(FOLLOWUPS_KEY);
    if (!raw) {
      localStorage.setItem(FOLLOWUPS_KEY, JSON.stringify(SEED_FOLLOWUPS));
      return SEED_FOLLOWUPS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_FOLLOWUPS;
  } catch {
    return SEED_FOLLOWUPS;
  }
}

export function saveFollowUps(tasks: FollowUpTask[]): void {
  try {
    localStorage.setItem(FOLLOWUPS_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function resetDemoStorage(): {
  enquiries: CleaningEnquiry[];
  followUps: FollowUpTask[];
} {
  try {
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(SEED_ENQUIRIES));
    localStorage.setItem(FOLLOWUPS_KEY, JSON.stringify(SEED_FOLLOWUPS));
  } catch {
    // Ignore
  }
  return {
    enquiries: SEED_ENQUIRIES,
    followUps: SEED_FOLLOWUPS,
  };
}

export function createEnquiryFromWizard(form: QuoteWizardFormData): {
  enquiry: CleaningEnquiry;
  followUp: FollowUpTask;
} {
  const service = SERVICES.find((s) => s.id === form.serviceId) ?? SERVICES[0];
  const now = new Date();
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const reference = `BP-${String(now.getFullYear()).slice(-2)}${String(
    now.getMonth() + 1
  ).padStart(2, '0')}-${randomCode}`;
  const id = `enq-${now.getTime()}-${randomCode}`;
  const createdIso = now.toISOString();
  const normalizedPostcode = normalizePostcode(form.postcode);

  const initialHistory: ActivityItem[] = [
    {
      id: `hist-${now.getTime()}-1`,
      timestamp: createdIso,
      type: 'created',
      summary: 'Demo enquiry submitted via guided quotation wizard',
      actor: 'Customer Form',
    },
    {
      id: `hist-${now.getTime()}-2`,
      timestamp: createdIso,
      type: 'followup_created',
      summary: 'Suggested follow-up task generated: Acknowledge new cleaning enquiry',
      actor: 'Rule Assistant',
    },
  ];

  const enquiry: CleaningEnquiry = {
    id,
    reference,
    createdAt: createdIso,
    submissionDate: formatUkDate(createdIso),
    serviceId: service.id,
    serviceName: service.name,
    postcode: normalizedPostcode,
    propertyType: form.propertyType,
    bedrooms: form.bedrooms || 'N/A',
    bathrooms: form.bathrooms || '1',
    approxSize: form.approxSize.trim(),
    frequency: form.frequency,
    priorityAreas: form.priorityAreas,
    additionalRequirements: form.additionalRequirements.trim(),
    workspaceDetails: form.workspaceDetails.trim() || undefined,
    linenRequired: form.linenRequired || undefined,
    turnoverWindow: form.turnoverWindow.trim() || undefined,
    maintenanceType: form.maintenanceType.trim() || undefined,
    preferredDate: form.preferredDate,
    preferredTimeWindow: form.preferredTimeWindow,
    urgency: form.urgency,
    accessInstructions: form.accessInstructions.trim(),
    photos: form.photos,
    fullName: form.fullName.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    preferredContactMethod: form.preferredContactMethod,
    message: form.message.trim(),
    status: 'New',
    internalNotes: [],
    history: initialHistory,
    isSeedDemo: false,
  };

  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const followUpTitle = 'Acknowledge new cleaning enquiry';
  const followUp: FollowUpTask = {
    id: `fu-${now.getTime()}-${randomCode}`,
    enquiryId: id,
    reference,
    customerName: enquiry.fullName,
    customerPhone: enquiry.phone,
    serviceName: enquiry.serviceName,
    postcode: enquiry.postcode,
    title: followUpTitle,
    dueDate: tomorrow,
    status: 'Pending',
    messageDraft: generateFollowUpDraft(enquiry, followUpTitle),
    createdAt: createdIso,
  };

  // Persist immediately so Staff Dashboard Demo sees it immediately in the same browser
  const existingEnquiries = loadEnquiries();
  const updatedEnquiries = [enquiry, ...existingEnquiries];
  saveEnquiries(updatedEnquiries);

  const existingFollowUps = loadFollowUps();
  const updatedFollowUps = [followUp, ...existingFollowUps];
  saveFollowUps(updatedFollowUps);

  return { enquiry, followUp };
}

export function createActivity(
  type: ActivityItem['type'],
  summary: string,
  actor = 'Demo Staff'
): ActivityItem {
  return {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    type,
    summary,
    actor,
  };
}

export function getStatusStyles(status: EnquiryStatus): {
  text: string;
  border: string;
  bg: string;
} {
  switch (status) {
    case 'New':
      return {
        text: 'text-[#E39A85]',
        border: 'border-[#AE553C]/50',
        bg: 'bg-[#AE553C]/12',
      };
    case 'Under Review':
      return {
        text: 'text-[#E5C185]',
        border: 'border-[#C89B54]/40',
        bg: 'bg-[#C89B54]/10',
      };
    case 'Quote Prepared':
      return {
        text: 'text-[#F3EEE7]',
        border: 'border-[#F3EEE7]/30',
        bg: 'bg-[#F3EEE7]/10',
      };
    case 'Contacted':
      return {
        text: 'text-[#A8C7B7]',
        border: 'border-[#5D8C73]/40',
        bg: 'bg-[#5D8C73]/12',
      };
    case 'Booked':
      return {
        text: 'text-[#8FD1A6]',
        border: 'border-[#3E8E5A]/45',
        bg: 'bg-[#3E8E5A]/15',
      };
    case 'Closed':
      return {
        text: 'text-[#A9A19A]',
        border: 'border-[#3A3532]',
        bg: 'bg-[#1C1A19]',
      };
  }
}

export function createEmptyDraft(enquiry: CleaningEnquiry): QuoteDraft {
  const nowIso = new Date().toISOString();
  return {
    id: enquiry.quoteDraft?.id || `draft-${Date.now()}`,
    enquiryId: enquiry.id,
    customerName: enquiry.fullName,
    customerEmail: enquiry.email,
    customerPhone: enquiry.phone,
    postcode: enquiry.postcode,
    serviceName: enquiry.serviceName,
    scopeOfWork: enquiry.quoteDraft?.scopeOfWork || generateDefaultScopeOfWork(enquiry),
    priceGbp: enquiry.quoteDraft?.priceGbp || '',
    notes: enquiry.quoteDraft?.notes || '',
    draftDate: enquiry.quoteDraft?.draftDate || formatUkDate(nowIso),
    updatedAt: nowIso,
  };
}

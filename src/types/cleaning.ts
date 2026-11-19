export type ServiceId =
  | 'domestic'
  | 'deep'
  | 'tenancy'
  | 'airbnb'
  | 'office'
  | 'maintenance';

export type EnquiryStatus =
  | 'New'
  | 'Under Review'
  | 'Quote Prepared'
  | 'Contacted'
  | 'Booked'
  | 'Closed';

export const ENQUIRY_STATUSES: EnquiryStatus[] = [
  'New',
  'Under Review',
  'Quote Prepared',
  'Contacted',
  'Booked',
  'Closed',
];

export interface ServiceDefinition {
  id: ServiceId;
  name: string;
  shortLabel: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
}

export interface PhotoMetadata {
  id: string;
  name: string;
  sizeBytes: number;
  type: string;
  previewUrl?: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type:
    | 'created'
    | 'status_change'
    | 'note_added'
    | 'quote_drafted'
    | 'followup_created'
    | 'followup_completed';
  summary: string;
  actor: string;
}

export interface InternalNote {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export interface QuoteDraft {
  id: string;
  enquiryId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  postcode: string;
  serviceName: string;
  scopeOfWork: string;
  priceGbp: string;
  notes: string;
  draftDate: string;
  updatedAt: string;
}

export interface FollowUpTask {
  id: string;
  enquiryId: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  postcode: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
  messageDraft: string;
  createdAt: string;
  completedAt?: string;
}

export interface CleaningEnquiry {
  id: string;
  reference: string;
  createdAt: string;
  submissionDate: string;
  serviceId: ServiceId;
  serviceName: string;
  postcode: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  approxSize: string;
  frequency: string;
  priorityAreas: string[];
  additionalRequirements: string;
  // Contextual service fields
  workspaceDetails?: string;
  linenRequired?: string;
  turnoverWindow?: string;
  maintenanceType?: string;
  // Schedule & access
  preferredDate: string;
  preferredTimeWindow: string;
  urgency: string;
  accessInstructions: string;
  photos: PhotoMetadata[];
  // Contact
  fullName: string;
  phone: string;
  email: string;
  preferredContactMethod: string;
  message: string;
  // Operations
  status: EnquiryStatus;
  internalNotes: InternalNote[];
  history: ActivityItem[];
  quoteDraft?: QuoteDraft;
  isSeedDemo?: boolean;
}

export interface QuoteWizardFormData {
  serviceId: ServiceId | '';
  postcode: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  approxSize: string;
  frequency: string;
  priorityAreas: string[];
  additionalRequirements: string;
  workspaceDetails: string;
  linenRequired: string;
  turnoverWindow: string;
  maintenanceType: string;
  preferredDate: string;
  preferredTimeWindow: string;
  urgency: string;
  accessInstructions: string;
  photos: PhotoMetadata[];
  fullName: string;
  phone: string;
  email: string;
  preferredContactMethod: string;
  message: string;
}

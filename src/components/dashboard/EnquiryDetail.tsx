import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BellPlus,
  Calendar,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  Send,
  X,
} from 'lucide-react';
import { BUSINESS_INFO } from '../../data/services';
import { CleaningEnquiry, ENQUIRY_STATUSES, EnquiryStatus } from '../../types/cleaning';
import {
  buildWhatsAppLink,
  formatUkDate,
  formatUkTimestamp,
  getStatusStyles,
} from '../../utils/enquiryStorage';

interface EnquiryDetailProps {
  enquiry: CleaningEnquiry;
  onClose: () => void;
  onUpdateStatus: (enquiryId: string, newStatus: EnquiryStatus) => void;
  onAddNote: (enquiryId: string, noteText: string) => void;
  onOpenQuoteDraft: (enquiryId: string) => void;
  onCreateFollowUp: (enquiry: CleaningEnquiry, title: string) => void;
}

export const EnquiryDetail: React.FC<EnquiryDetailProps> = ({
  enquiry,
  onClose,
  onUpdateStatus,
  onAddNote,
  onOpenQuoteDraft,
  onCreateFollowUp,
}) => {
  const [noteInput, setNoteInput] = useState('');
  const [followUpFeedback, setFollowUpFeedback] = useState('');
  const statusStyle = getStatusStyles(enquiry.status);

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote(enquiry.id, noteInput.trim());
    setNoteInput('');
  };

  const staffWhatsAppHref = buildWhatsAppLink(
    `Hello ${enquiry.fullName}, this is ${BUSINESS_INFO.name} regarding your ${enquiry.serviceName} enquiry in ${enquiry.postcode} (Ref: ${enquiry.reference}).`
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end no-print" role="dialog" aria-modal="true" aria-label={`Enquiry details for ${enquiry.fullName}`}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Slide-Over Drawer */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl bg-[#090A0B] border-l border-white/[0.11] h-full flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.09] bg-[#141414] flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#AFA7A0] mb-1">
              <span className="font-mono text-[#D78661] tabular-nums">{enquiry.reference}</span>
              <span aria-hidden="true">·</span>
              <span>Submitted {enquiry.submissionDate}</span>
              {enquiry.isSeedDemo && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Demo Seed</span>
                </>
              )}
            </div>
            <h3 className="font-display text-xl font-semibold text-[#F4EFE8]">
              {enquiry.fullName}
            </h3>
            <p className="text-sm text-[#D8D0C7] mt-0.5">
              {enquiry.serviceName} · <span className="font-mono">{enquiry.postcode}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span
              className={`px-2.5 py-1 rounded text-xs font-medium border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
            >
              {enquiry.status}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close enquiry drawer"
              className="p-2 rounded-md border border-white/[0.12] bg-[#090A0B] text-[#AFA7A0] hover:text-[#F4EFE8] hover:border-white/30 cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Action Strip */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-white/[0.09] bg-[#141414]/60 flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <label htmlFor="drawer-status-select" className="text-xs text-[#AFA7A0]">
              Stage:
            </label>
            <select
              id="drawer-status-select"
              value={enquiry.status}
              onChange={(e) => onUpdateStatus(enquiry.id, e.target.value as EnquiryStatus)}
              className="px-3 py-1.5 rounded bg-[#090A0B] border border-white/[0.14] text-xs font-medium text-[#F4EFE8] focus:outline-none focus:border-[#D78661]"
            >
              {ENQUIRY_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => onOpenQuoteDraft(enquiry.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#B66343] hover:bg-[#D78661] text-xs font-medium text-[#F4EFE8] transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            {enquiry.quoteDraft ? 'Edit Quote' : 'Draft Quote'}
          </button>

          <a
            href={staffWhatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#1D1C1A] hover:bg-[#2A2825] border border-white/[0.12] text-xs font-medium text-[#F4EFE8] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#D78661]" aria-hidden="true" />
            WhatsApp
            <ExternalLink className="w-3 h-3 opacity-75" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => {
              onCreateFollowUp(enquiry, 'Follow up on quotation');
              setFollowUpFeedback('Added to Follow-ups');
              setTimeout(() => setFollowUpFeedback(''), 3000);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#1D1C1A] hover:bg-[#2A2825] border border-white/[0.12] text-xs font-medium text-[#D8D0C7] hover:text-[#F4EFE8] transition-colors cursor-pointer"
          >
            <BellPlus className="w-3.5 h-3.5 text-[#D78661]" aria-hidden="true" />
            Follow-up
          </button>

          {followUpFeedback && (
            <span className="text-xs text-[#8FD1A6] font-medium">{followUpFeedback}</span>
          )}
        </div>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Customer & Schedule */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#D78661] mb-3">
              Customer &amp; Requested Schedule
            </h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-[#141414] border border-white/[0.08] rounded-lg p-4">
              <div>
                <dt className="text-xs text-[#AFA7A0]">Telephone / WhatsApp</dt>
                <dd className="font-mono text-[#F4EFE8] mt-0.5">{enquiry.phone}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#AFA7A0]">Email</dt>
                <dd className="text-[#F4EFE8] mt-0.5 break-all">{enquiry.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#AFA7A0]">Preferred Contact</dt>
                <dd className="text-[#F4EFE8] mt-0.5">{enquiry.preferredContactMethod}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#AFA7A0]">Preferred Window</dt>
                <dd className="text-[#F4EFE8] mt-0.5 flex items-center gap-1.5 tabular-nums">
                  <Calendar className="w-3.5 h-3.5 text-[#D78661]" aria-hidden="true" />
                  {formatUkDate(enquiry.preferredDate)} · {enquiry.preferredTimeWindow}
                </dd>
              </div>
            </dl>
          </div>

          {/* Property Details */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#D78661] mb-3">
              Property &amp; Scope Details
            </h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-[#141414] border border-white/[0.08] rounded-lg p-4">
              <div>
                <dt className="text-xs text-[#AFA7A0]">Property Type</dt>
                <dd className="text-[#F4EFE8] mt-0.5">{enquiry.propertyType}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#AFA7A0]">Rooms &amp; Size</dt>
                <dd className="text-[#F4EFE8] mt-0.5">
                  {enquiry.bedrooms !== 'N/A' ? `${enquiry.bedrooms} bed · ` : ''}
                  {enquiry.bathrooms} bath/WC
                  {enquiry.approxSize ? ` · ${enquiry.approxSize}` : ''}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#AFA7A0]">Frequency</dt>
                <dd className="text-[#F4EFE8] mt-0.5">{enquiry.frequency}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#AFA7A0]">Urgency</dt>
                <dd className="text-[#F4EFE8] mt-0.5">{enquiry.urgency}</dd>
              </div>

              {enquiry.workspaceDetails && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-[#AFA7A0]">Workspace Details</dt>
                  <dd className="text-[#D8D0C7] mt-0.5">{enquiry.workspaceDetails}</dd>
                </div>
              )}

              {(enquiry.linenRequired || enquiry.turnoverWindow) && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-[#AFA7A0]">Airbnb Turnover &amp; Linen</dt>
                  <dd className="text-[#D8D0C7] mt-0.5">
                    {[enquiry.linenRequired, enquiry.turnoverWindow].filter(Boolean).join(' · ')}
                  </dd>
                </div>
              )}

              {enquiry.maintenanceType && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-[#AFA7A0]">Maintenance Scope</dt>
                  <dd className="text-[#D8D0C7] mt-0.5">{enquiry.maintenanceType}</dd>
                </div>
              )}

              {enquiry.priorityAreas.length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-[#AFA7A0]">Priority Areas</dt>
                  <dd className="text-[#D8D0C7] mt-0.5">{enquiry.priorityAreas.join(' · ')}</dd>
                </div>
              )}

              {enquiry.accessInstructions && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-[#AFA7A0]">Access Instructions</dt>
                  <dd className="text-[#D8D0C7] mt-0.5">{enquiry.accessInstructions}</dd>
                </div>
              )}

              {(enquiry.additionalRequirements || enquiry.message) && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-[#AFA7A0]">Customer Notes</dt>
                  <dd className="text-[#D8D0C7] mt-0.5 whitespace-pre-line">
                    {[enquiry.additionalRequirements, enquiry.message].filter(Boolean).join('\n')}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Quote Status Summary */}
          {enquiry.quoteDraft && (
            <div className="p-4 rounded-lg bg-[#141414] border border-[#B66343]/35 flex items-center justify-between gap-4">
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-[#D78661]">
                  Saved Quote Draft
                </span>
                <p className="text-sm font-medium text-[#F4EFE8] mt-0.5">
                  {enquiry.quoteDraft.priceGbp
                    ? `£${enquiry.quoteDraft.priceGbp} (Manual Estimate)`
                    : 'Scope drafted — Price TBC'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenQuoteDraft(enquiry.id)}
                className="px-3.5 py-2 rounded bg-[#1D1C1A] hover:bg-[#B66343] border border-white/[0.12] text-xs font-medium text-[#F4EFE8] transition-colors cursor-pointer"
              >
                Open Quotation
              </button>
            </div>
          )}

          {/* Photo Metadata */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#D78661] mb-3">
              Photos Noted ({enquiry.photos.length})
            </h4>
            {enquiry.photos.length === 0 ? (
              <p className="text-xs text-[#AFA7A0] bg-[#141414] border border-white/[0.08] rounded-lg p-4">
                No photographs were attached to this enquiry.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enquiry.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#141414] border border-white/[0.09]"
                  >
                    <div className="w-10 h-10 rounded bg-[#1D1C1A] flex items-center justify-center shrink-0">
                      <ImageIcon className="w-4 h-4 text-[#AFA7A0]" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#F4EFE8] truncate">{photo.name}</p>
                      <p className="text-[11px] font-mono text-[#AFA7A0] tabular-nums">
                        {Math.round(photo.sizeBytes / 1024)} KB · Local metadata
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Internal Staff Notes */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#D78661] mb-3">
              Internal Staff Notes
            </h4>
            <form onSubmit={handleNoteSubmit} className="mb-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add internal review note..."
                  aria-label="Add internal review note"
                  className="flex-1 px-3.5 py-2.5 rounded-md bg-[#141414] border border-white/[0.12] text-xs text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 focus:outline-none focus:border-[#D78661]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-[#1D1C1A] hover:bg-[#B66343] border border-white/[0.12] text-xs font-medium text-[#F4EFE8] transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  Save
                </button>
              </div>
            </form>

            {enquiry.internalNotes.length === 0 ? (
              <p className="text-xs text-[#AFA7A0] bg-[#141414] border border-white/[0.08] rounded-lg p-4">
                No internal notes recorded yet.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {enquiry.internalNotes.map((note) => (
                  <li
                    key={note.id}
                    className="p-3.5 rounded-lg bg-[#141414] border border-white/[0.08] text-xs"
                  >
                    <p className="text-[#F4EFE8] leading-relaxed mb-1.5">{note.text}</p>
                    <span className="text-[11px] text-[#AFA7A0] font-mono tabular-nums">
                      {note.author} · {formatUkTimestamp(note.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Activity History */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#D78661] mb-3">
              Activity History
            </h4>
            <ol className="space-y-3 bg-[#141414] border border-white/[0.08] rounded-lg p-4">
              {enquiry.history.map((item) => (
                <li
                  key={item.id}
                  className="pb-3 last:pb-0 border-b last:border-b-0 border-white/[0.07] text-xs"
                >
                  <p className="text-[#D8D0C7]">{item.summary}</p>
                  <span className="block text-[11px] text-[#AFA7A0] font-mono tabular-nums mt-1">
                    {item.actor} · {formatUkTimestamp(item.timestamp)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.aside>
    </div>
  );
};

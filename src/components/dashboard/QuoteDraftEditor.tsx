import React, { useEffect, useState } from 'react';
import { Check, Info, Printer, Save } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/services';
import { CleaningEnquiry, QuoteDraft } from '../../types/cleaning';
import { createEmptyDraft, formatUkDate } from '../../utils/enquiryStorage';

interface QuoteDraftEditorProps {
  enquiries: CleaningEnquiry[];
  activeEnquiryId: string | null;
  onSelectEnquiry: (enquiryId: string) => void;
  onSaveDraft: (enquiryId: string, draft: QuoteDraft, markPrepared: boolean) => void;
}

export const QuoteDraftEditor: React.FC<QuoteDraftEditorProps> = ({
  enquiries,
  activeEnquiryId,
  onSelectEnquiry,
  onSaveDraft,
}) => {
  const selectedEnquiry =
    enquiries.find((e) => e.id === activeEnquiryId) || enquiries[0] || null;

  const [draft, setDraft] = useState<QuoteDraft | null>(() =>
    selectedEnquiry ? createEmptyDraft(selectedEnquiry) : null
  );
  const [markPrepared, setMarkPrepared] = useState<boolean>(true);
  const [savedToast, setSavedToast] = useState<string>('');

  useEffect(() => {
    if (selectedEnquiry) {
      setDraft(createEmptyDraft(selectedEnquiry));
      setSavedToast('');
    } else {
      setDraft(null);
    }
  }, [selectedEnquiry?.id]);

  if (!selectedEnquiry || !draft) {
    return (
      <div className="p-12 rounded-lg bg-[#141414] border border-white/[0.09] text-center">
        <p className="font-display text-base font-medium text-[#F4EFE8] mb-1">
          No enquiries available
        </p>
        <p className="text-xs text-[#AFA7A0]">
          Submit a quote request first to prepare an editable quotation draft.
        </p>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: QuoteDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
      draftDate: formatUkDate(new Date().toISOString()),
    };
    setDraft(updated);
    onSaveDraft(selectedEnquiry.id, updated, markPrepared);
    setSavedToast('Quotation draft saved locally.');
    setTimeout(() => setSavedToast(''), 3500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* LEFT: Quotation Details Editor */}
      <form
        onSubmit={handleSave}
        className="xl:col-span-6 bg-[#141414] border border-white/[0.09] rounded-lg p-5 sm:p-7 space-y-5 no-print"
      >
        <div className="pb-5 border-b border-white/[0.09]">
          <label
            htmlFor="qd-enquiry-picker"
            className="block text-xs font-medium text-[#AFA7A0] mb-2"
          >
            Active Enquiry Record
          </label>
          <select
            id="qd-enquiry-picker"
            value={selectedEnquiry.id}
            onChange={(e) => onSelectEnquiry(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] focus:outline-none focus:border-[#D78661]"
          >
            {enquiries.map((enq) => (
              <option key={enq.id} value={enq.id}>
                {enq.reference} — {enq.fullName} ({enq.serviceName})
                {enq.quoteDraft ? ' [Draft]' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="qd-scope" className="block text-xs font-medium text-[#D8D0C7] mb-2">
            Proposed Scope of Work
          </label>
          <textarea
            id="qd-scope"
            rows={6}
            value={draft.scopeOfWork}
            onChange={(e) => setDraft({ ...draft, scopeOfWork: e.target.value })}
            className="w-full px-4 py-3 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] leading-relaxed focus:outline-none focus:border-[#D78661]"
          />
        </div>

        <div>
          <label htmlFor="qd-price" className="block text-xs font-medium text-[#D8D0C7] mb-2">
            Manual Quoted Price in GBP (optional)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-[#AFA7A0]">
              £
            </span>
            <input
              id="qd-price"
              type="text"
              inputMode="decimal"
              value={draft.priceGbp}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^\d.]/g, '');
                setDraft({ ...draft, priceGbp: cleaned });
              }}
              placeholder="Leave blank if TBC upon inspection"
              className="w-full pl-8 pr-4 py-3 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm font-mono text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 tabular-nums focus:outline-none focus:border-[#D78661]"
            />
          </div>
          <p className="mt-1.5 text-[11px] text-[#AFA7A0]">
            No automatic prices are invented; staff enter figures manually after review.
          </p>
        </div>

        <div>
          <label htmlFor="qd-notes" className="block text-xs font-medium text-[#D8D0C7] mb-2">
            Quotation Notes / Terms
          </label>
          <textarea
            id="qd-notes"
            rows={3}
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            placeholder="e.g. Subject to parking access and unfurnished condition at arrival."
            className="w-full px-4 py-3 rounded-md bg-[#090A0B] border border-white/[0.12] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/50 focus:outline-none focus:border-[#D78661]"
          />
        </div>

        <div className="p-3.5 rounded-md bg-[#090A0B] border border-white/[0.08] flex items-start gap-2.5 text-xs text-[#AFA7A0]">
          <Info className="w-4 h-4 text-[#D78661] shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            Saving stores this draft locally in your browser only and does not automatically email
            or send it to the customer.
          </span>
        </div>

        <label className="flex items-center gap-2.5 text-xs text-[#D8D0C7] cursor-pointer">
          <input
            type="checkbox"
            checked={markPrepared}
            onChange={(e) => setMarkPrepared(e.target.checked)}
            className="accent-[#B66343] w-4 h-4 rounded"
          />
          <span>Set enquiry status to &ldquo;Quote Prepared&rdquo; on save</span>
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.09]">
          <div>
            {savedToast && (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#8FD1A6] font-medium">
                <Check className="w-4 h-4" aria-hidden="true" />
                {savedToast}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#B66343] hover:bg-[#D78661] text-sm font-medium text-[#F4EFE8] transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            Save Draft
          </button>
        </div>
      </form>

      {/* RIGHT: Live Printable Document Preview */}
      <div className="xl:col-span-6 space-y-3">
        <div className="flex items-center justify-between gap-4 no-print">
          <span className="text-xs font-medium uppercase tracking-wider text-[#AFA7A0]">
            Live Document Preview (Unsent Draft)
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#141414] hover:bg-[#1D1C1A] border border-white/[0.12] text-xs font-medium text-[#F4EFE8] transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#D78661]" aria-hidden="true" />
            Print / Save PDF
          </button>
        </div>

        {/* Clean Formatted Document Sheet */}
        <div className="bg-[#F4EFE8] text-[#141414] rounded-lg p-6 sm:p-9 border border-white/10 shadow-xl print-only-sheet">
          <div className="flex flex-wrap justify-between gap-4 pb-6 border-b border-neutral-300 mb-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#090A0B]">
                {BUSINESS_INFO.name}
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                {BUSINESS_INFO.coverage} · {BUSINESS_INFO.quoteEmail} ·{' '}
                {BUSINESS_INFO.phoneDisplay}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">
                Quotation Draft
              </p>
              <p className="font-mono text-sm font-semibold text-[#090A0B] tabular-nums">
                {selectedEnquiry.reference}
              </p>
              <p className="text-xs text-neutral-600 tabular-nums">{draft.draftDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                Prepared For
              </p>
              <p className="font-semibold text-[#090A0B]">{draft.customerName}</p>
              <p className="text-neutral-700 text-xs mt-0.5 break-all">{draft.customerEmail}</p>
              <p className="font-mono text-xs text-neutral-700 mt-0.5">{draft.customerPhone}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                Property &amp; Service
              </p>
              <p className="font-semibold text-[#090A0B]">{draft.serviceName}</p>
              <p className="font-mono text-xs text-neutral-700 mt-0.5">{draft.postcode}</p>
              <p className="text-xs text-neutral-600 tabular-nums mt-0.5">
                Requested: {formatUkDate(selectedEnquiry.preferredDate)}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-2">
              Proposed Scope of Work
            </p>
            <div className="p-4 rounded border border-neutral-300/80 bg-white/70 text-xs sm:text-sm whitespace-pre-line leading-relaxed text-neutral-800">
              {draft.scopeOfWork}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded border border-neutral-300 bg-white/80 mb-6">
            <span className="text-xs sm:text-sm font-medium text-neutral-700">
              Estimated Quotation (GBP)
            </span>
            <span className="font-mono text-xl font-bold text-[#090A0B] tabular-nums">
              {draft.priceGbp ? `£${draft.priceGbp}` : 'To be confirmed'}
            </span>
          </div>

          {draft.notes && (
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                Additional Notes &amp; Conditions
              </p>
              <p className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed">
                {draft.notes}
              </p>
            </div>
          )}

          <p className="text-[11px] text-neutral-500 border-t border-neutral-300 pt-4 leading-relaxed">
            Draft quotation generated inside the {BUSINESS_INFO.name} operations demo. Final
            appointment confirmation requires direct agreement with our team.
          </p>
        </div>
      </div>
    </div>
  );
};

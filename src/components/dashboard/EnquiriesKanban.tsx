import React, { useState } from 'react';
import { Calendar, Eye } from 'lucide-react';
import { CleaningEnquiry, ENQUIRY_STATUSES, EnquiryStatus } from '../../types/cleaning';
import { formatUkDate, getStatusStyles } from '../../utils/enquiryStorage';

interface EnquiriesKanbanProps {
  enquiries: CleaningEnquiry[];
  selectedEnquiryId: string | null;
  onSelectEnquiry: (enquiry: CleaningEnquiry) => void;
  onMoveStatus: (enquiryId: string, newStatus: EnquiryStatus) => void;
}

export const EnquiriesKanban: React.FC<EnquiriesKanbanProps> = ({
  enquiries,
  selectedEnquiryId,
  onSelectEnquiry,
  onMoveStatus,
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<EnquiryStatus | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
      {ENQUIRY_STATUSES.map((statusCol) => {
        const items = enquiries.filter((e) => e.status === statusCol);
        const statusStyle = getStatusStyles(statusCol);
        const isDropTarget = dragOverCol === statusCol;

        return (
          <div
            key={statusCol}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragOverCol !== statusCol) setDragOverCol(statusCol);
            }}
            onDragLeave={() => {
              if (dragOverCol === statusCol) setDragOverCol(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverCol(null);
              if (draggedId) {
                onMoveStatus(draggedId, statusCol);
                setDraggedId(null);
              }
            }}
            className={`flex flex-col rounded-lg bg-[#141414] border transition-colors min-h-[260px] ${
              isDropTarget ? 'border-[#D78661] bg-[#1D1C1A]' : 'border-white/[0.09]'
            }`}
          >
            {/* Column Header */}
            <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between gap-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
              >
                {statusCol}
              </span>
              <span className="font-mono text-xs text-[#AFA7A0] tabular-nums">
                {items.length}
              </span>
            </div>

            {/* Cards */}
            <div className="p-3 space-y-2.5 flex-1">
              {items.length === 0 ? (
                <div className="h-24 flex items-center justify-center border border-dashed border-white/[0.07] rounded text-[11px] text-[#AFA7A0]/70">
                  No enquiries
                </div>
              ) : (
                items.map((enq) => {
                  const isSelected = selectedEnquiryId === enq.id;
                  return (
                    <div
                      key={enq.id}
                      draggable
                      onDragStart={() => setDraggedId(enq.id)}
                      onDragEnd={() => {
                        setDraggedId(null);
                        setDragOverCol(null);
                      }}
                      className={`p-3.5 rounded-md bg-[#090A0B] border transition-colors ${
                        isSelected
                          ? 'border-[#D78661]'
                          : 'border-white/[0.09] hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-[11px] text-[#D78661] tabular-nums">
                          {enq.reference}
                        </span>
                        <span className="font-mono text-[11px] text-[#AFA7A0]">
                          {enq.postcode}
                        </span>
                      </div>

                      <h4 className="font-medium text-xs text-[#F4EFE8] truncate mb-0.5">
                        {enq.fullName}
                      </h4>
                      <p className="text-[11px] text-[#AFA7A0] truncate mb-3">
                        {enq.serviceName}
                      </p>

                      <div className="flex items-center justify-between gap-2 text-[11px] text-[#AFA7A0] pb-2.5 mb-2.5 border-b border-white/[0.07]">
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Calendar className="w-3 h-3 text-[#B66343]" aria-hidden="true" />
                          {formatUkDate(enq.preferredDate)}
                        </span>
                        {enq.quoteDraft && (
                          <span className="font-mono text-[#8FD1A6]">
                            {enq.quoteDraft.priceGbp ? `£${enq.quoteDraft.priceGbp}` : 'Draft'}
                          </span>
                        )}
                      </div>

                      {/* Accessible Status Switcher + Inspect */}
                      <div className="flex items-center justify-between gap-2">
                        <select
                          aria-label={`Change stage for ${enq.fullName}`}
                          value={enq.status}
                          onChange={(e) =>
                            onMoveStatus(enq.id, e.target.value as EnquiryStatus)
                          }
                          className="flex-1 min-w-0 px-2 py-1 rounded bg-[#141414] border border-white/[0.1] text-[11px] text-[#D8D0C7] focus:outline-none focus:border-[#D78661]"
                        >
                          {ENQUIRY_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => onSelectEnquiry(enq)}
                          aria-label={`Inspect ${enq.fullName}`}
                          className="p-1.5 rounded bg-[#141414] hover:bg-[#B66343] border border-white/[0.1] text-[#F4EFE8] transition-colors cursor-pointer shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

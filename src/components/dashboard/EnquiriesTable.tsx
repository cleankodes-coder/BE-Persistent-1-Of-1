import React, { useMemo, useState } from 'react';
import { ArrowUpDown, Eye, Search } from 'lucide-react';
import { SERVICES } from '../../data/services';
import { CleaningEnquiry, ENQUIRY_STATUSES, EnquiryStatus } from '../../types/cleaning';
import { formatUkDate, getStatusStyles } from '../../utils/enquiryStorage';

type SortField = 'createdAt' | 'preferredDate' | 'fullName' | 'status';

interface EnquiriesTableProps {
  enquiries: CleaningEnquiry[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (s: string) => void;
  statusFilter: string;
  onStatusFilterChange: (st: string) => void;
  selectedEnquiryId: string | null;
  onSelectEnquiry: (enquiry: CleaningEnquiry) => void;
  hideToolbar?: boolean;
}

export const EnquiriesTable: React.FC<EnquiriesTableProps> = ({
  enquiries,
  searchQuery,
  onSearchChange,
  serviceFilter,
  onServiceFilterChange,
  statusFilter,
  onStatusFilterChange,
  selectedEnquiryId,
  onSelectEnquiry,
  hideToolbar = false,
}) => {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(field === 'fullName');
    }
  };

  const filteredAndSorted = useMemo(() => {
    const filtered = enquiries.filter((enq) => {
      const matchesService = serviceFilter === 'ALL' || enq.serviceId === serviceFilter;
      const matchesStatus = statusFilter === 'ALL' || enq.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        enq.reference.toLowerCase().includes(q) ||
        enq.fullName.toLowerCase().includes(q) ||
        enq.postcode.toLowerCase().includes(q) ||
        enq.email.toLowerCase().includes(q) ||
        enq.serviceName.toLowerCase().includes(q);
      return matchesService && matchesStatus && matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      const cmp = valA.localeCompare(valB);
      return sortAsc ? cmp : -cmp;
    });
  }, [enquiries, serviceFilter, statusFilter, searchQuery, sortField, sortAsc]);

  return (
    <div className="bg-[#141414] border border-white/[0.09] rounded-lg overflow-hidden">
      {!hideToolbar && (
        <div className="p-4 sm:p-5 border-b border-white/[0.09] flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-[#AFA7A0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="dashboard-enquiry-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search reference, name, postcode, email..."
              aria-label="Search enquiries"
              className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#090A0B] border border-white/[0.11] text-sm text-[#F4EFE8] placeholder:text-[#AFA7A0]/55 focus:outline-none focus:border-[#D78661]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={serviceFilter}
              onChange={(e) => onServiceFilterChange(e.target.value)}
              aria-label="Filter by service"
              className="px-3.5 py-2.5 rounded-md bg-[#090A0B] border border-white/[0.11] text-xs sm:text-sm text-[#F4EFE8] focus:outline-none focus:border-[#D78661]"
            >
              <option value="ALL">All Services</option>
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              aria-label="Filter by status"
              className="px-3.5 py-2.5 rounded-md bg-[#090A0B] border border-white/[0.11] text-xs sm:text-sm text-[#F4EFE8] focus:outline-none focus:border-[#D78661]"
            >
              <option value="ALL">All Statuses</option>
              {ENQUIRY_STATUSES.map((st: EnquiryStatus) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {filteredAndSorted.length === 0 ? (
        <div className="p-12 text-center">
          <p className="font-display text-base font-medium text-[#F4EFE8] mb-1">
            No matching enquiries found
          </p>
          <p className="text-xs text-[#AFA7A0]">
            Adjust your search filter or submit a new enquiry on the public quote studio.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Structured Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.09] text-[11px] font-medium uppercase tracking-wider text-[#AFA7A0] bg-[#090A0B]/60">
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => toggleSort('fullName')}
                      className="inline-flex items-center gap-1 hover:text-[#F4EFE8] cursor-pointer"
                    >
                      Customer
                      <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Postcode</th>
                  <th className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => toggleSort('preferredDate')}
                      className="inline-flex items-center gap-1 hover:text-[#F4EFE8] cursor-pointer"
                    >
                      Requested
                      <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => toggleSort('createdAt')}
                      className="inline-flex items-center gap-1 hover:text-[#F4EFE8] cursor-pointer"
                    >
                      Submitted
                      <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => toggleSort('status')}
                      className="inline-flex items-center gap-1 hover:text-[#F4EFE8] cursor-pointer"
                    >
                      Status
                      <ArrowUpDown className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07] text-sm">
                {filteredAndSorted.map((enq) => {
                  const statusStyle = getStatusStyles(enq.status);
                  const isSelected = selectedEnquiryId === enq.id;
                  return (
                    <tr
                      key={enq.id}
                      onClick={() => onSelectEnquiry(enq)}
                      className={`transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#B66343]/14' : 'hover:bg-[#1D1C1A]/80'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono text-xs text-[#F4EFE8] tabular-nums whitespace-nowrap">
                        {enq.reference}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#F4EFE8] truncate max-w-[190px]">
                          {enq.fullName}
                        </div>
                        <div className="text-xs text-[#AFA7A0] truncate max-w-[190px]">
                          {enq.phone}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#D8D0C7] whitespace-nowrap">
                        {enq.serviceName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#D8D0C7] whitespace-nowrap">
                        {enq.postcode}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#D8D0C7] tabular-nums whitespace-nowrap">
                        {formatUkDate(enq.preferredDate)}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#AFA7A0] tabular-nums whitespace-nowrap">
                        {enq.submissionDate}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded text-xs font-medium border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEnquiry(enq);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1D1C1A] hover:bg-[#B66343] border border-white/[0.1] text-xs font-medium text-[#F4EFE8] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Readable Cards (Zero Horizontal Overflow) */}
          <div className="md:hidden divide-y divide-white/[0.08]">
            {filteredAndSorted.map((enq) => {
              const statusStyle = getStatusStyles(enq.status);
              return (
                <div
                  key={enq.id}
                  onClick={() => onSelectEnquiry(enq)}
                  className="p-4 hover:bg-[#1D1C1A]/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="font-mono text-xs text-[#D78661] tabular-nums block">
                        {enq.reference} · {enq.postcode}
                      </span>
                      <h4 className="font-medium text-sm text-[#F4EFE8] mt-0.5">
                        {enq.fullName}
                      </h4>
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border shrink-0 ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#D8D0C7] mb-2">{enq.serviceName}</p>
                  <div className="flex items-center justify-between text-xs text-[#AFA7A0]">
                    <span className="tabular-nums">
                      Requested: {formatUkDate(enq.preferredDate)}
                    </span>
                    <span className="text-[#D78661] font-medium">Inspect →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  Bell,
  Clock,
  FileCheck2,
  FileText,
  Inbox,
  Layers,
} from 'lucide-react';
import { SERVICES } from '../../data/services';
import { CleaningEnquiry, FollowUpTask } from '../../types/cleaning';
import { formatUkTimestamp } from '../../utils/enquiryStorage';

interface DashboardOverviewProps {
  enquiries: CleaningEnquiry[];
  followUps: FollowUpTask[];
  onJumpToNewEnquiries: () => void;
  onJumpToQuotations: (enquiryId?: string) => void;
  onJumpToFollowUps: () => void;
  onInspectEnquiry: (enquiry: CleaningEnquiry) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  enquiries,
  followUps,
  onJumpToNewEnquiries,
  onJumpToQuotations,
  onJumpToFollowUps,
  onInspectEnquiry,
}) => {
  const totalEnquiries = enquiries.length;
  const newRequestsCount = enquiries.filter((e) => e.status === 'New').length;
  const awaitingQuotesCount = enquiries.filter(
    (e) => e.status === 'New' || e.status === 'Under Review'
  ).length;
  const quotesPreparedCount = enquiries.filter(
    (e) => e.status === 'Quote Prepared' || Boolean(e.quoteDraft)
  ).length;
  const followUpsDueCount = followUps.filter((t) => t.status === 'Pending').length;

  const firstUnquotedEnquiry = enquiries.find(
    (e) => !e.quoteDraft && (e.status === 'New' || e.status === 'Under Review')
  );

  // Real enquiry counts grouped by submission date (sorted chronologically)
  const activityByDate = useMemo(() => {
    const map = new Map<string, { label: string; isoKey: string; count: number }>();
    enquiries.forEach((enq) => {
      const isoKey = enq.createdAt.slice(0, 10);
      const existing = map.get(isoKey);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(isoKey, {
          isoKey,
          label: enq.submissionDate.replace(/\s\d{4}$/, ''),
          count: 1,
        });
      }
    });
    return Array.from(map.values())
      .sort((a, b) => a.isoKey.localeCompare(b.isoKey))
      .slice(-7);
  }, [enquiries]);

  const maxDailyCount = Math.max(1, ...activityByDate.map((d) => d.count));

  // Real service breakdown across all stored enquiries
  const serviceBreakdown = useMemo(() => {
    return SERVICES.map((svc) => {
      const count = enquiries.filter((e) => e.serviceId === svc.id).length;
      return {
        id: svc.id,
        name: svc.name,
        shortLabel: svc.shortLabel,
        count,
        pct: totalEnquiries > 0 ? Math.round((count / totalEnquiries) * 100) : 0,
      };
    }).sort((a, b) => b.count - a.count);
  }, [enquiries, totalEnquiries]);

  // Real recent activity stream aggregated from enquiry history
  const recentActivity = useMemo(() => {
    const items = enquiries.flatMap((enq) =>
      enq.history.map((h) => ({
        ...h,
        reference: enq.reference,
        customerName: enq.fullName,
        enquiry: enq,
      }))
    );
    return items
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 6);
  }, [enquiries]);

  const kpis = [
    {
      label: 'Total Enquiries',
      value: totalEnquiries,
      icon: Layers,
      accent: false,
      detail: 'Stored in local browser demo',
    },
    {
      label: 'New Requests',
      value: newRequestsCount,
      icon: Inbox,
      accent: true,
      detail: 'Awaiting initial triage',
    },
    {
      label: 'Awaiting Quotes',
      value: awaitingQuotesCount,
      icon: Clock,
      accent: false,
      detail: 'New or under review',
    },
    {
      label: 'Quotes Prepared',
      value: quotesPreparedCount,
      icon: FileCheck2,
      accent: false,
      detail: 'Drafted or marked prepared',
    },
    {
      label: 'Follow-ups Due',
      value: followUpsDueCount,
      icon: Bell,
      accent: true,
      detail: 'Pending customer reminders',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Operations Hero Heading */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-white/[0.09]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#D78661] mb-2">
            Operations Console
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#F4EFE8]">
            Your Operations, At a Glance.
          </h2>
          <p className="text-sm text-[#AFA7A0] mt-1">
            Manage cleaning enquiries, quotations and customer follow-ups from one place.
          </p>
        </div>

        {/* Action Centre Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onJumpToNewEnquiries}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#141414] hover:bg-[#1D1C1A] border border-white/[0.1] text-xs font-medium text-[#F4EFE8] transition-colors cursor-pointer"
          >
            <span>Review New ({newRequestsCount})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D78661]" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onJumpToQuotations(firstUnquotedEnquiry?.id)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#B66343] hover:bg-[#D78661] text-xs font-medium text-[#F4EFE8] transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Prepare Quote</span>
          </button>

          <button
            type="button"
            onClick={onJumpToFollowUps}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#141414] hover:bg-[#1D1C1A] border border-white/[0.1] text-xs font-medium text-[#F4EFE8] transition-colors cursor-pointer"
          >
            <span>Follow-ups ({followUpsDueCount})</span>
          </button>
        </div>
      </div>

      {/* 5 Live-Computed KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className="group bg-[#141414] border border-white/[0.09] hover:border-[#B66343]/45 rounded-lg p-5 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-medium text-[#AFA7A0]">{kpi.label}</span>
                <Icon
                  className={`w-4 h-4 ${
                    kpi.accent ? 'text-[#D78661]' : 'text-[#AFA7A0]'
                  }`}
                  aria-hidden="true"
                />
              </div>
              <div
                className={`font-mono text-3xl font-medium tabular-nums mb-1.5 ${
                  kpi.accent ? 'text-[#D78661]' : 'text-[#F4EFE8]'
                }`}
              >
                {kpi.value}
              </div>
              <p className="text-[11px] text-[#AFA7A0]/80">{kpi.detail}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Row: Enquiry Activity Chart + Service Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiry Activity Over Time */}
        <div className="lg:col-span-7 bg-[#141414] border border-white/[0.09] rounded-lg p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display text-base font-semibold text-[#F4EFE8]">
                Enquiry Activity by Date
              </h3>
              <p className="text-xs text-[#AFA7A0] mt-0.5">
                Calculated directly from stored enquiry submission dates
              </p>
            </div>
            <span className="font-mono text-xs text-[#AFA7A0] tabular-nums">
              {totalEnquiries} total
            </span>
          </div>

          {activityByDate.length === 0 ? (
            <div className="h-[210px] flex flex-col items-center justify-center border border-dashed border-white/[0.09] rounded-md text-center px-4">
              <p className="text-sm font-medium text-[#F4EFE8] mb-1">
                No enquiry records to plot yet
              </p>
              <p className="text-xs text-[#AFA7A0]">
                Submit a request via the quotation wizard to see activity appear here.
              </p>
            </div>
          ) : (
            <div className="h-[210px] flex items-end gap-3 sm:gap-5 pt-6 pb-2 px-2 border-t border-white/[0.06]">
              {activityByDate.map((day, idx) => {
                const heightPct = Math.max(12, Math.round((day.count / maxDailyCount) * 100));
                return (
                  <div
                    key={day.isoKey}
                    className="flex-1 flex flex-col items-center justify-end h-full min-w-0"
                  >
                    <span className="font-mono text-xs text-[#F4EFE8] tabular-nums mb-2">
                      {day.count}
                    </span>
                    <div className="w-full max-w-[44px] flex-1 flex items-end">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{
                          duration: 0.45,
                          delay: idx * 0.05,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ height: `${heightPct}%`, transformOrigin: 'bottom' }}
                        className="w-full rounded-t bg-gradient-to-t from-[#B66343] to-[#D78661]"
                      />
                    </div>
                    <span className="mt-2.5 font-mono text-[11px] text-[#AFA7A0] tabular-nums truncate w-full text-center">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Service Breakdown Horizontal Bars */}
        <div className="lg:col-span-5 bg-[#141414] border border-white/[0.09] rounded-lg p-6">
          <div className="mb-6">
            <h3 className="font-display text-base font-semibold text-[#F4EFE8]">
              Service Breakdown
            </h3>
            <p className="text-xs text-[#AFA7A0] mt-0.5">
              Distribution across all six service categories
            </p>
          </div>

          <div className="space-y-4">
            {serviceBreakdown.map((item, idx) => (
              <div key={item.id}>
                <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
                  <span className="text-[#D8D0C7] truncate">{item.name}</span>
                  <span className="font-mono text-[#F4EFE8] tabular-nums shrink-0">
                    {item.count}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#090A0B] overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.45, delay: idx * 0.04 }}
                    style={{
                      width: `${item.pct}%`,
                      transformOrigin: 'left',
                    }}
                    className={`h-full rounded-full ${
                      item.count > 0 ? 'bg-[#B66343]' : 'bg-transparent'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity Feed & Pending Follow-up Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-7 bg-[#141414] border border-white/[0.09] rounded-lg p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#D78661]" aria-hidden="true" />
              <h3 className="font-display text-base font-semibold text-[#F4EFE8]">
                Recent Activity
              </h3>
            </div>
            <span className="text-xs text-[#AFA7A0]">From stored audit logs</span>
          </div>

          {recentActivity.length === 0 ? (
            <p className="text-xs text-[#AFA7A0] py-6">No operational activity logged yet.</p>
          ) : (
            <div className="divide-y divide-white/[0.07]">
              {recentActivity.map((act) => (
                <div
                  key={act.id}
                  onClick={() => onInspectEnquiry(act.enquiry)}
                  className="py-3.5 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#1D1C1A]/50 px-2 -mx-2 rounded transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs mb-0.5">
                      <span className="font-mono text-[#D78661] tabular-nums">
                        {act.reference}
                      </span>
                      <span className="text-[#AFA7A0]" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-[#F4EFE8] font-medium truncate">
                        {act.customerName}
                      </span>
                    </div>
                    <p className="text-xs text-[#AFA7A0] truncate">{act.summary}</p>
                  </div>
                  <span className="font-mono text-[11px] text-[#AFA7A0] tabular-nums shrink-0">
                    {formatUkTimestamp(act.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Follow-up Shortcuts */}
        <div className="lg:col-span-5 bg-[#141414] border border-white/[0.09] rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-5">
              <h3 className="font-display text-base font-semibold text-[#F4EFE8]">
                Pending Follow-ups
              </h3>
              <button
                type="button"
                onClick={onJumpToFollowUps}
                className="text-xs font-medium text-[#D78661] hover:text-[#F4EFE8] transition-colors cursor-pointer"
              >
                Open all →
              </button>
            </div>

            {followUpsDueCount === 0 ? (
              <p className="text-xs text-[#AFA7A0] py-6">
                All follow-up reminders are currently completed.
              </p>
            ) : (
              <div className="space-y-3">
                {followUps
                  .filter((t) => t.status === 'Pending')
                  .slice(0, 3)
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={onJumpToFollowUps}
                      className="p-3.5 rounded-md bg-[#090A0B] border border-white/[0.08] hover:border-[#B66343]/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[#AFA7A0] mb-1">
                        <span className="text-[#D78661] tabular-nums">{task.reference}</span>
                        <span className="tabular-nums">Due {task.dueDate}</span>
                      </div>
                      <p className="text-xs font-medium text-[#F4EFE8]">
                        {task.title} — {task.customerName}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

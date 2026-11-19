import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Bell,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Kanban,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Table as TableIcon,
  X,
} from 'lucide-react';
import {
  CleaningEnquiry,
  EnquiryStatus,
  FollowUpTask,
  QuoteDraft,
} from '../../types/cleaning';
import {
  createActivity,
  generateFollowUpDraft,
  resetDemoStorage,
  saveEnquiries,
  saveFollowUps,
} from '../../utils/enquiryStorage';
import { DashboardOverview } from './DashboardOverview';
import { DemoSettings } from './DemoSettings';
import { EnquiriesKanban } from './EnquiriesKanban';
import { EnquiriesTable } from './EnquiriesTable';
import { EnquiryDetail } from './EnquiryDetail';
import { FollowUpCentre } from './FollowUpCentre';
import { QuoteDraftEditor } from './QuoteDraftEditor';

type DashboardTab = 'overview' | 'enquiries' | 'followups' | 'drafts' | 'settings';
type EnquiriesViewMode = 'table' | 'kanban';

interface DashboardLayoutProps {
  enquiries: CleaningEnquiry[];
  followUps: FollowUpTask[];
  onEnquiriesChange: (next: CleaningEnquiry[]) => void;
  onFollowUpsChange: (next: FollowUpTask[]) => void;
  onBackToWebsite: () => void;
}

const NAV_ITEMS: {
  id: DashboardTab;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'overview',
    label: 'Overview',
    subtitle: 'Operational summary, enquiry volume & action shortcuts',
    icon: LayoutDashboard,
  },
  {
    id: 'enquiries',
    label: 'Enquiries',
    subtitle: 'Search, filter, pipeline stages & enquiry inspection',
    icon: ClipboardList,
  },
  {
    id: 'followups',
    label: 'Follow-ups',
    subtitle: 'Simulated rule-based follow-up reminders & WhatsApp drafts',
    icon: Bell,
  },
  {
    id: 'drafts',
    label: 'Quotations',
    subtitle: 'Split-screen scope editor & printable quotation document',
    icon: FileText,
  },
  {
    id: 'settings',
    label: 'Demo Settings',
    subtitle: 'Browser localStorage diagnostics & demo data reset',
    icon: Settings,
  },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  enquiries,
  followUps,
  onEnquiriesChange,
  onFollowUpsChange,
  onBackToWebsite,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enquiriesView, setEnquiriesView] = useState<EnquiriesViewMode>('table');
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [draftTargetEnquiryId, setDraftTargetEnquiryId] = useState<string | null>(
    enquiries[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const newRequestsCount = enquiries.filter((e) => e.status === 'New').length;
  const followUpsDueCount = followUps.filter((t) => t.status === 'Pending').length;
  const selectedEnquiry = enquiries.find((e) => e.id === selectedEnquiryId) || null;
  const activeNav = NAV_ITEMS.find((n) => n.id === activeTab) || NAV_ITEMS[0];

  const todayDisplay = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handleUpdateStatus = (enquiryId: string, newStatus: EnquiryStatus) => {
    const next = enquiries.map((enq) => {
      if (enq.id !== enquiryId || enq.status === newStatus) return enq;
      const act = createActivity(
        'status_change',
        `Status updated from ${enq.status} to ${newStatus}`
      );
      return {
        ...enq,
        status: newStatus,
        history: [act, ...enq.history],
      };
    });
    onEnquiriesChange(next);
    saveEnquiries(next);
  };

  const handleAddNote = (enquiryId: string, noteText: string) => {
    const next = enquiries.map((enq) => {
      if (enq.id !== enquiryId) return enq;
      const note = {
        id: `note-${Date.now()}`,
        text: noteText,
        createdAt: new Date().toISOString(),
        author: 'Demo Staff',
      };
      const act = createActivity('note_added', `Internal note added: "${noteText}"`);
      return {
        ...enq,
        internalNotes: [note, ...enq.internalNotes],
        history: [act, ...enq.history],
      };
    });
    onEnquiriesChange(next);
    saveEnquiries(next);
  };

  const handleSaveDraft = (enquiryId: string, draft: QuoteDraft, markPrepared: boolean) => {
    const next = enquiries.map((enq) => {
      if (enq.id !== enquiryId) return enq;
      const acts = [
        createActivity(
          'quote_drafted',
          `Quote draft saved${draft.priceGbp ? ` (£${draft.priceGbp})` : ''}`
        ),
      ];
      let nextStatus = enq.status;
      if (markPrepared && enq.status !== 'Quote Prepared') {
        acts.unshift(
          createActivity('status_change', `Status updated from ${enq.status} to Quote Prepared`)
        );
        nextStatus = 'Quote Prepared';
      }
      return {
        ...enq,
        status: nextStatus,
        quoteDraft: draft,
        history: [...acts, ...enq.history],
      };
    });
    onEnquiriesChange(next);
    saveEnquiries(next);
  };

  const handleCreateFollowUp = (enquiry: CleaningEnquiry, title: string) => {
    const now = new Date();
    const due = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const newTask: FollowUpTask = {
      id: `fu-${now.getTime()}-${Math.floor(Math.random() * 1000)}`,
      enquiryId: enquiry.id,
      reference: enquiry.reference,
      customerName: enquiry.fullName,
      customerPhone: enquiry.phone,
      serviceName: enquiry.serviceName,
      postcode: enquiry.postcode,
      title,
      dueDate: due,
      status: 'Pending',
      messageDraft: generateFollowUpDraft(enquiry, title),
      createdAt: now.toISOString(),
    };
    const nextTasks = [newTask, ...followUps];
    onFollowUpsChange(nextTasks);
    saveFollowUps(nextTasks);

    const nextEnquiries = enquiries.map((enq) =>
      enq.id === enquiry.id
        ? {
            ...enq,
            history: [
              createActivity('followup_created', `Follow-up task added: ${title}`),
              ...enq.history,
            ],
          }
        : enq
    );
    onEnquiriesChange(nextEnquiries);
    saveEnquiries(nextEnquiries);
  };

  const handleToggleFollowUpStatus = (taskId: string) => {
    let toggledTask: FollowUpTask | undefined;
    const nextTasks = followUps.map((task) => {
      if (task.id !== taskId) return task;
      const nextStatus: 'Pending' | 'Completed' =
        task.status === 'Pending' ? 'Completed' : 'Pending';
      toggledTask = {
        ...task,
        status: nextStatus,
        completedAt: nextStatus === 'Completed' ? new Date().toISOString() : undefined,
      };
      return toggledTask;
    });
    onFollowUpsChange(nextTasks);
    saveFollowUps(nextTasks);

    if (toggledTask) {
      const nextEnquiries = enquiries.map((enq) =>
        enq.id === toggledTask!.enquiryId
          ? {
              ...enq,
              history: [
                createActivity(
                  'followup_completed',
                  `Follow-up "${toggledTask!.title}" marked ${toggledTask!.status}`
                ),
                ...enq.history,
              ],
            }
          : enq
      );
      onEnquiriesChange(nextEnquiries);
      saveEnquiries(nextEnquiries);
    }
  };

  const handleUpdateFollowUpDraft = (taskId: string, newDraft: string) => {
    const next = followUps.map((t) =>
      t.id === taskId ? { ...t, messageDraft: newDraft } : t
    );
    onFollowUpsChange(next);
    saveFollowUps(next);
  };

  const handleResetDemo = () => {
    const { enquiries: seededEnq, followUps: seededFu } = resetDemoStorage();
    onEnquiriesChange(seededEnq);
    onFollowUpsChange(seededFu);
    setSelectedEnquiryId(null);
    setDraftTargetEnquiryId(seededEnq[0]?.id || null);
  };

  const handleHeaderSearchShortcut = () => {
    setActiveTab('enquiries');
    setEnquiriesView('table');
    setTimeout(() => {
      document.getElementById('dashboard-enquiry-search')?.focus();
    }, 60);
  };

  return (
    <div className="min-h-screen bg-[#090A0B] text-[#F4EFE8] flex flex-col lg:flex-row">
      {/* Desktop Collapsible Left Sidebar */}
      <aside
        className={`hidden lg:flex shrink-0 flex-col bg-[#141414] border-r border-white/[0.09] transition-all duration-200 no-print ${
          sidebarCollapsed ? 'w-[78px]' : 'w-[260px]'
        }`}
      >
        <div className="px-5 h-[72px] flex items-center justify-between border-b border-white/[0.09]">
          {!sidebarCollapsed && (
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onBackToWebsite();
              }}
              className="min-w-0"
            >
              <span className="block font-display text-sm font-semibold tracking-tight text-[#F4EFE8] whitespace-nowrap">
                Be Persistent <span className="text-[#D78661]">1of1</span>
              </span>
              <span className="block text-[11px] font-mono uppercase tracking-[0.14em] text-[#AFA7A0]">
                Operations
              </span>
            </a>
          )}
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-2 rounded-md border border-white/[0.1] bg-[#090A0B] text-[#AFA7A0] hover:text-[#F4EFE8] cursor-pointer mx-auto lg:mx-0"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="px-3 py-5 flex-1">
          <nav aria-label="Dashboard navigation" className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              const badge =
                item.id === 'enquiries'
                  ? newRequestsCount
                  : item.id === 'followups'
                    ? followUpsDueCount
                    : 0;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id !== 'enquiries') setSelectedEnquiryId(null);
                  }}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'
                  } py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#B66343]/18 text-[#F4EFE8] border border-[#B66343]/45'
                      : 'text-[#AFA7A0] hover:text-[#F4EFE8] hover:bg-[#1D1C1A] border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? 'text-[#D78661]' : 'text-[#AFA7A0]'
                      }`}
                      aria-hidden="true"
                    />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </span>
                  {!sidebarCollapsed && badge > 0 && (
                    <span className="font-mono text-xs text-[#D78661] tabular-nums">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-white/[0.09]">
          <button
            type="button"
            onClick={onBackToWebsite}
            title={sidebarCollapsed ? 'Back to Public Website' : undefined}
            className={`w-full inline-flex items-center justify-center gap-2 ${
              sidebarCollapsed ? 'px-2' : 'px-3.5'
            } py-2.5 rounded-md bg-[#090A0B] hover:bg-[#1D1C1A] border border-white/[0.11] text-xs font-medium text-[#D8D0C7] hover:text-[#F4EFE8] transition-colors cursor-pointer`}
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            {!sidebarCollapsed && <span>Public Website</span>}
          </button>
        </div>
      </aside>

      {/* Main Operations Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-[72px] px-4 sm:px-8 bg-[#090A0B]/92 backdrop-blur-xl border-b border-white/[0.09] flex items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle dashboard navigation"
              className="lg:hidden p-2 rounded-md border border-white/[0.12] bg-[#141414] text-[#F4EFE8] cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Menu className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            <div className="min-w-0">
              <h1 className="font-display text-base sm:text-lg font-semibold text-[#F4EFE8] truncate">
                {activeNav.label}
              </h1>
              <p className="hidden md:block text-xs text-[#AFA7A0] truncate">
                {activeNav.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <span className="hidden xl:inline font-mono text-xs text-[#AFA7A0] tabular-nums">
              {todayDisplay}
            </span>

            <button
              type="button"
              onClick={handleHeaderSearchShortcut}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#141414] hover:bg-[#1D1C1A] border border-white/[0.1] text-xs text-[#AFA7A0] hover:text-[#F4EFE8] transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Search enquiries</span>
            </button>

            <span className="px-2.5 py-1.5 rounded border border-[#B66343]/50 bg-[#B66343]/12 text-[11px] font-medium text-[#D78661] whitespace-nowrap">
              Demo Mode
            </span>

            <button
              type="button"
              onClick={() => {
                setDraftTargetEnquiryId(enquiries[0]?.id || null);
                setActiveTab('drafts');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#B66343] hover:bg-[#D78661] text-xs font-medium text-[#F4EFE8] transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>New Quote</span>
            </button>

            <button
              type="button"
              onClick={onBackToWebsite}
              className="lg:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded border border-white/[0.12] bg-[#141414] text-xs font-medium text-[#D8D0C7] whitespace-nowrap cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Site
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#141414] border-b border-white/[0.09] px-4 py-3 no-print">
            <nav className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-xs font-medium border cursor-pointer ${
                      active
                        ? 'bg-[#B66343]/20 border-[#D78661] text-[#F4EFE8]'
                        : 'bg-[#090A0B] border-white/[0.09] text-[#AFA7A0]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Active View Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-[1460px] w-full mx-auto">
          {activeTab === 'overview' && (
            <DashboardOverview
              enquiries={enquiries}
              followUps={followUps}
              onJumpToNewEnquiries={() => {
                setStatusFilter('New');
                setActiveTab('enquiries');
              }}
              onJumpToQuotations={(enqId) => {
                if (enqId) setDraftTargetEnquiryId(enqId);
                setActiveTab('drafts');
              }}
              onJumpToFollowUps={() => setActiveTab('followups')}
              onInspectEnquiry={(enq) => {
                setSelectedEnquiryId(enq.id);
              }}
            />
          )}

          {activeTab === 'enquiries' && (
            <div className="space-y-5">
              {/* View Switcher: Table vs Kanban Pipeline */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1 p-1 bg-[#141414] border border-white/[0.09] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setEnquiriesView('table')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      enquiriesView === 'table'
                        ? 'bg-[#B66343] text-[#F4EFE8]'
                        : 'text-[#AFA7A0] hover:text-[#F4EFE8]'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    Table View
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnquiriesView('kanban')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      enquiriesView === 'kanban'
                        ? 'bg-[#B66343] text-[#F4EFE8]'
                        : 'text-[#AFA7A0] hover:text-[#F4EFE8]'
                    }`}
                  >
                    <Kanban className="w-3.5 h-3.5" aria-hidden="true" />
                    Pipeline Board
                  </button>
                </div>

                <p className="text-xs text-[#AFA7A0]">
                  {enquiriesView === 'kanban'
                    ? 'Drag cards between columns or use the stage selector to update status.'
                    : 'Click any row to open the full enquiry inspection drawer.'}
                </p>
              </div>

              {enquiriesView === 'table' ? (
                <EnquiriesTable
                  enquiries={enquiries}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  serviceFilter={serviceFilter}
                  onServiceFilterChange={setServiceFilter}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  selectedEnquiryId={selectedEnquiryId}
                  onSelectEnquiry={(enq) => setSelectedEnquiryId(enq.id)}
                />
              ) : (
                <EnquiriesKanban
                  enquiries={enquiries}
                  selectedEnquiryId={selectedEnquiryId}
                  onSelectEnquiry={(enq) => setSelectedEnquiryId(enq.id)}
                  onMoveStatus={handleUpdateStatus}
                />
              )}
            </div>
          )}

          {activeTab === 'followups' && (
            <FollowUpCentre
              followUps={followUps}
              enquiries={enquiries}
              onToggleStatus={handleToggleFollowUpStatus}
              onUpdateDraft={handleUpdateFollowUpDraft}
              onCreateFollowUp={handleCreateFollowUp}
            />
          )}

          {activeTab === 'drafts' && (
            <QuoteDraftEditor
              enquiries={enquiries}
              activeEnquiryId={draftTargetEnquiryId}
              onSelectEnquiry={(id) => setDraftTargetEnquiryId(id)}
              onSaveDraft={handleSaveDraft}
            />
          )}

          {activeTab === 'settings' && (
            <DemoSettings
              enquiries={enquiries}
              followUps={followUps}
              onResetDemo={handleResetDemo}
            />
          )}
        </main>
      </div>

      {/* Slide-Over Enquiry Detail Drawer */}
      <AnimatePresence>
        {selectedEnquiry && (
          <EnquiryDetail
            enquiry={selectedEnquiry}
            onClose={() => setSelectedEnquiryId(null)}
            onUpdateStatus={handleUpdateStatus}
            onAddNote={handleAddNote}
            onOpenQuoteDraft={(enqId) => {
              setSelectedEnquiryId(null);
              setDraftTargetEnquiryId(enqId);
              setActiveTab('drafts');
            }}
            onCreateFollowUp={handleCreateFollowUp}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

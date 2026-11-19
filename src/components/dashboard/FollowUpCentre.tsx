import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  MessageCircle,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { CleaningEnquiry, FollowUpTask } from '../../types/cleaning';
import {
  buildWhatsAppLink,
  formatUkDate,
  generateFollowUpDraft,
} from '../../utils/enquiryStorage';

interface FollowUpCentreProps {
  followUps: FollowUpTask[];
  enquiries: CleaningEnquiry[];
  onToggleStatus: (taskId: string) => void;
  onUpdateDraft: (taskId: string, newDraft: string) => void;
  onCreateFollowUp: (enquiry: CleaningEnquiry, title: string) => void;
}

const QUICK_TASK_TYPES = [
  'Acknowledge new cleaning enquiry',
  'Follow up on quotation',
  'Confirm requested cleaning date',
];

export const FollowUpCentre: React.FC<FollowUpCentreProps> = ({
  followUps,
  enquiries,
  onToggleStatus,
  onUpdateDraft,
  onCreateFollowUp,
}) => {
  const [filter, setFilter] = useState<'Pending' | 'Completed' | 'All'>('Pending');
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string>(enquiries[0]?.id || '');
  const [newTaskTitle, setNewTaskTitle] = useState<string>(QUICK_TASK_TYPES[0]);

  const visibleTasks = followUps.filter((t) =>
    filter === 'All' ? true : t.status === filter
  );

  const pendingCount = followUps.filter((t) => t.status === 'Pending').length;
  const completedCount = followUps.filter((t) => t.status === 'Completed').length;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const target = enquiries.find((enq) => enq.id === selectedEnquiryId);
    if (!target) return;
    onCreateFollowUp(target, newTaskTitle);
  };

  return (
    <div className="space-y-6">
      {/* Honest Automation Disclosure */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#141414] border border-[#B66343]/35 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-[#D78661] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs sm:text-sm text-[#D8D0C7] leading-relaxed">
          <strong className="text-[#F4EFE8] font-medium">
            Simulated Follow-up Assistant:
          </strong>{' '}
          New enquiries automatically generate a suggested follow-up task and rule-based message
          draft. No WhatsApp messages or emails are ever sent automatically — staff click{' '}
          <span className="text-[#F4EFE8]">Prepare WhatsApp Message</span> to review and send
          manually.
        </div>
      </div>

      {/* Create Suggested Follow-up Bar */}
      {enquiries.length > 0 && (
        <form
          onSubmit={handleAddTask}
          className="p-4 sm:p-5 rounded-lg bg-[#141414] border border-white/[0.09] flex flex-col lg:flex-row lg:items-end gap-4"
        >
          <div className="flex-1">
            <label
              htmlFor="fu-enquiry-select"
              className="block text-xs font-medium text-[#AFA7A0] mb-1.5"
            >
              Customer Enquiry
            </label>
            <select
              id="fu-enquiry-select"
              value={selectedEnquiryId}
              onChange={(e) => setSelectedEnquiryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md bg-[#090A0B] border border-white/[0.11] text-xs sm:text-sm text-[#F4EFE8] focus:outline-none focus:border-[#D78661]"
            >
              {enquiries.map((enq) => (
                <option key={enq.id} value={enq.id}>
                  {enq.reference} — {enq.fullName} ({enq.serviceName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="fu-template-select"
              className="block text-xs font-medium text-[#AFA7A0] mb-1.5"
            >
              Follow-up Template
            </label>
            <select
              id="fu-template-select"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md bg-[#090A0B] border border-white/[0.11] text-xs sm:text-sm text-[#F4EFE8] focus:outline-none focus:border-[#D78661]"
            >
              {QUICK_TASK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#B66343] hover:bg-[#D78661] text-xs sm:text-sm font-medium text-[#F4EFE8] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Generate Task
          </button>
        </form>
      )}

      {/* Segmented Filter */}
      <div className="flex items-center gap-1 p-1 bg-[#141414] border border-white/[0.09] rounded-lg w-fit">
        {(['Pending', 'Completed', 'All'] as const).map((tab) => {
          const count =
            tab === 'Pending'
              ? pendingCount
              : tab === 'Completed'
                ? completedCount
                : followUps.length;
          const active = filter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer tabular-nums whitespace-nowrap ${
                active ? 'bg-[#B66343] text-[#F4EFE8]' : 'text-[#AFA7A0] hover:text-[#F4EFE8]'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Task Cards */}
      {visibleTasks.length === 0 ? (
        <div className="p-12 rounded-lg bg-[#141414] border border-white/[0.09] text-center">
          <p className="font-display text-base font-medium text-[#F4EFE8] mb-1">
            No {filter.toLowerCase()} follow-ups
          </p>
          <p className="text-xs text-[#AFA7A0]">
            New enquiries automatically generate a suggested follow-up reminder here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {visibleTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const enquiry = enquiries.find((e) => e.id === task.enquiryId);
            const whatsAppHref = buildWhatsAppLink(task.messageDraft);

            return (
              <div
                key={task.id}
                className="bg-[#141414] border border-white/[0.09] rounded-lg p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-white/[0.08] mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#AFA7A0] mb-1">
                        <span className="font-mono text-[#D78661] tabular-nums">
                          {task.reference}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{task.serviceName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{task.postcode}</span>
                      </div>
                      <h4 className="font-display text-base font-semibold text-[#F4EFE8]">
                        {task.title} — {task.customerName}
                      </h4>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded border tabular-nums ${
                        isCompleted
                          ? 'bg-[#3E8E5A]/15 border-[#3E8E5A]/45 text-[#8FD1A6]'
                          : 'bg-[#B66343]/15 border-[#B66343]/45 text-[#D78661]'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      {isCompleted ? 'Completed' : `Due ${formatUkDate(task.dueDate)}`}
                    </span>
                  </div>

                  {/* Editable Rule-Based Draft */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label
                        htmlFor={`draft-msg-${task.id}`}
                        className="text-xs font-medium text-[#AFA7A0]"
                      >
                        Message Draft (Rule-Based Template)
                      </label>
                      {enquiry && (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateDraft(task.id, generateFollowUpDraft(enquiry, task.title))
                          }
                          className="text-[11px] text-[#D78661] hover:text-[#F4EFE8] cursor-pointer"
                        >
                          Reset template
                        </button>
                      )}
                    </div>
                    <textarea
                      id={`draft-msg-${task.id}`}
                      rows={3}
                      value={task.messageDraft}
                      onChange={(e) => onUpdateDraft(task.id, e.target.value)}
                      className="w-full px-3.5 py-3 rounded-md bg-[#090A0B] border border-white/[0.11] text-xs sm:text-sm text-[#F4EFE8] leading-relaxed focus:outline-none focus:border-[#D78661]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href={whatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#B66343] hover:bg-[#D78661] text-xs font-medium text-[#F4EFE8] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    Prepare WhatsApp Message
                    <ExternalLink className="w-3 h-3 opacity-80" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onToggleStatus(task.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1D1C1A] hover:bg-[#2A2825] border border-white/[0.12] text-xs font-medium text-[#F4EFE8] transition-colors cursor-pointer"
                  >
                    {isCompleted ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 text-[#AFA7A0]" aria-hidden="true" />
                        Reopen
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8FD1A6]" aria-hidden="true" />
                        Mark Completed
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

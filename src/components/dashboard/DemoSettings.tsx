import React, { useState } from 'react';
import { AlertTriangle, Check, Database, RotateCcw } from 'lucide-react';
import { CleaningEnquiry, FollowUpTask } from '../../types/cleaning';

interface DemoSettingsProps {
  enquiries: CleaningEnquiry[];
  followUps: FollowUpTask[];
  onResetDemo: () => void;
}

export const DemoSettings: React.FC<DemoSettingsProps> = ({
  enquiries,
  followUps,
  onResetDemo,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    onResetDemo();
    setConfirmReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3500);
  };

  const userSubmittedCount = enquiries.filter((e) => !e.isSeedDemo).length;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#141414] border border-white/[0.09] rounded-lg p-6">
        <div className="flex items-start gap-3.5 mb-5">
          <Database className="w-5 h-5 text-[#D78661] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-display text-lg font-semibold text-[#F4EFE8]">
              Local Browser Demo Storage
            </h3>
            <p className="text-sm text-[#AFA7A0] mt-1 leading-relaxed">
              This Staff Dashboard Demo runs entirely in your browser using{' '}
              <code className="font-mono text-xs text-[#D78661]">localStorage</code>. Enquiries
              submitted via the public quotation studio in this same browser appear here
              immediately and persist across page refreshes without a live backend or external
              database.
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-white/[0.09] text-sm">
          <div className="p-4 rounded-md bg-[#090A0B] border border-white/[0.08]">
            <dt className="text-xs text-[#AFA7A0]">Total Demo Records</dt>
            <dd className="font-mono text-2xl font-medium text-[#F4EFE8] tabular-nums mt-1">
              {enquiries.length}
            </dd>
          </div>
          <div className="p-4 rounded-md bg-[#090A0B] border border-white/[0.08]">
            <dt className="text-xs text-[#AFA7A0]">Submitted in Session</dt>
            <dd className="font-mono text-2xl font-medium text-[#D78661] tabular-nums mt-1">
              {userSubmittedCount}
            </dd>
          </div>
          <div className="p-4 rounded-md bg-[#090A0B] border border-white/[0.08]">
            <dt className="text-xs text-[#AFA7A0]">Follow-up Tasks</dt>
            <dd className="font-mono text-2xl font-medium text-[#F4EFE8] tabular-nums mt-1">
              {followUps.length}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-[#141414] border border-white/[0.09] rounded-lg p-6">
        <h3 className="font-display text-lg font-semibold text-[#F4EFE8] mb-2">
          Reset Demonstration Data
        </h3>
        <p className="text-sm text-[#AFA7A0] leading-relaxed mb-5">
          Restore the original fictional demonstration enquiries, follow-ups, and sample quote
          draft. This clears any custom enquiries created in your current browser session.
        </p>

        {!confirmReset ? (
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#1D1C1A] hover:bg-[#B66343] border border-white/[0.12] hover:border-[#B66343] text-sm font-medium text-[#F4EFE8] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Reset Demo Storage
            </button>

            {resetDone && (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#8FD1A6] font-medium">
                <Check className="w-4 h-4" aria-hidden="true" />
                Demo data restored to defaults.
              </span>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-md bg-[#090A0B] border border-[#B66343]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-2.5 text-xs text-[#D8D0C7]">
              <AlertTriangle
                className="w-4 h-4 text-[#D78661] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>Confirm resetting all local demo enquiries and follow-ups?</span>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3.5 py-2 rounded border border-white/[0.14] text-xs text-[#D8D0C7] hover:text-[#F4EFE8] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded bg-[#B66343] hover:bg-[#D78661] text-xs font-medium text-[#F4EFE8] cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

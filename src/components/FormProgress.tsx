import React from 'react';
import { Check } from 'lucide-react';

interface StepItem {
  number: number;
  label: string;
  subtitle: string;
}

const STEPS: StepItem[] = [
  { number: 1, label: 'Select Service', subtitle: 'Choose your cleaning discipline' },
  { number: 2, label: 'Property Details', subtitle: 'Postcode, layout & priorities' },
  { number: 3, label: 'Date & Photos', subtitle: 'Preferred window & local previews' },
  { number: 4, label: 'Contact Details', subtitle: 'Review & prepare enquiry' },
  { number: 5, label: 'Confirmation', subtitle: 'Reference & WhatsApp handoff' },
];

interface FormProgressProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  vertical?: boolean;
}

export const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  onStepClick,
  vertical = false,
}) => {
  const progressPct = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  if (vertical) {
    return (
      <div aria-label="Quotation progress" className="space-y-2">
        <div className="relative h-[2px] w-full bg-white/10 mb-5 overflow-hidden rounded-full">
          <div
            className="absolute inset-y-0 left-0 bg-[#D78661] transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <ol className="space-y-1.5">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.number;
            const isActive = currentStep === step.number;
            const canJump = Boolean(onStepClick && step.number < currentStep && currentStep < 5);

            return (
              <li key={step.number}>
                <button
                  type="button"
                  disabled={!canJump}
                  onClick={() => canJump && onStepClick?.(step.number)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                    isActive
                      ? 'bg-[#1D1C1A]/90 border border-[#B66343]/55'
                      : 'border border-transparent'
                  } ${canJump ? 'cursor-pointer hover:bg-[#1D1C1A]/50' : 'cursor-default'}`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded font-mono text-[11px] tabular-nums shrink-0 border transition-colors ${
                      isActive
                        ? 'bg-[#B66343] border-[#B66343] text-[#F4EFE8]'
                        : isCompleted
                          ? 'bg-[#1D1C1A] border-[#B66343]/60 text-[#D78661]'
                          : 'bg-[#090A0B]/70 border-white/12 text-[#AFA7A0]'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3" aria-hidden="true" />
                    ) : (
                      `0${step.number}`
                    )}
                  </span>
                  <div className="min-w-0">
                    <span
                      className={`block text-xs font-medium truncate ${
                        isActive
                          ? 'text-[#F4EFE8]'
                          : isCompleted
                            ? 'text-[#D8D0C7]'
                            : 'text-[#AFA7A0]'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="block text-[11px] text-[#AFA7A0]/75 truncate">
                      {step.subtitle}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div className="mb-7" aria-label="Quotation progress">
      <div className="relative h-[2px] w-full bg-white/10 mb-4 overflow-hidden rounded-full">
        <div
          className="absolute inset-y-0 left-0 bg-[#D78661] transition-all duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <ol className="grid grid-cols-5 gap-2">
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const canJump = Boolean(onStepClick && step.number < currentStep && currentStep < 5);

          return (
            <li key={step.number} className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                disabled={!canJump}
                onClick={() => canJump && onStepClick?.(step.number)}
                className={`flex items-center gap-2 text-left min-w-0 transition-colors ${
                  canJump ? 'cursor-pointer hover:opacity-85' : 'cursor-default'
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded font-mono text-xs tabular-nums shrink-0 border transition-colors ${
                    isActive
                      ? 'bg-[#B66343] border-[#B66343] text-[#F4EFE8]'
                      : isCompleted
                        ? 'bg-[#1D1C1A] border-[#B66343]/60 text-[#D78661]'
                        : 'bg-[#090A0B] border-white/12 text-[#AFA7A0]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : step.number}
                </span>
                <span
                  className={`hidden sm:inline text-xs font-medium truncate ${
                    isActive
                      ? 'text-[#F4EFE8]'
                      : isCompleted
                        ? 'text-[#D8D0C7]'
                        : 'text-[#AFA7A0]'
                  }`}
                >
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

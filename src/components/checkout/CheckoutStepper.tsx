'use client';

import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Thông tin khách hàng' },
  { id: 2, name: 'Phương thức thanh toán' },
  { id: 3, name: 'Xác nhận & Thanh toán' },
];

export default function CheckoutStepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-borderSubtle -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-cacao-500 -translate-y-1/2 z-0 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Step Circles */}
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                  isCompleted
                    ? 'bg-cacao-600 text-white'
                    : isCurrent
                      ? 'bg-navy-900 text-white ring-4 ring-cacao-500/30 border-2 border-cacao-500'
                      : 'bg-surface-card border-2 border-borderSubtle text-textSubtle'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <span
                className={`mt-2 text-xs font-semibold whitespace-nowrap hidden sm:block ${
                  isCurrent
                    ? 'text-navy-900 font-bold'
                    : isCompleted
                      ? 'text-cacao-700'
                      : 'text-textSubtle'
                }`}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

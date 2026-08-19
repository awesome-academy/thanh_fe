import React from 'react';
import { UseFormSetError, FieldValues, Path } from 'react-hook-form';

export function applyServerFieldErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  fields: Record<string, string> | undefined
) {
  if (!fields) return;
  for (const [name, message] of Object.entries(fields)) {
    setError(name as Path<T>, { type: 'server', message });
  }
}

/** Shared input styling for the admin tour form. */
export const adminInputClass =
  'w-full px-3 py-2.5 text-sm text-textStrong bg-surface-page border border-borderSubtle rounded-xl focus:outline-none focus:ring-2 focus:ring-cacao-500/30 focus:border-cacao-500 transition-colors';

interface FieldProps {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}

export default function Field({ label, error, optional, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-textBody">
        {label} {!optional && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
    </div>
  );
}

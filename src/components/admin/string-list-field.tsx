'use client';

import { FieldValues, Path, useFieldArray, Control, FieldErrors } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { adminInputClass } from '@/components/admin/tour-form-field';

interface StringListFieldProps<T extends FieldValues> {
  control: Control<T>;
  /** Array field on the form, e.g. 'highlights'. */
  name: Path<T>;
  label: string;
  placeholder: string;
  addLabel: string;
  errors?: FieldErrors<T>;
  /** Input type for each row; 'url' gets the browser's URL keyboard/validation. */
  type?: 'text' | 'url';
}

export default function StringListField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  addLabel,
  errors,
  type = 'text',
}: StringListFieldProps<T>) {
  const { fields, append, remove } = useFieldArray<T>({
    control,
    name: name as never,
  });

  // errors[name] is an array of per-row errors when a row fails validation.
  const rowErrors = errors?.[name] as unknown as
    | Array<{ message?: string } | undefined>
    | undefined;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-textBody">{label}</label>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <input
                // register via control keeps this component generic over T.
                {...control.register(`${name}.${index}` as Path<T>)}
                type={type}
                placeholder={placeholder}
                className={`${adminInputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Xóa dòng ${index + 1}`}
                className="p-2 rounded-lg text-textSubtle hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {rowErrors?.[index]?.message && (
              <p className="text-[11px] text-rose-600 font-medium">
                {rowErrors[index]?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append('' as never)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-cacao-600 hover:bg-cacao-50 transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{addLabel}</span>
      </button>
    </div>
  );
}

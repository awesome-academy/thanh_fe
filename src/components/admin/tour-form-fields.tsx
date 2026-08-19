'use client';

import { UseFormRegister, Control, FieldErrors } from 'react-hook-form';
import { Destination, Category } from '@/types';
import { TourFormInput } from '@/lib/tour-schema';
import Field, { adminInputClass } from '@/components/admin/tour-form-field';
import StringListField from '@/components/admin/string-list-field';

interface TourFormFieldsProps {
  register: UseFormRegister<TourFormInput>;
  control: Control<TourFormInput>;
  errors: FieldErrors<TourFormInput>;
  destinations?: Destination[];
  categories?: Category[];
  /** Locks every field, select and list-row button while a mutation is pending. */
  disabled?: boolean;
}

export default function TourFormFields({
  register,
  control,
  errors,
  destinations,
  categories,
  disabled,
}: TourFormFieldsProps) {
  return (
    <fieldset disabled={disabled} className="space-y-4 min-w-0">
        <Field label="Tên tour" error={errors.name?.message}>
          <input
            {...register('name')}
            type="text"
            className={adminInputClass}
            placeholder="Hạ Long — Du thuyền 5 sao"
          />
        </Field>

        <Field label="Mô tả" error={errors.description?.message}>
          <textarea
            {...register('description')}
            rows={4}
            className={`${adminInputClass} resize-none`}
            placeholder="Giới thiệu ngắn về chuyến đi..."
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Điểm đến" error={errors.dest?.message}>
            <select {...register('dest')} className={adminInputClass}>
              <option value="">— Chọn điểm đến —</option>
              {(destinations || []).map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Loại tour" error={errors.type?.message}>
            <select {...register('type')} className={adminInputClass}>
              <option value="">— Chọn loại tour —</option>
              {(categories || []).map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Số ngày" error={errors.days?.message}>
            <input {...register('days')} type="number" min={1} max={30} className={adminInputClass} />
          </Field>
          <Field label="Giá người lớn (đ)" error={errors.price?.message}>
            <input {...register('price')} type="number" min={0} step={10000} className={adminInputClass} />
          </Field>
          <Field label="Giá trẻ em (đ)" error={errors.kidPrice?.message}>
            <input {...register('kidPrice')} type="number" min={0} step={10000} className={adminInputClass} />
          </Field>
        </div>

        <StringListField
          control={control}
          name="images"
          label="Ảnh tour (ảnh đầu tiên là ảnh đại diện)"
          placeholder="https://images.unsplash.com/..."
          addLabel="Thêm ảnh"
          type="url"
          errors={errors}
        />

        <div className="space-y-4 pt-2 border-t border-borderSubtle">
          <StringListField
            control={control}
            name="highlights"
            label="Điểm nổi bật"
            placeholder="Trải nghiệm du thuyền 5 sao..."
            addLabel="Thêm điểm nổi bật"
            errors={errors}
          />
          <StringListField
            control={control}
            name="included"
            label="Giá bao gồm"
            placeholder="Xe đưa đón theo chương trình"
            addLabel="Thêm mục bao gồm"
            errors={errors}
          />
          <StringListField
            control={control}
            name="excludes"
            label="Giá không bao gồm"
            placeholder="Chi phí cá nhân ngoài chương trình"
            addLabel="Thêm mục không bao gồm"
            errors={errors}
          />
        </div>
    </fieldset>
  );
}

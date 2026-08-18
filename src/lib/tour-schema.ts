import { z } from 'zod';
import { APIValidationError } from '@/types';
import { ALLOWED_IMAGE_HOSTS, isAllowedImageUrl } from '@/lib/image-hosts';

const NUMBER_REQUIRED = 'Vui lòng nhập số hợp lệ';

const IMAGE_HOST_MESSAGE = `Ảnh phải là URL https từ: ${ALLOWED_IMAGE_HOSTS.join(', ')}`;

const requiredNumber = <T extends z.ZodType<number>>(schema: T) =>
  z.preprocess(
    (value) =>
      value === null || (typeof value === 'string' && value.trim() === '')
        ? undefined
        : value,
    schema
  );

const imageList = () =>
  z.preprocess(
    (value) =>
      Array.isArray(value)
        ? value.filter((item) => typeof item === 'string' && item.trim() !== '')
        : value,
    z
      .array(z.string().refine(isAllowedImageUrl, { message: IMAGE_HOST_MESSAGE }))
      .min(1, 'Vui lòng nhập ít nhất một URL ảnh')
      .max(4, 'Tối đa 4 ảnh')
      .refine((urls) => new Set(urls).size === urls.length, {
        message: 'Các URL ảnh không được trùng nhau',
      })
  );

const stringList = () =>
  z
    .preprocess(
      (value) =>
        Array.isArray(value)
          ? value.filter((item) => typeof item === 'string' && item.trim() !== '')
          : value,
      z.array(z.string().trim().min(1, 'Nội dung không được để trống'))
    )
    .default([]);

export const tourFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(8, 'Tên tour tối thiểu 8 ký tự')
      .max(120, 'Tên tour tối đa 120 ký tự'),
    description: z
      .string()
      .trim()
      .min(30, 'Mô tả tối thiểu 30 ký tự')
      .max(1000, 'Mô tả tối đa 1000 ký tự'),
    // The { error } form covers a missing key too; .min alone only fires for
    // a present-but-empty string and would fall back to Zod's English text.
    dest: z
      .string({ error: 'Vui lòng chọn điểm đến' })
      .min(1, 'Vui lòng chọn điểm đến'),
    type: z
      .string({ error: 'Vui lòng chọn loại tour' })
      .min(1, 'Vui lòng chọn loại tour'),
    days: requiredNumber(
      z.coerce
        .number({ error: NUMBER_REQUIRED })
        .int('Số ngày phải là số nguyên')
        .min(1, 'Tối thiểu 1 ngày')
        .max(30, 'Tối đa 30 ngày')
    ),
    price: requiredNumber(
      z.coerce
        .number({ error: NUMBER_REQUIRED })
        .int('Giá phải là số nguyên')
        .min(100000, 'Giá tối thiểu 100.000đ')
    ),
    kidPrice: requiredNumber(
      z.coerce
        .number({ error: NUMBER_REQUIRED })
        .int('Giá trẻ em phải là số nguyên')
        .min(0, 'Giá trẻ em không được âm')
    ),
    images: imageList(),
    highlights: stringList(),
    included: stringList(),
    excludes: stringList(),
  })
  .refine((values) => values.kidPrice <= values.price, {
    message: 'Giá trẻ em không được cao hơn giá người lớn',
    path: ['kidPrice'],
  });

export type TourFormValues = z.output<typeof tourFormSchema>;
export type TourFormInput = z.input<typeof tourFormSchema>;

/**
 * Collapses a ZodError into the flat { field: message } map the existing
 * APIValidationError contract uses. First message per field wins.
 */
export function toFieldErrors(error: z.ZodError): APIValidationError {
  const fields: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!fields[key]) {
      fields[key] = issue.message;
    }
  }

  return {
    error: { code: 'VALIDATION', message: 'Dữ liệu tour không hợp lệ', fields },
  };
}

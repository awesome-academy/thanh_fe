'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, FileText, ArrowRight } from 'lucide-react';

export const guestInfoSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự)'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không đúng định dạng'),
  phone: z.string().regex(/^[0-9]{9,11}$/, 'Số điện thoại không hợp lệ (gồm 9 - 11 chữ số)'),
  note: z.string().optional(),
});

export type GuestInfoValues = z.infer<typeof guestInfoSchema>;

interface GuestInfoStepProps {
  initialValues: GuestInfoValues;
  onSubmit: (values: GuestInfoValues) => void;
}

export default function GuestInfoStep({ initialValues, onSubmit }: GuestInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestInfoValues>({
    resolver: zodResolver(guestInfoSchema),
    values: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-surface-card border border-borderSubtle rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-textStrong flex items-center gap-2 border-b border-borderSubtle pb-4">
          <User className="w-5 h-5 text-cacao-600" />
          <span>Thông tin người liên hệ & đặt tour</span>
        </h2>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-textStrong flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cacao-500" />
            <span>Họ và Tên *</span>
          </label>
          <input
            type="text"
            placeholder="Nguyễn Văn A"
            {...register('fullName')}
            className="w-full bg-surface-page border border-borderSubtle rounded-xl px-3.5 py-2.5 text-sm text-textStrong focus:ring-2 focus:ring-cacao-500 outline-none transition-all"
          />
          {errors.fullName && (
            <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Grid Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-textStrong flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cacao-500" />
              <span>Email nhận xác nhận đơn *</span>
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              {...register('email')}
              className="w-full bg-surface-page border border-borderSubtle rounded-xl px-3.5 py-2.5 text-sm text-textStrong focus:ring-2 focus:ring-cacao-500 outline-none transition-all"
            />
            {errors.email && (
              <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-textStrong flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cacao-500" />
              <span>Số điện thoại liên hệ *</span>
            </label>
            <input
              type="tel"
              placeholder="0912345678"
              {...register('phone')}
              className="w-full bg-surface-page border border-borderSubtle rounded-xl px-3.5 py-2.5 text-sm text-textStrong focus:ring-2 focus:ring-cacao-500 outline-none transition-all"
            />
            {errors.phone && (
              <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Special Requests */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-bold text-textStrong flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cacao-500" />
            <span>Yêu cầu đặc biệt (tùy chọn)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Ví dụ: Ăn chay, ghế ngồi trẻ em, đón tại khách sạn..."
            {...register('note')}
            className="w-full bg-surface-page border border-borderSubtle rounded-xl px-3.5 py-2.5 text-sm text-textStrong focus:ring-2 focus:ring-cacao-500 outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          className="bg-cacao-600 hover:bg-cacao-700 text-white font-bold py-3 px-6 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span>Tiếp tục: Chọn phương thức thanh toán</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}

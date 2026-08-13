'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự)'),
    email: z.string().min(1, 'Vui lòng nhập email').email('Email không đúng định dạng'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Vui lòng xác nhận lại mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error?.message || 'Đăng ký không thành công');
        setIsSubmitting(false);
        return;
      }

      // Initialize NextAuth Session immediately after registration
      const signInResult = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push(`/login?email=${encodeURIComponent(values.email)}&registered=true`);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setServerError('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-surface-card border border-borderSubtle rounded-2xl shadow-xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-textStrong">Đăng Ký Tài Khoản</h1>
        <p className="text-xs text-textMuted leading-relaxed">
          Tạo tài khoản TripGo mới để dễ dàng quản lý đơn hàng và nhận ưu đãi
        </p>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-textStrong flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cacao-500" />
            <span>Họ và Tên</span>
          </label>
          <input
            type="text"
            placeholder="Nguyễn Văn A"
            {...register('name')}
            className="w-full bg-surface-page border border-borderSubtle rounded-xl px-3.5 py-2.5 text-sm text-textStrong focus:ring-2 focus:ring-cacao-500 outline-none transition-all"
          />
          {errors.name && (
            <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-textStrong flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-cacao-500" />
            <span>Địa chỉ Email</span>
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

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-textStrong flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cacao-500" />
            <span>Mật khẩu</span>
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className="w-full bg-surface-page border border-borderSubtle rounded-xl px-3.5 py-2.5 text-sm text-textStrong focus:ring-2 focus:ring-cacao-500 outline-none transition-all"
          />
          {errors.password && (
            <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-textStrong flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cacao-500" />
            <span>Xác nhận mật khẩu</span>
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            className="w-full bg-surface-page border border-borderSubtle rounded-xl px-3.5 py-2.5 text-sm text-textStrong focus:ring-2 focus:ring-cacao-500 outline-none transition-all"
          />
          {errors.confirmPassword && (
            <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit CTA */}
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full bg-cacao-600 hover:bg-cacao-700 text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <span>{isSubmitting ? 'Đang khởi tạo...' : 'Tạo Tài Khoản'}</span>
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </Button>
      </form>

      {/* Footer Login Link */}
      <div className="pt-4 border-t border-borderSubtle text-center text-xs text-textMuted">
        Đã có tài khoản?{' '}
        <Link href="/login" className="font-bold text-cacao-600 hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}

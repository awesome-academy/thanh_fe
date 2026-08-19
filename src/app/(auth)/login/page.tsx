'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Lock, Mail, UserCheck, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function getSanitizedCallbackUrl(rawUrl: string | null): string {
  if (!rawUrl || rawUrl.includes('\\')) return '/';
  try {
    const PARSE_ORIGIN = 'http://localhost';
    const parsed = new URL(rawUrl, PARSE_ORIGIN);
    if (parsed.origin !== PARSE_ORIGIN) return '/';
    const sanitized = parsed.pathname + parsed.search + parsed.hash;
    if (sanitized.includes('\\') || sanitized.startsWith('//')) return '/';
    return sanitized;
  } catch {
    return '/';
  }
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get('callbackUrl');
  const callbackUrl = getSanitizedCallbackUrl(rawCallback);

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        setServerError('Email hoặc mật khẩu không chính xác');
        setIsSubmitting(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setServerError('Đã xảy ra lỗi khi xác thực. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (email: string) => {
    setValue('email', email);
    setValue('password', 'password123');
    await onSubmit({ email, password: 'password123' });
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-surface-card border border-borderSubtle rounded-2xl shadow-xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-textStrong">Đăng Nhập TripGo</h1>
        <p className="text-xs text-textMuted leading-relaxed">
          Xác thực qua NextAuth.js để trải nghiệm dịch vụ đặt tour cao cấp
        </p>
      </div>

      {/* Demo Quick Login Panel */}
      <div className="p-4 bg-cacao-50/50 border border-cacao-100 rounded-xl space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-cacao-700">
          <UserCheck className="w-4 h-4 text-cacao-600" />
          <span>Đăng nhập nhanh Demo (NextAuth 1-Click)</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleQuickLogin('user@tripgo.com')}
            className="p-2.5 bg-white border border-borderSubtle hover:border-cacao-500 rounded-lg text-left transition-all hover:shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <p className="text-xs font-bold text-textStrong flex items-center gap-1">
              <span>Demo User</span>
            </p>
            <p className="text-[11px] text-textSubtle truncate">user@tripgo.com</p>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleQuickLogin('admin@tripgo.com')}
            className="p-2.5 bg-navy-900 border border-navy-800 hover:border-cacao-500 rounded-lg text-left transition-all hover:shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <p className="text-xs font-bold text-white flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cacao-400" />
              <span>Demo Admin</span>
            </p>
            <p className="text-[11px] text-textSubtle truncate">admin@tripgo.com</p>
          </button>
        </div>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Submit CTA */}
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full bg-cacao-600 hover:bg-cacao-700 text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <span>{isSubmitting ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </Button>
      </form>

      {/* Footer Register Link */}
      <div className="pt-4 border-t border-borderSubtle text-center text-xs text-textMuted">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="font-bold text-cacao-600 hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-textMuted">Đang tải...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}

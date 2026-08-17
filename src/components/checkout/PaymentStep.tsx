'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, QrCode, Building2, Wallet, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export type PaymentMethodType = 'momo' | 'vnpay' | 'transfer' | 'card';

interface PaymentStepProps {
  initialMethod: PaymentMethodType;
  onBack: () => void;
  onSubmit: (method: PaymentMethodType) => void;
}

const paymentOptions: {
  id: PaymentMethodType;
  title: string;
  desc: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'momo',
    title: 'Ví điện tử MoMo',
    desc: 'Thanh toán siêu tốc qua ứng dụng MoMo (Quét mã QR)',
    badge: 'Phổ biến nhất',
    icon: Wallet,
  },
  {
    id: 'vnpay',
    title: 'Cổng thanh toán VNPay',
    desc: 'Thẻ ATM nội địa, QR Pay ngân hàng hoặc ứng dụng VNPay',
    badge: 'Nhanh chóng',
    icon: QrCode,
  },
  {
    id: 'transfer',
    title: 'Chuyển khoản Ngân hàng (24/7)',
    desc: 'Chuyển khoản qua Internet Banking / VietQR tự động xác nhận',
    badge: 'Khuyên dùng',
    icon: Building2,
  },
  {
    id: 'card',
    title: 'Thẻ quốc tế (Visa / MasterCard / JCB)',
    desc: 'Thanh toán an toàn qua cổng mã hóa SSL 256-bit',
    badge: 'Quốc tế',
    icon: CreditCard,
  },
];

export default function PaymentStep({ initialMethod, onBack, onSubmit }: PaymentStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(initialMethod);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedMethod);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-surface-card border border-borderSubtle rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-borderSubtle pb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-textStrong flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cacao-600" />
            <span>Chọn phương thức thanh toán</span>
          </h2>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Bảo mật 100%</span>
          </span>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paymentOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedMethod === opt.id;

            return (
              <label
                key={opt.id}
                onClick={() => setSelectedMethod(opt.id)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-cacao-600 bg-cacao-50/40 shadow-md ring-2 ring-cacao-500/20'
                    : 'border-borderSubtle bg-surface-page hover:border-cacao-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-cacao-600 text-white' : 'bg-navy-900 text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-textStrong">{opt.title}</h3>
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-cacao-100 text-cacao-800">
                        {opt.badge}
                      </span>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => setSelectedMethod(opt.id)}
                    className="mt-1 accent-cacao-600 w-4 h-4 cursor-pointer"
                  />
                </div>

                <p className="text-xs text-textMuted leading-relaxed">{opt.desc}</p>
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          size="lg"
          className="border-borderSubtle text-textStrong hover:bg-surface-page font-bold py-3 px-6 rounded-xl flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </Button>

        <Button
          type="submit"
          size="lg"
          className="bg-cacao-600 hover:bg-cacao-700 text-white font-bold py-3 px-6 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span>Tiếp tục: Xác nhận đơn hàng</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}

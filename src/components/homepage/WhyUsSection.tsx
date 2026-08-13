'use client';

import { ShieldCheck, Clock, RefreshCw, Headphones } from 'lucide-react';

const reasons = [
  {
    icon: <ShieldCheck className="w-7 h-7 text-cacao-500" />,
    title: 'Giá Cả Minh Bạch',
    desc: 'Không chi phí ẩn. Cam kết giá tốt nhất thị trường với chất lượng vượt trội.',
  },
  {
    icon: <Clock className="w-7 h-7 text-cacao-500" />,
    title: 'Xác Nhận 24/7',
    desc: 'Đặt tour nhanh chóng và nhận vé điện tử ngay lập tức qua email/SMS.',
  },
  {
    icon: <RefreshCw className="w-7 h-7 text-cacao-500" />,
    title: 'Hủy Tour Miễn Phí',
    desc: 'Linh hoạt thay đổi lịch trình hoặc hoàn tiền 100% theo đúng chính sách.',
  },
  {
    icon: <Headphones className="w-7 h-7 text-cacao-500" />,
    title: 'Hỗ Trợ Tận Tâm',
    desc: 'Đội ngũ tư vấn đồng hành và hỗ trợ giải đáp thắc mắc suốt chuyến đi.',
  },
];

export default function WhyUsSection() {
  return (
    <section className="bg-navy-900 text-white py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-cacao-300">Tại Sao Chọn TripGo</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Trải Nghiệm Du Lịch Hoàn Hảo</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <div key={i} className="bg-navy-800/60 border border-navy-700 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-navy-700/80 flex items-center justify-center">
                {r.icon}
              </div>
              <h3 className="font-bold text-lg text-white">{r.title}</h3>
              <p className="text-xs text-textSubtle leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

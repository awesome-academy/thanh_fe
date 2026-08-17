'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, MapPin } from 'lucide-react';

interface ItineraryDay {
  day: number;
  title: string;
  content?: string;
  activities?: string[];
}

interface TourItineraryProps {
  daysCount?: number;
  itinerary?: ItineraryDay[];
}

export default function TourItinerary({ daysCount = 3, itinerary }: TourItineraryProps) {
  // Default mock itinerary if none provided
  const defaultItinerary: ItineraryDay[] = [
    {
      day: 1,
      title: 'Đón khách — Khởi hành chuyến đi — Khám phá điểm đến',
      activities: [
        '08:00 - Xe và HDV đón đoàn tại điểm hẹn trung tâm.',
        '10:30 - Đến điểm dừng nghỉ, nghỉ ngơi chụp ảnh.',
        '12:00 - Thưởng thức bữa trưa đặc sản tại nhà hàng địa phương.',
        '14:30 - Nhận phòng khách sạn, tự do bơi lội và khám phá.',
      ],
    },
    {
      day: 2,
      title: 'Trải nghiệm danh thắng nổi tiếng — Thưởng thức ẩm thực',
      activities: [
        '07:00 - Dùng điểm tâm sáng buffet tại khách sạn.',
        '08:30 - Tham quan di tích lịch sử và danh lam thắng cảnh.',
        '12:30 - Bữa trưa hải sản tươi sống tại nhà bè.',
        '18:30 - Tiệc tối nướng BBQ kết hợp chương trình giao lưu.',
      ],
    },
    {
      day: 3,
      title: 'Mua sắm đặc sản — Tiễn đoàn về lại điểm hẹn ban đầu',
      activities: [
        '07:30 - Ăn sáng, tự do dạo chợ mua quà lưu niệm.',
        '11:00 - Làm thủ tục trả phòng khách sạn.',
        '12:00 - Dùng bữa trưa nhẹ trước khi lên xe về.',
        '17:00 - Về đến điểm hẹn ban đầu, kết thúc chuyến đi tốt đẹp.',
      ],
    },
  ];

  const displayItinerary = itinerary && itinerary.length > 0 ? itinerary : defaultItinerary.slice(0, daysCount);
  const [openDays, setOpenDays] = useState<number[]>([1]);

  const toggleDay = (dayNum: number) => {
    if (openDays.includes(dayNum)) {
      setOpenDays(openDays.filter((d) => d !== dayNum));
    } else {
      setOpenDays([...openDays, dayNum]);
    }
  };

  return (
    <div className="space-y-4 bg-surface-card border border-borderSubtle rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-borderSubtle">
        <h3 className="text-lg font-bold text-textStrong flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cacao-600" />
          <span>Lịch Trình Chi Tiết ({displayItinerary.length} Ngày)</span>
        </h3>
      </div>

      <div className="space-y-3">
        {displayItinerary.map((item) => {
          const isOpen = openDays.includes(item.day);

          return (
            <div
              key={item.day}
              className="border border-borderSubtle rounded-xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleDay(item.day)}
                className="w-full bg-surface-page p-4 flex items-center justify-between text-left hover:bg-cacao-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-cacao-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    N{item.day}
                  </span>
                  <span className="font-bold text-textStrong text-sm">
                    {item.title}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-textMuted transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-cacao-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="p-4 bg-surface-card space-y-2 border-t border-borderSubtle text-xs text-textBody">
                  {item.content ? (
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-cacao-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item.content}</span>
                    </div>
                  ) : (
                    item.activities?.map((act, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <MapPin className="w-3.5 h-3.5 text-cacao-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{act}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

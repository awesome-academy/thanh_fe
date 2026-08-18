'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, MapPin } from 'lucide-react';

interface ItineraryDay {
  day: number;
  title: string;
  content: string;
}

interface TourItineraryProps {
  itinerary?: ItineraryDay[];
}

export default function TourItinerary({ itinerary }: TourItineraryProps) {
  const displayItinerary = itinerary ?? [];
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
          <span>
            Lịch Trình Chi Tiết
            {displayItinerary.length > 0 && ` (${displayItinerary.length} Ngày)`}
          </span>
        </h3>
      </div>

      {displayItinerary.length === 0 ? (
        <p className="py-8 text-center text-xs text-textMuted">
          Lịch trình chi tiết đang được cập nhật. Vui lòng liên hệ để được tư vấn cụ thể.
        </p>
      ) : (
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
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-cacao-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item.content}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

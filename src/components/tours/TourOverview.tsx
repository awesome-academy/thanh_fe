import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface TourOverviewProps {
  description: string;
  highlights: string[];
  included: string[];
  excluded: string[];
}

export default function TourOverview({
  description,
  highlights,
  included,
  excluded,
}: TourOverviewProps) {
  return (
    <div className="space-y-8 bg-surface-card border border-borderSubtle rounded-2xl p-6 shadow-sm">
      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-textStrong">Giới Thiệu Chuyến Đi</h3>
        <p className="text-sm text-textBody leading-relaxed">{description}</p>
      </div>

      {/* Highlights */}
      <div className="space-y-3 pt-4 border-t border-borderSubtle">
        <h3 className="text-base font-bold text-textStrong flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cacao-600" />
          <span>Điểm Nổi Bật Của Tour</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {highlights.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-textStrong font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inclusions vs Exclusions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-borderSubtle">
        {/* Included */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Dịch Vụ Bao Gồm</span>
          </h4>
          <ul className="space-y-2 text-xs text-textBody">
            {included.map((inc, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>{inc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Excluded */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-rose-500 flex items-center gap-1.5">
            <XCircle className="w-4 h-4" />
            <span>Không Bao Gồm</span>
          </h4>
          <ul className="space-y-2 text-xs text-textBody">
            {excluded.map((exc, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                <span>{exc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

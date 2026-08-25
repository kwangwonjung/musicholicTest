interface DateRangeFilterProps {
  dateRange: string;
  onPrev: () => void;
  onNext: () => void;
  onThisWeek: () => void;
}

export default function DateRangeFilter({
  dateRange,
  onPrev,
  onNext,
  onThisWeek,
}: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-600 font-medium min-w-[60px]">주간 범위</span>
      <div className="flex items-center justify-between flex-1 gap-2">
        <div className="flex items-center justify-between bg-gray-50 rounded-full px-4 py-1.5 flex-1 border border-gray-100">
          <button onClick={onPrev} className="text-blue-500 font-bold hover:bg-gray-100 rounded-full px-2">&lt;</button>
          <span className="text-xs text-gray-700">{dateRange}</span>
          <button onClick={onNext} className="text-blue-500 font-bold hover:bg-gray-100 rounded-full px-2">&gt;</button>
        </div>
        <button
          onClick={onThisWeek}
          className="bg-blue-600 text-white rounded-full px-4 py-1.5 text-xs font-medium shadow-sm whitespace-nowrap"
        >
          이번주
        </button>
      </div>
    </div>
  );
}
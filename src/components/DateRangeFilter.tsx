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
    <div className="flex items-center gap-2 sm:gap-4">
      <span className="text-gray-600 font-medium min-w-[60px]">주간 범위</span>
      <div className="flex items-center justify-between flex-1 gap-1 sm:gap-2">
        {/* 변경: px-4를 px-2 sm:px-4로 수정하여 모바일에서 패딩 축소 */}
        <div className="flex items-center justify-between bg-gray-50 rounded-full px-2 sm:px-4 py-1.5 flex-1 border border-gray-100">
          <button onClick={onPrev} className="text-blue-500 font-bold hover:bg-gray-100 rounded-full px-2">&lt;</button>
          
          {/* 변경: whitespace-nowrap 클래스 추가로 줄바꿈 방지 */}
          <span className="text-xs text-gray-700 whitespace-nowrap">{dateRange}</span>
          
          <button onClick={onNext} className="text-blue-500 font-bold hover:bg-gray-100 rounded-full px-2">&gt;</button>
        </div>
        {/* 변경: 이번주 버튼의 패딩도 모바일 환경을 고려해 약간 조정 */}
        <button
          onClick={onThisWeek}
          className="bg-blue-600 text-white rounded-full px-3 sm:px-4 py-1.5 text-xs font-medium shadow-sm whitespace-nowrap"
        >
          이번주
        </button>
      </div>
    </div>
  );
}
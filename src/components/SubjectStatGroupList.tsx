export interface SubjectItem {
  MODE?: string;
  TEST_GRP_NM: string;
  AVG_SCORE: number;
  SOLVE_CNT: number;
  UNIQUE_DAYS: number;
  MAX_SCORE: number;
  HINT_MAX: number;
  MIN_SCORE: number;
  HINT_MIN: number;
}

interface SubjectStatGroupListProps {
  subjects: SubjectItem[];
  emptyMessage?: string;
}

export default function SubjectStatGroupList({
  subjects,
  emptyMessage = "해당 조건에 등록된 데이터가 없습니다.",
}: SubjectStatGroupListProps) {
  if (!subjects || subjects.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400 text-xs">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {subjects.map((sub, sIdx) => (
        <div key={sIdx} className="bg-gray-50/60 rounded-xl p-3 border border-gray-200/60 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {sub.MODE && (
                <span className="shrink-0 px-2 py-0.5 bg-gray-200/80 text-gray-700 text-[11px] font-medium rounded-md">
                  {sub.MODE}
                </span>
              )}
              <span className="font-bold text-blue-900 text-xs sm:text-sm truncate">
                {sub.TEST_GRP_NM}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 shrink-0">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <circle cx="12" cy="12" r="5" strokeWidth="2" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
              <span>평균 {sub.AVG_SCORE}점</span>
            </div>
          </div>

          {/* 3열 그리드 통계 정보 */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200/50 text-xs">
            {/* 1열: 풀이 / 일수 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <div className="text-gray-400 text-[10px]">풀이</div>
                  <div className="font-bold text-gray-800">{sub.SOLVE_CNT}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-gray-400 text-[10px]">일수</div>
                  <div className="font-bold text-gray-800">{sub.UNIQUE_DAYS}</div>
                </div>
              </div>
            </div>

            {/* 2열: 최고점 / 힌트 MAX */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <div>
                  <div className="text-gray-400 text-[10px]">최고점</div>
                  <div className="font-bold text-gray-800">{sub.MAX_SCORE}점</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 block" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#e11d48" d="M12 1l1.8 2.3 2.9-.6 1 2.8 2.8 1-.6 2.9 2.3 1.8-1.8 2.3.6 2.9-2.8 1-1 2.8-2.9-.6-1.8 2.3-1.8-2.3-2.9.6-1-2.8-2.8-1 .6-2.9-2.3-1.8 1.8-2.3-.6-2.9 2.8-1 1-2.8 2.9.6L12 1z"/>
                  <text x="12" y="14" fill="#ffffff" fontSize="6.5" fontWeight="900" textAnchor="middle">MAX</text>
                </svg>
                <div>
                  <div className="text-gray-400 text-[10px]">힌트</div>
                  <div className="font-bold text-gray-800">{sub.HINT_MAX}</div>
                </div>
              </div>
            </div>

            {/* 3열: 최저점 / 힌트 MIN */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h.01M15 10h.01M9 15c1.5-1 4.5-1 6 0" />
                </svg>
                <div>
                  <div className="text-gray-400 text-[10px]">최저점</div>
                  <div className="font-bold text-gray-800">{sub.MIN_SCORE}점</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 block" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#16a34a" d="M12 1l1.8 2.3 2.9-.6 1 2.8 2.8 1-.6 2.9 2.3 1.8-1.8 2.3.6 2.9-2.8 1-1 2.8-2.9-.6-1.8 2.3-1.8-2.3-2.9.6-1-2.8-2.8-1 .6-2.9-2.3-1.8 1.8-2.3-.6-2.9 2.8-1 1-2.8 2.9.6L12 1z"/>
                  <text x="12" y="14" fill="#ffffff" fontSize="6.5" fontWeight="900" textAnchor="middle">MIN</text>
                </svg>
                <div>
                  <div className="text-gray-400 text-[10px]">힌트</div>
                  <div className="font-bold text-gray-800">{sub.HINT_MIN}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
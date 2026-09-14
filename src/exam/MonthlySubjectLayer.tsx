import { useState, useEffect } from 'react';

interface SubjectDayItem {
  TEST_GRP_NM: string;
  DAYS: number[];
}

interface MonthlySubjectLayerProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  selectedUser: string;
}

export default function MonthlySubjectLayer({
  isOpen,
  onClose,
  year,
  month,
  selectedUser,
}: MonthlySubjectLayerProps) {
  const [subjectData, setSubjectData] = useState<SubjectDayItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchSubjectDays = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const formattedMonth = String(month).padStart(2, '0');

        const response = await fetch(`${API_BASE_URL}/api/examstatus/selectMonthlySubject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            year: String(year),
            month: formattedMonth,
            tester: selectedUser === '전체 수험자' ? '정진명' : selectedUser,
          }),
        });
           
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const normalizedData = result.data.map((item: any) => {
            let daysArr: number[] = [];
            if (Array.isArray(item.DAYS)) {
              daysArr = item.DAYS;
            } else if (typeof item.DAYS === 'string') {
              daysArr = item.DAYS
                .replace(/[{}]/g, '')
                .split(',')
                .map((v: string) => Number(v.trim()))
                .filter((v: number) => !isNaN(v));
            }
            return {
              ...item,
              DAYS: daysArr,
            };
          });

          setSubjectData(normalizedData);
        } else {
          setSubjectData([]);
        }

      } catch (error) {
        console.error('과목별 공부 날짜 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectDays();
  }, [isOpen, year, month, selectedUser]);

  if (!isOpen) return null;

  const totalSubjectsCount = subjectData.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* 모달 헤더 */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
              📖
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 text-base">과목 수</span>
                <span className="font-extrabold text-emerald-600 text-base">{totalSubjectsCount}과목</span>
              </div>
              <p className="text-xs text-gray-400">해당 과목을 공부한 날짜입니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 모달 본문 (과목별 날짜 리스트) */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">데이터를 불러오는 중입니다...</div>
          ) : subjectData.length > 0 ? (
            subjectData.map((item, idx) => (
              <div key={idx} className="space-y-2 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* 기존 점(dot) 대신 1부터 20까지의 증가하는 숫자가 표시되도록 수정 (블루 톤 색상 유지) */}
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center border border-blue-100">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-gray-800 text-sm">{item.TEST_GRP_NM}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">{item.DAYS.length}일</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.DAYS.map((dayNum, dIdx) => (
                    <span
                      key={dIdx}
                      className="px-2.5 py-1 bg-gray-50 border border-gray-200/60 rounded-xl text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors cursor-default"
                    >
                      {dayNum}일
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400 text-sm">해당 월에 공부한 기록이 없습니다.</div>
          )}
        </div>

      </div>
    </div>
  );
}
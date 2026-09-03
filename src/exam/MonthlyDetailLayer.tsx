// src/components/MonthlyDetailLayer.tsx
import { useState, useEffect } from 'react';
import { getScoreColor } from '../utils/scoreUtils'; // 공통 유틸 함수 import 경로에 맞게 조정해주세요

interface MonthlyDetailLayerProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  day: number;
  selectedUser: string;
}

export default function MonthlyDetailLayer({ isOpen, onClose, year, month, day, selectedUser }: MonthlyDetailLayerProps) {
  const [solveList, setSolveList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchLayerData = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const formattedMonth = String(month).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        const startDate = `${year}-${formattedMonth}-${formattedDay}`;

        const payload = {
          startDate,
          tester: selectedUser === '전체 수험자' ? '정진명' : selectedUser,
        };

        const res = await fetch(`${API_BASE_URL}/api/examstatus/selectMonthlyLayer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setSolveList(result.data);
        } else {
          setSolveList([]);
        }
      } catch (error) {
        console.error('레이어 데이터 조회 에러:', error);
        setSolveList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLayerData();
  }, [isOpen, year, month, day, selectedUser]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-5 space-y-4 relative animate-in fade-in zoom-in duration-200">
        {/* 모달 헤더 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner text-base">
              📅
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">{selectedUser}님의 {year}년 {month}월 {day}일 풀이 내역</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {loading ? '불러오는 중...' : `총 ${solveList.length}개의 풀이 내역이 있습니다.`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 풀이 내역 리스트 */}
        <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
          {loading ? (
            <div className="text-center py-10 text-xs text-gray-400">데이터를 불러오는 중입니다...</div>
          ) : solveList.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-400">풀이 내역이 없습니다.</div>
          ) : (
            solveList.map((item, index) => {
              const badgeStyle = item.MODE === '객관식' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-purple-100 text-purple-700';

              const scoreValue = Number(item.TEST_SCORE) || 0;

              return (
                <div 
                  key={index} 
                  className="grid grid-cols-[1fr_auto] items-center border border-gray-100 bg-gray-50/50 hover:bg-white transition-colors rounded-2xl p-3.5 shadow-sm gap-x-4"
                >
                  {/* 왼쪽 영역 (상단: 배지 / 하단: 타이틀) */}
                  <div className="space-y-2">
                    <div>
                      <span className={`inline-block text-[10px] ${badgeStyle} px-2 py-0.5 rounded-md font-semibold`}>
                        {item.MODE}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-800">{item.TEST_GRP_NM}</span>
                    </div>
                  </div>

                  {/* 오른쪽 영역 (상단: 점수 & 힌트 / 하단: 시간) */}
                  <div className="space-y-2 flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${getScoreColor(scoreValue)}`}>
                        {item.TEST_SCORE}점
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <span>💡</span>
                        <span className="font-semibold text-gray-700">{item.HINT_CNT ?? 0}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.DURATION}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
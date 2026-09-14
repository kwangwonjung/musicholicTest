import { useState, useEffect } from 'react';
import SubjectStatGroupList, { type SubjectItem } from '../components/SubjectStatGroupList';

export interface TesterGroup {
  TESTER: string;
  TOTAL_CNT: number;
  subjects: SubjectItem[];
}

interface MonthlySolveCountLayerProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  selectedUser: string;
}

export default function MonthlySolveCountLayer({
  isOpen,
  onClose,
  year,
  month,
  selectedUser,
}: MonthlySolveCountLayerProps) {
  const [testerGroups, setTesterGroups] = useState<TesterGroup[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchSolveCountDetail = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const formattedMonth = String(month).padStart(2, '0');
        
        const startDate = `${year}-${formattedMonth}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${year}-${formattedMonth}-${String(lastDay).padStart(2, '0')}`;

        const response = await fetch(`${API_BASE_URL}/api/examstatus/selectPeriod`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'detail',
            startDate,
            endDate,
            tester: selectedUser === '전체 수험자' ? '' : selectedUser,
            testGrpNm: '',
          }),
        });

        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setTesterGroups(result.data);
        } else {
          setTesterGroups([]);
        }
      } catch (error) {
        console.error('월별 총 풀이 횟수 상세 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolveCountDetail();
  }, [isOpen, year, month, selectedUser]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* 모달 헤더 */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
              📄
            </div>
            <div>
              <span className="font-bold text-gray-900 text-base">총 풀이 상세 내역</span>
              <p className="text-xs text-gray-400">{year}년 {month}월 통계입니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">데이터를 불러오는 중입니다...</div>
          ) : testerGroups.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
              해당 월에 풀이한 기록이 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {testerGroups.map((group, gIdx) => (
                <SubjectStatGroupList key={gIdx} subjects={group.subjects} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
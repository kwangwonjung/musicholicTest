// src/exam/MonthlyTab.tsx
import { useState, useEffect, useCallback } from 'react';
import UserSelectFilter from '../components/UserSelectFilter';

export default function MonthlyTab() {
  const [selectedUser, setSelectedUser] = useState('정진명');
  
  // 20일 기준 디폴트 월 설정 (20일 초과: 현재월, 20일 이하: 전월)
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed (0~11)
    const day = now.getDate();

    if (day > 20) {
      return new Date(year, month, 1);
    } else {
      return new Date(year, month - 1, 1);
    }
  });

  const [calendarDays, setCalendarDays] = useState<any[]>([]);
  const [summary, setSummary] = useState({ total_solves: 0, unique_subjects: 0, attendance_days: 0 });
  const [loading, setLoading] = useState(false);

  const userList = ['정진명', '정민규', '강지원', '강지우', '언노운'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // 캘린더 및 월별 합계 데이터를 병렬로 조회하는 함수
  const fetchMonthlyData = useCallback(async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const formattedMonth = String(month).padStart(2, '0');
      const payload = {
        year: String(year),
        month: formattedMonth,
        tester: selectedUser === '전체 수험자' ? '정진명' : selectedUser,
      };

      // 2개의 API를 병렬로 동시 호출
      const [calendarRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/examstatus/selectMonthlyCalendar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
        fetch(`${API_BASE_URL}/api/examstatus/selectMonthlySum`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
      ]);

      const calendarResult = await calendarRes.json();
      const summaryResult = await summaryRes.json();

      // 1. 캘린더 데이터 바인딩
      if (calendarResult.success && Array.isArray(calendarResult.data)) {
        const formattedDays = calendarResult.data.map((item: any) => {
          const dayNum = parseInt(item.day.split('-')[2], 10);
          const countVal = Number(item.count || 0);

          return {
            day: dayNum,
            current: item.current,
            count: item.current ? (countVal > 0 ? `${countVal}회` : '-') : null,
            attendance: item.current ? countVal > 0 : false,
          };
        });
        setCalendarDays(formattedDays);
      } else {
        console.error('달력 데이터 조회 실패:', calendarResult.message);
      }

      // 2. 월별 합계 데이터 바인딩
      if (summaryResult.success && summaryResult.data?.[0]) {
        setSummary(summaryResult.data[0]);
      } else {
        console.error('월별 합계 데이터 조회 실패:', summaryResult.message);
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
    } finally {
      setLoading(false);
    }
  }, [year, month, selectedUser]);

  // 연도/월 또는 수험자가 변경될 때 자동 조회
  useEffect(() => {
    fetchMonthlyData();
  }, [fetchMonthlyData]);

  const handlePrevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const handleSearch = () => {
    fetchMonthlyData();
  };

  const handleDayClick = (dayObj: any) => {
    if (dayObj.current && dayObj.count !== '-') {
      alert(`${year}년 ${month}월 ${dayObj.day}일의 문제 풀이 목록을 확인할 수 있습니다.`);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-1 overflow-y-auto pb-6">
      {/* 수험자 필터 및 사용 현황 카드 통합 영역 */}
      <div className="bg-white p-4 rounded-2xl shadow-sm space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <UserSelectFilter
              users={userList}
              selectedUser={selectedUser}
              onChangeUser={setSelectedUser}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="shrink-0 flex items-center justify-center w-[36px] h-[36px] bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
            title="조회"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1 text-blue-600">
              📄
            </div>
            <span className="text-[11px] text-gray-500 font-medium">총 풀이 횟수</span>
            <span className="text-sm font-bold text-blue-600">{summary.total_solves}회</span>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mb-1 text-emerald-600">
              📖
            </div>
            <span className="text-[11px] text-gray-500 font-medium">과목 수</span>
            <span className="text-sm font-bold text-emerald-600">{summary.unique_subjects}과목</span>
          </div>

          <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mb-1 text-orange-600">
              📅
            </div>
            <span className="text-[11px] text-gray-500 font-medium">출석 일수</span>
            <span className="text-sm font-bold text-orange-600">{summary.attendance_days}일</span>
          </div>
        </div>
      </div>

      {/* 캘린더 영역 */}
      <div className="bg-white p-4 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between px-2">
          <button onClick={handlePrevMonth} className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
            &lt;
          </button>
          <div className="font-bold text-gray-800">{year}년 {month}월</div>
          <button onClick={handleNextMonth} className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
            &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-500">
          <span className="text-red-500">일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span className="text-blue-500">토</span>
        </div>

        <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
          {calendarDays.map((item, index) => (
            <div
              key={index}
              onClick={() => handleDayClick(item)}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                item.selected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              } ${item.current ? 'cursor-pointer' : 'opacity-40'}`}
            >
              <span className={`font-semibold ${
                index % 7 === 0 ? 'text-red-500' : index % 7 === 6 ? 'text-blue-500' : 'text-gray-700'
              }`}>
                {item.day}
              </span>
              
              {item.current ? (
                <div className="flex flex-col items-center h-5 justify-center mt-0.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    item.count && item.count !== '-' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-400'
                  }`}>
                    {item.count}
                  </span>
                  {item.attendance && (
                    <span className="w-1 h-1 bg-orange-500 rounded-full mt-0.5"></span>
                  )}
                </div>
              ) : (
                <div className="h-5"></div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-gray-100 rounded-full"></span>
            <span>풀이 없음</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-blue-100 rounded-full"></span>
            <span>1회 이상</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            <span>출석</span>
          </div>
        </div>
      </div>

      {/* 팁 박스 */}
      <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-3 flex items-start gap-2.5">
        <span className="text-orange-500 text-base">💡</span>
        <div className="text-[11px] text-orange-800 leading-tight pt-0.5">
          <strong className="font-bold">TIP</strong> 날짜를 클릭하면 해당 날짜의 문제 풀이 목록을 확인할 수 있어요.
        </div>
      </div>
    </div>
  );
}
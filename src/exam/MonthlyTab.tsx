// src/exam/MonthlyTab.tsx
import { useState } from 'react';
import UserSelectFilter from '../components/UserSelectFilter';

export default function MonthlyTab() {
  const [selectedUser, setSelectedUser] = useState('전체 수험자');
  const [currentDate, setCurrentDate] = useState(new Date(2024, 7, 1)); // 2024년 8월 기준 하드코딩

  const userList = ['정진명', '정민규', '강지원', '강지우', '언노운'];

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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // 하드코딩된 2024년 8월 달력 데이터 (이미지 기준 매칭)
  const calendarDays = [
    { day: 28, count: null, current: false, attendance: false },
    { day: 29, count: null, current: false, attendance: false },
    { day: 30, count: null, current: false, attendance: false },
    { day: 31, count: null, current: false, attendance: false },
    { day: 1, count: '-', current: true, attendance: false },
    { day: 2, count: '-', current: true, attendance: false },
    { day: 3, count: '1회', current: true, attendance: true },
    
    { day: 4, count: '-', current: true, attendance: false },
    { day: 5, count: '1회', current: true, attendance: true },
    { day: 6, count: '2회', current: true, attendance: true },
    { day: 7, count: '-', current: true, attendance: false },
    { day: 8, count: '-', current: true, attendance: false },
    { day: 9, count: '1회', current: true, attendance: true },
    { day: 10, count: '1회', current: true, attendance: true },

    { day: 11, count: '-', current: true, attendance: false },
    { day: 12, count: '2회', current: true, attendance: true },
    { day: 13, count: '-', current: true, attendance: false },
    { day: 14, count: '1회', current: true, attendance: true },
    { day: 15, count: '-', current: true, attendance: false },
    { day: 16, count: '1회', current: true, attendance: true },
    { day: 17, count: '-', current: true, attendance: false },

    { day: 18, count: '1회', current: true, attendance: true },
    { day: 19, count: '-', current: true, attendance: false },
    { day: 20, count: '2회', current: true, attendance: true },
    { day: 21, count: '-', current: true, attendance: false },
    { day: 22, count: '1회', current: true, attendance: true },
    { day: 23, count: '-', current: true, attendance: false },
    { day: 24, count: '1회', current: true, attendance: true },

    { day: 25, count: '-', current: true, attendance: false },
    { day: 26, count: '-', current: true, attendance: false },
    { day: 27, count: '1회', current: true, attendance: true },
    { day: 28, count: '1회', current: true, attendance: true, selected: true },
    { day: 29, count: '-', current: true, attendance: false },
    { day: 30, count: '-', current: true, attendance: false },
    { day: 31, count: '-', current: true, attendance: false },
  ];

  const handleSearch = () => {
    alert(`${year}년 ${month}월 데이터를 조회합니다.`);
  };

  const handleDayClick = (dayObj: any) => {
    if (dayObj.current && dayObj.count !== '-') {
      alert(`${year}년 ${month}월 ${dayObj.day}일의 문제 풀이 목록을 확인합니다.`);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-3 overflow-y-auto pb-6">
      {/* 상단 수험자 필터 및 돋보기 버튼 영역 */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
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
            className="shrink-0 flex items-center justify-center w-[42px] h-[42px] bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
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
      </div>

      {/* 사용 현황 카드 영역 (평균 점수 제외, 3개 배치) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm space-y-3">
        <div className="text-xs font-bold text-gray-700">{year}년 {month}월 사용 현황</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1 text-blue-600">
              📄
            </div>
            <span className="text-[11px] text-gray-500 font-medium">총 풀이 횟수</span>
            <span className="text-sm font-bold text-blue-600">12회</span>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mb-1 text-emerald-600">
              📖
            </div>
            <span className="text-[11px] text-gray-500 font-medium">과목 수</span>
            <span className="text-sm font-bold text-emerald-600">4과목</span>
          </div>

          <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mb-1 text-orange-600">
              📅
            </div>
            <span className="text-[11px] text-gray-500 font-medium">출석 일수</span>
            <span className="text-sm font-bold text-orange-600">8일</span>
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
            <span>1회</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-emerald-100 rounded-full"></span>
            <span>2~3회</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-purple-100 rounded-full"></span>
            <span>4회 이상</span>
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
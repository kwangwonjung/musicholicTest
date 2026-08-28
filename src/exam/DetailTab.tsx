// src/exam/DetailedTab.tsx
import { useState, useEffect } from 'react';
import DateRangeFilter from '../components/DateRangeFilter';
import UserSelectFilter from '../components/UserSelectFilter';

interface ApiResponseItem {
  SEQ: number;
  TESTER: string;
  TEST_DATE: string;
  DIS_TEST_DATE: string;
  TEST_GRP_NM: string;
  TEST_SCORE: number;
  CORRECT_CNT: number;
  TOTAL_CNT: number;
  DURATION: string;
  CREATED_AT: string;
  USE_YN: string;
}

interface DetailSummaryItem {
  title: string;
  count: number;
  maxScore: number;
  status: string;
}

interface TesterDailyGroup {
  [date: string]: DetailSummaryItem[];
}

interface TesterProcessedData {
  weekly: DetailSummaryItem[];
  daily: TesterDailyGroup;
  totalTesterCount: number; // 수험자별 총 건수 저장을 위한 필드 추가
}

interface GroupedData {
  [tester: string]: TesterProcessedData;
}

const getWeekBoundaries = (date: Date) => {
  const target = new Date(date);
  const day = target.getDay();
  const diffToMonday = target.getDate() - day + (day === 0 ? -6 : 1);
  
  const monday = new Date(target);
  monday.setDate(diffToMonday);
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return { monday, sunday };
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DetailedTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState('전체 수험자');
  
  const [groupedData, setGroupedData] = useState<GroupedData>({});
  const [isLoading, setIsLoading] = useState(false);

  const userList = ['전체 수험자', '정진명', '정민규','강지원','강지우','언노운'];

  const { monday, sunday } = getWeekBoundaries(currentDate);
  const dateRangeText = `${monday.getMonth() + 1}/${String(monday.getDate()).padStart(2, '0')} ~ ${sunday.getMonth() + 1}/${String(sunday.getDate()).padStart(2, '0')}`;

  const fetchExamStatus = async () => {
    setIsLoading(true);
    try {
      const startDateStr = formatDate(monday);
      
      const apiEndDate = new Date(sunday);
      apiEndDate.setDate(apiEndDate.getDate() + 1);
      const endDateStr = formatDate(apiEndDate);

      const requestBody: any = {
        startDate: startDateStr,
        endDate: endDateStr,
      };

      if (selectedUser !== '전체 수험자') {
        requestBody.tester = selectedUser;
      }

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

      const response = await fetch(`${API_BASE_URL}/api/examstatus/selectTestRst`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || '데이터를 불러오는데 실패했습니다.');
      }
      
      if (Array.isArray(result.data)) {
        const grouped: GroupedData = {};

        result.data.forEach((item: ApiResponseItem) => {
          const tester = item.TESTER;
          const date = item.DIS_TEST_DATE;
          const title = item.TEST_GRP_NM;
          const score = Number(item.TEST_SCORE) || 0;
          const status = item.USE_YN === 'Y' ? '사용' : '미사용';

          if (!grouped[tester]) {
            grouped[tester] = {
              weekly: [],
              daily: {},
              totalTesterCount: 0 // 초기화
            };
          }

          // 수험자별 전체 API 데이터 건수 카운트 증가
          grouped[tester].totalTesterCount += 1;

          if (!grouped[tester].daily[date]) {
            grouped[tester].daily[date] = [];
          }

          let dailySummary = grouped[tester].daily[date].find(s => s.title === title);
          if (!dailySummary) {
            dailySummary = { title, count: 0, maxScore: -1, status: '미사용' };
            grouped[tester].daily[date].push(dailySummary);
          }
          dailySummary.count += 1;
          if (score > dailySummary.maxScore) {
            dailySummary.maxScore = score;
            dailySummary.status = status;
          }

          let weeklySummary = grouped[tester].weekly.find(s => s.title === title);
          if (!weeklySummary) {
            weeklySummary = { title, count: 0, maxScore: -1, status: '미사용' };
            grouped[tester].weekly.push(weeklySummary);
          }
          weeklySummary.count += 1;
          if (score > weeklySummary.maxScore) {
            weeklySummary.maxScore = score;
            weeklySummary.status = status;
          }
        });

        setGroupedData(grouped);
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExamStatus();
  }, [currentDate, selectedUser]);

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const handleThisWeek = () => {
    setCurrentDate(new Date());
  };

  const getScoreColor = (score: number) => {
    if (score === 100) return 'text-red-500';      
    if (score > 80 && score < 100) return 'text-green-600'; 
    if (score >= 60 && score <= 80) return 'text-blue-500';  
    return 'text-gray-400'; 
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* 상단 고정 영역 */}
      <div className="shrink-0">
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 space-y-4">
          <DateRangeFilter
            dateRange={dateRangeText}
            onPrev={handlePrevWeek}
            onNext={handleNextWeek}
            onThisWeek={handleThisWeek}
          />
          {/* ⭐️ UserSelectFilter와 독립된 돋보기 버튼 가로 배치 */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <UserSelectFilter
                users={userList}
                selectedUser={selectedUser}
                onChangeUser={setSelectedUser}
              />
            </div>
            
            <button
              onClick={fetchExamStatus}
              /* ⭐️ 사이즈 수정됨: w-11 h-11 -> w-[42px] h-[42px] (수험자 콤보박스 높이와 일치) */
              className="shrink-0 flex items-center justify-center w-[36px] h-[36px] bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
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
      </div>

      {/* 하단 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 pb-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
            데이터를 처리하는 중입니다...
          </div>
        ) : Object.keys(groupedData).length > 0 ? (
          Object.entries(groupedData).map(([tester, data]) => (
            <div key={tester} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5">
              
              {/* 수험자 이름 헤더 (수험자별 총 건수로 표기 변경) */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  {tester}
                </h3>
                <span className="text-xs text-gray-400 font-medium">
                  총 건수: {data.totalTesterCount}건
                </span>
              </div>

              {/* 주간 합계 영역 */}
              {data.weekly && data.weekly.length > 0 && (
                <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100/80 space-y-2">
                  <div className="text-xs font-bold text-blue-600 flex items-center gap-1.5 px-1">
                    <span>📊 주간 합계</span>
                  </div>
                  <div className="space-y-2">
                    {data.weekly.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between bg-white p-3 rounded-xl text-xs transition-all border border-blue-100/60 shadow-xs"
                      >
                        <div className="font-semibold text-gray-800 text-[13px]">
                          {item.title}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 font-medium">
                            {item.count}건
                          </span>
                          <span className={`font-bold text-sm ${getScoreColor(item.maxScore)}`}>
                            최고 {item.maxScore}점
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 일자별 상세 영역 */}
              <div className="space-y-4 pt-1">
                <div className="text-xs font-bold text-gray-400 px-1">
                  일자별 상세
                </div>
                {Object.entries(data.daily).map(([date, items]) => (
                  <div key={date} className="space-y-2 pt-3 border-t border-gray-50 first:border-t-0 first:pt-0">
                    
                    <div className="text-xs font-semibold text-gray-500 px-1">
                      {date}
                    </div>

                    <div className="space-y-2">
                      {items.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between bg-gray-50/70 hover:bg-gray-50 p-3 rounded-xl text-xs transition-all border border-gray-100/50 w-full"
                        >
                          <div className="space-y-0.5">
                            <div className="font-medium text-gray-800 text-[13px]">
                              {item.title}
                            </div>
                            <div className="text-gray-500 text-[11px]">
                              진행 건수: <span className="font-bold text-blue-600">{item.count}건</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`font-bold text-sm ${getScoreColor(item.maxScore)}`}>
                              최고 {item.maxScore}점
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                              item.status === '사용'
                                ? 'border-blue-300 text-blue-500 bg-blue-50'
                                : 'border-gray-200 text-gray-500 bg-gray-50'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
            해당 조건에 등록된 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
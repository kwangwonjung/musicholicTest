// src/App.tsx
import { useState, useEffect } from 'react';
import StatusFilter from './components/StatusFilter';
import DateRangeFilter from './components/DateRangeFilter';
import UserSelectFilter from './components/UserSelectFilter';
import RecordList from './components/RecordList';
import type { RecordType } from './types/record'; 

// 서버에서 받아오는 개별 데이터 타입 정의
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

// 해당 주의 월요일과 일요일 Date 객체를 구하는 함수[cite: 1]
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

// Date 객체를 'YYYY-MM-DD' 문자열로 변환하는 함수
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  const [status, setStatus] = useState('전체');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState('전체 수험자');
  
  const [records, setRecords] = useState<RecordType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ⭐️ 수험자 목록 고정 세팅[cite: 1]
  const userList = ['전체 수험자', '정진명', '정민규','강지원','강지우','언노운'];

  const { monday, sunday } = getWeekBoundaries(currentDate);
  const dateRangeText = `${monday.getMonth() + 1}/${String(monday.getDate()).padStart(2, '0')} ~ ${sunday.getMonth() + 1}/${String(sunday.getDate()).padStart(2, '0')}`;

  // ⭐️ API 호출 및 조건 세팅 (주간 날짜, 사용여부, 수험자 변경 시 자동 호출)
  useEffect(() => {
    const fetchExamStatus = async () => {
      setIsLoading(true);
      try {
        // 1. 주간 시작일/종료일 계산 (일요일 데이터 포함을 위해 종료일에 +1일)
        const startDateStr = formatDate(monday);
        
        const apiEndDate = new Date(sunday);
        apiEndDate.setDate(apiEndDate.getDate() + 1);
        const endDateStr = formatDate(apiEndDate);

        // 2. Body에 보낼 기본 조건 세팅 (필수)
        const requestBody: any = {
          startDate: startDateStr,
          endDate: endDateStr,
        };

        // 3. 사용여부(useYn) 조건 추가 (전체가 아닐 때만)
        if (status === '사용') {
          requestBody.useYn = 'Y';
        } else if (status === '미사용') {
          requestBody.useYn = 'N';
        }

        // 4. 수험자(tester) 조건 추가 (전체 수험자가 아닐 때만)
        if (selectedUser !== '전체 수험자') {
          requestBody.tester = selectedUser;
        }

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

        // 5. REST API POST 호출
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
          // 서버 응답 데이터를 기존 그리드 포맷에 맞게 매핑[cite: 1]
          const mappedData: RecordType[] = result.data.map((item: ApiResponseItem) => ({
            id: item.SEQ,
            name: item.TESTER,
            date: item.DIS_TEST_DATE,
            title: item.TEST_GRP_NM,
            score: item.TEST_SCORE,
            time: item.DURATION,
            status: item.USE_YN === 'Y' ? '사용' : '미사용',
          }));

          setRecords(mappedData);
        }
      } catch (error) {
        console.error('API 호출 에러:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamStatus();
  }, [currentDate, status, selectedUser]); // 날짜나 필터가 바뀔 때마다 API 재조회

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

  return (
    <main className="max-w-md mx-auto bg-gray-50 min-h-screen p-4 text-sm font-sans">
      <div className="flex bg-gray-200 rounded-lg overflow-hidden mb-6">
        <button className="flex-1 bg-white py-3 font-bold shadow-sm">주별</button>
        <button className="flex-1 py-3 text-gray-500">월별</button>
        <button className="flex-1 py-3 text-gray-500">상세</button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 space-y-4">
        <StatusFilter selectedStatus={status} onChangeStatus={setStatus} />
        <DateRangeFilter
          dateRange={dateRangeText}
          onPrev={handlePrevWeek}
          onNext={handleNextWeek}
          onThisWeek={handleThisWeek}
        />
        <UserSelectFilter
          users={userList}
          selectedUser={selectedUser}
          onChangeUser={setSelectedUser}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
          데이터를 불러오는 중입니다...
        </div>
      ) : records.length > 0 ? (
        <RecordList records={records} />
      ) : (
        <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
          해당 조건에 등록된 데이터가 없습니다.
        </div>
      )}
    </main>
  );
}
// src/exam/WeeklyTab.tsx
import { useState, useEffect } from 'react';
import StatusFilter from '../components/StatusFilter';
import DateRangeFilter from '../components/DateRangeFilter';
import UserSelectFilter from '../components/UserSelectFilter';
import RecordList from '../components/RecordList';
import type { RecordType } from '../types/record'; 

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

export default function WeeklyTab() {
  const [status, setStatus] = useState('전체');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState('전체 수험자');
  
  const [records, setRecords] = useState<RecordType[]>([]);
  const [originalRecords, setOriginalRecords] = useState<RecordType[]>([]); 
  const [isLoading, setIsLoading] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

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

      if (status === '사용') {
        requestBody.useYn = 'Y';
      } else if (status === '미사용') {
        requestBody.useYn = 'N';
      }

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
        setOriginalRecords(JSON.parse(JSON.stringify(mappedData))); 
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExamStatus();
  }, [currentDate, status, selectedUser]);

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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '12340') {
      setIsEditMode(true);
      setIsPasswordModalOpen(false);
      setPasswordInput('');
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleUserChange = (id: number, newName: string) => {
    setRecords(prev => prev.map(item => item.id === id ? { ...item, name: newName } : item));
  };

  // ⭐️ 상태 양방향 토글 핸들러 ('사용' <-> '미사용')
  const handleStatusToggle = (id: number) => {
    setRecords(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === '사용' ? '미사용' : '사용';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const handleSaveComplete = async () => {
    const modifiedItems = records.filter((record) => {
      const original = originalRecords.find(orig => orig.id === record.id);
      if (!original) return false;
      return record.name !== original.name || record.status !== original.status;
    });

    if (modifiedItems.length === 0) {
      setIsEditMode(false);
      return;
    }

    try {
      setIsLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

      const payload = modifiedItems.map(item => ({
        SEQ: item.id,
        TESTER: item.name,
        USE_YN: item.status === '사용' ? 'Y' : 'N',
      }));

      const response = await fetch(`${API_BASE_URL}/api/examstatus/updateTestRst`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: payload }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || '데이터 수정에 실패했습니다.');
      }

      alert('성공적으로 수정되었습니다.');
      setIsEditMode(false);
      await fetchExamStatus();
    } catch (error) {
      console.error('수정 API 호출 에러:', error);
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-2 space-y-4">
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

      <div className="flex justify-end mb-3">
        {isEditMode ? (
          <button
            onClick={handleSaveComplete}
            className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-red-600 transition-all cursor-pointer"
          >
            수정 완료
          </button>
        ) : (
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
          >
            수정모드
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
          데이터를 처리하는 중입니다...
        </div>
      ) : records.length > 0 ? (
        <RecordList 
          records={records} 
          isEditMode={isEditMode}
          userList={userList}
          onUserChange={handleUserChange}
          onStatusToggle={handleStatusToggle}
        />
      ) : (
        <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
          해당 조건에 등록된 데이터가 없습니다.
        </div>
      )}

      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-gray-800 text-base">수정모드 비밀번호 입력</h3>
            <p className="text-xs text-gray-500">수정 권한 비밀번호를 입력해주세요.</p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordInput('');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 cursor-pointer"
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
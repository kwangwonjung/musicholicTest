import { useState, useEffect } from 'react';
import SubjectStatGroupList, { type SubjectItem } from '../components/SubjectStatGroupList';

export interface TesterGroup {
  TESTER: string;
  TOTAL_CNT: number;
  subjects: SubjectItem[];
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PeriodTab() {
  const [criteria, setCriteria] = useState('과목별');
  
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return formatDate(d);
  });
  
  const [endDate, setEndDate] = useState(() => {
    return formatDate(new Date());
  });

  const [subjectQuery, setSubjectQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('전체 수험자');
  const [testerGroups, setTesterGroups] = useState<TesterGroup[]>([]);

  const userList = ['전체 수험자', '정진명', '정민규', '강지원', '강지우', '언노운'];

  const fetchTestData = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      
      const response = await fetch(`${API_BASE_URL}/api/examstatus/selectPeriod`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: criteria === '과목별' ? 'subject' : 'detail',
            startDate,
            endDate,
            tester: selectedUser === '전체 수험자' ? '' : selectedUser,
            testGrpNm: subjectQuery,
          })
        });
      
      const result = await response.json();
      if (result.success) {
        setTesterGroups(result.data);
      } else {
        console.error('데이터 조회 실패:', result.message);
      }
    } catch (error) {
      console.error('API 요청 오류:', error);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* 상단 필터 영역 */}
      <div className="shrink-0">
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 space-y-4">
          
          {/* 기준 필터 (과목별, 상세 버튼) */}
          <div className="flex items-center gap-2">
            <span className="shrink-0 w-12 text-sm font-medium text-gray-700">기준</span>
            <div className="flex bg-gray-100 p-1 rounded-xl flex-1">
              <button
                type="button"
                onClick={() => setCriteria('과목별')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  criteria === '과목별' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                과목별
              </button>
              <button
                type="button"
                onClick={() => setCriteria('상세')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  criteria === '상세' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                상세
              </button>
            </div>
          </div>
          
          {/* 기간 필터 */}
          <div className="flex items-center gap-2">
            <span className="shrink-0 w-12 text-sm font-medium text-gray-700">기간</span>
            <div className="flex-1 flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-xl shadow-sm min-w-0">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs text-gray-700 focus:outline-none bg-transparent min-w-0"
              />
              <span className="text-gray-400 shrink-0">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs text-gray-700 focus:outline-none bg-transparent min-w-0"
              />
            </div>
          </div>

          {/* 과목명 필터 */}
          <div className="flex items-center gap-2">
            <span className="shrink-0 w-12 text-sm font-medium text-gray-700">과목명</span>
            <input
              type="text"
              value={subjectQuery}
              onChange={(e) => setSubjectQuery(e.target.value)}
              placeholder="과목명을 입력하세요"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 shadow-sm flex-1"
            />
          </div>

          {/* 수험자 필터 */}
          <div className="flex items-center gap-2">
            <span className="shrink-0 w-12 text-sm font-medium text-gray-700">수험자</span>
            <div className="flex-1 relative">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer"
              >
                {userList.map((user, idx) => (
                  <option key={idx} value={user}>{user}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={fetchTestData}
              className="shrink-0 flex items-center justify-center w-[36px] h-[36px] bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
              title="조회"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* 하단 결과 리스트 영역 */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 pb-4">
        {testerGroups.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
            해당 조건에 등록된 데이터가 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {testerGroups.map((group, gIdx) => (
              <div key={gIdx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
                {/* 수험자 그룹 헤더 */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span className="font-bold text-gray-800 text-sm">{group.TESTER}</span>
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    총 건수: <span className="font-bold text-gray-800">{group.TOTAL_CNT}건</span>
                  </div>
                </div>

                {/* 공통 컴포넌트에는 과목 리스트만 전달 */}
                <SubjectStatGroupList subjects={group.subjects} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
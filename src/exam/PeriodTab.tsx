// src/exam/PeriodTab.tsx
import { useState } from 'react';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface SubjectItem {
  subjectName: string;
  avgScore: number;
  solveCount: number;
  uniqueDays: number;
  maxScore: number;
  hintMax: number;
  minScore: number;
  hintMin: number;
}

interface TesterGroup {
  tester: string;
  totalCount: number;
  subjects: SubjectItem[];
}

const initialTesterGroups: TesterGroup[] = [
  {
    tester: '정민규',
    totalCount: 19,
    subjects: [
      {
        subjectName: '800.42. 초등사+사이트 워드',
        avgScore: 100,
        solveCount: 28,
        uniqueDays: 28,
        maxScore: 100,
        hintMax: 322,
        minScore: 100,
        hintMin: 10,
      },
      {
        subjectName: '800.43. 중등사+핵심 워드',
        avgScore: 95,
        solveCount: 15,
        uniqueDays: 12,
        maxScore: 98,
        hintMax: 210,
        minScore: 80,
        hintMin: 5,
      },
    ],
  },
  {
    tester: '정진명',
    totalCount: 12,
    subjects: [
      {
        subjectName: '700.10. 기본 단어 완성',
        avgScore: 88,
        solveCount: 12,
        uniqueDays: 10,
        maxScore: 95,
        hintMax: 150,
        minScore: 70,
        hintMin: 2,
      },
    ],
  },
];

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

  const userList = ['전체 수험자', '정진명', '정민규', '강지원', '강지우', '언노운'];

  // 필터링 로직 적용
  const filteredGroups = initialTesterGroups
    .map(group => {
      if (selectedUser !== '전체 수험자' && group.tester !== selectedUser) {
        return null;
      }
      const filteredSubjects = group.subjects.filter(sub =>
        sub.subjectName.toLowerCase().includes(subjectQuery.toLowerCase())
      );
      if (filteredSubjects.length === 0) return null;
      return {
        ...group,
        subjects: filteredSubjects,
      };
    })
    .filter(Boolean) as TesterGroup[];

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

      {/* 하단 결과 리스트 영역 (수험자별 그룹핑 및 하단 카드 레이아웃 적용) */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 pb-4 space-y-4">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group, gIdx) => (
            <div key={gIdx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
              {/* 수험자 그룹 헤더 */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span className="font-bold text-gray-800 text-sm">{group.tester}</span>
                </div>
                <div className="text-xs font-medium text-gray-500">
                  총 건수: <span className="font-bold text-gray-800">{group.totalCount}건</span>
                </div>
              </div>

              {/* 과목 통계 카드 목록 */}
              <div className="space-y-3 pt-1">
                {group.subjects.map((sub, sIdx) => (
                  <div key={sIdx} className="bg-gray-50/60 rounded-xl p-3 border border-gray-200/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900 text-xs sm:text-sm flex-1 min-w-0 break-words pr-2">
                        {sub.subjectName}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 shrink-0">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle cx="12" cy="12" r="9" strokeWidth="2" />
                          <circle cx="12" cy="12" r="5" strokeWidth="2" />
                          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                        </svg>
                        <span>평균 {sub.avgScore}점</span>
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
                            <div className="font-bold text-gray-800">{sub.solveCount}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <div className="text-gray-400 text-[10px]">일수</div>
                            <div className="font-bold text-gray-800">{sub.uniqueDays}</div>
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
                            <div className="font-bold text-gray-800">{sub.maxScore}점</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          <div>
                            <div className="text-gray-400 text-[10px]">힌트 MAX</div>
                            <div className="font-bold text-gray-800">{sub.hintMax}</div>
                          </div>
                        </div>
                      </div>

                      {/* 3열: 최저점 / 힌트 MIN */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-4-4v4m0-4a4 4 0 100-8 4 4 0 000 8zm-6-9h2a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v2a2 2 0 002 2zm16 0h-2a2 2 0 01-2-2V5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <div className="text-gray-400 text-[10px]">최저점</div>
                            <div className="font-bold text-gray-800">{sub.minScore}점</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <div>
                            <div className="text-gray-400 text-[10px]">힌트 MIN</div>
                            <div className="font-bold text-gray-800">{sub.hintMin}</div>
                          </div>
                        </div>
                      </div>
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
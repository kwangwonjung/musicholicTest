// src/App.tsx
import { useState } from 'react';
import StatusFilter from './components/StatusFilter';
import DateRangeFilter from './components/DateRangeFilter';
import UserSelectFilter from './components/UserSelectFilter';
import RecordList from './components/RecordList';
import type { RecordType } from './types/record'; // 타입 명시적 임포트

const mockData: RecordType[] = [
  { id: 1, name: '홍길동', date: '8/18 (일)', title: '실전 모의고사 1회', score: 92, time: '120분', status: '사용' },
  { id: 2, name: '김민수', date: '8/18 (일)', title: '실전 모의고사 1회', score: 87, time: '120분', status: '사용' },
  { id: 3, name: '이서연', date: '8/17 (토)', title: '실전 모의고사 1회', score: 78, time: '120분', status: '미사용' },
  { id: 4, name: '박지훈', date: '8/17 (토)', title: '실전 모의고사 1회', score: 65, time: '120분', status: '사용' },
  { id: 5, name: '최유진', date: '8/16 (금)', title: '실전 모의고사 1회', score: 90, time: '120분', status: '사용' },
  { id: 6, name: '정하늘', date: '8/16 (금)', title: '실전 모의고사 1회', score: 72, time: '120분', status: '미사용' },
  { id: 7, name: '강태호', date: '8/15 (목)', title: '실전 모의고사 1회', score: 85, time: '120분', status: '사용' },
];

export default function App() {
  const [status, setStatus] = useState('전체');
  const [dateRange, setDateRange] = useState('8/12 ~ 8/18');
  const [selectedUser, setSelectedUser] = useState('전체 수험자');
  const [records] = useState<RecordType[]>(mockData);

  const userList = ['전체 수험자', '홍길동', '김민수', '이서연', '박지훈'];

  const filteredRecords = records.filter((item) => {
    if (status === '사용') return item.status === '사용';
    if (status === '미사용') return item.status === '미사용';
    return true;
  });

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
          dateRange={dateRange}
          onPrev={() => setDateRange('8/05 ~ 8/11')}
          onNext={() => setDateRange('8/19 ~ 8/25')}
          onThisWeek={() => setDateRange('8/12 ~ 8/18')}
        />
        <UserSelectFilter
          users={userList}
          selectedUser={selectedUser}
          onChangeUser={setSelectedUser}
        />
      </div>

      <RecordList records={filteredRecords} />
    </main>
  );
}
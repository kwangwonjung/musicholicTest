// src/components/RecordList.tsx
import type { RecordType } from '../types/record';

interface RecordListProps {
  records: RecordType[];
  isEditMode: boolean;
  userList: string[];
  onUserChange?: (id: number, newName: string) => void;
  onStatusToggle?: (id: number) => void;
}

export default function RecordList({ 
  records, 
  isEditMode, 
  userList, 
  onUserChange, 
  onStatusToggle 
}: RecordListProps) {
  const getScoreColor = (score: number) => {
    if (score === 100) return 'text-red-500';      
    if (score > 80 && score < 100) return 'text-green-600'; 
    if (score >= 60 && score <= 80) return 'text-blue-500';  
    return 'text-gray-400'; 
  };

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div
          key={record.id}
          className="grid grid-cols-[auto_1fr_1fr_1fr] gap-x-2 gap-y-2 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
        >
          {/* 1행 좌측: 이름 (사자성어 타이틀과 높이 일치) */}
          <div className="font-bold text-gray-800 whitespace-nowrap text-center px-2 border-r border-gray-100">
            {isEditMode ? (
              <select
                value={record.name}
                onChange={(e) => onUserChange && onUserChange(record.id, e.target.value)}
                className="border border-gray-300 rounded px-1 py-1 text-xs bg-white focus:outline-none focus:border-blue-500"
              >
                {userList.filter(u => u !== '전체 수험자').map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            ) : (
              record.name
            )}
          </div>

          {/* 1행 우측: 시험 제목 (사자성어) */}
          <div className="col-span-3 text-gray-700 text-[13px] font-medium text-center pb-1">
            {record.title}
          </div>

          {/* 2행 좌측: 날짜 (점수/시간과 높이 일치) */}
          <div className="text-gray-500 text-xs whitespace-nowrap text-center px-2 border-r border-gray-100">
            {record.date}
          </div>

          {/* 2행 우측 1: 점수 */}
          <div className={`text-center font-bold text-sm ${getScoreColor(record.score)}`}>
            {record.score}점
          </div>

          {/* 2행 우측 2: 시간 */}
          <div className="text-gray-400 text-xs text-center">
            {record.time}
          </div>

          {/* 2행 우측 3: 상태 뱃지 */}
          <div className="flex justify-center">
            <button
              type="button"
              disabled={!isEditMode}
              onClick={() => {
                if (isEditMode && onStatusToggle) {
                  onStatusToggle(record.id);
                }
              }}
              className={`text-[11px] font-medium px-3 py-1 rounded-full border whitespace-nowrap transition-all ${
                record.status === '사용'
                  ? 'border-blue-300 text-blue-500 bg-blue-50'
                  : 'border-gray-200 text-gray-500 bg-gray-50'
              } ${isEditMode ? 'cursor-pointer hover:bg-gray-100 active:scale-95' : 'cursor-default'}`}
            >
              {record.status}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
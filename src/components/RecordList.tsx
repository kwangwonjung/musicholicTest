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
          className="grid grid-cols-[auto_auto_1fr_1fr_1fr] gap-x-2 gap-y-2 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
        >
          {/* 좌측: 이름 (수정모드일 때 콤보박스로 변경) */}
          <div className="row-span-2 font-bold text-gray-800 whitespace-nowrap text-center px-1">
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

          {/* 좌측: 날짜 */}
          <div className="row-span-2 text-gray-500 text-xs whitespace-nowrap text-center px-2 border-r border-gray-100">
            {record.date}
          </div>

          {/* 우측 상단: 시험 제목 */}
          <div className="col-span-3 text-gray-700 text-[13px] font-medium text-center pb-1">
            {record.title}
          </div>

          {/* 우측 하단 1: 점수 */}
          <div className={`text-center font-bold text-sm ${getScoreColor(record.score)}`}>
            {record.score}점
          </div>

          {/* 우측 하단 2: 시간 */}
          <div className="text-gray-400 text-xs text-center">
            {record.time}
          </div>

          {/* 우측 하단 3: 상태 뱃지 (수정모드일 때 클릭하면 사용 <-> 미사용 양방향 토글) */}
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
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
          className="bg-white py-4 px-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3"
        >
          {/* 좌측: 이름 및 날짜 */}
          <div className="flex flex-col items-center justify-center pr-3 pl-0 border-r border-gray-100 min-w-[65px] gap-1.5">
            <div className="font-bold text-gray-800 whitespace-nowrap">
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
            <div className="text-gray-500 text-xs whitespace-nowrap">
              {record.date}
            </div>
          </div>

          {/* 우측 상세 정보 영역 */}
          <div className="flex-1 flex items-center justify-between gap-2 text-xs min-w-0">
            
            {/* 1열: 모드 + 시험 제목 (truncate 제거 및 break-all 적용) */}
            <div className="flex flex-col gap-1 items-start flex-1 min-w-0 pr-2">
              <span className="font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap">
                {record.mode || record.mode || '-'}
              </span>
              <div className="text-gray-700 font-medium text-[13px] break-all w-full text-left">
                {record.title}
              </div>
            </div>

            {/* 2열: 점수 + 시간 */}
            <div className="flex flex-col gap-1 items-start w-[60px] pl-2 shrink-0 whitespace-nowrap">
              <span className={`font-bold text-sm ${getScoreColor(record.score)}`}>
                {record.score}점
              </span>
              <span className="text-gray-400 text-xs">
                {record.time}
              </span>
            </div>

            {/* 3열: 힌트 + 상태 뱃지 */}
            <div className="flex flex-col gap-1 items-end w-[50px]  pl-4 shrink-0 whitespace-nowrap">
              <span className="text-gray-500 text-xs">
                H: {record.hintCnt ?? record.hintCnt ?? 0}
              </span>
              <div>
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

          </div>
        </div>
      ))}
    </div>
  );
}
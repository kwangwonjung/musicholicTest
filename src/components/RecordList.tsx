// src/components/RecordList.tsx
import type { RecordType } from '../types/record';

interface RecordListProps {
  records: RecordType[];
}

export default function RecordList({ records }: RecordListProps) {
  // 점수에 따른 색상 클래스를 반환하는 헬퍼 함수
  const getScoreColor = (score: number) => {
    if (score === 100) return 'text-red-500';      // 100점: 빨강
    if (score > 80 && score < 100) return 'text-green-600'; // 80 초과 ~ 100 미만: 초록
    if (score >= 60 && score <= 80) return 'text-blue-500';  // 60 이상 ~ 80 이하(미만): 파랑
    return 'text-gray-400'; // 60점 미만 등 그 외
  };

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div
          key={record.id}
          className="grid grid-cols-[auto_auto_1fr_1fr_1fr] gap-x-2 gap-y-2 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
        >
          {/* 좌측: 이름 (세로 2줄 차지) */}
          <div className="row-span-2 font-bold text-gray-800 whitespace-nowrap text-center px-1">
            {record.name}
          </div>

          {/* 좌측: 날짜 (세로 2줄 차지, 우측에 연한 구분선 추가) */}
          <div className="row-span-2 text-gray-500 text-xs whitespace-nowrap text-center px-2 border-r border-gray-100">
            {record.date}
          </div>

          {/* 우측 상단: 시험 제목 (가로 3칸 차지) */}
          <div className="col-span-3 text-gray-700 text-[13px] font-medium text-center pb-1">
            {record.title}
          </div>

          {/* 우측 하단 1: 점수 (조건부 색상 적용) */}
          <div className={`text-center font-bold text-sm ${getScoreColor(record.score)}`}>
            {record.score}점
          </div>

          {/* 우측 하단 2: 시간 */}
          <div className="text-gray-400 text-xs text-center">
            {record.time}
          </div>

          {/* 우측 하단 3: 상태 뱃지 */}
          <div className="flex justify-center">
            <span
              className={`text-[11px] font-medium px-3 py-1 rounded-full border whitespace-nowrap ${
                record.status === '사용'
                  ? 'border-blue-300 text-blue-500 bg-blue-50'
                  : 'border-gray-200 text-gray-500 bg-gray-50'
              }`}
            >
              {record.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
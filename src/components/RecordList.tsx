// src/components/RecordList.tsx
import type { RecordType } from '../types/record';

interface RecordListProps {
  records: RecordType[];
}

export default function RecordList({ records }: RecordListProps) {
  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div
          key={record.id}
          className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-800 w-12">{record.name}</span>
            <span className="text-gray-500 text-xs w-16">{record.date}</span>
            <span className="text-gray-700 text-xs">{record.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`${
                record.status === '사용' ? 'text-blue-500' : 'text-gray-400'
              } font-bold w-6 text-center`}
            >
              {record.score}
            </span>
            <span className="text-gray-400 text-xs w-10 text-right">{record.time}</span>
            <span
              className={`text-[11px] font-medium px-3 py-1 rounded-full border ${
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
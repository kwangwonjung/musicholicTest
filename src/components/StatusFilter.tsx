interface StatusFilterProps {
  selectedStatus: string;
  onChangeStatus: (status: string) => void;
}

export default function StatusFilter({ selectedStatus, onChangeStatus }: StatusFilterProps) {
  const options = ['전체', '사용', '미사용'];

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-600 font-medium min-w-[60px]">사용여부</span>
      <div className="flex bg-gray-100 rounded-full p-1 w-full">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChangeStatus(option)}
            className={`flex-1 rounded-full py-1.5 text-xs font-medium transition-colors ${
              selectedStatus === option
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
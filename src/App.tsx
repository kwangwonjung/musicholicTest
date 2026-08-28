// src/App.tsx
import { useState } from 'react';
import WeeklyTab from './exam/WeeklyTab'; 
import MonthlyTab from './exam/MonthlyTab'; 
import DetailTab from './exam/DetailTab';  

export default function App() {
  const [activeTab, setActiveTab] = useState<'주별' | '요약' | '월별'>('주별');

  return (
    <main className="max-w-md mx-auto bg-gray-50 min-h-screen p-2 text-sm font-sans">
      {/* 탭 네비게이션 버튼 영역 (주별, 요약, 월별 순서) */}
      <div className="flex bg-gray-200 rounded-lg overflow-hidden mb-2 cursor-pointer">
        <button 
          onClick={() => setActiveTab('주별')}
          className={`flex-1 py-3 font-bold transition-all ${
            activeTab === '주별' 
              ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          주별
        </button>
        <button 
          onClick={() => setActiveTab('요약')}
          className={`flex-1 py-3 font-bold transition-all ${
            activeTab === '요약' 
              ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          요약
        </button>
        <button 
          onClick={() => setActiveTab('월별')}
          className={`flex-1 py-3 font-bold transition-all ${
            activeTab === '월별' 
              ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          월별
        </button>
      </div>

      {/* 선택된 탭에 따른 컴포넌트 렌더링 */}
      {activeTab === '주별' && <WeeklyTab />}
      {activeTab === '요약' && <DetailTab />}
      {activeTab === '월별' && <MonthlyTab />}
    </main>
  );
}
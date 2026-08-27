// src/App.tsx
import { useState } from 'react';
import WeeklyTab from './exam/WeeklyTab'; 
import MonthlyTab from './exam/MonthlyTab'; 
import DetailTab from './exam/DetailTab';  

export default function App() {
  const [activeTab, setActiveTab] = useState<'주별' | '월별' | '요약'>('주별');

  return (
    <main className="max-w-md mx-auto bg-gray-50 min-h-screen p-4 text-sm font-sans">
      {/* 탭 네비게이션 버튼 영역 */}
      <div className="flex bg-gray-200 rounded-lg overflow-hidden mb-6 cursor-pointer">
        <button 
          onClick={() => setActiveTab('주별')}
          className={`flex-1 py-3 font-bold transition-all ${
            activeTab === '주별' ? 'bg-white shadow-sm text-black' : 'text-gray-500'
          }`}
        >
          주별
        </button>
        <button 
          onClick={() => setActiveTab('월별')}
          className={`flex-1 py-3 font-bold transition-all ${
            activeTab === '월별' ? 'bg-white shadow-sm text-black' : 'text-gray-500'
          }`}
        >
          월별
        </button>
        <button 
          onClick={() => setActiveTab('요약')}
          className={`flex-1 py-3 font-bold transition-all ${
            activeTab === '요약' ? 'bg-white shadow-sm text-black' : 'text-gray-500'
          }`}
        >
          요약
        </button>
      </div>

      {/* 선택된 탭에 따른 컴포넌트 렌더링 */}
      {activeTab === '주별' && <WeeklyTab />}
      {activeTab === '월별' && <MonthlyTab />}
      {activeTab === '요약' && <DetailTab />}
    </main>
  );
}
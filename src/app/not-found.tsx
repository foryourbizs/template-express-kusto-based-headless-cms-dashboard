'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-400">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mt-2 mb-8">요청하신 페이지가 존재하지 않거나 삭제되었습니다.</p>
        
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // /login으로 접근하면 /admin으로 리디렉션 (React Admin이 내부적으로 로그인 처리)
    router.replace('/');
  }, [router]);

  return (
      <>
      관리자 로그인 페이지로 이동 중...
      </>
  );
}

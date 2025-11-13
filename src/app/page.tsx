"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// AdminApp을 dynamic import로 로드 (SSR 비활성화)
const AdminApp = dynamic(
  () => import("../components/react-admin/AdminApp"),
  { 
    ssr: false,
    loading: () => null, // 로딩 중에는 아무것도 표시하지 않음
  }
);

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 클라이언트 마운트 전에는 null 반환
  if (!mounted) {
    return null;
  }

  return <AdminApp />;
}

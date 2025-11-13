"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// 모든 경로를 AdminApp으로 통합
const AdminApp = dynamic(
  () => import("../../components/react-admin/AdminApp"),
  { 
    ssr: false,
    loading: () => null,
  }
);

export default function CatchAllPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <AdminApp />;
}

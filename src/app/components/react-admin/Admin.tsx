"use client";
import dynamic from "next/dynamic";

const AdminApp = dynamic(() => import("./AdminApp"), {
  ssr: false,
  loading: () => <p>관리자 화면 호출 중 ..</p>,
});

export default AdminApp;
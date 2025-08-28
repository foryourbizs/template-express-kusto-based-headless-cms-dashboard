"use client";
import dynamic from "next/dynamic";

const AdminApp = dynamic(() => import("./AdminApp"), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{
        margin: 0,
        color: '#64748b',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        관리자 화면 호출 중...
      </p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  ),
});

export default AdminApp;
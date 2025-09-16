// components/UpgradeModal.tsx
import React from 'react'

export default function UpgradeModal({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: {
  title: string
  message: string | React.ReactNode
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: isDark ? '#1f2937' : '#ffffff',
          color: isDark ? '#f1f5f9' : '#1f2937',
          borderRadius: '18px',
          padding: '2rem',
          maxWidth: '550px',
          width: '100%',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          fontFamily: 'Pretendard, sans-serif',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>
          🔒 {title}
        </h2>
        <div style={{
          color: isDark ? '#cbd5e1' : '#4b5563',
          fontSize: '1rem',
          marginBottom: '1.75rem',
          lineHeight: 1.75,
        }}>
          {message}
        </div>

        {/* 💎 혜택 리스트 */}
<div style={{ display: 'flex', justifyContent: 'center' }}>
  <ul style={{
    textAlign: 'left',
    fontSize: '1rem',
    fontWeight: 505,
    color: isDark ? '#e2e8f0' : '#374151',
    marginBottom: '1.75rem',
    lineHeight: 1.75,
    listStyle: 'none',
    paddingLeft: 0,
  }}>
    <li style={{ marginBottom: '0.5rem' }}>✅ 문구 저장 무제한</li>
    <li style={{ marginBottom: '0.5rem' }}>📥 다운로드 가능</li>
    <li style={{ marginBottom: '0.5rem' }}>🏷️ 태그 필터링·관리</li>
    <li>✏️ 더 빠른 문구 생성</li>
  </ul>
</div>

        {/* 버튼 영역 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: isDark ? '#334155' : '#f3f4f6',
              color: isDark ? '#f1f5f9' : '#374151',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: 500,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}

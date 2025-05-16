// lib/styles.ts
import React from 'react';

export const baseStyle: React.CSSProperties = {
  backgroundColor: '#f9fafb',       // light mode 기본 배경
  color: '#111827',                 // 기본 글자색
  minHeight: '100vh',
  padding: '2rem',                  // isMobile 대신 고정값
  fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
  transition: 'all 0.3s ease',
};

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '1rem',
  backgroundColor: '#ffffff',
  color: '#111827',
  marginBottom: '1rem',
};

export const baseButton: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '9999px',
  border: '1px solid #d1d5db',
  backgroundColor: '#ffffff',
  fontWeight: 500,
  fontSize: '0.9rem',
  cursor: 'pointer',
  color: '#2563eb',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  transition: 'all 0.2s ease-in-out',
};

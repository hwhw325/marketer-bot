// components/OnboardingModal.tsx
import React from 'react';

type Props = {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
};

export default function OnboardingModal({ step, onNext, onPrev, onClose }: Props) {
  // 각 스텝별 제목
  const titles = [
    '👋 처음이신가요?',
    '✨ 준비 완료!',
    '📦 저장하고 활용하기',
  ];

  // 각 스텝별 설명
  const messages = [
    `키워드를 입력하고 조건을 선택한 뒤\n"이 조건으로 문구 생성하기" 버튼을 눌러보세요!`,
    `문구 생성 후 마음에 드는 문장은\n❤️ 버튼으로 저장해보세요!`,
    `저장된 문구는 태그 검색 혹은\n💾 다운로드하여 활용할 수 있어요!`,
  ];

  // dot 표시
  const dots = titles.map((_, i) => (
    <span
      key={i}
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        margin: '0 6px',
        borderRadius: '50%',
        background: step === i ? '#10b981' : '#d1d5db',
      }}
    />
  ));

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 999,
        }}
      />

      {/* 모달 박스 */}
      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90%, 560px)',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
          padding: '1.75rem 2rem',
          zIndex: 1000,
        }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'absolute',
            top: 12, right: 12,
            background: 'transparent',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* 제목 */}
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
          {titles[step]}
        </h2>

        {/* 본문 (가운데 정렬) */}
        <p
          style={{
            margin: '0.75rem 0 1.5rem',
            whiteSpace: 'pre-line',
            textAlign: 'center',
            lineHeight: 1.6,
            color: '#333',
          }}
        >
          {messages[step]}
        </p>

        {/* dot */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          {dots}
        </div>

        {/* 버튼 영역 */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={onPrev}
            disabled={step === 0}
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              marginRight: 8,
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: step === 0 ? '#f3f4f6' : '#fff',
              color: step === 0 ? '#9ca3af' : '#374151',
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 500,
            }}
          >
            이전
          </button>

          {step < titles.length - 1 ? (
            <button
              onClick={onNext}
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                marginLeft: 8,
                borderRadius: 6,
                border: 'none',
                background: '#10b981',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              다음
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                marginLeft: 8,
                borderRadius: 6,
                border: 'none',
                background: '#10b981',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              완료
            </button>
          )}
        </div>
      </div>
    </>
  );
}

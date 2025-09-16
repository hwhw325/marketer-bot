// components/ProofRotator.tsx
import React, { useState, useEffect } from 'react'

const messages = [
  "지난 24시간 동안 1,000+개의 문구가 탄생했어요!🎉",
  "지금 이 순간에도 AI가 문구를 쓰고 있습니다…📝",
  "🏆 누적 10,000+ 문구 생성 중! 당신 차례예요.",
  "한 달간 5,000+개 문구 생성 완료!✔️",
]

export default function ProofRotator() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % messages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <p className="proof-rotator">
    {messages[idx]}
    <style jsx>{`
      .proof-rotator {
        color: #6b7280;
        font-size: 0.9rem;
        text-align: center;
        margin: 1.5rem 0 3rem; /* 위쪽 1.5rem, 아래쪽 3rem */
        animation: fadeInOut 4s ease-in-out infinite;
        }
        @keyframes fadeInOut {
          0%   { opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </p>
  )
}

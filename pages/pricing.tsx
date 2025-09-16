// pages/pricing.tsx
import React, { useState } from "react"
import Head from "next/head"
import { useSession } from "next-auth/react"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const { data: session } = useSession()
  const currentPlan = session?.user?.plan || ""

  const plans = [
    {
      name: "Free",
      monthly: 0,
      yearly: 0,
      originalYearly: 0,
      description: "기본 기능만 체험 가능",
      features: [
        "문구 생성 (일일 3회)",
        "기본 템플릿 제공",
        "광고 문구 복사 가능",
        "- 저장 / 다운로드 불가",
        "- 고급 기능 제한",
      ],
      buttonText: "무료로 시작하기",
      highlight: false,
    },
    {
      name: "Basic",
      monthly: 5900,
      yearly: 59000,          // ✅ 연간가 반영
      originalYearly: 5900 * 12, // 70,800 (약 17% 할인)
      description: "가성비 좋은 개인용 플랜",
      features: [
        "문구 생성 무제한",
        "문구 저장 최대 100개",
        "다운로드 가능",
        "태그 필터 사용 가능",
        "- 고급 템플릿 제한",
      ],
      buttonText: "Basic 플랜 구독하기",
      highlight: false,
    },
    {
      name: "Pro",
      monthly: 12900,
      yearly: 129000,            // ✅ 연간가 반영
      originalYearly: 12900 * 12, // 154,800 (약 17% 할인)
      description: "브랜드 운영자를 위한 고급 플랜",
      features: [
        "모든 기능 무제한",
        "프리미엄 템플릿 전체 이용",
        "A/B 테스트 문구 추천",
        "문구 저장/다운로드 무제한",
        "태그 관리 및 백업",
      ],
      buttonText: "Pro 플랜으로 업그레이드",
      highlight: true,
    },
  ]

  return (
    <>
      <Head>
        <title key="title">요금제 - CopyQuick</title>
        <meta key="meta:viewport" name="viewport" content="width=device-width, initial-scale=1" />
        <meta key="meta:description" name="description" content="CopyQuick 요금제 안내 및 플랜 비교" />
        <meta key="og:title" property="og:title" content="요금제 - CopyQuick" />
        <meta key="og:description" property="og:description" content="CopyQuick 요금제 안내 및 플랜 비교" />
        <link key="link:favicon" rel="icon" href="/favicon.ico" />
      </Head>

      <div className="landing-bg w-full min-h-screen px-4 sm:px-8 py-10">
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          요금제 안내
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#475569",
            fontSize: "1.125rem",
            marginBottom: "2rem",
          }}
        >
          당신의 마케팅 파트너, CopyQuick의 플랜을 지금 시작해보세요.✨
        </p>

        {/* 요금제 전환 토글 */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <div
            style={{
              backgroundColor: "#e5e7eb",
              borderRadius: "9999px",
              display: "flex",
              padding: "4px",
            }}
          >
            <button
              onClick={() => setIsYearly(false)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                border: "none",
                backgroundColor: !isYearly ? "#00b894" : "transparent",
                color: !isYearly ? "#fff" : "#374151",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              월간 결제
            </button>
            <button
              onClick={() => setIsYearly(true)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                border: "none",
                backgroundColor: isYearly ? "#00b894" : "transparent",
                color: isYearly ? "#fff" : "#374151",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              연간 결제 (약 2개월 무료)
            </button>
          </div>
        </div>

        {/* 요금제 카드 */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
          {plans.map((plan, i) => {
            const isCurrent = plan.name.toLowerCase() === currentPlan.toLowerCase()
            const bgColor = plan.highlight ? "#ecfdf5" : plan.name === "Basic" ? "#f8fafc" : "#ffffff"
            const price = isYearly ? plan.yearly : plan.monthly
            const original = isYearly ? plan.originalYearly : undefined
            const discountPercent =
              isYearly && original && original > 0 ? Math.round((1 - price / original) * 100) : 0

            const priceText = price === 0 ? "무료" : `₩${price.toLocaleString()}`
            const priceSuffix = price === 0 ? "" : "/월"

            return (
              <div
                key={i}
                style={{
                  backgroundColor: bgColor,
                  border: plan.highlight ? "2px solid #10b981" : "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "2rem",
                  width: "320px",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
                  transition: "transform 0.2s ease",
                  cursor: "pointer",
                  color: "#111",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    {plan.name}
                    {plan.highlight && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          backgroundColor: "#10b981",
                          color: "#fff",
                          padding: "0.2rem 0.5rem",
                          fontSize: "0.75rem",
                          borderRadius: "6px",
                        }}
                      >
                        추천
                      </span>
                    )}
                    {isCurrent && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          backgroundColor: "#10b981",
                          color: "#fff",
                          padding: "0.2rem 0.5rem",
                          fontSize: "0.75rem",
                          borderRadius: "6px",
                        }}
                      >
                        사용 중
                      </span>
                    )}
                  </h2>

                  <p style={{ fontSize: "2rem", fontWeight: 800, margin: "0.5rem 0" }}>
                    {priceText}
                    {price !== 0 && (
                      <span
                        style={{
                          fontSize: "1rem",
                          color: "#64748b",
                          marginLeft: "0.25rem",
                        }}
                      >
                        {priceSuffix}
                      </span>
                    )}
                  </p>

                  {isYearly && original ? (
                    <>
                      <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                        <span style={{ color: "#94a3b8", textDecoration: "line-through" }}>
                          ₩{original.toLocaleString()}
                        </span>{" "}
                        <span style={{ color: "#10b981", fontWeight: 600 }}>
                          연간 기준 -{discountPercent}% 할인 (약 2개월 무료)
                        </span>
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#64748b",
                          marginBottom: "1rem",
                        }}
                      >
                        한 번의 연간 자동 결제로 부담 없이 이용
                      </p>
                    </>
                  ) : null}

                  <p style={{ color: "#6b7280", marginBottom: "1rem" }}>{plan.description}</p>
                  <ul style={{ paddingLeft: "1.2rem", lineHeight: 1.75, color: "#111" }}>
                    {plan.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>

                <button
                  style={{
                    marginTop: "1.5rem",
                    backgroundColor: plan.highlight ? "#10b981" : "#3b82f6",
                    color: "#ffffff",
                    padding: "0.75rem 1.25rem",
                    borderRadius: "10px",
                    border: "none",
                    fontWeight: 600,
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  {plan.buttonText}
                </button>
              </div>
            )
          })}
        </div>

        {/* 안내 문구 */}
        <div style={{ marginTop: "2.5rem", fontSize: "0.85rem", color: "#64748b", textAlign: "center" }}>
          모든 유료 플랜은 부가세(VAT) 10% 별도입니다.
          <br />
          연간 플랜은 매년 동일한 날짜에 자동 결제됩니다.
        </div>

        <div
          style={{
            marginTop: "1.5rem",
            backgroundColor: "#fef9c3",
            color: "#374151",
            padding: "1.5rem",
            borderRadius: "12px",
            textAlign: "center",
            fontSize: "0.95rem",
            width: "100%",
          }}
        >
          💡 <strong>연간 결제 시 약 17% 할인!</strong> 더 저렴한 가격으로 지속적인 마케팅 효과를 누려보세요!
          <br />
          (Basic ₩59,000 / Pro ₩129,000)
        </div>

        {/* 혜택 비교 표 */}
        <div style={{ marginTop: "4rem", overflowX: "auto" }}>
          <div className="w-full rounded-xl border border-gray-200 bg-white overflow-hidden">
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9" }}>
                  <th style={{ padding: "1rem" }}>기능</th>
                  <th style={{ padding: "1rem" }}>Free</th>
                  <th style={{ padding: "1rem" }}>Basic</th>
                  <th style={{ padding: "1rem" }}>Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["문구 생성", "일 3회", "무제한", "무제한"],
                  ["문구 저장", "-", "최대 100개", "무제한"],
                  ["다운로드", "-", "가능", "무제한"],
                  ["태그 필터 사용", "-", "가능", "가능"],
                  ["템플릿 이용", "기본 템플릿", "기본 템플릿", "프리미엄 전체 이용"],
                  ["A/B 테스트 추천", "-", "-", "가능"],
                  ["태그 관리/백업", "-", "-", "가능"],
                ].map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        style={{
                          padding: "1rem",
                          color: i === 0 ? "#111827" : cell === "-" ? "#9ca3af" : "#10b981",
                          fontWeight: i === 0 ? 600 : 500,
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

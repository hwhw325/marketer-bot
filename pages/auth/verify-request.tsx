// pages/auth/verify-request.tsx
import Head from "next/head"
import Link from "next/link"

export default function VerifyRequest() {
  return (
    <>
      <Head>
        <title key="title">이메일 확인 안내 | CopyQuick</title>
        <meta key="desc" name="description" content="로그인 링크가 이메일로 전송되었습니다. 메일함을 확인해주세요." />
        <meta key="robots" name="robots" content="noindex, nofollow" />
        <link key="icon" rel="icon" href="/favicon.ico" />
        <meta key="og:title" property="og:title" content="이메일 확인 안내 | CopyQuick" />
      </Head>

      <div
        style={{
          minHeight: "80vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          fontFamily:
            `"Pretendard", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Noto Sans, sans-serif`,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 640,
            background: "#fff",
            borderRadius: 14,
            padding: "2rem",
            textAlign: "center",
            boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 800, color: "#111827" }}>
            📬 이메일을 확인해 주세요!
          </h1>

          <p style={{ marginTop: ".75rem", color: "#475569", fontSize: "1rem", lineHeight: 1.7 }}>
            <b>로그인 링크</b>가 곧 도착합니다. 받은 편지함에서 메일을 열어 버튼을 눌러주세요.
          </p>

          {/* 잘못된 중첩 제거: 리스트는 ul > li 구조로만 */}
          <ul
            style={{
              marginTop: "1rem",
              paddingLeft: "1.2rem",
              textAlign: "left",
              lineHeight: 1.8,
              color: "#334155",
              fontSize: ".95rem",
            }}
          >
            <li>- 보이지 않으면 스팸함/프로모션함도 확인해 보세요.</li>
            <li>- 링크는 일정 시간 뒤 만료됩니다. 만료됐다면 다시 전송해 주세요.</li>
            <li>- 기업 메일이라면 외부 수신 차단 여부도 점검해 주세요. :)</li>
          </ul>

          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              gap: ".5rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* 다시 보내기 UI가 보이는 로그인 화면으로 이동 */}
            <Link
              href="/auth/signin?sent=1"
              style={{
                display: "inline-block",
                padding: ".75rem 1.25rem",
                background: "#2563eb",
                color: "#fff",
                borderRadius: 10,
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 8px 20px rgba(37,99,235,0.22)",
              }}
            >
              로그인 페이지로 돌아가기
            </Link>
          </div>

          <p style={{ marginTop: "1.25rem", fontSize: ".8rem", color: "#94a3b8" }}>
            © 2025 CopyQuick. All rights reserved.
          </p>
        </div>
      </div>
    </>
  )
}

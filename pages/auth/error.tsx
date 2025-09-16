// pages/auth/error.tsx
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo } from "react"

type KnownError =
  | "Configuration"
  | "AccessDenied"
  | "Verification"
  | "OAuthAccountNotLinked"
  | "Callback"
  | "Default"

export default function AuthErrorPage() {
  const router = useRouter()
  const error = (router.query.error as string) as KnownError | undefined
  const callbackUrl = (router.query.callbackUrl as string) || "/"

  const info = useMemo(() => {
    switch (error) {
      case "Configuration":
        return {
          title: "서버 설정 오류",
          desc: "로그인 서버 설정에 문제가 있어요. 잠시 후 다시 시도해 주세요.",
          actions: ["signin", "help"],
        }
      case "AccessDenied":
        return {
          title: "접근이 거부되었어요",
          desc: "요청하신 방법으로는 접근이 허용되지 않아요.",
          actions: ["signin", "help"],
        }
      case "Verification":
        return {
          title: "인증 링크가 만료되었어요",
          desc: "메일의 로그인 링크가 만료되었거나 이미 사용되었어요. 다시 받아서 시도해 주세요.",
          actions: ["signin", "verify"],
        }
      case "OAuthAccountNotLinked":
        return {
          title: "다른 방식으로 만든 계정이에요",
          desc:
            "같은 이메일이 이미 다른 로그인 방식(예: 이메일/비밀번호 또는 다른 OAuth)과 연결되어 있어요. 기존에 사용하던 방법으로 로그인한 뒤 계정 연결을 진행해 주세요.",
          actions: ["signin", "help"],
        }
      case "Callback":
        return {
          title: "로그인 중 문제가 발생했어요",
          desc: "제공자에서 돌아오는 과정에서 오류가 있었어요. 다시 시도해 주세요.",
          actions: ["signin", "help"],
        }
      default:
        return {
          title: "로그인에 실패했어요",
          desc: "예상치 못한 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
          actions: ["signin", "help"],
        }
    }
  }, [error])

  return (
    <>
      <Head>
        <title>로그인 오류 | CopyQuick</title>
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
          <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#111827" }}>
            {info.title}
          </h1>
          <p style={{ marginTop: ".75rem", color: "#475569", fontSize: "1rem", lineHeight: 1.7 }}>
            {info.desc}
          </p>

          {/* 디버그: 개발 중엔 에러 슬러그 표시(배포 시 굳이 안 봐도 됨) */}
          {process.env.NODE_ENV !== "production" && error && (
            <p style={{ marginTop: ".25rem", fontSize: ".85rem", color: "#94a3b8" }}>
              <code>error={error}</code>
            </p>
          )}

          <div
            style={{
              marginTop: "1.25rem",
              display: "flex",
              gap: ".5rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {info.actions.includes("signin") && (
              <Link
                href={{ pathname: "/auth/signin", query: { callbackUrl } }}
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
                로그인 페이지로 이동
              </Link>
            )}

            {info.actions.includes("verify") && (
              <Link
                href={{ pathname: "/auth/verify-request", query: { callbackUrl } }}
                style={{
                  display: "inline-block",
                  padding: ".75rem 1.25rem",
                  background: "#fff",
                  color: "#0f172a",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                확인 안내 보기
              </Link>
            )}

            {info.actions.includes("help") && (
              <Link
                href="/auth/signin#help"
                style={{
                  display: "inline-block",
                  padding: ".75rem 1.25rem",
                  background: "#fff",
                  color: "#0f172a",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                해결 방법 보기
              </Link>
            )}
          </div>

          <p style={{ marginTop: "1.25rem", fontSize: ".8rem", color: "#94a3b8" }}>
            © 2025 CopyQuick. All rights reserved.
          </p>
        </div>
      </div>
    </>
  )
}

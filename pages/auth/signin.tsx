// pages/auth/signin.tsx
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState, FormEvent } from "react"
import type { GetServerSideProps } from "next"
import {
  getProviders,
  getCsrfToken,
  signIn,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react"
import type { BuiltInProviderType } from "next-auth/providers"

// ---- 타입 ----
type ProvidersMap = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
type Props = {
  providers: ProvidersMap | null
  csrfToken: string | null
}
type UIState = "idle" | "sending" | "sent" | "error"

// ✅ 도움말 문구는 데이터로 분리(하드코딩 블록 최소화)
const HELP_ITEMS: string[] = [
  "스팸함 / 프로모션 탭을 확인해 주세요.",
  "이메일 주소에 오타가 없는지 다시 확인해 주세요.",
  "회사 메일이라면 외부 수신 차단 여부를 확인해 주세요.",
  "메일이 도착하는 데 1–2분(간혹 최대 5분) 걸릴 수 있어요.",
  "보낸 사람을 주소록에 추가하고 스팸 해제해 두면 이후 더 안정적으로 도착해요.",
]

export default function SignIn({ providers: ssrProviders, csrfToken }: Props) {
  const router = useRouter()
  const [providers, setProviders] = useState<ProvidersMap | null>(ssrProviders)
  const [csrf, setCsrf] = useState<string | null>(csrfToken)

  const [email, setEmail] = useState("")
  const [ui, setUi] = useState<UIState>("idle")
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const [hasSent, setHasSent] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, []);

  const q = router.query.callbackUrl
  const callbackUrl = (Array.isArray(q) ? q[0] : q) || "/"
  const isSending = ui === "sending"
  const isCooldown = cooldown > 0
  const showSuccess = hasSent

  // ⏱ 재전송 타이머
  useEffect(() => {
    if (cooldown <= 0) return
    const id = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [cooldown])

  // 🔁 인증 후 돌아온 경우 sent=1 → 성공 패널 유지 + 마지막 이메일 복원
  useEffect(() => {
    if (router.query.sent === "1") {
      setHasSent(true)
      setUi("sent")
      try {
        const last = localStorage.getItem("cq_last_email")
        if (last) setEmail(last)
      } catch {}
    }
  }, [router.query.sent])

  // ⏳ 남은 쿨다운 복원
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cq_cooldown_until")
      if (!raw) return
      const diffMs = Number(raw) - Date.now()
      if (diffMs > 0) setCooldown(Math.ceil(diffMs / 1000))
    } catch {}
  }, [])

  // 🔎 #help로 진입 시 도움말 열기
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.location.hash === "#help") {
      setHelpOpen(true)
      setTimeout(() => {
        document.getElementById("signin-help")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 0)
    }
  }, [router.asPath])

  // ?error= → 사람친화 메시지 + URL 정리
  useEffect(() => {
    const qsErr = router.query.error as string | undefined
    if (!qsErr) return
    const map: Record<string, string> = {
      Configuration: "서버 설정 오류입니다. 잠시 후 다시 시도해 주세요.",
      AccessDenied: "접근이 거부되었습니다.",
      Verification: "인증 링크가 만료되었거나 유효하지 않습니다.",
      OAuthAccountNotLinked: "같은 이메일로 다른 로그인 방식이 연결되어 있습니다.",
      RateLimited: "요청이 너무 잦아요. 30초 뒤에 다시 시도해 주세요.",
    }
    setErrMsg(map[qsErr] ?? "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.")
    setUi("error")
    const { error, ...rest } = router.query
    router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true })
  }, [router.query.error, router])

  // 🛡️ SSR이 비어 있는 드문 경우(프리뷰 캐시 등) → 클라이언트에서 보강
  useEffect(() => {
    ;(async () => {
      if (!providers || Object.keys(providers).length === 0) {
        try {
          const p = await getProviders()
          if (p && Object.keys(p).length > 0) setProviders(p as ProvidersMap)
        } catch (e) {
          console.warn("[signin] getProviders() failed on client", e)
        }
      }
      if (!csrf) {
        try {
          // getCsrfToken은 ctx 필요 없이 클라에서도 동작
          const token = await getCsrfToken()
          if (token) setCsrf(token)
        } catch {}
      }
    })()
  }, [providers, csrf])

  // 최초 전송
  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault()
    setErrMsg(null)

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrMsg("유효한 이메일 주소를 입력해 주세요.")
      setUi("error")
      return
    }

    try {
      setUi("sending")
      const res = await signIn("email", { email, redirect: false, callbackUrl })
      if (res?.ok) {
        try {
          localStorage.setItem("cq_last_email", email)
          const until = Date.now() + 30_000
          localStorage.setItem("cq_cooldown_until", String(until))
        } catch {}
        setHasSent(true)
        setUi("sent")
        setCooldown(30)
      } else {
        setUi("error")
        setErrMsg("인증 메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.")
      }
    } catch (err) {
      console.error(err)
      setUi("error")
      setErrMsg("인증 메일 전송 중 오류가 발생했습니다.")
    }
  }

  // 재전송 (화면 유지)
  const resend = async () => {
    if (isCooldown || isSending || !email) return
    setErrMsg(null)
    try {
      setUi("sending")
      const res = await signIn("email", { email, redirect: false, callbackUrl })
      if (res?.ok) {
        try {
          localStorage.setItem("cq_last_email", email)
          const until = Date.now() + 30_000
          localStorage.setItem("cq_cooldown_until", String(until))
        } catch {}
        setUi("sent")
        setCooldown(30)
      } else {
        setUi("error")
        setErrMsg("인증 메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.")
      }
    } catch (e) {
      console.error(e)
      setUi("error")
      setErrMsg("인증 메일 전송 중 오류가 발생했습니다.")
    }
  }

  // 확인 안내 페이지로 이동 (콜백/이메일 전달)
  const goVerify = () => {
    const qs = new URLSearchParams()
    if (callbackUrl) qs.set("callbackUrl", callbackUrl)
    if (email) qs.set("email", email)
    router.push(`/auth/verify-request?${qs.toString()}`)
  }

  // “다른 이메일로 받기” → sent 쿼리 제거 + 상태 초기화
  const backToIdle = () => {
    const { sent, ...rest } = router.query
    router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true })
    setHasSent(false)
    setUi("idle")
    setCooldown(0)
    try { localStorage.removeItem("cq_cooldown_until") } catch {}
  }

  const hasAnyProvider = !!providers && Object.keys(providers).length > 0

  return (
    <>
      <Head>
        <title>로그인 | CopyQuick</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.card}>
          {ui === "error" && errMsg && (
            <div style={{ ...styles.banner, ...styles.bannerError }}>
              <strong style={{ marginRight: 6 }}>⚠️ 오류:</strong> {errMsg}
            </div>
          )}
          {showSuccess && (
            <div style={{ ...styles.banner, ...styles.bannerInfo }}>
              <strong style={{ marginRight: 6 }}>📬 전송 완료:</strong>
              입력하신 주소로 로그인 링크를 보냈어요. 메일함을 확인해 주세요.
            </div>
          )}

          <h1 style={styles.title}>로그인</h1>
          <p style={styles.subtitle}>이메일을 입력하시면 로그인 링크가 전송됩니다.</p>

          {showSuccess ? (
            <div style={styles.successPanel} aria-busy={isSending}>
              <div style={styles.successTitle}>메일을 보냈어요!</div>
              <p style={styles.successText}>
                <strong>{email}</strong> 로 로그인 링크를 전송했습니다.
              </p>
              <p style={styles.successHelp}>보이지 않으면 스팸함을 확인해 주세요. (유효 시간 제한)</p>

              <div style={styles.successActions}>
                <button
                  type="button"
                  onClick={resend}
                  disabled={isCooldown || isSending}
                  style={{
                    ...styles.secondaryButton,
                    opacity: isCooldown || isSending ? 0.6 : 1,
                    cursor: isCooldown || isSending ? "not-allowed" : "pointer",
                  }}
                  aria-disabled={isCooldown || isSending}
                >
                  {isCooldown ? `다시 보내기 (${cooldown}s)` : (isSending ? "전송 중…" : "다시 보내기")}
                </button>

                <button type="button" onClick={backToIdle} style={styles.ghostButton}>
                  다른 이메일로 받기
                </button>

                <button type="button" onClick={goVerify} style={styles.linkButton}>
                  확인 안내 페이지로 이동
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Email 로그인 */}
              {providers?.email && (
                <form onSubmit={handleEmailSignIn} style={styles.form}>
                  {/* 클라 전송 방식이라 CSRF hidden은 필수는 아니지만, 서버 폼 전송 대비해 주입 */}
                  <input type="hidden" name="csrfToken" value={csrf ?? ""} />
                  <input
                    id="signinEmail"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    aria-label="이메일 주소"
                    autoComplete="email"
                  />
                  <button type="submit" style={styles.primaryButton} disabled={isSending} aria-disabled={isSending}>
                    {isSending ? "전송 중…" : "로그인 링크 전송"}
                  </button>
                </form>
              )}

              {/* 구분선 */}
              {hasAnyProvider && (
                <div style={styles.dividerContainer}>
                  <div style={styles.line} />
                  <span style={styles.orText}>또는</span>
                  <div style={styles.line} />
                </div>
              )}

              {/* OAuth(예: GitHub) */}
              {providers &&
                Object.values(providers)
                  .filter((p) => p.id !== "email")
                  .map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => signIn(p.id, { callbackUrl })}
                      style={styles.oAuthButton}
                      disabled={isSending}
                      aria-disabled={isSending}
                    >
                      {p.name}로 계속하기
                    </button>
                  ))}

              {/* providers 자체가 비거나 0개일 때 안내(원인 지침) */}
              {mounted && !hasAnyProvider && (
                <div className="rounded-md" style={{ marginTop: "1rem", background: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412", padding: "0.75rem 1rem", fontSize: ".9rem" }}>
                  현재 환경에서 사용 가능한 로그인 방식이 없습니다.
                  <br />
                  관리자: Preview의 <code>GITHUB_CLIENT_ID/SECRET</code> + <code>GITHUB_ALLOW_PREVIEW=true</code> 또는
                  SMTP <code>EMAIL_SERVER_*</code> 세트를 확인해 주세요.
                </div>
              )}

              <div style={styles.legalNotice}>
                계속하면{" "}
                <a href="/terms" style={styles.linkInline}>이용약관</a> 및{" "}
                <a href="/privacy" style={styles.linkInline}>개인정보처리방침</a>에 동의하는 것으로 간주됩니다.
                <br />
                <span style={styles.legalStrong}>※ 필수 동의는 다음 단계에서 확인됩니다.</span>
              </div>
            </>
          )}

          <p style={styles.joinGuide}>
            로그인 메일이 안 왔나요?{" "}
            <Link href="/auth/verify-request" style={styles.linkText}>도움이 필요하신가요?</Link>
          </p>

          {/* ✅ 도움 섹션(접기/펼치기) */}
          <div style={styles.helpWrap}>
            <button
              type="button"
              onClick={() => setHelpOpen(v => !v)}
              aria-expanded={helpOpen}
              aria-controls="signin-help"
              style={styles.helpToggle}
            >
              <span>도움이 필요하신가요?</span>
              <span
                aria-hidden
                style={{
                  display: "inline-block",
                  transition: "transform 0.2s ease",
                  transform: helpOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </button>

            <div
              id="signin-help"
              style={{
                ...styles.helpPanel,
                maxHeight: helpOpen ? 600 : 0,
                borderColor: helpOpen ? "#e2e8f0" : "transparent",
              }}
            >
              <div style={styles.helpInner}>
                <h2 style={styles.helpTitle}>이메일이 안 오나요?</h2>
                <ul style={styles.helpList}>
                  {HELP_ITEMS.map((txt, i) => (
                    <li key={i}>{txt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p style={styles.footnote}>© {new Date().getFullYear()} CopyQuick. All rights reserved.</p>
        </div>
      </div>

      {/* 모션 */}
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  )
}

// ---- SSR: providers + csrfToken 주입, 캐시 방지 ----
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  try {
    const [providers, csrfToken] = await Promise.all([
      getProviders().catch(() => null),
      getCsrfToken(ctx).catch(() => null),
    ])
    ctx.res.setHeader("Cache-Control", "no-store, max-age=0")
    return { props: { providers: (providers as ProvidersMap) ?? null, csrfToken: csrfToken ?? null } }
  } catch {
    return { props: { providers: null, csrfToken: null } }
  }
}

// ---- 스타일 ----
const styles: Record<string, React.CSSProperties> = {
  page: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0f4f8", padding: "1rem" },
  card: {
    width: "100%", maxWidth: "620px", background: "#fff", borderRadius: "14px",
    boxShadow: "0 10px 28px rgba(0,0,0,0.06)", padding: "2rem", textAlign: "center",
    fontFamily: `"Pretendard", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Noto Sans, sans-serif`,
    animation: "fadeIn 0.28s ease", position: "relative", overflow: "visible", marginTop: "-40px",
  },
  banner: {
    position: "absolute", top: -14, left: 0, right: 0, margin: "0 auto", transform: "translateY(-100%)",
    width: "max-content", maxWidth: "calc(100% - 2rem)", padding: ".6rem .9rem", borderRadius: "10px",
    fontSize: ".9rem", boxShadow: "0 6px 20px rgba(0,0,0,0.08)", animation: "slideDown 0.24s ease",
    whiteSpace: "nowrap", zIndex: 2, willChange: "transform, opacity", pointerEvents: "none",
  },
  bannerError: { background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" },
  bannerInfo: { background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e3a8a" },
  title: { margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#111827", lineHeight: 1.2 },
  subtitle: { marginTop: ".5rem", fontSize: "1rem", color: "#4b5563", lineHeight: 1.5 },
  form: { marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: ".75rem" },
  input: { padding: ".8rem 1rem", fontSize: "1rem", borderRadius: "10px", border: "1px solid #d1d5db", outline: "none" },
  primaryButton: { padding: ".85rem", background: "#2563eb", color: "#fff", fontSize: "1rem", fontWeight: 600, border: "none", borderRadius: "10px", cursor: "pointer", boxShadow: "0 8px 20px rgba(37,99,235,0.22)" },
  dividerContainer: { display: "flex", alignItems: "center", gap: ".5rem", margin: "1.5rem 0" },
  line: { flex: 1, height: "1px", background: "#e2e8f0" },
  orText: { color: "#6b7280", fontSize: ".875rem" },
  oAuthButton: {
    width: "100%", padding: ".8rem", background: "#fff", border: "1px solid #d1d5db",
    borderRadius: "10px", fontSize: "1rem", color: "#111827", marginBottom: ".75rem", cursor: "pointer",
  },
  legalNotice: { marginTop: "0.75rem", fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.5 },
  legalStrong: { fontWeight: 600, color: "#374151" },
  linkInline: { textDecoration: "underline", color: "#2563eb" },
  joinGuide: { marginTop: "1rem", fontSize: ".875rem", color: "#4b5563" },
  linkText: { fontWeight: 600, color: "#2563eb", cursor: "pointer" },
  footnote: { marginTop: "1.25rem", fontSize: ".75rem", color: "#9ca3af" },

  // 성공 패널
  successPanel: { marginTop: "1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1rem 1.25rem", textAlign: "center" },
  successTitle: { fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" },
  successText: { margin: ".5rem 0 .25rem", color: "#334155" },
  successHelp: { margin: 0, color: "#64748b", fontSize: ".9rem" },
  successActions: { marginTop: "1rem", display: "flex", gap: ".5rem", flexWrap: "wrap", justifyContent: "center" },
  secondaryButton: { padding: ".65rem 1rem", background: "#fff", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: ".95rem" },
  ghostButton: { padding: ".65rem 1rem", background: "transparent", border: "1px dashed #cbd5e1", borderRadius: "10px", fontSize: ".95rem", color: "#475569" },
  linkButton: { padding: ".65rem 1rem", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", fontSize: ".95rem", color: "#1e3a8a", cursor: "pointer" },

  // 도움말(접기/펼치기)
  helpWrap: { marginTop: "2rem" },
  helpToggle: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: ".5rem",
    fontWeight: 700,
    color: "#374151",
    padding: ".8rem 1rem",
    borderRadius: "10px",
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    textAlign: "left",
  },
  helpPanel: {
    overflow: "hidden",
    transition: "max-height 0.25s ease, border-color 0.25s ease",
    border: "1px solid transparent",
    borderTop: "none",
    borderRadius: "0 0 10px 10px",
    backgroundColor: "#ffffff",
  },
  helpInner: { padding: "1rem 1.25rem", textAlign: "left" },
  helpTitle: { margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" },
  helpList: { marginTop: ".5rem", paddingLeft: "1.2rem", lineHeight: 1.8, color: "#334155", fontSize: ".95rem" },
}

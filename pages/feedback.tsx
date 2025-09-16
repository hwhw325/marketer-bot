// pages/feedback.tsx
import Head from "next/head"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

type FormState = "idle" | "sending" | "sent" | "error"

const types = ["버그 신고", "기능 제안", "결제/환불", "기타"] as const
type FeedbackType = (typeof types)[number]

export default function FeedbackPage() {
  const { data: session } = useSession()
  const [email, setEmail] = useState("")
  const [type, setType] = useState<FeedbackType>("버그 신고")
  const [message, setMessage] = useState("")
  const [state, setState] = useState<FormState>("idle")
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)

  // 로그인되어 있으면 이메일 자동 채움
  useEffect(() => {
    if (!email && session?.user?.email) setEmail(session.user.email)
  }, [session, email])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrMsg(null)

    if (!email || !/\S+@\S+\.\S+/.test(email) || !message.trim() || !consent) {
      setErrMsg("이메일, 문의 내용, 개인정보 수집 동의를 확인해주세요.")
      setState("error")
      return
    }

    try {
      setState("sending")
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type, message }),
      })

      const data = await res.json()
      if (!res.ok) {
        setState("error")
        setErrMsg(data?.message || "전송에 실패했습니다. 잠시 후 다시 시도해주세요.")
        return
      }

      setState("sent")
      setMessage("")
      setConsent(false)
    } catch (err) {
      console.error(err)
      setState("error")
      setErrMsg("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.")
    }
  }

  return (
    <>
      <Head>
        <title key="title">피드백 | CopyQuick</title>
        <meta key="meta:viewport" name="viewport" content="width=device-width, initial-scale=1" />
        <meta key="meta:description" name="description" content="CopyQuick에 의견을 보내주세요" />
        <meta key="og:title" property="og:title" content="피드백 | CopyQuick" />
        <meta key="og:description" property="og:description" content="CopyQuick에 의견을 보내주세요" />
        <link key="link:favicon" rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-neutral-50 dark:bg-[#0b0f19] px-6 pt-12 flex items-start justify-center">
        <section className="w-full max-w-5xl bg-white dark:bg-[#0f172a] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] ring-1 ring-black/5 dark:ring-white/10 p-6 md:p-8">
          <h1 className="text-2xl md:text-[1.75rem] font-bold text-neutral-900 dark:text-white text-center">
            문의하기
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            제품 개선을 위해 여러분의 의견을 기다립니다 🙌
          </p>

          {/* 상태 배너 */}
          {state === "error" && errMsg && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 text-red-800 px-3 py-2 text-sm">
              <strong className="mr-1">오류:</strong> {errMsg}
            </div>
          )}
          {state === "sent" && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 text-blue-800 px-3 py-2 text-sm">
              소중한 의견 감사합니다! 빠르게 확인하겠습니다. 💙
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-5">
            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                이메일
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm dark:text-white px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                답변이 필요할 수 있어, 연락 가능한 주소를 적어주세요.
              </p>
            </div>

            {/* 유형 */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                문의 유형
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as FeedbackType)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm dark:text-white px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* 내용 */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                내용
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="자세한 내용을 적어주세요. (재현 방법, 기대 동작, 실제 동작 등)"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm dark:text-white px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                ⚠️ 개인정보보호를 위해 문의 내용에는 전화번호, 주민번호 등 민감한 개인정보 입력을 지양해 주세요.
              </p>
            </div>

            {/* 개인정보 수집·이용 동의 (필수) */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1"
                required
              />
              <label htmlFor="consent" className="text-sm text-gray-700 dark:text-gray-200">
                (필수) 개인정보 수집 및 이용에 동의합니다.
                <Link href="/privacy" className="ml-1 underline text-blue-600 dark:text-blue-400">
                  전문 보기
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={state === "sending"}
              className="group w-full py-3 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-[0_6px_20px_rgba(37,99,235,0.25)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-white dark:focus:ring-offset-[#0f172a] transition"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {state === "sending" ? "전송 중…" : "보내기"}
                <svg
                  className="h-4 w-4 opacity-90 group-hover:translate-x-0.5 transition"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            © 2025 CopyQuick. All rights reserved.
          </p>
        </section>
      </div>
    </>
  )
}

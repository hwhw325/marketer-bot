// pages/auth/signup.tsx
import Link from "next/link"
import Head from "next/head"
import { useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function SignUp() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [confirmAge, setConfirmAge] = useState(false)         // ✅ (필수) 만 14세 이상
  const [agreeTerms, setAgreeTerms] = useState(false)         // ✅ (필수) 이용약관
  const [agreePrivacy, setAgreePrivacy] = useState(false)     // ✅ (필수) 개인정보처리방침
  const [agreeMarketing, setAgreeMarketing] = useState(false) // (선택) 마케팅 수신
  const [loading, setLoading] = useState(false)

  // 이미 동의 완료한 사용자가 /auth/signup에 들어왔을 때 우회
  useEffect(() => {
    if (status !== "authenticated") return
    const u: any = session?.user || {}
    const tOk = !!u?.termsAcceptedAt
    const ageOk = !!u?.ageConfirmed
    if (tOk && ageOk) {
      const cb = (router.query.callbackUrl as string) || "/"
      router.replace(cb)
    }
  }, [status, session, router])

  // 인증 후 복귀했을 때: 보관된 동의값 있으면 자동 저장 + 세션 즉시 갱신
  useEffect(() => {
    if (!session?.user?.id) return
    const pending = sessionStorage.getItem("cq_pending_consent")
    if (!pending) return
    const parsed = JSON.parse(pending) as {
      accepted: boolean
      marketingConsent: boolean
      ageConfirmed: boolean
    }
    void saveAndFinalize(parsed.marketingConsent, parsed.accepted, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id])

  async function saveAndFinalize(marketing: boolean, accepted: boolean, fromPending = false) {
    try {
      setLoading(true)
      // 1) DB 저장: 필수 동의(accepted) + 만14세(ageConfirmed) + 선택 마케팅
      const res = await fetch("/api/user/consent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketingConsent: marketing,
          accepted,
          ageConfirmed: true,
        }),
      })
      if (!res.ok) throw new Error("consent-failed")

      // 2) 보관값 정리
      if (fromPending) sessionStorage.removeItem("cq_pending_consent")

      // 3) 세션 토큰 즉시 갱신 → middleware 통과
      await update({
        user: {
          termsAcceptedAt: new Date().toISOString(),
          marketingConsent: marketing,
          ageConfirmed: true,
        } as any,
      })

      // 4) 이동
      const cb = (router.query.callbackUrl as string) || "/"
      router.replace(cb)
    } catch (e) {
      console.error(e)
      alert("동의 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ 필수 체크 3종 확인: 만 14세 이상 + 약관 + 개인정보
    if (!confirmAge || !agreeTerms || !agreePrivacy) {
      alert("만 14세 이상 및 필수 약관에 동의해주세요.")
      return
    }

    // 로그인 상태면 즉시 저장
    if (session?.user?.id) {
      await saveAndFinalize(agreeMarketing, true)
      return
    }

    // 미로그인: 동의값 임시 저장 후 이메일 로그인 진행(매직 링크)
    sessionStorage.setItem(
      "cq_pending_consent",
      JSON.stringify({
        accepted: true,
        marketingConsent: agreeMarketing,
        ageConfirmed: true,
      })
    )

    try {
      setLoading(true)
      const nextReturn =
        "/auth/signup" +
        (router.query.callbackUrl
          ? `?callbackUrl=${encodeURIComponent(router.query.callbackUrl as string)}`
          : "")

      await signIn("email", {
        email,
        redirect: true,
        callbackUrl: nextReturn, // 인증 후 이 페이지로 복귀 → useEffect가 자동 저장
      })
    } catch (e) {
      console.error(e)
      alert("인증 메일 전송에 실패했습니다. 다시 시도해 주세요.")
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title key="title">회원가입 | CopyQuick</title>
        <meta key="meta:viewport" name="viewport" content="width=device-width, initial-scale=1" />
        <meta key="meta:description" name="description" content="이메일 인증 링크로 간편 가입" />
        <meta key="og:title" property="og:title" content="회원가입 | CopyQuick" />
        <meta key="og:description" property="og:description" content="이메일 인증 링크로 간편 가입" />
        <link key="link:favicon" rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-neutral-50 dark:bg-[#0b0f19] flex flex-col items-center pt-10 md:pt-20 px-4 relative overflow-hidden">
        {/* 장식용 그라데이션 */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.35),transparent_60%)] dark:opacity-40" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_60%)] dark:opacity-40" />

        {/* 카드 */}
        <section className="card w-full max-w-5xl bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur-sm shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* 좌측 안내 */}
            <aside className="relative p-8 md:p-10 bg-gradient-to-b from-blue-50 to-blue-100/70 dark:from-[#0b1b33] dark:to-[#0b223d]">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/10 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-100 ring-1 ring-blue-200/60 dark:ring-white/10">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600" />
                신규 가입 혜택 가이드
              </div>

              <h2 className="mt-4 text-[1.6rem] leading-tight font-bold text-blue-950 dark:text-blue-50">
                빠른 시작, <span className="text-blue-600">높은 전환</span>
              </h2>

              <p className="mt-3 text-[0.95rem] leading-7 text-blue-900/80 dark:text-blue-100/80">
                CopyQuick 가입은 1분이면 충분해요. 필수 동의만 체크하면 바로 시작!
                마케팅 소식 수신은 나중에 설정에서 언제든 변경할 수 있어요.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "템플릿 기반 문구 생성으로 퍼포먼스 향상",
                  "A/B 추천 문구 테스트로 클릭률 상승",
                  "저장·태그·다운로드(요금제별) 관리 편리",
                ].map((txt, i) => (
                  <li key={i} className="flex items-start gap-3 text-[0.95rem] text-blue-900/90 dark:text-blue-100/90">
                    <svg width="18" height="18" viewBox="0 0 24 24" className="mt-1 flex-none opacity-90">
                      <path fill="currentColor" d="M9.5 16.6 5.3 12.4l1.4-1.4 2.8 2.8 7.8-7.8 1.4 1.4z"/>
                    </svg>
                    <span>{txt}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-xl bg-white/70 dark:bg白/5 ring-1 ring-blue-200/50 dark:ring-white/10 p-4">
                <p className="text-[0.9rem] leading-6 text-blue-950/90 dark:text-blue-50/90">
                  <span className="font-semibold">TIP.</span> 회원가입 후{" "}
                  <Link href="/pricing" className="underline underline-offset-2 hover:text-blue-600">
                    요금제 페이지
                  </Link>
                  에서 연간 결제 전환 시 <span className="font-semibold">추가 혜택</span>이 제공돼요.
                </p>
              </div>
            </aside>

            {/* 우측 폼 */}
            <div className="p-6 md:p-8 lg:p-10">
              <h1 className="text-2xl md:text-[1.75rem] font-bold tracking-tight text-neutral-900 dark:text-white text-center">
                회원가입
              </h1>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                이메일 인증 링크로 간편하게 시작하세요.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* 세션 없을 때만 이메일 입력 노출 */}
                {!session && (
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      이메일 주소
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm dark:text-white px-3 py-3 outline-none
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      인증 메일이 전송되니, 수신 가능한 주소를 입력해 주세요.
                    </p>
                  </div>
                )}

                {/* 동의 체크 */}
                <fieldset className="space-y-3 text-[0.95rem] text-gray-800 dark:text-gray-200">
                  <legend className="sr-only">필수/선택 동의</legend>

                  {/* ✅ (필수) 만 14세 이상 */}
                  <label htmlFor="confirmAge" className="flex items-start gap-3">   {/* ★ htmlFor */}
                    <input
                      id="confirmAge"
                      name="confirmAge"
                      type="checkbox"
                      checked={confirmAge}
                      onChange={() => setConfirmAge(!confirmAge)}
                      className="mt-1 h-4 w-4 accent-blue-600"
                      aria-required="true"
                      aria-describedby="age-help"
                    />
                    <span>
                      (필수) 만 14세 이상입니다.{" "}
                      <span id="age-help" className="block text-xs text-gray-500 dark:text-gray-400">
                        만 14세 미만은 가입할 수 없습니다.
                      </span>
                    </span>
                  </label>

                  <label htmlFor="agreeTerms" className="flex items-start gap-3">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms(!agreeTerms)}
                      className="mt-1 h-4 w-4 accent-blue-600"
                      aria-required="true"
                    />
                    <span>
                      (필수) <Link href="/terms" className="text-blue-600 hover:underline">이용약관</Link>에 동의합니다.
                    </span>
                  </label>

                  <label htmlFor="agreePrivacy" className="flex items-start gap-3">
                    <input
                      id="agreePrivacy"
                      name="agreePrivacy"
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={() => setAgreePrivacy(!agreePrivacy)}
                      className="mt-1 h-4 w-4 accent-blue-600"
                      aria-required="true"
                    />
                    <span>
                      (필수) <Link href="/privacy" className="text-blue-600 hover:underline">개인정보처리방침</Link>에 동의합니다.
                    </span>
                  </label>

                  <label htmlFor="agreeMarketing" className="flex items-start gap-3">
                    <input
                      id="agreeMarketing"        // ★
                      name="agreeMarketing"
                      type="checkbox"
                      checked={agreeMarketing}
                      onChange={() => setAgreeMarketing(!agreeMarketing)}
                      className="mt-1 h-4 w-4 accent-blue-600"
                    />
                    <span>(선택) 마케팅 정보 수신에 동의합니다. (언제든 해지 가능)</span>
                  </label>
                </fieldset>

                {/* 버튼 */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full py-3 px-4 rounded-lg font-semibold text-white
                             bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                             shadow-[0_6px_20px_rgba(37,99,235,0.25)]
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
                             focus:ring-offset-white dark:focus:ring-offset-[#0f172a] transition"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {loading ? "처리 중…" : (session ? "동의하고 시작하기" : "인증 이메일 보내기")}
                    <svg className="h-4 w-4 opacity-90 group-hover:translate-x-0.5 transition" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
              </form>

              <div className="mt-5 text-sm text-center text-gray-600 dark:text-gray-400">
                이미 계정이 있으신가요?{" "}
                <Link href="/auth/signin" className="text-blue-600 hover:underline">로그인</Link>
              </div>

              <div className="mt-6 text-xs text-center text-gray-400">
                © 2025 CopyQuick. All rights reserved.
                <br />
                <Link href="/terms" className="hover:underline mr-2">이용약관</Link>
                <Link href="/privacy" className="hover:underline">개인정보처리방침</Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 모션: 접근성 고려 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card { animation: fadeIn 0.35s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .card { animation: none; }
        }
      `}</style>
    </>
  )
}

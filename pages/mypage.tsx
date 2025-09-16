// /pages/mypage.tsx
import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function MyPage() {
  // ✅ 세션 update까지 구조분해 (세션 즉시 갱신에 사용)
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const [darkMode, setDarkMode] = useState(false)

  const [savedCount, setSavedCount] = useState(0)
  const [tagCount, setTagCount] = useState(0)
  const [likedCount, setLikedCount] = useState(0)

  const [notifyEnabled, setNotifyEnabled] = useState(true)
  const [promoEnabled, setPromoEnabled] = useState(true)

  // ✅ 마케팅 수신 동의 (로컬 + 서버 반영)
  const [marketingConsent, setMarketingConsent] = useState(true)
  const [savingConsent, setSavingConsent] = useState(false)

  // ✅ 계정 탈퇴 진행 상태(중복 클릭 방지)
  const [deleting, setDeleting] = useState(false)

  // ✅ 미니 토스트(스낵바)
  const [toast, setToast] = useState<{ msg: string; kind: 'ok' | 'err' } | null>(null)
  const pushToast = (msg: string, kind: 'ok' | 'err' = 'ok') => {
    setToast({ msg, kind })
    setTimeout(() => setToast(null), 1600)
  }

  // ────────────────────────────────────────────────────────────────
  // 초기 다크모드
  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode) {
      setDarkMode(savedMode === 'true')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDark)
    }
  }, [])

  // 저장/태그/좋아요 카운트 (로컬 분석)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem('marketing-history')
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      setSavedCount(parsed.length)

      const allTags =
        parsed.flatMap((item: any) =>
          item.likes?.flatMap((like: any) =>
            typeof like?.tag === 'string'
              ? like.tag.split(',').map((t: string) => t.trim()).filter(Boolean)
              : []
          ) || []
        ) || []
      const uniqueTags = [...new Set(allTags)]
      setTagCount(uniqueTags.length)

      const liked = parsed.flatMap((item: any) =>
        item.likes?.filter((like: any) => like?.liked) || []
      )
      setLikedCount(liked.length)
    } catch (err) {
      console.error('로컬스토리지 파싱 오류:', err)
    }
  }, [])

  // ✅ 마케팅 동의: 세션 값 → 로컬 상태 초기화
  useEffect(() => {
    if (!session?.user) return
    setMarketingConsent(Boolean((session.user as any).marketingConsent))
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'marketingConsent',
        String((session.user as any).marketingConsent ?? false)
      )
    }
  }, [session?.user])

  // 기타 토글 로드
  useEffect(() => {
    if (typeof window === 'undefined') return
    const notify = localStorage.getItem('notifyEnabled')
    const promo = localStorage.getItem('promoEnabled')
    if (notify !== null) setNotifyEnabled(notify === 'true')
    if (promo !== null) setPromoEnabled(promo === 'true')
  }, [])

  const toggleNotify = () => {
    const next = !notifyEnabled
    setNotifyEnabled(next)
    if (typeof window !== 'undefined') localStorage.setItem('notifyEnabled', String(next))
  }

  const togglePromo = () => {
    const next = !promoEnabled
    setPromoEnabled(next)
    if (typeof window !== 'undefined') localStorage.setItem('promoEnabled', String(next))
  }

  // ✅ 마케팅 동의 토글: 로컬 즉시 반영 + 서버 PATCH + 세션 update() + 토스트
  const toggleMarketingConsent = async () => {
    const prev = marketingConsent
    const next = !prev
    setMarketingConsent(next)
    if (typeof window !== 'undefined') localStorage.setItem('marketingConsent', String(next))

    // 세션 없는 상태에선 로컬만 유지
    if (!session?.user?.id) return

    try {
      setSavingConsent(true)
      const res = await fetch('/api/user/marketing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketingConsent: next }),
      })
      if (!res.ok) throw new Error('failed')

      // ✅ 클라이언트 세션(JWT)도 즉시 갱신 → 화면에 바로 반영
      try {
        await update?.({ user: { marketingConsent: next } as any })
      } catch {}

      pushToast('저장됐어요 ✅', 'ok')
    } catch (e) {
      // 실패 시 롤백
      setMarketingConsent(prev)
      if (typeof window !== 'undefined') localStorage.setItem('marketingConsent', String(prev))
      pushToast('저장에 실패했어요 ❌', 'err')
    } finally {
      setSavingConsent(false)
    }
  }

  if (status === 'loading') return <div style={{ padding: '2rem' }}>로딩 중...</div>
  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const plan = (session.user as any)?.plan ?? 'free'

  const getPlanBadge = () => {
    const planMap: Record<string, { bg: string; color: string; label: string }> = {
      free: {
        bg: darkMode ? '#334155' : '#e5e7eb',
        color: darkMode ? '#e2e8f0' : '#374151',
        label: 'FREE 이용중',
      },
      basic: {
        bg: darkMode ? '#facc15' : '#fef9c3',
        color: darkMode ? '#1c1917' : '#92400e',
        label: 'BASIC 이용중',
      },
      pro: {
        bg: darkMode ? '#10b981' : '#d1fae5',
        color: darkMode ? '#f0fdfa' : '#047857',
        label: 'PRO 이용중',
      },
    }
    const selected = planMap[plan] || planMap['free']
    return (
      <span
        style={{
          backgroundColor: selected.bg,
          color: selected.color,
          padding: '0.35rem 0.9rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginLeft: '0.5rem',
        }}
      >
        {selected.label}
      </span>
    )
  }

  // ✅ 계정 탈퇴: 성공 안내 후 로그아웃(+ 플래시 쿼리)
  const handleWithdraw = async () => {
    if (deleting) return
    const confirmed = confirm('정말로 탈퇴하시겠어요? 저장된 문구는 복구할 수 없습니다.')
    if (!confirmed) return

    setDeleting(true)
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || '탈퇴 실패')
      }

      // 로컬 정리
      try {
        localStorage.removeItem('marketing-history')
        localStorage.removeItem('liked-lines')
        localStorage.removeItem('tag-filter')
        localStorage.removeItem('marketingConsent')
        localStorage.removeItem('notifyEnabled')
        localStorage.removeItem('promoEnabled')
      } catch {}

      // ✅ 확실히 안내 → 홈으로 이동(플래시 배너)
      alert('계정 삭제가 완료되었습니다. 이용해 주셔서 감사합니다!')
      await signOut({ callbackUrl: '/?deleted=1' })
    } catch (err) {
      console.error(err)
      alert('탈퇴에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: darkMode ? '#0f172a' : '#f9fafb',
        color: darkMode ? '#f1f5f9' : '#1f2937',
        padding: '3rem 1rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* ✅ 토스트 */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: toast.kind === 'ok' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${toast.kind === 'ok' ? '#a7f3d0' : '#fecaca'}`,
            color: toast.kind === 'ok' ? '#065f46' : '#991b1b',
            padding: '.55rem .85rem',
            borderRadius: 10,
            fontSize: '.9rem',
            boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
            zIndex: 10000,
          }}
        >
          {toast.msg}
        </div>
      )}

      <div
        style={{
          maxWidth: '1600px',
          width: '100%',
          backgroundColor: darkMode ? '#1e293b' : '#ffffff',
          borderRadius: '1rem',
          padding: '2.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          border: darkMode ? '1px solid #334155' : '1px solid #e5e7eb',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>👤 마이페이지</h1>

        {/* ✅ 유저 정보 카드 */}
        <div
          style={{
            backgroundColor: darkMode ? '#334155' : '#f1f5f9',
            padding: '1.25rem',
            borderRadius: '0.75rem',
            border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
            marginBottom: '2rem',
          }}
        >
          <p style={{ marginBottom: '0.6rem' }}>
            <strong>이메일:</strong> {session.user?.email}
          </p>
          <p>
            <strong>현재 요금제:</strong>
            {getPlanBadge()}
          </p>

          {['free', 'basic'].includes(plan) && (
            <div
              style={{
                borderRadius: '1rem',
                padding: '2rem',
                marginTop: '2rem',
                marginBottom: '2.5rem',
                backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
                border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                boxShadow: darkMode
                  ? '0 4px 16px rgba(0,0,0,0.4)'
                  : '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <div style={{ fontSize: '2rem' }}>🎁</div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: darkMode ? '#f1f5f9' : '#1e293b',
                      marginBottom: '0.5rem',
                    }}
                  >
                    더 많은 기능이 열려있어요
                  </div>
                  <div
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      color: darkMode ? '#cbd5e1' : '#475569',
                    }}
                  >
                    <strong style={{ color: darkMode ? '#5eead4' : '#0f766e' }}>
                      Pro 요금제
                    </strong>
                    로 업그레이드하면 저장 문구 다운로드, A/B 테스트 결과 저장,
                    태그 필터 정렬 등 다양한 고급 기능이 모두 열려요.
                  </div>
                  <button
                    onClick={() => router.push('/pricing')}
                    style={{
                      marginTop: '1rem',
                      backgroundColor: darkMode ? '#0f766e' : '#14b8a6',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.6rem 1.25rem',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      boxShadow: darkMode
                        ? '0 2px 6px rgba(0,0,0,0.3)'
                        : '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    🌟 Pro 혜택 자세히 보기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ 저장 문구 / 태그 / 즐겨찾기 요약 박스 */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            backgroundColor: darkMode ? '#1e293b' : '#f9fafb',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
          }}
        >
          <span>📌 저장 문구: <strong>{savedCount}</strong></span>
          <span>🏷️ 태그 수: <strong>{tagCount}</strong></span>
          <span>❤️ 즐겨찾기: <strong>{likedCount}</strong></span>
        </div>

        {/* 요금제 박스 */}
        <div
          style={{
            backgroundColor: darkMode ? '#0f172a' : '#f9fafb',
            padding: '1.25rem',
            borderRadius: '0.75rem',
            border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            marginBottom: '2rem',
          }}
        >
          {plan === 'free' ? (
            <>
              <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                💡 현재 요금제에 가입되어 있지 않아요.
              </p>
              <button
                onClick={() => router.push('/pricing')}
                style={{
                  backgroundColor: '#10b981',
                  color: '#fff',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                ➕ Pro 혜택 보기
              </button>
            </>
          ) : (
            <p style={{ fontSize: '0.95rem' }}>
              💳 현재 요금제: <strong style={{ color: plan === 'pro' ? '#0d9488' : '#92400e' }}>
                {plan.toUpperCase()}
              </strong>{' '}
              – 매월 {plan === 'pro' ? '14,900' : '7,900'}원 자동결제 중 (Toss 예정)
            </p>
          )}
        </div>

        {/* ✅ 마케팅 수신 동의 토글 */}
        <div style={{ marginBottom: '2rem' }}>
          <label
            style={{
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: darkMode ? '#1e293b' : '#fefce8',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: darkMode ? '1px solid #78350f' : '1px solid #fde68a',
              color: darkMode ? '#fcd34d' : '#92400e',
            }}
          >
            <span>📬 마케팅 수신 동의</span>
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={toggleMarketingConsent}
              disabled={savingConsent}
              style={{ transform: 'scale(1.3)', cursor: 'pointer' }}
            />
          </label>
          {savingConsent && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: darkMode ? '#cbd5e1' : '#64748b' }}>
              저장 중…
            </p>
          )}
        </div>

        {/* 연결된 계정 */}
        <div
          style={{
            backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
            border: darkMode ? '1px solid #334155' : '1px solid #e5e7eb',
            padding: '1.25rem',
            borderRadius: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>🔗 연결된 계정</p>
          <p style={{ fontSize: '0.9rem', color: darkMode ? '#cbd5e1' : '#374151' }}>
            {session.user?.email?.includes('@gmail.com')
              ? 'Google 계정으로 로그인됨'
              : session.user?.email?.includes('@kakao.com')
              ? 'Kakao 계정으로 로그인됨'
              : '일반 이메일 계정으로 로그인됨'}
          </p>
        </div>

        {/* 탈퇴 안내/버튼 */}
        <div
          style={{
            backgroundColor: darkMode ? '#1f2937' : '#fff7ed',
            border: `1px solid ${darkMode ? '#f87171' : '#fed7aa'}`,
            padding: '1.25rem',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem',
            color: darkMode ? '#f87171' : '#b45309',
            fontSize: '0.9rem',
            lineHeight: 1.6,
          }}
        >
          ⚠️ 계정을 정리하고 싶으신가요? <br />
          탈퇴 시 저장된 문구와 정보는 복구할 수 없습니다.
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleWithdraw}
            disabled={deleting}
            style={{
              background: 'none',
              border: 'none',
              color: darkMode ? '#94a3b8' : '#6b7280',
              fontSize: '0.85rem',
              textDecoration: 'underline',
              cursor: deleting ? 'not-allowed' : 'pointer',
              opacity: deleting ? 0.6 : 1,
            }}
          >
            {deleting ? '처리 중…' : '👋 계정을 탈퇴하고 싶으신가요?'}
          </button>
        </div>

        {/* 안내 */}
        <div
          style={{
            marginTop: '2rem',
            fontSize: '0.85rem',
            color: darkMode ? '#cbd5e1' : '#64748b',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          🙋‍♀️ 더 많은 기능이 필요하거나, 도움이 필요하신가요? <br />
          <span style={{ fontWeight: 500, color: darkMode ? '#38bdf8' : '#0ea5e9' }}>
            Pro 혜택 안내 페이지
          </span>
          를 확인하거나, <br />
          언제든 <span style={{ fontWeight: 500 }}>고객지원</span>으로 문의해 주세요 💌
        </div>
      </div>
    </div>
  )
}

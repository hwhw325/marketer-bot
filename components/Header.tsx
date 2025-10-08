// components/Header.tsx
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'
import styles from './Header.module.css'

export default function Header({ darkMode }: { darkMode: boolean }) {
  const router = useRouter()
  const isHome = router.pathname === '/'                // 홈에서만
  const imgPriority = isHome  // 홈에서만 우선 로드(유지)
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 원하는 디스플레이 크기 (원본 1024x512 비율 유지)
  // 👉 숫자만 바꾸면 로고가 바로 커졌다/작아졌다 합니다.
  const DESKTOP_LOGO_W = 220   // 원하시는 가로(px)
  const DESKTOP_LOGO_H = 110   // 1024:512 = 2:1 → 높이는 가로의 1/2
  const DESKTOP_HEADER_H = 100 // 헤더 높이

  const MOBILE_LOGO_W = 160
  const MOBILE_LOGO_H = 80
  const MOBILE_HEADER_H = 64

  // 좌우 여백(왼쪽이 너무 붙어 보일 때 이 값만 늘리세요)
  const PAD_LEFT_DESKTOP = '2.5rem'
  const PAD_RIGHT_DESKTOP = '2rem'
  const PAD_X_MOBILE = '1rem'

  useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // 항상 라이트 버전 사용 (원하면 darkMode ? '/logo-dark.png' : '/logo-light.png')
  const logoSrc = '/logo-light.png'

  // ✅ 여기서 CSS 변수 주입 → CSS가 로고/헤더 크기 적용
  const headerVars: React.CSSProperties = {
    // 헤더 높이 / 좌우 패딩
    ['--header-h' as any]: `${isMobile ? MOBILE_HEADER_H : DESKTOP_HEADER_H}px`,
    ['--pad-left' as any]: isMobile ? PAD_X_MOBILE : PAD_LEFT_DESKTOP,
    ['--pad-right' as any]: isMobile ? PAD_X_MOBILE : PAD_RIGHT_DESKTOP,
    // 로고 박스 크기
    ['--logo-w' as any]: `${isMobile ? MOBILE_LOGO_W : DESKTOP_LOGO_W}px`,
    ['--logo-h' as any]: `${isMobile ? MOBILE_LOGO_H : DESKTOP_LOGO_H}px`,
    // (모바일 전용 변수는 media query에서 위 값 그대로 쓰므로 별도 주입 불필요)
  }

  return (
    <header className={`${styles.header} ${darkMode ? styles.dark : ''}`} style={headerVars}>
      {/* 로고 */}
      <div className={styles.logo}>
        <Link href="/" aria-label="CopyQuick 홈">
          <div className={styles.logoBox}>
            <Image
              src={logoSrc}
              alt="CopyQuick"
              fill
              className={styles.logoImg}
              sizes="(max-width: 640px) 160px, 220px"  // 실제 DESKTOP_LOGO_W와 일치
              priority={imgPriority}
              fetchPriority={imgPriority ? "high" : undefined} // (선택) 크롬 힌트
            />
          </div>
        </Link>
      </div>

      {/* 오른쪽 메뉴 묶음 (요금제 + 유저메뉴) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* 요금제 메뉴 */}
        <div className={styles.menu}>
          <Link href="/pricing">
            <span
              className={styles.proMenu}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              {isMobile ? 'Pro' : 'Pro 혜택 보기'}
              <span>➕</span>
            </span>
          </Link>
        </div>

        {/* 로그인 메뉴 */}
        <div className={styles.userMenu}>
          {session ? (
            <>
              <button
                ref={buttonRef}
                className={`${styles.toggle} header-username`}
                onClick={() => setOpen((o) => !o)}
                aria-label="사용자 메뉴 열기/닫기"
                aria-expanded={open}
              >
                🎉 {session.user?.email?.split('@')[0]}님
                <span
                  style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    backgroundColor:
                      session.user?.plan === 'pro'
                        ? '#10b981'
                        : session.user?.plan === 'basic'
                        ? '#3b82f6'
                        : '#d1d5db',
                    color:
                      session.user?.plan === 'pro' || session.user?.plan === 'basic'
                        ? '#ffffff'
                        : '#374151',
                  }}
                >
                  {session.user?.plan === 'pro'
                    ? 'Pro'
                    : session.user?.plan === 'basic'
                    ? 'Basic'
                    : 'Free'}
                </span>
                <span style={{ marginLeft: '0.3rem' }}>▾</span>
              </button>

              {open && (
                <div ref={menuRef} className={styles.dropdown}>
                  <Link href="/mypage">마이페이지</Link>
                  <Link href="/guide">사용 가이드</Link>
                  <Link href="/feedback">문의하기</Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })}>로그아웃</button>
                </div>
              )}
            </>
          ) : (
            <Link href="/auth/signin" className="header-username">로그인</Link>
          )}
        </div>
      </div>
    </header>
  )
}

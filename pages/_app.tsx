// pages/_app.tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { createContext, useState, useRef, useEffect, RefObject } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { MotionConfig } from 'framer-motion'

export type UIContextType = {
  darkMode: boolean
  toggleDarkMode: () => void
  scrollToLiked: () => void
  likedRef: RefObject<HTMLDivElement>
}

export const UIContext = createContext<UIContextType | undefined>(undefined)

interface MyAppProps extends AppProps {
  pageProps: {
    session?: any
    [key: string]: any
  }
}

export default function MyApp({ Component, pageProps }: MyAppProps) {
  const { session, ...restProps } = pageProps
  const [darkMode, setDarkMode] = useState(false)
  const likedRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const toggleDarkMode = () => setDarkMode(prev => !prev)
  const scrollToLiked = () => likedRef.current?.scrollIntoView({ behavior: 'smooth' })

  // 다크모드 초기화
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('darkMode') : null
    if (stored !== null) setDarkMode(JSON.parse(stored))
  }, [])

  // 다크모드 클래스 토글 + 저장
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(darkMode))
    }
  }, [darkMode])

  // 홈류 페이지에서 body.home 클래스로 스타일링
  useEffect(() => {
    const isHomeLikePage =
      router.pathname === '/' ||
      router.pathname === '/pricing' ||
      router.pathname === '/auth/signin' ||
      router.pathname.startsWith('/guide')
    document.body.classList.toggle('home', isHomeLikePage)
  }, [router.pathname])

  // --------- 🔽 OG/Twitter 메타에 사용할 헬퍼들 (하드코딩 방지) ----------
  const ver = process.env.NEXT_PUBLIC_ASSET_VERSION ?? '1'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const og = (path: string) => (siteUrl ? `${siteUrl}${path}?v=${ver}` : `${path}?v=${ver}`)
  // ---------------------------------------------------------------------

  return (
    <>
      {/* 🔹 전역 메타 (페이지별로 바꾸고 싶으면 각 페이지에서 <Head>로 오버라이드 가능) */}
      <Head>
        {/* 파비콘(SVG). 파일명을 바꾸고 싶으면 여기만 변경 */}
        <link rel="icon" href={`/favicon.svg?v=${ver}`} type="image/svg+xml" />

        {/* 기본 SEO */}
        <title>CopyQuick — 3초 만에 마케팅 문구 3개</title>
        <meta
          name="description"
          content="감성·타깃·스타일만 선택하면 3초 만에 마케팅 문구 3개! 로그인 후 바로 체험해 보세요."
        />
        <meta name="theme-color" content="#22d3ee" />

        {/* Open Graph (카톡/페북/슬랙) */}
        <meta property="og:title" content="CopyQuick — 3초 만에 마케팅 문구 3개" />
        <meta
          property="og:description"
          content="감성·타깃·스타일만 선택하면 3초 만에 마케팅 문구 3개! 로그인 후 바로 체험."
        />
        <meta property="og:type" content="website" />
        {/* 절대 URL 권장: 프록시 캐시 안정성 ↑ */}
        <meta property="og:url" content={siteUrl || undefined} />
        <meta property="og:image" content={og('/og.png')} />

        {/* Twitter 카드 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CopyQuick — 3초 만에 마케팅 문구 3개" />
        <meta
          name="twitter:description"
          content="감성·타깃·스타일만 선택하면 3초 만에 생성!"
        />
        <meta name="twitter:image" content={og('/og.png')} />
      </Head>

      {/* ✅ 전역 모션 설정: OS의 '애니메이션 줄이기'를 자동 반영 */}
      <SessionProvider session={session}>
        <MotionConfig reducedMotion="user">
          <UIContext.Provider value={{ darkMode, toggleDarkMode, scrollToLiked, likedRef }}>
            <Layout>
              {/* session 포함한 전체 pageProps 전달 */}
              <Component {...pageProps} />
            </Layout>
          </UIContext.Provider>
        </MotionConfig>
      </SessionProvider>
    </>
  )
}

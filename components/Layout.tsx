// components/Layout.tsx
import { useRouter } from 'next/router'
import Header from './Header'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const { pathname } = useRouter()

  // 홈('/') 경로인 경우 body에 'home' 클래스를 붙여서 globals.css에서 background를 분기 처리
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const cls = 'home'
      document.body.classList.toggle(cls, pathname === '/')
    }
  }, [pathname])

  return (
    <>
      <Header />
      <main style={{ paddingTop: '0px' }}>
        {children}
      </main>
    </>
  )
}

// components/Layout.tsx
import { useRouter } from 'next/router'
import Header from './Header'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const { pathname } = useRouter()

  // 홈('/') 경로인 경우 body에 'home' 클래스를 붙여서 globals.css에서 background 분기 처리
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const cls = 'home'
      document.body.classList.toggle(cls, pathname === '/')
    }
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 이 부분만(content area) 컨테이너, 패딩이 적용됩니다 */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}

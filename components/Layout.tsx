// components/Layout.tsx
import React, { useContext } from 'react'
import Header from './Header'
import Link from 'next/link'
import { UIContext } from '../pages/_app'  // ✅ 전역 다크모드 상태 가져오기

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const ui = useContext(UIContext)
  const darkMode = ui?.darkMode ?? false  // ✅ context에서 darkMode 추출

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <Header darkMode={darkMode} />

      <main className="flex-grow p-0 m-0">
  <div className="w-full pt-0 pb-8">
    {children}
  </div>
</main>


      <footer className={`border-t py-6 mt-auto text-center text-sm ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
        <div className="mb-2">
          © {new Date().getFullYear()} CopyQuick. All rights reserved.
        </div>
        <div>
          <Link href="/terms" legacyBehavior>
            <a target="_blank" className="underline mr-4">이용약관</a>
          </Link>
          <Link href="/privacy" legacyBehavior>
            <a target="_blank" className="underline">개인정보처리방침</a>
          </Link>
        </div>
      </footer>
    </div>
  )
}

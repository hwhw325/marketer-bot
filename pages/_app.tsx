// pages/_app.tsx
import '../styles/globals.css'
import { AppProps } from 'next/app'
import { createContext, useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'

export type UIContextType = {
  darkMode: boolean
  toggleDarkMode: () => void
  scrollToLiked: () => void
  likedRef: React.RefObject<HTMLDivElement>
}

export const UIContext = createContext<UIContextType | undefined>(undefined)

export default function MyApp({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false)
  const likedRef = useRef<HTMLDivElement>(null)

  const toggleDarkMode = () => setDarkMode((prev) => !prev)
  const scrollToLiked = () => {
    likedRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 시작할 때 로컬스토리지에서 darkMode 읽어오기
  useEffect(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) {
      setDarkMode(JSON.parse(stored))
    }
  }, [])

  // darkMode가 바뀔 때 <html> 클래스 토글 및 로컬스토리지 저장
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

return (
  <UIContext.Provider value={{ darkMode, toggleDarkMode, scrollToLiked, likedRef }}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </UIContext.Provider>
 )
}
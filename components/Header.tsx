// components/Header.tsx
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <img
            src="/logo-light.png"
            alt="CopyQuick"
            className={styles.logoImage}
          />
        </Link>
      </div>

      <button
        ref={buttonRef}
        className={styles.menuButton}
        onClick={() => setOpen(o => !o)}
        aria-label="메뉴 열기/닫기"
        aria-expanded={open}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      {open && (
        <nav ref={menuRef} className={styles.menu}>
          <ul>
            <li>
              <Link href="/guide">사용 가이드</Link>
            </li>
            <li>
              <Link href="/feedback">피드백 보내기</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

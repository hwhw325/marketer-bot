// pages/feedback.tsx
import { useState } from 'react'
import Link from 'next/link'
import styles from './feedback.module.css'

export default function Feedback() {
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) {
      alert('피드백 내용을 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: feedback.trim() }),
      })

      if (res.ok) {
        alert('피드백이 성공적으로 전송되었습니다! 감사합니다 😊')
        setFeedback('')
      } else {
        const { error } = await res.json()
        alert(`전송에 실패했습니다: ${error}`)
      }
    } catch (err: any) {
      console.error(err)
      alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>✉️ 피드백 보내기</h1>
        <p className={styles.subtitle}>
          사용 중 발견한 버그나 개선 아이디어, 기타 불편 사항을 자유롭게 남겨주세요.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="여기에 피드백을 입력하세요..."
            className={styles.textarea}
            disabled={loading}
          />
          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submit}
              disabled={loading}
            >
              {loading ? '전송 중…' : '제출하기'}
            </button>
          </div>
        </form>
      </div>
      <Link href="/" className={styles.back}>
        ← 홈으로 돌아가기
      </Link>
    </div>
  )
}

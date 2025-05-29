// pages/guide.tsx
import Link from 'next/link'
import styles from './guide.module.css'

export default function Guide() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>📖 사용 가이드</h1>

      <ol className={styles.steps}>
        <li className={styles.step}>
          <div className={styles.stepHeader}>
            <span className={styles.icon}>🔍</span>
            <h2 className={styles.stepTitle}>키워드 입력</h2>
          </div>
          <p className={styles.stepDesc}>
            상단 검색창에 홍보하고 싶은 <strong>상품·서비스의 핵심 키워드</strong>를 입력하세요.<br/>
            예: “프리미엄 향수”, “유럽 여행 패키지”
          </p>
          <p className={styles.tip}>💡 키워드는 짧고 명확하게 입력할수록 좋아요.</p>
        </li>

        <li className={styles.step}>
          <div className={styles.stepHeader}>
            <span className={styles.icon}>⚙️</span>
            <h2 className={styles.stepTitle}>조건 선택</h2>
          </div>
          <p className={styles.stepDesc}>
            감성, 분위기, 톤, 사용 목적 등을<br/>
            원하는 만큼 체크박스로 자유롭게 선택하세요.<br/>
            <strong>카테고리</strong> 드롭다운에서 분야별(예: 뷰티·여행·IT) 카테고리를 선택하면<br/>
해당 업종에 최적화된 문구를 생성합니다.

          </p>
          <p className={styles.tip}>🎯 조합에 따라 완전히 다른 느낌의 문장이 나와요.</p>
        </li>

        <li className={styles.step}>
          <div className={styles.stepHeader}>
            <span className={styles.icon}>🚀</span>
            <h2 className={styles.stepTitle}>문구 생성</h2>
          </div>
          <p className={styles.stepDesc}>
            “이 조건으로 문구 생성하기” 버튼을 누르면<br/>
            AI가 선택한 키워드·톤으로 <strong>3가지 마케팅 문구</strong>를 제안합니다.<br/>
            ⏳ 생성에는 약 2–3초가 소요됩니다.
          </p>
          <p className={styles.tip}>⏳ 로딩 중에는 상단 스피너가 돌고 있어요.</p>
        </li>

        <li className={styles.step}>
          <div className={styles.stepHeader}>
            <span className={styles.icon}>❤️</span>
            <h2 className={styles.stepTitle}>문구 저장 · 편집 · 태그</h2>
          </div>
          <p className={styles.stepDesc}>
            1) 마음에 드는 문구 옆의 ❤️ 아이콘을 클릭해 저장할 수 있습니다.<br/>
            2) 저장된 문구는 “저장 문구 보기”에서 확인하고, ✏️ 아이콘으로 언제든 수정 가능해요.<br/>
            3) ✨ <strong>태그 기능</strong>을 활용해 자주 쓰는 문구를 분류하고<br/>
            &nbsp;&nbsp;&nbsp;🔖 카테고리별로 빠르게 꺼내 쓰세요.
          </p>
          <p className={styles.tip}>💡 태그로 묶어두면 관리가 훨씬 편해집니다.</p>
        </li>

        <li className={styles.step}>
          <div className={styles.stepHeader}>
            <span className={styles.icon}>📜</span>
            <h2 className={styles.stepTitle}>히스토리 · 불러오기</h2>
          </div>
          <p className={styles.stepDesc}>
            이전에 생성한 모든 문구는 “히스토리”에서 확인할 수 있습니다.<br/>
            • 목록을 클릭해 상세보기 후 다시 “불러오기” 버튼으로<br/>
            &nbsp;&nbsp;&nbsp;생성 화면에 복원할 수 있어요.<br/>
            • 필요하다면 ✏️ 편집·🗑️ 삭제도 자유롭게!
          </p>
          <p className={styles.tip}>⌛️ 과거 문구를 불러오면 반복 작업 없이 바로 재활용 가능합니다.</p>
        </li>
      </ol>

      <div className={styles.back}>
        <Link href="/" className={styles.backLink}>← 홈으로 돌아가기</Link>
      </div>
    </div>
  )
}

// pages/guide.tsx
import Link from 'next/link'
import styles from './guide.module.css'
import React, { useContext } from 'react'
import { UIContext } from './_app'    // ✅ 다크모드 컨텍스트

export default function Guide() {
  const ui = useContext(UIContext)
  const darkMode = ui?.darkMode ?? false

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      <h1 className={styles.heading}>📖 사용 가이드</h1>

      <ol className={styles.steps}>
        <li className={styles.step}>
          <div className={styles.stepHeader}>
            <span className={styles.icon}>🔍</span>
            <h2 className={styles.stepTitle}>키워드 입력</h2>
          </div>
          <p className={styles.stepDesc}>
            상단 검색창에 홍보하고 싶은 <strong>상품·서비스의 핵심 키워드</strong>를 입력하세요.<br />
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
            감성, 분위기, 톤, 사용 목적 등을<br />
            원하는 만큼 체크박스로 자유롭게 선택하세요.<br />
            <strong>카테고리</strong> 드롭다운에서 분야별(예: 뷰티·여행·IT) 카테고리를 선택하면<br />
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
            “이 조건으로 문구 생성하기” 버튼을 누르면<br />
            AI가 선택한 키워드·톤으로 <strong>3가지 마케팅 문구</strong>를 제안합니다.<br />
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
            1) 마음에 드는 문구 옆의 ❤️ 아이콘을 클릭해 저장할 수 있습니다.<br />
            2) 저장된 문구는 “저장 문구 보기”에서 확인하고, ✏️ 아이콘으로 언제든 수정 가능해요.<br />
            3) ✨ <strong>태그 기능</strong>을 활용해 자주 쓰는 문구를 분류하고<br />
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
            이전에 생성한 모든 문구는 “히스토리”에서 확인할 수 있습니다.<br />
            • 목록을 클릭해 상세보기 후 다시 “불러오기” 버튼으로<br />
            &nbsp;&nbsp;&nbsp;생성 화면에 복원할 수 있어요.<br />
            • 필요하다면 ✏️ 편집 · 🗑️ 삭제도 자유롭게!<br />
            • 각 문구 아래의 📝 메모 입력란에<br />
            &nbsp;&nbsp;&nbsp;활용 목적이나 성과를 자유롭게 기록해보세요.<br />
            &nbsp;&nbsp;&nbsp;예: 상세페이지 적용 – 전환율 2배 상승
          </p>
          <p className={styles.tip}>⌛️ 과거 문구를 불러오면 반복 작업 없이 바로 재활용 가능합니다.</p>
        </li>

        <li className={styles.step}>
          <div className={styles.stepHeader}>
            <span className={styles.icon}>🧪</span>
            <h2 className={styles.stepTitle}>A/B 추천 문구란?</h2>
          </div>
          <p className={styles.stepDesc}>
            하나의 키워드로 <strong>2개의 문구 스타일</strong>을 비교하고 싶을 때 사용하는 기능입니다.<br />
            • 일반 문구 생성과 달리, <strong>두 개의 문구를 한 번에 제시</strong>하여<br />
            &nbsp;&nbsp;&nbsp;어떤 스타일이 더 적합한지 선택해볼 수 있어요.<br />
            • 성향, 말투, CTA 문구 등이 <strong>약간씩 다르게 구성</strong>되어<br />
            SNS나 광고에서 A/B 테스트에 유용합니다.
          </p>
          <p className={styles.tip}>🧠 Pro 플랜에서는 더 다양한 A/B 스타일이 제공될 예정입니다!</p>
        </li>

        <li className={styles.step}>
          <div className={styles.stepHeader}>
            <span className={styles.icon}>✨</span>
            <h2 className={styles.stepTitle}>문구 생성 vs A/B 추천 — 무엇이 다를까요?</h2>
          </div>

          <p className={styles.stepDesc}>🤔 두 기능의 차이가 궁금하신가요?</p>

          <table className={styles.abTable}>
            <thead>
              <tr>
                <th>기능 이름</th>
                <th>주요 특징</th>
                <th>사용 목적</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>✨ 문구 생성하기</td>
                <td>- 한 번 클릭 시 <strong>3개의 문장</strong> 생성<br />- 다양한 표현 조합 제안</td>
                <td>✔️ 여러 문장을 빠르게 보고 싶을 때</td>
              </tr>
              <tr>
                <td>✍️ A/B 추천 문구</td>
                <td>- 한 번 클릭 시 <strong>2개의 스타일이 다른 문장</strong> 생성<br />- 전략적 비교에 적합</td>
                <td>✔️ 어떤 스타일이 더 효과적인지 비교할 때</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '1rem' }}>
            <strong>✔️ 문구 생성하기는 이런 분께 추천드려요</strong>
            <ul className={styles.abGuideList}>
              <li>- 여러 문장을 빠르게 확인하고, 마음에 드는 문구를 골라 쓰고 싶을 때</li>
              <li>- 빠르게 SNS·배너 문구를 복사해 사용하고 싶을 때</li>
            </ul>

            <strong>✍️ A/B 추천 문구는 이런 상황에서 좋아요</strong>
            <ul className={styles.abGuideList}>
              <li>- 감성적인 문장 vs CTA 중심 문장 중 어떤 것이 더 나을지 비교하고 싶을 때</li>
              <li>- 광고 문구 성과 실험(A/B 테스트)을 하고 싶을 때</li>
            </ul>
          </div>
        </li>
      </ol>

      <div className={styles.back}>
        <Link href="/" className={styles.backLink}>← 홈으로 돌아가기</Link>
      </div>
    </div>
  )
}

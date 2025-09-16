// components/Footer.tsx

type FooterProps = {
  darkMode?: boolean
}

export default function Footer({ darkMode = false }: FooterProps) {
  return (
    <footer className={`footer ${darkMode ? 'dark' : ''}`}>
      <div className="footer-inner">
        <div className="footer-logo">© 2025 CopyQuick</div>
        <div className="footer-links">
          <a href="/terms">이용약관</a>
          <a href="/privacy">개인정보처리방침</a>
        </div>
        <div className="footer-info">
          <p>상호명: (주)카피퀵 ｜ 대표: 김카피</p>
          <p>사업자등록번호: 123-45-67890 ｜ 통신판매업 신고번호: 제2025-서울서초-1234호</p>
          <p>주소: 서울특별시 서초구 강남대로 123, 5층</p>
          <p>고객센터: 02-1234-5678 ｜ 이메일: hello@copyquick.kr</p>
          <p>개인정보보호책임자: 김보안 (privacy@copyquick.kr)</p>
        </div>
      </div>
    </footer>
  )
}

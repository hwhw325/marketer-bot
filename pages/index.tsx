import Header from '../components/Header'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { UIContext } from '../pages/_app'
import { GetServerSideProps } from 'next'
import type { Session } from 'next-auth'
import { getSession, useSession, signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import ProofRotator      from '../components/ProofRotator'
import TemplateSelector  from '../components/TemplateSelector'
import OnboardingModal   from '../components/OnboardingModal'
import UpgradeModal from '../components/UpgradeModal'
import { useRouter } from 'next/router'
import Footer from '../components/Footer'
import Link from 'next/link'
import { HowItWorks, TemplateQuizLite, FeatureGrid, PricingSnapshot, ROIBar, FAQList, FinalCTA } from '../components/BelowFold'



type HistoryItem = {
  keyword: string
  category: string
  tone: string
  emotion: string
  target: string
  gender: string
  purpose: string
  result: string
  likes?: { liked: boolean; tag?: string }[]
  savedAt?: string
  memo?: string
}

// ✅ user.plan 사용 가능하도록 타입 확장
declare module 'next-auth' {
  interface User {
    plan?: string
  }
}

// ✅ 다크모드 반영된 containerStyle 정의 (함수 안으로 이동됨)
export const getServerSideProps: GetServerSideProps<{ session: Session | null }> = async ctx => {
  const session = await getSession(ctx)
  return { props: { session } }
}

function Landing({ darkMode }: { darkMode: boolean }) {
  const overviewRef = useRef<HTMLDivElement>(null)
  const scrollToOverview = () => {
  document.getElementById('sample')?.scrollIntoView({ behavior: 'smooth' })
}
  const [demo, setDemo] = useState<string | null>(null)

  const handleDemo = async () => {
    const res = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: '예시 키워드: 감성 카페' }),
    })
    const { result } = await res.json()
    setDemo(result.split('\n').find(l => l.trim()) || '')
  }

  // 공통 애니메이션 세팅
  const variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.2 } }),
  }

  // 각 섹션마다 ref+inView
  const sections = [ useRef(null), useRef(null), useRef(null), useRef(null) ]

  return (
    <div className="landing-bg min-h-screen flex flex-col items-center justify-center text-center px-10 py-16">
  <div className="w-full">
    <motion.h1
      className="mt-14 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
      initial="hidden" animate="visible" variants={variants} custom={0}
    >
      ✨ 3초 만에<br />매력적인 마케팅 문구 3개를!
    </motion.h1>

    <motion.p
      className="text-lg text-gray-800 dark:text-gray-300 mb-6"
      initial="hidden" animate="visible" variants={variants} custom={1}
    >
      감성·타깃·스타일만 선택하면 AI가 딱 맞는 문구를 추천해 드립니다.
    </motion.p>

    <motion.div
      className="flex flex-wrap gap-3 justify-center mb-6"
      initial="hidden" animate="visible" variants={variants} custom={2}
    >
      <button
  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg text-lg"
  onClick={() => signIn()}
  aria-label="로그인하고 무료 체험하기"
>
  로그인하고 무료 체험하기
</button>

      <button className="bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold py-2 px-6 rounded-lg text-lg" onClick={scrollToOverview}>👀 서비스 둘러보기</button>
    </motion.div>

        <ProofRotator />
        <HowItWorks />
        <TemplateQuizLite />
        <FeatureGrid />
        <PricingSnapshot />
        <ROIBar />
        <FAQList />
        <FinalCTA />


        {demo && (
          <div className="demo-box">
            <h3>🔍 예시 문구</h3>
            <p>{demo}</p>
          </div>
        )}
      </div>

      <Footer darkMode={darkMode} />
    </div>
  )
}

// 반복되는 motion + inView 래퍼
const MotionSection = motion.section

// 여기에 전체 CSS를 넣습니다.
function GlobalStyles() {
  return (
    <style jsx global>{`
      body {
        margin: 0;
        font-family: Pretendard, sans-serif;
        background-color: var(--main-bg-other);
        color: var(--text-primary);
      }

      body.home {
        background-color: var(--main-bg-home);
      }

      body.home.dark {
        background-color: var(--main-bg-home); /* 다크모드용 변수 적용 */
      }

      .landing-hero {
        display: flex;
        flex-direction: column;
        background-color: var(--main-bg-home) !important; /* ✅ 다크/라이트 변수 기반 강제 적용 */
        color: var(--text-primary);
      }

      html.dark body.home .landing-hero {
        background-color: var(--main-bg-home) !important;
      }

      .landing-content {
        flex: 1;
        max-width: 960px;
        margin: 0 auto;
        padding: 6rem 1rem;
        text-align: center;
      }

      .animated-title {
        font-size: 2.75rem;
        line-height: 1.2;
      }

      .subtitle {
        margin-top: 1rem;
        font-size: 1.125rem;
        color: #475569;
      }

      .buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin: 2rem 0;
      }

      .primary {
        background: #2563eb;
        color: #fff;
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      }

      .secondary {
        background: #fff;
        color: #2563eb;
        padding: 0.75rem 2rem;
        border: 2px solid #2563eb;
        border-radius: 8px;
        cursor: pointer;
      }

      .proof-rotator {
        margin: 1.5rem 0 3rem;
      }

      .features,
      .reason-list,
      .faq-list {
        display: grid;
        gap: 1.5rem;
        list-style: none;
        padding: 0;
        margin: 2rem 0;
      }

      .features {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }

      .feature-card {
        background: #fff;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
      }

      .feature-card img {
        width: 48px;
        margin-bottom: 1rem;
      }

      .pain-solution,
      .intro-section {
        background: #eef2ff;
        padding: 4rem 1rem;
      }

      .container {
        max-width: 720px;
        margin: 0 auto;
        text-align: left;
      }

      .reason-list li,
      .faq-list li {
        text-align: left;
      }

      .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
      }

      .btn-primary {
        background: #2563eb;
        color: white;
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 8px;
      }

      .btn-secondary {
        background: #fff;
        color: #2563eb;
        padding: 0.75rem 2rem;
        border: 2px solid #2563eb;
        border-radius: 8px;
      }

      .buttons .primary,
      .buttons .secondary {
        font-size: 0.97rem;
      }

      .landing-footer {
        text-align: center;
        padding: 1rem;
        color: #64748b;
      }

      body.dark {
        background-color: #0f172a;
        color: #f1f5f9;
      }

      .landing-content.dark {
        background-color: transparent;
      }

      .landing-footer.dark {
        color: #94a3b8;
      }
    `}</style>
  );
}

function getFrequentTags(history: HistoryItem[]): string[] {
  const tagCount: Record<string, number> = {};

  history.forEach((item) => {
    item.likes?.forEach((like) => {
      if (typeof like === 'object' && like.tag) {
        like.tag.split(',').forEach((t) => {
          const trimmed = t.trim();
          if (trimmed) {
            tagCount[trimmed] = (tagCount[trimmed] || 0) + 1;
          }
        });
      }
    });
  });

  // 자주 등장한 순으로 정렬 후 최대 10개 추출
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1]) // 빈도순 정렬
    .map(([tag]) => tag)
    .slice(0, 6);
}

// 3️⃣ Home 컴포넌트: 로그인 전엔 Landing, 후엔 LoggedInApp (+ 탈퇴 플래시 배너)
export default function Home({ session }: { session: Session | null }) {
  const { data: clientSession } = useSession()
  const router = useRouter()
  const isLoggedIn = Boolean(session || clientSession)
  const ui = useContext(UIContext)
  const darkMode = ui?.darkMode ?? false
  const [showDeleted, setShowDeleted] = useState(false)

// 1) 쿼리 감지: 최초 한 번만 실행
  useEffect(() => {
    if (!router.isReady) return

    // ① router.query 우선
    let shouldShow = router.query.deleted === '1'

    // ② 초기 렌더에서 query가 비어 있을 수 있으니 location.search 백업 체크
    if (!shouldShow && typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search)
      if (sp.get('deleted') === '1') shouldShow = true
    }

    if (shouldShow) {
      setShowDeleted(true)
       // 쿼리 정리 (배너는 showDeleted 상태로 유지)
      const { deleted, ...rest } = router.query
     router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true })
    }
   }, [router.isReady]) // ✅ deleted에 의존하지 않음

   // 2) 타이머: showDeleted가 true일 때만 동작
useEffect(() => {
  if (!showDeleted) return
  const timer = setTimeout(() => setShowDeleted(false), 2000)
  return () => clearTimeout(timer)
}, [showDeleted])

  // 배너 스타일(가려짐 방지로 zIndex 크게)
  const bannerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    background: '#ecfdf5',
    border: '1px solid #a7f3d0',
    color: '#065f46',
    padding: '.6rem .9rem',
    borderRadius: 10,
    fontSize: '.95rem',
    boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
    pointerEvents: 'none',
  }

  if (!isLoggedIn) {
    return (
      <>
        {showDeleted && (
          <div role="status" aria-live="polite" style={bannerStyle}>
            ✅ 계정이 깔끔하게 삭제되었어요.
          </div>
        )}
        <Landing darkMode={darkMode} />
      </>
    )
  }

  return (
    <div className="landing-bg">
      {showDeleted && (
        <div role="status" aria-live="polite" style={bannerStyle}>
          ✅ 계정이 깔끔하게 삭제되었어요.
        </div>
      )}

      <div className="app-wrapper">
        <LoggedInApp
          session={(session || clientSession) as Session}
          clientSession={clientSession}
        />
        <Footer />
      </div>
    </div>
  )
}


// 로그인된 사용자 전용 컴포넌트
function LoggedInApp({
  session,
  clientSession,
}: {
  session: Session;
  clientSession: Session | null;
}) {
  const router = useRouter();
  const ui = useContext(UIContext);
  const darkMode = ui?.darkMode ?? false;
  const toggleDarkMode = ui?.toggleDarkMode ?? (() => {});
  
const showUpgradeModal = (message: string | React.ReactNode, title = 'Pro 전용 기능입니다 🔒') => {
  setModal({
    title,
    message,
    confirmText: 'Pro 혜택 보기',
    cancelText: '나중에 하기',
    onConfirm: () => router.push('/pricing'),
  });
};

interface LikeEntry {
  liked: boolean;
  tag?: string;
}

interface HistoryItem {
  keyword: string;
  category: string;
  tone: string;
  emotion: string;
  target: string;
  gender: string;
  purpose: string;
  result: string;
  tags?: string[];
  likes?: LikeEntry[];
  savedAt?: string;
  memo?: string;
}

const toneOptions = ['말랑한', '신뢰감', '재치있는', '고급스러운'];
const emotionOptions = ['감성적인', '활기찬', '차분한', '발랄한'];
const targetOptions = ['10대', '20대', '30대', '40대', '50대 이상'];
const genderOptions = ['여성', '남성', '모두'];
const purposeOptions = ['상세페이지', '광고 배너', 'SNS 홍보', '슬로건'];
const [templateCat, setTemplateCat] = useState<string>('직접 입력');
useEffect(() => {
console.log('🏷️ [Home] templateCat →', templateCat);
}, [templateCat]);
const [newTag, setNewTag] = useState('');
const [tagFilter, setTagFilter] = useState('');
const tagInputRef = useRef<HTMLInputElement>(null);
const [editing, setEditing] = useState<{ histIdx: number; lineIdx: number } | null>(null);
const [editText, setEditText] = useState('');
const likedRef = useRef<HTMLDivElement | null>(null);
const scrollToLiked = () => {
if (likedRef.current) {
likedRef.current.scrollIntoView({ behavior: 'smooth' });
}
};

const [keyword, setKeyword] = useState('');
const [generateCount, setGenerateCount] = useState(0)
const [showTooltip, setShowTooltip] = useState(false);


useEffect(() => {
  const today = new Date().toISOString().split('T')[0] // 오늘 날짜 (yyyy-mm-dd)
  const savedCount = localStorage.getItem('generate-count')
  const savedDate = localStorage.getItem('generate-date')

  if (savedCount && savedDate === today) {
    setGenerateCount(parseInt(savedCount)) // 같은 날이면 저장된 count 사용
  } else {
    // 날짜가 다르면 count 초기화
    localStorage.setItem('generate-count', '0')
    localStorage.setItem('generate-date', today)
    setGenerateCount(0)
  }
}, [])

const [plan, setPlan] = useState('free');
const isFree = plan === 'free';
const handleTemplateSelect = (prompt: string, cat: string) => {
setKeyword(prompt);
setTemplateCat(cat);
};
const [tone, setTone] = useState(toneOptions[0]);
const [emotion, setEmotion] = useState(emotionOptions[0]);
const [target, setTarget] = useState(targetOptions[0]);
const [gender, setGender] = useState(genderOptions[0]);
const [purpose, setPurpose] = useState(purposeOptions[0]);
const [result, setResult] = useState('');
const [history, setHistory] = useState<HistoryItem[]>([]);
const [toast, setToast] = useState('');

const handleMemoChange = (index: number, newMemo: string) => {
  const updated = [...history];
  updated[index] = { ...updated[index], memo: newMemo };
  setHistory(updated);
  localStorage.setItem('history', JSON.stringify(updated));
};

const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
const [abLines, setAbLines] = useState<string[]>([]);
const [search, setSearch] = useState('');
const [loading, setLoading] = useState(false);
const [showTutorial, setShowTutorial] = useState(false);
const [tutorialStep, setTutorialStep] = useState(0);
const [showGuide, setShowGuide] = useState(true);
const [editedLines, setEditedLines] = useState<{ histIdx: number; lineIdx: number }[]>([]);
const [modal, setModal] = useState<null | {
  title: string
  message: string | React.ReactNode;
  confirmText: string
  cancelText: string
  onConfirm: () => void
}>(null)

useEffect(() => {
if (!localStorage.getItem('seenTutorial')) {
setShowTutorial(true);
setTutorialStep(0);
}
}, []);
useEffect(() => {
const saved = localStorage.getItem('marketing-history');
if (saved) setHistory(JSON.parse(saved));
}, []);

useEffect(() => {
const link = document.createElement('link');
link.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css';
link.rel = 'stylesheet';
document.head.appendChild(link);
}, []);

useEffect(() => {
  console.log('🌙 darkMode 상태:', darkMode)
}, [darkMode])


useEffect(() => {
  const storedPlan = localStorage.getItem('user-plan');
  if (storedPlan) setPlan(storedPlan);
}, []);
useEffect(() => {
const style = document.createElement('style');
style.innerHTML = `
@keyframes pulse {
0% { opacity: 1; }
50% { opacity: 0.5; }
100% { opacity: 1; }
}
`;
document.head.appendChild(style);
}, []);
const [isMobile, setIsMobile] = useState(false);


useEffect(() => {
  const updateSize = () => {
    setIsMobile(window.innerWidth <= 640);
  };

  window.addEventListener('resize', updateSize);
  updateSize(); // 최초 실행
  return () => window.removeEventListener('resize', updateSize);
}, []);

useEffect(() => {
if (typeof window !== 'undefined') {
setIsMobile(window.innerWidth <= 640);
}
}, []);

const closeTutorial = () => {
localStorage.setItem('seenTutorial', 'true');
setShowTutorial(false);
};
const resultHighlightStyle: React.CSSProperties = {
backgroundColor: darkMode ? '#1f2937' : '#f0f9ff',
border: '1px solid #93c5fd',
borderRadius: '12px',
padding: '1.5rem',
marginBottom: '2rem',
boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
};
const baseStyle: React.CSSProperties = {
  backgroundColor: darkMode ? '#0f172a' : '#f9fafb',  // 어두운 남색 계열로 좀 더 강하게
  color: darkMode ? '#f1f5f9' : '#111827',
minHeight: '100vh',
padding: isMobile ? '1rem' : '2rem',
fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
transition: 'all 0.3s ease',
};
const inputStyle: React.CSSProperties = {
width: '100%',
padding: '0.75rem 1rem',
border: '1px solid #d1d5db',
borderRadius: '8px',
fontSize: '1rem',
backgroundColor: darkMode ? '#1e293b' : '#ffffff',
color: darkMode ? '#f1f5f9' : '#111827',
borderColor: darkMode ? '#475569' : '#d1d5db',
marginBottom: '1rem',
};
const buttonStyle: React.CSSProperties = {
  padding: '0.6rem 1.2rem',
  borderRadius: '9999px',
  fontWeight: 600,
  fontSize: '0.78rem',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
}
const renderUpgradeNotice = (text = 'Pro 요금제부터 가능해요!') => (
  <div style={{ fontSize: '0.75rem', color: '#f97316', marginTop: '0.25rem' }}>
    🔒 {text}
    <button
      onClick={() => router.push('/pricing')}
      style={{
        color: '#2563eb',
        background: 'none',
        border: 'none',
        textDecoration: 'underline',
        cursor: 'pointer',
        fontSize: '0.75rem',
        marginLeft: '0.3rem',
      }}
    >
      업그레이드 하기 →
    </button>
  </div>
);

const templateButtonStyle = (selected: boolean): React.CSSProperties => ({
  padding: '0.5rem 1rem',
  borderRadius: '9999px',
  backgroundColor: selected ? '#2563eb' : darkMode ? '#334155' : '#f1f5f9',
  color: selected ? '#ffffff' : darkMode ? '#f1f5f9' : '#2563eb',
  border: selected ? 'none' : `1px solid ${darkMode ? '#475569' : '#2563eb'}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
});

const baseButton: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '9999px',
  border: '1px solid',
  borderColor: darkMode ? '#475569' : '#d1d5db',
  backgroundColor: darkMode ? '#334155' : '#ffffff',
  fontWeight: 500,
  fontSize: '0.9rem',
  cursor: 'pointer',
  color: darkMode ? '#f1f5f9' : '#2563eb',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  transition: 'all 0.2s ease-in-out',
};
const tagBox: React.CSSProperties = {
display: 'flex',
flexWrap: 'wrap',
gap: '0.5rem',
marginBottom: '1rem',
};
const tag = (selected: boolean): React.CSSProperties => ({
padding: '0.5rem 1rem',
borderRadius: '9999px',
border: `1.5px solid ${selected ? '#2563eb' : '#d1d5db'}`,
backgroundColor: selected ? '#2563eb' : darkMode ? '#334155' : '#ffffff',
color: selected ? '#ffffff' : darkMode ? '#e5e7eb' : '#374151',
fontWeight: 500,
fontSize: '0.9rem',
cursor: 'pointer',
});
const sectionBox: React.CSSProperties = {
  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
  boxShadow: darkMode ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.05)',
  borderRadius: '12px',
  padding: '2rem',
  marginBottom: '2rem',
  transition: 'background-color 0.3s ease',
};

const titleStyle: React.CSSProperties = {
fontSize: '1.4rem',
fontWeight: 700,
marginBottom: '1rem',
color: darkMode ? '#e2e8f0' : '#1f2937',
};
const skeletonCardStyle: React.CSSProperties = {
backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
padding: '1.5rem',
borderRadius: '12px',
marginBottom: '2rem',
animation: 'pulse 1.5s infinite',
};
const skeletonLine = {
height: '1rem',
backgroundColor: darkMode ? '#334155' : '#e5e7eb',
borderRadius: '4px',
marginBottom: '0.75rem',
};
const introTextStyle: React.CSSProperties = {
lineHeight: 1.7,
fontSize: '1.05rem',
color: darkMode ? '#cbd5e1' : '#334155',
marginTop: '0.5rem',
};
const trimmedFilter = tagFilter.trim();
const recentTags = Array.from(
new Set(
history
.flatMap((item) =>
(item.likes ?? [])
.map((like) =>
typeof like === 'object'
? (like.tag || '')
.split(',')
.map((t) => t.trim())
: []
)
.flat()
)
.filter((tag): tag is string => !!tag)
.reverse()
)
).slice(0, 10);
const likedLinesWithLocation = history.flatMap((item, histIdx) =>
item.result
.split('\n')
.map((line, lineIdx) => {
const like = item.likes?.[lineIdx];
const tag = typeof like === 'object' ? like.tag?.trim() || '' : '';
const isLiked = typeof like === 'object' && like.liked;
if (!isLiked) return null;
const isVisible =
tagFilter === '__NONE__'
? tag === ''
: tagFilter === '' || tag.toLowerCase().includes(tagFilter.toLowerCase());
return isVisible ? { line, histIdx, lineIdx } : null;
})
.filter(Boolean)
);
const filteredHistory = (() => {
const q = search.trim().toLowerCase();
if (!q) return history;
return history.filter(item => {
const keyMatch    = item.keyword.toLowerCase().includes(q);
const resultMatch = item.result.toLowerCase().includes(q);
return keyMatch || resultMatch;
});
})();

const handleABTest = async () => {
  if (!keyword.trim()) {
    setToast('⚠️ 키워드를 먼저 입력해주세요!');
    setTimeout(() => setToast(''), 2500);
    return;
  }

  setToast('✍️ A/B 추천 문구 생성 중...');
  setAbLines([]);
  try {
    const res = await fetch('/api/generate-ab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemPrompt: '당신은 마케팅 문구를 잘 만드는 감성적인 카피라이터입니다. 사용자가 입력한 키워드와 조건을 참고하여 서로 다른 스타일의 마케팅 문구 A안과 B안을 만들어주세요. 문장은 각각 한 줄로 간결하게 작성하고, 문장 끝이나 중간에 어울리는 이모지를 자연스럽게 포함해 주세요. 각각 "A안: ..." / "B안: ..." 형식으로 출력해주세요.',
        userPrompt: `키워드: ${keyword}\n스타일: ${tone}, ${emotion}, ${target}, 목적: ${purpose}`,
      }),
    });

    const data = await res.json();

    if (data.abLines && Array.isArray(data.abLines)) {
      setAbLines(data.abLines);

      // ✅ A/B 문구도 자동 히스토리 저장
      const abResult = data.abLines.join('\n');
      const newItem: HistoryItem = {
        keyword,
        category: templateCat,
        tone,
        emotion,
        target,
        gender,
        purpose,
        result: abResult,
        likes: data.abLines.map(() => ({ liked: false, tag: '' })),
        savedAt: new Date().toISOString(),
      };
      const updated = [newItem, ...history].slice(0, 10);
      setHistory(updated);
      localStorage.setItem('marketing-history', JSON.stringify(updated));
    } else {
      setToast('❌ 문구 생성에 실패했습니다.');
    }
  } catch (err) {
    console.error('A/B 생성 에러:', err);
    setToast('❌ A/B 추천 문구 생성 중 오류 발생');
  } finally {
    setTimeout(() => setToast(''), 3000);
  }
};


const handleGenerate = async () => {
  if (!keyword.trim()) {
    setToast('⛔ 키워드를 입력해주세요!');
    setTimeout(() => setToast(''), 2000);
    return;
  }

  const userPlan = session?.user?.plan || clientSession?.user?.plan || 'free';

  // ✅ 무료 요금제는 하루 3회까지만 허용
  if (userPlan === 'free' && generateCount >= 3) {
  showUpgradeModal(
    <>
      <p>오늘의 무료 생성 횟수를 모두 사용하셨습니다. 😥</p>
      <p style={{ marginTop: '0.75rem' }}>
        Pro 요금제로 업그레이드하면 <strong>제한 없이 문구 생성</strong>이 가능해요!
      </p>
    </>,
    '무제한 문구 생성을 원하시나요?'
  )
  return;
}

  // ✅ 통과 시 횟수 증가
  setGenerateCount((prev) => {
  const next = prev + 1
  localStorage.setItem('generate-count', String(next))
  return next
})


  setLoading(true);
  setResult('');
  setToast('🧠 문구 생성 중이에요… 잠시만 기다려주세요!');
  const startTime = Date.now();

  const prompt = `브랜드 키워드: ${keyword}
브랜드 스타일: ${tone}
전하고 싶은 감정: ${emotion}
타깃 연령대: ${target}
성별: ${gender}
문구 목적: ${purpose}
위 조건을 바탕으로 문장에 어울리는 이모지를 포함하여 자연스럽고 매력적인 마케팅 문구를 3개 작성해줘.`;

  try {
    const res = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    const lines = data.result?.split('\n').filter((line: string) => line.trim()) || [];
    const elapsed = Date.now() - startTime;
    const minDuration = 700;
    if (elapsed < minDuration) {
      await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
    }
    setResult(lines.join('\n'));
    setToast('✨ 문구가 완성되었어요! 맘에 드는 게 있나요?');
    const newItem: HistoryItem = {
      keyword,
      category: templateCat,
      tone,
      emotion,
      target,
      gender,
      purpose,
      result: lines.join('\n'),
      savedAt: new Date().toISOString(),
    };
    const newHistory = [newItem, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('marketing-history', JSON.stringify(newHistory));
  } catch (err) {
    console.error(err);
    setToast('⚠️ 문구 생성 중 오류가 발생했어요. 다시 시도해주세요!');
  } finally {
    setLoading(false);
    setTimeout(() => setToast(''), 2500);
  }
};

  const getRecentTags = (history: HistoryItem[]) => {
  const tagCount: Record<string, number> = {};

  history.forEach(item => {
    // (1) 전체 태그
    item.tags?.forEach(tag => {
      const trimmed = tag.trim();
      if (trimmed) tagCount[trimmed] = (tagCount[trimmed] || 0) + 1;
    });

    // (2) 개별 저장 문장 태그
    item.likes?.forEach(like => {
      if (typeof like === 'object' && like.tag) {
        const trimmed = like.tag.trim();
        if (trimmed) tagCount[trimmed] = (tagCount[trimmed] || 0) + 1;
      }
    });
  });

  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
    .slice(0, 8);
};

const handleCopy = (text: string, histIdx?: number, lineIdx?: number) => {
let copyText = text.replace(/^\d+\.\s*/, '');
if (
typeof histIdx === 'number' &&
typeof lineIdx === 'number' &&
history[histIdx]?.likes?.[lineIdx] &&
typeof history[histIdx].likes[lineIdx] === 'object'
) {
const tag = history[histIdx].likes[lineIdx]?.tag;
if (tag?.trim()) {
copyText += `  #${tag.trim()}`;
}
}
navigator.clipboard.writeText(copyText);
setToast('✅ 복사했어요! 태그도 함께 복사되었어요 🙌');
setTimeout(() => setToast(''), 2500);
};
const handleLikeToggle = (historyIdx: number, lineIdx: number) => {
const handleTagClick = (tag: string) => {
  const currentTags = newTag
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t);

  if (currentTags.includes(tag)) return;

  const updatedTags = [...currentTags, tag];
  setNewTag(updatedTags.join(', '));
  tagInputRef.current?.focus(); // 🔹 자동 포커싱
};

  // ✅ 추가: Free 요금제인 경우 저장 불가 안내
if (isFree) {
  showUpgradeModal(
    <>
      <p>지난 문구도 저장해두고 나중에 꺼내보세요! 📦</p>
      <p style={{ marginTop: '0.75rem' }}>
        Pro 플랜에서는 <strong>과거 문구 저장</strong>과 <strong>.txt 다운로드</strong>까지 가능해요.
      </p>
    </>,
    '지금 업그레이드하면 저장 기능이 열려요!'
  )
  return;
}

const updated = [...history];
if (!updated[historyIdx].likes) {
updated[historyIdx].likes = updated[historyIdx].result
.split('\n')
.map(() => ({ liked: false, tag: '' }));
}
const current = updated[historyIdx].likes![lineIdx];
if (typeof current === 'boolean') {
updated[historyIdx].likes![lineIdx] = {
liked: !current,
tag: '',
};
} else {
updated[historyIdx].likes![lineIdx] = {
...current,
liked: !current.liked,
};
}
setHistory(updated);
localStorage.setItem('marketing-history', JSON.stringify(updated));
if (typeof historyIdx === 'number' && typeof lineIdx === 'number') {
setEditedLines((prev) => [...prev, { histIdx: historyIdx, lineIdx }]);
}
setEditing(null);
setEditText('');
};
const handleHistoryClick = (item: HistoryItem) => {
// 1) 저장된 카테고리·키워드 동기화
setKeyword(item.keyword);
setTemplateCat(item.category);
// 2) 나머지 옵션들 동기화
setTone(item.tone);
setEmotion(item.emotion);
setTarget(item.target);
setGender(item.gender);
setPurpose(item.purpose);
setResult(item.result);
setToast('📦 이전 문구를 불러왔어요!');
setTimeout(() => setToast(''), 2000);
};
const handleClearHistory = () => {
setHistory([]);
localStorage.removeItem('marketing-history');
setToast('🗑️ 히스토리를 모두 삭제했어요!');
setTimeout(() => setToast(''), 2000);
};
const handleDeleteHistoryItem = (index: number) => {
const updated = [...history];
updated.splice(index, 1);
setHistory(updated);
localStorage.setItem('marketing-history', JSON.stringify(updated));
setToast('❎ 항목이 삭제되었어요.');
setTimeout(() => setToast(''), 2000);
};
const startEditing = (histIdx: number, lineIdx: number) => {
if (editing) {
alert('지금 다른 문장을 수정 중이에요! 먼저 저장하거나 취소해주세요.');
return;
}
const line = history[histIdx].result.split('\n')[lineIdx].replace(/^\d+\.\s*/, '');
setEditText(line);
setEditing({ histIdx, lineIdx });
};
const confirmEdit = () => {
if (!editing) return;
const { histIdx, lineIdx } = editing;
const updated = [...history];
const lines = updated[histIdx].result.split('\n');
const prefixMatch = lines[lineIdx].match(/^(\d+\.\s*)/);
const newLine = `${prefixMatch ? prefixMatch[1] : ''}${editText}`;
lines[lineIdx] = newLine;
updated[histIdx].result = lines.join('\n');
setHistory(updated);
localStorage.setItem('marketing-history', JSON.stringify(updated));
setEditedLines([...editedLines, { histIdx, lineIdx }]);
setEditing(null);
setEditText('');
setToast('✅ 문장이 수정되었어요!');
setTimeout(() => setToast(''), 2500);
};
const cancelEdit = () => {
setEditing(null);
setEditText('');
setToast('❌ 수정이 취소되었어요.');
setTimeout(() => setToast(''), 2000);
};
const downloadLikedLines = () => {
const trimmedFilter = tagFilter.trim();
const likedOnly = likedLinesWithLocation
.filter(({ histIdx, lineIdx }) => {
const like = history[histIdx].likes?.[lineIdx];
if (typeof like === 'object') {
return trimmedFilter === '' || (like.tag || '').includes(trimmedFilter);
}
return false;
})
.map(({ line }) => line.replace(/^\d+\.\s*/, ''));
if (likedOnly.length === 0) {
setToast('⚠️ 다운로드할 문구가 없어요!');
setTimeout(() => setToast(''), 2000);
return;
}
const blob = new Blob([likedOnly.join('\n')], { type: 'text/plain;charset=utf-8' });
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = trimmedFilter ? `liked-lines-${trimmedFilter}.txt` : 'liked-lines.txt';
link.click();
setToast('💾 문구가 다운로드 되었어요!');
setTimeout(() => setToast(''), 2000);
};
  return (
    <div>
      
{/* ─── 온보딩 모달 ──────────────────────────── */}
{showTutorial && (
<OnboardingModal
step={tutorialStep}
onNext={() => setTutorialStep((s) => Math.min(s + 1, 3))}
onPrev={() => setTutorialStep((s) => Math.max(s - 1, 0))}
onClose={closeTutorial}
/>
)}
{toast && (
<div
style={{
position: 'fixed',
top: '1rem',
right: '1rem',
backgroundColor: '#2563eb',
color: '#fff',
padding: '0.75rem 1.25rem',
borderRadius: '8px',
boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
zIndex: 1000,
}}
>
{toast}
</div>
)}
{/* 🌟 온보딩 안내 */}
{showGuide && (
<div
style={{
backgroundColor: darkMode ? '#334155' : '#e0f2fe',
color: darkMode ? '#f1f5f9' : '#1e293b',
padding: '1rem 1.25rem',
borderRadius: '8px',
marginBottom: '1.5rem',
position: 'relative',
lineHeight: 1.6,
}}
>
<button
onClick={() => {
setShowGuide(false);
localStorage.setItem('seen-onboarding', 'true');
}}
style={{
position: 'absolute',
top: '0.5rem',
right: '0.75rem',
border: 'none',
background: 'transparent',
color: darkMode ? '#94a3b8' : '#475569',
fontSize: '1.2rem',
cursor: 'pointer',
}}
>
×
</button>
👋 처음이신가요? <br />
키워드를 입력하고 조건을 선택한 뒤 <strong>"이 조건으로 문구 생성하기"</strong> 버튼을 눌러보세요!
</div>
)}
{/* 🌙 다크모드 + 저장 문구 보기 버튼 (세련된 스타일) */}
<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
  <button
    onClick={() => toggleDarkMode()}
    style={{
      ...buttonStyle,
      backgroundColor: darkMode ? '#f1f5f9' : '#1e293b',
      color: darkMode ? '#1e293b' : '#f1f5f9',
    }}
  >
    {darkMode ? '☀️ 라이트모드' : '🌙 다크모드'}
  </button>
  <button
    onClick={scrollToLiked}
    style={{
      ...buttonStyle,
      backgroundColor: '#fef3c7',
      color: '#92400e',
      boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
    }}
  >
    ❤️ 저장 문구 보기
  </button>
</div>


{/* ✨ 소개 */}
<div style={sectionBox}>
<h2 style={titleStyle}>✨ 단 3초, 당신의 브랜드를 빛낼 문장을 만들어보세요</h2>
<p style={introTextStyle}>
감성, 분위기, 타깃에 맞춘 <strong>맞춤형 마케팅 문구</strong>를 3개씩 추천해드려요.
<br />
키워드를 입력하고, 아래 조건을 자유롭게 선택해보세요!
</p>
</div>
{/* 📌 조건 입력 */}
<div style={sectionBox}>
<h2 style={titleStyle}>📌 키워드와 조건을 입력해주세요</h2>
{/* 🔄 무료 플랜 남은 횟수 안내 + 키워드 직접입력 안내 */}
{isFree && (
  <div style={{ 
    fontSize: '0.85rem', 
    color: '#f97316', 
    marginBottom: '1.25rem', 
    backgroundColor: '#fff7ed',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #fdba74'
  }}>
    🔄 오늘 생성 가능 횟수: <strong>{3 - generateCount}회</strong>
  </div>
)}


{templateCat === '직접 입력' && (
  <>
    <div style={{
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#475569',
      marginBottom: '0.25rem',
    }}>
      🔑 키워드를 직접 입력하세요.
    </div>
    <div style={{
      fontSize: '0.8rem',
      color: '#94a3af',
      marginBottom: '1rem',
    }}>
      예: 감성 카페, 자전거, 스마트 스토어 구매대행 등
    </div>
  </>
)}


<input
value={keyword}
onChange={(e) => setKeyword(e.target.value)}
style={inputStyle}
placeholder="키워드 입력"
/>
{/* 업종별 템플릿 선택 */}
<TemplateSelector
        selectedCategory={templateCat}
        onCategoryChange={setTemplateCat}
        onSelect={(prompt, cat) => {
          setTemplateCat(cat)
          setKeyword(prompt);
          // …etc
        }}
        darkMode={darkMode}
        userPlan={plan} // ✅ 추가
        onProAttempt={() =>
          showUpgradeModal(
            <>
              <p>더 다양한 업종 템플릿이 궁금하신가요? 💡</p>
              <p style={{ marginTop: '0.75rem' }}>
                Pro 플랜에서는 <strong>모든 템플릿</strong>을 자유롭게 사용할 수 있어요.
              </p>
            </>,
            'Pro 요금제로 템플릿 전체 이용하기'
          )
        } // ✅ 추가
      />
<p>💎 브랜드 스타일</p>
<div style={tagBox}>
{toneOptions.map((opt) => (
<div key={opt} style={tag(tone === opt)} onClick={() => setTone(opt)}>
{opt}
</div>
))}
</div>
<p>🎭 감정 느낌</p>
<div style={tagBox}>
{emotionOptions.map((opt) => (
<div key={opt} style={tag(emotion === opt)} onClick={() => setEmotion(opt)}>
{opt}
</div>
))}
</div>
<p>🎯 타깃 연령대</p>
<div style={tagBox}>
{targetOptions.map((opt) => (
<div key={opt} style={tag(target === opt)} onClick={() => setTarget(opt)}>
{opt}
</div>
))}
</div>
<p>🚻 성별</p>
<div style={tagBox}>
{genderOptions.map((opt) => (
<div key={opt} style={tag(gender === opt)} onClick={() => setGender(opt)}>
{opt}
</div>
))}
</div>
<p>📝 문구 목적</p>
<div style={tagBox}>
{purposeOptions.map((opt) => (
<div key={opt} style={tag(purpose === opt)} onClick={() => setPurpose(opt)}>
{opt}
</div>
))}
</div>

{/* 🔘 문구 생성 버튼 */}
<button
  onClick={handleGenerate}
  disabled={loading}
  style={{
    ...baseButton,
    backgroundColor: loading ? '#9ca3af' : '#10b981',
    color: '#fff',
    marginTop: '1rem',
  }}
>
  {loading ? '⏳ 문구 생성 중이에요...' : '✨ 이 조건으로 문구 생성하기'}
</button>

{/* ✍️ A/B 추천 문구 버튼 + ❓툴팁 */}
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
  <button
    onClick={handleABTest}
    style={{
      ...baseButton,
      backgroundColor: '#f3f4f6',
      color: '#6b7280',
      border: '1px solid #d1d5db',
      cursor: 'pointer',
      padding: '0.5rem 1rem',
      fontSize: '0.95rem',
    }}
  >
    ✍️ A/B 추천 문구 받아보기
  </button>

  {/* ❓ 툴팁 버튼 */}
  <div style={{ position: 'relative', display: 'inline-block' }}>
    <button
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        background: 'transparent',
        border: 'none',
        fontSize: '1.2rem',
        cursor: 'help',
        color: '#6b7280',
        padding: 0,
      }}
    >
      ❓
    </button>

    {showTooltip && (
      <div
        style={{
          position: 'absolute',
          top: '120%',
          left: '0',
          zIndex: 10,
          backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
          color: darkMode ? '#f3f4f6' : '#111827',
          border: '1px solid #ddd',
          borderRadius: '0.5rem',
          padding: '1.75rem',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          whiteSpace: 'nowrap',
          maxWidth: '400px',
        }}
      >
        ✍️ “이 조건으로 문구 생성하기”는<br />AI가 조건에 맞는 문구 3개를 자동 추천해요.<br /><br /><br />🎯 “A/B 추천 문구”는<br />두 가지 스타일(A안 / B안)을 비교할 수 있게 도와줘요.<br /><br />예시)<br />• A안: 직관적 & 실용적
<br />• B안: 감성적 & 공감 중심<br /><br />  더 끌리는 스타일을 선택해보세요!
      </div>
    )}
  </div>
</div>

{/* 🎯 A/B 추천 문구 결과 */}
{abLines.length > 0 && (
  <div
    style={{
      ...sectionBox,
      backgroundColor: darkMode ? '#1e293b' : '#ecfdf5', // 밝은 초록 카드 느낌
      marginTop: '1.5rem',
    }}
  >
    <h2 style={{ ...titleStyle, color: '#10b981' }}>🎯 A/B 추천 문구</h2>
    <p style={introTextStyle}>
      아래 두 가지 스타일 중 어떤 문구가 더 끌리시나요? 직접 비교해보세요!
    </p>
    <ul style={{ marginTop: '1rem', paddingLeft: '1rem' }}>
      {abLines.map((line, idx) => (
        <li
          key={idx}
          style={{
            marginBottom: '0.75rem',
            fontSize: '1.05rem',
            color: darkMode ? '#f1f5f9' : '#111827',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ flex: 1 }}>{line}</span>
          <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '1rem' }}>
            <button style={baseButton} onClick={() => handleCopy(line)}>📋 복사</button>
            <button
              style={{ ...baseButton, color: '#e11d48' }}
              onClick={() => {
                if (plan === 'free') {
                  showUpgradeModal(
                    <>
                      <p>이 문구, 저장하고 싶으셨죠? 😊</p>
                      <p style={{ marginTop: '0.75rem' }}>
                        Pro로 업그레이드하면<br />
                        A/B 추천 문구도 <strong>무제한 저장</strong>하고 <strong>다운로드</strong>할 수 있어요!
                      </p>
                    </>,
                    'Pro 요금제로 더 강력한 기능을 시작해보세요'
                  )

                  return;
                }

                const newItem: HistoryItem = {
                  keyword,
                  category: templateCat,
                  tone,
                  emotion,
                  target,
                  gender,
                  purpose,
                  result: `${line}\n`,
                  likes: [{ liked: true, tag: '' }], // ✅ 배열 형태 유지
                  savedAt: new Date().toISOString(),
                };
                const updated = [newItem, ...history].slice(0, 10);
                setHistory(updated);
                localStorage.setItem('marketing-history', JSON.stringify(updated));
                setToast('❤️ 저장되었어요!');
                setTimeout(() => setToast(''), 2000);
              }}
            >
              {plan === 'free' ? '🔒 저장(Pro)' : '❤️ 저장'}
            </button>
          </div>
        </li>
      ))}
    </ul>
    {plan === 'free' && renderUpgradeNotice('⚠️ 저장은 Pro부터 가능해요!')}
    {abLines.length > 0 && (
  <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
    <button
      onClick={() => {
        if (isFree) {
          showUpgradeModal(
           <>
             <p>A/B 문구, 한 번에 저장하고 싶으신가요?</p>
             <p style={{ marginTop: '0.75rem' }}>
               Pro 플랜에서는 <strong>추천 문구 전체 저장</strong>이 가능해요!
             </p>
           </>,
           'Pro 요금제로 저장 기능 전체 열기'
          )

          return;
        }

        const abResult = abLines.join('\n');
        const newItem: HistoryItem = {
          keyword,
          category: templateCat,
          tone,
          emotion,
          target,
          gender,
          purpose,
          result: abResult,
          likes: abResult.split('\n').map(() => ({ liked: true, tag: '' })),
          savedAt: new Date().toISOString(),
        };
        const updated = [newItem, ...history].slice(0, 10);
        setHistory(updated);
        localStorage.setItem('marketing-history', JSON.stringify(updated));
        setToast('💾 A/B 문구 전체가 저장되었어요!');
        setTimeout(() => setToast(''), 2000);
      }}
      style={{
        ...baseButton,
        backgroundColor: '#10b981',
        color: '#fff',
        fontSize: '0.85rem',
      }}
    >
      {isFree ? '🔒 A/B 전체 저장(Pro)' : '💾 A/B 전체 저장'}
    </button>
  </div>
)}

  </div>
)}


</div>
{loading && (
<div style={skeletonCardStyle}>
<div style={{ ...skeletonLine, width: '80%' }}></div>
<div style={{ ...skeletonLine, width: '90%' }}></div>
<div style={{ ...skeletonLine, width: '70%' }}></div>
</div>
)}
{result && !loading && (
  <div style={resultHighlightStyle}>
    <h2 style={{ ...titleStyle, color: '#2563eb', fontSize: '1.3rem' }}>
      ✨ 이런 문구는 어떠세요?
    </h2>

    {result.split('\n').map((line, idx) => (
      <div
        key={idx}
        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
      >
        <span>{line}</span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button style={baseButton} onClick={() => handleCopy(line)}>📋 복사</button>
          <button
            style={{ ...baseButton, color: '#e11d48' }}
            onClick={() => {
              if (isFree) {
                showUpgradeModal(
                  <>
                    <p>마음에 드는 문구, 저장해두고 싶으신가요? 💖</p>
                    <p style={{ marginTop: '0.75rem' }}>
                      Pro에서는 <strong>무제한 저장</strong>과 <strong>다운로드</strong>가 가능해요!
                   </p>
                  </>,
                  'Pro로 업그레이드하고 문구를 자유롭게 저장해보세요'
                )
                return;
              }

              const updated = [...history];
              const newLikes = result.split('\n').map((_, i) =>
                i === idx ? { liked: true, tag: '' } : { liked: false, tag: '' }
              );

              if (updated.length > 0 && updated[0].result === result) {
                if (!updated[0].likes) updated[0].likes = newLikes;
                else updated[0].likes[idx] = { liked: true, tag: '' };
              } else {
                const newItem: HistoryItem = {
                  keyword,
                  category: templateCat,
                  tone,
                  emotion,
                  target,
                  gender,
                  purpose,
                  result,
                  likes: newLikes,
                  savedAt: new Date().toISOString(),
                };
                updated.unshift(newItem);
              }

              const sliced = updated.slice(0, 10);
              setHistory(sliced);
              localStorage.setItem('marketing-history', JSON.stringify(sliced));
              setToast('❤️ 저장되었어요!');
              setTimeout(() => setToast(''), 2000);
            }}
          >
            {isFree ? '🔒 저장(Pro)' : '❤️ 저장'}
          </button>
        </div>
      </div>
    ))}

    {/* ✅ 안내 문구는 한 번만 하단에 */}
    {isFree && (
      <div style={{ fontSize: '0.75rem', color: '#f97316', marginTop: '0.5rem' }}>
        ⚠️ 저장은 <strong>Pro부터</strong> 가능해요!
        <button
          onClick={() => router.push('/pricing')}
          style={{
            color: '#2563eb',
            background: 'none',
            border: 'none',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.75rem',
            marginLeft: '0.3rem',
          }}
        >
          업그레이드 하기 →
        </button>
      </div>
    )}
  </div>
)}

{/* ❤️ 저장된 문구 */}
{history.some((item) =>
  item.likes?.some((like) => typeof like === 'object' && like.liked)
) && (
  <div ref={likedRef} style={sectionBox}>
    <h2 style={titleStyle}>❤️ 저장해둔 문구</h2>

    {/* ✅ 태그 필터 입력 + 최근 태그 + 태그 없음 */}
    <input
      type="text"
      placeholder="태그로 검색 (예: 카페)"
      value={tagFilter}
      onChange={(e) => setTagFilter(e.target.value)}
      style={{
        ...inputStyle,
        marginBottom: '1rem',
        backgroundColor: darkMode ? '#0f172a' : '#f9fafb',
        fontSize: '0.9rem',
      }}
    />

{/* ✅ 현재 선택된 태그 필터 표시 */}
{tagFilter && (
<div style={{ fontSize: '0.8rem', color: darkMode ? '#cbd5e1' : '#6b7280', marginBottom: '0.25rem' }}>
🎯 현재 선택된 태그 필터: <strong>#{tagFilter === '__NONE__' ? '태그없음' : tagFilter}</strong>
</div>
)}
{/* ✅ 필터 초기화 버튼 (보조 역할로 살짝 아래) */}
{tagFilter && (
<button
onClick={() => setTagFilter('')}
style={{
...baseButton,
padding: '0.3rem 0.7rem',
fontSize: '0.75rem',
backgroundColor: '#fef2f2',
color: '#b91c1c',
marginBottom: '1rem',
}}
>
❎ 태그 필터 초기화
</button>
)}

{/* 📌 태그 입력 안내 문구 */}
    <p
      style={{
        fontSize: '0.8rem',
        marginTop: '0.25rem',
        marginBottom: '0.75rem',
        color: darkMode ? '#94a3b8' : '#6b7280',
      }}
    >
      여러 태그는 <strong>쉼표(,)</strong>로 구분해서 입력할 수 있어요 😊
    </p>

{likedLinesWithLocation.map(({ line, histIdx, lineIdx }, i) => {
const item = history[histIdx];
const date = item.savedAt ? new Date(item.savedAt).toLocaleDateString('ko-KR') : '';
return (
<div key={i} style={{ marginBottom: '0.75rem' }}>
<div
  style={{
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: '0.5rem',
  }}
>
  {editing?.histIdx === histIdx && editing.lineIdx === lineIdx ? (
    <input
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
      style={{ ...inputStyle, marginBottom: 0, fontSize: '0.9rem', flex: 1 }}
    />
  ) : (
    <span style={{ flex: 1 }}>• {line.replace(/^\d+\.\s*/, '')}</span>
  )}

  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
    <button style={baseButton} onClick={() => handleCopy(line, histIdx, lineIdx)}>
      📋 복사
    </button>

    {editing?.histIdx === histIdx && editing.lineIdx === lineIdx ? (
      <>
        <button
          style={{ ...baseButton, color: '#10b981' }}
          onClick={confirmEdit}
        >
          💾 저장
        </button>
        <button
          style={{ ...baseButton, color: '#ef4444' }}
          onClick={cancelEdit}
        >
          ❌ 취소
        </button>
      </>
    ) : (
      <button
        style={{ ...baseButton, color: '#6b7280' }}
        onClick={() => startEditing(histIdx, lineIdx)}
      >
        ✏️ 수정
      </button>
    )}

    <button
      style={{ ...baseButton, color: '#e11d48' }}
      onClick={() => handleLikeToggle(histIdx, lineIdx)}
    >
      💔 삭제
    </button>
  </div>
</div>


{/* ✅ 저장 날짜 표시 */}
{date && (
<div style={{ fontSize: '0.75rem', color: darkMode ? '#94a3b8' : '#6b7280', marginTop: '0.25rem' }}>
📅 {date} 저장됨
</div>
)}

{editedLines.some(e => e.histIdx === histIdx && e.lineIdx === lineIdx) && (
<div style={{ fontSize: '0.75rem', color: '#f97316', marginTop: '0.25rem' }}>
✏️ 수정됨
</div>
)}

{!item.likes?.[lineIdx]?.tag?.trim() && i === 0 && (
  <div style={{ fontSize: '0.72rem', color: darkMode ? '#94a3b8' : '#9ca3af', marginTop: '0.25rem' }}>
    🔖 태그를 입력하면 나중에 쉽게 찾을 수 있어요!
  </div>
)}

{/* ✅ 태그 입력창 */}
<input
  ref={tagInputRef}
  type="text"
  placeholder="태그를 입력하세요 (예: 카페용)"
  value={
    typeof item.likes?.[lineIdx] === 'object'
      ? item.likes?.[lineIdx]?.tag || ''
      : ''
  }
  onChange={(e) => {
    const updated = [...history];
    if (updated[histIdx].likes) {
      if (typeof updated[histIdx].likes[lineIdx] === 'boolean') {
        updated[histIdx].likes[lineIdx] = {
          liked: updated[histIdx].likes[lineIdx] as boolean,
          tag: '',
        };
      }
      if (typeof updated[histIdx].likes[lineIdx] === 'object') {
        updated[histIdx].likes[lineIdx].tag = e.target.value;
      }
      setHistory(updated);
      localStorage.setItem('marketing-history', JSON.stringify(updated));
    }
  }}
  style={{
    ...inputStyle,
    marginTop: '0.25rem',
    fontSize: '0.85rem',
    backgroundColor: darkMode ? '#0f172a' : '#f9fafb',
  }}
/>

{/* 📌 자주 사용하는 태그 추천 */}
{getFrequentTags(history).length > 0 && (
  <>
    <p
      style={{
        marginTop: '0.5rem', // ✅ 줄임
        marginBottom: '0.25rem',
        fontSize: '0.75rem', // ✅ 줄임
        color: darkMode ? '#94a3b8' : '#6b7280',
      }}
    >
      📌 자주 사용하는 태그 추천
    </p>

    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.4rem', // ✅ 약간 줄임
        marginBottom: '1rem', // ✅ 아래 문장과 여백 확보
      }}
    >
      {getFrequentTags(history).map((tag, idx) => (
        <button
          key={idx}
          onClick={() => {
            const currentTags = (typeof item.likes?.[lineIdx]?.tag === 'string'
              ? item.likes?.[lineIdx]?.tag
              : ''
            )
              .split(',')
              .map((t) => t.trim())
              .filter((t) => t);

            if (currentTags.includes(tag)) return;

            const updatedTags = [...currentTags, tag];
            const updated = [...history];

            if (
              updated[histIdx].likes &&
              typeof updated[histIdx].likes[lineIdx] === 'object'
            ) {
              updated[histIdx].likes[lineIdx].tag = updatedTags.join(', ');
              setHistory(updated);
              localStorage.setItem('marketing-history', JSON.stringify(updated));
              tagInputRef.current?.focus();
            }
          }}
          style={{
            backgroundColor: darkMode ? '#334155' : '#e5e7eb',
            color: darkMode ? '#f1f5f9' : '#1f2937',
            fontSize: '0.75rem', // ✅ 줄임
            padding: '0.3rem 0.6rem', // ✅ 줄임
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          #{tag}
        </button>
      ))}
    </div>
  </>
)}





{tagSuggestions.length > 0 && (
<div style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>
<div style={{ fontSize: '0.75rem', marginBottom: '0.25rem', color: darkMode ? '#94a3b8' : '#6b7280' }}>
🔍 추천 태그
</div>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
{tagSuggestions.map((tag) => (
<div
key={tag}
onClick={() => {
const updated = [...history];
if (updated[histIdx]?.likes?.[lineIdx]) {
if (typeof updated[histIdx].likes[lineIdx] === 'object') {
updated[histIdx].likes[lineIdx].tag = tag;
setHistory(updated);
localStorage.setItem('marketing-history', JSON.stringify(updated));
}
}
setTagSuggestions([]);
}}
style={{
padding: '0.35rem 0.75rem',
borderRadius: '9999px',
border: '1px solid #d1d5db',
backgroundColor: darkMode ? '#334155' : '#f3f4f6',
color: darkMode ? '#e2e8f0' : '#374151',
fontSize: '0.75rem',
cursor: 'pointer',
}}
>
#{tag}
</div>
))}
</div>
</div>
)}
</div>
);
})}

  {/* ✅ 다운로드 버튼 + 안내 문구 묶어서 정렬 */}
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '1.5rem' }}>
  <button
    onClick={() => {
      if (isFree) {
        showUpgradeModal(
          <>
            <p>마음에 드는 문구, 파일로 저장하고 싶으신가요? 💾</p>
            <p style={{ marginTop: '0.75rem' }}>
              Pro에서는 <strong>.txt 다운로드</strong>도 손쉽게 가능해요!
            </p>
          </>,
          'Pro 요금제로 다운로드 기능 열기'
        )
        return;
      }
      downloadLikedLines();
    }}
    style={{
      ...baseButton,
      backgroundColor: '#10b981',
      color: '#fff',
    }}
  >
    {isFree ? '🔒 다운로드(Pro)' : '⬇️ 저장 문구 다운로드'}
  </button>

  {isFree && renderUpgradeNotice('⬇️ 다운로드는 Pro부터 가능해요!')}
</div>
</div>

)}
{/* 🕘 지난 기록 */}
<div style={sectionBox}>
<h2 style={titleStyle}>🕘 지난 기록도 있어요</h2>
<div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
<input
placeholder="키워드로 검색"
value={search}
onChange={(e) => setSearch(e.target.value)}
style={{ ...inputStyle, marginBottom: 0 }}
/>
<button
onClick={handleClearHistory}
style={{ ...baseButton, backgroundColor: '#ef4444', color: '#fff' }}
>
전체 삭제
</button>
</div>
{filteredHistory.length === 0 && (
<div style={{ padding: '1rem', color: darkMode ? '#94a3b8' : '#6b7280' }}>
🔍 검색된 기록이 없어요.
</div>
)}
{filteredHistory.map((item, hIdx) => (

<div key={hIdx} style={{ marginBottom: '1.5rem' }}>
<div style={{ marginBottom: '0.75rem' }}>
<strong style={{ fontSize: '1rem', color: darkMode ? '#f1f5f9' : '#1f2937' }}>
{item.keyword}
</strong>
</div>
{item.savedAt && (
<div style={{ fontSize: '0.75rem', color: darkMode ? '#94a3b8' : '#6b7280', marginBottom: '0.5rem' }}>
📅 {new Date(item.savedAt).toLocaleDateString('ko-KR')} 저장됨
</div>
)}
<div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
<button
onClick={() => handleHistoryClick(item)}
style={{
...baseButton,
padding: '0.25rem 0.7rem',
fontSize: '0.75rem',
borderRadius: '6px',
backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
border: '1px solid #d1d5db',
color: darkMode ? '#cbd5e1' : '#374151',
}}
>
📦 불러오기
</button>
<button
onClick={() => handleDeleteHistoryItem(hIdx)}
style={{
...baseButton,
padding: '0.25rem 0.7rem',
fontSize: '0.75rem',
borderRadius: '6px',
backgroundColor: darkMode ? '#2b1c1c' : '#fee2e2',
border: '1px solid #fca5a5',
color: '#dc2626',
}}
>
🗑 삭제
</button>
</div>
{item.result.split('\n').map((line, lIdx) => (
  <div
    key={lIdx}
    style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: isMobile ? 'flex-start' : 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: '0.5rem',
      marginTop: '0.25rem',
    }}
  >
    <span style={{ flex: 1 }}>{line}</span>

    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
      <button style={baseButton} onClick={() => handleCopy(line)}>
        📋 복사
      </button>
      <button
        style={{ ...baseButton, color: '#e11d48' }}
        onClick={() => handleLikeToggle(hIdx, lIdx)}
      >
        {typeof item.likes?.[lIdx] === 'object' && item.likes[lIdx].liked
          ? '💔 삭제'
          : '🤍 저장'}
      </button>
    </div>
  </div>
))}


{/* ✍️ 성과/활용 메모 입력창 */}
<textarea
  placeholder="예: 상세페이지 적용 – 전환율 12% 증가 / 후기 요청 DM 도입부에 활용"
  value={item.memo || ''}
  onChange={(e) => handleMemoChange(hIdx, e.target.value)}
  style={{
    marginTop: '1rem',
    width: '100%',
    minHeight: '72px',
    fontSize: '0.95rem',
    fontWeight: 400,
    fontFamily: 'Pretendard, sans-serif',
    lineHeight: 1.6,
    borderRadius: '12px',
    padding: '0.85rem 1rem',
    background: darkMode ? '#1e293b' : '#f9fafb',
    color: darkMode ? '#f1f5f9' : '#111827',
    border: darkMode ? '1px solid #334155' : '1px solid #d1d5db',
    boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease-in-out',
  }}
/>


</div>
))}
</div>
{modal && (
  <UpgradeModal
    title={modal.title}
    message={modal.message}
    confirmText={modal.confirmText}
    cancelText={modal.cancelText}
    onConfirm={() => {
      modal.onConfirm()
      setModal(null)
    }}
    onCancel={() => setModal(null)}
  />
)}

    </div>
  )
}


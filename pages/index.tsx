// pages/index.tsx
import { useState, useEffect } from 'react';

const toneOptions = ['말랑한', '신뢰감', '재치있는', '고급스러운'];
const emotionOptions = ['감성적인', '활기찬', '차분한', '발랄한'];
const targetOptions = ['10대', '20대', '30대', '40대', '50대 이상'];
const genderOptions = ['여성', '남성', '모두'];
const purposeOptions = ['상세페이지', '광고 배너', 'SNS 홍보', '슬로건'];

interface HistoryItem {
  keyword: string;
  tone: string;
  emotion: string;
  target: string;
  gender: string;
  purpose: string;
  result: string;
  likes?: boolean[];
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [tone, setTone] = useState(toneOptions[0]);
  const [emotion, setEmotion] = useState(emotionOptions[0]);
  const [target, setTarget] = useState(targetOptions[0]);
  const [gender, setGender] = useState(genderOptions[0]);
  const [purpose, setPurpose] = useState(purposeOptions[0]);
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('marketing-history');
    if (saved) setHistory(JSON.parse(saved));
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark !== null) setDarkMode(JSON.parse(savedDark));
  }, []);

  useEffect(() => {
    document.documentElement.className = darkMode ? 'dark' : '';
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // ✅ Pretendard 폰트 적용 (새로고침 오류 방지)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      setToast('⛔ 키워드를 입력해주세요!');
      setTimeout(() => setToast(''), 2000);
      return;
    }

    setLoading(true);
    setResult('');
    setToast('🧠 문구 생성 중이에요… 잠시만 기다려주세요!');

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
      setResult(lines.join('\n'));
      setToast('✨ 문구가 완성되었어요! 맘에 드는 게 있나요?');

      const newItem: HistoryItem = {
        keyword,
        tone,
        emotion,
        target,
        gender,
        purpose,
        result: lines.join('\n'),
        likes: lines.map(() => false),
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
  const handleCopy = (text: string) => {
    const cleanText = text.replace(/^\d+\.\s*/, '');
    navigator.clipboard.writeText(cleanText);
    setToast('✅ 복사했어요! 바로 붙여넣어 사용해보세요 🙌');
    setTimeout(() => setToast(''), 2500);
  };

  const handleLikeToggle = (historyIdx: number, lineIdx: number) => {
    const updated = [...history];
    if (!updated[historyIdx].likes) {
      updated[historyIdx].likes = updated[historyIdx].result.split('\n').map(() => false);
    }
    updated[historyIdx].likes![lineIdx] = !updated[historyIdx].likes![lineIdx];
    setHistory(updated);
    localStorage.setItem('marketing-history', JSON.stringify(updated));
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setKeyword(item.keyword);
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

  const likedLinesWithLocation = history.flatMap((item, histIdx) =>
    item.result
      .split('\n')
      .map((line, lineIdx) => (item.likes?.[lineIdx] ? { line, histIdx, lineIdx } : null))
      .filter(Boolean)
  );

  const downloadLikedLines = () => {
    const likedLines = history.flatMap((item) =>
      item.result
        .split('\n')
        .map((line, idx) => (item.likes?.[idx] ? line.replace(/^\d+\.\s*/, '') : null))
        .filter(Boolean)
    );
    const blob = new Blob([likedLines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'liked-lines.txt';
    link.click();
    setToast('💾 좋아요한 문구가 다운로드 되었어요!');
    setTimeout(() => setToast(''), 2000);
  };

  const filteredHistory = search
    ? history.filter((item) => item.keyword.includes(search))
    : history;

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

  // ✅ 스타일
  const baseStyle: React.CSSProperties = {
    backgroundColor: darkMode ? '#1a1a1a' : '#f9fafb',
    color: darkMode ? '#f3f4f6' : '#111827',
    minHeight: '100vh',
    padding: isMobile ? '1rem' : '2rem',
    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
    transition: 'all 0.3s ease',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#ffffff',
  };

  const baseButton = {
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  };

  const tagBox = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem',
  };

  const tag = (selected: boolean) => ({
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    border: `1.5px solid ${selected ? '#2563eb' : '#d1d5db'}`,
    backgroundColor: selected ? '#2563eb' : '#ffffff',
    color: selected ? '#ffffff' : '#374151',
    fontWeight: 500,
    fontSize: '0.9rem',
    cursor: 'pointer',
  });

  const sectionBox: React.CSSProperties = {
    backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
    boxShadow: '0 1px 6px rgba(0, 0, 0, 0.05)',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '2rem',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '1.25rem',
    color: darkMode ? '#e5e7eb' : '#374151',
  };

  // ✅ return 시작
  return (
    <div style={baseStyle}>
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
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          {toast}
        </div>
      )}
      {/* 🌗 다크모드 토글 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ ...baseButton, backgroundColor: '#334155', color: '#fff' }}
        >
          🌗 다크모드 {darkMode ? '끄기' : '켜기'}
        </button>
      </div>

      {/* 🎯 소개 영역 */}
      <div style={sectionBox}>
        <h2 style={titleStyle}>🎯 무엇을 도와드릴까요?</h2>
        <p style={{ lineHeight: 1.6 }}>
          이 AI 마케팅 문구 생성기는 <strong>당신의 브랜드 스타일과 감정</strong>을 분석해
          <br />딱 맞는 마케팅 문구 3개를 추천해드려요.
          <br />
          <br />✍️ 키워드를 입력하고, 원하는 분위기를 선택해보세요!
        </p>
      </div>

      {/* ✏️ 키워드 입력 */}
      <div style={sectionBox}>
        <h2 style={titleStyle}>📌 브랜드를 한 단어로 표현해볼까요?</h2>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={inputStyle}
          placeholder="예: 감성 카페, 다이어트 보조제, 프리미엄 향수"
        />
      </div>

      {/* 🎨 옵션 선택 */}
      <div style={sectionBox}>
        <h2 style={titleStyle}>🎨 어떤 스타일과 분위기를 원하세요?</h2>

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

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            ...baseButton,
            backgroundColor: loading ? '#9ca3af' : '#2563eb',
            color: '#fff',
            marginTop: '1rem',
          }}
        >
          {loading ? '⏳ 문구 생성 중이에요...' : '✨ 이 조건으로 문구 만들어줘'}
        </button>
      </div>

      {/* 📢 결과 */}
      {result && (
        <div style={sectionBox}>
          <h2 style={titleStyle}>✨ 이런 문구는 어떠세요?</h2>
          {result.split('\n').map((line, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>{line}</span>
              <button onClick={() => handleCopy(line)}>📋</button>
            </div>
          ))}
        </div>
      )}

      {/* ❤️ 좋아요 */}
      {likedLinesWithLocation.length > 0 && (
        <div style={sectionBox}>
          <h2 style={titleStyle}>❤️ 저장해둔 문구</h2>
          {likedLinesWithLocation.map(({ line, histIdx, lineIdx }, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>• {line.replace(/^\d+\.\s*/, '')}</span>
              <div>
                <button onClick={() => handleCopy(line)}>📋</button>
                <button onClick={() => handleLikeToggle(histIdx, lineIdx)}>💔</button>
              </div>
            </div>
          ))}
          <button
            onClick={downloadLikedLines}
            style={{
              ...baseButton,
              backgroundColor: '#10b981',
              color: '#fff',
              marginTop: '0.5rem',
            }}
          >
            ⬇️ 저장 문구 다운로드
          </button>
        </div>
      )}

      {/* 🕘 히스토리 */}
      <div style={sectionBox}>
        <h2 style={titleStyle}>🕘 지난 기록도 있어요</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            placeholder="키워드로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
          />
          <button
            onClick={handleClearHistory}
            style={{ ...baseButton, backgroundColor: '#e11d48', color: '#fff' }}
          >
            전체 삭제
          </button>
        </div>
        {filteredHistory.map((item, hIdx) => (
          <div key={hIdx} style={{ marginBottom: '1.5rem' }}>
            <strong>{item.keyword}</strong>
            <div style={{ margin: '0.5rem 0' }}>
              <button onClick={() => handleHistoryClick(item)} style={{ marginRight: '0.5rem' }}>
                불러오기
              </button>
              <button onClick={() => handleDeleteHistoryItem(hIdx)} style={{ color: 'red' }}>
                삭제
              </button>
            </div>
            {item.result.split('\n').map((line, lIdx) => (
              <div key={lIdx} style={{ display: 'flex', alignItems: 'center', marginTop: '0.25rem' }}>
                <span>{line}</span>
                <button onClick={() => handleCopy(line)} style={{ marginLeft: '0.5rem' }}>📋</button>
                <button onClick={() => handleLikeToggle(hIdx, lIdx)} style={{ marginLeft: '0.25rem' }}>
                  {item.likes?.[lIdx] ? '❤️' : '🤍'}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

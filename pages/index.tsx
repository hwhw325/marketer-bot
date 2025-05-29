import { useState, useEffect, useRef } from 'react';
import templates from '../data/templates.json';
import TemplateSelector from '../components/TemplateSelector';
import OnboardingModal from '../components/OnboardingModal';
const toneOptions = ['말랑한', '신뢰감', '재치있는', '고급스러운'];
const emotionOptions = ['감성적인', '활기찬', '차분한', '발랄한'];
const targetOptions = ['10대', '20대', '30대', '40대', '50대 이상'];
const genderOptions = ['여성', '남성', '모두'];
const purposeOptions = ['상세페이지', '광고 배너', 'SNS 홍보', '슬로건'];
interface HistoryItem {
keyword: string;
category: string;
tone: string;
emotion: string;
target: string;
gender: string;
purpose: string;
result: string;
likes?: { liked: boolean; tag?: string }[];
savedAt?: string;
}
export default function Home() {
const [templateCat, setTemplateCat] = useState<string>('직접 입력');
useEffect(() => {
console.log('🏷️ [Home] templateCat →', templateCat);
}, [templateCat]);
const [tagFilter, setTagFilter] = useState('');
const [editing, setEditing] = useState<{ histIdx: number; lineIdx: number } | null>(null);
const [editText, setEditText] = useState('');
const likedRef = useRef<HTMLDivElement | null>(null);
const scrollToLiked = () => {
if (likedRef.current) {
likedRef.current.scrollIntoView({ behavior: 'smooth' });
}
};
const [darkMode, setDarkMode] = useState(false);
const [keyword, setKeyword] = useState('');
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
const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
const [search, setSearch] = useState('');
const [loading, setLoading] = useState(false);
const [showTutorial, setShowTutorial] = useState(false);
const [tutorialStep, setTutorialStep] = useState(0);
const [showGuide, setShowGuide] = useState(true);
const [editedLines, setEditedLines] = useState<{ histIdx: number; lineIdx: number }[]>([]);
useEffect(() => {
if (!localStorage.getItem('seenTutorial')) {
setShowTutorial(true);
setTutorialStep(0);
}
}, []);
useEffect(() => {
const saved = localStorage.getItem('marketing-history');
if (saved) setHistory(JSON.parse(saved));
const savedDark = localStorage.getItem('darkMode');
if (savedDark !== null) setDarkMode(JSON.parse(savedDark));
const seenGuide = localStorage.getItem('seen-onboarding');
if (seenGuide) setShowGuide(false);
}, []);
useEffect(() => {
document.documentElement.className = darkMode ? 'dark' : '';
localStorage.setItem('darkMode', JSON.stringify(darkMode));
}, [darkMode]);
useEffect(() => {
const link = document.createElement('link');
link.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css';
link.rel = 'stylesheet';
document.head.appendChild(link);
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
backgroundColor: darkMode ? '#0f172a' : '#f9fafb',
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
marginBottom: '1rem',
};
const baseButton: React.CSSProperties = {
padding: '0.5rem 1rem',
borderRadius: '9999px',
border: '1px solid #d1d5db',
backgroundColor: '#ffffff',
fontWeight: 500,
fontSize: '0.9rem',
cursor: 'pointer',
color: '#2563eb',
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
const handleGenerate = async () => {
if (!keyword.trim()) {
setToast('⛔ 키워드를 입력해주세요!');
setTimeout(() => setToast(''), 2000);
return;
}
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
<div style={baseStyle}>
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
{/* 🌙 다크모드 토글 */}
<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
<button
onClick={() => setDarkMode(!darkMode)}
style={{
...baseButton,
backgroundColor: darkMode ? '#e5e7eb' : '#1f2937',
color: darkMode ? '#1f2937' : '#ffffff',
}}
>
{darkMode ? '☀️ 라이트모드' : '🌙 다크모드'}
</button>
<button
onClick={scrollToLiked}
style={{
...baseButton,
backgroundColor: '#fef3c7',
color: '#92400e',
fontWeight: 600,
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
{/* 업종별 템플릿 선택 */}
<TemplateSelector
selectedCategory={templateCat}
onCategoryChange={setTemplateCat}
onSelect={handleTemplateSelect}
/>
<input
value={keyword}
onChange={(e) => setKeyword(e.target.value)}
style={inputStyle}
placeholder="예: 감성 카페, 프리미엄 향수"
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
❤️ 저장
</button>
</div>
</div>
))}
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
{recentTags.length > 0 && (
<div style={{ marginBottom: '1rem' }}>
<div style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: darkMode ? '#cbd5e1' : '#374151' }}>
최근 사용한 태그
</div>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
{recentTags.map((tag) => (
<div
key={tag}
onClick={() => setTagFilter((prev) => (prev === tag ? '' : tag))}
style={{
padding: '0.5rem 1rem',
borderRadius: '9999px',
border: tagFilter === tag ? '2px solid #2563eb' : '1px solid #d1d5db',
backgroundColor: tagFilter === tag ? '#2563eb' : (darkMode ? '#1e293b' : '#ffffff'),
color: tagFilter === tag ? '#ffffff' : (darkMode ? '#f1f5f9' : '#374151'),
fontWeight: 500,
fontSize: '0.9rem',
cursor: 'pointer',
transition: 'all 0.2s ease',
}}
>
#{tag}
</div>
))}
{/* ✅ #태그없음 버튼 */}
<div
onClick={() => setTagFilter((prev) => (prev === '__NONE__' ? '' : '__NONE__'))}
style={{
padding: '0.5rem 1rem',
borderRadius: '9999px',
border: tagFilter === '__NONE__' ? '2px solid #2563eb' : '1px solid #d1d5db',
backgroundColor: tagFilter === '__NONE__' ? '#2563eb' : (darkMode ? '#1e293b' : '#ffffff'),
color: tagFilter === '__NONE__' ? '#ffffff' : (darkMode ? '#f1f5f9' : '#374151'),
fontWeight: 500,
fontSize: '0.9rem',
cursor: 'pointer',
transition: 'all 0.2s ease',
}}
>
#태그없음
</div>
</div>
</div>
)}
{likedLinesWithLocation.map(({ line, histIdx, lineIdx }, i) => {
const item = history[histIdx];
const date = item.savedAt ? new Date(item.savedAt).toLocaleDateString('ko-KR') : '';
return (
<div key={i} style={{ marginBottom: '0.75rem' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
{editing?.histIdx === histIdx && editing.lineIdx === lineIdx ? (
<input
value={editText}
onChange={(e) => setEditText(e.target.value)}
style={{ ...inputStyle, marginBottom: 0, fontSize: '0.9rem' }}
/>
) : (
<span>• {line.replace(/^\d+\.\s*/, '')}</span>
)}
<div style={{ display: 'flex', gap: '0.25rem' }}>
<button style={baseButton} onClick={() => handleCopy(line, histIdx, lineIdx)}>📋 복사</button>
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
{!item.likes?.[lineIdx]?.tag?.trim() && (
<div style={{ fontSize: '0.75rem', color: '#f97316', marginTop: '0.25rem' }}>
🔖 태그를 입력하면 나중에 쉽게 찾을 수 있어요!
</div>
)}
{editedLines.some(e => e.histIdx === histIdx && e.lineIdx === lineIdx) && (
<div style={{ fontSize: '0.75rem', color: '#f97316', marginTop: '0.25rem' }}>
✏️ 수정됨
</div>
)}
{recentTags.length > 0 && (
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
{recentTags.map((tag) => (
<div
key={tag}
onClick={() => {
const currentVal =
typeof history[histIdx]?.likes?.[lineIdx] === 'object'
? history[histIdx].likes[lineIdx]?.tag || ''
: '';
const updatedVal = currentVal
.split(',')
.map((t) => t.trim())
.filter((t) => t.length > 0);
if (!updatedVal.includes(tag)) {
updatedVal.push(tag);
}
const updated = [...history];
if (updated[histIdx]?.likes?.[lineIdx]) {
if (typeof updated[histIdx].likes[lineIdx] === 'object') {
updated[histIdx].likes[lineIdx].tag = updatedVal.join(', ');
setHistory(updated);
localStorage.setItem('marketing-history', JSON.stringify(updated));
}
}
}}
style={{
padding: '0.35rem 0.75rem',
borderRadius: '9999px',
border: '1px solid #d1d5db',
backgroundColor: '#f3f4f6',
color: '#374151',
fontSize: '0.75rem',
cursor: 'pointer',
}}
>
#{tag}
</div>
))}
</div>
)}
{/* ✅ 태그 입력창 */}
<input
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
style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}
>
<span>{line}</span>
<div style={{ display: 'flex', gap: '0.25rem' }}>
<button style={baseButton} onClick={() => handleCopy(line)}>📋 복사</button>
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
</div>
))}
</div>
</div>
);
}


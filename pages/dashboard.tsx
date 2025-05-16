// pages/dashboard.tsx
import { useState, useEffect, useRef /* … */ } from 'react'
import Layout from '../components/Layout';
import PerformanceEntryForm, { PerformanceEntry } from '../components/PerformanceEntryForm';
import PerformanceChart from '../components/PerformanceChart';
import { baseStyle, inputStyle, baseButton } from '../lib/styles';
// KPI 계산 유틸리티
function calculateKpis(entries: PerformanceEntry[]) {
    const total = entries.length;
    const avgCtr =
      total > 0
        ? entries.reduce((sum, e) => sum + (e.clicks > 0 ? (e.conversions / e.clicks) * 100 : 0), 0) /
          total
        : 0;
    // 최고 CTR 문구 ID와 값 찾기
    let best = { id: '-', ctr: 0 };
    entries.forEach(e => {
      const ctr = e.clicks > 0 ? (e.conversions / e.clicks) * 100 : 0;
      if (ctr > best.ctr) best = { id: e.id, ctr };
    });
    return {
      total,
      avgCtr: avgCtr.toFixed(1),  // 소수점 1자리
      bestId: best.id,
      bestCtr: best.ctr.toFixed(1),
    };
  }
  

const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '2rem',
  };
  const thTdStyle: React.CSSProperties = {
    border: '1px solid #d1d5db',
    padding: '0.5rem',
    textAlign: 'left',
  };

  const kpiContainer: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  };
  const kpiCard: React.CSSProperties = {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    padding: '1rem',
    textAlign: 'center',
  };
  const kpiValue: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0.5rem 0',
  };
  const kpiLabel: React.CSSProperties = {
    fontSize: '0.9rem',
    color: '#6b7280',
  };

export default function Dashboard() {
  const [entries, setEntries] = useState<PerformanceEntry[]>([]);

  const [filterTag, setFilterTag] = useState('');      // 태그 필터
  const [filterStart, setFilterStart] = useState('');  // 시작일 필터
  const [filterEnd, setFilterEnd] = useState('');      // 종료일 필터
  const [filterQuery, setFilterQuery] = useState('');
  const [filterVariant, setFilterVariant] = useState<'ALL' | 'A' | 'B'>('ALL');

  // ① 페이지 로드 시 localStorage에서 불러오기
  useEffect(() => {
    const raw = localStorage.getItem('perf-entries');
    if (raw) setEntries(JSON.parse(raw));
  }, []);

  // ② onSave 핸들러 정의
  const handleSave = (entry: PerformanceEntry) => {
    const newList = [entry, ...entries];
    setEntries(newList);
    localStorage.setItem('perf-entries', JSON.stringify(newList));
  };

  // 필터링된 엔트리 구하기
const filteredEntries = entries.filter(e => {
      // ① 검색창 입력값이 비어 있거나, ID 혹은 문구(phrase)에 포함될 때만 통과
      const q = filterQuery.toLowerCase();
      const matchQuery =
        !filterQuery ||
        e.id.toLowerCase().includes(q) ||
        e.phrase.toLowerCase().includes(q);

    const tagMatch = filterTag === '' || (e.tag || '').includes(filterTag);
    const afterStart = !filterStart || e.date >= filterStart;
    const beforeEnd = !filterEnd || e.date <= filterEnd;
    const variantMatch =
      filterVariant === 'ALL' || e.variant === filterVariant;
    return matchQuery && tagMatch && afterStart && beforeEnd && variantMatch;
  });
  
  // KPI 계산
  const kpis = calculateKpis(filteredEntries);
  
  return (
   <Layout>
    <div style={{ padding: '2rem' }}>
      <h1>📊 성과 대시보드</h1>
      {/* 여기에 PerformanceEntryForm이 보입니다 */}
      <PerformanceEntryForm onSave={handleSave} />
      {/* — 필터 섹션 — */}
<div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
  {/* 검색창 */}
  <input
    type="text"
    placeholder="ID 또는 문구 내용 검색"
    value={filterQuery}
    onChange={e => setFilterQuery(e.target.value)}
    style={{ ...inputStyle, marginBottom: '0.5rem' }}
  />
  <input
    type="text"
    placeholder="태그로 필터링 (예: 프로모션)"
    value={filterTag}
    onChange={e => setFilterTag(e.target.value)}
    style={inputStyle}
  />
  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
    <input
      type="date"
      value={filterStart}
      onChange={e => setFilterStart(e.target.value)}
      style={inputStyle}
    />
    <input
      type="date"
      value={filterEnd}
      onChange={e => setFilterEnd(e.target.value)}
      style={inputStyle}
    />
  </div>
</div>
{/* Variant 필터 */}
<select
  value={filterVariant}
  onChange={e => setFilterVariant(e.target.value as 'ALL' | 'A' | 'B')}
  style={{ marginLeft: '1rem', ...inputStyle }}
>
  <option value="ALL">전체</option>
  <option value="A">Variant A</option>
  <option value="B">Variant B</option>
</select>
{/* — KPI 카드 섹션 — */}
<div style={kpiContainer}>
  <div style={kpiCard}>
    <div style={kpiValue}>{kpis.total}</div>
    <div style={kpiLabel}>총 엔트리 수</div>
  </div>
  <div style={kpiCard}>
    <div style={kpiValue}>{kpis.avgCtr}%</div>
    <div style={kpiLabel}>평균 CTR</div>
  </div>
  <div style={kpiCard}>
    <div style={kpiValue}>{kpis.bestId}</div>
    <div style={kpiLabel}>최고 성과 문구 ID ({kpis.bestCtr}%)</div>
  </div>
</div>

        {/* 저장된 엔트리 리스트 */}
  <div>
    <h2>🗒️ 입력된 성과 리스트</h2>
    {entries.length === 0 ? (
      <p>아직 저장된 성과 데이터가 없습니다.</p>
    ) : (
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>날짜</th>
            <th style={thTdStyle}>문구 ID</th>
            <th style={thTdStyle}>클릭 수</th>
            <th style={thTdStyle}>전환 수</th>
            <th style={thTdStyle}>태그</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries.map((e, idx) => (
            <tr key={idx}>
              <td style={thTdStyle}>{e.date}</td>
              <td style={thTdStyle}>{e.id}</td>
              <td style={thTdStyle}>{e.clicks}</td>
              <td style={thTdStyle}>{e.conversions}</td>
              <td style={thTdStyle}>{e.tag || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
{/* 차트 렌더링 추가 */}
   <PerformanceChart entries={filteredEntries} />
      {/* TODO: filteredEntries.map으로 리스트 출력 */}
    </div>
</Layout>  
  );
}

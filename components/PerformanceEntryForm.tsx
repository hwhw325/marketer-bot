import React, { useState } from 'react';
import { baseStyle, inputStyle, baseButton } from '../lib/styles';

export interface PerformanceEntry {
  id: string;
  phrase: string;
  date: string; // YYYY-MM-DD format
  clicks: number;
  conversions: number;
  tag?: string;
  variant: 'A' | 'B';   // A/B 테스트 구분자
}

interface PerformanceEntryFormProps {
  onSave: (entry: PerformanceEntry) => void;
}

export default function PerformanceEntryForm({ onSave }: PerformanceEntryFormProps) {
  const [phrase, setPhrase] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [clicks, setClicks] = useState<number>(0);
  const [conversions, setConversions] = useState<number>(0);
  const [tag, setTag] = useState('');
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: PerformanceEntry = {
      id: Date.now().toString(),
      phrase,
      date,
      clicks,
      conversions,
      tag: tag.trim() || undefined,
      variant, // variant 필드 추가
    };
    onSave(entry);
    // 초기화
    setPhrase('');
    setDate(new Date().toISOString().substr(0, 10));
    setClicks(0);
    setConversions(0);
    setTag('');
    setVariant('A');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <label>
        문구 ID / 문구 내용:
        <input
          type="text"
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          placeholder="예: 프로모션 A 문구"
          required
          style={inputStyle}
        />
      </label>
      <label>
        날짜:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={inputStyle}
        />
      </label>
      <label>
        클릭 수:
        <input
          type="number"
          min={0}
          value={clicks}
          onChange={(e) => setClicks(Number(e.target.value))}
          required
          style={inputStyle}
        />
      </label>
      <label>
        전환 수:
        <input
          type="number"
          min={0}
          value={conversions}
          onChange={(e) => setConversions(Number(e.target.value))}
          required
          style={inputStyle}
        />
      </label>

      {/* A/B 테스트 토글 */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem', fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={variant === 'B'}
            onChange={() => setVariant(variant === 'A' ? 'B' : 'A')}
            style={{ marginRight: '0.25rem' }}
          />
          A/B 테스트용 (B: On)
        </label>
        <span>현재: {variant}</span>
      </div>

      <label>
        태그 (선택):
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="예: 프로모션, 할인"
          style={inputStyle}
        />
      </label>
      <button type="submit" style={baseButton}>
        저장
      </button>
    </form>
  );
}

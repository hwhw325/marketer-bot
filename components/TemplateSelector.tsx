// components/TemplateSelector.tsx
import React, { useEffect } from 'react';
import templates from '../data/templates.json';
import { baseButton, inputStyle } from '../lib/styles';

interface TemplateSelectorProps {
  selectedCategory: string;
  onCategoryChange: (newCat: string) => void;
  onSelect: (prompt: string, templateName: string) => void;
}

export default function TemplateSelector({
  selectedCategory,
  onCategoryChange,
  onSelect,
}: TemplateSelectorProps) {
  const categories = ['직접 입력', ...Object.keys(templates)];

  return (
    <div style={{ marginBottom: '1rem' }}>
      <select
        value={selectedCategory}
        onChange={e => onCategoryChange(e.target.value)}
        style={inputStyle}
      >
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {selectedCategory !== '직접 입력' ? (
        <div style={{ marginTop: '0.5rem' }}>
          {templates[selectedCategory]?.map((t: any) => (
            <button
              key={t.name}
              onClick={() => onSelect(t.prompt, selectedCategory)}
              style={{ ...baseButton, marginRight: '0.5rem', marginBottom: '0.5rem' }}
            >
              {t.name}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: '0.5rem', color: '#6b7280' }}>
          <p>🔑 키워드를 직접 입력하세요.</p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: '#9ca3af' }}>
            예: 유청분리기, 에어컨 실외기, 스마트 스토어 구매대행
          </p>
        </div>
      )}
    </div>
  );
}

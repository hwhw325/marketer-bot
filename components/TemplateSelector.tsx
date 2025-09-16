// components/TemplateSelector.tsx
import React from 'react';
import templates from '../data/templates.json';
import { baseButton, inputStyle } from '../lib/styles';

interface TemplateSelectorProps {
  selectedCategory: string;
  onCategoryChange: (newCat: string) => void;
  onSelect: (prompt: string, templateName: string) => void;
  darkMode?: boolean;
  userPlan: string;
  onProAttempt: () => void;
}

export default function TemplateSelector({
  selectedCategory,
  onCategoryChange,
  onSelect,
  darkMode,
  userPlan,
  onProAttempt,
}: TemplateSelectorProps) {
  const categories = ['-템플릿 선택-', ...Object.keys(templates)];

  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* 드롭다운 */}
      <select
        value={selectedCategory}
        onChange={e => onCategoryChange(e.target.value)}
        style={inputStyle}
      >
        {categories.map(c => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* 템플릿 버튼 (직접 입력 제외) */}
      {selectedCategory !== '-템플릿 선택-' && (
        <div style={{ marginTop: '0.5rem' }}>
          {templates[selectedCategory]?.map((t: any) => {
            const isPro = t.proOnly === true;
            const locked = isPro && userPlan === 'free';

            return (
              <button
                key={t.name}
                onClick={() => {
                  if (locked) {
                    onProAttempt();
                  } else {
                    onSelect(t.prompt, selectedCategory);
                  }
                }}
                style={{
                  ...baseButton,
                  marginRight: '0.5rem',
                  marginBottom: '0.5rem',
                  backgroundColor: locked ? '#e5e7eb' : baseButton.backgroundColor,
                  color: locked ? '#9ca3af' : baseButton.color,
                  cursor: locked ? 'not-allowed' : 'pointer',
                  position: 'relative',
                  paddingLeft: locked ? '1.75rem' : undefined,
                }}
              >
                {locked && (
                  <span
                    style={{
                      position: 'absolute',
                      left: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '0.85rem',
                    }}
                  >
                    🔒
                  </span>
                )}
                {t.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// components/TagInput.tsx
import React, { useState, useRef, useEffect } from 'react';

interface TagInputProps {
  value: string;
  onChange: (newVal: string) => void;
  suggestions: string[];
  placeholder?: string;
}

export default function TagInput({
  value,
  onChange,
  suggestions,
  placeholder = '',
}: TagInputProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // 입력 변화 처리
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange(v);
    setOpen(v.length > 0 && suggestions.length > 0);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        type="text"
        value={value}
        onChange={handleInput}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '0.85rem',
          backgroundColor: 'inherit',
          color: 'inherit',
        }}
      />

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            maxHeight: '150px',
            overflowY: 'auto',
            backgroundColor: 'inherit',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            zIndex: 10,
          }}
        >
          {suggestions
            .filter((t) => t.toLowerCase().includes(value.toLowerCase()) && t !== value)
            .map((tag) => (
              <div
                key={tag}
                onClick={() => {
                  onChange(tag);
                  setOpen(false);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                #{tag}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

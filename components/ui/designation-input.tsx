'use client';

import { useEffect, useRef, useState } from 'react';
import config from '@/config.json';

const DESIGNATIONS: string[] = Array.from(new Set((config as any).designations as string[]));

interface DesignationInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  placeholder?: string;
}

export function DesignationInput({
  id,
  value,
  onChange,
  onBlur,
  invalid,
  placeholder = 'Select or type designation',
}: DesignationInputProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onBlur]);

  const q = value.trim().toLowerCase();
  const suggestions = q
    ? DESIGNATIONS.filter((d) => d.toLowerCase().includes(q))
    : DESIGNATIONS;

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <input
        id={id}
        value={value}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: '44px',
          padding: '0 12px',
          border: `1px solid ${invalid ? '#DC2626' : '#D7D7D7'}`,
          borderRadius: '7px',
          fontSize: '16px',
          color: '#102C4A',
          outline: 'none',
          background: '#fff',
        }}
      />
      {open && suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            maxHeight: '220px',
            overflowY: 'auto',
            background: '#fff',
            border: '1px solid #D7D7D7',
            borderRadius: '7px',
            boxShadow: '0 10px 30px rgba(16, 44, 74, 0.15)',
            zIndex: 50,
          }}
        >
          {suggestions.map((d) => (
            <button
              key={d}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(d);
                setOpen(false);
                onBlur?.();
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 12px',
                background: d === value ? '#F4F6F8' : 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#102C4A',
                fontSize: '14px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F4F6F8')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = d === value ? '#F4F6F8' : 'transparent')
              }
            >
              {d}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

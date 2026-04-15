'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en.json';
import flags from 'react-phone-number-input/flags';
import { ChevronDown } from 'lucide-react';

type Country = ReturnType<typeof getCountries>[number];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  defaultCountry?: Country;
}

function parseValue(value: string, fallback: Country): { country: Country; national: string } {
  if (value && value.startsWith('+')) {
    const digits = value.slice(1);
    for (const c of getCountries()) {
      const code = getCountryCallingCode(c);
      if (digits.startsWith(code)) {
        return { country: c, national: digits.slice(code.length) };
      }
    }
  }
  return { country: fallback, national: value.replace(/^\+/, '') };
}

export function PhoneInput({ value, onChange, id, defaultCountry = 'US' as Country }: PhoneInputProps) {
  const countries = useMemo(
    () =>
      (getCountries() as Country[])
        .map((c) => ({ code: c, name: (en as Record<string, string>)[c] || c, dial: getCountryCallingCode(c) }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const { country: initialCountry, national: initialNational } = parseValue(value || '', defaultCountry);
  const [country, setCountry] = useState<Country>(initialCountry);
  const [national, setNational] = useState<string>(initialNational);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const parsed = parseValue(value || '', defaultCountry);
    setCountry(parsed.country);
    setNational(parsed.national);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const emit = (c: Country, n: string) => {
    const digits = n.replace(/\D/g, '');
    onChange(digits ? `+${getCountryCallingCode(c)}${digits}` : '');
  };

  const Flag = flags[country];
  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.dial.includes(query.replace(/^\+/, '')) ||
      c.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      ref={wrapRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #D7D7D7',
        borderRadius: '7px',
        height: '44px',
        position: 'relative',
        background: '#fff',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0 12px',
          height: '100%',
          background: 'transparent',
          border: 'none',
          borderRight: '1px solid #D7D7D7',
          cursor: 'pointer',
          color: '#102C4A',
          fontSize: '16px',
        }}
      >
        <span style={{ width: 22, height: 16, overflow: 'hidden', display: 'inline-flex' }}>
          {Flag ? <Flag title={country} /> : null}
        </span>
        <span>+{getCountryCallingCode(country)}</span>
        <ChevronDown className="w-4 h-4" style={{ color: '#66717D' }} />
      </button>

      <input
        id={id}
        type="tel"
        inputMode="numeric"
        value={national}
        placeholder="Enter phone number"
        onChange={(e) => {
          const n = e.target.value.replace(/\D/g, '');
          setNational(n);
          emit(country, n);
        }}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: '16px',
          color: '#102C4A',
          padding: '0 12px',
          height: '100%',
        }}
      />

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '320px',
            maxHeight: '260px',
            background: '#fff',
            border: '1px solid #D7D7D7',
            borderRadius: '7px',
            boxShadow: '0 10px 30px rgba(16, 44, 74, 0.15)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country"
            style={{
              padding: '10px 12px',
              border: 'none',
              borderBottom: '1px solid #D7D7D7',
              outline: 'none',
              fontSize: '14px',
              color: '#102C4A',
            }}
          />
          <div style={{ overflowY: 'auto' }}>
            {filtered.map((c) => {
              const F = flags[c.code];
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setCountry(c.code);
                    setOpen(false);
                    setQuery('');
                    emit(c.code, national);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 12px',
                    background: c.code === country ? '#F4F6F8' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#102C4A',
                    fontSize: '14px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F4F6F8')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = c.code === country ? '#F4F6F8' : 'transparent')
                  }
                >
                  <span style={{ width: 22, height: 16, overflow: 'hidden', display: 'inline-flex' }}>
                    {F ? <F title={c.code} /> : null}
                  </span>
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span style={{ color: '#66717D' }}>+{c.dial}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: '12px', color: '#66717D', fontSize: '14px' }}>No countries</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

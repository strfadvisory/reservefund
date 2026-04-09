'use client';

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
  ClipboardEvent,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const OTP_LENGTH = 5;
const RESEND_SECONDS = 30;

function maskEmail(email: string) {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  const [domainName, ...rest] = domain.split('.');
  const maskedLocal =
    local.length <= 3 ? local + '....' : local.slice(0, 3) + '....';
  const maskedDomain =
    domainName.length <= 2 ? domainName + '...' : domainName.slice(0, 2) + '...';
  return `${maskedLocal}@${maskedDomain}.${rest.join('.') || 'com'}`;
}

export default function OtpPage() {
  return (
    <Suspense fallback={null}>
      <OtpPageContent />
    </Suspense>
  );
}

function OtpPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const maskedEmail = useMemo(() => maskEmail(email), [email]);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const canConfirm = digits.every((d) => d !== '');

  const setDigitAt = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value;
    setDigits(next);
  };

  const handleChange = (index: number, raw: string) => {
    const value = raw.replace(/\D/g, '').slice(-1);
    setDigitAt(index, value);
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        setDigitAt(index, '');
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        setDigitAt(index - 1, '');
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleResend = () => {
    setDigits(Array(OTP_LENGTH).fill(''));
    setSeconds(RESEND_SECONDS);
    inputsRef.current[0]?.focus();
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar - fixed width, always on the left */}
      <aside
        className="relative shrink-0 hidden md:block"
        style={{
          width: '353px',
          backgroundImage: "url('/images/leftbg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div style={{ paddingTop: '40px', paddingLeft: '40px' }}>
          <Image
            src="/images/logo.png"
            alt="Reserve Fund Advisers LLC"
            width={200}
            height={56}
            priority
            style={{ height: 'auto', width: '200px' }}
          />
        </div>
      </aside>

      {/* Main Content - fills remaining width */}
      <div className="flex-1 min-w-0 flex justify-center items-center overflow-auto py-12 px-6">
        <div className="w-full flex flex-col my-auto" style={{ maxWidth: '643px' }}>
          {/* Form Card */}
          <div
            className="bg-white"
            style={{
              border: '1px solid #D7D7D7',
              borderRadius: '7px',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px 32px',
                borderBottom: '1px solid #D7D7D7',
              }}
            >
              <h1
                className="font-semibold"
                style={{ color: '#102C4A', fontSize: '24px', lineHeight: '1.3' }}
              >
                OTP Verification
              </h1>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 32px' }}>
              <p
                style={{
                  color: '#102C4A',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  marginBottom: '4px',
                }}
              >
                Verify your email address {maskedEmail}
              </p>
              <p
                style={{
                  color: '#102C4A',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  marginBottom: '24px',
                }}
              >
                Enter the OTP sent to your registered contact to verify and access the system.
              </p>

              {/* OTP inputs */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                  gap: '12px',
                  marginBottom: '16px',
                  width: '100%',
                }}
              >
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputsRef.current[i] = el;
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className="text-center outline-none transition-colors"
                    style={{
                      width: '100%',
                      minWidth: 0,
                      height: '56px',
                      fontSize: '24px',
                      color: '#102C4A',
                      border: `1px solid ${d !== '' ? '#0E519B' : '#D7D7D7'}`,
                      borderRadius: '7px',
                      boxSizing: 'border-box',
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              {/* Timer and Resend */}
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: '24px' }}
              >
                <span
                  className="font-semibold"
                  style={{ color: '#102C4A', fontSize: '16px' }}
                >
                  {seconds} Second
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={seconds > 0}
                  style={{
                    color: seconds > 0 ? '#B5BCC4' : '#0E519B',
                    fontSize: '16px',
                    fontWeight: 500,
                    background: 'none',
                    border: 'none',
                    cursor: seconds > 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Resend Code
                </button>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: canConfirm ? '#0E519B' : '#B5BCC4',
                  borderRadius: '7px',
                  padding: '14px',
                  fontSize: '16px',
                }}
              >
                Confirm
              </button>
            </div>

            {/* Change Profile link */}
            <div
              className="text-center"
              style={{
                padding: '20px',
                borderTop: '1px solid #D7D7D7',
              }}
            >
              <Link
                href="/register"
                style={{ color: '#102C4A', fontSize: '16px', fontWeight: 500 }}
              >
                Change Profile
              </Link>
            </div>
          </div>

          {/* Footer (outside the card) */}
          <div style={{ marginTop: '32px' }}>
            <div className="flex justify-between items-start">
              <div
                className="flex flex-col gap-2"
                style={{ color: '#66717D', fontSize: '14px' }}
              >
                <a
                  href="mailto:info@reservefundadvisory.com"
                  className="flex items-center gap-2 hover:opacity-80"
                >
                  <span>@</span> info@reservefundadvisory.com
                </a>
                <a
                  href="tel:727-788-4800"
                  className="flex items-center gap-2 hover:opacity-80"
                >
                  <span>☎</span> 727-788-4800
                </a>
              </div>
              <div
                className="flex flex-col items-end gap-2"
                style={{ color: '#66717D', fontSize: '14px' }}
              >
                <a href="/privacy">Privacy Policy</a>
                <span>Copyright2026 @ reservefundadvisory.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

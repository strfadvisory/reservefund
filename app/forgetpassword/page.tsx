'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageFooter } from '@/components/page-footer';
import { LeftPanel } from '@/components/left-panel';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched((t) => ({ ...t, email: true }));

    if (!email.trim()) return;

    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset link');
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-white flex">
        <LeftPanel />
        <div className="flex-1 min-w-0 flex justify-center items-center overflow-auto py-12 px-6 md:ml-[353px]">
          <div className="w-full flex flex-col my-auto" style={{ maxWidth: '643px' }}>
            <div className="bg-white" style={{ border: '1px solid #D7D7D7', borderRadius: '7px' }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid #D7D7D7' }}>
                <h1 className="font-semibold" style={{ color: '#102C4A', fontSize: '24px', lineHeight: '1.3' }}>
                  Check your email
                </h1>
              </div>
              <div style={{ padding: '32px' }}>
                <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: '1.7', marginBottom: '28px' }}>
                  We&apos;ve sent a password reset link to{' '}
                  <strong>{email}</strong>. Open the email and click the link to create a new password.
                </p>
                <p style={{ color: '#66717D', fontSize: '14px', marginBottom: '28px' }}>
                  If you don&apos;t see it, check your spam folder.
                </p>
                <Link
                  href="/login"
                  className="block w-full text-center font-semibold text-white transition-all duration-200 hover:opacity-95"
                  style={{ backgroundColor: '#0E519B', borderRadius: '7px', padding: '14px', fontSize: '16px' }}
                >
                  Back to login
                </Link>
              </div>
            </div>
            <PageFooter />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <LeftPanel />

      <div className="flex-1 min-w-0 flex justify-center items-center overflow-auto py-12 px-6 md:ml-[353px]">
        <div className="w-full flex flex-col my-auto" style={{ maxWidth: '643px' }}>
          <form
            onSubmit={handleSubmit}
            className="bg-white"
            style={{ border: '1px solid #D7D7D7', borderRadius: '7px' }}
          >
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #D7D7D7' }}>
              <h1
                className="font-semibold"
                style={{ color: '#102C4A', fontSize: '24px', lineHeight: '1.3' }}
              >
                Reset your password to regain access to
                <br />
                your account.
              </h1>
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{ marginBottom: '28px' }}>
                <Label
                  htmlFor="email"
                  style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}
                >
                  Registered email address*
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled={sending}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  className="h-11"
                  style={{
                    borderColor:
                      touched.email && !email.trim()
                        ? '#DC2626'
                        : email.trim()
                        ? '#0E519B'
                        : '#D7D7D7',
                    borderRadius: '7px',
                    fontSize: '16px',
                    opacity: sending ? 0.6 : 1,
                  }}
                />
                {touched.email && !email.trim() && (
                  <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                )}
                {error && (
                  <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#0E519B',
                  borderRadius: '7px',
                  padding: '14px',
                  fontSize: '16px',
                  opacity: sending ? 0.75 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {sending && (
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                )}
                {sending ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>

            <div className="text-center" style={{ padding: '20px', borderTop: '1px solid #D7D7D7' }}>
              <Link href="/login" style={{ color: 'inherit', fontSize: '16px', fontWeight: 600 }}>
                Back to login
              </Link>
            </div>
          </form>

          <PageFooter />
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

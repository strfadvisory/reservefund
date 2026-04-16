'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageFooter } from '@/components/page-footer';
import { LeftPanel } from '@/components/left-panel';

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setTouched((t) => ({ ...t, email: true }));
      return;
    }

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset link');
      }

      router.push(`/otp?email=${encodeURIComponent(data.email)}&mode=reset`);

    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <LeftPanel />

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex justify-center items-center overflow-auto py-12 px-6 md:ml-[353px]">
        <div className="w-full flex flex-col my-auto" style={{ maxWidth: '643px' }}>
          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
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
                Reset your password to regain access to
                <br />
                your account.
              </h1>
            </div>

            {/* Body */}
            <div style={{ padding: '32px' }}>
              <div style={{ marginBottom: '28px' }}>
                <Label
                  htmlFor="email"
                  style={{
                    color: '#102C4A',
                    fontSize: '16px',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  Register email Address*
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  className="h-11"
                  style={{
                    borderColor: touched.email && !email.trim() ? '#DC2626' : '#0E519B',
                    borderRadius: '7px',
                    fontSize: '16px',
                  }}
                />
                {touched.email && !email.trim() && (
                  <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                )}
                {error && (
                  <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95"
                style={{
                  backgroundColor: '#0E519B',
                  borderRadius: '7px',
                  padding: '14px',
                  fontSize: '16px',
                }}
              >
                Send Reset Link
              </button>
            </div>

            {/* Footer link */}
            <div
              className="text-center"
              style={{
                padding: '20px',
                borderTop: '1px solid #D7D7D7',
              }}
            >
              <Link
                href="/login"
                style={{ color: 'inherit', fontSize: '16px', fontWeight: 600 }}
              >
                Back to login
              </Link>
            </div>
          </form>

          <PageFooter />
        </div>
      </div>
    </div>
  );
}

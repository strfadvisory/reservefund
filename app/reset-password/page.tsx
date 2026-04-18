'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageFooter } from '@/components/page-footer';
import { LeftPanel } from '@/components/left-panel';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageShell><LoadingCard /></PageShell>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex">
      <LeftPanel />
      <div className="flex-1 min-w-0 flex justify-center items-center overflow-auto py-12 px-6 md:ml-[353px]">
        <div className="w-full flex flex-col my-auto" style={{ maxWidth: '643px' }}>
          {children}
          <PageFooter />
        </div>
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div
      className="bg-white flex items-center justify-center"
      style={{ border: '1px solid #D7D7D7', borderRadius: '7px', padding: '60px 32px' }}
    >
      <span
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid #D7D7D7',
          borderTopColor: '#0E519B',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordMismatch =
    touched.confirmPassword && confirmPassword !== '' && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });

    if (!password.trim() || !confirmPassword.trim()) return;
    if (password !== confirmPassword) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <PageShell>
        <div
          className="bg-white text-center"
          style={{ border: '1px solid #D7D7D7', borderRadius: '7px', padding: '40px 32px' }}
        >
          <p style={{ color: '#DC2626', fontSize: '16px', marginBottom: '16px' }}>
            Invalid or missing reset link.
          </p>
          <Link href="/forgetpassword" style={{ color: '#0E519B', fontWeight: 600, fontSize: '16px' }}>
            Request a new one
          </Link>
        </div>
      </PageShell>
    );
  }

  if (success) {
    return (
      <PageShell>
        <div className="bg-white" style={{ border: '1px solid #D7D7D7', borderRadius: '7px' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid #D7D7D7' }}>
            <h1 className="font-semibold" style={{ color: '#102C4A', fontSize: '24px', lineHeight: '1.3' }}>
              Password updated!
            </h1>
          </div>
          <div style={{ padding: '32px' }}>
            <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: '1.7', marginBottom: '28px' }}>
              Your password has been changed successfully. Redirecting you to login…
            </p>
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #D7D7D7',
                  borderTopColor: '#0E519B',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#66717D', fontSize: '14px' }}>Taking you to login…</span>
            </div>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <form
        onSubmit={handleSubmit}
        className="bg-white"
        style={{ border: '1px solid #D7D7D7', borderRadius: '7px' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #D7D7D7' }}>
          <h1 className="font-semibold" style={{ color: '#102C4A', fontSize: '24px', lineHeight: '1.3' }}>
            Create a new password for your account.
          </h1>
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <Label
              htmlFor="password"
              style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}
            >
              New Password*
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              disabled={submitting}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              className="h-11"
              style={{
                borderColor:
                  touched.password && !password.trim()
                    ? '#DC2626'
                    : password.trim()
                    ? '#0E519B'
                    : '#D7D7D7',
                borderRadius: '7px',
                fontSize: '16px',
                opacity: submitting ? 0.6 : 1,
              }}
            />
            {touched.password && !password.trim() && (
              <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
            )}
          </div>

          <div style={{ marginBottom: '28px' }}>
            <Label
              htmlFor="confirmPassword"
              style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}
            >
              Confirm Password*
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              disabled={submitting}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
              className="h-11"
              style={{
                borderColor:
                  passwordMismatch
                    ? '#DC2626'
                    : touched.confirmPassword && !confirmPassword.trim()
                    ? '#DC2626'
                    : confirmPassword.trim()
                    ? '#0E519B'
                    : '#D7D7D7',
                borderRadius: '7px',
                fontSize: '16px',
                opacity: submitting ? 0.6 : 1,
              }}
            />
            {touched.confirmPassword && !confirmPassword.trim() && (
              <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
            )}
            {passwordMismatch && (
              <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>Passwords do not match</p>
            )}
          </div>

          {error && (
            <p style={{ color: '#DC2626', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#0E519B',
              borderRadius: '7px',
              padding: '14px',
              fontSize: '16px',
              opacity: submitting ? 0.75 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {submitting && (
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
            {submitting ? 'Saving...' : 'Set New Password'}
          </button>
        </div>

        <div className="text-center" style={{ padding: '20px', borderTop: '1px solid #D7D7D7' }}>
          <Link href="/login" style={{ color: 'inherit', fontSize: '16px', fontWeight: 600 }}>
            Back to login
          </Link>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </PageShell>
  );
}

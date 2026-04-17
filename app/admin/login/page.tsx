'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageFooter } from '@/components/page-footer';
import { LeftPanel } from '@/components/left-panel';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <LeftPanel />

      <div className="flex-1 min-w-0 flex justify-center items-center overflow-auto py-12 px-6 md:ml-[353px]">
        <div className="w-full flex flex-col my-auto" style={{ maxWidth: '643px' }}>
          <form
            onSubmit={handleLogin}
            className="bg-white"
            style={{ border: '1px solid #D7D7D7', borderRadius: '7px' }}
          >
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
                Super Admin Access
              </h1>
              <p
                style={{
                  color: '#66717D',
                  fontSize: '14px',
                  marginTop: '6px',
                  lineHeight: 1.45,
                }}
              >
                Sign in with your administrator credentials to manage the platform.
              </p>
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{ marginBottom: '20px' }}>
                <Label
                  htmlFor="username"
                  style={{
                    color: '#102C4A',
                    fontSize: '16px',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  Username *
                </Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                  className="h-11"
                  style={{
                    borderColor:
                      touched.username && !username.trim() ? '#DC2626' : '#D7D7D7',
                    borderRadius: '7px',
                    fontSize: '16px',
                  }}
                />
                {touched.username && !username.trim() && (
                  <p
                    style={{
                      color: '#DC2626',
                      fontSize: '14px',
                      marginTop: '4px',
                    }}
                  >
                    This field is required
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <Label
                  htmlFor="password"
                  style={{
                    color: '#102C4A',
                    fontSize: '16px',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  className="h-11"
                  style={{
                    borderColor:
                      touched.password && !password.trim() ? '#DC2626' : '#D7D7D7',
                    borderRadius: '7px',
                    fontSize: '16px',
                  }}
                />
                {touched.password && !password.trim() && (
                  <p
                    style={{
                      color: '#DC2626',
                      fontSize: '14px',
                      marginTop: '4px',
                    }}
                  >
                    This field is required
                  </p>
                )}
              </div>

              {error && (
                <p
                  style={{
                    color: '#DC2626',
                    fontSize: '14px',
                    marginBottom: '12px',
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: submitting ? '#B5BCC4' : '#0E519B',
                  borderRadius: '7px',
                  padding: '14px',
                  fontSize: '16px',
                }}
              >
                {submitting ? 'Signing in...' : 'Login as Super Admin'}
              </button>
            </div>
          </form>

          <PageFooter />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PageFooter } from '@/components/page-footer';
import { LeftPanel } from '@/components/left-panel';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex">
      <LeftPanel />

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex justify-center items-center overflow-auto py-12 px-6 md:ml-[353px]">
        <div className="w-full flex flex-col my-auto" style={{ maxWidth: '643px' }}>
          {/* Form Card */}
          <form
            onSubmit={handleLogin}
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
                Welcome Back, Use your registered email to
                <br />
                access your account
              </h1>
            </div>

            {/* Body */}
            <div style={{ padding: '32px' }}>
              <div style={{ marginBottom: '20px' }}>
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
               
                    borderRadius: '7px',
                    fontSize: '16px',
                  }}
                />
                {touched.email && !email.trim() && (
                  <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  className="h-11"
                  style={{
                    borderColor: touched.password && !password.trim() ? '#DC2626' : '#D7D7D7',
                    borderRadius: '7px',
                    fontSize: '16px',
                  }}
                />
                {touched.password && !password.trim() && (
                  <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                )}
              </div>

              <div
                className="flex items-center justify-between"
                style={{ marginBottom: '24px' }}
              >
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(v === true)}
                  />
                  <Label
                    htmlFor="remember"
                    className="cursor-pointer"
                    style={{ color: '#102C4A', fontSize: '16px' }}
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgetpassword"
                  style={{ color: 'inherit', fontSize: '16px', fontWeight: 500 }}
                >
                  Forgot Password?
                </Link>
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
                Login Account
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
                href="/register"
                style={{ color: 'inherit', fontSize: '16px', fontWeight: 600 }}
              >
                I don&apos;t have an account
              </Link>
            </div>
          </form>

          <PageFooter />
        </div>
      </div>
    </div>
  );
}

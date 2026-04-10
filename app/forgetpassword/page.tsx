'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex justify-center items-center overflow-auto py-12 px-6">
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
                  className="h-11"
                  style={{
                    borderColor: '#0E519B',
                    borderRadius: '7px',
                    fontSize: '16px',
                  }}
                />
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
                style={{ color: '#0E519B', fontSize: '16px', fontWeight: 600 }}
              >
                Back to login
              </Link>
            </div>
          </form>

          {/* Footer */}
          <div style={{ marginTop: '32px' }}>
            <div className="flex justify-between items-start">
              <div
                className="flex flex-col gap-2"
                style={{ color: '#66717D' }}
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
                style={{ color: '#66717D', textAlign: 'right' }}
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

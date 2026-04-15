'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Label } from '@/components/ui/label';
import { PageFooter } from '@/components/page-footer';
import { LeftPanel } from '@/components/left-panel';

const PASSWORD_RULES: { id: string; label: string; test: (v: string) => boolean }[] = [
  { id: 'len', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'upper', label: 'At least one uppercase letter (A-Z)', test: (v) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'At least one lowercase letter (a-z)', test: (v) => /[a-z]/.test(v) },
  { id: 'num', label: 'At least one number (0-9)', test: (v) => /[0-9]/.test(v) },
  { id: 'special', label: 'At least one special character (!@#$%^&*)', test: (v) => /[!@#$%^&*]/.test(v) },
];

export default function InviteAcceptPage() {
  return (
    <Suspense fallback={null}>
      <InviteAcceptContent />
    </Suspense>
  );
}

function InviteAcceptContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') || '';

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [invite, setInvite] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const [inviter, setInviter] = useState<{ companyName: string | null; roleLabel: string } | null>(null);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!token) {
      setLoadError('Missing invitation token');
      setLoading(false);
      return;
    }
    fetch(`/api/invite/accept?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Invalid invitation');
        setInvite(data.invite);
        setInviter(data.inviter);
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const passwordScore = useMemo(() => PASSWORD_RULES.filter((r) => r.test(password)).length, [password]);
  const strengthLabel = useMemo(
    () => (passwordScore <= 1 ? 'Weak' : passwordScore <= 2 ? 'Fair' : passwordScore <= 3 ? 'Good' : passwordScore <= 4 ? 'Strong' : 'Excellent'),
    [passwordScore]
  );
  const canSubmit =
    !!invite &&
    phone.trim() !== '' &&
    passwordScore === 5 &&
    password === rePassword &&
    !submitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setServerError('');
    try {
      const res = await fetch('/api/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push('/dashboard');
    } catch (e: any) {
      setServerError(e.message);
      setSubmitting(false);
    }
  };

  const fullName = invite ? `${invite.firstName} ${invite.lastName}`.trim() : '';

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <LeftPanel />
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ paddingLeft: '353px' }}>
        <main className="flex-1 flex items-center justify-center" style={{ padding: '40px 24px' }}>
          <div style={{ width: '100%', maxWidth: '643px' }}>
            {loading && <div style={{ color: '#66717D' }}>Loading invitation…</div>}
            {!loading && loadError && (
              <div style={{ color: '#DC2626', fontSize: '16px' }}>{loadError}</div>
            )}
            {!loading && !loadError && invite && (
              <div
                style={{
                  border: '1px solid #D7D7D7',
                  borderRadius: '7px',
                  background: '#fff',
                }}
              >
                <div style={{ padding: '28px 32px', borderBottom: '1px solid #D7D7D7' }}>
                  <h1 className="font-semibold" style={{ color: '#102C4A', fontSize: '24px', marginBottom: '8px' }}>
                    Welcome {fullName}
                  </h1>
                  <p style={{ color: '#102C4A', fontSize: '14px', lineHeight: 1.5 }}>
                    You are registered with the email <strong>{invite.email}</strong>
                    {inviter?.roleLabel ? (
                      <> as the <strong>{inviter.roleLabel}</strong></>
                    ) : null}
                    {inviter?.companyName ? <> of <strong>{inviter.companyName}</strong></> : null} and have Manager
                    access in this system.
                  </p>
                </div>

                <div style={{ padding: '28px 32px' }}>
                  <div className="grid grid-cols-2" style={{ gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <Label htmlFor="loginAddress" style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                        Login Address
                      </Label>
                      <Input
                        id="loginAddress"
                        value={invite.email}
                        readOnly
                        className="h-11"
                        style={{ borderColor: '#D7D7D7', borderRadius: '7px', fontSize: '16px', background: '#F4F6F8' }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                        Enter Phone number <span>*</span>
                      </Label>
                      <PhoneInput id="phone" value={phone} onChange={setPhone} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2" style={{ gap: '20px', marginBottom: '12px' }}>
                    <div>
                      <Label htmlFor="password" style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                        Password <span>*</span>
                      </Label>
                      <div style={{ position: 'relative' }}>
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-11 pr-10"
                          style={{ borderColor: '#D7D7D7', borderRadius: '7px', fontSize: '16px' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#66717D' }}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="rePassword" style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                        Re-password <span>*</span>
                      </Label>
                      <div style={{ position: 'relative' }}>
                        <Input
                          id="rePassword"
                          type={showRePassword ? 'text' : 'password'}
                          value={rePassword}
                          onChange={(e) => setRePassword(e.target.value)}
                          className="h-11 pr-10"
                          style={{ borderColor: '#D7D7D7', borderRadius: '7px', fontSize: '16px' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRePassword((v) => !v)}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#66717D' }}
                        >
                          {showRePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ margin: '20px 0 12px' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                      <span style={{ color: '#102C4A', fontSize: '14px', fontWeight: 600 }}>Password Strength</span>
                      <span style={{ color: passwordScore === 5 ? '#10B981' : '#DC2626', fontSize: '14px' }}>
                        {strengthLabel} ({passwordScore}/5)
                      </span>
                    </div>
                    <div style={{ height: '4px', background: '#F4F6F8', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${(passwordScore / 5) * 100}%`,
                          height: '100%',
                          background: passwordScore === 5 ? '#10B981' : '#DC2626',
                        }}
                      />
                    </div>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 24px' }}>
                    {PASSWORD_RULES.map((r) => {
                      const ok = r.test(password);
                      return (
                        <li
                          key={r.id}
                          className="flex items-center"
                          style={{ gap: '8px', color: ok ? '#10B981' : '#66717D', fontSize: '14px', padding: '3px 0' }}
                        >
                          {ok ? <Check className="w-4 h-4" /> : <span style={{ width: '16px', display: 'inline-block' }}>•</span>}
                          {r.label}
                        </li>
                      );
                    })}
                  </ul>

                  {serverError && (
                    <p style={{ color: '#DC2626', fontSize: '14px', marginBottom: '12px' }}>{serverError}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!canSubmit}
                    className="w-full font-semibold text-white"
                    style={{
                      backgroundColor: canSubmit ? '#0E519B' : '#9CA3AF',
                      borderRadius: '7px',
                      padding: '14px',
                      fontSize: '16px',
                      cursor: canSubmit ? 'pointer' : 'not-allowed',
                      border: 'none',
                    }}
                  >
                    {submitting ? 'Saving…' : 'Confirm'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
        <PageFooter />
      </div>
    </div>
  );
}

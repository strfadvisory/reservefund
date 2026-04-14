'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { PageFooter } from '@/components/page-footer';
import { LeftPanel } from '@/components/left-panel';

type CompanyType = 'management' | 'bank' | 'reserve' | 'advisor' | 'board' | 'other' | null;

export default function RegisterPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<CompanyType>('reserve');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const canContinue = !!selectedType && agreedToTerms && !submitting;

  const companyTypes = [
    { id: 'management', label: 'Management Company', icon: '/images/source/business.png' },
    { id: 'bank', label: 'Bank Office', icon: '/images/source/teller-female.png' },
    { id: 'reserve', label: 'Reserve Study Company', icon: '/images/source/inflation.png' },
    { id: 'advisor', label: 'Investor Advisor', icon: '/images/source/advisor.png' },
    { id: 'board', label: 'Board Members', icon: '/images/source/coworking.png' },
    { id: 'other', label: 'Other', icon: '/images/other.svg' },
  ];

  const handleContinue = async () => {
    if (!canContinue) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyType: selectedType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');
      router.push(`/auth/info?userId=${data.userId}&type=${selectedType}`);
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <LeftPanel />

      <div className="flex-1 min-w-0 flex justify-center items-center overflow-auto py-12 px-6 md:ml-[353px]">
        <div className="w-full flex flex-col my-auto" style={{ maxWidth: '643px' }}>
          <div className="bg-white" style={{ border: '1px solid #D7D7D7', borderRadius: '7px' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #D7D7D7' }}>
              <h1 className="font-semibold" style={{ color: '#102C4A', fontSize: '24px', lineHeight: '1.3' }}>
                Welcome Back, Lets Create your Company Profile
                <br />
                and Get Started Today.
              </h1>
            </div>

            <div style={{ padding: '32px' }}>
              <div className="grid grid-cols-3" style={{ gap: '20px' }}>
                {companyTypes.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id as CompanyType)}
                      className="group relative flex flex-col items-center justify-center transition-all duration-200"
                      style={{
                        border: `${isSelected ? '2px' : '1px'} solid ${isSelected ? '#0E519B' : '#D7D7D7'}`,
                        borderRadius: '7px',
                        padding: '24px 16px',
                        minHeight: '160px',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      {isSelected && (
                        <div
                          className="absolute flex items-center justify-center"
                          style={{ top: '10px', right: '10px', width: '22px', height: '22px', borderRadius: '9999px', backgroundColor: '#0E519B' }}
                        >
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                      <div className="mb-3 flex items-center justify-center" style={{ width: '64px', height: '64px' }}>
                        <Image src={type.icon} alt={type.label} width={64} height={64} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <span className="text-center" style={{ color: '#102C4A', fontWeight: 400, lineHeight: '1.3' }}>
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-2" style={{ marginTop: '32px' }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="cursor-pointer"
                  style={{ width: '16px', height: '16px', accentColor: '#0E519B' }}
                />
                <label htmlFor="terms" className="cursor-pointer" style={{ color: '#102C4A' }}>
                  I Agree with <Link href="/terms" style={{ color: 'inherit' }}>terms and condition</Link>
                </label>
              </div>

              {error && (
                <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>{error}</p>
              )}

              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: canContinue ? '#0E519B' : '#B5BCC4',
                  borderRadius: '7px',
                  padding: '14px',
                  fontSize: '16px',
                  marginTop: '20px',
                }}
              >
                {submitting ? 'Please wait…' : 'Continue'}
              </button>
            </div>

            <div className="text-center" style={{ padding: '20px', borderTop: '1px solid #D7D7D7' }}>
              <Link href="/login" style={{ color: 'inherit', fontWeight: 500 }}>
                I already have an account
              </Link>
            </div>
          </div>

          <PageFooter />
        </div>
      </div>
    </div>
  );
}

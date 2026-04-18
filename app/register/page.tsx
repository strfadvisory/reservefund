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
  const [showTerms, setShowTerms] = useState(false);
  const canContinue = !!selectedType && agreedToTerms && !submitting;

  const companyTypes = [
    { id: 'management', label: 'Management Company', icon: '/images/source/business.png' },
    { id: 'bank', label: 'Bank Office', icon: '/images/source/teller-female.png' },
    { id: 'reserve', label: 'Reserve Study Provider', icon: '/images/source/inflation.png' },
    { id: 'advisor', label: 'Investor Advisor', icon: '/images/source/advisor.png' },
    { id: 'board', label: 'Board Members', icon: '/images/source/coworking.png' },
    { id: 'other', label: 'Other', icon: '/images/other.svg' },
  ];

  const handleContinue = async () => {
    if (!canContinue || !selectedType) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyType: selectedType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start registration');
      router.push(`/info?type=${selectedType}&userId=${data.userId}`);
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
                  I Agree with{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowTerms(true);
                    }}
                    style={{
                      color: 'inherit',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      font: 'inherit',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    terms and condition
                  </button>
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
                {submitting ? 'Please wait...' : 'Continue'}
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

      {showTerms && (
        <div
          onClick={() => setShowTerms(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(16, 44, 74, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white"
            style={{
              border: '1px solid #D7D7D7',
              borderRadius: '7px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #D7D7D7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h2 className="font-semibold" style={{ color: '#102C4A', fontSize: '20px' }}>
                Terms of Use &amp; Disclaimers
              </h2>
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                aria-label="Close"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#66717D',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0 4px',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                padding: '24px',
                overflowY: 'auto',
                color: '#102C4A',
                fontSize: '16px',
                lineHeight: 1.6,
              }}
            >
              <p style={{ marginBottom: '20px' }}>
                By using reservefundadvisers.com, you agree to these terms. RFA is a privately
                owned limited liability company located in St. Petersburg, FL, with offices in
                Glenview, Il., RFA is a registered investment adviser in the State of Florida and
                the State of Illinois; we utilize FINRA&rsquo;s systems for regulatory filings.
              </p>
              <h3 className="font-semibold" style={{ fontSize: '16px', marginBottom: '6px' }}>
                No Solicitation
              </h3>
              <p style={{ marginBottom: '20px' }}>
                This website is for informational purposes and does not constitute an offer to sell
                or a solicitation to purchase any security.
              </p>
              <h3 className="font-semibold" style={{ fontSize: '16px', marginBottom: '6px' }}>
                No Advice
              </h3>
              <p style={{ marginBottom: '20px' }}>
                Information on this site is not intended as investment advice and should not be
                relied upon for investment decisions.
              </p>
              <h3 className="font-semibold" style={{ fontSize: '16px', marginBottom: '6px' }}>
                Liability
              </h3>
              <p>
                RFA provides this site &quot;as is&quot; and disclaims all warranties to the fullest
                extent allowed by law.
              </p>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #D7D7D7', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="font-semibold text-white transition-all duration-200 hover:opacity-95"
                style={{
                  backgroundColor: '#0E519B',
                  borderRadius: '7px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

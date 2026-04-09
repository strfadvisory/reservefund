'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

type CompanyType = 'management' | 'bank' | 'reserve' | 'advisor' | 'board' | 'other' | null;

export default function RegisterPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<CompanyType>('reserve');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const canContinue = !!selectedType && agreedToTerms;

  const companyTypes = [
    {
      id: 'management',
      label: 'Management Company',
      icon: '/images/source/business.png',
    },
    {
      id: 'bank',
      label: 'Bank Office',
      icon: '/images/source/teller-female.png',
    },
    {
      id: 'reserve',
      label: 'Reserve Study Company',
      icon: '/images/source/inflation.png',
    },
    {
      id: 'advisor',
      label: 'Investor Advisor',
      icon: '/images/source/advisor.png',
    },
    {
      id: 'board',
      label: 'Board Members',
      icon: '/images/source/coworking.png',
    },
    {
      id: 'other',
      label: 'Other',
      icon: '/images/other.svg',
    },
  ];

  const handleContinue = () => {
    if (!canContinue) return;
    router.push(`/info?type=${selectedType}`);
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
                Welcome Back, Lets Create your Company Profile
                <br />
                and Get Started Today.
              </h1>
            </div>

            {/* Company Type Selection */}
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
                        border: `${isSelected ? '2px' : '1px'} solid ${
                          isSelected ? '#0E519B' : '#D7D7D7'
                        }`,
                        borderRadius: '7px',
                        padding: '24px 16px',
                        minHeight: '160px',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      {/* Checkmark indicator (top-right, inside card) */}
                      {isSelected && (
                        <div
                          className="absolute flex items-center justify-center"
                          style={{
                            top: '10px',
                            right: '10px',
                            width: '22px',
                            height: '22px',
                            borderRadius: '9999px',
                            backgroundColor: '#0E519B',
                          }}
                        >
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </div>
                      )}

                      {/* Icon */}
                      <div
                        className="mb-3 flex items-center justify-center"
                        style={{ width: '64px', height: '64px' }}
                      >
                        <Image
                          src={type.icon}
                          alt={type.label}
                          width={64}
                          height={64}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </div>

                      {/* Label */}
                      <span
                        className="text-center"
                        style={{
                          color: '#102C4A', 
                          fontWeight: 400,
                          lineHeight: '1.3',
                        }}
                      >
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Checkbox */}
              <div
                className="flex items-center justify-center gap-2"
                style={{ marginTop: '32px' }}
              >
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="cursor-pointer"
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#0E519B',
                  }}
                />
                <label
                  htmlFor="terms"
                  className="cursor-pointer"
                  style={{ color: '#102C4A'  }}
                >
                  I Agree with{' '}
                  <Link
                    href="/terms"
                    style={{
                      color: '#0E519B',
                      textDecoration: 'underline',
                    }}
                  >
                    terms and condition
                  </Link>
                </label>
              </div>

              {/* Continue Button */}
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
                Continue
              </button>
            </div>

            {/* Already have account link */}
            <div
              className="text-center"
              style={{
                padding: '20px',
                borderTop: '1px solid #D7D7D7',
              }}
            >
              <Link
                href="/login"
                style={{ color: '#0E519B',  fontWeight: 500 }}
              >
                I already have an account
              </Link>
            </div>
          </div>

          {/* Footer (outside the card) */}
          <div style={{ marginTop: '32px' }}>
            <div className="flex justify-between items-start">
              <div
                className="flex flex-col gap-2"
                style={{ color: '#66717D',   }}
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
                style={{ color: '#66717D' }}
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

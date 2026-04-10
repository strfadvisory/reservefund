'use client';

import { Suspense, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Eye, EyeOff, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Label } from '@/components/ui/label';
import { PageFooter } from '@/components/page-footer';
import { LeftPanel } from '@/components/left-panel';

const COMPANY_TYPES: Record<string, { label: string; icon: string }> = {
  management: {
    label: 'Management Company',
    icon: '/images/source/business.png',
  },
  bank: {
    label: 'Bank Office',
    icon: '/images/source/teller-female.png',
  },
  reserve: {
    label: 'Reserve Study Company',
    icon: '/images/source/inflation.png',
  },
  advisor: {
    label: 'Investor Advisor',
    icon: '/images/source/advisor.png',
  },
  board: {
    label: 'Board Members',
    icon: '/images/source/coworking.png',
  },
  other: {
    label: 'Other',
    icon: '/images/other.svg',
  },
};

const PASSWORD_RULES: {
  id: string;
  label: string;
  test: (v: string) => boolean;
}[] = [
  { id: 'len', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  {
    id: 'upper',
    label: 'At least one uppercase letter (A-Z)',
    test: (v) => /[A-Z]/.test(v),
  },
  {
    id: 'lower',
    label: 'At least one lowercase letter (a-z)',
    test: (v) => /[a-z]/.test(v),
  },
  {
    id: 'num',
    label: 'At least one number (0-9)',
    test: (v) => /[0-9]/.test(v),
  },
  {
    id: 'special',
    label: 'At least one special character (!@#$%^&*)',
    test: (v) => /[!@#$%^&*]/.test(v),
  },
];

export default function InfoPage() {
  return (
    <Suspense fallback={null}>
      <InfoPageContent />
    </Suspense>
  );
}

function InfoPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeKey = searchParams.get('type') ?? 'reserve';
  const company = COMPANY_TYPES[typeKey] ?? COMPANY_TYPES.reserve;

  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const markTouched = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const passwordScore = useMemo(
    () => PASSWORD_RULES.filter((r) => r.test(password)).length,
    [password]
  );

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );

  const canContinue = useMemo(
    () =>
      companyName.trim() !== '' &&
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      designation.trim() !== '' &&
      phone.trim() !== '' &&
      emailValid &&
      passwordScore === 5 &&
      password === rePassword,
    [companyName, firstName, lastName, designation, phone, emailValid, passwordScore, password, rePassword]
  );

  const handleContinue = () => {
    if (!canContinue) return;
    router.push(`/otp?type=${typeKey}&email=${encodeURIComponent(email)}`);
  };

  const strengthLabel = useMemo(
    () =>
      passwordScore <= 1
        ? 'Weak'
        : passwordScore <= 2
        ? 'Fair'
        : passwordScore <= 3
        ? 'Good'
        : passwordScore <= 4
        ? 'Strong'
        : 'Excellent',
    [passwordScore]
  );

  const strengthColor = useMemo(
    () =>
      passwordScore <= 1
        ? '#DC2626'
        : passwordScore <= 2
        ? '#F59E0B'
        : passwordScore <= 3
        ? '#EAB308'
        : passwordScore <= 4
        ? '#22C55E'
        : '#16A34A',
    [passwordScore]
  );

  return (
    <div className="min-h-screen bg-white flex">
      <LeftPanel />

      {/* Main Content - fills remaining width */}
      <div className="flex-1 min-w-0 flex justify-center items-start overflow-auto py-12 px-6 md:ml-[353px]">
        <div className="w-full flex flex-col my-auto" style={{ maxWidth: '643px' }}>
          {/* Back to List */}
          <Link
            href="/register"
            className="flex items-center gap-1 mb-4"
            style={{
              color: '#0E519B',
              fontSize: '16px',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <ChevronLeft className="w-5 h-5" />
            Back to List
          </Link>

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
              className="flex items-center gap-4"
              style={{
                padding: '24px 32px',
                borderBottom: '1px solid #D7D7D7',
              }}
            >
              <div style={{ width: '56px', height: '56px', flexShrink: 0 }}>
                <Image
                  src={company.icon}
                  alt={company.label}
                  width={56}
                  height={56}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <h1
                className="font-semibold"
                style={{ color: '#102C4A', fontSize: '24px', lineHeight: '1.3' }}
              >
                Build Your {company.label} Profile
                <br />
                and Get Started Today.
              </h1>
            </div>

            {/* Company Name */}
            <div
              style={{
                padding: '24px 32px',
                borderBottom: '1px solid #D7D7D7',
              }}
            >
              <Label
                htmlFor="companyName"
                style={{
                  color: '#102C4A',
                  fontSize: '16px',
                  fontWeight: 400,
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Enter your Company name <span style={{ color: '#102C4A' }}>*</span>
              </Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onBlur={() => markTouched('companyName')}
                className="h-11"
                style={{
                  borderRadius: '7px',
                  fontSize: '16px',
                  borderColor: touched.companyName && !companyName.trim() ? '#DC2626' : undefined,
                }}
              />
              {touched.companyName && !companyName.trim() && (
                <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
              )}
            </div>

            {/* Your Information heading */}
            <div
              style={{
                padding: '24px 32px 16px',
              }}
            >
              <h2
                className="font-semibold"
                style={{ color: '#102C4A', fontSize: '20px', marginBottom: '4px' }}
              >
                Your Information
              </h2>
              <p style={{ color: '#66717D', fontSize: '16px' }}>
                Add your professional information to keep it saved for future use.
              </p>
            </div>

            {/* Your Information fields */}
            <div
              style={{
                padding: '0 32px 24px',
                borderBottom: '1px solid #D7D7D7',
              }}
            >
              <div className="grid grid-cols-2" style={{ gap: '20px' }}>
                <div>
                  <Label
                    htmlFor="firstName"
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    First Name <span>*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={() => markTouched('firstName')}
                    className="h-11"
                    style={{ borderColor: touched.firstName && !firstName.trim() ? '#DC2626' : '#D7D7D7', borderRadius: '7px', fontSize: '16px' }}
                  />
                  {touched.firstName && !firstName.trim() && (
                    <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="lastName"
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Last Name <span>*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onBlur={() => markTouched('lastName')}
                    className="h-11"
                    style={{ borderColor: touched.lastName && !lastName.trim() ? '#DC2626' : '#D7D7D7', borderRadius: '7px', fontSize: '16px' }}
                  />
                  {touched.lastName && !lastName.trim() && (
                    <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="designation"
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Designation / Role <span>*</span>
                  </Label>
                  <Input
                    id="designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    onBlur={() => markTouched('designation')}
                    className="h-11"
                    style={{ borderColor: touched.designation && !designation.trim() ? '#DC2626' : '#D7D7D7', borderRadius: '7px', fontSize: '16px' }}
                  />
                  {touched.designation && !designation.trim() && (
                    <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Phone number with Country Code <span>*</span>
                  </Label>
                  <div onBlur={() => markTouched('phone')}>
                    <PhoneInput
                      id="phone"
                      value={phone}
                      onChange={setPhone}
                    />
                  </div>
                  {touched.phone && !phone.trim() && (
                    <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                  )}
                </div>
              </div>
            </div>

            {/* Login Details heading */}
            <div style={{ padding: '24px 32px 16px' }}>
              <h2
                className="font-semibold"
                style={{ color: '#102C4A', fontSize: '20px', marginBottom: '4px' }}
              >
                Login Details
              </h2>
              <p style={{ color: '#66717D', fontSize: '16px' }}>
                Create your admin login so you can sign in easily next time using these details.
              </p>
            </div>

            {/* Login Details fields */}
            <div
              style={{
                padding: '0 32px 24px',
                borderBottom: '1px solid #D7D7D7',
              }}
            >
              {/* Email */}
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
                  Email Address <span>*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => markTouched('email')}
                  className="h-11"
                  style={{   borderRadius: '7px', fontSize: '16px' }}
                />
                {touched.email && !email.trim() && (
                  <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                )}
                {touched.email && email.trim() && !emailValid && (
                  <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>Please enter a valid email address</p>
                )}
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2" style={{ gap: '20px' }}>
                <div>
                  <Label
                    htmlFor="password"
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Password <span>*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => markTouched('password')}
                      className="h-11 pr-10"
                      style={{
                        borderColor: touched.password && !password.trim() ? '#DC2626' : '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{ right: '12px', color: '#66717D' }}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {touched.password && !password.trim() && (
                    <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="rePassword"
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Re-password <span>*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="rePassword"
                      type={showRePassword ? 'text' : 'password'}
                      value={rePassword}
                      onChange={(e) => setRePassword(e.target.value)}
                      onBlur={() => markTouched('rePassword')}
                      className="h-11 pr-10"
                      style={{
                        borderColor: touched.rePassword && !rePassword.trim() ? '#DC2626' : '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRePassword((s) => !s)}
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{ right: '12px', color: '#66717D' }}
                    >
                      {showRePassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {touched.rePassword && !rePassword.trim() && (
                    <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                  )}
                  {touched.rePassword && rePassword.trim() && password !== rePassword && (
                    <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>Passwords do not match</p>
                  )}
                </div>
              </div>

              {/* Password Strength */}
              <div style={{ marginTop: '24px' }}>
                <div
                  className="flex items-center justify-between flex-nowrap"
                  style={{ paddingBottom: '8px', whiteSpace: 'nowrap', borderBottom: `2px solid ${strengthColor}` }}
                >
                  <span
                    className="font-semibold"
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      paddingBottom: '6px',
                    }}
                  >
                    Password Strength
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: strengthColor, fontSize: '16px', paddingBottom: '6px' }}
                  >
                    {strengthLabel} ({passwordScore}/5)
                  </span>
                </div>
                <div
                  style={{
                    borderTop: '1px solid #D7D7D7',
                    paddingTop: '12px',
                    marginTop: '0',
                  }}
                >
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between"
                        style={{
                          fontSize: '16px',
                          color: passed ? '#16A34A' : '#102C4A',
                          padding: '3px 0',
                        }}
                      >
                        <span>{rule.label}</span>
                        {passed && (
                          <Check
                            className="w-4 h-4"
                            style={{ color: '#16A34A' }}
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
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
                  marginTop: '24px',
                }}
              >
                Continue
              </button>

              <p
                style={{
                  color: '#66717D',
                  fontSize: '14px',
                  marginTop: '12px',
                }}
              >
                Please note that fields marked with * are mandatory.
              </p>
            </div>
          </div>

          <PageFooter />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Briefcase,
  TrendingUp,
  User2,
  Users,
  MoreHorizontal,
  CheckCircle2,
  Check,
} from 'lucide-react';

type CompanyType = 'management' | 'bank' | 'reserve' | 'advisor' | 'board' | 'other' | null;

export default function RegisterPage() {
  const [selectedType, setSelectedType] = useState<CompanyType>('reserve');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const companyTypes = [
    {
      id: 'management',
      label: 'Management Company',
      icon: Building2,
    },
    {
      id: 'bank',
      label: 'Bank Office',
      icon: Briefcase,
    },
    {
      id: 'reserve',
      label: 'Reserve Study Company',
      icon: TrendingUp,
    },
    {
      id: 'advisor',
      label: 'Investor Advisor',
      icon: User2,
    },
    {
      id: 'board',
      label: 'Board Members',
      icon: Users,
    },
    {
      id: 'other',
      label: 'Other',
      icon: MoreHorizontal,
    },
  ];

  const handleContinue = () => {
    if (!selectedType || !agreedToTerms) {
      alert('Please select a company type and agree to terms');
      return;
    }
    // Handle continue logic
    console.log('Selected:', selectedType);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-blue-900 to-blue-800 flex flex-col items-center justify-start pt-12 px-6">
        <div className="text-white">
          <div className="text-3xl font-bold mb-1">RESERVE FUND</div>
          <div className="text-sm font-light tracking-widest">ADVISERS LLC</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-16 py-12 overflow-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold" style={{ color: '#102C4A' }}>
            Welcome Back, Lets Create your Company Profile<br />
            and Get Started Today.
          </h1>
        </div>

        {/* Company Type Selection */}
        <div className="mb-12 flex-1">
          <div className="grid grid-cols-3 gap-6">
            {companyTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as CompanyType)}
                  className={`group relative p-8 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center min-h-40 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                  style={{
                    borderColor: isSelected ? '#0E519B' : '#B5BCC4',
                    borderRadius: '7px',
                  }}
                >
                  {/* Checkmark indicator */}
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 bg-blue-600 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Icon */}
                  <Icon
                    className="w-12 h-12 mb-4"
                    style={{ color: isSelected ? '#0E519B' : '#102C4A' }}
                    strokeWidth={1.5}
                  />

                  {/* Label */}
                  <span
                    className="text-center text-sm font-medium"
                    style={{ color: '#102C4A' }}
                  >
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Checkbox and Button Container */}
        <div className="space-y-6">
          {/* Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
              style={{ accentColor: '#0E519B' }}
            />
            <label htmlFor="terms" className="flex items-center gap-2 cursor-pointer">
              <span style={{ color: '#102C4A' }} className="text-sm">
                I Agree with
              </span>
              <Link
                href="/terms"
                className="text-sm font-medium"
                style={{ color: '#0E519B' }}
              >
                terms and condition
              </Link>
            </label>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full py-3 rounded-lg font-semibold text-white text-lg transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: '#0E519B',
              borderRadius: '7px',
            }}
          >
            Continue
          </button>

          {/* Already have account link */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-medium"
              style={{ color: '#0E519B' }}
            >
              I already have an account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t" style={{ borderColor: '#B5BCC4' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8 text-sm" style={{ color: '#66717D' }}>
              <a href="mailto:info@reservefundadvisory.com" className="flex items-center gap-2 hover:opacity-80">
                @ info@reservefundadvisory.com
              </a>
              <a href="tel:727-788-4800" className="flex items-center gap-2 hover:opacity-80">
                ☎ 727-788-4800
              </a>
            </div>
            <a href="/privacy" className="text-sm" style={{ color: '#66717D' }}>
              Privacy Policy
            </a>
          </div>
          <div className="text-center text-xs mt-6" style={{ color: '#66717D' }}>
            Copyright 2026 @ reservefundadvisory.com
          </div>
        </div>
      </div>
    </div>
  );
}

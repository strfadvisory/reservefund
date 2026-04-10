'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageFooter } from '@/components/page-footer';
import { LeftPanel } from '@/components/left-panel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const US_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

export default function ProfilePage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const markTouched = (field: string) => setTouched((t) => ({ ...t, [field]: true }));
  const [brandingOpen, setBrandingOpen] = useState(false);
  const [branding, setBranding] = useState<'default' | 'customs'>('customs');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!brandingOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [brandingOpen]);

  const canConfirm =
    companyName.trim() !== '' &&
    zipCode.trim() !== '' &&
    state.trim() !== '' &&
    city.trim() !== '' &&
    address1.trim() !== '';

  const handleConfirm = () => {
    if (!canConfirm) return;
    setBrandingOpen(true);
  };

  const handleBrandingContinue = () => {
    setBrandingOpen(false);
    router.push('/dashboard');
  };

  const handleBrandingSkip = () => {
    setBrandingOpen(false);
    router.push('/dashboard');
  };

  const handleSkip = () => {
    router.push('/');
  };

  const handleLogout = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-white flex">
      <LeftPanel />

      {/* Main Content - fills remaining width */}
      <div className="flex-1 min-w-0 flex flex-col overflow-auto relative md:ml-[353px]">
        {/* Top-right user/logout */}
        <div
          className="absolute flex flex-col items-center"
          style={{ top: '24px', right: '32px', gap: '2px' }}
        >
          <UserCircle2
            className="w-8 h-8"
            style={{ color: '#66717D' }}
            strokeWidth={1.5}
          />
          <button
            type="button"
            onClick={handleLogout}
            style={{
              color: '#102C4A',
              fontSize: '14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>

        <div className="flex-1 flex justify-center items-center py-12 px-6">
          <div
            className="w-full flex flex-col my-auto"
            style={{ maxWidth: '643px' }}
          >
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
                  style={{
                    color: '#102C4A',
                    fontSize: '24px',
                    lineHeight: '1.3',
                  }}
                >
                  Complete your Company Profile
                </h1>
              </div>

              {/* Company Name + Website + LinkedIn */}
              <div
                style={{
                  padding: '24px 32px',
                  borderBottom: '1px solid #D7D7D7',
                }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <Label
                    htmlFor="companyName"
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Enter your Company name <span>*</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    onBlur={() => markTouched('companyName')}
                    className="h-11"
                    style={{
                      borderColor: touched.companyName && !companyName.trim() ? '#DC2626' : '#0E519B',
                      borderRadius: '7px',
                      fontSize: '16px',
                    }}
                  />
                  {touched.companyName && !companyName.trim() && (
                    <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                  )}
                </div>

                <div className="grid grid-cols-2" style={{ gap: '20px' }}>
                  <div>
                    <Label
                      htmlFor="website"
                      style={{
                        color: '#102C4A',
                        fontSize: '16px',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="h-11"
                      style={{
                        borderColor: '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="linkedin"
                      style={{
                        color: '#102C4A',
                        fontSize: '16px',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      LinkedIn Page
                    </Label>
                    <Input
                      id="linkedin"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="h-11"
                      style={{
                        borderColor: '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Company Address heading */}
              <div style={{ padding: '24px 32px 16px' }}>
                <h2
                  className="font-semibold"
                  style={{
                    color: '#102C4A',
                    fontSize: '20px',
                    marginBottom: '4px',
                  }}
                >
                  Company Address
                </h2>
                <p style={{ color: '#66717D', fontSize: '16px' }}>
                  Save your company address for future use.
                </p>
              </div>

              {/* Company Address fields */}
              <div style={{ padding: '0 32px 24px' }}>
                <div
                  className="grid grid-cols-2"
                  style={{ gap: '20px', marginBottom: '20px' }}
                >
                  <div>
                    <Label
                      htmlFor="zip"
                      style={{
                        color: '#102C4A',
                        fontSize: '16px',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Zip Code<span>*</span>
                    </Label>
                    <Input
                      id="zip"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      onBlur={() => markTouched('zipCode')}
                      className="h-11"
                      style={{
                        borderColor: touched.zipCode && !zipCode.trim() ? '#DC2626' : '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                    {touched.zipCode && !zipCode.trim() && (
                      <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="state"
                      style={{
                        color: '#102C4A',
                        fontSize: '16px',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      State<span>*</span>
                    </Label>
                    <Select value={state} onValueChange={setState} onOpenChange={(open) => { if (!open) markTouched('state'); }}>
                      <SelectTrigger
                        id="state"
                        className="w-full"
                        style={{
                          height: '44px',
                          borderColor: touched.state && !state.trim() ? '#DC2626' : '#D7D7D7',
                          borderRadius: '7px',
                          fontSize: '16px',
                          padding: '0 16px',
                        }}
                      >
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched.state && !state.trim() && (
                      <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <Label
                    htmlFor="city"
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    City<span>*</span>
                  </Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onBlur={() => markTouched('city')}
                    className="h-11"
                    style={{
                      borderColor: touched.city && !city.trim() ? '#DC2626' : '#D7D7D7',
                      borderRadius: '7px',
                      fontSize: '16px',
                    }}
                  />
                  {touched.city && !city.trim() && (
                    <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <Label
                    htmlFor="address1"
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Address I<span>*</span>
                  </Label>
                  <Textarea
                    id="address1"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    onBlur={() => markTouched('address1')}
                    rows={3}
                    style={{
                      borderColor: touched.address1 && !address1.trim() ? '#DC2626' : '#D7D7D7',
                      borderRadius: '7px',
                      fontSize: '16px',
                      resize: 'none',
                    }}
                  />
                  {touched.address1 && !address1.trim() && (
                    <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                  )}
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <Label
                    htmlFor="address2"
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Address II
                  </Label>
                  <Textarea
                    id="address2"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    rows={3}
                    style={{
                      borderColor: '#D7D7D7',
                      borderRadius: '7px',
                      fontSize: '16px',
                      resize: 'none',
                    }}
                  />
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: canConfirm ? '#0E519B' : '#B5BCC4',
                    borderRadius: '7px',
                    padding: '14px',
                    fontSize: '16px',
                  }}
                >
                  Confirm
                </button>
              </div>

              {/* Skip for now */}
              <div
                className="text-center"
                style={{
                  padding: '20px',
                  borderTop: '1px solid #D7D7D7',
                }}
              >
                <button
                  type="button"
                  onClick={handleSkip}
                  style={{
                    color: '#102C4A',
                    fontSize: '16px',
                    fontWeight: 500,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                > 
      &nbsp; 
                </button>
              </div>
            </div>

            <PageFooter />
          </div>
        </div>
      </div>

      {/* Customs Branding Modal */}
      {mounted && brandingOpen &&
        createPortal(
        <div
          className="flex items-center justify-center"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(16, 44, 74, 0.55)',
            backdropFilter: 'blur(2px)',
            zIndex: 1000,
            padding: '16px',
            overflowY: 'auto',
          }}
          onClick={() => setBrandingOpen(false)}
        >
          <div
            className="bg-white"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '643px',
              maxWidth: '100%',
              border: '1px solid #D7D7D7',
              borderRadius: '7px',
              boxShadow: '0 20px 60px rgba(16, 44, 74, 0.25)',
              margin: 'auto',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px 32px',
                borderBottom: '1px solid #D7D7D7',
              }}
            >
              <h2
                className="font-semibold"
                style={{
                  color: '#102C4A',
                  fontSize: '24px',
                  lineHeight: '1.3',
                }}
              >
                Customs Branding
              </h2>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 32px' }}>
              <p
                style={{
                  color: '#102C4A',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  marginBottom: '24px',
                }}
              >
                Invite people to collaborate, manage Association, Reserver
                studies, and review versions together.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                  gap: '20px',
                  marginBottom: '28px',
                }}
              >
                {/* Default Branding */}
                <button
                  type="button"
                  onClick={() => setBranding('default')}
                  className="text-left"
                  style={{
                    flex: '1 1 0',
                    minWidth: 0,
                    background: '#F4F7FB',
                    border:
                      branding === 'default'
                        ? '2px solid #0E519B'
                        : '1px solid #D7D7D7',
                    borderRadius: '10px',
                    padding: '20px',
                    cursor: 'pointer',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="font-semibold"
                      style={{ color: '#102C4A', fontSize: '16px' }}
                    >
                      Default Branding
                    </span>
                    <span
                      className="flex items-center justify-center shrink-0"
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '9999px',
                        border:
                          branding === 'default'
                            ? '2px solid #0E519B'
                            : '2px solid #B5BCC4',
                        background: '#fff',
                      }}
                    >
                      {branding === 'default' && (
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '9999px',
                            background: '#0E519B',
                          }}
                        />
                      )}
                    </span>
                  </div>
                  {/* Preview card */}
                  <div
                    style={{
                      marginTop: '20px',
                      background: '#fff',
                      border: '1px solid #E3E8EF',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      height: '110px',
                    }}
                  >
                    <div
                      style={{ background: '#0E519B', height: '32px' }}
                    />
                  </div>
                </button>

                {/* Customs Branding */}
                <button
                  type="button"
                  onClick={() => setBranding('customs')}
                  className="text-left"
                  style={{
                    flex: '1 1 0',
                    minWidth: 0,
                    background: '#F4F7FB',
                    border:
                      branding === 'customs'
                        ? '2px solid #0E519B'
                        : '1px solid #D7D7D7',
                    borderRadius: '10px',
                    padding: '20px',
                    cursor: 'pointer',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="font-semibold"
                      style={{ color: '#102C4A', fontSize: '16px' }}
                    >
                      Customs Branding
                    </span>
                    <span
                      className="flex items-center justify-center shrink-0"
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '9999px',
                        border:
                          branding === 'customs'
                            ? '2px solid #0E519B'
                            : '2px solid #B5BCC4',
                        background: '#fff',
                      }}
                    >
                      {branding === 'customs' && (
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '9999px',
                            background: '#0E519B',
                          }}
                        />
                      )}
                    </span>
                  </div>
                  {/* Preview card */}
                  <div
                    style={{
                      marginTop: '20px',
                      background: '#fff',
                      border: '1px solid #E3E8EF',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      height: '110px',
                    }}
                  >
                    <div
                      style={{ background: '#F5A623', height: '32px' }}
                    />
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={handleBrandingContinue}
                className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95"
                style={{
                  backgroundColor: '#0E519B',
                  borderRadius: '7px',
                  padding: '14px',
                  fontSize: '16px',
                }}
              >
                Continue
              </button>

              <div className="text-center" style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={handleBrandingSkip}
                  style={{
                    color: '#102C4A',
                    fontSize: '16px',
                    fontWeight: 500,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        </div>,
          document.body
        )}
    </div>
  );
}

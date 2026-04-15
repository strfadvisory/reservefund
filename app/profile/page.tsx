'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageFooter } from '@/components/page-footer';
import { LeftPanel } from '@/components/left-panel';
import { UploadLogoModal } from '@/components/upload-logo-modal';
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
  const [logoOpen, setLogoOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [zipLookup, setZipLookup] = useState(false);
  const [zipError, setZipError] = useState('');

  useEffect(() => {
    const code = zipCode.trim();
    if (code.length < 3) {
      setZipError('');
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setZipLookup(true);
      setZipError('');
      try {
        const res = await fetch(
          `/api/geocode?q=${encodeURIComponent(code)}&countrycode=us`,
          { cache: 'no-store', signal: controller.signal },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Lookup failed');
        const r = data.result;
        if (!r) {
          setZipError('No match for this zip code');
          return;
        }
        if (r.city) setCity(r.city);
        if (r.state) setState(r.state);
        if (r.formatted) setAddress1(r.formatted);
      } catch (e: any) {
        if (e.name !== 'AbortError') setZipError(e.message || 'Lookup failed');
      } finally {
        setZipLookup(false);
      }
    }, 500);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [zipCode]);

  const canConfirm =
    companyName.trim() !== '' &&
    zipCode.trim() !== '' &&
    state.trim() !== '' &&
    city.trim() !== '' &&
    address1.trim() !== '' &&
    !saving;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          website,
          linkedin,
          zipCode,
          state,
          city,
          address1,
          address2,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save profile');
      setLogoOpen(true);
    } catch (e: any) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoApply = async ({ file }: { file: File; size: number }) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/profile/logo', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
    } catch (e) {
      console.error('Logo upload failed', e);
    } finally {
      setLogoOpen(false);
      router.push('/dashboard');
    }
  };

  const handleLogoClose = () => {
    setLogoOpen(false);
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
                    {zipLookup && (
                      <p style={{ color: '#66717D', fontSize: '14px', marginTop: '4px' }}>Looking up address…</p>
                    )}
                    {!zipLookup && zipError && (
                      <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>{zipError}</p>
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

                {saveError && (
                  <p style={{ color: '#DC2626', fontSize: '14px', marginBottom: '12px' }}>{saveError}</p>
                )}

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
                  {saving ? 'Saving...' : 'Confirm'}
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

      <UploadLogoModal
        open={logoOpen}
        onClose={handleLogoClose}
        onApply={handleLogoApply}
      />
    </div>
  );
}

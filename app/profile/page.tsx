'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PhoneInput } from '@/components/ui/phone-input';
import { PageFooter } from '@/components/page-footer';
import { LeftPanel } from '@/components/left-panel';
import { UploadLogoModal, type UploadLogoResult } from '@/components/upload-logo-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

const COMPANY_TYPE_LABELS: Record<string, string> = {
  management: 'Management Company',
  bank: 'Bank Office',
  reserve: 'Reserve Study Provider',
  advisor: 'Investor Advisor',
  board: 'Board Members',
  other: 'Other',
};

export default function ProfilePage() {
  const router = useRouter();
  const [companyType, setCompanyType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const markTouched = (field: string) => setTouched((t) => ({ ...t, [field]: true }));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [zipLookup, setZipLookup] = useState(false);
  const [zipError, setZipError] = useState('');
  const [logoModalOpen, setLogoModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
        const data = await res.json();
        if (data?.user) {
          setCompanyType(data.user.companyType || '');
          setCompanyName(data.user.companyName || '');
          setCellPhone(data.user.phone || '');
          setTelephone(data.user.telephone || '');
          setZipCode(data.user.zipCode || '');
          setState(data.user.state || '');
          setCity(data.user.city || '');
          setAddress1(data.user.address1 || '');
          setAddress2(data.user.address2 || '');
        }
      } catch {
        // silently fall back to empty
      }
    })();
  }, []);

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
    telephone.trim() !== '' &&
    cellPhone.trim() !== '' &&
    zipCode.trim() !== '' &&
    state.trim() !== '' &&
    city.trim() !== '' &&
    address1.trim() !== '' &&
    !saving;

  const handleConfirm = async () => {
    setTouched({
      telephone: true,
      cellPhone: true,
      zipCode: true,
      state: true,
      city: true,
      address1: true,
    });
    if (!canConfirm) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          telephone,
          cellPhone,
          zipCode,
          state,
          city,
          address1,
          address2,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save profile');
      setLogoModalOpen(true);
    } catch (e: any) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoApply = async ({ file }: UploadLogoResult) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      await fetch('/api/profile/logo', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
    } catch {
      // swallow — navigate regardless
    }
    setLogoModalOpen(false);
    router.push('/dashboard');
  };

  const handleLogoSkip = () => {
    setLogoModalOpen(false);
    router.push('/dashboard');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    router.push('/login');
  };

  const typeLabel = COMPANY_TYPE_LABELS[companyType] || 'Reserve Study Provider';
  const displayName = companyName || 'ADJ Associations';

  const labelStyle: React.CSSProperties = {
    color: '#102C4A',
    fontSize: '14px',
    marginBottom: '6px',
    display: 'block',
    fontWeight: 400,
  };

  const inputStyle = (invalid: boolean): React.CSSProperties => ({
    borderColor: invalid ? '#DC2626' : '#D7D7D7',
    borderRadius: '7px',
    fontSize: '14px',
    color: '#102C4A',
    height: '44px',
    background: '#fff',
  });

  return (
    <div className="min-h-screen bg-white flex">
      <LeftPanel />

      <div className="flex-1 min-w-0 flex flex-col overflow-auto relative md:ml-[353px]">
        {/* Top-right user/logout */}
        <div
          className="absolute flex flex-col items-center"
          style={{ top: '20px', right: '28px', zIndex: 5 }}
        >
          <UserCircle2 className="w-6 h-6" style={{ color: '#66717D' }} strokeWidth={1.5} />
          <button
            type="button"
            onClick={handleLogout}
            style={{
              color: '#66717D',
              fontSize: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1,
              marginTop: '2px',
            }}
          >
            Logout
          </button>
        </div>

        <div className="flex-1 flex justify-center items-start px-6" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
          <div className="w-full flex flex-col" style={{ maxWidth: '643px' }}>
            {/* Form Card (banner is the first section) */}
            <div
              className="bg-white"
              style={{ border: '1px solid #D7D7D7', borderRadius: '7px' }}
            >
              {/* Verification banner (top section of card) */}
              <div
                className="flex items-center"
                style={{
                  padding: '14px 24px',
                  gap: '8px',
                  borderBottom: '1px solid #D7D7D7',
                }}
              >
                <Image
                  src="/images/tick.png"
                  alt=""
                  width={18}
                  height={18}
                  style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                />
                <span style={{ color: '#16A34A', fontSize: '14px', fontWeight: 500 }}>
                  Thank you for verification.
                </span>
              </div>

              {/* Title */}
              <h1
                className="font-semibold"
                style={{
                  color: '#102C4A',
                  fontSize: '15px',
                  lineHeight: '1.45',
                  padding: '20px 24px 0',
                  margin: 0,
                }}
              >
                Please complete ({typeLabel}) company information for ({displayName}).
              </h1>

              <div style={{ padding: '20px 24px 24px' }}>

              {/* Telephone + Cell Phone */}
              <div className="grid grid-cols-2" style={{ gap: '16px', marginBottom: '16px' }}>
                <div>
                  <Label htmlFor="telephone" style={labelStyle}>
                    Telephone Number
                  </Label>
                  <PhoneInput
                    id="telephone"
                    value={telephone}
                    onChange={(v) => {
                      setTelephone(v);
                      markTouched('telephone');
                    }}
                  />
                  {touched.telephone && !telephone.trim() && (
                    <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
                      This field is required
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cellPhone" style={labelStyle}>
                    Cell Phone Number
                  </Label>
                  <PhoneInput
                    id="cellPhone"
                    value={cellPhone}
                    onChange={(v) => {
                      setCellPhone(v);
                      markTouched('cellPhone');
                    }}
                  />
                  {touched.cellPhone && !cellPhone.trim() && (
                    <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
                      This field is required
                    </p>
                  )}
                </div>
              </div>

              {/* Zip + State */}
              <div className="grid grid-cols-2" style={{ gap: '16px', marginBottom: '16px' }}>
                <div>
                  <Label htmlFor="zip" style={labelStyle}>
                    Zip Code*
                  </Label>
                  <Input
                    id="zip"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    onBlur={() => markTouched('zipCode')}
                    style={inputStyle(!!(touched.zipCode && !zipCode.trim()))}
                  />
                  {touched.zipCode && !zipCode.trim() && (
                    <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
                      This field is required
                    </p>
                  )}
                  {zipLookup && (
                    <p style={{ color: '#66717D', fontSize: '12px', marginTop: '4px' }}>
                      Looking up address…
                    </p>
                  )}
                  {!zipLookup && zipError && (
                    <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
                      {zipError}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state" style={labelStyle}>
                    State*
                  </Label>
                  <Select
                    value={state}
                    onValueChange={setState}
                    onOpenChange={(open) => {
                      if (!open) markTouched('state');
                    }}
                  >
                    <SelectTrigger
                      id="state"
                      className="w-full"
                      style={{
                        height: '44px',
                        borderColor:
                          touched.state && !state.trim() ? '#DC2626' : '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '14px',
                        padding: '0 12px',
                        color: '#102C4A',
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
                    <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
                      This field is required
                    </p>
                  )}
                </div>
              </div>

              {/* City */}
              <div style={{ marginBottom: '16px' }}>
                <Label htmlFor="city" style={labelStyle}>
                  City*
                </Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onBlur={() => markTouched('city')}
                  style={inputStyle(!!(touched.city && !city.trim()))}
                />
                {touched.city && !city.trim() && (
                  <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
                    This field is required
                  </p>
                )}
              </div>

              {/* Address I */}
              <div style={{ marginBottom: '16px' }}>
                <Label htmlFor="address1" style={labelStyle}>
                  Address I *
                </Label>
                <Textarea
                  id="address1"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  onBlur={() => markTouched('address1')}
                  rows={3}
                  style={{
                    borderColor:
                      touched.address1 && !address1.trim() ? '#DC2626' : '#D7D7D7',
                    borderRadius: '7px',
                    fontSize: '14px',
                    color: '#102C4A',
                    minHeight: '80px',
                    resize: 'vertical',
                    background: '#fff',
                  }}
                />
                {touched.address1 && !address1.trim() && (
                  <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
                    This field is required
                  </p>
                )}
              </div>

              {/* Address II */}
              <div style={{ marginBottom: '24px' }}>
                <Label htmlFor="address2" style={labelStyle}>
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
                    fontSize: '14px',
                    color: '#102C4A',
                    minHeight: '80px',
                    resize: 'vertical',
                    background: '#fff',
                  }}
                />
              </div>

              {saveError && (
                <p
                  style={{
                    color: '#DC2626',
                    fontSize: '12px',
                    marginBottom: '12px',
                    textAlign: 'center',
                  }}
                >
                  {saveError}
                </p>
              )}

              <button
                onClick={handleConfirm}
                disabled={saving}
                className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#0E519B',
                  borderRadius: '7px',
                  padding: '12px',
                  fontSize: '14px',
                  opacity: saving ? 0.75 : 1,
                }}
              >
                {saving ? 'Saving…' : 'Confirm'}
              </button>
              </div>
            </div>

            <PageFooter />
          </div>
        </div>
      </div>

      <UploadLogoModal
        open={logoModalOpen}
        onClose={handleLogoSkip}
        onApply={handleLogoApply}
      />
    </div>
  );
}

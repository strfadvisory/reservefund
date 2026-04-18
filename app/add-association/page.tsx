'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Check, Circle, MoreHorizontal, UploadCloud, UserPlus } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import {
  AssociationDetail,
  type AssociationDetailMember,
  type AssociationDetailStudy,
} from '@/components/association-detail';
import { UploadLogoModal } from '@/components/upload-logo-modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { DesignationInput } from '@/components/ui/designation-input';

const STEPS = [
  {
    title: 'Complete Association Profile',
    description:
      'Add key details about your association to set up your profile and ensure accurate reporting.',
  },
  {
    title: 'Upload Reserve Study Data',
    description:
      'Upload your reserve study data or use a template to get started quickly and accurately.',
  },
  {
    title: 'Invite Member of Association name',
    description:
      'Invite team members to collaborate by sending them access to your association account.',
  },
  {
    title: 'Publish',
    description:
      'Review your information and publish your association profile to make it live and accessible.',
  },
];

export default function AddAssociationPage() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [logoOpen, setLogoOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [associationName, setAssociationName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [associationEmail, setAssociationEmail] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [telephone, setTelephone] = useState('');
  const [zip, setZip] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [associationId, setAssociationId] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => setTouched((t) => ({ ...t, [field]: true }));
  const fieldErr = (field: string, value: string) =>
    touched[field] && !value.trim() ? 'This field is required' : '';

  type Study = { id: string; fileName: string; size: number; createdAt: string };
  type Member = { id: string; name: string; email: string; status: string };
  const [studies, setStudies] = useState<Study[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [memberOpen, setMemberOpen] = useState(false);
  const [mFirst, setMFirst] = useState('');
  const [mLast, setMLast] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [mDesignation, setMDesignation] = useState('');
  const [mModifyStudy, setMModifyStudy] = useState(true);
  const [mCreatePlans, setMCreatePlans] = useState(true);
  const [mViewPlans, setMViewPlans] = useState(true);
  const [mTouched, setMTouched] = useState<Record<string, boolean>>({});
  const [memberSubmitting, setMemberSubmitting] = useState(false);
  const [memberError, setMemberError] = useState('');
  const [memberMessage, setMemberMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!memberOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [memberOpen]);

  const markMTouched = (field: string) => setMTouched((t) => ({ ...t, [field]: true }));

  const resetMemberForm = () => {
    setMFirst('');
    setMLast('');
    setMEmail('');
    setMDesignation('');
    setMModifyStudy(true);
    setMCreatePlans(true);
    setMViewPlans(true);
    setMTouched({});
    setMemberError('');
    setMemberMessage('');
  };

  const closeMember = () => {
    setMemberOpen(false);
    resetMemberForm();
  };

  const refreshStudies = async () => {
    if (!associationId) return;
    try {
      const res = await fetch(`/api/reserve-studies?associationId=${associationId}`);
      const data = await res.json();
      if (Array.isArray(data?.studies)) setStudies(data.studies);
    } catch {}
  };

  const refreshMembers = async () => {
    if (!associationId) return;
    try {
      const res = await fetch(`/api/invite?associationId=${associationId}`);
      const data = await res.json();
      if (Array.isArray(data?.invites)) {
        setMembers(
          data.invites.map((i: any) => ({
            id: i.id,
            name: `${i.firstName} ${i.lastName}`.trim(),
            email: i.email,
            status: i.status === 'linked' || i.status === 'accepted' ? 'Active' : 'Pending',
          }))
        );
      }
    } catch {}
  };

  useEffect(() => {
    if (associationId) {
      refreshStudies();
      refreshMembers();
    }
  }, [associationId]);

  const onFileChosen = async (file: File) => {
    if (!associationId) return;
    setUploading(true);
    setUploadError('');
    try {
      const fd = new FormData();
      fd.append('associationId', associationId);
      fd.append('file', file);
      const res = await fetch('/api/reserve-studies', { method: 'POST', credentials: 'include', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      await refreshStudies();
    } catch (e: any) {
      setUploadError(e.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteStudy = async (id: string) => {
    await fetch(`/api/reserve-studies?id=${id}`, { method: 'DELETE', credentials: 'include' });
    refreshStudies();
  };

  const submitMember = async () => {
    setMTouched({ firstName: true, lastName: true, email: true, designation: true });
    if (!mFirst.trim() || !mLast.trim() || !mEmail.trim() || !mDesignation.trim()) {
      setMemberError('Please fill all required fields');
      return;
    }
    setMemberSubmitting(true);
    setMemberError('');
    setMemberMessage('');
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: mFirst,
          lastName: mLast,
          email: mEmail,
          associationId,
          designation: mDesignation,
          permissions: {
            modifyStudy: mModifyStudy,
            createPlans: mCreatePlans,
            viewPlans: mViewPlans,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMemberMessage(data.linked ? 'User already exists — added.' : 'Invitation sent.');
      await refreshMembers();
      setTimeout(() => {
        closeMember();
      }, 700);
    } catch (e: any) {
      setMemberError(e.message);
    } finally {
      setMemberSubmitting(false);
    }
  };

  const saveAssociation = async (published = false, skipValidation = false) => {
    if (!skipValidation) {
      const requiredFields = { associationName, firstName, lastName, zip, state, city };
      const hasEmpty = Object.values(requiredFields).some((v) => !v.trim());
      if (hasEmpty) {
        setTouched({ associationName: true, firstName: true, lastName: true, zip: true, state: true, city: true });
        return false;
      }
    }
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/associations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: associationId,
          associationName,
          managerFirstName: firstName,
          managerLastName: lastName,
          managerEmail,
          associationEmail,
          cellPhone,
          telephone,
          zipCode: zip,
          state,
          city,
          address1,
          address2,
          published,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      if (data.association?.id) setAssociationId(data.association.id);
      if (published) setIsPublished(true);
      return true;
    } catch (e: any) {
      setSaveError(e.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const goNext = async () => {
    const isLastStep = active === STEPS.length - 1;
    const ok = await saveAssociation(isLastStep, active > 0);
    if (!ok) return;
    if (isLastStep) {
      router.push('/associations');
      return;
    }
    if (active === 2) {
      await Promise.all([refreshStudies(), refreshMembers()]);
    }
    setActive(active + 1);
  };

  const goPrev = () => {
    if (active > 0) setActive(active - 1);
  };

  return (
    <div className="min-h-screen" style={{ background: '#F6F7F9', paddingTop: '64px' }}>
      <DashboardHeader role="Property Manager" />

      {/* Hero */}
      <div
        className="flex justify-center"
        style={{
          background: 'linear-gradient(270deg, #083464 0%, #0E519B 100%)',
          paddingTop: '24px',
          paddingBottom: '104px',
        }}
      >
        <div className="flex items-center" style={{ width: '100%', maxWidth: '1242px', padding: '0 24px', gap: '14px' }}>
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: 500,
              margin: 0,
            }}
          >
            Create Association
          </h1>
          {associationId && (
            <span
              style={{
                padding: '3px 12px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                background: isPublished ? '#D1FAE5' : '#FEF3C7',
                color: isPublished ? '#065F46' : '#92400E',
              }}
            >
              {isPublished ? 'Published' : 'Draft'}
            </span>
          )}
        </div>
      </div>

      {/* Card */}
      <div
        className="mx-auto"
        style={{
          maxWidth: '1242px',
          padding: '0 24px',
          marginTop: '-80px',
          paddingBottom: '48px',
        }}
      >
        <div
          className="bg-white"
          style={{
            border: '1px solid #D7D7D7',
            borderRadius: '10px',
            display: 'grid',
            gridTemplateColumns: '340px 1fr',
            overflow: 'hidden',
            minHeight: '820px',
          }}
        >
          {/* Left: stepper */}
          <aside
            style={{
              borderRight: '1px solid #D7D7D7',
              padding: '22px 22px 28px',
            }}
          >
            <div
              style={{
                color: '#102C4A',
                fontSize: '16px',
                fontWeight: 600,
                padding: '0 8px 16px',
                borderBottom: '1px solid #ECEEF1',
                marginBottom: '14px',
              }}
            >
              Follow this steps
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {STEPS.map((step, idx) => {
                const isActive = idx === active;
                const isDone = idx < active;
                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => (idx <= active ? setActive(idx) : undefined)}
                    style={{
                      textAlign: 'left',
                      padding: '14px 16px',
                      borderRadius: '7px',
                      border: isActive ? '1px solid #D7D7D7' : '1px solid transparent',
                      background: isActive ? '#F6F7F9' : 'transparent',
                      cursor: idx <= active ? 'pointer' : 'default',
                      position: 'relative',
                    }}
                  >
                    <div
                      className="flex items-start justify-between"
                      style={{ gap: '12px' }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            color: '#102C4A',
                            fontSize: '15px',
                            fontWeight: isActive || isDone ? 600 : 500,
                            marginBottom: '4px',
                            lineHeight: 1.35,
                          }}
                        >
                          {step.title}
                        </div>
                        <div
                          style={{
                            color: '#66717D',
                            fontSize: '13px',
                            lineHeight: 1.5,
                          }}
                        >
                          {step.description}
                        </div>
                      </div>
                      <div style={{ flexShrink: 0, paddingTop: '2px' }}>
                        {isDone ? (
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '9999px',
                              background: '#0E519B',
                            }}
                          >
                            <Check
                              className="w-3.5 h-3.5"
                              style={{ color: '#FFFFFF' }}
                              strokeWidth={3}
                            />
                          </div>
                        ) : isActive ? (
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '9999px',
                              border: '1.5px solid #0E519B',
                            }}
                          >
                            <Check
                              className="w-3 h-3"
                              style={{ color: '#0E519B' }}
                              strokeWidth={3}
                            />
                          </div>
                        ) : (
                          <Circle
                            className="w-[22px] h-[22px]"
                            style={{ color: '#B5BCC4' }}
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right: content */}
          <section>
            {/* Header bar */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '16px 28px',
                borderBottom: '1px solid #D7D7D7',
              }}
            >
              <h2
                style={{
                  color: '#102C4A',
                  fontSize: '18px',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {STEPS[active].title}
              </h2>
              <div className="flex items-center" style={{ gap: '12px' }}>
                {active === 0 && (
                  <button
                    type="button"
                    onClick={() => router.push('/associations')}
                    style={outlineHeaderBtn}
                  >
                    Cancel
                  </button>
                )}
                {active > 0 && active < STEPS.length - 1 && (
                  <button type="button" onClick={goNext} style={outlineHeaderBtn}>
                    Skip for now
                  </button>
                )}
                {active > 0 && (
                  <button type="button" onClick={goPrev} style={outlineHeaderBtn}>
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={goNext}
                  disabled={saving}
                  style={{
                    padding: '10px 22px',
                    background: saving ? '#B5BCC4' : '#0E519B',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '7px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving
                    ? 'Saving...'
                    : active === STEPS.length - 1
                    ? 'Publish Now'
                    : 'Save & Next'}
                </button>
              </div>
            </div>

            {/* Step content */}
            {active === 0 && (
              <div>
                {/* Profile block */}
                <div style={{ padding: '22px 28px 28px' }}>
                  <p
                    style={{
                      color: '#66717D',
                      fontSize: '14px',
                      margin: 0,
                      marginBottom: '20px',
                      lineHeight: 1.5,
                    }}
                  >
                    Add key details about your association to set up your profile and ensure accurate reporting.
                  </p>

                  <div style={{ marginBottom: '18px' }}>
                    <Label htmlFor="assocName" style={labelStyle}>
                      Enter Association name *
                    </Label>
                    <Input
                      id="assocName"
                      value={associationName}
                      onChange={(e) => setAssociationName(e.target.value)}
                      onBlur={() => markTouched('associationName')}
                      className="h-11"
                      style={{ ...inputStyle, borderColor: fieldErr('associationName', associationName) ? '#DC2626' : '#D7D7D7' }}
                    />
                    {fieldErr('associationName', associationName) && (
                      <p style={inlineErr}>{fieldErr('associationName', associationName)}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2" style={{ gap: '20px', marginBottom: '18px' }}>
                    <div>
                      <Label htmlFor="mgrFirst" style={labelStyle}>
                        Onsite Manager First Name *
                      </Label>
                      <Input
                        id="mgrFirst"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={() => markTouched('firstName')}
                        className="h-11"
                        style={{ ...inputStyle, borderColor: fieldErr('firstName', firstName) ? '#DC2626' : '#D7D7D7' }}
                      />
                      {fieldErr('firstName', firstName) && (
                        <p style={inlineErr}>{fieldErr('firstName', firstName)}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="mgrLast" style={labelStyle}>
                        Onsite Manager Last Name *
                      </Label>
                      <Input
                        id="mgrLast"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={() => markTouched('lastName')}
                        className="h-11"
                        style={{ ...inputStyle, borderColor: fieldErr('lastName', lastName) ? '#DC2626' : '#D7D7D7' }}
                      />
                      {fieldErr('lastName', lastName) && (
                        <p style={inlineErr}>{fieldErr('lastName', lastName)}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2" style={{ gap: '20px', marginBottom: '18px' }}>
                    <div>
                      <Label htmlFor="mgrEmail" style={labelStyle}>
                        Onsite Manager Email Address
                      </Label>
                      <Input
                        id="mgrEmail"
                        type="email"
                        value={managerEmail}
                        onChange={(e) => setManagerEmail(e.target.value)}
                        className="h-11"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <Label htmlFor="assocEmail" style={labelStyle}>
                        Association Email Address
                      </Label>
                      <Input
                        id="assocEmail"
                        type="email"
                        value={associationEmail}
                        onChange={(e) => setAssociationEmail(e.target.value)}
                        className="h-11"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2" style={{ gap: '20px' }}>
                    <div>
                      <Label style={labelStyle}>Cell Phone Number</Label>
                      <PhoneInput value={cellPhone} onChange={setCellPhone} id="cellPhone" />
                    </div>
                    <div>
                      <Label style={labelStyle}>Telephone Number</Label>
                      <PhoneInput value={telephone} onChange={setTelephone} id="telephone" />
                    </div>
                  </div>
                </div>

                {saveError && (
                  <div style={{ padding: '0 28px 4px' }}>
                    <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}>{saveError}</p>
                  </div>
                )}

                {/* Address block */}
                <div style={{ borderTop: '1px solid #D7D7D7', padding: '24px 28px 32px' }}>
                  <h3
                    style={{
                      color: '#102C4A',
                      fontSize: '18px',
                      fontWeight: 600,
                      margin: 0,
                      marginBottom: '6px',
                    }}
                  >
                    Association Address
                  </h3>
                  <p
                    style={{
                      color: '#66717D',
                      fontSize: '14px',
                      margin: 0,
                      marginBottom: '20px',
                      lineHeight: 1.5,
                    }}
                  >
                    Enter the official address of your association for accurate records and communication.
                  </p>

                  <div className="grid grid-cols-2" style={{ gap: '20px', marginBottom: '18px' }}>
                    <div>
                      <Label htmlFor="zip" style={labelStyle}>
                        Zip Code*
                      </Label>
                      <Input
                        id="zip"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        onBlur={() => markTouched('zip')}
                        className="h-11"
                        style={{ ...inputStyle, borderColor: fieldErr('zip', zip) ? '#DC2626' : '#D7D7D7' }}
                      />
                      {fieldErr('zip', zip) && <p style={inlineErr}>{fieldErr('zip', zip)}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state" style={labelStyle}>
                        State*
                      </Label>
                      <Input
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        onBlur={() => markTouched('state')}
                        className="h-11"
                        style={{ ...inputStyle, borderColor: fieldErr('state', state) ? '#DC2626' : '#D7D7D7' }}
                      />
                      {fieldErr('state', state) && <p style={inlineErr}>{fieldErr('state', state)}</p>}
                    </div>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <Label htmlFor="city" style={labelStyle}>
                      City*
                    </Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      onBlur={() => markTouched('city')}
                      className="h-11"
                      style={{ ...inputStyle, borderColor: fieldErr('city', city) ? '#DC2626' : '#D7D7D7' }}
                    />
                    {fieldErr('city', city) && <p style={inlineErr}>{fieldErr('city', city)}</p>}
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <Label htmlFor="addr1" style={labelStyle}>
                      Address 1
                    </Label>
                    <textarea
                      id="addr1"
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      rows={3}
                      style={textareaStyle}
                    />
                  </div>

                  <div>
                    <Label htmlFor="addr2" style={labelStyle}>
                      Address 2
                    </Label>
                    <textarea
                      id="addr2"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      rows={3}
                      style={textareaStyle}
                    />
                  </div>
                </div>
              </div>
            )}

            {active === 2 && (
              <div>
                {/* Description + Invite button */}
                <div
                  style={{
                    padding: '22px 28px 26px',
                    borderBottom: '1px solid #D7D7D7',
                  }}
                >
                  <p
                    style={{
                      color: '#66717D',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      margin: 0,
                      marginBottom: '20px',
                    }}
                  >
                    Invite them under this association. They will receive an email and need to activate their account or accept your invitation. Once accepted, they will be able to access the account.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (!associationId) {
                        setMemberError('Save the association profile first.');
                        setMemberOpen(true);
                        return;
                      }
                      setMemberOpen(true);
                    }}
                    className="flex items-center"
                    style={{
                      gap: '10px',
                      padding: '12px 22px',
                      border: '1px solid #D7D7D7',
                      background: '#FFFFFF',
                      borderRadius: '7px',
                      color: '#102C4A',
                      fontSize: '15px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    <UserPlus className="w-5 h-5" style={{ color: '#66717D' }} />
                    Invite Member
                  </button>
                </div>

                {/* Members list */}
                <div style={{ padding: '22px 28px 32px' }}>
                  <h3
                    style={{
                      color: '#102C4A',
                      fontSize: '18px',
                      fontWeight: 600,
                      margin: 0,
                      marginBottom: '18px',
                    }}
                  >
                    {members.length} Member{members.length === 1 ? '' : 's'} Found
                  </h3>
                  {members.length === 0 && (
                    <p style={{ color: '#66717D', fontSize: '14px' }}>No members yet. Invite people to collaborate.</p>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {members.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between"
                        style={{ padding: '14px 0', gap: '16px' }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ color: '#102C4A', fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>
                            {m.name}
                          </div>
                          <div style={{ color: '#66717D', fontSize: '14px', lineHeight: 1.5 }}>
                            {m.status} · {m.email}
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label="Member options"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#66717D',
                            padding: '6px',
                            flexShrink: 0,
                          }}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {active === 1 && (
              <div>
                <div
                  style={{
                    padding: '22px 28px 26px',
                    borderBottom: '1px solid #D7D7D7',
                  }}
                >
                  <p
                    style={{
                      color: '#66717D',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      margin: 0,
                      marginBottom: '20px',
                    }}
                  >
                    You can upload Reserve Study data in multiple ways—add your existing data or download the template and upload it for the study.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onFileChosen(f);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!associationId || uploading}
                    className="flex items-center"
                    style={{
                      gap: '10px',
                      padding: '12px 22px',
                      border: '1px solid #D7D7D7',
                      background: '#FFFFFF',
                      borderRadius: '7px',
                      color: '#102C4A',
                      fontSize: '15px',
                      fontWeight: 500,
                      cursor: !associationId || uploading ? 'not-allowed' : 'pointer',
                      opacity: !associationId ? 0.6 : 1,
                    }}
                  >
                    <UploadCloud className="w-5 h-5" style={{ color: '#66717D' }} />
                    {uploading ? 'Uploading…' : 'Upload Study'}
                  </button>
                  {!associationId && (
                    <p style={{ color: '#66717D', fontSize: '13px', marginTop: '8px' }}>
                      Save the association profile first to enable uploads.
                    </p>
                  )}
                  {uploadError && (
                    <p style={{ color: '#DC2626', fontSize: '13px', marginTop: '8px' }}>{uploadError}</p>
                  )}
                </div>

                <div style={{ padding: '22px 28px 32px' }}>
                  <h3
                    style={{
                      color: '#102C4A',
                      fontSize: '18px',
                      fontWeight: 600,
                      margin: 0,
                      marginBottom: '18px',
                    }}
                  >
                    {studies.length} Reserve Stud{studies.length === 1 ? 'y' : 'ies'} Found
                  </h3>
                  {studies.length === 0 && (
                    <p style={{ color: '#66717D', fontSize: '14px' }}>No reserve studies uploaded yet.</p>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {studies.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-start justify-between"
                        style={{ padding: '14px 0', gap: '16px' }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ color: '#102C4A', fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>
                            {s.fileName}
                          </div>
                          <div style={{ color: '#66717D', fontSize: '14px', lineHeight: 1.6 }}>
                            {(s.size / 1024).toFixed(1)} KB · Uploaded {new Date(s.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteStudy(s.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#DC2626',
                            padding: '6px',
                            flexShrink: 0,
                            fontSize: '14px',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {active === 3 && (
              <div style={{ padding: '22px 28px 32px' }}>
                <div className="flex items-center" style={{ marginBottom: '18px', gap: '12px' }}>
                  <h3 style={{ color: '#102C4A', fontSize: '16px', fontWeight: 600, margin: 0 }}>
                    Review &amp; Publish
                  </h3>
                  <span
                    style={{
                      padding: '3px 12px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: isPublished ? '#D1FAE5' : '#FEF3C7',
                      color: isPublished ? '#065F46' : '#92400E',
                    }}
                  >
                    {isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <AssociationDetail
                  name={associationName || 'Association'}
                  address={[address1, address2, city, state, zip, associationEmail, cellPhone || telephone]
                    .filter((v) => v && String(v).trim())
                    .join(', ')}
                  readOnly
                  logoUrl={logoUrl}
                  placeholderLogo={!logoUrl}
                  showBrandingBanner={!logoUrl}
                  invitedBy="Myself"
                  reserveStudyCount={studies.length}
                  members={members.map<AssociationDetailMember>((m) => ({
                    id: m.id,
                    name: m.name,
                    role: m.status,
                    phone: '',
                    email: m.email,
                  }))}
                  studies={studies.map<AssociationDetailStudy>((s) => ({
                    id: s.id,
                    name: s.fileName,
                    uploader: 'Myself',
                    lastModified: new Date(s.createdAt).toLocaleDateString(),
                    versions: '1 Founded',
                    status: 'Active',
                  }))}
                  onBrandingChoice={(c) => {
                    if (c === 'yes') setLogoOpen(true);
                  }}
                />
              </div>
            )}
          </section>
        </div>
      </div>

      <UploadLogoModal
        open={logoOpen}
        onClose={() => setLogoOpen(false)}
        onApply={async ({ file }) => {
          if (!associationId) return;
          setLogoUploading(true);
          try {
            const fd = new FormData();
            fd.append('associationId', associationId);
            fd.append('file', file);
            const res = await fetch('/api/associations/logo', { method: 'POST', credentials: 'include', body: fd });
            const data = await res.json();
            if (res.ok && data.association?.logoFileId) {
              setLogoUrl(`/api/logo/${data.association.logoFileId}`);
            }
          } finally {
            setLogoUploading(false);
          }
        }}
      />

      {mounted && memberOpen &&
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
            onClick={closeMember}
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
              <div style={{ padding: '24px 32px', borderBottom: '1px solid #D7D7D7' }}>
                <h2 className="font-semibold" style={{ color: '#102C4A', fontSize: '24px', lineHeight: 1.3 }}>
                  Invite Member
                </h2>
              </div>

              <div style={{ padding: '28px 32px 24px' }}>
                <div className="grid grid-cols-2" style={{ gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <Label htmlFor="amFirst" style={modalLabel}>First Name *</Label>
                    <Input
                      id="amFirst"
                      value={mFirst}
                      onChange={(e) => setMFirst(e.target.value)}
                      onBlur={() => markMTouched('firstName')}
                      className="h-11"
                      style={{
                        borderColor: mTouched.firstName && !mFirst.trim() ? '#DC2626' : '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                    {mTouched.firstName && !mFirst.trim() && (
                      <p style={memberErrStyle}>This field is required</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="amLast" style={modalLabel}>Last Name *</Label>
                    <Input
                      id="amLast"
                      value={mLast}
                      onChange={(e) => setMLast(e.target.value)}
                      onBlur={() => markMTouched('lastName')}
                      className="h-11"
                      style={{
                        borderColor: mTouched.lastName && !mLast.trim() ? '#DC2626' : '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                    {mTouched.lastName && !mLast.trim() && (
                      <p style={memberErrStyle}>This field is required</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <Label htmlFor="amEmail" style={modalLabel}>Email Address*</Label>
                    <Input
                      id="amEmail"
                      type="email"
                      value={mEmail}
                      onChange={(e) => setMEmail(e.target.value)}
                      onBlur={() => markMTouched('email')}
                      className="h-11"
                      style={{
                        borderColor: mTouched.email && !mEmail.trim() ? '#DC2626' : '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                    {mTouched.email && !mEmail.trim() && (
                      <p style={memberErrStyle}>This field is required</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="amDesignation" style={modalLabel}>Designation/Role *</Label>
                    <DesignationInput
                      id="amDesignation"
                      value={mDesignation}
                      onChange={setMDesignation}
                      onBlur={() => markMTouched('designation')}
                      invalid={mTouched.designation && !mDesignation.trim()}
                    />
                    {mTouched.designation && !mDesignation.trim() && (
                      <p style={memberErrStyle}>This field is required</p>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    border: '1px solid #D7D7D7',
                    borderRadius: '7px',
                    marginBottom: '20px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #D7D7D7' }}>
                    <h3 className="font-semibold" style={{ color: '#102C4A', fontSize: '16px' }}>
                      Choose Permission
                    </h3>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <PermissionRow label="Modify Study Data" checked={mModifyStudy} onChange={setMModifyStudy} />
                    <PermissionRow label="Create Plans and Versions" checked={mCreatePlans} onChange={setMCreatePlans} />
                    <PermissionRow label="View Plans and Versions" checked={mViewPlans} onChange={setMViewPlans} last />
                  </div>
                </div>

                {memberError && <p style={{ color: '#DC2626', fontSize: '14px', marginBottom: '10px' }}>{memberError}</p>}
                {memberMessage && <p style={{ color: '#10B981', fontSize: '14px', marginBottom: '10px' }}>{memberMessage}</p>}

                <button
                  type="button"
                  onClick={submitMember}
                  disabled={memberSubmitting || !associationId}
                  className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95"
                  style={{
                    backgroundColor: memberSubmitting || !associationId ? '#B5BCC4' : '#0E519B',
                    borderRadius: '7px',
                    padding: '14px',
                    fontSize: '16px',
                    border: 'none',
                    cursor: memberSubmitting || !associationId ? 'not-allowed' : 'pointer',
                    marginBottom: '12px',
                  }}
                >
                  {memberSubmitting ? 'Sending…' : 'Invite'}
                </button>

                <button
                  type="button"
                  onClick={closeMember}
                  className="w-full font-semibold transition-all duration-200 hover:bg-gray-50"
                  style={{
                    background: '#fff',
                    border: '1px solid #D7D7D7',
                    borderRadius: '7px',
                    padding: '14px',
                    fontSize: '16px',
                    color: '#102C4A',
                    cursor: 'pointer',
                  }}
                >
                  Not now
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function PermissionRow({
  label,
  checked,
  onChange,
  last,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ paddingTop: '12px', paddingBottom: last ? '0' : '12px' }}
    >
      <span style={{ color: '#102C4A', fontSize: '16px' }}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          position: 'relative',
          width: '44px',
          height: '24px',
          borderRadius: '9999px',
          background: checked ? '#0E519B' : '#D7D7D7',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '22px' : '2px',
            width: '20px',
            height: '20px',
            borderRadius: '9999px',
            background: '#fff',
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          }}
        />
      </button>
    </div>
  );
}

const modalLabel: React.CSSProperties = {
  color: '#102C4A',
  fontSize: '16px',
  marginBottom: '8px',
  display: 'block',
};

const memberErrStyle: React.CSSProperties = {
  color: '#DC2626',
  fontSize: '14px',
  marginTop: '4px',
};

const inlineErr: React.CSSProperties = {
  color: '#DC2626',
  fontSize: '13px',
  marginTop: '4px',
  marginBottom: 0,
};

const outlineHeaderBtn: React.CSSProperties = {
  padding: '10px 22px',
  border: '1px solid #D7D7D7',
  background: '#FFFFFF',
  borderRadius: '7px',
  color: '#102C4A',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
};

const labelStyle: React.CSSProperties = {
  color: '#102C4A',
  fontSize: '14px',
  marginBottom: '8px',
  display: 'block',
};

const inputStyle: React.CSSProperties = {
  borderColor: '#D7D7D7',
  borderRadius: '7px',
  fontSize: '15px',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '7px',
  border: '1px solid #D7D7D7',
  fontSize: '15px',
  color: '#102C4A',
  padding: '12px 14px',
  resize: 'none',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

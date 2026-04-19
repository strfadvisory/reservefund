'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { MoreHorizontal, UserPlus, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { PageFooter } from '@/components/page-footer';
import { LeftPanel } from '@/components/left-panel';
import { UploadReserveStudyModal } from '@/components/upload-reserve-study-modal';
import { useToast } from '@/components/toast-provider';

const FINAL_CONFIRM_TOAST = 'Association setup complete';

const STEPS = [
  { key: 'step1', label1: 'Complete', label2: 'Association Profile' },
  { key: 'step2', label1: 'Invite Member of', label2: 'Association name' },
  { key: 'step3', label1: 'Upload Reserve', label2: 'Study Data' },
];

const MEMBERS = [
  { name: 'Jordan Mical', role: 'Super Admin', email: 'Jordiankjdk@gmail.com' },
  { name: 'Mandra jonson', role: 'Members Management, Reserver Study data', email: 'Jordiankjdk@gmail.com' },
  { name: 'Mandra jonson', role: 'Members Management, Reserver Study data', email: 'Jordiankjdk@gmail.com' },
];

const STUDIES = [
  'Association Reserve Study',
  'Community Reserve Study',
  'Property Reserve Study',
  'HOA Reserve Study Report',
];

function StepperChevron() {
  return (
    <svg
      width="12"
      height="100%"
      viewBox="0 0 12 48"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        right: '-6px',
        top: 0,
        bottom: 0,
        height: '100%',
        zIndex: 2,
      }}
    >
      <polyline
        points="0,0 12,24 0,48"
        fill="none"
        stroke="#D7D7D7"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default function AssociationsPage() {
  const router = useRouter();
  const { notify } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [inviteFirstName, setInviteFirstName] = useState('');
  const [inviteLastName, setInviteLastName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const markTouched = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!inviteOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [inviteOpen]);

  const closeInvite = () => {
    setInviteOpen(false);
    setInviteFirstName('');
    setInviteLastName('');
    setInviteEmail('');
    setTouched({});
  };

  // Step 1 state
  const [associationName, setAssociationName] = useState('');
  const [managerFirstName, setManagerFirstName] = useState('');
  const [managerLastName, setManagerLastName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [associationEmail, setAssociationEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  const goNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      return;
    }
    notify(FINAL_CONFIRM_TOAST, 'success');
    router.push('/dashboard');
  };

  const skip = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex">
      <LeftPanel />

      <div className="flex-1 min-w-0 flex justify-center items-center overflow-auto py-12 px-6 md:ml-[353px]">
        <div className="w-full flex flex-col my-auto" style={{ maxWidth: '643px' }}>
          {/* Single Card: Stepper + Content */}
          <div
            className="bg-white"
            style={{
              border: '1px solid #D7D7D7',
              borderRadius: '7px',
              overflow: 'hidden',
            }}
          >
            {/* Stepper */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #D7D7D7',
              }}
            >
              {STEPS.map((step, idx) => {
                const isActive = idx === currentStep;
                const isCompleted = idx < currentStep;
                return (
                  <div
                    key={step.key}
                    style={{
                      flex: 1,
                      position: 'relative',
                      padding: '14px 20px',
                      cursor: isCompleted ? 'pointer' : 'default',
                    }}
                    onClick={() => isCompleted && setCurrentStep(idx)}
                  >
                    <span
                      style={{
                        color: isActive || isCompleted ? '#102C4A' : '#66717D',
                        fontSize: '13px',
                        fontWeight: isActive || isCompleted ? 600 : 400,
                        lineHeight: 1.4,
                        display: 'block',
                      }}
                    >
                      {step.label1}
                      <br />
                      {step.label2}
                    </span>
                    {idx < STEPS.length - 1 && <StepperChevron />}
                  </div>
                );
              })}
            </div>

            {/* ===== Step 1: Complete Association Profile ===== */}
            {currentStep === 0 && (
              <>
                {/* Title */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #D7D7D7' }}>
                  <h1
                    className="font-semibold"
                    style={{ color: '#102C4A', fontSize: '24px', lineHeight: 1.3, margin: 0 }}
                  >
                    Complete Association Profile
                  </h1>
                </div>

                {/* Form */}
                <div style={{ padding: '28px 32px 28px' }}>
                  {/* Association Name */}
                  <div style={{ marginBottom: '20px' }}>
                    <Label
                      htmlFor="assocName"
                      style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}
                    >
                      Enter Association name <span>*</span>
                    </Label>
                    <Input
                      id="assocName"
                      value={associationName}
                      onChange={(e) => setAssociationName(e.target.value)}
                      className="h-11"
                      style={{ borderColor: '#0E519B', borderRadius: '7px', fontSize: '16px' }}
                    />
                  </div>

                  {/* Manager Names */}
                  <div className="grid grid-cols-2" style={{ gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <Label
                        htmlFor="mgrFirst"
                        style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}
                      >
                        Onsite Manager First Name <span>*</span>
                      </Label>
                      <Input
                        id="mgrFirst"
                        value={managerFirstName}
                        onChange={(e) => setManagerFirstName(e.target.value)}
                        className="h-11"
                        style={{ borderColor: '#D7D7D7', borderRadius: '7px', fontSize: '16px' }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="mgrLast"
                        style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}
                      >
                        Onsite Manager Last Name <span>*</span>
                      </Label>
                      <Input
                        id="mgrLast"
                        value={managerLastName}
                        onChange={(e) => setManagerLastName(e.target.value)}
                        className="h-11"
                        style={{ borderColor: '#D7D7D7', borderRadius: '7px', fontSize: '16px' }}
                      />
                    </div>
                  </div>

                  {/* Emails */}
                  <div className="grid grid-cols-2" style={{ gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <Label
                        htmlFor="mgrEmail"
                        style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}
                      >
                        Onsite Manager Email Address
                      </Label>
                      <Input
                        id="mgrEmail"
                        type="email"
                        value={managerEmail}
                        onChange={(e) => setManagerEmail(e.target.value)}
                        className="h-11"
                        style={{ borderColor: '#D7D7D7', borderRadius: '7px', fontSize: '16px' }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="assocEmail"
                        style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}
                      >
                        Association Email Address
                      </Label>
                      <Input
                        id="assocEmail"
                        type="email"
                        value={associationEmail}
                        onChange={(e) => setAssociationEmail(e.target.value)}
                        className="h-11"
                        style={{ borderColor: '#D7D7D7', borderRadius: '7px', fontSize: '16px' }}
                      />
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="grid grid-cols-2" style={{ gap: '20px', marginBottom: '0' }}>
                    <div>
                      <Label style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                        Telephone Number
                      </Label>
                      <PhoneInput value={telephone} onChange={setTelephone} id="telephone" />
                    </div>
                    <div>
                      <Label style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                        Cell Phone Number
                      </Label>
                      <PhoneInput value={cellPhone} onChange={setCellPhone} id="cellPhone" />
                    </div>
                  </div>
                </div>

                {/* Association Address section divider */}
                <div style={{ borderTop: '1px solid #D7D7D7', padding: '28px 32px 28px' }}>
                  <h2
                    className="font-semibold"
                    style={{ color: '#102C4A', fontSize: '20px', marginBottom: '4px', margin: 0 }}
                  >
                    Association Address
                  </h2>
                  <p style={{ color: '#66717D', fontSize: '16px', marginTop: '6px', marginBottom: '28px' }}>
                    Save Association address for future use.
                  </p>

                  {/* Zip & State */}
                  <div className="grid grid-cols-2" style={{ gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <Label
                        htmlFor="zipCode"
                        style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}
                      >
                        Zip Code<span>*</span>
                      </Label>
                      <Input
                        id="zipCode"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="h-11"
                        style={{ borderColor: '#D7D7D7', borderRadius: '7px', fontSize: '16px' }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="state"
                        style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}
                      >
                        State<span>*</span>
                      </Label>
                      <Input
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="h-11"
                        style={{ borderColor: '#D7D7D7', borderRadius: '7px', fontSize: '16px' }}
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div style={{ marginBottom: '20px' }}>
                    <Label
                      htmlFor="city"
                      style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}
                    >
                      City<span>*</span>
                    </Label>
                    <div style={{ position: 'relative' }}>
                      <select
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{
                          width: '100%',
                          height: '44px',
                          borderRadius: '7px',
                          border: '1px solid #D7D7D7',
                          fontSize: '16px',
                          color: city ? '#102C4A' : '#9CA3AF',
                          padding: '0 40px 0 16px',
                          backgroundColor: '#fff',
                          cursor: 'pointer',
                          outline: 'none',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                        }}
                      >
                        <option value="" disabled></option>
                        <option value="new-york">New York</option>
                        <option value="los-angeles">Los Angeles</option>
                        <option value="chicago">Chicago</option>
                        <option value="miami">Miami</option>
                      </select>
                      <svg
                        width="14"
                        height="8"
                        viewBox="0 0 14 8"
                        fill="none"
                        style={{
                          position: 'absolute',
                          right: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                        }}
                      >
                        <path d="M1 1L7 7L13 1" stroke="#66717D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Address I */}
                  <div style={{ marginBottom: '20px' }}>
                    <Label
                      htmlFor="address1"
                      style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}
                    >
                      Address I<span>*</span>
                    </Label>
                    <textarea
                      id="address1"
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        borderRadius: '7px',
                        border: '1px solid #D7D7D7',
                        fontSize: '16px',
                        color: '#102C4A',
                        padding: '12px 16px',
                        resize: 'none',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Address II */}
                  <div style={{ marginBottom: '28px' }}>
                    <Label
                      htmlFor="address2"
                      style={{ color: '#102C4A', fontSize: '16px', marginBottom: '8px', display: 'block' }}
                    >
                      Address II
                    </Label>
                    <textarea
                      id="address2"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        borderRadius: '7px',
                        border: '1px solid #D7D7D7',
                        fontSize: '16px',
                        color: '#102C4A',
                        padding: '12px 16px',
                        resize: 'none',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Confirm */}
                  <button
                    type="button"
                    onClick={goNext}
                    className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95"
                    style={{
                      backgroundColor: '#0E519B',
                      borderRadius: '7px',
                      padding: '14px',
                      fontSize: '16px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Confirm
                  </button>
                </div>

                {/* Skip footer */}
                <div
                  className="text-center"
                  style={{
                    padding: '18px 32px',
                    borderTop: '1px solid #D7D7D7',
                  }}
                >
                  <button
                    type="button"
                    onClick={skip}
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
              </>
            )}

            {/* ===== Step 2: Invite Member of Association name ===== */}
            {currentStep === 1 && (
              <>
                {/* Title */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #D7D7D7' }}>
                  <h1
                    className="font-semibold"
                    style={{ color: '#102C4A', fontSize: '24px', lineHeight: 1.3, margin: 0 }}
                  >
                    Invite Member of Association name
                  </h1>
                </div>

                {/* Description + Invite Button */}
                <div
                  className="text-center"
                  style={{
                    padding: '28px 32px 28px',
                    borderBottom: '1px solid #D7D7D7',
                  }}
                >
                  <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>
                    Invite them under this association. They will receive an email and need to
                    activate their account or accept your invitation. Once accepted, they will be
                    able to access the account.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setInviteOpen(true)}
                      className="flex items-center justify-center"
                      style={{
                        marginTop: '24px',
                        padding: '12px 48px',
                        border: '1px solid #D7D7D7',
                        background: '#fff',
                        borderRadius: '7px',
                        color: '#102C4A',
                        fontSize: '16px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        gap: '10px',
                      }}
                    >
                      <UserPlus className="w-5 h-5" />
                      Invite Member
                    </button>
                  </div>
                </div>

                {/* Members list */}
                <div style={{ padding: '0 32px' }}>
                  {/* Members header */}
                  <div
                    style={{
                      padding: '20px 0 16px',
                      borderBottom: '1px solid #D7D7D7',
                    }}
                  >
                    <h3
                      className="font-semibold"
                      style={{ color: '#102C4A', fontSize: '16px', margin: 0 }}
                    >
                      5 Members Found
                    </h3>
                  </div>

                  {/* Member rows */}
                  <div
                    style={{
                      maxHeight: '260px',
                      overflowY: 'auto',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#D7D7D7 transparent',
                    }}
                  >
                    {MEMBERS.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                        style={{
                          padding: '18px 0',
                          borderBottom: idx < MEMBERS.length - 1 ? '1px solid #F1F2F4' : 'none',
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ color: '#102C4A', fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>
                            {member.name}
                          </div>
                          <div style={{ color: '#66717D', fontSize: '14px' }}>
                            {member.role} , {member.email}
                          </div>
                        </div>
                        <button
                          type="button"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#66717D',
                            padding: '4px',
                            flexShrink: 0,
                          }}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm */}
                <div style={{ padding: '24px 32px 28px' }}>
                  <button
                    type="button"
                    onClick={goNext}
                    className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95"
                    style={{
                      backgroundColor: '#0E519B',
                      borderRadius: '7px',
                      padding: '14px',
                      fontSize: '16px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Confirm
                  </button>
                </div>

                {/* Skip footer */}
                <div
                  className="text-center"
                  style={{
                    padding: '18px 32px',
                    borderTop: '1px solid #D7D7D7',
                  }}
                >
                  <button
                    type="button"
                    onClick={skip}
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
              </>
            )}

            {/* ===== Step 3: Upload Reserve Study Data ===== */}
            {currentStep === 2 && (
              <>
                {/* Title */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #D7D7D7' }}>
                  <h1
                    className="font-semibold"
                    style={{ color: '#102C4A', fontSize: '24px', lineHeight: 1.3, margin: 0 }}
                  >
                    Upload Reserve Study Data
                  </h1>
                </div>

                {/* Description + Upload Button */}
                <div
                  className="text-center"
                  style={{
                    padding: '28px 32px 28px',
                    borderBottom: '1px solid #D7D7D7',
                  }}
                >
                  <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>
                    You can upload Reserve Study data in multiple ways—add your existing data
                    <br />
                    or download the template and upload it for the study.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setUploadOpen(true)}
                      className="flex items-center justify-center"
                      style={{
                        marginTop: '24px',
                        padding: '12px 48px',
                        border: '1px solid #D7D7D7',
                        background: '#fff',
                        borderRadius: '7px',
                        color: '#102C4A',
                        fontSize: '16px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        gap: '10px',
                      }}
                    >
                      <Upload className="w-5 h-5" />
                      Upload
                    </button>
                  </div>
                </div>

                {/* Studies list */}
                <div style={{ padding: '0 32px' }}>
                  {/* Studies header */}
                  <div
                    style={{
                      padding: '20px 0 16px',
                      borderBottom: '1px solid #D7D7D7',
                    }}
                  >
                    <h3
                      className="font-semibold"
                      style={{ color: '#102C4A', fontSize: '16px', margin: 0 }}
                    >
                      5 Reserve Study Founded
                    </h3>
                  </div>

                  {/* Study rows */}
                  <div
                    style={{
                      maxHeight: '260px',
                      overflowY: 'auto',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#D7D7D7 transparent',
                    }}
                  >
                    {STUDIES.map((study, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                        style={{
                          padding: '18px 0',
                          borderBottom: idx < STUDIES.length - 1 ? '1px solid #F1F2F4' : 'none',
                        }}
                      >
                        <span style={{ color: '#102C4A', fontSize: '16px' }}>
                          {study}
                        </span>
                        <button
                          type="button"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#66717D',
                            padding: '4px',
                            flexShrink: 0,
                          }}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm */}
                <div style={{ padding: '24px 32px 28px' }}>
                  <button
                    type="button"
                    onClick={goNext}
                    className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95"
                    style={{
                      backgroundColor: '#0E519B',
                      borderRadius: '7px',
                      padding: '14px',
                      fontSize: '16px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Confirm
                  </button>
                </div>

                {/* Skip footer */}
                <div
                  className="text-center"
                  style={{
                    padding: '18px 32px',
                    borderTop: '1px solid #D7D7D7',
                  }}
                >
                  <button
                    type="button"
                    onClick={skip}
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
              </>
            )}
          </div>

          <PageFooter />
        </div>
      </div>

      {/* Upload Reserver Study Modal */}
      <UploadReserveStudyModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />

      {/* Invite Properties Manager Modal */}
      {mounted && inviteOpen &&
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
            onClick={closeInvite}
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
                    lineHeight: 1.3,
                  }}
                >
                  Invite Properties Manager
                </h2>
              </div>

              {/* Body */}
              <div style={{ padding: '28px 32px 8px' }}>
                <div
                  className="grid grid-cols-2"
                  style={{ gap: '20px', marginBottom: '20px' }}
                >
                  <div>
                    <Label
                      htmlFor="invFirstName"
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
                      id="invFirstName"
                      value={inviteFirstName}
                      onChange={(e) => setInviteFirstName(e.target.value)}
                      onBlur={() => markTouched('invFirstName')}
                      className="h-11"
                      style={{
                        borderColor: touched.invFirstName && !inviteFirstName.trim() ? '#DC2626' : '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                    {touched.invFirstName && !inviteFirstName.trim() && (
                      <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="invLastName"
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
                      id="invLastName"
                      value={inviteLastName}
                      onChange={(e) => setInviteLastName(e.target.value)}
                      onBlur={() => markTouched('invLastName')}
                      className="h-11"
                      style={{
                        borderColor: touched.invLastName && !inviteLastName.trim() ? '#DC2626' : '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                    {touched.invLastName && !inviteLastName.trim() && (
                      <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '40px' }}>
                  <Label
                    htmlFor="invEmailAddress"
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="invEmailAddress"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="h-11"
                    style={{
                      borderColor: '#0E519B',
                      borderRadius: '7px',
                      fontSize: '16px',
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={closeInvite}
                  className="w-full flex items-center justify-center font-semibold text-white transition-all duration-200 hover:opacity-95"
                  style={{
                    backgroundColor: '#0E519B',
                    borderRadius: '7px',
                    padding: '14px',
                    fontSize: '16px',
                    gap: '10px',
                  }}
                >
                  Invite Property Manager
                  <UserPlus className="w-5 h-5" />
                </button>

                <div className="text-center" style={{ padding: '18px 0 20px' }}>
                  <button
                    type="button"
                    onClick={closeInvite}
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

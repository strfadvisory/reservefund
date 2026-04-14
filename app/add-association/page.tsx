'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Circle, MoreHorizontal, UploadCloud, UserPlus } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { AssociationDetail } from '@/components/association-detail';
import { UploadLogoModal } from '@/components/upload-logo-modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';

const STEPS = [
  {
    title: 'Complete Association Profile',
    description:
      'Add key details about your association to set up your profile and ensure accurate reporting.',
  },
  {
    title: 'Invite Member of Association name',
    description:
      'Invite team members to collaborate by sending them access to your association account.',
  },
  {
    title: 'Upload Reserve Study Data',
    description:
      'Upload your reserve study data or use a template to get started quickly and accurately.',
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

  const goNext = () => {
    if (active < STEPS.length - 1) setActive(active + 1);
    else router.push('/associations');
  };

  const goPrev = () => {
    if (active > 0) setActive(active - 1);
  };

  const MEMBERS = [
    { name: 'Jordan Mical', role: 'Super Admin', email: 'Jordiankjdk@gmail.com' },
    {
      name: 'Mandra jonson',
      role: 'Members Management, Reserver Study data',
      email: 'Jordiankjdk@gmail.com',
    },
    {
      name: 'Mandra jonson',
      role: 'Members Management, Reserver Study data',
      email: 'Jordiankjdk@gmail.com',
    },
    {
      name: 'Mandra jonson',
      role: 'Members Management, Reserver Study data',
      email: 'Jordiankjdk@gmail.com',
    },
    {
      name: 'Mandra jonson',
      role: 'Members Management, Reserver Study data',
      email: 'Jordiankjdk@gmail.com',
    },
  ];

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
        <div style={{ width: '100%', maxWidth: '1242px', padding: '0 24px' }}>
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
                  style={{
                    padding: '10px 22px',
                    background: '#0E519B',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '7px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {active === STEPS.length - 1 ? 'Publish Now' : 'Save & Next'}
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
                    <Label
                      htmlFor="assocName"
                      style={labelStyle}
                    >
                      Enter Association name *
                    </Label>
                    <Input
                      id="assocName"
                      value={associationName}
                      onChange={(e) => setAssociationName(e.target.value)}
                      className="h-11"
                      style={inputStyle}
                    />
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
                        className="h-11"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mgrLast" style={labelStyle}>
                        Onsite Manager Last Name *
                      </Label>
                      <Input
                        id="mgrLast"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-11"
                        style={inputStyle}
                      />
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
                        className="h-11"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" style={labelStyle}>
                        State*
                      </Label>
                      <Input
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="h-11"
                        style={inputStyle}
                      />
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
                      className="h-11"
                      style={inputStyle}
                    />
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

            {active === 1 && (
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
                    {MEMBERS.length} Members Found
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {MEMBERS.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                        style={{
                          padding: '14px 0',
                          borderBottom:
                            idx === MEMBERS.length - 1
                              ? 'none'
                              : '1px solid transparent',
                          gap: '16px',
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              color: '#102C4A',
                              fontSize: '15px',
                              fontWeight: 500,
                              marginBottom: '4px',
                            }}
                          >
                            {m.name}
                          </div>
                          <div
                            style={{
                              color: '#66717D',
                              fontSize: '14px',
                              lineHeight: 1.5,
                            }}
                          >
                            {m.role} , {m.email}
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

            {active === 2 && (
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
                  <button
                    type="button"
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
                    <UploadCloud className="w-5 h-5" style={{ color: '#66717D' }} />
                    Upload Study
                  </button>
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
                    5 Reserve Study Founded
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between"
                        style={{ padding: '14px 0', gap: '16px' }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              color: '#102C4A',
                              fontSize: '15px',
                              fontWeight: 500,
                              marginBottom: '4px',
                            }}
                          >
                            Sample Reserve Study
                          </div>
                          <div
                            style={{
                              color: '#66717D',
                              fontSize: '14px',
                              lineHeight: 1.6,
                            }}
                          >
                            120 Units | $450K Reserve | $750K SIRS | 3.5% Inflation | $320/mo
                            <br />
                            FY 2025 | 30 Years | 2.8% ROI | $180K Reserve Budget | $520K Operating
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label="Study options"
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

            {active === 3 && (
              <div style={{ padding: '22px 28px 32px' }}>
                <AssociationDetail
                  name={associationName || 'American Bar Association'}
                  address="330 N Wabash Ave, Chicago, IL 60611, USA, +018483 28293, +018483 28293, info@BarAssociation.com"
                  readOnly
                  placeholderLogo
                  showBrandingBanner
                  onBrandingChoice={(c) => {
                    if (c === 'yes') setLogoOpen(true);
                  }}
                />
              </div>
            )}
          </section>
        </div>
      </div>

      <UploadLogoModal open={logoOpen} onClose={() => setLogoOpen(false)} />
    </div>
  );
}

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

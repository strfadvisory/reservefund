'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MEMBERS = [
  {
    name: 'Jordan Mical',
    subtitle: 'Super Admin , Jordiankjdk@gmail.com',
  },
  {
    name: 'Mandra jonson',
    subtitle: 'Members Management, Reserver Study data , Jordiankjdk@gmail.com',
  },
  {
    name: 'Mandra jonson',
    subtitle: 'Members Management, Reserver Study data , Jordiankjdk@gmail.com',
  },
];

export default function InviteMemberPage() {
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [modifyStudy, setModifyStudy] = useState(true);
  const [createPlans, setCreatePlans] = useState(true);
  const [viewPlans, setViewPlans] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!inviteOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [inviteOpen]);

  const closeInvite = () => {
    setInviteOpen(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setDesignation('');
  };

  const handleConfirm = () => {
    router.push('/dashboard');
  };

  const handleSkip = () => {
    router.push('/dashboard');
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

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-auto relative">
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
                    lineHeight: 1.3,
                  }}
                >
                  Invite Member of Association name
                </h1>
              </div>

              {/* Description + Invite button */}
              <div
                style={{
                  padding: '24px 32px 28px',
                  borderBottom: '1px solid #D7D7D7',
                }}
              >
                <p
                  className="text-center"
                  style={{
                    color: '#102C4A',
                    fontSize: '16px',
                    lineHeight: 1.5,
                    marginBottom: '20px',
                  }}
                >
                  Invite them under this association. They will receive an
                  email and need to activate their account or accept your
                  invitation. Once accepted, they will be able to access the
                  account.
                </p>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setInviteOpen(true)}
                    className="flex items-center"
                    style={{
                      gap: '10px',
                      padding: '12px 28px',
                      border: '1px solid #D7D7D7',
                      borderRadius: '7px',
                      background: '#fff',
                      color: '#102C4A',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <User className="w-5 h-5" style={{ color: '#102C4A' }} />
                    Invite Member
                  </button>
                </div>
              </div>

              {/* Members list */}
              <div style={{ padding: '24px 32px 8px' }}>
                <h2
                  className="font-semibold"
                  style={{
                    color: '#102C4A',
                    fontSize: '16px',
                    marginBottom: '20px',
                  }}
                >
                  5 Members Found
                </h2>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    maxHeight: '240px',
                    overflowY: 'auto',
                    paddingRight: '4px',
                  }}
                >
                  {MEMBERS.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between"
                      style={{ gap: '12px' }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            color: '#102C4A',
                            fontSize: '16px',
                            fontWeight: 500,
                            marginBottom: '4px',
                          }}
                        >
                          {m.name}
                        </div>
                        <div
                          style={{
                            color: '#66717D',
                            fontSize: '15px',
                            lineHeight: 1.4,
                          }}
                        >
                          {m.subtitle}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="flex items-center justify-center"
                        style={{
                          flexShrink: 0,
                          width: '28px',
                          height: '28px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#66717D',
                        }}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm */}
              <div
                style={{
                  padding: '24px 32px',
                  borderTop: '1px solid #D7D7D7',
                }}
              >
                <button
                  type="button"
                  onClick={handleConfirm}
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
                  Skip for now
                </button>
              </div>
            </div>

            {/* Footer (outside the card) */}
            <div style={{ marginTop: '32px' }}>
              <div className="flex justify-between items-start">
                <div
                  className="flex flex-col gap-2"
                  style={{ color: '#66717D', fontSize: '14px' }}
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
                  style={{ color: '#66717D', fontSize: '14px' }}
                >
                  <Link href="/privacy">Privacy Policy</Link>
                  <span>Copyright2026 @ reservefundadvisory.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
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
                  Invite Member
                </h2>
              </div>

              {/* Body */}
              <div style={{ padding: '28px 32px 24px' }}>
                {/* Name row */}
                <div
                  className="grid grid-cols-2"
                  style={{ gap: '20px', marginBottom: '20px' }}
                >
                  <div>
                    <Label
                      htmlFor="imFirstName"
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
                      id="imFirstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
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
                      htmlFor="imLastName"
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
                      id="imLastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11"
                      style={{
                        borderColor: '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                  </div>
                </div>

                {/* Email + Designation row */}
                <div
                  className="grid grid-cols-2"
                  style={{ gap: '20px', marginBottom: '24px' }}
                >
                  <div>
                    <Label
                      htmlFor="imEmail"
                      style={{
                        color: '#102C4A',
                        fontSize: '16px',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Email Address<span>*</span>
                    </Label>
                    <Input
                      id="imEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      htmlFor="imDesignation"
                      style={{
                        color: '#102C4A',
                        fontSize: '16px',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Designation/Role <span>*</span>
                    </Label>
                    <Input
                      id="imDesignation"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="h-11"
                      style={{
                        borderColor: '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                  </div>
                </div>

                {/* Choose Permission card */}
                <div
                  style={{
                    border: '1px solid #D7D7D7',
                    borderRadius: '7px',
                    marginBottom: '28px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #D7D7D7',
                    }}
                  >
                    <h3
                      className="font-semibold"
                      style={{ color: '#102C4A', fontSize: '16px' }}
                    >
                      Choose Permission
                    </h3>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <PermissionRow
                      label="Modify Study Data"
                      checked={modifyStudy}
                      onChange={setModifyStudy}
                    />
                    <PermissionRow
                      label="Create Plans and Versions"
                      checked={createPlans}
                      onChange={setCreatePlans}
                    />
                    <PermissionRow
                      label="View Plans and Versions"
                      checked={viewPlans}
                      onChange={setViewPlans}
                      last
                    />
                  </div>
                </div>

                {/* Invite button */}
                <button
                  type="button"
                  onClick={closeInvite}
                  className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95"
                  style={{
                    backgroundColor: '#0E519B',
                    borderRadius: '7px',
                    padding: '14px',
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: '12px',
                  }}
                >
                  Invite
                </button>

                {/* Not now button */}
                <button
                  type="button"
                  onClick={closeInvite}
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
      style={{
        paddingTop: last ? '12px' : '12px',
        paddingBottom: last ? '0' : '12px',
      }}
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

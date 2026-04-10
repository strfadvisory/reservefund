'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Play, Search, UserPlus, X } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { UploadReserveStudyModal } from '@/components/upload-reserve-study-modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const PROPERTY_MANAGERS = [
  { name: 'Mical Jordan', email: 'info@micaljordan.com', status: 'Pending' },
  { name: 'Mical Jordan', email: 'info@micaljordan.com', status: 'Active' },
  { name: 'Mical Jordan', email: 'info@micaljordan.com', status: 'Active' },
];

const ASSOCIATIONS = [
  { name: 'Caldron Associations', sub: 'Mical Jordan', status: 'Pending' },
  { name: 'Caldron Associations', sub: 'Mical Jordan', status: 'Active' },
  { name: 'Caldron Associations', sub: 'Mical Jordan', status: 'Active' },
];

const RESERVE_STUDIES = [
  { name: 'Caldron Reserve Study', sub: 'Associations name' },
  { name: 'Caldron Reserve Study', sub: 'Associations name' },
  { name: 'Caldron Reserve Study', sub: 'Associations name' },
];

const GUIDES = [
  {
    title: 'How can your manage property mangaer and roles',
    videoUrl: '/video/movie.mp4',
  },
  {
    title: 'How can your manage Assocaions and roles',
    videoUrl: '/video/movie.mp4',
  },
  {
    title: 'How to use Samulator for better calculation',
    videoUrl: '/video/movie.mp4',
  },
  {
    title: 'How to use Samulator for better calculation',
    videoUrl: '/video/movie.mp4',
  },
];

const FILTERS = ['Today', 'Yesterday', 'Last 7 Days', 'This Month'];

export default function DashboardPage() {
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeGuide, setActiveGuide] = useState<
    { title: string; videoUrl: string } | null
  >(null);
  const [introOpen, setIntroOpen] = useState(false);
  const [dontShowIntro, setDontShowIntro] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const hidden = window.localStorage.getItem('dashboard-invite-intro-hidden');
      if (hidden !== 'true') {
        setIntroOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!introOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [introOpen]);

  const closeIntro = () => {
    if (dontShowIntro && typeof window !== 'undefined') {
      window.localStorage.setItem('dashboard-invite-intro-hidden', 'true');
    }
    setIntroOpen(false);
  };

  const openInviteFromIntro = () => {
    closeIntro();
    setInviteOpen(true);
  };

  useEffect(() => {
    if (!inviteOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [inviteOpen]);

  useEffect(() => {
    if (!activeGuide) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activeGuide]);

  const closeInvite = () => {
    setInviteOpen(false);
    setFirstName('');
    setLastName('');
    setEmail('');
  };

  return (
    <div className="min-h-screen" style={{ background: '#F6F7F9' }}>
      <DashboardHeader role="Super Admin" />

      {/* Hero section */}
      <div
        className="flex justify-center"
        style={{
          background: 'linear-gradient(270deg, #083464 0%, #0E519B 100%)',
          paddingTop: '32px',
          paddingBottom: '120px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1242px',
          }}
        >
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: 600,
              marginBottom: '24px',
            }}
          >
            Welcome back, Atul singh
          </h1>
        </div>
      </div>

      {/* Page content */}
      <div
        className="mx-auto"
        style={{
          maxWidth: '1242px',
          marginTop: '-88px',
        }}
      >
        {/* Info Card */}
        <div
          className="bg-white"
          style={{
            borderRadius: '10px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 20px rgba(16, 44, 74, 0.06)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
          }}
        >
          {/* Column 1: Company */}
          <div
            style={{
              padding: '28px 28px 28px 32px',
              borderRight: '1px solid #E5E7EB',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '12px',
                background:
                  'conic-gradient(from 45deg, #F59E0B, #EF4444, #EC4899, #8B5CF6, #3B82F6, #10B981, #F59E0B)',
                marginBottom: '20px',
              }}
            />
            <h2
              style={{
                color: '#102C4A',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: 1.25,
                marginBottom: '12px',
              }}
            >
              Apex Global
              <br />
              Management Solutions
            </h2>
            <p
              style={{
                color: '#66717D',
                fontSize: '14px',
                lineHeight: 1.5,
                marginBottom: '24px',
                flex: 1,
              }}
            >
              450 Park Avenue, 12th Floor, New York, NY 10022, USA
            </p>
            <button
              type="button"
              style={{
                alignSelf: 'flex-start',
                padding: '10px 20px',
                border: '1px solid #D7D7D7',
                background: '#fff',
                borderRadius: '7px',
                color: '#102C4A',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Edit Details
            </button>
          </div>

          {/* Column 2: Property Managers */}
          <ListColumn
            title="Property Managers"
            items={PROPERTY_MANAGERS.map((pm) => ({
              primary: pm.name,
              secondary: pm.email,
              status: pm.status,
            }))}
            cta="+ Invite New"
            onCtaClick={() => setInviteOpen(true)}
          />

          {/* Column 3: Associations */}
          <ListColumn
            title="Associations"
            items={ASSOCIATIONS.map((a) => ({
              primary: a.name,
              secondary: a.sub,
              status: a.status,
            }))}
            cta="+ Add Associations"
          />

          {/* Column 4: Reserver Study */}
          <ListColumn
            title="Reserver Study"
            items={RESERVE_STUDIES.map((r) => ({
              primary: r.name,
              secondary: r.sub,
            }))}
            cta="+ Upload Reserver Study"
            noBorder
            onCtaClick={() => setUploadOpen(true)}
          />
        </div>

        {/* Watch Guide */}
        <div style={{ marginTop: '40px' }}>
          <h2
            style={{
              color: '#102C4A',
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '20px',
            }}
          >
            Watch Guide for you
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
            }}
          >
            {GUIDES.map((guide, idx) => (
              <div
                key={idx}
                onClick={() => setActiveGuide(guide)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: '#F4F7FB',
                    aspectRatio: '16 / 10',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage:
                        'linear-gradient(to top, rgba(16,185,129,0.15), rgba(16,185,129,0.05)), repeating-linear-gradient(90deg, transparent 0 28px, rgba(16,185,129,0.35) 28px 40px)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '22px',
                      background: '#0E519B',
                    }}
                  />
                  <div
                    className="flex items-center justify-center"
                    style={{
                      position: 'absolute',
                      inset: 0,
                    }}
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '9999px',
                        background: '#12B76A',
                        boxShadow: '0 6px 20px rgba(18, 183, 106, 0.4)',
                      }}
                    >
                      <Play className="w-6 h-6 text-white" fill="white" />
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    marginTop: '12px',
                    color: '#102C4A',
                    fontSize: '15px',
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {guide.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Section */}
        <div style={{ marginTop: '40px', paddingBottom: '48px' }}>
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}
          >
            <div className="flex items-center" style={{ gap: '20px' }}>
              <div style={{ position: 'relative', width: '280px' }}>
                <Search
                  className="w-4 h-4"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#66717D',
                  }}
                />
                <Input
                  placeholder="Quick Search"
                  className="h-11"
                  style={{
                    paddingLeft: '40px',
                    borderColor: '#D7D7D7',
                    borderRadius: '7px',
                    fontSize: '15px',
                  }}
                />
              </div>
              <span style={{ color: '#102C4A', fontSize: '15px', fontWeight: 500 }}>
                372 Logs Founded
              </span>
            </div>

            <div
              className="flex items-center"
              style={{
                background: '#fff',
                border: '1px solid #D7D7D7',
                borderRadius: '7px',
                padding: '4px',
                gap: '4px',
              }}
            >
              {FILTERS.map((f, idx) => (
                <button
                  key={f}
                  type="button"
                  style={{
                    padding: '8px 20px',
                    border: idx === 0 ? '1px solid #0E519B' : '1px solid transparent',
                    borderRadius: '5px',
                    background: '#fff',
                    color: idx === 0 ? '#0E519B' : '#102C4A',
                    fontSize: '14px',
                    fontWeight: idx === 0 ? 600 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div
            className="bg-white"
            style={{
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 2fr 1fr',
                padding: '18px 28px',
                borderBottom: '1px solid #E5E7EB',
                background: '#fff',
              }}
            >
              <span style={{ color: '#102C4A', fontSize: '15px', fontWeight: 600 }}>
                Members
              </span>
              <span style={{ color: '#102C4A', fontSize: '15px', fontWeight: 600 }}>
                Activities
              </span>
              <span style={{ color: '#102C4A', fontSize: '15px', fontWeight: 600 }}>
                Date Time
              </span>
            </div>
            {/* Skeleton rows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 2fr 1fr',
                  padding: '22px 28px',
                  borderBottom: i === 7 ? 'none' : '1px solid #F1F2F4',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    height: '8px',
                    width: '70%',
                    background: '#EEF0F3',
                    borderRadius: '4px',
                  }}
                />
                <div
                  style={{
                    height: '8px',
                    width: '85%',
                    background: '#EEF0F3',
                    borderRadius: '4px',
                  }}
                />
                <div
                  style={{
                    height: '8px',
                    width: '60%',
                    background: '#EEF0F3',
                    borderRadius: '4px',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Intro Popup */}
      {mounted && introOpen &&
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
            onClick={closeIntro}
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
              <div style={{ padding: '28px 32px 24px' }}>
                <p
                  style={{
                    color: '#102C4A',
                    fontSize: '16px',
                    lineHeight: 1.5,
                    marginBottom: '24px',
                  }}
                >
                  Invite people to collaborate, manage Association, Reserver
                  studies, and review versions together.
                </p>

                {/* Step 01 */}
                <div
                  className="flex items-center"
                  style={{ gap: '20px', marginBottom: '20px' }}
                >
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '9999px',
                      border: '1px solid #D7D7D7',
                      color: '#102C4A',
                      fontSize: '16px',
                      fontWeight: 500,
                    }}
                  >
                    01
                  </div>
                  <p
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    Invite members to collaborate and manage
                    <br />
                    studies together.
                  </p>
                </div>

                <div
                  style={{
                    height: '1px',
                    background: '#E5E7EB',
                    margin: '0 0 20px',
                  }}
                />

                {/* Step 02 */}
                <div
                  className="flex items-center"
                  style={{ gap: '20px', marginBottom: '28px' }}
                >
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '9999px',
                      border: '1px solid #D7D7D7',
                      color: '#102C4A',
                      fontSize: '16px',
                      fontWeight: 500,
                    }}
                  >
                    02
                  </div>
                  <p
                    style={{
                      color: '#102C4A',
                      fontSize: '16px',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    Add members or managers to help you
                    <br />
                    create, review, and manage studies.
                  </p>
                </div>

                {/* Invite Property Manager Button */}
                <button
                  type="button"
                  onClick={openInviteFromIntro}
                  className="w-full flex items-center justify-center font-semibold text-white transition-all duration-200 hover:opacity-95"
                  style={{
                    backgroundColor: '#0E519B',
                    borderRadius: '7px',
                    padding: '14px',
                    fontSize: '16px',
                    gap: '10px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Invite Property Manager
                  <UserPlus className="w-5 h-5" />
                </button>

                {/* Footer row */}
                <div
                  className="flex items-center justify-between"
                  style={{ marginTop: '18px' }}
                >
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <Checkbox
                      id="dontShowIntro"
                      checked={dontShowIntro}
                      onCheckedChange={(v) => setDontShowIntro(v === true)}
                      className="size-5"
                      style={{
                        borderColor: '#D7D7D7',
                        borderWidth: '1px',
                        borderRadius: '4px',
                        backgroundColor: dontShowIntro ? '#0E519B' : '#FFFFFF',
                      }}
                    />
                    <Label
                      htmlFor="dontShowIntro"
                      className="cursor-pointer"
                      style={{ color: '#102C4A', fontSize: '16px' }}
                    >
                      Don&apos;t show me again
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={closeIntro}
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
                      className="h-11"
                      style={{
                        borderColor: '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '40px' }}>
                  <Label
                    htmlFor="emailAddress"
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
                    id="emailAddress"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

      {/* Upload Reserver Study Modal */}
      <UploadReserveStudyModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />

      {/* Watch Guide Video Modal */}
      {mounted && activeGuide &&
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
              backgroundColor: 'rgba(16, 44, 74, 0.7)',
              backdropFilter: 'blur(2px)',
              zIndex: 1000,
              padding: '16px',
            }}
            onClick={() => setActiveGuide(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '860px',
                maxWidth: '100%',
                background: '#000',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div
                className="flex items-center justify-between"
                style={{
                  padding: '16px 20px',
                  background: '#102C4A',
                }}
              >
                <h3
                  style={{
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: 600,
                    margin: 0,
                    flex: 1,
                    marginRight: '12px',
                  }}
                >
                  {activeGuide.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveGuide(null)}
                  aria-label="Close"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '9999px',
                    background: 'rgba(255,255,255,0.12)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <video
                key={activeGuide.videoUrl}
                src={activeGuide.videoUrl}
                controls
                autoPlay
                style={{
                  display: 'block',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  background: '#000',
                }}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function ListColumn({
  title,
  items,
  cta,
  noBorder,
  onCtaClick,
}: {
  title: string;
  items: { primary: string; secondary: string; status?: string }[];
  cta: string;
  noBorder?: boolean;
  onCtaClick?: () => void;
}) {
  return (
    <div
      style={{
        padding: '28px 28px',
        borderRight: noBorder ? 'none' : '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3
        style={{
          color: '#102C4A',
          fontSize: '16px',
          fontWeight: 600,
          marginBottom: '20px',
        }}
      >
        {title}
      </h3>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between" style={{ gap: '12px' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  color: '#102C4A',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.primary}
              </div>
              <div
                style={{
                  color: '#66717D',
                  fontSize: '13px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.secondary}
              </div>
            </div>
            {item.status && (
              <span
                style={{
                  color: item.status === 'Active' ? '#12B76A' : '#66717D',
                  fontSize: '13px',
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {item.status}
              </span>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onCtaClick}
        style={{
          marginTop: '24px',
          alignSelf: 'flex-start',
          padding: '10px 20px',
          border: '1px solid #D7D7D7',
          background: '#fff',
          borderRadius: '7px',
          color: '#102C4A',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        {cta}
      </button>
    </div>
  );
}

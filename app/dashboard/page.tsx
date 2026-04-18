'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { FolderPlus, Play, Search, Trash2, Upload, UserCircle2, UserPlus, X } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { UploadReserveStudyModal } from '@/components/upload-reserve-study-modal';
import { UploadLogoModal } from '@/components/upload-logo-modal';
import { TabSwitcher } from '@/components/tab-switcher';
import roleMapJson from '@/config.json';

const ROLE_MAP = (roleMapJson as any).roles as Record<string, string>;
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const PROPERTY_MANAGERS = [
  { name: 'Mical Jordan', email: 'info@micaljordan.com', status: 'Pending' },
  { name: 'Mical Jordan', email: 'info@micaljordan.com', status: 'Active' },
  { name: 'Mical Jordan', email: 'info@micaljordan.com', status: 'Active' },
    { name: 'Mical Jordan', email: 'info@micaljordan.com', status: 'Pending' },
  { name: 'Mical Jordan', email: 'info@micaljordan.com', status: 'Active' },
  { name: 'Mical Jordan', email: 'info@micaljordan.com', status: 'Active' },
];

const ASSOCIATIONS = [
  { name: 'Caldron Associations', sub: 'Mical Jordan', status: 'Pending' },
  { name: 'Caldron Associations', sub: 'Mical Jordan', status: 'Active' },
  { name: 'Caldron Associations', sub: 'Mical Jordan', status: 'Active' },
    { name: 'Caldron Associations', sub: 'Mical Jordan', status: 'Pending' },
  { name: 'Caldron Associations', sub: 'Mical Jordan', status: 'Active' },
  { name: 'Caldron Associations', sub: 'Mical Jordan', status: 'Active' },
];

const RESERVE_STUDIES = [
  { name: 'Caldron Reserve Study', sub: 'Associations name' },
  { name: 'Caldron Reserve Study', sub: 'Associations name' },
  { name: 'Caldron Reserve Study', sub: 'Associations name' },
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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const markTouched = (field: string) => setTouched((t) => ({ ...t, [field]: true }));
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeGuide, setActiveGuide] = useState<
    { title: string; videoUrl: string } | null
  >(null);
  const [introOpen, setIntroOpen] = useState(true);
  const [dontShowIntro, setDontShowIntro] = useState(false);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [userName, setUserName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [roleLabel, setRoleLabel] = useState('Reserve Specialist');
  const [logoFileId, setLogoFileId] = useState<string | null>(null);
  const [avatarUploadOpen, setAvatarUploadOpen] = useState(false);
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [associations, setAssociations] = useState<
    { id: string; name: string; sub: string; status: string }[]
  >([]);
  const [invites, setInvites] = useState<
    { id: string; name: string; email: string; status: string }[]
  >([]);
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [studies, setStudies] = useState<
    { id: string; name: string; sub: string }[]
  >([]);
  const [stats, setStats] = useState({
    associations: 0,
    members: 0,
    studies: 0,
    versions: 0,
  });

  const refreshInvites = async () => {
    try {
      const res = await fetch('/api/invite');
      const data = await res.json();
      if (Array.isArray(data?.invites)) {
        setInvites(
          data.invites.map((i: any) => ({
            id: i.id,
            name: `${i.firstName} ${i.lastName}`.trim(),
            email: i.email,
            status: i.status === 'linked' ? 'Active' : i.status === 'accepted' ? 'Active' : 'Pending',
          }))
        );
      }
    } catch {}
  };

  const fetchStudies = async () => {
    try {
      const res = await fetch('/api/studies');
      const data = await res.json();
      if (res.status === 401) {
        console.error('Not authenticated');
        return;
      }
      if (Array.isArray(data?.studies)) {
        // Fetch associations to map IDs to names
        const assocRes = await fetch('/api/associations');
        const assocData = await assocRes.json();
        const associationsMap: Record<string, string> = {};
        
        if (Array.isArray(assocData?.associations)) {
          assocData.associations.forEach((a: any) => {
            associationsMap[a.id] = a.associationName;
          });
        }

        setStudies(
          data.studies.map((s: any) => ({
            id: s.id,
            name: s.modelName,
            sub: s.associationId ? (associationsMap[s.associationId] || 'Unknown Association') : 'No Association',
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch studies:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/associations', { method: 'PATCH' });
      const data = await res.json();
      if (res.ok && data) {
        setStats({
          associations: data.associations || 0,
          members: data.members || 0,
          studies: data.studies || 0,
          versions: data.versions || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    refreshInvites();
    fetchStudies();
    fetchStats();
  }, []);

  const submitInvite = async () => {
    markTouched('firstName');
    markTouched('lastName');
    markTouched('email');
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    setInviteSubmitting(true);
    setInviteError('');
    setInviteMessage('');
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to invite');
      setInviteMessage(data.linked ? 'User already exists — added to your list.' : 'Invitation email sent.');
      await refreshInvites();
      setTimeout(() => closeInvite(), 800);
    } catch (e: any) {
      setInviteError(e.message);
    } finally {
      setInviteSubmitting(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/api/associations')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data?.associations) ? data.associations : [];
        setAssociations(
          list.map((a: any) => ({
            id: a.id,
            name: a.associationName,
            sub:
              [a.managerFirstName, a.managerLastName].filter(Boolean).join(' ') ||
              a.city ||
              '',
            status: a.published ? 'Active' : 'Pending',
          }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const u = data?.user;
        if (!u) return;
        const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
        if (name) setUserName(name);
        const stateZip = [u.state, u.zipCode].filter(Boolean).join(' ').trim();
        const addr = [
          u.companyName,
          u.address1,
          u.address2,
          u.city,
          stateZip,
        ]
          .map((p) => (p ? String(p).trim() : ''))
          .filter(Boolean)
          .join(', ');
        if (addr) setAddressLine(addr);
        if (u.companyType && ROLE_MAP[u.companyType]) {
          setRoleLabel(ROLE_MAP[u.companyType]);
        }
        if (u.logoFileId) setLogoFileId(u.logoFileId);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const isHidden = window.localStorage.getItem('dashboard-invite-intro-hidden');
      setIntroOpen(!isHidden);
    } else {
      setIntroOpen(true);
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
    setTouched({});
    setInviteError('');
    setInviteMessage('');
  };

  return (
    <div className="min-h-screen" style={{ background: '#F6F7F9', paddingTop: '64px' }}>
      <DashboardHeader role={roleLabel} />

      {/* Hero section */}
      <div
        className="flex justify-center"
        style={{
          background: 'linear-gradient(270deg, #083464 0%, #0E519B 100%)',
          paddingTop: '28px',
          paddingBottom: '120px',
        }}
      >
        <div
          className="flex items-start justify-between"
          style={{
            width: '100%',
            maxWidth: '1242px',
            gap: '20px',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              Welcome back, {userName || 'there'}
            </h1>
            <p
              style={{
                color: 'rgba(255,255,255,0.75)',
                fontSize: '14px',
                margin: 0,
              }}
            >
              {addressLine || 'Apex Global Management Solutions, 450 Park Avenue, 12th Floor, New York, NY 10022, USA'}
            </p>
          </div>
          <div className="flex items-center">
            {[
              { value: String(stats.associations), label: 'Associations' },
              { value: String(stats.members), label: 'Members' },
              { value: String(stats.studies).padStart(2, '0'), label: 'Study Data' },
              { value: String(stats.versions), label: 'Versions' },
            ].map((stat, idx, arr) => (
              <div
                key={stat.label}
                className="flex flex-col justify-end"
                style={{
                  padding: '0 24px',
                  borderRight:
                    idx === arr.length - 1
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.25)',
                  gap: '4px',
                  minHeight: '44px',
                }}
              >
                <div
                  style={{
                    color: '#FFFFFF',
                    fontSize: '22px',
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '13px',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div
        className="mx-auto"
        style={{
          maxWidth: '1242px',
          marginTop: '-110px',
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
            alignItems: 'stretch',
          }}
        >
          {/* Column 1: Role & Responsibility */}
          <div
          id='userprofile'
            style={{
              borderRight: '1px solid #D7D7D7',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3
              style={{
                color: '#102C4A',
                fontSize: '16px',
                fontWeight: 600,
                padding: '18px 28px',
                borderBottom: '1px solid #D7D7D7',
              }}
            >
              Role & Responsibility
            </h3>
            <div
              style={{
                padding: '24px 28px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{ position: 'relative', width: '56px', height: '56px', marginBottom: '18px', cursor: 'pointer' }}
                onClick={() => setAvatarUploadOpen(true)}
                onMouseEnter={() => setAvatarHovered(true)}
                onMouseLeave={() => setAvatarHovered(false)}
              >
                {logoFileId ? (
                  <img
                    src={`/api/profile/logo/${logoFileId}`}
                    alt="Profile"
                    style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center"
                    style={{ width: '56px', height: '56px', borderRadius: '10px', background: '#F1F4F9' }}
                  >
                    <UserCircle2 className="w-7 h-7" style={{ color: '#66717D' }} />
                  </div>
                )}
                {logoFileId && avatarHovered && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetch('/api/profile/logo', { method: 'DELETE' }).then((r) => {
                        if (r.ok) setLogoFileId(null);
                      });
                    }}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '9999px',
                      background: '#DC2626',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
              <div
                style={{
                  color: '#102C4A',
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                {roleLabel}
              </div>
              <p
                style={{
                  color: '#66717D',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  margin: 0,
                  flex: 1,
                }}
              >
                You can manage associations, members and study data behalf of your company
              </p>
            </div>
            <button
              type="button"
              className="flex items-center justify-center"
              style={{
                gap: '10px',
                padding: '16px',
                borderTop: '1px solid #D7D7D7',
                background: '#fff',
                color: '#102C4A',
                fontSize: '15px',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderTopColor: '#D7D7D7',
              }}
              onClick={() => router.push('/profile')}
            >
              <UserCircle2 className="w-5 h-5" style={{ color: '#66717D' }} />
              My Profile
            </button>
          </div>

          {/* Column 2: Role label per companyType (from config.json) */}
          <ListColumn
            title={roleLabel}
            items={invites.map((pm) => ({
              primary: pm.name,
              secondary: pm.email,
              status: pm.status,
            }))}
            cta="Invite New"
            ctaIcon={<UserPlus className="w-5 h-5" style={{ color: '#66717D' }} />}
            onCtaClick={() => setInviteOpen(true)}
          />

          {/* Column 3: Associations */}
          <ListColumn
            title="Associations"
            items={associations.map((a) => ({
              primary: a.name,
              secondary: a.sub,
              status: a.status,
            }))}
            cta="Add Associations"
            ctaIcon={<FolderPlus className="w-5 h-5" style={{ color: '#66717D' }} />}
            onCtaClick={() => router.push('/add-association')}
          />

          {/* Column 4: Reserver Study */}
          <ListColumn
            title="Reserver Study"
            items={studies.map((r) => ({
              primary: r.name,
              secondary: r.sub,
            }))}
            cta="Upload Reserver Study"
            ctaIcon={<Upload className="w-5 h-5" style={{ color: associations.length === 0 ? '#98A2B3' : '#66717D' }} />}
            noBorder
            ctaDisabled={associations.length === 0}
            onCtaClick={() => router.push('/study?selectAssociation=1')}
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
                    aspectRatio: '16 / 10',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <img
                    src="/images/thumb.png"
                    alt={guide.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
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
                    backgroundColor: '#fff',
                  }}
                />
              </div>
              <span style={{ color: '#102C4A', fontSize: '15px', fontWeight: 500 }}>
                372 Logs Founded
              </span>
            </div>

            <TabSwitcher
              tabs={FILTERS}
              activeTab={activeFilter}
              onTabChange={setActiveFilter}
            />
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
                  Invite {roleLabel}
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

                {/* Invite {roleLabel} Button */}
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
                  Invite {roleLabel}
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

      {/* Invite {roleLabel} Modal */}
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
                  Invite {roleLabel}
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
                      onBlur={() => markTouched('firstName')}
                      className="h-11"
                      style={{
                        borderColor: touched.firstName && !firstName.trim() ? '#DC2626' : '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
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
                      style={{
                        borderColor: touched.lastName && !lastName.trim() ? '#DC2626' : '#D7D7D7',
                        borderRadius: '7px',
                        fontSize: '16px',
                      }}
                    />
                    {touched.lastName && !lastName.trim() && (
                      <p style={{ color: '#DC2626', fontSize: '14px', marginTop: '4px' }}>This field is required</p>
                    )}
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

                {inviteError && (
                  <p style={{ color: '#DC2626', fontSize: '14px', marginBottom: '10px' }}>{inviteError}</p>
                )}
                {inviteMessage && (
                  <p style={{ color: '#10B981', fontSize: '14px', marginBottom: '10px' }}>{inviteMessage}</p>
                )}
                <button
                  type="button"
                  onClick={submitInvite}
                  disabled={inviteSubmitting}
                  className="w-full flex items-center justify-center font-semibold text-white transition-all duration-200 hover:opacity-95"
                  style={{
                    backgroundColor: inviteSubmitting ? '#9CA3AF' : '#0E519B',
                    borderRadius: '7px',
                    padding: '14px',
                    fontSize: '16px',
                    gap: '10px',
                    border: 'none',
                    cursor: inviteSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {inviteSubmitting ? 'Sending…' : <>Invite {roleLabel} <UserPlus className="w-5 h-5" /></>}
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

      {/* Avatar Upload Modal */}
      <UploadLogoModal
        open={avatarUploadOpen}
        title="Upload your profile image"
        onClose={() => setAvatarUploadOpen(false)}
        onApply={async ({ file }) => {
          const form = new FormData();
          form.append('file', file);
          const res = await fetch('/api/profile/logo', { method: 'POST', body: form });
          const data = await res.json();
          if (res.ok) setLogoFileId(data.logoFileId);
        }}
      />

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
  ctaIcon,
  noBorder,
  ctaDisabled,
  onCtaClick,
}: {
  title: string;
  items: { primary: string; secondary: string; status?: string }[];
  cta: string;
  ctaIcon?: React.ReactNode;
  noBorder?: boolean;
  ctaDisabled?: boolean;
  onCtaClick?: () => void;
}) {
  return (
    <div
      style={{
        borderRight: noBorder ? 'none' : '1px solid #D7D7D7',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3
        style={{
          color: '#102C4A',
          fontSize: '16px',
          fontWeight: 600,
          padding: '18px 28px',
          borderBottom: '1px solid #D7D7D7',
          margin: 0,
        }}
      >
        {title}
      </h3>
      <div
        className="thin-scrollbar"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          padding: '20px 28px',
          overflowY: 'auto',
          maxHeight: '240px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#D7D7D7 transparent',
        }}
      >
        {items.length === 0 && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '160px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#66717D', fontSize: '14px', margin: 0 }}>
              No data available for {title}
            </p>
          </div>
        )}
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between" style={{ gap: '12px' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  color: '#102C4A',
                  fontSize: '15px',
                  fontWeight: 500,
                  marginBottom: '2px',
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
                  fontSize: '14px',
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
                  color: item.status === 'Active' ? '#12B76A' : '#98A2B3',
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
        onClick={ctaDisabled ? undefined : onCtaClick}
        disabled={ctaDisabled}
        className="flex items-center justify-center"
        style={{
          gap: '10px',
          padding: '16px',
          borderTop: '1px solid #D7D7D7',
          background: '#fff',
          color: ctaDisabled ? '#98A2B3' : '#102C4A',
          fontSize: '15px',
          fontWeight: 500,
          cursor: ctaDisabled ? 'not-allowed' : 'pointer',
          border: 'none',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: '#D7D7D7',
          opacity: ctaDisabled ? 0.6 : 1,
        }}
      >
        {ctaIcon}
        {cta}
      </button>
    </div>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Building2,
  Briefcase,
  FileStack,
  HandCoins,
  ImagePlus,
  Landmark,
  LineChart,
  LogOut,
  MoreHorizontal,
  PiggyBank,
  Search,
  UserCircle2,
  Users,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

type AdminUser = {
  id: string;
  email: string;
  companyType: string;
  companyName: string | null;
  firstName: string | null;
  lastName: string | null;
  designation: string | null;
  phone: string | null;
  logoFileId: string | null;
  zipCode: string | null;
  state: string | null;
  city: string | null;
  address1: string | null;
  address2: string | null;
  createdAt: string;
};

type AdminAssociation = {
  id: string;
  associationName: string;
  managerFirstName: string | null;
  managerLastName: string | null;
  managerEmail: string | null;
  createdAt: string;
};

type AdminInvite = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  designation: string | null;
  status: string;
  createdAt: string;
};

type CompanyTypeKey = 'management' | 'bank' | 'reserve' | 'advisor' | 'board';

type PrimaryNavItem = {
  key: CompanyTypeKey;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
};

type SecondaryNavItem = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
};

const PRIMARY_NAV: PrimaryNavItem[] = [
  { key: 'management', label: 'Management Company', icon: Building2 },
  { key: 'bank', label: 'Bank Office', icon: Landmark },
  { key: 'reserve', label: 'Reserve Study Company', icon: Briefcase },
  { key: 'advisor', label: 'Investment Advisor', icon: LineChart },
  { key: 'board', label: 'Board Members', icon: Users },
];

const SECONDARY_NAV: SecondaryNavItem[] = [
  { key: 'study', label: 'Study Data', icon: FileStack },
  { key: 'ltm', label: 'LTM', icon: LineChart },
  { key: 'loans', label: 'Loans', icon: HandCoins },
  { key: 'cd', label: 'CD Plans', icon: PiggyBank },
];

function formatDateTime(iso?: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d
      .toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
      .replace(',', '');
  } catch {
    return '—';
  }
}

function composeAddress(u: AdminUser): string {
  return [u.address1, u.address2, u.city, u.state, u.zipCode]
    .map((p) => (p ? String(p).trim() : ''))
    .filter(Boolean)
    .join(', ');
}

function composeContact(u: AdminUser): string {
  return [composeAddress(u), u.phone, u.email]
    .filter(Boolean)
    .join(', ');
}

function userDisplayName(u: AdminUser): string {
  return (
    u.companyName ||
    [u.firstName, u.lastName].filter(Boolean).join(' ') ||
    u.email
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<string>('management');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeUserId, setActiveUserId] = useState<string>('');
  const [detail, setDetail] = useState<{
    user: AdminUser;
    associations: AdminAssociation[];
    invites: AdminInvite[];
  } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/overview', { cache: 'no-store' });
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setUsers(data.users || []);
        setCounts(data.counts || {});
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const filtered = useMemo(() => {
    const base = users.filter((u) => {
      if (PRIMARY_NAV.some((n) => n.key === activeNav)) {
        return u.companyType === activeNav;
      }
      return true;
    });
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(
      (u) =>
        userDisplayName(u).toLowerCase().includes(q) ||
        composeAddress(u).toLowerCase().includes(q),
    );
  }, [users, query, activeNav]);

  useEffect(() => {
    if (filtered.length === 0) {
      setActiveUserId('');
      setDetail(null);
      return;
    }
    if (!filtered.find((u) => u.id === activeUserId)) {
      setActiveUserId(filtered[0].id);
    }
  }, [filtered, activeUserId]);

  useEffect(() => {
    if (!activeUserId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    (async () => {
      try {
        const res = await fetch(
          `/api/admin/user-detail?userId=${activeUserId}`,
          { cache: 'no-store' },
        );
        if (!res.ok) {
          if (!cancelled) setDetail(null);
          return;
        }
        const data = await res.json();
        if (!cancelled) setDetail(data);
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeUserId]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
    }
  }, [router]);

  const activeIsPrimary = PRIMARY_NAV.some((n) => n.key === activeNav);

  return (
    <div
      className="min-h-screen"
      style={{
        background: '#FFFFFF',
        display: 'grid',
        gridTemplateColumns: '280px 360px 1fr',
        minHeight: '100vh',
      }}
    >
      {/* ==== Left sidebar ==== */}
      <aside
        style={{
          borderRight: '1px solid #D7D7D7',
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFFFF',
        }}
      >
        <div style={{ padding: '28px 28px 24px' }}>
          <Image
            src="/images/adminlogo.png"
            alt="Reserve Fund Advisers"
            width={90}
            height={40}
          />
        </div>

        <nav style={{ padding: '0 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {PRIMARY_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.key;
              const count = counts[item.key] ?? 0;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveNav(item.key)}
                  className="flex items-center justify-between"
                  style={{
                    padding: '12px 14px',
                    borderRadius: '7px',
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive ? '#F1F4F9' : 'transparent',
                    color: '#102C4A',
                    textAlign: 'left',
                    transition: 'background 150ms',
                  }}
                >
                  <span
                    className="flex items-center"
                    style={{ gap: '12px', fontSize: '15px', fontWeight: isActive ? 600 : 500 }}
                  >
                    <Icon
                      className="w-[18px] h-[18px]"
                      style={{ color: isActive ? '#0E519B' : '#66717D' }}
                    />
                    {item.label}
                  </span>
                  <span
                    style={{
                      color: isActive ? '#0E519B' : '#66717D',
                      fontSize: '14px',
                      fontWeight: 500,
                    }}
                  >
                    {String(count).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            style={{
              height: '1px',
              background: '#ECEEF1',
              margin: '18px 6px',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {SECONDARY_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveNav(item.key)}
                  className="flex items-center"
                  style={{
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '7px',
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive ? '#F1F4F9' : 'transparent',
                    color: '#102C4A',
                    fontSize: '15px',
                    fontWeight: isActive ? 600 : 500,
                    textAlign: 'left',
                  }}
                >
                  <Icon
                    className="w-[18px] h-[18px]"
                    style={{ color: isActive ? '#0E519B' : '#66717D' }}
                  />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
            <div
              style={{
                height: '1px',
                background: '#ECEEF1',
                margin: '0 6px 12px',
              }}
            />
            <button
              type="button"
              className="flex items-center"
              style={{
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                background: 'transparent',
                color: '#102C4A',
                fontSize: '15px',
                fontWeight: 500,
                width: '100%',
                textAlign: 'left',
              }}
            >
              <UserCircle2
                className="w-[18px] h-[18px]"
                style={{ color: '#66717D' }}
              />
              My Profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center"
              style={{
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                background: 'transparent',
                color: '#102C4A',
                fontSize: '15px',
                fontWeight: 500,
                width: '100%',
                textAlign: 'left',
              }}
            >
              <LogOut
                className="w-[18px] h-[18px]"
                style={{ color: '#66717D' }}
              />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* ==== Middle list ==== */}
      <section
        style={{
          borderRight: '1px solid #D7D7D7',
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFFFF',
        }}
      >
        <div style={{ padding: '20px 20px 16px' }}>
          <div style={{ position: 'relative' }}>
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
              placeholder="Search by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
        </div>
        <div
          className="thin-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 8px 20px',
          }}
        >
          {loading ? (
            <div
              style={{
                padding: '20px',
                color: '#66717D',
                fontSize: '14px',
              }}
            >
              Loading…
            </div>
          ) : !activeIsPrimary ? (
            <div
              style={{
                padding: '20px',
                color: '#66717D',
                fontSize: '14px',
                lineHeight: 1.5,
              }}
            >
              This section is coming soon.
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                padding: '20px',
                color: '#66717D',
                fontSize: '14px',
              }}
            >
              No entries yet
            </div>
          ) : (
            filtered.map((u) => {
              const isActive = u.id === activeUserId;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setActiveUserId(u.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '14px 12px',
                    border: 'none',
                    borderRadius: '7px',
                    background: isActive ? '#F1F4F9' : 'transparent',
                    cursor: 'pointer',
                    marginBottom: '2px',
                  }}
                >
                  <div
                    style={{
                      color: '#102C4A',
                      fontSize: '15px',
                      fontWeight: 600,
                      marginBottom: '4px',
                      lineHeight: 1.35,
                    }}
                  >
                    {userDisplayName(u)}
                  </div>
                  <div
                    style={{
                      color: '#66717D',
                      fontSize: '13px',
                      lineHeight: 1.45,
                    }}
                  >
                    {composeAddress(u) || '—'}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* ==== Right detail panel ==== */}
      <section
        style={{
          background: '#F6F7F9',
          padding: '24px 28px 40px',
          overflowY: 'auto',
        }}
      >
        {!activeIsPrimary ? (
          <div
            className="bg-white"
            style={{
              padding: '36px',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              color: '#66717D',
              fontSize: '14px',
            }}
          >
            This section is coming soon.
          </div>
        ) : !detail ? (
          <div
            className="bg-white"
            style={{
              padding: '36px',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              color: '#66717D',
              fontSize: '14px',
            }}
          >
            {detailLoading ? 'Loading…' : 'Select an entry to view details'}
          </div>
        ) : (
          <DetailPanel
            detail={detail}
            enabled={enabled}
            onToggleEnabled={() => setEnabled((v) => !v)}
          />
        )}
      </section>
    </div>
  );
}

function DetailPanel({
  detail,
  enabled,
  onToggleEnabled,
}: {
  detail: {
    user: AdminUser;
    associations: AdminAssociation[];
    invites: AdminInvite[];
  };
  enabled: boolean;
  onToggleEnabled: () => void;
}) {
  const { user, associations, invites } = detail;
  const [advisorQuery, setAdvisorQuery] = useState('');
  const [assocQuery, setAssocQuery] = useState('');

  const filteredInvites = useMemo(() => {
    if (!advisorQuery.trim()) return invites;
    const q = advisorQuery.toLowerCase();
    return invites.filter((i) =>
      `${i.firstName} ${i.lastName} ${i.email}`.toLowerCase().includes(q),
    );
  }, [invites, advisorQuery]);

  const filteredAssociations = useMemo(() => {
    if (!assocQuery.trim()) return associations;
    const q = assocQuery.toLowerCase();
    return associations.filter((a) =>
      a.associationName.toLowerCase().includes(q),
    );
  }, [associations, assocQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header card */}
      <div
        className="bg-white"
        style={{
          border: '1px solid #E5E7EB',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          className="flex items-start"
          style={{
            padding: '20px 24px',
            gap: '16px',
          }}
        >
          {user.logoFileId ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/logo/${user.logoFileId}`}
              alt={userDisplayName(user)}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '8px',
                objectFit: 'cover',
                flexShrink: 0,
                border: '1px solid #ECEEF1',
              }}
            />
          ) : (
            <div
              className="flex items-center justify-center"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '8px',
                flexShrink: 0,
                background: '#F1F4F9',
                border: '1px solid #ECEEF1',
              }}
            >
              <ImagePlus
                className="w-5 h-5"
                style={{ color: '#B5BCC4' }}
                strokeWidth={1.5}
              />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                color: '#102C4A',
                fontSize: '17px',
                fontWeight: 600,
                margin: 0,
                marginBottom: '6px',
                lineHeight: 1.3,
              }}
            >
              {userDisplayName(user)}
            </h2>
            <p
              style={{
                color: '#66717D',
                fontSize: '13px',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {composeContact(user) || '—'}
            </p>
          </div>

          <button
            type="button"
            aria-label="More"
            style={{
              background: 'none',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              color: '#66717D',
              flexShrink: 0,
            }}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr auto',
            borderTop: '1px solid #ECEEF1',
          }}
        >
          <div style={{ padding: '14px 24px', borderRight: '1px solid #ECEEF1' }}>
            <div
              style={{
                color: '#66717D',
                fontSize: '12px',
                marginBottom: '4px',
              }}
            >
              Joining Date
            </div>
            <div
              style={{
                color: '#102C4A',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {formatDateTime(user.createdAt)}
            </div>
          </div>
          <div style={{ padding: '14px 24px' }}>
            <div
              style={{
                color: '#102C4A',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '2px',
              }}
            >
              {[user.firstName, user.lastName].filter(Boolean).join(' ') || '—'}
              {user.designation ? `, ${user.designation}` : ''}
            </div>
            <div style={{ color: '#66717D', fontSize: '13px' }}>
              {[user.email, user.phone].filter(Boolean).join(', ') || '—'}
            </div>
          </div>
          <div
            className="flex items-center justify-center"
            style={{ padding: '0 20px' }}
          >
            <ToggleSwitch checked={enabled} onChange={onToggleEnabled} />
          </div>
        </div>
      </div>

      {/* Invites section */}
      <DetailListSection
        count={invites.length}
        title={invites.length === 1 ? 'Investment Advisor' : 'Investment Advisor'}
        countLabel={`${invites.length} Investment Advisor`}
        query={advisorQuery}
        onQueryChange={setAdvisorQuery}
      >
        {filteredInvites.length === 0 ? (
          <EmptyRow label="No advisors yet" />
        ) : (
          filteredInvites.map((inv, idx) => (
            <div
              key={inv.id}
              className="flex items-start justify-between"
              style={{
                padding: '16px 20px',
                borderBottom:
                  idx === filteredInvites.length - 1
                    ? 'none'
                    : '1px solid #ECEEF1',
                gap: '12px',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    color: '#102C4A',
                    fontSize: '14px',
                    fontWeight: 500,
                    marginBottom: '2px',
                  }}
                >
                  {[inv.firstName, inv.lastName].filter(Boolean).join(' ')}
                </div>
                <div style={{ color: '#66717D', fontSize: '13px' }}>
                  {[inv.designation, inv.email].filter(Boolean).join(', ') ||
                    inv.email}
                </div>
              </div>
              <button
                type="button"
                aria-label="More"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: '#66717D',
                  flexShrink: 0,
                }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </DetailListSection>

      {/* Associations section */}
      <DetailListSection
        count={associations.length}
        title="Associations"
        countLabel={`${associations.length} Associations`}
        query={assocQuery}
        onQueryChange={setAssocQuery}
      >
        {filteredAssociations.length === 0 ? (
          <EmptyRow label="No associations yet" />
        ) : (
          filteredAssociations.map((a, idx) => (
            <div
              key={a.id}
              className="flex items-start justify-between"
              style={{
                padding: '16px 20px',
                borderBottom:
                  idx === filteredAssociations.length - 1
                    ? 'none'
                    : '1px solid #ECEEF1',
                gap: '12px',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    color: '#102C4A',
                    fontSize: '14px',
                    fontWeight: 500,
                    marginBottom: '2px',
                  }}
                >
                  {a.associationName}
                </div>
                <div style={{ color: '#66717D', fontSize: '13px' }}>
                  {[a.managerFirstName, a.managerLastName]
                    .filter(Boolean)
                    .join(' ') || 'Myself'}
                  . {formatDateTime(a.createdAt)}
                </div>
              </div>
              <button
                type="button"
                aria-label="More"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: '#66717D',
                  flexShrink: 0,
                }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </DetailListSection>
    </div>
  );
}

function DetailListSection({
  countLabel,
  query,
  onQueryChange,
  children,
}: {
  count: number;
  title: string;
  countLabel: string;
  query: string;
  onQueryChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          color: '#102C4A',
          fontSize: '15px',
          fontWeight: 600,
          marginBottom: '10px',
        }}
      >
        {countLabel}
      </div>
      <div
        className="bg-white"
        style={{
          border: '1px solid #E5E7EB',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid #ECEEF1',
            position: 'relative',
          }}
        >
          <Search
            className="w-4 h-4"
            style={{
              position: 'absolute',
              left: '28px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#66717D',
            }}
          />
          <Input
            placeholder="Search by name"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="h-10"
            style={{
              paddingLeft: '36px',
              borderColor: '#D7D7D7',
              borderRadius: '7px',
              fontSize: '14px',
              backgroundColor: '#fff',
            }}
          />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '20px',
        color: '#66717D',
        fontSize: '13px',
        textAlign: 'center',
      }}
    >
      {label}
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '9999px',
        background: checked ? '#0E519B' : '#D7D7D7',
        border: 'none',
        position: 'relative',
        cursor: 'pointer',
        padding: 0,
        transition: 'background 150ms',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '20px' : '2px',
          width: '18px',
          height: '18px',
          borderRadius: '9999px',
          background: '#FFFFFF',
          transition: 'left 150ms',
          boxShadow: '0 1px 2px rgba(16, 44, 74, 0.2)',
        }}
      />
    </button>
  );
}

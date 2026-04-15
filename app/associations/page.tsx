'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import {
  AssociationDetail,
  type AssociationDetailMember,
  type AssociationDetailStudy,
} from '@/components/association-detail';
import { Input } from '@/components/ui/input';

type Association = {
  id: string;
  associationName: string;
  managerFirstName: string | null;
  managerLastName: string | null;
  managerEmail: string | null;
  associationEmail: string | null;
  cellPhone: string | null;
  telephone: string | null;
  zipCode: string | null;
  state: string | null;
  city: string | null;
  address1: string | null;
  address2: string | null;
  logoFileId?: string | null;
  createdAt?: string;
};

type Invite = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  designation?: string | null;
  permissions?: Record<string, unknown> | null;
  status: string;
  linkedUserId?: string | null;
};

type ReserveStudy = {
  id: string;
  fileName: string;
  size: number;
  contentType?: string | null;
  createdAt: string;
};

function formatDate(iso?: string): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

function permissionsSummary(p: unknown): string {
  if (!p || typeof p !== 'object') return '';
  const keys = Object.entries(p as Record<string, unknown>)
    .filter(([, v]) => Boolean(v))
    .map(([k]) => k);
  return keys.join(', ');
}

function composeAddress(a: Association): string {
  return [a.address1, a.address2, a.city, a.state, a.zipCode]
    .map((p) => (p ? String(p).trim() : ''))
    .filter(Boolean)
    .join(', ');
}

function composeDetailAddress(a: Association): string {
  const parts = [
    composeAddress(a),
    a.cellPhone,
    a.telephone,
    a.associationEmail || a.managerEmail,
  ]
    .map((p) => (p ? String(p).trim() : ''))
    .filter(Boolean);
  return parts.join(', ');
}

export default function AssociationsPage() {
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>('');
  const [query, setQuery] = useState('');
  const [invites, setInvites] = useState<Invite[]>([]);
  const [studies, setStudies] = useState<ReserveStudy[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/associations', { cache: 'no-store' });
        const data = await res.json();
        if (cancelled) return;
        const list: Association[] = data.associations || [];
        setAssociations(list);
        if (list.length > 0) setActiveId(list[0].id);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeId) {
      setInvites([]);
      setStudies([]);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    (async () => {
      try {
        const [invitesRes, studiesRes] = await Promise.all([
          fetch(`/api/invite?associationId=${activeId}`, { cache: 'no-store' }),
          fetch(`/api/reserve-studies?associationId=${activeId}`, {
            cache: 'no-store',
          }),
        ]);
        const invitesData = await invitesRes.json();
        const studiesData = await studiesRes.json();
        if (cancelled) return;
        setInvites(invitesData.invites || []);
        setStudies(studiesData.studies || []);
      } catch {
        if (!cancelled) {
          setInvites([]);
          setStudies([]);
        }
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  const filtered = useMemo(
    () =>
      associations.filter((a) =>
        a.associationName.toLowerCase().includes(query.toLowerCase()),
      ),
    [associations, query],
  );

  const active = useMemo(
    () => associations.find((a) => a.id === activeId) || null,
    [associations, activeId],
  );

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
        <div
          className="flex items-center justify-between"
          style={{ width: '100%', maxWidth: '1242px', padding: '0 24px' }}
        >
          <h1 style={{ color: '#FFFFFF', fontSize: '22px', margin: 0 }}>
            <span style={{ fontWeight: 600 }}>{associations.length}</span>{' '}
            <span style={{ fontWeight: 600 }}>Associations</span>{' '}
            <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>
              Founded
            </span>
          </h1>
          <Link
            href="/add-association"
            className="flex items-center"
            style={{
              gap: '6px',
              background: '#0E59B0',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.35)',
              borderRadius: '7px',
              padding: '10px 20px',
              fontSize: '15px',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.4} />
            Add New
          </Link>
        </div>
      </div>

      {/* Content card */}
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
            gridTemplateColumns: '310px 1fr',
            overflow: 'hidden',
            minHeight: '720px',
          }}
        >
          {/* Left column: search + list */}
          <aside style={{ borderRight: '1px solid #D7D7D7', padding: '20px' }}>
            <div style={{ position: 'relative', marginBottom: '18px' }}>
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '780px',
                overflowY: 'auto',
                paddingRight: '10px',
              }}
              className="thin-scrollbar"
            >
              {loading ? (
                <div style={{ color: '#66717D', fontSize: '14px', padding: '12px 4px' }}>
                  Loading…
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ color: '#66717D', fontSize: '14px', padding: '12px 4px' }}>
                  {associations.length === 0
                    ? 'No associations yet'
                    : 'No matches'}
                </div>
              ) : (
                filtered.map((assoc) => {
                  const isActive = assoc.id === activeId;
                  return (
                    <button
                      key={assoc.id}
                      type="button"
                      onClick={() => setActiveId(assoc.id)}
                      style={{
                        textAlign: 'left',
                        padding: '14px 16px',
                        borderRadius: '7px',
                        border: '1px solid #D7D7D7',
                        background: isActive ? '#F1F4F9' : '#FFFFFF',
                        cursor: 'pointer',
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
                        {assoc.associationName}
                      </div>
                      <div
                        style={{
                          color: '#66717D',
                          fontSize: '13px',
                          lineHeight: 1.45,
                        }}
                      >
                        {composeAddress(assoc) || '—'}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Right column: association detail */}
          <section style={{ padding: '20px 24px 28px' }}>
            {active ? (
              <AssociationDetail
                name={active.associationName}
                address={composeDetailAddress(active)}
                invitedBy="Myself"
                invitationDate={formatDate(active.createdAt)}
                reserveStudyCount={studies.length}
                loading={detailLoading}
                members={invites.map<AssociationDetailMember>((inv) => ({
                  id: inv.id,
                  name: [inv.firstName, inv.lastName].filter(Boolean).join(' '),
                  role:
                    inv.designation ||
                    permissionsSummary(inv.permissions) ||
                    (inv.status === 'pending' ? 'Invite pending' : 'Member'),
                  phone: '',
                  email: inv.email,
                  cta: 'Edit',
                }))}
                studies={studies.map<AssociationDetailStudy>((s) => ({
                  id: s.id,
                  name: s.fileName,
                  uploader: `Myself. ${formatDate(s.createdAt)}`,
                  lastModified: formatDate(s.createdAt),
                  versions: '1 Founded',
                  status: 'Active',
                }))}
              />
            ) : (
              <div style={{ color: '#66717D', fontSize: '14px' }}>
                {loading ? 'Loading…' : 'Select an association to view details'}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

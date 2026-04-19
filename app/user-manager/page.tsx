'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Input } from '@/components/ui/input';

type Invite = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  designation?: string | null;
  status: string;
  associationId?: string | null;
  createdAt: string;
};

type Association = {
  id: string;
  associationName: string;
  address?: string;
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  awaiting_response: 'Awaiting Response',
  accepted: 'Active',
  declined: 'Declined',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function UserManagerPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/invite').then((r) => r.json()),
      fetch('/api/associations').then((r) => r.json()),
    ])
      .then(([inviteData, assocData]) => {
        const list: Invite[] = inviteData.invites ?? [];
        setInvites(list);
        setAssociations(assocData.associations ?? []);
        if (list.length > 0) setActiveId(list[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getAssociation = (id?: string | null): Association | undefined =>
    associations.find((a) => a.id === id);

  const filtered = invites.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(query.toLowerCase()),
  );

  const active = invites.find((u) => u.id === activeId) ?? invites[0];
  const activeAssoc = active ? getAssociation(active.associationId) : undefined;

  return (
    <div className="min-h-screen" style={{ background: '#F6F7F9', paddingTop: '64px' }}>
      <DashboardHeader />

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
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: 600,
              margin: 0,
            }}
          >
            <span>{loading ? '—' : invites.length}</span> User{invites.length !== 1 ? 's' : ''}{' '}
            <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>Found</span>
          </h1>
          <button
            type="button"
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
              cursor: 'pointer',
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.4} />
            Add New
          </button>
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
            minHeight: '780px',
          }}
        >
          {/* Left: user list */}
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

            {loading ? (
              <div style={{ color: '#66717D', fontSize: '14px', padding: '12px 4px' }}>
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ color: '#66717D', fontSize: '14px', padding: '12px 4px' }}>
                No users found.
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: '820px',
                  overflowY: 'auto',
                }}
                className="thin-scrollbar"
              >
                {filtered.map((u) => {
                  const isActive = u.id === activeId;
                  const assoc = getAssociation(u.associationId);
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setActiveId(u.id)}
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
                        {u.firstName} {u.lastName}
                      </div>
                      <div style={{ color: '#66717D', fontSize: '13px', lineHeight: 1.5 }}>
                        {u.designation || 'Member'}
                        {assoc ? ` at ${assoc.associationName}` : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          {/* Right: user detail */}
          <section style={{ padding: '20px 24px 28px' }}>
            {!active ? (
              <div style={{ color: '#66717D', fontSize: '15px', padding: '24px' }}>
                {loading ? 'Loading...' : 'No user selected.'}
              </div>
            ) : (
              <>
                <div
                  style={{
                    border: '1px solid #D7D7D7',
                    borderRadius: '7px',
                    overflow: 'hidden',
                    background: '#FFFFFF',
                    marginBottom: '24px',
                  }}
                >
                  {/* identity */}
                  <div
                    className="flex items-start justify-between"
                    style={{ padding: '20px 24px', gap: '16px' }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <h2
                        style={{
                          color: '#102C4A',
                          fontSize: '22px',
                          fontWeight: 600,
                          margin: 0,
                          marginBottom: '4px',
                        }}
                      >
                        {active.firstName} {active.lastName}
                      </h2>
                      <div style={{ color: '#66717D', fontSize: '14px' }}>
                        {active.designation || 'Member'}
                      </div>
                    </div>
                    <button
                      type="button"
                      style={{
                        padding: '8px 22px',
                        border: '1px solid #D7D7D7',
                        background: '#FFFFFF',
                        borderRadius: '9999px',
                        color: '#102C4A',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                  </div>

                  {/* association + email */}
                  <div
                    style={{
                      padding: '0 24px 20px',
                      color: '#102C4A',
                      fontSize: '14px',
                      lineHeight: 1.6,
                    }}
                  >
                    {activeAssoc ? (
                      <>
                        <div style={{ color: '#102C4A', fontWeight: 500, marginBottom: '2px' }}>
                          {activeAssoc.associationName}
                        </div>
                        {activeAssoc.address && (
                          <div style={{ color: '#66717D' }}>{activeAssoc.address}</div>
                        )}
                      </>
                    ) : (
                      <div style={{ color: '#66717D' }}>No association linked</div>
                    )}
                    <div style={{ color: '#66717D', marginTop: '4px' }}>{active.email}</div>
                  </div>

                  {/* meta strip */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      borderTop: '1px solid #D7D7D7',
                    }}
                  >
                    {[
                      { label: 'Invite By', value: 'Myself' },
                      { label: 'Invitation Date', value: formatDate(active.createdAt) },
                      {
                        label: 'Current Status',
                        value: STATUS_LABEL[active.status] ?? active.status,
                      },
                      { label: 'Last Active', value: '—' },
                    ].map((item, idx, arr) => (
                      <div
                        key={item.label}
                        style={{
                          padding: '16px 24px',
                          borderRight: idx === arr.length - 1 ? 'none' : '1px solid #D7D7D7',
                        }}
                      >
                        <div style={{ color: '#66717D', fontSize: '13px', marginBottom: '4px' }}>
                          {item.label}
                        </div>
                        <div style={{ color: '#102C4A', fontSize: '14px', fontWeight: 500 }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities table — placeholder until activity tracking exists */}
                <div
                  style={{
                    border: '1px solid #D7D7D7',
                    borderRadius: '7px',
                    overflow: 'hidden',
                    background: '#FFFFFF',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr',
                      padding: '14px 24px',
                      borderBottom: '1px solid #D7D7D7',
                      color: '#102C4A',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    <span>Activities</span>
                    <span>Date Time</span>
                  </div>
                  <div
                    style={{
                      padding: '32px 24px',
                      color: '#9CA3AF',
                      fontSize: '14px',
                      textAlign: 'center',
                    }}
                  >
                    No activity recorded yet.
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

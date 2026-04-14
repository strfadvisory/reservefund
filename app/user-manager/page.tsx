'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Input } from '@/components/ui/input';

type User = {
  id: string;
  name: string;
  role: string;
  association: string;
};

const USERS: User[] = [
  { id: '1', name: 'James Anderson', role: 'Field Manager', association: 'American Medical Association' },
  { id: '2', name: 'Daniel Carter', role: 'Field Manager', association: 'American Medical Association' },
  { id: '3', name: 'Christopher Hayes', role: 'Field Manager', association: 'American Medical Association' },
  { id: '4', name: 'Matthew Collins', role: 'Field Manager', association: 'American Medical Association' },
  { id: '5', name: 'James Anderson', role: 'Field Manager', association: 'American Medical Association' },
  { id: '6', name: 'Daniel Carter', role: 'Field Manager', association: 'American Medical Association' },
  { id: '7', name: 'Christopher Hayes', role: 'Field Manager', association: 'American Medical Association' },
  { id: '8', name: 'Matthew Collins', role: 'Field Manager', association: 'American Medical Association' },
  { id: '9', name: 'Daniel Carter', role: 'Field Manager', association: 'American Medical Association' },
  { id: '10', name: 'Christopher Hayes', role: 'Field Manager', association: 'American Medical Association' },
  { id: '11', name: 'Matthew Collins', role: 'Field Manager', association: 'American Medical Association' },
];

export default function UserManagerPage() {
  const [activeId, setActiveId] = useState('2');
  const [query, setQuery] = useState('');

  const filtered = USERS.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()),
  );

  const active = USERS.find((u) => u.id === activeId) ?? USERS[0];

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
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: 600,
              margin: 0,
            }}
          >
            <span>{USERS.length}</span> User{' '}
            <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>
              Founded
            </span>
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
                      {u.name}
                    </div>
                    <div
                      style={{
                        color: '#66717D',
                        fontSize: '13px',
                        lineHeight: 1.5,
                      }}
                    >
                      {u.role} at {u.association}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right: user detail */}
          <section style={{ padding: '20px 24px 28px' }}>
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
                    {active.name}
                  </h2>
                  <div style={{ color: '#66717D', fontSize: '14px' }}>
                    {active.role}
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
              {/* address */}
              <div
                style={{
                  padding: '0 24px 20px',
                  color: '#102C4A',
                  fontSize: '14px',
                  lineHeight: 1.6,
                }}
              >
                <div style={{ color: '#102C4A', fontWeight: 500, marginBottom: '2px' }}>
                  American Bar Association
                </div>
                <div style={{ color: '#66717D' }}>
                  330 N Wabash Ave, Chicago, IL 60611, USA, +018483 28293, +018483 28293, info@BarAssociation.com
                </div>
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
                  { label: 'Invitation Date', value: '20 Jan 2025 8:40 PM' },
                  { label: 'Correct Status', value: 'Active' },
                  { label: 'Last Active', value: '20 Jan 2025 8:40 PM' },
                ].map((item, idx, arr) => (
                  <div
                    key={item.label}
                    style={{
                      padding: '16px 24px',
                      borderRight:
                        idx === arr.length - 1 ? 'none' : '1px solid #D7D7D7',
                    }}
                  >
                    <div
                      style={{
                        color: '#66717D',
                        fontSize: '13px',
                        marginBottom: '4px',
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        color: '#102C4A',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities table */}
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
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    padding: '22px 24px',
                    borderBottom: i === 7 ? 'none' : '1px solid #F1F2F4',
                    alignItems: 'center',
                    gap: '24px',
                  }}
                >
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
          </section>
        </div>
      </div>
    </div>
  );
}

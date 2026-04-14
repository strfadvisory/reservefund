'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { AssociationDetail } from '@/components/association-detail';
import { Input } from '@/components/ui/input';

const FAQS = [
  'What is a reserve fund?',
  'Why is a reserve fund important for long-term planning?',
  'What is a reserve fund study?',
  'How often should a reserve study be updated?',
  'What is included in a reserve fund study?',
  'How is the reserve fund calculated?',
  'What is the difference between a reserve fund and an operating fund?',
  'How much money should be in a reserve fund?',
  'Who manages the reserve fund?',
  'What happens if the reserve fund is underfunded?',
  'How are reserve fund contributions determined?',
  'Can reserve funds be used for emergency expenses?',
  'What types of assets are covered in a reserve study?',
  'How does a reserve study help with budgeting?',
  'What is a reserve fund forecast?',
  'How do inflation and market changes affect reserve funds?',
  'Can reserve funds reduce unexpected costs?',
  'What are the risks of not having a reserve fund?',
];

export default function MyAssociationPage() {
  const [query, setQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(
    'What is included in a reserve fund study?',
  );

  const filtered = FAQS.filter((f) =>
    f.toLowerCase().includes(query.toLowerCase()),
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
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: 500,
              margin: 0,
            }}
          >
            My Association
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
          {/* Left: FAQ list */}
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
                placeholder="Find Question"
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
            <ul
              style={{
                listStyle: 'disc',
                margin: 0,
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                maxHeight: '780px',
                overflowY: 'auto',
                color: '#66717D',
              }}
              className="thin-scrollbar"
            >
              {filtered.map((q) => {
                const active = q === activeFaq;
                return (
                  <li key={q} style={{ lineHeight: 1.45 }}>
                    <button
                      type="button"
                      onClick={() => setActiveFaq(q)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: '#102C4A',
                        fontSize: '15px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        textDecoration: active ? 'underline' : 'none',
                        fontWeight: active ? 500 : 400,
                      }}
                    >
                      {q}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Right: association detail */}
          <section style={{ padding: '20px 24px 28px' }}>
            <AssociationDetail
              name="American Bar Association"
              address="330 N Wabash Ave, Chicago, IL 60611, USA, +018483 28293, +018483 28293, info@BarAssociation.com"
            />
          </section>
        </div>
      </div>
    </div>
  );
}

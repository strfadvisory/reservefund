import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import devData from '@/dev.json';

type DevPage = {
  title: string;
  path: string;
  description: string;
  category: string;
  status: string;
};

export default function Home() {
  const pages = (devData.pages as DevPage[]) ?? [];
  const grouped = pages.reduce<Record<string, DevPage[]>>((acc, page) => {
    (acc[page.category] ??= []).push(page);
    return acc;
  }, {});
  const categories = Object.keys(grouped);

  return (
    <div style={{ minHeight: '100vh', background: '#F6F7F9', color: '#102C4A' }}>
      <div
        className="mx-auto"
        style={{
          maxWidth: '1242px',
          padding: '48px 24px',
          display: 'grid',
          gridTemplateColumns: '353px 1fr',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* Left: static panel */}
        <aside
          style={{
            position: 'sticky',
            top: '48px',
            background: '#FFFFFF',
            border: '1px solid #D7D7D7',
            borderRadius: '7px',
            padding: '28px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#66717D',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Dev Index
          </div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 600,
              lineHeight: 1.25,
              marginBottom: '12px',
            }}
          >
            Reserve Study Comm.
          </h1>
          <p
            style={{
              color: '#66717D',
              fontSize: '16px',
              lineHeight: 1.5,
              marginBottom: '24px',
            }}
          >
            A directory of every page in this build. Data is driven by{' '}
            <code
              style={{
                background: '#F1F4F9',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              dev.json
            </code>
            .
          </p>

          <div
            style={{
              borderTop: '1px solid #D7D7D7',
              paddingTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ fontSize: '14px', color: '#66717D' }}>Categories</div>
            {categories.map((cat) => (
              <a
                key={cat}
                href={`#cat-${cat}`}
                style={{
                  color: '#102C4A',
                  fontSize: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                }}
              >
                <span>{cat}</span>
                <span style={{ color: '#66717D' }}>{grouped[cat].length}</span>
              </a>
            ))}
          </div>
        </aside>

        {/* Right: dynamic list from dev.json */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {categories.map((cat) => (
            <section
              key={cat}
              id={`cat-${cat}`}
              style={{
                background: '#FFFFFF',
                border: '1px solid #D7D7D7',
                borderRadius: '7px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '18px 28px',
                  borderBottom: '1px solid #D7D7D7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h2 style={{ fontSize: '20px', fontWeight: 600 }}>{cat}</h2>
                <span style={{ color: '#66717D', fontSize: '14px' }}>
                  {grouped[cat].length} page{grouped[cat].length === 1 ? '' : 's'}
                </span>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {grouped[cat].map((page, i) => (
                  <li
                    key={page.path}
                    style={{
                      borderTop: i === 0 ? 'none' : '1px solid #ECEEF1',
                    }}
                  >
                    <Link
                      href={page.path}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto auto',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '18px 28px',
                        textDecoration: 'none',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            color: '#102C4A',
                            fontSize: '16px',
                            fontWeight: 500,
                            marginBottom: '4px',
                          }}
                        >
                          {page.title}
                        </div>
                        <div
                          style={{
                            color: '#66717D',
                            fontSize: '14px',
                            lineHeight: 1.5,
                          }}
                        >
                          {page.description}
                        </div>
                        <div
                          style={{
                            marginTop: '6px',
                            color: '#0E519B',
                            fontSize: '13px',
                            fontFamily:
                              'ui-monospace, SFMono-Regular, Menlo, monospace',
                          }}
                        >
                          {page.path}
                        </div>
                      </div>
                      <span
                        style={{
                          color:
                            page.status === 'Ready' ? '#12B76A' : '#66717D',
                          fontSize: '13px',
                          fontWeight: 500,
                        }}
                      >
                        {page.status}
                      </span>
                      <ArrowUpRight
                        className="w-5 h-5"
                        style={{ color: '#66717D' }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

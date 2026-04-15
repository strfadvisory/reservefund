'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, UserCircle2, ChevronDown, LogOut } from 'lucide-react';
import roleMapJson from '@/config.json';

const roleMap: Record<string, string> = (roleMapJson as any).roles as Record<string, string>;

const companyTypeLabels: Record<string, string> = {
  management: 'Management Company',
  bank: 'Bank Office',
  reserve: 'Reserve Study Company',
  advisor: 'Investor Advisor',
  board: 'Board Members',
  other: 'Other',
};

const NEXT_STEP_ITEMS = Array.from({ length: 6 }).map(() => ({
  name: 'Apex Global Association Solutions',
  role: 'Onside Manager',
}));

const NAV_ITEMS: { label: string; href: string; match: string[] }[] = [
  { label: 'Dashboard', href: '/dashboard', match: ['/dashboard', '/study'] },
  { label: 'Simulator', href: '/simulator', match: ['/simulator'] },
  { label: 'Associations', href: '/associations', match: ['/associations', '/my-association'] },
  { label: 'User Manager', href: '/user-manager', match: ['/user-manager'] },
  { label: 'Reserve Studies', href: '/reserve-studies', match: ['/reserve-studies'] },
  { label: 'Learning Center', href: '/learning-center', match: ['/learning-center'] },
];

export type DashboardHeaderProps = {
  company?: string;
  role?: string;
};

export function DashboardHeader({
  company = 'Apex Global Assoc...',
  role = 'Super Admin',
}: DashboardHeaderProps) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(2);
  const [mounted, setMounted] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>('/images/clogo.png');
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [roleName, setRoleName] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const u = data?.user;
        if (!u) return;
        if (u.logoFileId) setLogoSrc(`/api/profile/logo/${u.logoFileId}`);
        if (u.companyName) setCompanyName(u.companyName);
        if (u.companyType && companyTypeLabels[u.companyType]) setRoleName(companyTypeLabels[u.companyType]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [userMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUserMenuOpen(false);
    router.push('/login');
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
    <header
      className="flex items-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: '#0E519B',
        width: '100%',
        paddingLeft: '32px',
        paddingRight: '32px',
        zIndex: 50,
      }}
    >
      {/* Logo + Company */}
      <div className="flex items-center" style={{ gap: '12px' }}>
        <img
          src={logoSrc}
          alt="Logo"
          onError={() => setLogoSrc('/images/clogo.png')}
          style={{ width: '36px', height: '36px', objectFit: 'contain', background: '#fff', borderRadius: '6px' }}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex flex-col"
          style={{
            lineHeight: 1.2,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            padding: 0,
          }}
        >
          <div
            className="flex items-center"
            style={{ gap: '6px', color: '#FFFFFF', fontSize: '16px', fontWeight: 600 }}
          >
            {companyName || company}
            <ChevronDown className="w-4 h-4" style={{ color: '#FFFFFF' }} />
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{roleName || role}</div>
        </button>
      </div>

      {/* Nav */}
      <nav
        className="flex items-center"
        style={{ gap: '40px', marginLeft: '48px' }}
      >
        {NAV_ITEMS.map((item) => {
          const active = item.match.some((m) => pathname.startsWith(m));
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative"
              style={{
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: active ? 600 : 500,
                textDecoration: 'none',
                padding: '22px 0',
              }}
            >
              {item.label}
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '3px',
                    background: '#12B76A',
                    borderRadius: '3px 3px 0 0',
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right icons */}
      <div
        className="flex items-center"
        style={{ gap: '20px', marginLeft: 'auto' }}
      >
        <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Bell className="w-6 h-6" style={{ color: '#FFFFFF' }} strokeWidth={1.75} />
        </button>
        <div ref={userMenuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((v) => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
          >
            <UserCircle2 className="w-8 h-8" style={{ color: '#FFFFFF' }} strokeWidth={1.5} />
          </button>
          {userMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                minWidth: '180px',
                background: '#FFFFFF',
                border: '1px solid #D7D7D7',
                borderRadius: '7px',
                boxShadow: '0 10px 30px rgba(16, 44, 74, 0.15)',
                padding: '6px',
                zIndex: 60,
              }}
            >
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center"
                style={{
                  width: '100%',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  color: '#102C4A',
                  fontSize: '14px',
                  fontWeight: 500,
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F4F6F8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <LogOut className="w-4 h-4" style={{ color: '#102C4A' }} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Choose for next step Modal */}
    {mounted && open &&
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
          onClick={() => setOpen(false)}
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
                Choose for next step
              </h2>
            </div>

            {/* Body */}
            <div style={{ padding: '8px 0' }}>
              {NEXT_STEP_ITEMS.map((item, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between"
                    style={{
                      padding: '16px 32px',
                      background: isSelected ? '#F4F6F8' : 'transparent',
                      gap: '16px',
                    }}
                  >
                    <div className="flex items-center" style={{ gap: '16px', minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '10px',
                          flexShrink: 0,
                          background:
                            'conic-gradient(from 45deg, #F59E0B, #EF4444, #EC4899, #8B5CF6, #3B82F6, #10B981, #F59E0B)',
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          className="font-semibold"
                          style={{
                            color: '#102C4A',
                            fontSize: '16px',
                            lineHeight: 1.3,
                            marginBottom: '4px',
                          }}
                        >
                          {item.name}
                        </div>
                        <div style={{ color: '#66717D', fontSize: '14px' }}>
                          {item.role}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIdx(idx);
                        setOpen(false);
                      }}
                      style={{
                        flexShrink: 0,
                        padding: '10px 24px',
                        borderRadius: '7px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        border: isSelected ? 'none' : '1px solid #D7D7D7',
                        background: isSelected ? '#1F2A44' : '#fff',
                        color: isSelected ? '#FFFFFF' : '#102C4A',
                      }}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

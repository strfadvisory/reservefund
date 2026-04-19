'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, UserCircle2, ChevronDown, LogOut, X, Send, Bot, User } from 'lucide-react';
import { useOrg } from '@/components/org-context';
import { COMPANY_TYPE_LABELS } from '@/lib/company-types';

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
};

export function DashboardHeader({
  company = 'Apex Global Assoc...',
}: DashboardHeaderProps) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const { orgs, orgsLoaded, selectedOrgId, selectedOrg, setSelectedOrgId } = useOrg();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>('/images/clogo.png');
  const [user, setUser] = useState<any>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'bot'; message: string; timestamp: Date }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [profileImageSrc, setProfileImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

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
        setUser(u);
        if (u.logoFileId) setLogoSrc(`/api/profile/logo/${u.logoFileId}`);
        if (u.profileImageFileId) setProfileImageSrc(`/api/profile/image/${u.profileImageFileId}`);
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
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
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

  const handleSelectOrg = (id: string) => {
    setSelectedOrgId(id);
    setOpen(false);
  };

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
            {selectedOrg?.name || company}
            <ChevronDown className="w-4 h-4" style={{ color: '#FFFFFF' }} />
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
            {COMPANY_TYPE_LABELS[selectedOrg?.companyType ?? ''] || selectedOrg?.companyType || ''}
          </div>
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
                minWidth: '240px',
                background: '#FFFFFF',
                border: '1px solid #D7D7D7',
                borderRadius: '7px',
                boxShadow: '0 10px 30px rgba(16, 44, 74, 0.15)',
                padding: '8px',
                zIndex: 60,
              }}
            >
              {/* User Info */}
              <div style={{ padding: '12px', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ color: '#102C4A', fontSize: '16px', fontWeight: 600, marginBottom: '2px' }}>
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'User'}
                </div>
                <div style={{ color: '#66717D', fontSize: '12px', lineHeight: 1.4 }}>
                  {user?.designation || 'Property manager'} @
                </div>
                <div style={{ color: '#66717D', fontSize: '12px', lineHeight: 1.4 }}>
                  {selectedOrg?.name || user?.companyName || 'Manage company name'}
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '4px 0' }}>
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    setChatOpen(true);
                    if (chatMessages.length === 0) {
                      setChatMessages([{
                        role: 'bot',
                        message: 'Hello! I\'m your Reserve Fund Expert Assistant. How can I help you today?',
                        timestamp: new Date(),
                      }]);
                    }
                  }}
                  style={{
                    width: '100%',
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
                  Call with Expert
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    setChangePasswordOpen(true);
                  }}
                  style={{
                    width: '100%',
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
                  Change Password
                </button>
              </div>

              {/* Logout */}
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '4px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'none',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    color: '#102C4A',
                    fontSize: '16px',
                    fontWeight: 600,
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F4F6F8')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Call with Expert Chat Modal */}
    {mounted && chatOpen &&
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
          onClick={() => setChatOpen(false)}
        >
          <div
            className="bg-white"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '600px',
              height: '700px',
              maxWidth: '100%',
              maxHeight: '90vh',
              border: '1px solid #D7D7D7',
              borderRadius: '7px',
              boxShadow: '0 20px 60px rgba(16, 44, 74, 0.25)',
              margin: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #D7D7D7',
                background: '#0E519B',
                borderRadius: '7px 7px 0 0',
              }}
            >
              <div className="flex items-center" style={{ gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot className="w-6 h-6" style={{ color: '#0E519B' }} />
                </div>
                <div>
                  <h2
                    className="font-semibold"
                    style={{
                      color: '#FFFFFF',
                      fontSize: '18px',
                      lineHeight: 1.3,
                    }}
                  >
                    Expert Assistant
                  </h2>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                    Online
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '5px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              >
                <X className="w-5 h-5" style={{ color: '#FFFFFF' }} />
              </button>
            </div>

            {/* Chat Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                background: '#F9FAFB',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className="flex"
                  style={{
                    gap: '12px',
                    alignItems: 'flex-start',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: msg.role === 'bot' ? '#0E519B' : '#12B76A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden',
                    }}
                  >
                    {msg.role === 'bot' ? (
                      <Bot className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                    ) : profileImageSrc ? (
                      <img
                        src={profileImageSrc}
                        alt="User"
                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const icon = document.createElement('div');
                            icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                            parent.appendChild(icon);
                          }
                        }}
                      />
                    ) : (
                      <User className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                    )}
                  </div>
                  <div
                    style={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: msg.role === 'bot' ? '#FFFFFF' : '#0E519B',
                        color: msg.role === 'bot' ? '#102C4A' : '#FFFFFF',
                        fontSize: '14px',
                        lineHeight: 1.5,
                        border: msg.role === 'bot' ? '1px solid #E5E7EB' : 'none',
                        boxShadow: msg.role === 'bot' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      {msg.message}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#9CA3AF',
                        paddingLeft: msg.role === 'bot' ? '4px' : '0',
                        paddingRight: msg.role === 'user' ? '4px' : '0',
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex" style={{ gap: '12px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#0E519B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Bot className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                  </div>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      display: 'flex',
                      gap: '4px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#9CA3AF',
                        animation: 'bounce 1.4s infinite ease-in-out both',
                        animationDelay: '-0.32s',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#9CA3AF',
                        animation: 'bounce 1.4s infinite ease-in-out both',
                        animationDelay: '-0.16s',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#9CA3AF',
                        animation: 'bounce 1.4s infinite ease-in-out both',
                      }}
                    />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div
              style={{
                padding: '20px 24px',
                borderTop: '1px solid #D7D7D7',
                background: '#FFFFFF',
                borderRadius: '0 0 7px 7px',
              }}
            >
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!chatInput.trim() || chatLoading) return;

                  const userMessage = chatInput.trim();
                  setChatInput('');
                  
                  const newUserMessage = { role: 'user' as const, message: userMessage, timestamp: new Date() };
                  setChatMessages((prev) => [...prev, newUserMessage]);
                  setChatLoading(true);

                  try {
                    const response = await fetch('/api/chat', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        messages: [...chatMessages, newUserMessage],
                      }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                      setChatMessages((prev) => [
                        ...prev,
                        {
                          role: 'bot',
                          message: data.error || 'Sorry, I encountered an error. Please try again.',
                          timestamp: new Date(),
                        },
                      ]);
                      setChatLoading(false);
                      return;
                    }

                    setChatMessages((prev) => [
                      ...prev,
                      { role: 'bot', message: data.message, timestamp: new Date() },
                    ]);
                  } catch (error) {
                    setChatMessages((prev) => [
                      ...prev,
                      {
                        role: 'bot',
                        message: 'Sorry, I\'m having trouble connecting. Please try again.',
                        timestamp: new Date(),
                      },
                    ]);
                  } finally {
                    setChatLoading(false);
                  }
                }}
                className="flex"
                style={{ gap: '12px', alignItems: 'center' }}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={chatLoading}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #D7D7D7',
                    borderRadius: '7px',
                    fontSize: '14px',
                    color: '#102C4A',
                    outline: 'none',
                    background: chatLoading ? '#F9FAFB' : '#FFFFFF',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#0E519B')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#D7D7D7')}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  style={{
                    padding: '12px',
                    border: 'none',
                    borderRadius: '7px',
                    background: !chatInput.trim() || chatLoading ? '#9CA3AF' : '#0E519B',
                    color: '#FFFFFF',
                    cursor: !chatInput.trim() || chatLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

    {/* Change Password Modal */}
    {mounted && changePasswordOpen &&
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
          onClick={() => {
            setChangePasswordOpen(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError('');
            setPasswordSuccess(false);
          }}
        >
          <div
            className="bg-white"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '500px',
              maxWidth: '100%',
              border: '1px solid #D7D7D7',
              borderRadius: '7px',
              boxShadow: '0 20px 60px rgba(16, 44, 74, 0.25)',
              margin: 'auto',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between"
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
                Change Password
              </h2>
              <button
                type="button"
                onClick={() => {
                  setChangePasswordOpen(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                  setPasswordSuccess(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X className="w-5 h-5" style={{ color: '#66717D' }} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '32px' }}>
              {passwordSuccess ? (
                <div
                  style={{
                    padding: '16px',
                    background: '#D1FAE5',
                    border: '1px solid #10B981',
                    borderRadius: '7px',
                    color: '#065F46',
                    fontSize: '14px',
                    marginBottom: '24px',
                  }}
                >
                  Password changed successfully!
                </div>
              ) : null}

              {passwordError && (
                <div
                  style={{
                    padding: '16px',
                    background: '#FEE2E2',
                    border: '1px solid #EF4444',
                    borderRadius: '7px',
                    color: '#991B1B',
                    fontSize: '14px',
                    marginBottom: '24px',
                  }}
                >
                  {passwordError}
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setPasswordError('');
                  setPasswordSuccess(false);

                  if (!currentPassword || !newPassword || !confirmPassword) {
                    setPasswordError('All fields are required');
                    return;
                  }

                  if (newPassword.length < 8) {
                    setPasswordError('New password must be at least 8 characters');
                    return;
                  }

                  if (newPassword !== confirmPassword) {
                    setPasswordError('New passwords do not match');
                    return;
                  }

                  setPasswordLoading(true);

                  try {
                    const res = await fetch('/api/auth/change-password', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ currentPassword, newPassword }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                      setPasswordError(data.error || 'Failed to change password');
                      setPasswordLoading(false);
                      return;
                    }

                    setPasswordSuccess(true);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordLoading(false);

                    setTimeout(() => {
                      setChangePasswordOpen(false);
                      setPasswordSuccess(false);
                    }, 2000);
                  } catch (error) {
                    setPasswordError('Failed to change password');
                    setPasswordLoading(false);
                  }
                }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#102C4A',
                      fontSize: '14px',
                      fontWeight: 500,
                      marginBottom: '8px',
                    }}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #D7D7D7',
                      borderRadius: '7px',
                      fontSize: '14px',
                      color: '#102C4A',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#0E519B')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#D7D7D7')}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#102C4A',
                      fontSize: '14px',
                      fontWeight: 500,
                      marginBottom: '8px',
                    }}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #D7D7D7',
                      borderRadius: '7px',
                      fontSize: '14px',
                      color: '#102C4A',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#0E519B')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#D7D7D7')}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      color: '#102C4A',
                      fontSize: '14px',
                      fontWeight: 500,
                      marginBottom: '8px',
                    }}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #D7D7D7',
                      borderRadius: '7px',
                      fontSize: '14px',
                      color: '#102C4A',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#0E519B')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#D7D7D7')}
                  />
                </div>

                <div className="flex" style={{ gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setChangePasswordOpen(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordError('');
                      setPasswordSuccess(false);
                    }}
                    style={{
                      padding: '12px 24px',
                      border: '1px solid #D7D7D7',
                      borderRadius: '7px',
                      background: '#FFFFFF',
                      color: '#102C4A',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '7px',
                      background: passwordLoading ? '#9CA3AF' : '#0E519B',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: passwordLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {passwordLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

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
              {!orgsLoaded && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#66717D', fontSize: '14px' }}>
                  Loading…
                </div>
              )}
              {orgsLoaded && orgs.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#66717D', fontSize: '14px' }}>
                  No organizations available.
                </div>
              )}
              {orgsLoaded && orgs.map((item) => {
                const isSelected = item.id === (selectedOrg?.id ?? selectedOrgId);
                return (
                  <div
                    key={item.id}
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
                          overflow: 'hidden',
                          background: '#F1F4F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.logoFileId ? (
                          <img
                            src={`/api/profile/logo/${item.logoFileId}`}
                            alt={item.name}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            style={{ width: '52px', height: '52px', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ color: '#102C4A', fontSize: '20px', fontWeight: 700 }}>
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
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
                          {item.roleLabel}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectOrg(item.id)}
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

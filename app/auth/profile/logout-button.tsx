'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.replace('/auth/register');
    router.refresh();
  }

  return (
    <Button onClick={handleLogout} disabled={loading} variant="outline">
      {loading ? 'Logging out…' : 'Log out'}
    </Button>
  );
}

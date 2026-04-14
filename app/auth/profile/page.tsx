import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { LeftPanel } from '@/components/left-panel';
import { PageFooter } from '@/components/page-footer';
import { LogoutButton } from './logout-button';

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect('/auth/register');

  const rows: [string, string | null][] = [
    ['Company Name', user.companyName],
    ['Company Type', user.companyType],
    ['First Name', user.firstName],
    ['Last Name', user.lastName],
    ['Designation', user.designation],
    ['Phone', user.phone],
    ['Email', user.email],
    ['Verified', user.verified ? 'Yes' : 'No'],
  ];

  return (
    <div className="min-h-screen bg-white flex">
      <LeftPanel />
      <div className="flex-1 min-w-0 flex justify-center items-start overflow-auto py-12 px-6 md:ml-[353px]">
        <div className="w-full flex flex-col my-auto" style={{ maxWidth: '643px' }}>
          <div className="bg-white" style={{ border: '1px solid #D7D7D7', borderRadius: '7px' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #D7D7D7' }}>
              <h1 className="font-semibold" style={{ color: '#102C4A', fontSize: '24px' }}>
                Welcome, {user.firstName ?? 'there'}
              </h1>
              <p style={{ color: '#66717D', fontSize: '16px', marginTop: '4px' }}>
                You are logged in. Here is what we have on file.
              </p>
            </div>

            <div style={{ padding: '24px 32px' }}>
              <dl>
                {rows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-2" style={{ padding: '10px 0', borderBottom: '1px solid #F1F2F4' }}>
                    <dt style={{ color: '#66717D', fontSize: '16px' }}>{k}</dt>
                    <dd style={{ color: '#102C4A', fontSize: '16px' }}>{v ?? '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div style={{ padding: '20px 32px', borderTop: '1px solid #D7D7D7' }}>
              <LogoutButton />
            </div>
          </div>
          <PageFooter />
        </div>
      </div>
    </div>
  );
}

import Image from 'next/image';

export function LeftPanel() {
  return (
    <aside
      className="shrink-0 hidden md:block"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '353px',
        height: '100vh',
        backgroundImage: "url('/images/leftbg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 10,
      }}
    >
      <div style={{ paddingTop: '40px', paddingLeft: '40px' }}>
        <Image
          src="/images/logo.png"
          alt="Reserve Fund Advisers LLC"
          width={200}
          height={56}
          priority
          style={{ height: 'auto', width: '200px' }}
        />
      </div>
    </aside>
  );
}

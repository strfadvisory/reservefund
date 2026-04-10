export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'light-dark(#fafafa, #000)',
      color: 'light-dark(#18181b, #fafafa)',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '600',
        marginBottom: '1rem',
        letterSpacing: '-0.025em'
      }}>
        Coming Soon
      </h1>
      <p style={{
        fontSize: '1.125rem',
        color: 'light-dark(#71717a, #a1a1aa)',
        maxWidth: '32rem'
      }}>
        We're working on something exciting. Stay tuned!
      </p>
    </div>
  );
}

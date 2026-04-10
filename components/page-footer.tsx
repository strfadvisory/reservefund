export function PageFooter() {
  return (
    <div style={{ marginTop: '32px' }}>
      <div className="flex justify-between items-start">
        <div
          className="flex flex-col gap-2"
          style={{ color: '#404040', fontSize: '14px' }}
        >
          <a
            href="mailto:info@reservefundadvisory.com"
            className="flex items-center gap-2 hover:opacity-80"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            <span>@</span> info@reservefundadvisory.com
          </a>
          <a
            href="tel:727-788-4800"
            className="flex items-center gap-2 hover:opacity-80"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            <span>☎</span> 727-788-4800
          </a>
        </div>
        <div
          className="flex flex-col items-end gap-2"
          style={{ color: '#404040', fontSize: '14px', textAlign: 'right' }}
        >
          <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>
            Privacy Policy
          </a>
          <span>Copyright 2026 @ reservefundadvisory.com</span>
        </div>
      </div>
    </div>
  );
}

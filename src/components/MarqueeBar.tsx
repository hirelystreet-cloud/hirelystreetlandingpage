// MarqueeBar.tsx
// Fixed announcement strip that sits at z-[49] behind the nav (z-50).
// The nav is offset to top-[40px] to sit cleanly below this bar.
// Rendered at the App level so it is completely independent of Hero layout.

export function MarqueeBar() {
  const text =
    'COMING SOON · HIRELYSTREET · EVERY SERVICE ONE PLACE · ONLINE FREELANCE + LOCAL PROVIDERS · JOIN THE WAITLIST · '

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 49,
        height: 40,
        background: '#000000',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="marquee-track"
        style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap' }}
      >
        {/* Exactly 2 copies so CSS -50% creates a seamless loop */}
        {[0, 1].map((i) => (
          <span
            key={i}
            aria-hidden={i === 1 ? 'true' : undefined}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.055em',
              color: '#ffffff',
              textTransform: 'uppercase',
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}


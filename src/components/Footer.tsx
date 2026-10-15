interface FooterProps {
  onWaitlistClick: (type: 'customer' | 'provider') => void
  onInvestorClick: () => void
}

export function Footer({ onWaitlistClick, onInvestorClick }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer
      className="bg-carbon"
      style={{
        background: '#000000',
        borderTop: '1px solid #333',
        padding: 'clamp(48px, 8vw, 80px) 0 40px',
      }}
      aria-label="Site footer"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {/* Top: brand + nav */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <a
              href="/"
              aria-label="HirelyStreet home"
              className="inline-flex items-center gap-2"
            >
              <img
                src="/logo.png"
                alt="HirelyStreet logo"
                width={32}
                height={32}
                className="shrink-0 object-contain"
              />
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 900,
                  fontSize: 22,
                  letterSpacing: '-0.03em',
                  color: '#ffffff',
                }}
              >
                Hirely<span style={{ color: '#55db9c' }}>Street</span>
              </span>
            </a>
            <p
              style={{
                fontFamily: "'Rubik', sans-serif",
                fontSize: 14,
                lineHeight: 1.7,
                color: '#888',
                maxWidth: 320,
                marginTop: 16,
              }}
            >
              A unified marketplace connecting customers with online freelancers
              and offline hyperlocal service providers across India.
              <br />
              <strong style={{ color: '#aaa' }}>Pre-launch.</strong> Building something worth waiting for.
            </p>
            <a
              href="mailto:founders@hirelystreet.com"
              style={{
                display: 'inline-block',
                marginTop: 16,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: '#55db9c',
                textDecoration: 'none',
                letterSpacing: '0.01em',
              }}
            >
              founders@hirelystreet.com
            </a>
          </div>

          {/* Nav columns */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#555',
                  marginBottom: 16,
                }}
              >
                Product
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'How it works', id: 'product' },
                  { label: 'For customers', id: 'product' },
                  { label: 'For providers', id: 'product' },
                ].map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => {
                        const el = document.getElementById(link.id)
                        el?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        fontFamily: "'Rubik', sans-serif",
                        fontSize: 14,
                        color: '#888',
                        textAlign: 'left',
                      }}
                      className="hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#555',
                  marginBottom: 16,
                }}
              >
                Join
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li>
                  <button
                    onClick={() => onWaitlistClick('customer')}
                    type="button"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: "'Rubik', sans-serif", fontSize: 14, color: '#888', textAlign: 'left' }}
                    className="hover:text-white transition-colors duration-150"
                  >
                    Customer waitlist
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onWaitlistClick('provider')}
                    type="button"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: "'Rubik', sans-serif", fontSize: 14, color: '#888', textAlign: 'left' }}
                    className="hover:text-white transition-colors duration-150"
                  >
                    Provider waitlist
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onInvestorClick()}
                    type="button"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: "'Rubik', sans-serif", fontSize: 14, color: '#888', textAlign: 'left' }}
                    className="hover:text-white transition-colors duration-150"
                  >
                    Investor inquiry
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#555',
                  marginBottom: 16,
                }}
              >
                Legal
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Privacy policy', href: '/privacy' },
                  { label: 'Terms of service', href: '/terms' },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        fontFamily: "'Rubik', sans-serif",
                        fontSize: 14,
                        color: '#888',
                        textDecoration: 'none',
                      }}
                      className="hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #222',
            paddingTop: 24,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              fontFamily: "'Rubik', sans-serif",
              fontSize: 12,
              color: '#555',
              margin: 0,
            }}
          >
            © {year} HirelyStreet. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "'Rubik', sans-serif",
              fontSize: 12,
              color: '#555',
              margin: 0,
            }}
          >
            Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  )
}

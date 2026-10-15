import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowRight } from 'lucide-react'

interface InvestorSectionProps {
  onInvestorClick: () => void
}

export function InvestorSection({ onInvestorClick }: InvestorSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="investors"
      className="bg-paper-white"
      style={{
        padding: 'clamp(64px, 10vw, 120px) 0',
        borderTop: '1px solid #000',
      }}
      aria-labelledby="investor-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left: restrained statement */}
          <div className="lg:col-span-7">
            <span className="sticker-tag mb-8 inline-flex" style={{ background: '#dceeff' }}>
              Investors
            </span>
            <h2
              id="investor-heading"
              className="text-section-head"
              style={{ color: '#000', marginBottom: 24 }}
            >
              Building the next generation of service marketplaces.
            </h2>
            <p
              style={{
                fontFamily: "'Rubik', sans-serif",
                fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
                lineHeight: 1.7,
                color: '#333',
                maxWidth: 520,
                marginBottom: 40,
              }}
            >
              HirelyStreet brings online talent and local services into one
              marketplace. If you're interested in our vision, we'd welcome a
              conversation.
            </p>

            <button
              className="btn-primary"
              onClick={onInvestorClick}
              type="button"
              style={{ fontSize: 15, padding: '14px 32px' }}
            >
              Discuss HirelyStreet
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Right: understated visual composition */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div
              style={{
                background: '#000',
                border: '1px solid #000',
                borderRadius: 40,
                padding: 'clamp(32px, 5vw, 48px)',
                color: '#fff',
              }}
            >
              <div style={{ marginBottom: 32 }}>
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#888',
                    marginBottom: 16,
                  }}
                >
                  The opportunity
                </p>
                {[
                  'One unified marketplace, not fragmented listings',
                  'Online freelancers + offline local providers',
                  'Request-driven discovery, not keyword search',
                  'India-first, built for real service needs',
                ].map((point, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      paddingTop: 14,
                      paddingBottom: 14,
                      borderTop: i > 0 ? '1px solid #333' : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#55db9c',
                        flexShrink: 0,
                        marginTop: 8,
                      }}
                      aria-hidden="true"
                    />
                    <p
                      style={{
                        fontFamily: "'Rubik', sans-serif",
                        fontSize: 14,
                        color: '#ccc',
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: '#111',
                  border: '1px solid #333',
                  borderRadius: 16,
                  padding: '16px 20px',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Rubik', sans-serif",
                    fontSize: 13,
                    color: '#888',
                    margin: '0 0 4px',
                  }}
                >
                  Reach the team
                </p>
                <a
                  href="mailto:founders@hirelystreet.com"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    color: '#55db9c',
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                  }}
                >
                  founders@hirelystreet.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

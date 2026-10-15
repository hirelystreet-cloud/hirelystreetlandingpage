import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowRight } from 'lucide-react'

interface TwoSidesProps {
  onWaitlistClick: (type: 'customer' | 'provider') => void
}

export function TwoSides({ onWaitlistClick }: TwoSidesProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      className="bg-concrete-gray"
      style={{ padding: 'clamp(64px, 10vw, 120px) 0' }}
      aria-labelledby="two-sides-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="sticker-tag mb-6 inline-flex" style={{ background: '#ffffff' }}>
            Two sides, one marketplace
          </span>
          <h2
            id="two-sides-heading"
            className="text-section-head mt-4"
            style={{ color: '#000', maxWidth: 560 }}
          >
            Built for the people who need,
            and the people who do.
          </h2>
        </motion.div>

        {/* Split layout with deliberately unequal panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: '#dceeff',
              border: '1px solid #000',
              borderRadius: 40,
              padding: 'clamp(32px, 5vw, 56px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
              minHeight: 440,
            }}
          >
            {/* Visual element: request bubbles */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }} aria-hidden="true">
              {[
                'Fix my tap',
                'Design my logo',
                'Build a website',
                'Tutor my child',
                'Clean my home',
                'Tax filing help',
              ].map((item, i) => (
                <span
                  key={item}
                  style={{
                    background: i % 2 === 0 ? '#ffffff' : '#000',
                    color: i % 2 === 0 ? '#000' : '#ffffff',
                    border: '1px solid #000',
                    borderRadius: 1600,
                    padding: '7px 16px',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: '0.02em',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(0.75rem, 1.2vw, 0.8rem)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#555',
                  marginBottom: 12,
                }}
              >
                For customers
              </p>
              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: '#000',
                  marginBottom: 16,
                }}
              >
                Find the right people for any service.
              </h3>
              <p
                style={{
                  fontFamily: "'Rubik', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: '#333',
                  maxWidth: 400,
                  marginBottom: 28,
                }}
              >
                Whether online or nearby, HirelyStreet is building one place
                to describe what you need and connect with professionals who
                can deliver it.
              </p>
              <button
                className="btn-primary"
                onClick={() => onWaitlistClick('customer')}
                type="button"
                style={{ fontSize: 14 }}
              >
                Join as a customer
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>

          {/* Provider panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: '#000000',
              border: '1px solid #000',
              borderRadius: 40,
              padding: 'clamp(32px, 5vw, 56px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
              minHeight: 440,
            }}
          >
            {/* Visual: provider profile stickers */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }} aria-hidden="true">
              {[
                { role: 'Graphic design', color: '#55db9c' },
                { role: 'Home repair', color: '#ffd731' },
                { role: 'Coaching', color: '#e9ccff' },
                { role: 'Photography', color: '#fb4903' },
                { role: 'Web development', color: '#4da2ff' },
              ].map((p) => (
                <div
                  key={p.role}
                  style={{
                    background: p.color,
                    border: '1px solid #fff',
                    borderRadius: 1600,
                    padding: '7px 16px',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: '#000',
                    letterSpacing: '0.02em',
                  }}
                >
                  {p.role}
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(0.75rem, 1.2vw, 0.8rem)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#888',
                  marginBottom: 12,
                }}
              >
                For service providers
              </p>
              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: '#ffffff',
                  marginBottom: 16,
                }}
              >
                Bring your skills to people looking for them.
              </h3>
              <p
                style={{
                  fontFamily: "'Rubik', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: '#aaa',
                  maxWidth: 400,
                  marginBottom: 28,
                }}
              >
                HirelyStreet is building a marketplace to connect you with
                customers who need services like yours, online or in your city.
              </p>
              <button
                className="btn-ghost"
                onClick={() => onWaitlistClick('provider')}
                type="button"
                style={{ fontSize: 14 }}
              >
                Join as a provider
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Ribbon3D } from './Ribbon3D'

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface HeroProps {
  onWaitlistClick: (type: 'customer' | 'provider') => void
  onInvestorClick: () => void
}

// Decorative sticker pills
const STICKERS = [
  { label: 'Online freelance', color: '#55db9c', rotate: -8, x: '7%',  y: '22%' },
  { label: 'Local services',  color: '#e9ccff', rotate:  6, x: '80%', y: '12%' },
  { label: 'Any category',    color: '#ffd731', rotate: -4, x: '76%', y: '74%' },
  { label: 'Your city',       color: '#fb4903', rotate: 10, x: '2%',  y: '84%' },
]

// Independent float config: unique speed + amplitude per sticker
const STICKER_FLOATS = [
  { y: -12, duration: 3.4 },
  { y: -10, duration: 3.8 },
  { y: -14, duration: 4.2 },
  { y:  -9, duration: 3.1 },
]

// Provider cards with tuned float parameters
const PROVIDERS = [
  {
    name: 'Priya R.',
    role: 'Graphic designer',
    location: 'Mumbai',
    color: '#55db9c',
    top: -30,
    left: -72,
    floatDuration: 3.2,
    floatY: -12,
  },
  {
    name: 'Arjun M.',
    role: 'Brand consultant',
    location: 'Remote',
    color: '#e9ccff',
    bottom: -30,
    right: -30,
    floatDuration: 3.8,
    floatY: -14,
  },
  {
    name: 'Studio KO',
    role: 'Creative agency',
    location: 'Bengaluru',
    color: '#ffd731',
    top: 80,
    right: -50,
    floatDuration: 3.0,
    floatY: -10,
  },
]

export function Hero({ onWaitlistClick, onInvestorClick }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const badgeRef     = useRef<HTMLDivElement>(null)
  const headlineRef  = useRef<HTMLDivElement>(null)
  const subRef       = useRef<HTMLParagraphElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)
  const stickerRef   = useRef<HTMLDivElement>(null)
  const visualRef    = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      // --- Entrance timeline: hardware-accelerated 3D transforms ---
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', force3D: true } })

      tl.from(badgeRef.current, { opacity: 0, y: 12, duration: 0.45, delay: 0.1 })
        .from(headlineRef.current, { opacity: 0, y: 28, duration: 0.72 }, '-=0.25')
        .from(subRef.current,      { opacity: 0, y: 18, duration: 0.55 }, '-=0.38')
        .from(ctaRef.current,      { opacity: 0, y: 14, duration: 0.45 }, '-=0.28')

      // Provider card entrance
      gsap.from('.hero-provider-card', {
        opacity: 0,
        y: 16,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power3.out',
        force3D: true,
      })

      // Sticker entrance
      if (stickerRef.current) {
        gsap.from(Array.from(stickerRef.current.children), {
          opacity: 0,
          scale: 0.85,
          duration: 0.45,
          stagger: 0.08,
          delay: 0.6,
          ease: 'back.out(1.5)',
          force3D: true,
        })
      }

      // --- Silky-smooth continuous float for provider cards ---
      const cards = containerRef.current?.querySelectorAll<HTMLElement>('.hero-provider-card')
      cards?.forEach((card, i) => {
        const cfg = PROVIDERS[i]
        if (!cfg) return
        gsap.to(card, {
          y: cfg.floatY,
          duration: cfg.floatDuration,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.1 + i * 0.2,
          force3D: true,
        })
      })

      // --- Silky-smooth continuous float for sticker pills ---
      if (stickerRef.current) {
        Array.from(stickerRef.current.children).forEach((el, i) => {
          const cfg = STICKER_FLOATS[i]
          if (!cfg) return
          gsap.to(el, {
            y: cfg.y,
            rotation: i % 2 === 0 ? -1.8 : 1.8,
            duration: cfg.duration,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: 0.9 + i * 0.15,
            force3D: true,
          })
        })
      }

      // --- Subtle counter-float on the central request card to bind the scene ---
      const requestCard = visualRef.current?.querySelector<HTMLElement>('.hero-request-card')
      if (requestCard) {
        gsap.to(requestCard, {
          y: 6,
          duration: 4.0,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.0,
          force3D: true,
        })
      }

      // --- Ribbon parallax (desktop only) ---
      if (window.matchMedia('(min-width: 1280px)').matches) {
        gsap.to('.hero-ribbon', {
          y: 28,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        })
      }
    })

    return () => media.revert()
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="hero"
      className="bg-sky-wash relative overflow-hidden"
      aria-label="Hero"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 136,
        paddingBottom: 80,
      }}
    >
      {/* Ribbon lives behind everything — z-index 0 */}
      <Ribbon3D />

      {/* Main layout — z-index 1 sits above the ribbon */}
      <div
        className="max-w-[1440px] mx-auto w-full px-6 md:px-10 relative"
        style={{ zIndex: 1 }}
      >
        <div
          className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center"
          style={{ minHeight: '60vh' }}
        >
          {/* LEFT: headline + copy + CTAs */}
          <div className="xl:col-span-7 flex flex-col gap-8">
            {/* Status badge */}
            <div ref={badgeRef}>
              <span
                className="sticker-tag"
                style={{ background: '#dcfce7', borderColor: '#000' }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#16a34a',
                    display: 'inline-block',
                    marginRight: 6,
                  }}
                />
                Coming soon · India
              </span>
            </div>

            {/* Headline */}
            <div ref={headlineRef}>
              <h1 className="text-display-hero text-black" style={{ maxWidth: '100%' }}>
                Every service.
                <br />
                One place.
              </h1>
            </div>

            {/* Supporting copy */}
            <p
              ref={subRef}
              style={{
                fontFamily: "'Rubik', sans-serif",
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                lineHeight: 1.65,
                color: '#000',
                maxWidth: 540,
                letterSpacing: '-0.01em',
              }}
            >
              From online freelance work to services in your neighbourhood,
              HirelyStreet is building one place to connect people who need
              services with professionals ready to deliver them.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap gap-3">
              <button
                className="btn-green"
                onClick={() => onWaitlistClick('customer')}
                type="button"
                style={{ fontSize: 15, padding: '14px 32px' }}
              >
                Join the waitlist
                <ArrowRight size={16} />
              </button>
              <button
                className="btn-ghost"
                onClick={() => onInvestorClick()}
                type="button"
                style={{ fontSize: 15, padding: '14px 32px' }}
              >
                I'm an investor
              </button>
            </div>
          </div>

          {/* RIGHT: visual composition */}
          <div
            className="hero-visual-column xl:col-span-5 flex items-center justify-center relative"
            style={{ minHeight: 380 }}
          >
            <div ref={visualRef} className="relative w-full hero-visual" style={{ maxWidth: 440 }}>
              {/* Central request card */}
              <div
                className="hero-request-card relative mx-auto"
                style={{
                  background: '#ffffff',
                  border: '1px solid #000',
                  borderRadius: 24,
                  padding: '24px 28px',
                  maxWidth: 320,
                  zIndex: 2,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: '0.032em',
                    textTransform: 'uppercase',
                    color: '#666',
                    marginBottom: 10,
                  }}
                >
                  Your request
                </p>
                <p
                  style={{
                    fontFamily: "'Rubik', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    color: '#000',
                    lineHeight: 1.4,
                    marginBottom: 16,
                  }}
                >
                  "I need a professional logo for my business in Bengaluru"
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Design', 'Brand', 'Local', 'Remote'].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '4px 12px',
                        background: '#dceeff',
                        border: '1px solid #000',
                        borderRadius: 1600,
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: '0.03em',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Provider cards floating around the request card */}
              <div className="hero-provider-cards">
                {PROVIDERS.map((p) => (
                  <div
                    key={p.name}
                    className="hero-provider-card"
                    style={{
                      position: 'absolute',
                      ...(p.top    !== undefined ? { top:    p.top    } : {}),
                      ...(p.bottom !== undefined ? { bottom: p.bottom } : {}),
                      ...(p.left   !== undefined ? { left:   p.left   } : {}),
                      ...(p.right  !== undefined ? { right:  p.right  } : {}),
                      background: p.color,
                      border: '1px solid #000',
                      borderRadius: 16,
                      padding: '10px 14px',
                      minWidth: 130,
                      zIndex: 3,
                    }}
                  >
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 13, color: '#000', margin: 0 }}>
                      {p.name}
                    </p>
                    <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: 12, color: '#000', margin: 0, opacity: 0.7 }}>
                      {p.role}
                    </p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, color: '#000', margin: '4px 0 0', letterSpacing: '0.02em' }}>
                      {p.location === 'Remote' ? 'Remote' : `Based in ${p.location}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative sticker accents — desktop only */}
      <div ref={stickerRef} aria-hidden="true" className="hidden xl:block">
        {STICKERS.map((s) => (
          <div
            key={s.label}
            className="absolute sticker"
            style={{
              background: s.color,
              transform: `rotate(${s.rotate}deg)`,
              left: s.x,
              top: s.y,
              padding: '6px 14px',
              fontSize: 11,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {s.label}
          </div>
        ))}
      </div>
    </section>
  )
}

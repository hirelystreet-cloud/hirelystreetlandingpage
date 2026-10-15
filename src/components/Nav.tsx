import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface NavProps {
  onWaitlistClick: (type: 'customer' | 'provider') => void
  onInvestorClick: () => void
}

export function Nav({ onWaitlistClick, onInvestorClick }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth'
      el.scrollIntoView({ behavior, block: 'start' })
    }
  }

  return (
    <>
      <header
        className="fixed left-0 right-0 z-50"
        style={{
          top: 40,
          background: '#ffffff',
          borderBottom: scrolled ? '1px solid #e5e5e5' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
          transition: 'border-color 180ms ease, box-shadow 180ms ease',
        }}
      >
        <nav
          className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between"
          style={{ height: 64 }}
          aria-label="Main navigation"
        >
          {/* Brand */}
          <a
            href="/"
            className="flex items-center gap-2 text-decoration-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]"
            aria-label="HirelyStreet home"
          >
            <img
              src="/logo.png"
              alt="HirelyStreet logo"
              width={28}
              height={28}
              className="shrink-0 object-contain"
            />
            <span
              className="font-display font-black select-none tracking-tight"
              style={{
                fontSize: 20,
                letterSpacing: '-0.03em',
                color: '#000000',
              }}
            >
              Hirely<span style={{ color: '#16a34a' }}>Street</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <button
              className="btn-nav"
              onClick={() => scrollTo('product')}
              type="button"
            >
              The product
            </button>
            <button
              className="btn-nav"
              onClick={() => onWaitlistClick('provider')}
              type="button"
            >
              For providers
            </button>
            <button
              className="btn-nav"
              onClick={() => onInvestorClick()}
              type="button"
            >
              Investors
            </button>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <button
              className="btn-primary"
              onClick={() => onWaitlistClick('customer')}
              type="button"
              style={{ padding: '10px 24px', fontSize: 13 }}
            >
              Join the waitlist
            </button>
          </div>

          {/* Mobile: hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-black bg-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            type="button"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-0 z-40 border-b border-black"
            style={{ background: '#ffffff', top: 104 }}
          >
            <nav className="flex flex-col gap-1 px-6 py-6">
              <button
                className="btn-nav text-left justify-start w-full"
                onClick={() => scrollTo('product')}
                type="button"
              >
                The product
              </button>
              <button
                className="btn-nav text-left justify-start w-full"
                onClick={() => { setMobileOpen(false); onWaitlistClick('provider') }}
                type="button"
              >
                For providers
              </button>
              <button
                className="btn-nav text-left justify-start w-full"
                onClick={() => { setMobileOpen(false); onInvestorClick() }}
                type="button"
              >
                Investors
              </button>
              <div className="mt-4 border-t border-black pt-4">
                <button
                  className="btn-green w-full"
                  onClick={() => { setMobileOpen(false); onWaitlistClick('customer') }}
                  type="button"
                >
                  Join the waitlist
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

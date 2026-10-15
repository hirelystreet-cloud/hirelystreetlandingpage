import { useState, useEffect, Suspense, lazy } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { Nav } from './components/Nav'
import { MarqueeBar } from './components/MarqueeBar'
import { Hero } from './components/Hero'
import { ProductStory } from './components/ProductStory'
import { TwoSides } from './components/TwoSides'
import { InvestorSection } from './components/InvestorSection'
import { Footer } from './components/Footer'
import { PrivacyPolicy, TermsOfService } from './pages/Legal'

// Lazy-load modals because they are rarely needed on first paint
const WaitlistModal = lazy(() =>
  import('./components/WaitlistModal').then((m) => ({ default: m.WaitlistModal }))
)
const InvestorModal = lazy(() =>
  import('./components/InvestorModal').then((m) => ({ default: m.InvestorModal }))
)

type WaitlistType = 'customer' | 'provider'

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [waitlistOpen, setWaitlistOpen] = useState<WaitlistType | null>(null)
  const [investorOpen, setInvestorOpen] = useState(false)

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handleLocationChange)
    
    // Intercept in-app clicks to /privacy and /terms
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (target && target.getAttribute('href')?.startsWith('/')) {
        const href = target.getAttribute('href')!
        if (href === '/privacy' || href === '/terms' || href === '/') {
          e.preventDefault()
          window.history.pushState({}, '', href)
          setCurrentPath(href)
          window.scrollTo(0, 0)
        }
      }
    }
    document.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const openWaitlist = (type: WaitlistType) => setWaitlistOpen(type)
  const closeWaitlist = () => setWaitlistOpen(null)
  const openInvestor = () => setInvestorOpen(true)
  const closeInvestor = () => setInvestorOpen(false)

  if (currentPath === '/privacy') {
    return <PrivacyPolicy />
  }

  if (currentPath === '/terms') {
    return <TermsOfService />
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="overflow-x-hidden w-full max-w-full">
        {/* Fixed announcement bar at the very top (z-[49]) */}
        <MarqueeBar />

        {/* Navigation — fixed at top-[40px] to sit below the marquee bar */}
        <Nav onWaitlistClick={openWaitlist} onInvestorClick={openInvestor} />

        {/* Page sections */}
        <Hero onWaitlistClick={openWaitlist} onInvestorClick={openInvestor} />
        <ProductStory />
        <TwoSides onWaitlistClick={openWaitlist} />
        <InvestorSection onInvestorClick={openInvestor} />
        <Footer onWaitlistClick={openWaitlist} onInvestorClick={openInvestor} />

        {/* Modals are lazy loaded because they are rarely needed on first paint */}
        <Suspense fallback={null}>
          <AnimatePresence>
            {waitlistOpen && (
              <WaitlistModal
                key="waitlist-modal"
                type={waitlistOpen}
                onClose={closeWaitlist}
              />
            )}
            {investorOpen && (
              <InvestorModal
                key="investor-modal"
                onClose={closeInvestor}
              />
            )}
          </AnimatePresence>
        </Suspense>
      </main>
    </MotionConfig>
  )
}

export default App

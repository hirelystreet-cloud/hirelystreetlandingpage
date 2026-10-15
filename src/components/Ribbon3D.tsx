import { useRef, useEffect } from 'react'
import gsap from 'gsap'

// Main ribbon path used across all layers
const MAIN_PATH =
  'M -100 480 C 150 560, 320 220, 560 260 C 800 300, 950 680, 1200 520 C 1350 420, 1480 340, 1600 380'

// Secondary ribbon path
const SEC_PATH =
  'M 850 780 C 960 740, 1100 400, 1280 300 C 1420 220, 1500 260, 1580 300'

export function Ribbon3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<SVGPathElement>(null)
  const highlightSecRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const mainEl = highlightRef.current
    const secEl = highlightSecRef.current

    const ctx = gsap.context(() => {
      // Main ribbon highlight sheen
      if (mainEl) {
        const len = mainEl.getTotalLength()
        mainEl.style.strokeDasharray = `${len * 0.22} ${len * 0.78}`
        gsap.fromTo(
          mainEl,
          { strokeDashoffset: 0 },
          {
            strokeDashoffset: -len,
            duration: 5.5,
            ease: 'none',
            repeat: -1,
          }
        )
      }

      // Secondary ribbon highlight sheen
      if (secEl) {
        const lenSec = secEl.getTotalLength()
        secEl.style.strokeDasharray = `${lenSec * 0.25} ${lenSec * 0.75}`
        gsap.fromTo(
          secEl,
          { strokeDashoffset: 0 },
          {
            strokeDashoffset: -lenSec,
            duration: 4.2,
            ease: 'none',
            repeat: -1,
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="hero-ribbon absolute inset-0 pointer-events-none overflow-hidden select-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 3D tubular lighting gradient — main arc */}
          <linearGradient id="tube-grad-1" x1="100" y1="200" x2="600" y2="700" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#80beff" />
            <stop offset="35%"  stopColor="#4da2ff" />
            <stop offset="70%"  stopColor="#2575fc" />
            <stop offset="100%" stopColor="#1a5dc8" />
          </linearGradient>

          {/* Secondary ribbon gradient */}
          <linearGradient id="tube-grad-2" x1="800" y1="100" x2="1300" y2="600" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#9fd0ff" />
            <stop offset="40%"  stopColor="#4da2ff" />
            <stop offset="85%"  stopColor="#206ce6" />
            <stop offset="100%" stopColor="#1551b5" />
          </linearGradient>

          {/* Specular highlight gradient for the inflatable tube look */}
          <linearGradient id="tube-specular" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="50%"  stopColor="#ffffff" stopOpacity="0"   />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </linearGradient>

          {/* Flowing highlight gradient — soft moving sheen */}
          <linearGradient id="tube-flow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0"   />
            <stop offset="40%"  stopColor="#c8e8ff" stopOpacity="0.7" />
            <stop offset="55%"  stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0"   />
          </linearGradient>
        </defs>

        {/* ── MAIN RIBBON ───────────────────────────────────── */}

        {/* 1. Soft drop shadow */}
        <path
          d={MAIN_PATH}
          stroke="#000000"
          strokeWidth="80"
          strokeLinecap="round"
          opacity="0.06"
          transform="translate(8, 14)"
        />

        {/* 2. Black outline */}
        <path
          d={MAIN_PATH}
          stroke="#000000"
          strokeWidth="76"
          strokeLinecap="round"
        />

        {/* 3. Gradient-filled tube body */}
        <path
          d={MAIN_PATH}
          stroke="url(#tube-grad-1)"
          strokeWidth="72"
          strokeLinecap="round"
        />

        {/* 4. Inflatable specular ridge */}
        <path
          d="M -100 472 C 150 552, 320 212, 560 252 C 800 292, 950 672, 1200 512 C 1350 412, 1480 332, 1600 372"
          stroke="url(#tube-specular)"
          strokeWidth="22"
          strokeLinecap="round"
          opacity="0.48"
        />

        {/* 5. Animated flowing highlight — smooth GSAP hardware-composited strokeDashoffset */}
        <path
          ref={highlightRef}
          d={MAIN_PATH}
          stroke="url(#tube-flow)"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.72"
        />

        {/* ── SECONDARY RIBBON (bottom-right) ──────────────── */}

        {/* 1. Outline */}
        <path
          d={SEC_PATH}
          stroke="#000000"
          strokeWidth="54"
          strokeLinecap="round"
        />

        {/* 2. Gradient body */}
        <path
          d={SEC_PATH}
          stroke="url(#tube-grad-2)"
          strokeWidth="50"
          strokeLinecap="round"
        />

        {/* 3. Specular ridge */}
        <path
          d="M 850 776 C 960 736, 1100 396, 1280 296 C 1420 216, 1500 256, 1580 296"
          stroke="#ffffff"
          strokeWidth="11"
          strokeLinecap="round"
          opacity="0.38"
        />

        {/* 4. Animated flowing highlight on secondary ribbon */}
        <path
          ref={highlightSecRef}
          d={SEC_PATH}
          stroke="#c8e8ff"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}

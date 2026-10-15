import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { Search, Users, FileText, Star } from 'lucide-react'

const STEPS = [
  {
    icon: Search,
    number: '01',
    title: 'Tell us what you need',
    body: 'Describe a service or project, including relevant details, your budget, and location where it matters. No forms to navigate; just say what you need.',
    color: '#55db9c',
    bgColor: '#dceeff',
  },
  {
    icon: Users,
    number: '02',
    title: 'Find relevant professionals',
    body: 'The intended product experience categorizes requests and helps surface suitable nearby or remote providers matched to what you described.',
    color: '#e9ccff',
    bgColor: '#ffffff',
  },
  {
    icon: FileText,
    number: '03',
    title: 'Compare proposals',
    body: 'Evaluate available proposals and make a more informed choice. See what each provider offers, at what price, and on what timeline.',
    color: '#ffd731',
    bgColor: '#cccccc',
  },
  {
    icon: Star,
    number: '04',
    title: 'Build trust through completed work',
    body: 'Ratings, reviews, and service history support better decisions over time and help build a marketplace you can trust.',
    color: '#fb4903',
    bgColor: '#dceeff',
  },
]

function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const Icon = step.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Step number shown as typography, not as a metadata label */}
      <div
        className="flex items-start gap-6"
        style={{ borderTop: '1px solid #000', paddingTop: 28, paddingBottom: 40 }}
      >
        <div
          style={{
            minWidth: 56,
            height: 56,
            borderRadius: 16,
            background: step.color,
            border: '1px solid #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <Icon size={22} color="#000" strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: '0.08em',
                color: '#aaa',
              }}
              aria-hidden="true"
            >
              {step.number}
            </span>
            <h3
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                color: '#000',
                margin: 0,
              }}
            >
              {step.title}
            </h3>
          </div>
          <p
            style={{
              fontFamily: "'Rubik', sans-serif",
              fontSize: 15,
              lineHeight: 1.65,
              color: '#333',
              margin: 0,
              maxWidth: 440,
            }}
          >
            {step.body}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function ProductStory() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-60px' })

  return (
    <section
      id="product"
      className="bg-paper-white"
      style={{ padding: 'clamp(64px, 10vw, 120px) 0' }}
      aria-labelledby="product-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        {/* Section header uses an asymmetric alignment */}
        <div
          ref={titleRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 md:mb-24"
        >
          <motion.div
            className="md:col-span-6"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Decorative badge */}
            <div className="mb-6">
              <span
                className="sticker-tag"
                style={{ background: '#dceeff' }}
              >
                How it works
              </span>
            </div>
            <h2
              id="product-heading"
              className="text-section-head"
              style={{ color: '#000' }}
            >
              One request.
              <br />
              More choices.
            </h2>
          </motion.div>

          <motion.div
            className="md:col-span-5 md:col-start-8 flex items-end"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              style={{
                fontFamily: "'Rubik', sans-serif",
                fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
                lineHeight: 1.65,
                color: '#444',
                margin: 0,
              }}
            >
              HirelyStreet is building a marketplace where you describe what
              you need and relevant professionals find you, whether they are
              across the country or a few streets away.
            </p>
          </motion.div>
        </div>

        {/* Note: planned capabilities */}
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #000',
            borderRadius: 16,
            padding: '14px 20px',
            marginBottom: 40,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.04em',
              color: '#92400e',
              whiteSpace: 'nowrap',
              marginTop: 1,
            }}
          >
            PLANNED PRODUCT VISION
          </span>
          <p
            style={{
              fontFamily: "'Rubik', sans-serif",
              fontSize: 13,
              color: '#78350f',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            The capabilities below describe how HirelyStreet is designed to
            work. HirelyStreet is currently in pre-launch; we're building toward
            this experience.
          </p>
        </div>

        {/* Step list */}
        <div>
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

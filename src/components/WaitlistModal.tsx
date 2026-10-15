import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

type WaitlistType = 'customer' | 'provider'

interface WaitlistModalProps {
  type: WaitlistType
  onClose: () => void
}

interface FormData {
  fullName: string
  email: string
  city: string
  interests: string  // for customer: service interests; for provider: services offered
}

interface Errors {
  fullName?: string
  email?: string
  city?: string
  interests?: string
}

const SERVICE_CATEGORIES = [
  'Home repairs & maintenance',
  'Cleaning & housekeeping',
  'Graphic design & branding',
  'Web & app development',
  'Photography & videography',
  'Tutoring & education',
  'Fitness & wellness coaching',
  'Legal & financial advisory',
  'Event planning',
  'Catering & food',
  'Beauty & personal care',
  'Other',
]

function validate(data: FormData): Errors {
  const errors: Errors = {}
  if (!data.fullName.trim()) errors.fullName = 'Full name is required.'
  else if (data.fullName.trim().length < 2) errors.fullName = 'Name must be at least 2 characters.'
  if (!data.email.trim()) errors.email = 'Email address is required.'
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email.trim())) errors.email = 'Enter a valid email address.'
  if (!data.city.trim()) errors.city = 'City is required.'
  if (!data.interests.trim()) {
    errors.interests = 'Please indicate at least one interest.'
  }
  return errors
}

export function WaitlistModal({ type, onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    city: '',
    interests: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')
  const firstInputRef = useRef<HTMLInputElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Focus trap and initial focus
  useEffect(() => {
    firstInputRef.current?.focus()

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (errors[name as keyof Errors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }
    },
    [errors]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate(formData)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Focus first error
      const firstErrKey = Object.keys(newErrors)[0]
      document.querySelector<HTMLElement>(`[name="${firstErrKey}"]`)?.focus()
      return
    }

    setStatus('loading')
    setServerError('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          city: formData.city.trim(),
          interests: formData.interests.trim(),
        }),
      })

      if (res.ok) {
        setStatus('success')
      } else if (res.status === 409) {
        setStatus('error')
        setServerError("You're already on the waitlist with this email address.")
      } else if (res.status === 429) {
        setStatus('error')
        setServerError('Too many requests. Please wait a moment and try again.')
      } else {
        const data = await res.json().catch(() => ({}))
        setStatus('error')
        setServerError(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setServerError('Unable to submit. Please check your connection and try again.')
    }
  }

  const isCustomer = type === 'customer'
  const accentColor = isCustomer ? '#16a34a' : '#000000'
  const accentBg = isCustomer ? '#dcfce7' : '#dceeff'

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="presentation"
    >
      <AnimatePresence>
        <motion.div
          className="modal-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <span
                className="sticker-tag mb-3 inline-flex"
                style={{ background: accentBg }}
              >
                {isCustomer ? 'Customer waitlist' : 'Provider waitlist'}
              </span>
              <h2
                id="modal-title"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  color: '#000',
                  margin: 0,
                }}
              >
                {isCustomer
                  ? 'Reserve your spot as a customer'
                  : 'Reserve your spot as a provider'}
              </h2>
              <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: 14, color: '#555', marginTop: 8, lineHeight: 1.5 }}>
                We'll reach out when HirelyStreet launches in your city.
              </p>
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              type="button"
              aria-label="Close"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid #000',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                marginLeft: 12,
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Success state */}
          {status === 'success' && (
            <div
              style={{
                background: '#dcfce7',
                border: '1px solid #000',
                borderRadius: 16,
                padding: '24px',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
              }}
              role="alert"
            >
              <CheckCircle2 size={22} color="#16a34a" strokeWidth={2} />
              <div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 16, color: '#000', margin: '0 0 4px' }}>
                  You're on the waitlist!
                </p>
                <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: 14, color: '#333', margin: 0, lineHeight: 1.5 }}>
                  We've saved your details. We'll be in touch when HirelyStreet
                  launches in {formData.city || 'your city'}. Thanks for your
                  early support.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          {status !== 'success' && (
            <form onSubmit={handleSubmit} noValidate>
              {/* Server error */}
              {status === 'error' && serverError && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #dc2626',
                    borderRadius: 12,
                    padding: '12px 16px',
                    marginBottom: 20,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                  }}
                  role="alert"
                >
                  <AlertCircle size={16} color="#dc2626" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: 14, color: '#dc2626', margin: 0 }}>
                    {serverError}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Full name */}
                <div>
                  <label className="form-label" htmlFor="fullName">
                    Full name <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    className={`form-input${errors.fullName ? ' error' : ''}`}
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    aria-required="true"
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    aria-invalid={!!errors.fullName}
                  />
                  {errors.fullName && (
                    <p className="form-error" id="fullName-error" role="alert">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="form-label" htmlFor="email">
                    Email address <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`form-input${errors.email ? ' error' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    aria-required="true"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="form-error" id="email-error" role="alert">{errors.email}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="form-label" htmlFor="city">
                    City <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    className={`form-input${errors.city ? ' error' : ''}`}
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru, Mumbai, Delhi"
                    aria-required="true"
                    aria-describedby={errors.city ? 'city-error' : undefined}
                    aria-invalid={!!errors.city}
                  />
                  {errors.city && (
                    <p className="form-error" id="city-error" role="alert">{errors.city}</p>
                  )}
                </div>

                {/* Service interests / Services offered */}
                <div>
                  <label className="form-label" htmlFor="interests">
                    {isCustomer ? 'Service interests' : 'Services offered'}{' '}
                    <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    id="interests"
                    name="interests"
                    className={`form-input${errors.interests ? ' error' : ''}`}
                    value={formData.interests}
                    onChange={handleChange}
                    aria-required="true"
                    aria-describedby={errors.interests ? 'interests-error' : undefined}
                    aria-invalid={!!errors.interests}
                  >
                    <option value="">
                      {isCustomer ? 'What type of services do you need?' : 'What do you offer?'}
                    </option>
                    {SERVICE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.interests && (
                    <p className="form-error" id="interests-error" role="alert">{errors.interests}</p>
                  )}
                </div>
              </div>

              {/* Privacy notice */}
              <p
                style={{
                  fontFamily: "'Rubik', sans-serif",
                  fontSize: 12,
                  color: '#666',
                  marginTop: 20,
                  lineHeight: 1.6,
                }}
              >
                By joining the waitlist you agree to our{' '}
                <a href="/privacy" style={{ color: '#000', textDecoration: 'underline' }}>
                  privacy policy
                </a>
                . We'll only contact you about HirelyStreet. We don't share
                your details with third parties.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className={isCustomer ? 'btn-green' : 'btn-primary'}
                style={{
                  width: '100%',
                  marginTop: 24,
                  fontSize: 15,
                  padding: '14px 32px',
                  opacity: status === 'loading' ? 0.7 : 1,
                }}
                aria-busy={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  isCustomer ? 'Join the customer waitlist' : 'Join the provider waitlist'
                )}
              </button>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}


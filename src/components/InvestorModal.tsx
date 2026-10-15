import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface InvestorModalProps {
  onClose: () => void
}

interface FormData {
  fullName: string
  workEmail: string
  organization: string
  stage: string
  message: string
}

interface Errors {
  fullName?: string
  workEmail?: string
  organization?: string
  stage?: string
}

const INVESTMENT_STAGES = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B+',
  'Growth / Late stage',
  'Angel investor',
  'Family office',
  'Other',
]

function validate(data: FormData): Errors {
  const errors: Errors = {}
  if (!data.fullName.trim()) errors.fullName = 'Full name is required.'
  if (!data.workEmail.trim()) errors.workEmail = 'Work email is required.'
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.workEmail.trim())) errors.workEmail = 'Enter a valid email address.'
  if (!data.organization.trim()) errors.organization = 'Organization or fund name is required.'
  if (!data.stage) errors.stage = 'Please select an investment stage.'
  return errors
}

export function InvestorModal({ onClose }: InvestorModalProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    workEmail: '',
    organization: '',
    stage: '',
    message: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')
  const [serverNotice, setServerNotice] = useState('')
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
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
      document.querySelector<HTMLElement>(`[name="${Object.keys(newErrors)[0]}"]`)?.focus()
      return
    }

    setStatus('loading')
    setServerError('')

    try {
      const res = await fetch('/api/investor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          workEmail: formData.workEmail.trim().toLowerCase(),
          organization: formData.organization.trim(),
          stage: formData.stage,
          message: formData.message.trim(),
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        if (data.notice) {
          setServerNotice(data.notice)
        }
        setStatus('success')
      } else if (res.status === 429) {
        setStatus('error')
        setServerError('Too many requests. Please wait a moment and try again.')
      } else {
        setStatus('error')
        setServerError(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setServerError('Unable to submit. Please check your connection and try again.')
    }
  }

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
          aria-labelledby="investor-modal-title"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <span className="sticker-tag mb-3 inline-flex" style={{ background: '#dceeff' }}>
                Investor inquiry
              </span>
              <h2
                id="investor-modal-title"
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
                Start the conversation
              </h2>
              <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: 14, color: '#555', marginTop: 8, lineHeight: 1.5 }}>
                We'll be in touch shortly after reviewing your inquiry.
              </p>
            </div>
            <button
              onClick={onClose}
              type="button"
              aria-label="Close investor inquiry"
              style={{
                width: 36, height: 36, borderRadius: '50%', border: '1px solid #000',
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, marginLeft: 12,
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Success */}
          {status === 'success' && (
            <div
              style={{
                background: '#dceeff', border: '1px solid #000', borderRadius: 16,
                padding: '24px', display: 'flex', gap: 16, alignItems: 'flex-start',
              }}
              role="alert"
            >
              <CheckCircle2 size={22} color="#16a34a" strokeWidth={2} />
              <div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 16, color: '#000', margin: '0 0 4px' }}>
                  Thank you for your interest
                </p>
                <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: 14, color: '#333', margin: 0, lineHeight: 1.5 }}>
                  Your inquiry has been received by the HirelyStreet team. We'll review it and reach out to you at {formData.workEmail}.
                </p>
                {serverNotice && (
                  <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: 12, color: '#555', margin: '8px 0 0', lineHeight: 1.4, background: '#ffffff', padding: '6px 10px', borderRadius: 8, border: '1px solid #000' }}>
                    ℹ️ {serverNotice}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          {status !== 'success' && (
            <form onSubmit={handleSubmit} noValidate>
              {status === 'error' && serverError && (
                <div
                  style={{
                    background: '#fef2f2', border: '1px solid #dc2626', borderRadius: 12,
                    padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10,
                  }}
                  role="alert"
                >
                  <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: 14, color: '#dc2626', margin: 0 }}>
                    {serverError}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="form-label" htmlFor="inv-fullName">
                    Full name <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    id="inv-fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    className={`form-input${errors.fullName ? ' error' : ''}`}
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    aria-required="true"
                    aria-describedby={errors.fullName ? 'inv-fullName-error' : undefined}
                    aria-invalid={!!errors.fullName}
                  />
                  {errors.fullName && <p className="form-error" id="inv-fullName-error" role="alert">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="form-label" htmlFor="inv-workEmail">
                    Work email <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="inv-workEmail"
                    name="workEmail"
                    type="email"
                    autoComplete="email"
                    className={`form-input${errors.workEmail ? ' error' : ''}`}
                    value={formData.workEmail}
                    onChange={handleChange}
                    placeholder="you@organization.com"
                    aria-required="true"
                    aria-describedby={errors.workEmail ? 'inv-workEmail-error' : undefined}
                    aria-invalid={!!errors.workEmail}
                  />
                  {errors.workEmail && <p className="form-error" id="inv-workEmail-error" role="alert">{errors.workEmail}</p>}
                </div>

                <div>
                  <label className="form-label" htmlFor="inv-organization">
                    Organization or fund <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="inv-organization"
                    name="organization"
                    type="text"
                    autoComplete="organization"
                    className={`form-input${errors.organization ? ' error' : ''}`}
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Company or fund name"
                    aria-required="true"
                    aria-describedby={errors.organization ? 'inv-organization-error' : undefined}
                    aria-invalid={!!errors.organization}
                  />
                  {errors.organization && <p className="form-error" id="inv-organization-error" role="alert">{errors.organization}</p>}
                </div>

                <div>
                  <label className="form-label" htmlFor="inv-stage">
                    Investment stage <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    id="inv-stage"
                    name="stage"
                    className={`form-input${errors.stage ? ' error' : ''}`}
                    value={formData.stage}
                    onChange={handleChange}
                    aria-required="true"
                    aria-describedby={errors.stage ? 'inv-stage-error' : undefined}
                    aria-invalid={!!errors.stage}
                  >
                    <option value="">Select investment stage</option>
                    {INVESTMENT_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.stage && <p className="form-error" id="inv-stage-error" role="alert">{errors.stage}</p>}
                </div>

                <div>
                  <label className="form-label" htmlFor="inv-message">
                    Message{' '}
                    <span style={{ fontWeight: 500, color: '#666' }}>(optional)</span>
                  </label>
                  <textarea
                    id="inv-message"
                    name="message"
                    className="form-input"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any context about your interest in HirelyStreet…"
                    rows={4}
                    style={{ resize: 'vertical', minHeight: 100 }}
                    maxLength={1000}
                  />
                  <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: 11, color: '#aaa', marginTop: 4, textAlign: 'right' }}>
                    {formData.message.length}/1000
                  </p>
                </div>
              </div>

              <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: 12, color: '#666', marginTop: 20, lineHeight: 1.6 }}>
                Your inquiry will be sent directly to the HirelyStreet team. We respect your privacy and will not share your details with third parties. See our{' '}
                <a href="/privacy" style={{ color: '#000', textDecoration: 'underline' }}>privacy policy</a>.
              </p>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary"
                style={{ width: '100%', marginTop: 24, fontSize: 15, padding: '14px 32px', opacity: status === 'loading' ? 0.7 : 1 }}
                aria-busy={status === 'loading'}
              >
                {status === 'loading' ? (
                  <><Loader2 size={16} className="animate-spin" />Sending inquiry…</>
                ) : 'Discuss HirelyStreet'}
              </button>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}


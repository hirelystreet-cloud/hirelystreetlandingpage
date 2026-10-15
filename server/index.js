import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  isResendConfigured,
  parseInvestorSubmission,
  parseWaitlistSubmission,
  sendInvestorNotification,
  SubmissionError,
} from './submission-helpers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// ============================================================
// Local Persistent Storage Engine (File-backed database)
// Ensures signups are physically persisted even without external cloud keys
// ============================================================
const DATA_DIR = path.join(__dirname, '..', 'data')
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

const WAITLIST_FILE = path.join(DATA_DIR, 'waitlist.json')
const INQUIRIES_FILE = path.join(DATA_DIR, 'investor_inquiries.json')

function loadJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return []
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content || '[]')
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message)
    return []
  }
}

function saveJson(filePath, data) {
  try {
    const tempPath = `${filePath}.tmp`
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8')
    fs.renameSync(tempPath, filePath)
    return true
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message)
    return false
  }
}

// Initialize files if not present
if (!fs.existsSync(WAITLIST_FILE)) saveJson(WAITLIST_FILE, [])
if (!fs.existsSync(INQUIRIES_FILE)) saveJson(INQUIRIES_FILE, [])

// ============================================================
// Configuration validation & Cloud Services
// ============================================================
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY', 'RESEND_FROM_EMAIL']
const missingEnv = REQUIRED_ENV.filter((k) => !process.env[k])

console.log('----------------------------------------------------')
console.log('[HirelyStreet Server] Initializing services...')
if (missingEnv.length > 0) {
  console.warn(
    `[HirelyStreet Server] NOTE: External cloud credentials unconfigured: ${missingEnv.join(', ')}.\n` +
    'Local persistent storage (data/waitlist.json, data/investor_inquiries.json) is ACTIVE.\n' +
    'To connect external Supabase & Resend, configure .env based on .env.example.'
  )
} else {
  console.log('[HirelyStreet Server] Cloud integrations (Supabase & Resend) configured.')
}
console.log('----------------------------------------------------')

// Conditionally initialize integrations
const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null

// ============================================================
// Middleware
// ============================================================
app.use(express.json({ limit: '16kb' }))
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)

// Rate limiters
const waitlistLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many submissions from this IP. Please wait 15 minutes.' },
})

const investorLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many inquiries from this IP. Please wait an hour.' },
})

// ============================================================
// POST /api/waitlist
// ============================================================
app.post('/api/waitlist', waitlistLimiter, async (req, res) => {
  try {
    const submission = parseWaitlistSubmission(req.body)
    const { type, fullName, email, city, interests } = submission

    // Check for duplicate in local persistent storage
    const localWaitlist = loadJson(WAITLIST_FILE)
    const isDuplicate = localWaitlist.some(
      (entry) => entry.email === email && entry.type === type
    )

    if (isDuplicate) {
      return res.status(409).json({ message: "You're already on the waitlist with this email address." })
    }

    const newRecord = {
      id: `wl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      fullName,
      email,
      city,
      interests,
      createdAt: new Date().toISOString(),
      userAgent: req.headers['user-agent'] ? req.headers['user-agent'].slice(0, 100) : 'unknown',
    }

    // 1. Save to local persistent disk storage
    localWaitlist.push(newRecord)
    const saved = saveJson(WAITLIST_FILE, localWaitlist)
    if (!saved) {
      return res.status(500).json({ message: 'Failed to write waitlist record to disk.' })
    }

    // 2. If Supabase is configured, also persist to cloud
    let cloudSynced = false
    if (supabase) {
      try {
        const { error: insertError } = await supabase.from('waitlist').insert({
          type,
          full_name: fullName,
          email,
          city,
          interests,
          created_at: newRecord.createdAt,
        })
        if (!insertError) cloudSynced = true
        else console.warn('[Waitlist] Supabase insert warning:', insertError.message)
      } catch (e) {
        console.warn('[Waitlist] Supabase connection error:', e.message)
      }
    }

    console.log(`[Waitlist] New ${type} registered: ${email} (${city}). Cloud synced: ${cloudSynced}`)
    return res.status(200).json({ ok: true, id: newRecord.id, cloudSynced })
  } catch (err) {
    if (err instanceof SubmissionError) {
      return res.status(err.status).json({ message: err.message })
    }
    console.error('[Waitlist] Unexpected error:', err)
    return res.status(500).json({ message: 'An unexpected error occurred.' })
  }
})

// ============================================================
// POST /api/investor
// ============================================================
app.post('/api/investor', investorLimiter, async (req, res) => {
  try {
    const submission = parseInvestorSubmission(req.body)
    const { fullName, workEmail, organization, stage, message } = submission

    const inquiryRecord = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName,
      workEmail,
      organization,
      stage,
      message,
      createdAt: new Date().toISOString(),
    }

    // 1. Always persist to local inquiries storage
    const inquiries = loadJson(INQUIRIES_FILE)
    inquiries.push(inquiryRecord)
    saveJson(INQUIRIES_FILE, inquiries)

    // 2. Dispatch email via Resend if configured
    let emailSent = false
    let emailNotice = null

    if (isResendConfigured()) {
      try {
        await sendInvestorNotification(submission)
        emailSent = true
        console.log(`[Investor] Email successfully dispatched to ${process.env.SUBMISSION_NOTIFICATION_EMAIL || 'founders@hirelystreet.com'} for ${workEmail}`)
      } catch (err) {
        console.error('[Investor] Resend exception:', err)
        emailNotice = 'Inquiry logged to database; email dispatch encountered an upstream issue.'
      }
    } else {
      console.log(`[Investor] Inquiry stored locally for ${workEmail}. Resend is not configured.`)
      emailNotice = 'Inquiry securely stored on the server. Direct email delivery is not configured.'
    }

    return res.status(200).json({
      ok: true,
      id: inquiryRecord.id,
      emailSent,
      notice: emailNotice,
    })
  } catch (err) {
    if (err instanceof SubmissionError) {
      return res.status(err.status).json({ message: err.message })
    }
    console.error('[Investor] Unexpected error:', err)
    return res.status(500).json({ message: 'An unexpected error occurred.' })
  }
})

// ============================================================
// Health & Diagnostic check
// ============================================================
app.get('/api/health', (_req, res) => {
  const waitlistCount = loadJson(WAITLIST_FILE).length
  const inquiriesCount = loadJson(INQUIRIES_FILE).length
  res.json({
    ok: true,
    storage: 'persistent_filesystem',
    waitlistCount,
    inquiriesCount,
    supabaseConfigured: !!supabase,
    resendConfigured: isResendConfigured(),
    timestamp: new Date().toISOString(),
  })
})

// ============================================================
// Start server
// ============================================================
app.listen(PORT, () => {
  console.log(`[HirelyStreet Server] Running on http://localhost:${PORT}`)
})

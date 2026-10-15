import { Resend } from 'resend'

export class SubmissionError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function sanitizeString(value, maxLength = 200) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
}

export function parseWaitlistSubmission(body) {
  const { type } = body || {}
  if (type !== 'customer' && type !== 'provider') {
    throw new SubmissionError(400, 'Invalid waitlist type.')
  }

  const submission = {
    type,
    fullName: sanitizeString(body.fullName),
    email: sanitizeString(body.email).toLowerCase(),
    city: sanitizeString(body.city),
    interests: sanitizeString(body.interests),
  }

  if (submission.fullName.length < 2) {
    throw new SubmissionError(400, 'Full name must be at least 2 characters.')
  }
  if (!isValidEmail(submission.email)) {
    throw new SubmissionError(400, 'A valid email is required.')
  }
  if (!submission.city) throw new SubmissionError(400, 'City is required.')
  if (!submission.interests) {
    throw new SubmissionError(400, 'Service interests are required.')
  }

  return submission
}

export function parseInvestorSubmission(body) {
  const submission = {
    fullName: sanitizeString(body?.fullName),
    workEmail: sanitizeString(body?.workEmail).toLowerCase(),
    organization: sanitizeString(body?.organization),
    stage: sanitizeString(body?.stage, 60),
    message: sanitizeString(body?.message, 1000),
  }

  if (submission.fullName.length < 2) {
    throw new SubmissionError(400, 'Full name must be at least 2 characters.')
  }
  if (!isValidEmail(submission.workEmail)) {
    throw new SubmissionError(400, 'A valid work email is required.')
  }
  if (!submission.organization) {
    throw new SubmissionError(400, 'Organization name is required.')
  }
  if (!submission.stage) {
    throw new SubmissionError(400, 'Investment stage is required.')
  }

  return submission
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL)
}

async function sendNotification({ subject, replyTo, text }) {
  if (!isResendConfigured()) {
    throw new SubmissionError(503, 'Email notifications are not configured.')
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: [process.env.SUBMISSION_NOTIFICATION_EMAIL || 'founders@hirelystreet.com'],
    replyTo,
    subject,
    text,
  })

  if (error) {
    console.error('[Submissions] Resend delivery error:', error)
    throw new SubmissionError(502, 'Email notification could not be delivered.')
  }
}

export function buildInvestorNotification(submission) {
  return {
    subject: 'New investor inquiry',
    replyTo: submission.workEmail,
    text: [
      'New investor inquiry from HirelyStreet',
      '',
      `Name: ${submission.fullName}`,
      `Email: ${submission.workEmail}`,
      `Organization: ${submission.organization}`,
      `Investment stage: ${submission.stage}`,
      '',
      'Message:',
      submission.message || '(none)',
      '',
      `Submitted: ${new Date().toISOString()}`,
    ].join('\n'),
  }
}

export function sendInvestorNotification(submission) {
  return sendNotification(buildInvestorNotification(submission))
}

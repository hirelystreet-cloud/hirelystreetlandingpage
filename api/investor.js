import {
  isResendConfigured,
  parseInvestorSubmission,
  sendInvestorNotification,
  SubmissionError,
} from '../server/submission-helpers.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed.' })
  }

  if (!isResendConfigured()) {
    return res.status(503).json({ message: 'Investor inquiries are not configured.' })
  }

  let submission
  try {
    submission = parseInvestorSubmission(req.body)
  } catch (error) {
    if (error instanceof SubmissionError) {
      return res.status(error.status).json({ message: error.message })
    }
    console.error('[Investor] Invalid submission:', error)
    return res.status(400).json({ message: 'Invalid investor inquiry.' })
  }

  try {
    await sendInvestorNotification(submission)
    return res.status(200).json({ ok: true, emailSent: true })
  } catch (error) {
    console.error('[Investor] Email delivery failed:', error)
    const status = error instanceof SubmissionError ? error.status : 502
    return res.status(status).json({
      message: 'Unable to send your inquiry right now. Please try again shortly.',
    })
  }
}

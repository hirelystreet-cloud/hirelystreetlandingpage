import { createClient } from '@supabase/supabase-js'
import {
  parseWaitlistSubmission,
  SubmissionError,
} from '../server/submission-helpers.js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed.' })
  }

  if (!supabase) {
    return res.status(503).json({ message: 'Waitlist submissions are not configured.' })
  }

  let submission
  try {
    submission = parseWaitlistSubmission(req.body)
  } catch (error) {
    if (error instanceof SubmissionError) {
      return res.status(error.status).json({ message: error.message })
    }
    console.error('[Waitlist] Invalid submission:', error)
    return res.status(400).json({ message: 'Invalid waitlist submission.' })
  }

  let result
  try {
    result = await supabase
      .from('waitlist')
      .insert({
        type: submission.type,
        full_name: submission.fullName,
        email: submission.email,
        city: submission.city,
        interests: submission.interests,
      })
      .select('id')
      .single()
  } catch (error) {
    console.error('[Waitlist] Supabase connection error:', error)
    return res.status(502).json({ message: 'Unable to save your waitlist submission.' })
  }

  const { data, error } = result

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        message: "You're already on this waitlist with this email address.",
      })
    }
    console.error('[Waitlist] Supabase insert error:', error)
    return res.status(502).json({ message: 'Unable to save your waitlist submission.' })
  }

  return res.status(200).json({ ok: true, id: data.id })
}

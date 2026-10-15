import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildInvestorNotification,
  parseInvestorSubmission,
  parseWaitlistSubmission,
  SubmissionError,
} from './submission-helpers.js'

test('waitlist submissions preserve their customer or provider audience', () => {
  const common = {
    fullName: '  Rohan Sharma  ',
    email: 'ROHAN@example.com',
    city: ' Bengaluru ',
    interests: 'Web & app development',
  }

  assert.deepEqual(parseWaitlistSubmission({ ...common, type: 'customer' }), {
    type: 'customer',
    fullName: 'Rohan Sharma',
    email: 'rohan@example.com',
    city: 'Bengaluru',
    interests: 'Web & app development',
  })
  assert.equal(parseWaitlistSubmission({ ...common, type: 'provider' }).type, 'provider')
})

test('waitlist rejects unsupported audiences and invalid email addresses', () => {
  assert.throws(
    () => parseWaitlistSubmission({ type: 'admin' }),
    (error) => error instanceof SubmissionError && error.status === 400,
  )
  assert.throws(
    () => parseWaitlistSubmission({
      type: 'customer',
      fullName: 'Rohan Sharma',
      email: 'not-an-email',
      city: 'Bengaluru',
      interests: 'Design',
    }),
    (error) => error instanceof SubmissionError && error.message === 'A valid email is required.',
  )
})

test('investor submissions normalize email and bound optional messages', () => {
  const submission = parseInvestorSubmission({
    fullName: 'Asha Investor',
    workEmail: 'ASHA@EXAMPLE.COM',
    organization: 'Example Capital',
    stage: 'Seed',
    message: 'Interested',
  })

  assert.equal(submission.workEmail, 'asha@example.com')
  assert.equal(submission.message, 'Interested')
})

test('investor inquiries build a notification email', () => {
  const email = buildInvestorNotification({
    fullName: 'Vikram Mehta',
    workEmail: 'vikram@example.com',
    organization: 'Example Capital',
    stage: 'Seed',
    message: '',
  })

  assert.equal(email.subject, 'New investor inquiry')
  assert.match(email.text, /Organization: Example Capital/)
})

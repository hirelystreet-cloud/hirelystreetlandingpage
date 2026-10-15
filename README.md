# HirelyStreet

HirelyStreet's marketing landing page, built with React, TypeScript, and Vite. The Express API in `server/` handles waitlist registrations and investor inquiries.

## Getting started

Install dependencies:

```bash
npm install
```

Run the frontend and API in separate terminals:

```bash
npm run dev
```

```bash
npm run server
```

Build the frontend for production:

```bash
npm run build
```

## Form submissions

Customer and provider waitlist signups are stored in Supabase's `waitlist` table and identified by the `type` column. No email is sent for waitlist signups. To view and manage submissions online, open the Supabase project, choose **Table Editor**, then select `waitlist`; filter the `type` column to view customers or providers. Investor inquiries are sent by email using Resend.

Create a Supabase project, then run [`supabase/schema.sql`](./supabase/schema.sql) in its SQL Editor. Add these server-side environment variables in Vercel:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (for investor inquiry emails)
- `RESEND_FROM_EMAIL` (for investor inquiry emails)
- `SUBMISSION_NOTIFICATION_EMAIL` (optional; investor inquiry recipient, defaults to `founders@hirelystreet.com`)

Verify the sender domain in Resend before using a sender address on that domain. Do not expose the Supabase service-role key or Resend API key as `VITE_` variables. Waitlist submissions require only the Supabase variables.

The Vercel API functions in `api/` handle production submissions. Locally, run the Express API with the configuration in `.env.example`. The local JSON files in `data/` are a development fallback and are excluded from Git.

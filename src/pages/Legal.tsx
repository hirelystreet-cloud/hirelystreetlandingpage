export function PrivacyPolicy() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '120px 24px 80px', fontFamily: "'Rubik', sans-serif" }}>
      <a href="/" style={{ color: '#16a34a', textDecoration: 'none', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.02em' }}>
        ← Back to HirelyStreet
      </a>
      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', marginTop: 32, marginBottom: 8 }}>Privacy policy</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 48 }}>Last updated: October 2026</p>
      {[
        {
          heading: 'What we collect',
          body: 'When you join the waitlist or submit an investor inquiry, we collect your name, email address, city, and the service categories you indicated. We collect only what is necessary to contact you when HirelyStreet launches.',
        },
        {
          heading: 'How we use your information',
          body: 'We use your details to notify you when HirelyStreet becomes available in your city, and to understand the demand for specific service categories. We do not use your information for advertising or share it with third parties.',
        },
        {
          heading: 'Data storage',
          body: 'Waitlist submissions are stored securely in a database managed by Supabase. Investor inquiries are transmitted by email and retained only as necessary to follow up.',
        },
        {
          heading: 'Your rights',
          body: 'You may request deletion of your data at any time by emailing founders@hirelystreet.com. We will process your request within 30 days.',
        },
        {
          heading: 'Contact',
          body: 'For any privacy-related questions, please write to founders@hirelystreet.com.',
        },
      ].map(({ heading, body }) => (
        <section key={heading} style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', marginBottom: 12 }}>{heading}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#333' }}>{body}</p>
        </section>
      ))}
    </main>
  )
}

export function TermsOfService() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '120px 24px 80px', fontFamily: "'Rubik', sans-serif" }}>
      <a href="/" style={{ color: '#16a34a', textDecoration: 'none', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.02em' }}>
        ← Back to HirelyStreet
      </a>
      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em', marginTop: 32, marginBottom: 8 }}>Terms of service</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 48 }}>Last updated: October 2026</p>
      {[
        {
          heading: 'Pre-launch status',
          body: 'HirelyStreet is currently in pre-launch. No commercial service is available through this website. The waitlist and investor inquiry forms are for interest registration only.',
        },
        {
          heading: 'No service guarantee',
          body: 'Joining the waitlist does not guarantee access to any product or service. Product features described on this site represent the intended product vision and are subject to change.',
        },
        {
          heading: 'Acceptable use',
          body: 'You agree not to submit false information, attempt to circumvent rate limiting, or use this site in any way that could harm HirelyStreet or other users.',
        },
        {
          heading: 'Limitation of liability',
          body: 'HirelyStreet is not liable for any losses or damages arising from use of this pre-launch website. The site is provided as-is without warranty.',
        },
        {
          heading: 'Contact',
          body: 'For terms-related questions, please write to founders@hirelystreet.com.',
        },
      ].map(({ heading, body }) => (
        <section key={heading} style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', marginBottom: 12 }}>{heading}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#333' }}>{body}</p>
        </section>
      ))}
    </main>
  )
}

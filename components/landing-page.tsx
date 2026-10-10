"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";

type WaitlistRole = "customer" | "provider";
type IconName = "request" | "tag" | "map" | "proposal" | "check" | "shield" | "users" | "arrow";

const faqItems = [
  [
    "What is HirelyStreet?",
    "A unified marketplace connecting customers with trusted professionals online and offline, across every category of service.",
  ],
  ["What services can I request?", "Find all kinds of services in one place, online or offline."],
  [
    "How do I find a provider?",
    "Post what you need and HirelyStreet connects you with service providers through smart matching.",
  ],
  [
    "How are requests categorized?",
    "The AI-powered tag system automatically categorizes each request using intelligent tags.",
  ],
  [
    "How does HirelyStreet build trust?",
    "Every completed job builds trust through ratings, reviews, and completion history.",
  ],
  [
    "Who can join as a provider?",
    "The marketplace welcomes freelancers, specialists, local professionals, and service businesses.",
  ],
];

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    request: <path d="M5 4h14v16H5zM8 8h8M8 12h6M8 16h4" />,
    tag: <path d="m4 7 7-3 9 9-7 7-9-9V7ZM8 8h.01" />,
    map: <path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2V6ZM9 4v14m6-12v14" />,
    proposal: <path d="M7 3h8l4 4v14H7zM15 3v5h4M10 12h6M10 16h4" />,
    check: <path d="m5 12 4 4L19 6" />,
    shield: <path d="M12 3 19 6v5c0 4.6-2.9 8.4-7 10-4.1-1.6-7-5.4-7-10V6l7-3Zm-3 9 2 2 4-4" />,
    users: <path d="M16 20v-1.5c0-2.2-1.8-4-4-4H7c-2.2 0-4 1.8-4 4V20m12-10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM21 20v-1.5c0-1.9-1.3-3.5-3-3.9M9.5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  };

  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>{children}</div>;
}

function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container ${className}`}>{children}</div>;
}

function Section({ id, tone = "paper", children, className = "" }: { id?: string; tone?: "paper" | "mist" | "ink"; children: ReactNode; className?: string }) {
  return <section id={id} className={`section section-${tone} ${className}`}>{children}</section>;
}

function SectionHeading({ eyebrow, title, body, inverse = false }: { eyebrow?: string; title: string; body: string; inverse?: boolean }) {
  return (
    <div className={`section-heading ${inverse ? "section-heading-inverse" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

function PillLink({ href, children, variant = "primary", className = "", onClick }: { href: string; children: ReactNode; variant?: "primary" | "outline" | "dark"; className?: string; onClick?: () => void }) {
  return <a href={href} onClick={onClick} className={`pill-button pill-${variant} ${className}`}>{children}<Icon name="arrow" /></a>;
}

function Header() {
  return (
    <header className="site-header">
      <Container className="header-inner">
        <a className="brand" href="#top" aria-label="HirelyStreet home">
          <Image src="/brand/logo-nav.png" alt="HirelyStreet" width={48} height={48} priority />
          <span>HirelyStreet</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#providers">For providers</a>
          <a href="#faq">FAQ</a>
        </nav>
        <PillLink href="#waitlist" variant="outline" className="header-cta">Join waitlist</PillLink>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#providers">For providers</a>
            <a href="#faq">FAQ</a>
          </nav>
        </details>
      </Container>
    </header>
  );
}

function RequestCard() {
  return (
    <div className="request-card" aria-label="Example service request and proposals">
      <div className="mockup-topline"><span className="status-dot" />New request</div>
      <strong>I need help at home</strong>
      <div className="tag-row"><span>Local</span><span>Home service</span></div>
      <div className="proposal-stack">
        <div className="proposal-card"><span className="proposal-avatar">A</span><div><b>New proposal</b><small>Available nearby</small></div><Icon name="check" /></div>
        <div className="proposal-card proposal-card-offset"><span className="proposal-avatar">R</span><div><b>New proposal</b><small>Remote option</small></div><Icon name="check" /></div>
      </div>
    </div>
  );
}

function TrustRecord() {
  return (
    <div className="trust-record" aria-label="Example completion history">
      <div className="trust-record-head"><Icon name="shield" /><div><span>Trust layer</span><strong>Completion history</strong></div></div>
      <div className="trust-record-line"><span className="complete-mark"><Icon name="check" /></span><span>Completed job</span><span className="stars" aria-label="Rating">★★★★★</span></div>
      <div className="trust-record-line"><span className="complete-mark"><Icon name="check" /></span><span>Review received</span><span className="record-status">Recorded</span></div>
      <div className="trust-record-line"><span className="complete-mark"><Icon name="check" /></span><span>History updated</span><span className="record-status">Current</span></div>
    </div>
  );
}

function WaitlistForm({ role, onRoleChange }: { role: WaitlistRole; onRoleChange: (role: WaitlistRole) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) nextErrors.name = "Enter at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setMessage("Please correct the highlighted fields.");
      return;
    }

    setErrors({});
    setMessage("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, role }) });
      const data = (await response.json()) as { message?: string; errors?: Record<string, string> };
      if (!response.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.message ?? "We could not check your request. Please try again.");
        return;
      }
      setMessage(data.message ?? "Your request has been checked.");
    } catch {
      setMessage("We could not reach the waitlist service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="waitlist-form" onSubmit={submit} noValidate>
      <div className="form-field">
        <label htmlFor="waitlist-name">Name</label>
        <input id="waitlist-name" name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "waitlist-name-error" : undefined} />
        {errors.name && <p id="waitlist-name-error" className="field-error">{errors.name}</p>}
      </div>
      <div className="form-field">
        <label htmlFor="waitlist-email">Email</label>
        <input id="waitlist-email" name="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "waitlist-email-error" : undefined} />
        {errors.email && <p id="waitlist-email-error" className="field-error">{errors.email}</p>}
      </div>
      <fieldset className="role-field" aria-describedby={errors.role ? "waitlist-role-error" : undefined}>
        <legend>I am here to</legend>
        <div className="role-options">
          <label><input type="radio" name="role" value="customer" checked={role === "customer"} onChange={() => onRoleChange("customer")} /><span>Find a service</span></label>
          <label><input type="radio" name="role" value="provider" checked={role === "provider"} onChange={() => onRoleChange("provider")} /><span>Provide a service</span></label>
        </div>
        {errors.role && <p id="waitlist-role-error" className="field-error">{errors.role}</p>}
      </fieldset>
      <button className="pill-button pill-primary form-submit" type="submit" disabled={submitting}>{submitting ? "Checking request…" : "Join the waitlist"}<Icon name="arrow" /></button>
      <p className="form-note">This development form validates requests but does not store them yet.</p>
      {message && <p className="form-status" role="status" aria-live="polite">{message}</p>}
    </form>
  );
}

export function LandingPage() {
  const [role, setRole] = useState<WaitlistRole>("customer");

  function chooseProvider() {
    setRole("provider");
  }

  return (
    <div id="top" className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header />
      <main id="main-content">
        <Section className="hero-section">
          <Container className="hero-grid">
            <Reveal className="hero-copy">
              <p className="eyebrow">A unified marketplace</p>
              <h1>One platform for every service request.</h1>
              <p className="hero-subline">Connect with trusted professionals online and offline across every service category.</p>
              <ul className="check-list"><li><Icon name="check" />Post what you need instantly.</li><li><Icon name="check" />Receive proposals and choose the best fit.</li><li><Icon name="check" />Match with local or remote providers.</li></ul>
              <PillLink href="#waitlist">Join the waitlist</PillLink>
            </Reveal>
            <Reveal className="hero-visual">
              <Image src="/images/hero-network.webp" alt="Local and remote professionals connected across a city" width={1448} height={1086} priority sizes="(min-width: 1024px) 54vw, 100vw" />
              <RequestCard />
            </Reveal>
          </Container>
        </Section>

        <Section id="problem" tone="mist">
          <Container>
            <Reveal><SectionHeading eyebrow="The problem" title="Services are scattered across platforms." body="Multiple platforms make service discovery time-consuming, confusing, and dissatisfying." /></Reveal>
            <Reveal className="problem-grid">
              <article className="surface-card"><span className="icon-badge"><Icon name="request" /></span><h3>For customers</h3><p>Customers struggle to find the right provider. Services are scattered across multiple platforms with no single solution.</p></article>
              <article className="surface-card"><span className="icon-badge"><Icon name="users" /></span><h3>For providers</h3><p>Skilled professionals and small businesses struggle to get discovered and reach customers.</p></article>
            </Reveal>
          </Container>
        </Section>

        <Section id="how-it-works">
          <Container>
            <Reveal><SectionHeading eyebrow="How it works" title="From request to a provider." body="Post a need, receive proposals, choose a fit, and build trust." /></Reveal>
            <Reveal className="steps-grid">
              {[ ["01", "request", "Post your need", "Post what you need instantly."], ["02", "tag", "Get intelligent tags", "Your request is automatically categorized."], ["03", "map", "Find a match", "Get matched with local or remote providers."], ["04", "proposal", "Review proposals", "Receive multiple proposals."], ["05", "shield", "Build trust", "Completed jobs build trust over time."] ].map(([number, icon, title, body]) => <article className="step" key={number}><span>{number}</span><Icon name={icon as IconName} /><h3>{title}</h3><p>{body}</p></article>)}
            </Reveal>
          </Container>
        </Section>

        <Section id="comparison" tone="mist">
          <Container>
            <Reveal><SectionHeading eyebrow="The difference" title="Same need, a smarter way." body="A unified marketplace brings service requests into one place." /></Reveal>
            <Reveal className="comparison-table">
              <div className="comparison-head"><span>Old way</span><span>HirelyStreet way</span></div>
              <div className="comparison-row"><p>Services are scattered across multiple platforms.</p><p>Find all kinds of services in one place, online or offline.</p></div>
              <div className="comparison-row"><p>Finding services can be time-consuming, confusing, and lead to dissatisfaction.</p><p>Post a request, receive multiple proposals, and choose the best fit.</p></div>
            </Reveal>
          </Container>
        </Section>

        <Section id="trust" tone="ink">
          <Container className="trust-grid">
            <Reveal><SectionHeading eyebrow="Trust layer" title="Trust grows with every completed job." body="Ratings, reviews, and completion history form the trust layer." inverse /><ul className="check-list check-list-inverse"><li><Icon name="check" />Every completed job builds trust.</li><li><Icon name="check" />Ratings, reviews, and completion history stay connected.</li></ul><PillLink href="#waitlist" variant="primary">Join the waitlist</PillLink></Reveal>
            <Reveal><TrustRecord /></Reveal>
          </Container>
        </Section>

        <Section id="providers">
          <Container className="provider-grid">
            <Reveal className="provider-image"><Image src="/images/provider-work.webp" alt="A local professional and a remote specialist connected by a service path" width={1448} height={1086} sizes="(min-width: 768px) 50vw, 100vw" /></Reveal>
            <Reveal><SectionHeading eyebrow="For providers" title="Get discovered by customers." body="A marketplace for skilled professionals and small businesses." /><ul className="check-list"><li><Icon name="check" />Reach customers through one marketplace for online and offline services.</li><li><Icon name="check" />Join freelancers, specialists, local professionals, and service businesses.</li><li><Icon name="check" />Connect through smart matching.</li></ul><PillLink href="#waitlist" onClick={chooseProvider}>Join the provider waitlist</PillLink></Reveal>
          </Container>
        </Section>

        <Section id="traction" tone="mist">
          <Container>
            <Reveal><SectionHeading eyebrow="Traction" title="Validation and progress so far." body="Waitlist, foundation work, and prototype progress from the pitch deck." /></Reveal>
            <Reveal className="traction-grid">
              <article className="surface-card"><span className="icon-badge"><Icon name="users" /></span><h3>Waitlist progress</h3><p>100 customers and 50 service providers are on the waitlist.</p></article>
              <article className="surface-card"><span className="icon-badge"><Icon name="check" /></span><h3>Business foundation</h3><p>Domain, brand identity, professional business email, and LinkedIn company page are established.</p></article>
              <article className="surface-card"><span className="icon-badge"><Icon name="proposal" /></span><h3>Prototype design</h3><p>Customer, provider, and admin perspectives are designed; the mobile prototype is completed.</p></article>
            </Reveal>
          </Container>
        </Section>

        <Section id="waitlist">
          <Container className="waitlist-grid">
            <Reveal><SectionHeading eyebrow="Early access" title="Join the waitlist." body="For customers and providers across online and offline services." /><p className="waitlist-support">For freelancers, specialists, local professionals, and service businesses.</p><Image className="waitlist-image" src="/images/waitlist-city.webp" alt="" width={1254} height={1254} sizes="(min-width: 768px) 36vw, 90vw" /></Reveal>
            <Reveal className="form-panel"><WaitlistForm role={role} onRoleChange={setRole} /></Reveal>
          </Container>
        </Section>

        <Section id="faq" tone="mist">
          <Container className="faq-wrap">
            <Reveal><SectionHeading eyebrow="FAQ" title="Questions, answered." body="Answers are limited to the pitch deck's stated product plan." /></Reveal>
            <Reveal className="faq-list">{faqItems.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</Reveal>
          </Container>
        </Section>
      </main>
      <footer className="site-footer">
        <Container className="footer-grid"><div><a className="brand footer-brand" href="#top"><Image src="/brand/logo-nav.png" alt="HirelyStreet" width={48} height={48} /><span>HirelyStreet</span></a><p>Connecting customers with trusted professionals online and offline.</p></div><div><p className="footer-label">Contact</p><a href="mailto:hirelystreet@gmail.com">hirelystreet@gmail.com</a><a href="https://hirelystreet.com/">hirelystreet.com</a><span>Hyderabad, Telangana, India</span></div><div className="footer-action"><PillLink href="#waitlist" variant="primary">Join the waitlist</PillLink></div></Container>
      </footer>
    </div>
  );
}

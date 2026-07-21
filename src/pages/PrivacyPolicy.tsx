import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Who we are',
    body: 'KV Creations (“we”, “us”, or “our”) is a wedding planning and event management atelier. This Privacy Policy explains how we collect, use, and protect information when you visit our website or contact us about our services.',
  },
  {
    title: 'Information we collect',
    body: 'When you inquire through our website or email, you may share your name, email address, event date, and any message details you choose to provide. We may also receive basic technical data that your browser sends automatically, such as device type, browser type, and general usage information needed to keep the site working securely.',
  },
  {
    title: 'How we use your information',
    body: 'We use the information you share to respond to inquiries, discuss availability and planning needs, improve our website experience, and communicate about services you have requested. We do not sell your personal information.',
  },
  {
    title: 'How we share information',
    body: 'We may share information with trusted service providers who help us operate our website, email, or hosting (for example, hosting and email delivery partners), only as needed to provide those services. We may also disclose information if required by law or to protect our legal rights.',
  },
  {
    title: 'Cookies and analytics',
    body: 'Our website may use cookies or similar technologies that help the site function and, where enabled by our hosting platform, understand general traffic patterns. You can control cookies through your browser settings.',
  },
  {
    title: 'Data retention',
    body: 'We keep inquiry and communication records only as long as needed to respond to you, manage ongoing planning conversations, and meet legal or operational requirements. When information is no longer needed, we take reasonable steps to delete or de-identify it.',
  },
  {
    title: 'Your choices',
    body: 'You may request access to, correction of, or deletion of personal information you have shared with us by contacting us at the email below. We will respond within a reasonable time.',
  },
  {
    title: "Children's privacy",
    body: 'Our website and services are intended for adults arranging weddings and events. We do not knowingly collect personal information from children.',
  },
  {
    title: 'Updates to this policy',
    body: 'We may update this Privacy Policy from time to time. The “Last updated” date at the top of this page will change when we do. Continued use of the site after an update means you acknowledge the revised policy.',
  },
  {
    title: 'Contact',
    body: 'For privacy questions or requests, email hello@kvcreations.com.',
  },
]

export default function PrivacyPolicy() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-gold/10 bg-maroon-core/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[900px] items-center justify-between px-5 md:h-20 md:px-10">
          <Link
            to="/"
            className="font-[family-name:var(--font-display)] text-[13px] font-medium tracking-[0.35em] text-ivory transition-colors duration-300 hover:text-gold md:text-sm"
          >
            KV CREATIONS
          </Link>
          <Link
            to="/"
            className="font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.28em] text-gold transition-colors hover:text-gold-bright"
          >
            Back home
          </Link>
        </div>
      </header>

      <main className="bg-maroon-core px-5 pb-24 pt-28 md:px-10 md:pb-36 md:pt-36">
        <article className="mx-auto max-w-[720px]">
          <p className="font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.28em] text-gold">
            Legal
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.1] text-ivory">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm font-light text-ivory-muted">
            Last updated: July 21, 2026
          </p>

          <div className="mt-14 space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-[family-name:var(--font-display)] text-xl font-medium text-ivory md:text-2xl">
                  {section.title}
                </h2>
                <p className="mt-3 text-base font-light leading-relaxed text-ivory-muted">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-16 border-t border-gold/20 pt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-3 font-[family-name:var(--font-body)] text-[12px] font-light uppercase tracking-[0.32em] text-gold transition-colors hover:text-gold-bright"
            >
              <span className="border-b border-gold/50 pb-1">Return to KV Creations</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

import { useEffect, useRef, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import Lenis from 'lenis'

function useSmoothScroll() {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.4,
    })

    document.documentElement.classList.add('lenis', 'lenis-smooth')

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
    }
  }, [reduce])
}

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ y: 24 }}
      animate={{ y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 90,
        damping: 22,
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-20 md:px-10">
        <a href="#top" className="group flex items-center gap-3" aria-label="KV Creations home">
          <span className="font-[family-name:var(--font-display)] text-[13px] font-medium tracking-[0.35em] text-ivory transition-colors duration-300 group-hover:text-gold md:text-sm">
            KV CREATIONS
          </span>
        </a>
        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {[
            ['Story', '#story'],
            ['Atelier', '#atelier'],
            ['Gallery', '#gallery'],
            ['Process', '#process'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.28em] text-ivory/75 transition-colors duration-300 hover:text-gold"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#inquire"
          className="font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.28em] text-gold transition-colors duration-300 hover:text-gold-bright"
        >
          Inquire
        </a>
      </div>
    </header>
  )
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.35])

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-dvh overflow-hidden bg-maroon-core"
    >
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y, scale }}
      >
        <img
          src="/images/hero.jpg"
          alt="Floral wedding backdrop with gold frames and draped silk"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon-core/55 via-maroon-core/35 to-maroon-core" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(25,5,4,0.55)_75%)]" />
      </motion.div>

      <motion.div
        className="relative z-10 flex min-h-dvh flex-col justify-end px-5 pb-14 pt-28 md:justify-center md:px-10 md:pb-20 md:pt-28"
        style={reduce ? undefined : { opacity }}
      >
        <div className="mx-auto w-full max-w-[1400px]">
          <Reveal>
            <img
              src="/logo/logo-hero.png"
              alt="KV Creations"
              className="mb-5 h-[8.5rem] w-auto drop-shadow-[0_12px_40px_rgba(0,0,0,0.55)] md:mb-7 md:h-44 lg:h-48"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-[18ch] font-[family-name:var(--font-display)] text-[clamp(1.9rem,4.8vw,4rem)] font-medium leading-[1.1] tracking-tight text-ivory">
              Creating the vibe that turns occasions into experiences
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 max-w-[38ch] font-[family-name:var(--font-body)] text-base font-light leading-relaxed text-ivory-muted md:text-lg">
              Wedding planning and event production for celebrations that feel lived-in, luminous, and entirely your own.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <BeginStoryLink />
          </Reveal>
        </div>
      </motion.div>
    </section>
  )
}

function BeginStoryLink() {
  return (
    <a
      href="#inquire"
      className="group mt-9 inline-flex items-center gap-3 font-[family-name:var(--font-body)] text-[12px] font-light uppercase tracking-[0.32em] text-gold"
    >
      <span className="border-b border-gold/50 pb-1 transition-colors duration-300 group-hover:border-gold group-hover:text-gold-bright">
        Begin your story
      </span>
      <span
        aria-hidden
        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </a>
  )
}

function Story() {
  return (
    <section id="story" className="relative bg-maroon-core px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-12 lg:gap-16 lg:items-end">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="font-[family-name:var(--font-display)] text-gold text-sm tracking-[0.2em]">
              The atelier
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.1] tracking-tight text-ivory">
              We craft the atmosphere around every ritual.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-[42ch] text-base font-light leading-relaxed text-ivory-muted md:text-lg">
              KV Creations is a wedding and event atelier rooted in South Indian celebration culture. From mandap and mehendi to reception nights, we design rooms, rituals, and guest flow that feel intentional.
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden">
              <img
                src="/images/story.jpg"
                alt="Bride in traditional South Indian bridal attire by an arched window"
                className="aspect-[5/6] w-full max-h-[34rem] object-cover object-bottom md:aspect-[4/5] md:max-h-[36rem]"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/20" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const services = [
  {
    title: 'Weddings',
    copy: 'Full planning and day-of direction for ceremonies that honor tradition while feeling intimate, cinematic, and entirely yours.',
    image: '/images/service-weddings.jpg',
  },
  {
    title: 'Celebrations',
    copy: 'Haldi, mehendi, receptions, and private parties composed with florals, light, and guest experience treated as design.',
    image: '/images/service-celebrations.jpg',
  },
  {
    title: 'Galas & gatherings',
    copy: 'Family functions and brand evenings where hospitality, staging, and atmosphere carry the night.',
    image: '/images/service-galas.jpg',
  },
]

function Atelier() {
  return (
    <section id="atelier" className="bg-maroon px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="max-w-[16ch] font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.1] text-ivory">
            What we produce
          </h2>
        </Reveal>
        <div className="mt-14 divide-y divide-gold/20 border-y border-gold/20">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="group grid gap-8 py-10 md:grid-cols-12 md:items-center md:gap-10 md:py-12"
            >
              <div className="md:col-span-5 lg:col-span-4">
                <Reveal delay={index * 0.06}>
                  <div className="overflow-hidden">
                    <img
                      src={service.image}
                      alt=""
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                </Reveal>
              </div>
              <div className="md:col-span-7 lg:col-span-8">
                <Reveal delay={0.05 + index * 0.06}>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-ivory md:text-3xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-[48ch] text-base font-light leading-relaxed text-ivory-muted">
                    {service.copy}
                  </p>
                </Reveal>
              </div>
            </article>
          ))}
        </div>
        <Reveal delay={0.12}>
          <FramedInquire />
        </Reveal>
      </div>
    </section>
  )
}

function FramedInquire() {
  return (
    <a
      href="#inquire"
      className="mt-14 inline-flex border border-gold/45 px-8 py-4 font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.3em] text-gold transition-colors duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold-bright"
    >
      Inquire about dates
    </a>
  )
}

function Gallery() {
  const items = [
    { src: '/images/portfolio/2WV07722.jpg', alt: 'Petal shower during the wedding ceremony', span: 'md:col-span-7' },
    { src: '/images/portfolio/ABI_3806.jpg', alt: 'Bridal portrait by an arched window', span: 'md:col-span-5' },
    { src: '/images/portfolio/2WV06243.jpg', alt: 'Outdoor floral and gold frame backdrop', span: 'md:col-span-5' },
    { src: '/images/portfolio/2WV07753.jpg', alt: 'Joyful haldi celebration with family', span: 'md:col-span-7' },
    { src: '/images/portfolio/ABI_4057.jpg', alt: 'South Indian bride in red veil and gold jewelry', span: 'md:col-span-4' },
    { src: '/images/portfolio/ABI_3950.jpg', alt: 'Candid bridal moment with a smile', span: 'md:col-span-4' },
    { src: '/images/portfolio/2WV06426.jpg', alt: 'Guest styled for a festive garden celebration', span: 'md:col-span-4' },
    { src: '/images/portfolio/2WV05578.jpg', alt: 'Family gathered under a floral mandap entrance', span: 'md:col-span-6' },
    { src: '/images/portfolio/ABI_4434.jpg', alt: 'Artistic bridal portrait in the open air', span: 'md:col-span-6' },
    { src: '/images/portfolio/_DSF8810.jpg', alt: 'Quiet bridal moment by the window light', span: 'md:col-span-5' },
    { src: '/images/portfolio/ABI_4282.jpg', alt: 'Wedding celebration portrait', span: 'md:col-span-7' },
    { src: '/images/portfolio/2WV06311.jpg', alt: 'Couple moment from the celebration', span: 'md:col-span-6' },
    { src: '/images/portfolio/ABI_4509.jpg', alt: 'Bridal styling detail', span: 'md:col-span-6' },
  ]

  return (
    <section id="gallery" className="bg-maroon-core px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.1] text-ivory">
            Recent atmospheres
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-4 max-w-[42ch] text-base font-light leading-relaxed text-ivory-muted">
            Real celebrations produced with KV Creations. Rituals, rooms, and the people who made them glow.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-12 md:gap-5">
          {items.map((item, index) => (
            <Reveal key={item.src} delay={Math.min(index * 0.03, 0.24)} className={item.span}>
              <figure className="group relative overflow-hidden">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="aspect-[16/11] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <figcaption className="pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon-core/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const steps = [
  {
    num: '01',
    title: 'Discovery',
    copy: 'We listen for the tone of the day: guest list, rituals, venues, and the feeling you want people to leave with.',
    image: '/images/portfolio/ABI_3950.jpg',
    alt: 'Candid bridal moment during early celebration energy',
    cue: 'Listen',
  },
  {
    num: '02',
    title: 'Design',
    copy: 'Mood, florals, lighting, and flow become a clear plan. Every choice earns its place in the room.',
    image: '/images/portfolio/2WV06243.jpg',
    alt: 'Floral and gold frame backdrop design',
    cue: 'Compose',
  },
  {
    num: '03',
    title: 'Production',
    copy: 'Vendors, timing, and guest experience are directed on the ground so you can be present.',
    image: '/images/portfolio/2WV07722.jpg',
    alt: 'Petal shower during live wedding ceremony',
    cue: 'Direct',
  },
]

function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-maroon px-5 py-24 md:px-10 md:py-36">
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-gold/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-maroon-core/50 blur-3xl" />

      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h2 className="max-w-[14ch] font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.1] text-ivory">
              From first conversation to final cue
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-[28ch] font-[family-name:var(--font-body)] text-sm font-light leading-relaxed text-ivory-muted md:text-right">
              A quiet path from listening to the live room. Three movements, one celebration.
            </p>
          </Reveal>
        </div>

        <ol className="relative mt-16 md:mt-24">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent md:left-1/2 md:-translate-x-px"
          />

          {steps.map((step, index) => {
            const flip = index % 2 === 1
            return (
              <li key={step.num} className="relative py-10 md:py-14">
                <span
                  aria-hidden
                  className="absolute left-4 top-14 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center md:left-1/2 md:top-1/2 md:-translate-y-1/2"
                >
                  <span className="absolute h-3 w-3 rounded-full bg-gold/30" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-gold" />
                </span>

                <div className="grid items-center gap-8 pl-10 md:grid-cols-2 md:gap-16 md:pl-0">
                  <Reveal
                    delay={index * 0.06}
                    className={flip ? 'md:order-2' : 'md:order-1'}
                  >
                    <div className="group relative overflow-hidden">
                      <img
                        src={step.image}
                        alt={step.alt}
                        className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] md:aspect-[5/6]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-maroon-core/55 via-transparent to-transparent" />
                      <p className="absolute bottom-4 left-4 font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.35em] text-gold">
                        {step.cue}
                      </p>
                    </div>
                  </Reveal>

                  <Reveal
                    delay={0.08 + index * 0.06}
                    className={flip ? 'md:order-1 md:text-right' : 'md:order-2'}
                  >
                    <div className={flip ? 'md:ml-auto md:max-w-[34ch]' : 'md:max-w-[34ch]'}>
                      <p className="font-[family-name:var(--font-display)] text-6xl font-medium leading-none text-gold/25 md:text-7xl">
                        {step.num}
                      </p>
                      <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-ivory md:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-4 text-sm font-light leading-relaxed text-ivory-muted md:text-base">
                        {step.copy}
                      </p>
                      <div
                        className={`mt-6 h-px w-16 bg-gold/40 ${flip ? 'md:ml-auto' : ''}`}
                        aria-hidden
                      />
                    </div>
                  </Reveal>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function MagneticSendButton({ disabled }: { disabled?: boolean }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 16 })
  const springY = useSpring(y, { stiffness: 180, damping: 16 })
  const transform = useMotionTemplate`translate(${springX}px, ${springY}px)`
  const reduce = useReducedMotion()

  return (
    <motion.button
      type="submit"
      disabled={disabled}
      style={reduce ? undefined : { transform }}
      onMouseMove={(event) => {
        if (reduce) return
        const rect = event.currentTarget.getBoundingClientRect()
        const offsetX = event.clientX - rect.left - rect.width / 2
        const offsetY = event.clientY - rect.top - rect.height / 2
        x.set(offsetX * 0.25)
        y.set(offsetY * 0.25)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className="mt-2 w-full cursor-pointer bg-gold px-8 py-4 font-[family-name:var(--font-body)] text-[12px] font-normal uppercase tracking-[0.28em] text-maroon-core transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 md:w-auto"
    >
      Send inquiry
    </motion.button>
  )
}

function Inquire() {
  const reduce = useReducedMotion()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '')
    const email = String(data.get('email') || '')
    const eventDate = String(data.get('date') || '')
    const message = String(data.get('message') || '')
    const subject = encodeURIComponent(`KV Creations inquiry from ${name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nEvent date: ${eventDate}\n\n${message}`,
    )
    window.location.href = `mailto:hello@kvcreations.com?subject=${subject}&body=${body}`
  }

  return (
    <section id="inquire" className="bg-maroon-core px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <Reveal>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.1] text-ivory">
              Tell us about the day
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-[38ch] text-base font-light leading-relaxed text-ivory-muted">
              Share a few details and we will reply with availability, next steps, and how we can shape the celebration with you.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-10 overflow-hidden">
              <img
                src="/images/portfolio/ABI_4057.jpg"
                alt=""
                className="aspect-[4/5] w-full max-w-md object-cover object-top"
              />
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <form
              onSubmit={onSubmit}
              className="space-y-7 border border-gold/25 bg-maroon/40 p-6 md:p-10"
            >
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Event date" name="date" type="text" placeholder="Month / Year" />
              <label className="block">
                <span className="mb-2 block font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.24em] text-ivory-muted">
                  Message
                </span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full resize-y border border-gold/25 bg-maroon-core/60 px-4 py-3 font-[family-name:var(--font-body)] text-sm font-light text-ivory outline-none transition-colors duration-200 placeholder:text-ivory-muted/50 focus:border-gold"
                  placeholder="Venue, guest count, and anything that matters most"
                />
              </label>
              <MagneticSendButton />
              {!reduce && (
                <p className="text-xs font-light text-ivory-muted/70">
                  Opens your email client with the inquiry ready to send.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.24em] text-ivory-muted">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gold/25 bg-maroon-core/60 px-4 py-3 font-[family-name:var(--font-body)] text-sm font-light text-ivory outline-none transition-colors duration-200 placeholder:text-ivory-muted/50 focus:border-gold"
      />
    </label>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-maroon-core px-5 py-12 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <img src="/logo/logo-mark.png" alt="KV Creations" className="h-16 w-auto opacity-95" />
          <p className="mt-4 max-w-[28ch] text-sm font-light text-ivory-muted">
            Creating the vibe that turns occasions into experiences.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <a
            href="mailto:hello@kvcreations.com"
            className="border-b border-gold/40 pb-0.5 text-sm font-light text-gold transition-colors hover:border-gold hover:text-gold-bright"
          >
            hello@kvcreations.com
          </a>
          <Link
            to="/privacy"
            className="text-xs font-light uppercase tracking-[0.22em] text-ivory-muted/80 transition-colors hover:text-gold"
          >
            Privacy Policy
          </Link>
          <p className="text-xs font-light uppercase tracking-[0.22em] text-ivory-muted/60">
            © {new Date().getFullYear()} KV Creations
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  useSmoothScroll()

  return (
    <>
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <Story />
        <Atelier />
        <Gallery />
        <Process />
        <Inquire />
      </main>
      <Footer />
    </>
  )
}

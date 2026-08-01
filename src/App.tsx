import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-bronze/10 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-20 md:px-10">
        <a href="#top" className="group flex items-center gap-3" aria-label="KV Creations home">
          <span className="font-[family-name:var(--font-display)] text-[13px] font-medium tracking-[0.35em] text-ink transition-colors duration-300 group-hover:text-bronze md:text-sm">
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
              className="font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.28em] text-ink-muted transition-colors duration-300 hover:text-bronze"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#inquire"
          className="font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.28em] text-bronze transition-colors duration-300 hover:text-bronze-bright"
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
      className="relative min-h-dvh overflow-hidden bg-paper"
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
        <div className="absolute inset-0 bg-gradient-to-b from-scrim/35 via-transparent to-paper/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-scrim/80 via-scrim/40 to-transparent" />
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
            <h1 className="max-w-[18ch] font-[family-name:var(--font-display)] text-[clamp(1.9rem,4.8vw,4rem)] font-medium leading-[1.1] tracking-tight text-paper drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">
              Creating the vibe that turns occasions into experiences
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 max-w-[38ch] font-[family-name:var(--font-body)] text-base font-normal leading-relaxed text-paper drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] md:text-lg">
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
      className="group mt-9 inline-flex items-center gap-3 border border-white/80 bg-scrim/35 px-6 py-3.5 font-[family-name:var(--font-body)] text-[12px] font-medium uppercase tracking-[0.28em] text-white shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-[background-color,border-color] duration-300 hover:border-white hover:bg-scrim/50"
    >
      <span>Begin your story</span>
      <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </a>
  )
}

function Story() {
  return (
    <section id="story" className="relative bg-paper px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-12 lg:gap-16 lg:items-end">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="font-[family-name:var(--font-display)] text-bronze text-sm tracking-[0.2em]">
              The atelier
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.1] tracking-tight text-ink">
              We craft the atmosphere around every ritual.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-[42ch] text-base font-light leading-relaxed text-ink-muted md:text-lg">
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
              <div className="absolute inset-0 ring-1 ring-inset ring-bronze/20" />
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
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0vw', `-${(services.length - 1) * 100}vw`],
  )
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  if (reduce) {
    return (
      <section id="atelier" className="bg-paper-deep px-5 py-24 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="max-w-[16ch] font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.1] text-ink">
            What we produce
          </h2>
          <div className="mt-14 divide-y divide-bronze/20 border-y border-bronze/20">
            {services.map((service) => (
              <article
                key={service.title}
                className="grid gap-8 py-10 md:grid-cols-12 md:items-center md:gap-10"
              >
                <div className="md:col-span-5 lg:col-span-4">
                  <img
                    src={service.image}
                    alt=""
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <div className="md:col-span-7 lg:col-span-8">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-ink md:text-3xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-[48ch] text-base font-light leading-relaxed text-ink-muted">
                    {service.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <FramedInquire />
        </div>
      </section>
    )
  }

  return (
    <section
      id="atelier"
      ref={sectionRef}
      className="relative bg-paper-deep"
      style={{ height: `${services.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden">
        <div className="relative z-20 shrink-0 px-5 pb-4 pt-24 md:px-10 md:pb-5 md:pt-28">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,2.8vw,2.2rem)] font-medium leading-[1.1] text-ink">
              What we produce
            </h2>
          </div>
        </div>

        <motion.div style={{ x }} className="flex min-h-0 flex-1 will-change-transform">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="flex h-full w-screen shrink-0 items-center px-5 py-4 md:px-10 md:py-6"
            >
              <div className="mx-auto grid w-full max-w-[1400px] items-center gap-6 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-6 lg:col-span-7">
                  <div className="overflow-hidden">
                    <img
                      src={service.image}
                      alt=""
                      className="aspect-[4/3] max-h-[48vh] w-full object-cover md:aspect-[16/11] md:max-h-[56vh]"
                    />
                  </div>
                </div>
                <div className="md:col-span-6 lg:col-span-5">
                  <p className="font-[family-name:var(--font-display)] text-5xl font-medium leading-none text-bronze/30 md:text-6xl">
                    0{index + 1}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-ink md:text-3xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-[36ch] text-sm font-light leading-relaxed text-ink-muted md:text-base">
                    {service.copy}
                  </p>
                  {index === services.length - 1 && (
                    <div className="mt-6">
                      <a
                        href="#inquire"
                        className="inline-flex border border-bronze/45 px-8 py-4 font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.3em] text-bronze transition-colors duration-300 hover:border-bronze hover:bg-bronze/10 hover:text-bronze-bright"
                      >
                        Inquire about dates
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </motion.div>

        <div className="relative z-20 shrink-0 px-5 pb-8 pt-3 md:px-10 md:pb-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="h-px w-full bg-bronze/20">
              <motion.div className="h-px bg-bronze" style={{ width: progressWidth }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {services.map((service, index) => (
                <span
                  key={service.title}
                  className="font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.24em] text-ink/55"
                >
                  0{index + 1} {service.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FramedInquire() {
  return (
    <a
      href="#inquire"
      className="mt-14 inline-flex border border-bronze/45 px-8 py-4 font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.3em] text-bronze transition-colors duration-300 hover:border-bronze hover:bg-bronze/10 hover:text-bronze-bright"
    >
      Inquire about dates
    </a>
  )
}

const atmospheres = [
  {
    title: 'Ceremony',
    copy: 'Petals in the air and a room full of witnesses. The ritual at its brightest.',
    src: '/images/portfolio/2WV07722.jpg',
    alt: 'Petal shower during the wedding ceremony',
  },
  {
    title: 'Portrait',
    copy: 'A quiet frame before the evening opens. Light, jewelry, and presence.',
    src: '/images/portfolio/ABI_3806.jpg',
    alt: 'Bridal portrait by an arched window',
  },
  {
    title: 'Setting',
    copy: 'Florals, drapery, and the architecture of celebration before guests arrive.',
    src: '/images/portfolio/2WV06243.jpg',
    alt: 'Outdoor floral backdrop with draped fabric',
  },
  {
    title: 'Gathering',
    copy: 'Family and friends closing in. The energy that turns a plan into a memory.',
    src: '/images/portfolio/2WV07753.jpg',
    alt: 'Joyful celebration with family and friends',
  },
  {
    title: 'Pause',
    copy: 'The soft afterglow. A moment that stays when the music fades.',
    src: '/images/portfolio/_DSF8810.jpg',
    alt: 'Quiet bridal moment by the window light',
  },
]

function Gallery() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(
      atmospheres.length - 1,
      Math.max(0, Math.floor(value * atmospheres.length)),
    )
    setActive((current) => (current === next ? current : next))
  })

  if (reduce) {
    return (
      <section id="gallery" className="bg-paper px-5 py-24 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,3.6rem)] font-medium text-ink">
            Recent atmospheres
          </h2>
          <div className="mt-14 space-y-16">
            {atmospheres.map((item) => (
              <article key={item.title}>
                <img src={item.src} alt={item.alt} className="aspect-[16/10] w-full object-cover" />
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[40ch] text-sm font-light text-ink-muted">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const current = atmospheres[active]

  const scrollToAtmosphere = (index: number) => {
    const section = sectionRef.current
    if (!section) return
    const rect = section.getBoundingClientRect()
    const top = window.scrollY + rect.top
    const travel = section.offsetHeight - window.innerHeight
    const target = top + (travel * (index + 0.5)) / atmospheres.length
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative bg-paper"
      style={{ height: `${atmospheres.length * 90}vh` }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="mx-auto grid h-full w-full max-w-[1500px] grid-cols-1 gap-6 px-5 pb-8 pt-24 md:grid-cols-12 md:gap-10 md:px-10 md:pb-10 md:pt-28">
          <div className="relative min-h-0 md:col-span-8 md:h-full">
            <div className="relative h-[46vh] overflow-hidden bg-paper-deep md:absolute md:inset-0 md:h-auto">
              <AnimatePresence mode="sync" initial={false}>
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>

          <div className="flex min-h-0 flex-col md:col-span-4 md:h-full md:justify-between md:py-1">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.65rem,2.6vw,2.15rem)] font-medium leading-[1.1] text-ink">
                Recent atmospheres
              </h2>
              <p className="shrink-0 font-[family-name:var(--font-body)] text-[11px] font-light tracking-[0.18em] text-bronze">
                {String(active + 1).padStart(2, '0')}
                <span className="mx-1.5 text-bronze/35">/</span>
                {String(atmospheres.length).padStart(2, '0')}
              </p>
            </div>

            <nav
              aria-label="Atmosphere chapters"
              className="mt-8 flex-1 md:mt-0 md:flex md:items-center"
            >
              <ul className="w-full">
                {atmospheres.map((item, index) => {
                  const isActive = index === active
                  return (
                    <li key={item.title} className="border-b border-bronze/10 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => scrollToAtmosphere(index)}
                        className={`flex w-full cursor-pointer items-baseline justify-between gap-4 py-4 text-left transition-colors duration-300 md:py-5 ${
                          isActive
                            ? 'text-ink'
                            : 'text-ink-muted/30 hover:text-ink-muted/60'
                        }`}
                      >
                        <span className="font-[family-name:var(--font-display)] text-xl md:text-[1.4rem]">
                          {item.title}
                        </span>
                        <span
                          className={`font-[family-name:var(--font-body)] text-[10px] tracking-[0.2em] ${
                            isActive ? 'text-bronze' : 'text-transparent'
                          }`}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <AnimatePresence mode="wait">
              <motion.p
                key={current.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="mt-8 max-w-[30ch] text-sm font-light leading-relaxed text-ink-muted md:mt-0"
              >
                {current.copy}
              </motion.p>
            </AnimatePresence>
          </div>
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
    alt: 'Floral and bronze frame backdrop design',
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
    <section id="process" className="relative overflow-hidden bg-paper-deep px-5 py-24 md:px-10 md:py-36">
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-bronze/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-paper/50 blur-3xl" />

      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h2 className="max-w-[14ch] font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.1] text-ink">
              From first conversation to final cue
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-[28ch] font-[family-name:var(--font-body)] text-sm font-light leading-relaxed text-ink-muted md:text-right">
              A quiet path from listening to the live room. Three movements, one celebration.
            </p>
          </Reveal>
        </div>

        <ol className="relative mt-16 md:mt-24">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-bronze/40 to-transparent md:left-1/2 md:-translate-x-px"
          />

          {steps.map((step, index) => {
            const flip = index % 2 === 1
            return (
              <li key={step.num} className="relative py-10 md:py-14">
                <span
                  aria-hidden
                  className="absolute left-4 top-14 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center md:left-1/2 md:top-1/2 md:-translate-y-1/2"
                >
                  <span className="absolute h-3 w-3 rounded-full bg-bronze/30" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-bronze" />
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
                      <div className="absolute inset-0 bg-gradient-to-t from-scrim/50 via-transparent to-transparent" />
                      <p className="absolute bottom-4 left-4 font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.35em] text-bronze">
                        {step.cue}
                      </p>
                    </div>
                  </Reveal>

                  <Reveal
                    delay={0.08 + index * 0.06}
                    className={flip ? 'md:order-1 md:text-right' : 'md:order-2'}
                  >
                    <div className={flip ? 'md:ml-auto md:max-w-[34ch]' : 'md:max-w-[34ch]'}>
                      <p className="font-[family-name:var(--font-display)] text-6xl font-medium leading-none text-bronze/25 md:text-7xl">
                        {step.num}
                      </p>
                      <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-ink md:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-4 text-sm font-light leading-relaxed text-ink-muted md:text-base">
                        {step.copy}
                      </p>
                      <div
                        className={`mt-6 h-px w-16 bg-bronze/40 ${flip ? 'md:ml-auto' : ''}`}
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

const inquirePortraits = [
  {
    src: '/images/portfolio/ABI_4057.jpg',
    alt: 'Bridal portrait in red veil and traditional gold jewelry',
  },
  {
    src: '/images/portfolio/ABI_3806.jpg',
    alt: 'Bride by an arched window in soft light',
  },
  {
    src: '/images/portfolio/ABI_4017.jpg',
    alt: 'Editorial bridal portrait with serene expression',
  },
  {
    src: '/images/portfolio/ABI_4109.jpg',
    alt: 'Close bridal styling detail in warm light',
  },
  {
    src: '/images/portfolio/_DSF8810.jpg',
    alt: 'Quiet bridal moment by the window',
  },
  {
    src: '/images/portfolio/ABI_4434.jpg',
    alt: 'Artistic bridal portrait in open air',
  },
]

function InquirePortraitReel() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % inquirePortraits.length)
    }, 4200)
    return () => window.clearInterval(id)
  }, [reduce])

  const active = inquirePortraits[index]

  if (reduce) {
    return (
      <div className="h-full overflow-hidden">
        <img
          src={inquirePortraits[0].src}
          alt={inquirePortraits[0].alt}
          className="h-full w-full object-cover object-top"
        />
      </div>
    )
  }

  return (
    <div className="relative h-full overflow-hidden bg-paper-deep">
      <AnimatePresence mode="sync" initial={false}>
        <motion.img
          key={active.src}
          src={active.src}
          alt={active.alt}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scrim/20 via-transparent to-transparent" />
    </div>
  )
}

const leadInputClass =
  'w-full border border-ink/25 bg-paper px-4 py-3 font-[family-name:var(--font-body)] text-sm font-normal text-ink outline-none transition-colors placeholder:text-ink/45 focus:border-bronze'

const leadLabelClass =
  'mb-2 block font-[family-name:var(--font-body)] text-[11px] font-normal uppercase tracking-[0.22em] text-ink/75'

type LeadAnswers = {
  lookingFor: string
  timeline: string
  location: string
  guests: string
  budget: string
  email: string
  name: string
  phone: string
}

type ChoiceKey = keyof Pick<
  LeadAnswers,
  'lookingFor' | 'timeline' | 'location' | 'guests' | 'budget'
>

const emptyLeadAnswers: LeadAnswers = {
  lookingFor: '',
  timeline: '',
  location: '',
  guests: '',
  budget: '',
  email: '',
  name: '',
  phone: '',
}

const inquiryChoices: {
  key: ChoiceKey
  label: string
  placeholder: string
  options: string[]
}[] = [
  {
    key: 'lookingFor',
    label: 'What are you looking for?',
    placeholder: 'Select an option',
    options: [
      'Complete Wedding',
      'Multiple Wedding Events',
      'Destination Wedding',
      'Engagement',
      'Reception',
      'Other',
    ],
  },
  {
    key: 'timeline',
    label: 'When is your wedding?',
    placeholder: 'Select a timeline',
    options: [
      'Within 1 month',
      '1-3 months',
      '3-6 months',
      '6-12 months',
      'Date not finalized',
    ],
  },
  {
    key: 'location',
    label: 'Where will your wedding take place?',
    placeholder: 'Select a location',
    options: ['Hyderabad', 'Out of Hyderabad', 'Destination Wedding', 'Not yet decided'],
  },
  {
    key: 'guests',
    label: 'Approximately how many guests are you expecting?',
    placeholder: 'Select guest count',
    options: ['Less than 100', '100-400', '400-1000', '1000-1500', '1500+'],
  },
  {
    key: 'budget',
    label: 'Estimated budget for wedding planning & event management',
    placeholder: 'Select a budget range',
    options: ['5-10 Lakhs', '10-20 Lakhs', '20-35 Lakhs', '35 Lakhs+'],
  },
]

function AnswerSlot({
  label,
  placeholder,
  options,
  value,
  open,
  onToggle,
  onSelect,
}: {
  label: string
  placeholder: string
  options: string[]
  value: string
  open: boolean
  onToggle: () => void
  onSelect: (next: string) => void
}) {
  const reduce = useReducedMotion()

  return (
    <div className="relative">
      <p className={leadLabelClass}>{label}</p>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={onToggle}
        className={`flex w-full cursor-pointer items-center justify-between gap-4 border bg-paper px-4 py-3.5 text-left transition-colors duration-200 ${
          open ? 'border-bronze' : 'border-ink/25 hover:border-ink/40'
        }`}
      >
        <span
          className={`font-[family-name:var(--font-body)] text-sm ${
            value ? 'font-normal text-ink' : 'font-normal text-ink/50'
          }`}
        >
          {value || placeholder}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={`shrink-0 text-ink/70 transition-transform duration-200 ${
            open ? 'rotate-180 text-bronze' : ''
          }`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            role="listbox"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto border border-ink/20 bg-paper shadow-[0_16px_40px_-24px_rgba(28,28,28,0.5)]"
          >
            {options.map((option) => {
              const selected = value === option
              return (
                <li key={option} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => onSelect(option)}
                    className={`flex w-full cursor-pointer px-4 py-3 text-left font-[family-name:var(--font-body)] text-sm font-normal transition-colors duration-150 ${
                      selected
                        ? 'bg-bronze/15 text-ink'
                        : 'text-ink/80 hover:bg-paper-deep hover:text-ink'
                    }`}
                  >
                    {option}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

function LeadForm() {
  const [answers, setAnswers] = useState<LeadAnswers>(emptyLeadAnswers)
  const [openKey, setOpenKey] = useState<ChoiceKey | null>(null)

  const canSubmit =
    Boolean(answers.lookingFor) &&
    Boolean(answers.timeline) &&
    Boolean(answers.location) &&
    Boolean(answers.guests) &&
    Boolean(answers.budget) &&
    answers.email.trim().length > 0 &&
    answers.phone.trim().length > 0

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    const who = answers.name.trim() || answers.email.trim()
    const subject = encodeURIComponent(`KV Creations inquiry from ${who}`)
    const body = encodeURIComponent(
      [
        `Name: ${answers.name.trim() || 'Not provided'}`,
        `Email: ${answers.email.trim()}`,
        `Phone: ${answers.phone.trim()}`,
        '',
        `Looking for: ${answers.lookingFor}`,
        `When: ${answers.timeline}`,
        `Where: ${answers.location}`,
        `Guests: ${answers.guests}`,
        `Budget: ${answers.budget}`,
      ].join('\n'),
    )
    window.location.href = `mailto:hello@kvcreations.com?subject=${subject}&body=${body}`
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {inquiryChoices.map((item) => (
        <AnswerSlot
          key={item.key}
          label={item.label}
          placeholder={item.placeholder}
          options={item.options}
          value={answers[item.key]}
          open={openKey === item.key}
          onToggle={() => setOpenKey((prev) => (prev === item.key ? null : item.key))}
          onSelect={(next) => {
            setAnswers((prev) => ({ ...prev, [item.key]: next }))
            setOpenKey(null)
          }}
        />
      ))}

      <div className="space-y-6 border-t border-ink/15 pt-6">
        <p className={leadLabelClass}>Contact</p>
        <label className="block">
          <span className={leadLabelClass}>Email</span>
          <input
            type="email"
            required
            value={answers.email}
            onChange={(event) => setAnswers((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="you@email.com"
            autoComplete="email"
            className={leadInputClass}
          />
        </label>
        <label className="block">
          <span className="mb-2 flex items-baseline justify-between font-[family-name:var(--font-body)] text-[11px] font-normal uppercase tracking-[0.22em] text-ink/75">
            <span>Name</span>
            <span className="normal-case tracking-normal text-ink/45">Optional</span>
          </span>
          <input
            type="text"
            value={answers.name}
            onChange={(event) => setAnswers((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Your name"
            autoComplete="name"
            className={leadInputClass}
          />
        </label>
        <label className="block">
          <span className={leadLabelClass}>Phone</span>
          <input
            type="tel"
            required
            value={answers.phone}
            onChange={(event) => setAnswers((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="+91"
            autoComplete="tel"
            className={leadInputClass}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="cursor-pointer border border-bronze/45 bg-bronze px-8 py-4 font-[family-name:var(--font-body)] text-[12px] font-normal uppercase tracking-[0.28em] text-paper transition-[filter,border-color] duration-200 hover:border-bronze hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
      >
        Send inquiry
      </button>
    </form>
  )
}

function Inquire() {
  return (
    <section id="inquire" className="bg-paper px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="max-w-[14ch] font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.1] text-ink">
            Tell us about the day
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-5 max-w-[48ch] text-base font-light leading-relaxed text-ink-muted">
            Share a few details and we will reply with availability, next steps, and how we can
            shape the celebration with you.
          </p>
        </Reveal>

        <div className="mt-12 grid lg:mt-16 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          <div className="relative hidden min-h-[520px] lg:col-span-5 lg:block">
            <div className="absolute inset-0">
              <InquirePortraitReel />
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="flex h-full flex-col justify-center border border-ink/15 bg-paper-deep px-5 py-8 md:px-8 md:py-10">
              <LeadForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-bronze/15 bg-paper px-5 py-12 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <a href="#top" className="inline-block" aria-label="KV Creations home">
            <img
              src="/logo/logo-hero.png"
              alt="KV Creations"
              className="h-[4.5rem] w-auto md:h-20"
            />
          </a>
          <p className="mt-5 max-w-[28ch] text-sm font-light text-ink-muted">
            Creating the vibe that turns occasions into experiences.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <a
            href="mailto:hello@kvcreations.com"
            className="border-b border-bronze/40 pb-0.5 text-sm font-light text-bronze transition-colors hover:border-bronze hover:text-bronze-bright"
          >
            hello@kvcreations.com
          </a>
          <Link
            to="/privacy"
            className="text-xs font-light uppercase tracking-[0.22em] text-ink-muted/80 transition-colors hover:text-bronze"
          >
            Privacy Policy
          </Link>
          <p className="text-xs font-light uppercase tracking-[0.22em] text-ink-muted/60">
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

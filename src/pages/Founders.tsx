import { Link } from 'react-router-dom'
import { founders } from '../data/founders'

export default function FoundersPage() {
  const founder = founders[0]

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-bronze/10 bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-5 md:h-20 md:px-10">
          <Link
            to="/"
            className="font-[family-name:var(--font-display)] text-[13px] font-medium tracking-[0.35em] text-ink transition-colors duration-300 hover:text-bronze md:text-sm"
          >
            KV CREATIONS
          </Link>
          <Link
            to="/"
            className="font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.28em] text-bronze transition-colors hover:text-bronze-bright"
          >
            Back home
          </Link>
        </div>
      </header>

      <main className="bg-paper pt-16 md:pt-20">
        <section className="relative overflow-hidden border-b border-bronze/10">
          <div className="mx-auto grid max-w-[1100px] gap-0 lg:grid-cols-12">
            <div className="relative min-h-[52vh] lg:col-span-6 lg:min-h-[78vh]">
              <img
                src={founder.portrait}
                alt={founder.portraitAlt}
                className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
              />
            </div>
            <div className="flex flex-col justify-end bg-paper-deep px-5 py-12 sm:px-8 lg:col-span-6 lg:px-12 lg:py-16">
              <p className="font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.32em] text-bronze">
                Founders
              </p>
              <p className="mt-4 max-w-[16ch] font-[family-name:var(--font-display)] text-[clamp(1.6rem,3.5vw,2.2rem)] font-medium leading-[1.1] tracking-tight text-ink">
                {founder.headline}
              </p>
              <h1 className="mt-8 font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.05] tracking-tight text-ink">
                {founder.name}
              </h1>
              <p className="mt-3 font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.28em] text-ink-muted">
                {founder.role}
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[720px]">
            <p className="font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.32em] text-bronze">
              Portrait in words
            </p>
            <div className="mt-8 space-y-6">
              {founder.bio.map((paragraph, index) => (
                <p
                  key={index}
                  className="font-[family-name:var(--font-body)] text-base font-light leading-[1.75] text-ink-muted md:text-[1.05rem]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-bronze/10 bg-paper-deep px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1100px]">
            <p className="font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.32em] text-bronze">
              In the field
            </p>
            <h2 className="mt-3 max-w-[18ch] font-[family-name:var(--font-display)] text-[clamp(1.6rem,3.5vw,2.4rem)] font-medium text-ink">
              From quiet tables to rooms that hold a thousand
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:gap-10">
              {founder.gallery.map((shot, index) => (
                <figure
                  key={shot.src}
                  className={index === 0 || index === 5 ? 'sm:col-span-2' : ''}
                >
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    className={`w-full object-cover ${
                      index === 0 || index === 5
                        ? 'aspect-[16/9] max-h-[520px]'
                        : 'aspect-[4/5]'
                    }`}
                  />
                  <figcaption className="mt-3 font-[family-name:var(--font-body)] text-sm font-light text-ink-muted">
                    {shot.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-10 md:py-20">
          <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-8 border-t border-bronze/15 pt-12 sm:flex-row sm:items-end">
            <div>
              <p className="font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.32em] text-bronze">
                Begin with us
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-medium text-ink md:text-3xl">
                Tell us about the day you are dreaming of
              </h2>
            </div>
            <Link
              to="/#inquire"
              className="inline-flex border border-ink bg-ink px-8 py-4 font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.28em] text-paper transition-colors hover:bg-ink-muted"
            >
              Inquire
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

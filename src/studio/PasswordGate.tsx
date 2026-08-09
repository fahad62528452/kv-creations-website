import { useState, type FormEvent } from 'react'
import { getStudioPassword, setStudioAuthed } from './storage'

export default function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (password === getStudioPassword()) {
      setStudioAuthed(true)
      onUnlock()
      return
    }
    setError(true)
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-paper px-5">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 20%, color-mix(in srgb, var(--color-bronze) 12%, transparent), transparent 70%), linear-gradient(180deg, var(--color-paper-deep), var(--color-paper))',
        }}
      />
      <div className="grain" />

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-md border border-bronze/20 bg-paper/80 px-6 py-10 backdrop-blur-sm sm:px-10 sm:py-12"
      >
        <img
          src="/logo/logo-hero.png"
          alt="KV Creations"
          className="mx-auto h-14 w-auto"
        />
        <p className="mt-8 text-center font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.35em] text-bronze">
          Private atelier
        </p>
        <h1 className="mt-3 text-center font-[family-name:var(--font-display)] text-2xl font-medium tracking-[0.08em] text-ink sm:text-3xl">
          Studio
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-center font-[family-name:var(--font-body)] text-sm font-light leading-relaxed text-ink-muted">
          Quote and invoice workspace for the KV Creations team.
        </p>

        <label className="mt-10 block">
          <span className="font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.28em] text-ink/55">
            Access code
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            autoFocus
            className="mt-2 w-full border-0 border-b border-ink/20 bg-transparent py-2.5 font-[family-name:var(--font-body)] text-base font-light text-ink outline-none transition-colors focus:border-bronze"
            placeholder="Enter team password"
          />
        </label>

        {error && (
          <p className="mt-3 font-[family-name:var(--font-body)] text-xs font-light text-bronze">
            That code does not match. Try again.
          </p>
        )}

        <button
          type="submit"
          className="mt-8 w-full border border-ink bg-ink px-6 py-3.5 font-[family-name:var(--font-body)] text-[11px] font-light uppercase tracking-[0.28em] text-paper transition-colors hover:bg-ink-muted"
        >
          Enter studio
        </button>
      </form>
    </div>
  )
}

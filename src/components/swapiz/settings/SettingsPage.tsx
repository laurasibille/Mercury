"use client";

import { useState, type FormEvent } from "react";
import { useSwapiz } from "../providers/SwapizProvider";
import type { SwapizState } from "../providers/SwapizProvider";

const themes: SwapizState["theme"][] = ["system", "light", "dark"];
const control = "mt-1 min-h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 text-sm text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";
const label = "block text-sm font-medium text-[var(--color-ink)]";

export function SettingsPage() {
  const { state, dispatch } = useSwapiz();
  const settings = state.settings;
  const [saved, setSaved] = useState(false);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return <div className="mx-auto w-full min-w-0 max-w-[1120px] space-y-6 px-4 py-7 text-[var(--color-ink)] md:px-6 lg:px-8">
    <header><h1 className="text-[28px] font-normal leading-9 tracking-[-0.02em]">Settings</h1><p className="mt-1 text-xs leading-[18px] text-[var(--color-ink-muted)]">Manage workspace preferences and security · Demo settings</p></header>
    <div role="status" aria-live="polite" className={saved ? "rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm" : "sr-only"}>{saved ? "Settings updated in this demo." : ""}</div>
    <form onSubmit={save} className="space-y-5">
      <section aria-labelledby="preferences-heading" className="rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-5 md:p-6">
        <h2 id="preferences-heading" className="text-base font-medium">Preferences</h2><p className="mt-1 text-xs text-[var(--color-ink-muted)]">Choose how values and dates appear across Swapiz.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className={label}>Language<select className={control} value={settings.language} onChange={event => dispatch({ type: "settings/updated", settings: { language: event.target.value } })}><option value="en">English</option><option value="fr">French</option><option value="es">Spanish</option></select></label>
          <label className={label}>Display currency<select className={control} value={settings.currency} onChange={event => dispatch({ type: "settings/updated", settings: { currency: event.target.value } })}><option>EUR</option><option>USD</option><option>GBP</option></select></label>
          <label className={label}>Timezone<select className={control} value={settings.timezone} onChange={event => dispatch({ type: "settings/updated", settings: { timezone: event.target.value } })}><option value="Europe/Nicosia">Europe/Nicosia (UTC+2)</option><option value="UTC">UTC</option><option value="America/New_York">America/New_York</option></select></label>
          <label className={label}>Theme<select className={control} value={state.theme} onChange={event => dispatch({ type: "theme/changed", theme: event.target.value as SwapizState["theme"] })}>{themes.map(theme => <option key={theme} value={theme}>{theme[0].toUpperCase() + theme.slice(1)}</option>)}</select></label>
        </div>
      </section>

      <section aria-labelledby="branding-heading" className="rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-5 md:p-6">
        <h2 id="branding-heading" className="text-base font-medium">Branding</h2><p className="mt-1 text-xs text-[var(--color-ink-muted)]">Workspace identity shown to your team.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.8fr)]">
          <label className={label}>Company name<input className={control} value={settings.companyName} onChange={event => dispatch({ type: "settings/updated", settings: { companyName: event.target.value } })} /></label>
          <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas-subtle)] p-3"><span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white">{settings.companyName.trim().slice(0, 1).toUpperCase() || "S"}</span><span className="min-w-0"><span className="block truncate text-sm font-medium">{settings.companyName || "Company name"}</span><span className="block text-xs text-[var(--color-ink-muted)]">Workspace mark preview</span></span></div>
        </div>
      </section>

      <section aria-labelledby="security-heading" className="rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-5 md:p-6">
        <h2 id="security-heading" className="text-base font-medium">Security & approvals</h2><p className="mt-1 text-xs text-[var(--color-ink-muted)]">Security controls are represented for this demo workspace.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="flex min-h-11 items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"><span><span className="block font-medium">Two-factor authentication</span><span className="block text-xs text-[var(--color-ink-muted)]">Require a second factor for team access</span></span><input aria-label="Two-factor authentication" type="checkbox" checked={settings.twoFactor} onChange={event => dispatch({ type: "settings/updated", settings: { twoFactor: event.target.checked } })} className="size-4 accent-[var(--color-primary)]" /></label>
          <label className={label}>Second approver threshold<input aria-label="Second approver threshold" className={control} type="number" min="0" step="500" value={settings.approverThreshold} onChange={event => dispatch({ type: "settings/updated", settings: { approverThreshold: event.target.value } })} /><span className="mt-1 block text-xs font-normal text-[var(--color-ink-muted)]">Require another approver above this EUR amount.</span></label>
        </div>
        <p className="mt-4 text-xs text-[var(--color-ink-muted)]">Password changes are managed by the identity provider in this prototype.</p>
      </section>

      <section aria-labelledby="channels-heading" className="rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-5 md:p-6">
        <h2 id="channels-heading" className="text-base font-medium">Messaging channels</h2><p className="mt-1 text-xs text-[var(--color-ink-muted)]">Choose where demo approval and activity notifications appear.</p>
        <div className="mt-4 divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
          <Channel name="Email notifications" checked={settings.emailAlerts} onChange={emailAlerts => dispatch({ type: "settings/updated", settings: { emailAlerts } })} detail="Approvals, alerts, and invitations" />
          <Channel name="Telegram notifications" checked={settings.telegramAlerts} onChange={telegramAlerts => dispatch({ type: "settings/updated", settings: { telegramAlerts } })} detail="Operational notifications · connection shown as demo" />
          <Channel name="Slack notifications" checked={false} onChange={() => {}} detail="Not connected" disabled />
        </div>
        <p className="mt-3 text-xs text-[var(--color-ink-muted)]">Connection credentials are hidden and are not stored by this demo.</p>
      </section>
      <div className="flex justify-end"><button type="submit" className="min-h-10 rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]">Save settings</button></div>
    </form>
  </div>;
}

function Channel({ name, detail, checked, onChange, disabled = false }: { name: string; detail: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) {
  return <label className={`flex min-h-14 items-center justify-between gap-4 px-3 py-2 text-sm ${disabled ? "opacity-60" : ""}`}><span><span className="block font-medium">{name}</span><span className="block text-xs text-[var(--color-ink-muted)]">{detail}</span></span><input aria-label={name} type="checkbox" checked={checked} disabled={disabled} onChange={event => onChange(event.target.checked)} className="size-4 accent-[var(--color-primary)]" /></label>;
}

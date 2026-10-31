"use client";

import { useId, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { assets, money, networks, newDemoId, organizations } from "./flow-utils";
import { parseMassPayCsv, recipientError, type Recipient } from "./mass-pay-csv";
import { controlClass, FlowFrame, quietButton, useCreateApproval, useFlow } from "./FlowFrame";

interface RecipientRow extends Recipient { id: string; selected: boolean }

export function MassPayFlow() {
  const [rows, setRows] = useState<RecipientRow[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const flow = useFlow();
  const createApproval = useCreateApproval();
  const id = useId();
  const selected = rows.filter(row => row.selected && !recipientError(row));
  const totals = selected.reduce<Record<string, number>>((result, row) => ({ ...result, [row.currency]: (result[row.currency] ?? 0) + Number(row.amount) }), {});
  const selectionError = flow.errors.selection;
  function update(rowId: string, patch: Partial<RecipientRow>) { setRows(current => current.map(row => row.id === rowId ? { ...row, ...patch } : row)); }
  async function upload(file?: File) {
    if (!file) return;
    setUploadError("");
    if (file.size > 2_000_000) { setUploadError("Choose a CSV smaller than 2 MB with at most 200 recipients."); return; }
    setLoading(true);
    try {
      const text = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("Unable to read this file.")); reader.readAsText(file); });
      const result = parseMassPayCsv(text);
      if (result.error) setUploadError(result.error);
      else setRows(result.rows.map(row => ({ ...row, id: newDemoId(), selected: !recipientError(row) })));
    } catch { setUploadError("Unable to read this CSV. Try the file again."); }
    finally { setLoading(false); }
  }
  return <FlowFrame title="Mass Pay" description="Upload a CSV or add recipients. Only selected, valid rows enter your batch." flow={flow} reviewLabel="Review batch"
    onReview={() => flow.review({ selection: loading ? "Wait for the CSV to finish loading." : selected.length ? undefined : "Select at least one valid recipient before reviewing." })}
    onConfirm={() => { for (const organization of organizations) { const group = selected.filter(row => row.company.toLowerCase() === organization.name.toLowerCase()); if (group.length) createApproval("mass-pay", organization.id, `Mass Pay · ${group.length} recipient${group.length === 1 ? "" : "s"} · ${group.map(row => `${money(Number(row.amount), row.currency)} → ${row.address} (${row.network})`).join("; ")}`); } }}
    summary={[["Batch size", `${selected.length} recipient${selected.length === 1 ? "" : "s"}`], ["Batch totals", <div key="totals" className="space-y-1">{Object.entries(totals).map(([asset, amount]) => <p key={asset}>{money(amount, asset)}</p>)}</div>], ["Recipients", <ol key="recipients" className="space-y-3">{selected.map(row => <li key={row.id}>{row.company} · {money(Number(row.amount), row.currency)}<span className="block text-xs text-[var(--color-ink-muted)]">{row.network} · {row.address}</span></li>)}</ol>], ["Approval routing", "One demo approval per receiving organization represented in this batch."]]}>
    <div className="rounded-lg border border-dashed border-[var(--color-border)] p-4"><label htmlFor={`${id}-csv`} className="mb-2 flex items-center gap-2 text-sm font-medium"><Upload aria-hidden="true" className="size-4" />Upload CSV</label><input id={`${id}-csv`} type="file" accept=".csv,text/csv" className="block w-full min-w-0 text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-surface)] file:px-3 file:py-2 file:text-sm file:text-[var(--color-ink)]" aria-describedby={`${id}-csv-help${uploadError ? ` ${id}-csv-error` : ""}`} aria-invalid={Boolean(uploadError)} onChange={event => { void upload(event.target.files?.[0]); event.target.value = ""; }} /><p id={`${id}-csv-help`} className="mt-3 break-words text-xs leading-[18px] text-[var(--color-ink-muted)]">Up to 200 recipients. Headers: company,currency,network,amount,address. Import replaces the current draft.</p>{uploadError && <p id={`${id}-csv-error`} role="alert" className="mt-2 text-xs text-[var(--color-negative)]">{uploadError}</p>}{loading && <p role="status" className="mt-2 text-xs">Reading CSV…</p>}</div>
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm">{rows.length} / 200 recipients</p><button type="button" disabled={!rows.some(row => !recipientError(row))} className={quietButton} onClick={() => { const allSelected = rows.filter(row => !recipientError(row)).every(row => row.selected); setRows(rows.map(row => ({ ...row, selected: !recipientError(row) && !allSelected }))); }}>{selected.length && selected.length === rows.filter(row => !recipientError(row)).length ? "Deselect all" : "Select all valid"}</button></div>
    <div role="group" aria-label="Batch recipients" aria-describedby={selectionError ? `${id}-selection-error` : undefined} className="space-y-3">{!rows.length && <p className="text-sm text-[var(--color-ink-muted)]">Add a recipient or upload a CSV to start your batch.</p>}{rows.map((row, index) => {
      const error = recipientError(row);
      const errorId = `${id}-${row.id}-error`;
      const inputProps = { "aria-invalid": Boolean(error), "aria-describedby": error ? errorId : undefined, className: controlClass };
      return <fieldset key={row.id} className="min-w-0 space-y-3 rounded-lg border border-[var(--color-border)] p-4"><legend className="px-1 text-sm font-medium">Recipient {index + 1}</legend><div className="flex items-center justify-between gap-2"><label className="flex items-center gap-2 text-sm"><input aria-label={`Select recipient ${index + 1}`} type="checkbox" disabled={Boolean(error)} checked={row.selected && !error} onChange={event => update(row.id, { selected: event.target.checked })} className="size-4 accent-[var(--color-primary)]" />Include in batch</label><span className={`text-xs font-medium ${error ? "text-[var(--color-negative)]" : "text-[var(--color-success)]"}`}>{error ? "Check" : "Ready"}</span><button type="button" aria-label={`Remove recipient ${index + 1}`} className="rounded-lg p-2 hover:bg-[var(--color-surface)]" onClick={() => setRows(rows.filter(item => item.id !== row.id))}><Trash2 aria-hidden="true" className="size-4" /></button></div><div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1 text-xs">Company<select {...inputProps} aria-label={`Recipient ${index + 1} company`} value={row.company} onChange={event => update(row.id, { company: event.target.value })}>{!organizations.some(item => item.name === row.company) && <option>{row.company}</option>}{organizations.map(item => <option key={item.id}>{item.name}</option>)}</select></label><label className="space-y-1 text-xs">Currency<select {...inputProps} aria-label={`Recipient ${index + 1} currency`} value={row.currency} onChange={event => update(row.id, { currency: event.target.value })}>{!assets.includes(row.currency as never) && <option>{row.currency}</option>}{assets.map(asset => <option key={asset}>{asset}</option>)}</select></label><label className="space-y-1 text-xs">Network<select {...inputProps} aria-label={`Recipient ${index + 1} network`} value={row.network} onChange={event => update(row.id, { network: event.target.value })}>{!networks.includes(row.network) && <option>{row.network}</option>}{networks.map(network => <option key={network}>{network}</option>)}</select></label><label className="space-y-1 text-xs">Amount<input {...inputProps} type="number" inputMode="decimal" step="any" min="0" aria-label={`Recipient ${index + 1} amount`} value={row.amount} onChange={event => update(row.id, { amount: event.target.value })} /></label></div><label className="block space-y-1 text-xs">Address<input {...inputProps} aria-label={`Recipient ${index + 1} address`} value={row.address} spellCheck={false} onChange={event => update(row.id, { address: event.target.value })} /></label>{error && <p id={errorId} className="text-xs leading-[18px] text-[var(--color-negative)]">{error}</p>}</fieldset>;
    })}</div>
    <button type="button" className={quietButton} disabled={rows.length >= 200} onClick={() => setRows([...rows, { id: newDemoId(), company: "Amazon", currency: "USDT", network: networks[0], amount: "", address: "", selected: false }])}><Plus aria-hidden="true" className="size-4" />Add recipient</button>
    <p className="text-sm">{selected.length} selected · {Object.entries(totals).map(([asset, amount]) => money(amount, asset)).join(" + ") || "No batch total yet"}</p>
    {selectionError && <p id={`${id}-selection-error`} role="alert" className="text-sm text-[var(--color-negative)]">{selectionError}</p>}
  </FlowFrame>;
}

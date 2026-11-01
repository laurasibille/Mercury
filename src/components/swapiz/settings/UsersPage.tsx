"use client";

import { useMemo, useState, type FormEvent } from "react";
import { swapizDemoData } from "@/data/swapiz-demo";
import type { RoleId, ScopeId, User } from "@/types/swapiz";

type Draft = Pick<
  User,
  "name" | "email" | "roleId" | "scopeIds" | "limitEur" | "twoFactorEnabled"
>;
const roles = swapizDemoData.roles;
const orgs = swapizDemoData.organizations;
const panel =
  "rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)]";
const inputClass =
  "min-h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 text-sm text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";
const labelClass = "block text-sm font-medium text-[var(--color-ink)]";
const emptyDraft: Draft = {
  name: "",
  email: "",
  roleId: "viewer",
  scopeIds: ["all"],
  limitEur: null,
  twoFactorEnabled: false,
};

const roleName = (id: RoleId) =>
  roles.find((role) => role.id === id)?.name ?? id;
const scopeName = (id: ScopeId) =>
  id === "all"
    ? "All companies"
    : (orgs.find((org) => org.id === id)?.name ?? id);
const dateFormat = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const initialsFor = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export function UsersPage() {
  const [users, setUsers] = useState<User[]>(() =>
    swapizDemoData.users.map((user) => ({
      ...user,
      scopeIds: [...user.scopeIds],
    })),
  );
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleId | "all">("all");
  const [dialog, setDialog] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [notice, setNotice] = useState("");
  const selected = users.find((user) => user.id === selectedId) ?? null;
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return users.filter(
      (user) =>
        (roleFilter === "all" || user.roleId === roleFilter) &&
        (!term ||
          [
            user.name,
            user.email,
            user.lastActivity,
            roleName(user.roleId),
            ...user.scopeIds.map(scopeName),
          ]
            .join(" ")
            .toLowerCase()
            .includes(term)),
    );
  }, [query, roleFilter, users]);

  function openAdd() {
    setSelectedId(null);
    setDraft(emptyDraft);
    setDialog("add");
  }
  function openEdit(user: User) {
    setSelectedId(user.id);
    setDraft({
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      scopeIds: [...user.scopeIds],
      limitEur: user.limitEur,
      twoFactorEnabled: user.twoFactorEnabled,
    });
    setDialog("edit");
  }
  function closeDialog() {
    setDialog(null);
    setSelectedId(null);
  }
  function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = draft.name.trim();
    const email = draft.email.trim();
    if (!name || !email) return;
    if (dialog === "edit" && selected) {
      setUsers((current) =>
        current.map((user) =>
          user.id === selected.id
            ? { ...user, ...draft, name, email, initials: initialsFor(name) }
            : user,
        ),
      );
      setNotice(`${name} updated in this demo.`);
    } else {
      const user: User = {
        id: `demo-user-${Date.now()}`,
        joinedOn: new Date().toISOString().slice(0, 10),
        ...draft,
        name,
        email,
        initials: initialsFor(name),
        invitationStatus: "pending",
        lastActivity: "Invited · pending",
      };
      setUsers((current) => [...current, user]);
      setNotice(`${name} added to this demo.`);
    }
    closeDialog();
  }
  function deleteUser() {
    if (selected) {
      setUsers((current) => current.filter((user) => user.id !== selected.id));
      setNotice(`${selected.name} removed from this demo.`);
    }
    closeDialog();
  }
  function updateScope(value: string) {
    setDraft((current) => ({ ...current, scopeIds: [value as ScopeId] }));
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6 px-4 py-7 text-[var(--color-ink)] md:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-normal leading-9 tracking-[-0.02em]">
            Users
          </h1>
          <p className="mt-1 text-xs leading-[18px] text-[var(--color-ink-muted)]">
            Manage access, scopes, and spending limits · Demo team
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="min-h-10 rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          Add user
        </button>
      </header>
      <div
        role="status"
        aria-live="polite"
        className={
          notice
            ? "rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm"
            : "sr-only"
        }
      >
        {notice}
      </div>
      <section
        aria-label="User filters"
        className={`${panel} flex flex-col gap-3 p-4 sm:flex-row`}
      >
        <label className="min-w-0 flex-1 text-xs font-medium text-[var(--color-ink-muted)]">
          Search
          <input
            aria-label="Search users"
            role="searchbox"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, email, role, or scope"
            className={`${inputClass} mt-1`}
          />
        </label>
        <label className="w-full text-xs font-medium text-[var(--color-ink-muted)] sm:w-48">
          Role
          <select
            aria-label="Filter by role"
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as RoleId | "all")
            }
            className={`${inputClass} mt-1`}
          >
            <option value="all">All roles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </label>
        <div className="space-y-3 p-3 md:hidden">
          {filtered.map((person) => (
            <article
              key={person.id}
              aria-label={`User ${person.name}`}
              className="min-w-0 rounded-lg border border-[var(--color-border)] p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--color-primary-soft)] text-xs font-semibold text-[var(--color-primary)]"
                >
                  {person.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium">
                    {person.name}
                  </h3>
                  <p className="truncate text-xs text-[var(--color-ink-muted)]">
                    {person.email}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--color-surface)] px-2 py-1 text-xs">
                  {roleName(person.roleId)}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--color-border)] pt-3 text-xs">
                <UserField label="Scope">
                  {person.scopeIds.map(scopeName).join(", ")}
                </UserField>
                <UserField label="Limit">
                  {person.limitEur === null
                    ? "No limit"
                    : `€${person.limitEur.toLocaleString("en-US")}`}
                </UserField>
                <UserField label="Two-factor authentication">
                  {person.twoFactorEnabled ? "Enabled" : "Off"}
                </UserField>
                <UserField label="Invitation">
                  {person.invitationStatus === "active" ? "Active" : "Pending"}
                </UserField>
                <UserField label="Last activity">
                  {person.lastActivity}
                </UserField>
                <UserField label="Joined">
                  {dateFormat.format(new Date(`${person.joinedOn}T00:00:00Z`))}
                </UserField>
              </dl>
              <div className="mt-3 flex gap-2 border-t border-[var(--color-border)] pt-2">
                <button
                  type="button"
                  onClick={() => openEdit(person)}
                  className="min-h-9 flex-1 rounded-md text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
                  aria-label={`Edit ${person.name}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(person.id);
                    setDialog("delete");
                  }}
                  className="min-h-9 flex-1 rounded-md text-sm text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface)]"
                  aria-label={`Delete ${person.name}`}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        aria-label="Team users"
        className={`${panel} min-w-0 overflow-hidden`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] px-4 py-3">
          <h2 className="text-sm font-medium">Team members</h2>
          <span className="text-xs text-[var(--color-ink-muted)]">
            {filtered.length} {filtered.length === 1 ? "user" : "users"} ·
            Changes are local to this demo
          </span>
        </div>
        {filtered.length ? (
          <div className="overflow-x-auto">
            <table
              role="table"
              aria-label="Users"
              className="w-full min-w-[1050px] border-collapse text-left text-sm"
            >
              <thead className="bg-[var(--color-canvas-subtle)] text-xs text-[var(--color-ink-muted)]">
                <tr>
                  {[
                    "User",
                    "Role",
                    "Scope",
                    "Limit",
                    "2FA",
                    "Invitation",
                    "Last activity",
                    "Joined",
                    "Actions",
                  ].map((name) => (
                    <th
                      key={name}
                      scope="col"
                      className="whitespace-nowrap px-4 py-3 font-medium"
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filtered.map((person) => (
                  <tr
                    key={person.id}
                    className="hover:bg-[var(--color-canvas-subtle)]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--color-primary-soft)] text-xs font-semibold text-[var(--color-primary)]"
                        >
                          {person.initials}
                        </span>
                        <span className="min-w-0">
                          <span className="block whitespace-nowrap font-medium">
                            {person.name}
                          </span>
                          <span className="block whitespace-nowrap text-xs text-[var(--color-ink-muted)]">
                            {person.email}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{roleName(person.roleId)}</td>
                    <td className="max-w-56 px-4 py-3 text-xs">
                      {person.scopeIds.map(scopeName).join(", ")}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {person.limitEur === null
                        ? "No limit"
                        : `€${person.limitEur.toLocaleString("en-US")}`}
                    </td>
                    <td className="px-4 py-3">
                      {person.twoFactorEnabled ? "Enabled" : "Off"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${person.invitationStatus === "active" ? "bg-[var(--color-primary-soft)] text-[var(--color-ink)]" : "bg-[var(--color-surface)] text-[var(--color-ink-secondary)]"}`}
                      >
                        {person.invitationStatus === "active"
                          ? "Active"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-[var(--color-ink-secondary)]">
                      {person.lastActivity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      {dateFormat.format(
                        new Date(`${person.joinedOn}T00:00:00Z`),
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(person)}
                          className="min-h-9 rounded-md px-2 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
                          aria-label={`Edit ${person.name}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(person.id);
                            setDialog("delete");
                          }}
                          className="min-h-9 rounded-md px-2 text-xs font-medium text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
                          aria-label={`Delete ${person.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-sm font-medium">No users match these filters.</p>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              Try another search or role.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setRoleFilter("all");
              }}
              className="mt-3 min-h-9 rounded-lg border border-[var(--color-border)] px-3 text-sm"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
      {dialog === "add" || dialog === "edit" ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-dialog-title"
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <form
            onSubmit={saveUser}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-5 shadow-xl md:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="user-dialog-title" className="text-lg font-medium">
                  {dialog === "add" ? "Add user" : "Edit user"}
                </h2>
                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                  Changes apply to the current demo session only.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close dialog"
                className="rounded-md px-2 py-1 text-lg"
              >
                ×
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Name
                <input
                  autoFocus
                  required
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className={labelClass}>
                Email
                <input
                  required
                  type="email"
                  value={draft.email}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className={labelClass}>
                Role
                <select
                  value={draft.roleId}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      roleId: event.target.value as RoleId,
                    }))
                  }
                  className={`${inputClass} mt-1`}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Scope
                <select
                  value={draft.scopeIds[0] ?? "all"}
                  onChange={(event) => updateScope(event.target.value)}
                  className={`${inputClass} mt-1`}
                >
                  <option value="all">All companies</option>
                  {orgs.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Spending limit (EUR)
                <input
                  type="number"
                  min="0"
                  value={draft.limitEur ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      limitEur:
                        event.target.value === ""
                          ? null
                          : Number(event.target.value),
                    }))
                  }
                  placeholder="No limit"
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className="flex min-h-10 items-center gap-2 self-end text-sm">
                <input
                  type="checkbox"
                  checked={draft.twoFactorEnabled}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      twoFactorEnabled: event.target.checked,
                    }))
                  }
                  className="size-4 accent-[var(--color-primary)]"
                />
                Two-factor authentication
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDialog}
                className="min-h-10 rounded-lg border border-[var(--color-border)] px-4 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-10 rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-white"
              >
                Save user
              </button>
            </div>
          </form>
        </div>
      ) : null}
      {dialog === "delete" && selected ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-user-title"
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-6 shadow-xl">
            <h2 id="delete-user-title" className="text-lg font-medium">
              Delete user
            </h2>
            <p className="mt-2 text-sm text-[var(--color-ink-secondary)]">
              Remove {selected.name} from this demo workspace?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDialog}
                className="min-h-10 rounded-lg border border-[var(--color-border)] px-4 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteUser}
                className="min-h-10 rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-white"
              >
                Delete user
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div aria-label="Users on mobile" className="space-y-3 md:hidden">
        {filtered.map((person) => (
          <article
            key={person.id}
            aria-label={`User ${person.name}`}
            className="min-w-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--color-primary-soft)] text-xs font-semibold text-[var(--color-primary)]"
              >
                {person.initials}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium">{person.name}</h3>
                <p className="truncate text-xs text-[var(--color-ink-muted)]">
                  {person.email}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[var(--color-surface)] px-2 py-1 text-xs">
                {roleName(person.roleId)}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--color-border)] pt-3 text-xs">
              <UserField label="Scope">
                {person.scopeIds.map(scopeName).join(", ")}
              </UserField>
              <UserField label="Limit">
                {person.limitEur === null
                  ? "No limit"
                  : `€${person.limitEur.toLocaleString("en-US")}`}
              </UserField>
              <UserField label="Two-factor authentication">
                {person.twoFactorEnabled ? "Enabled" : "Off"}
              </UserField>
              <UserField label="Invitation">
                {person.invitationStatus === "active" ? "Active" : "Pending"}
              </UserField>
              <UserField label="Last activity">{person.lastActivity}</UserField>
              <UserField label="Joined">
                {dateFormat.format(new Date(`${person.joinedOn}T00:00:00Z`))}
              </UserField>
            </dl>
            <div className="mt-3 flex gap-2 border-t border-[var(--color-border)] pt-2">
              <button
                type="button"
                onClick={() => openEdit(person)}
                className="min-h-9 flex-1 rounded-md text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
                aria-label={`Edit ${person.name}`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(person.id);
                  setDialog("delete");
                }}
                className="min-h-9 flex-1 rounded-md text-sm text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface)]"
                aria-label={`Delete ${person.name}`}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      <style>{`@media (max-width: 767px) { [aria-label="User filters"] > .space-y-3 { display: none; } [aria-label="Team users"] > .overflow-x-auto { display: none; } }`}</style>
    </main>
  );
}

function UserField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="mb-1 text-[var(--color-ink-muted)]">{label}</dt>
      <dd className="break-words text-[var(--color-ink)]">{children}</dd>
    </div>
  );
}

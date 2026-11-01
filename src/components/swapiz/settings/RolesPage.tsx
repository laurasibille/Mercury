"use client";

import { useState } from "react";
import { rolePermissionCatalog } from "@/data/role-permissions";
import type { Role, RoleId } from "@/types/swapiz";
import { useSwapiz } from "../providers/SwapizProvider";

const feePermissions = new Set([
  "View fee settings",
  "Change fees",
  "Fee income & Sweep",
]);

export function RolesPage() {
  const { state, dispatch } = useSwapiz();
  const roles = state.roles;
  const [expanded, setExpanded] = useState<RoleId | null>(null);
  const [notice, setNotice] = useState("");
  const allPermissions = rolePermissionCatalog;

  function toggle(role: Role, permission: string, checked: boolean) {
    if (role.id !== "owner" && feePermissions.has(permission)) return;
    dispatch({ type: "role/permission-toggled", roleId: role.id, permission, enabled: checked });
    setNotice(`${role.name} permissions updated in this demo.`);
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-[1280px] space-y-6 overflow-x-clip px-4 py-7 text-[var(--color-ink)] md:px-6 lg:px-8">
      <header>
        <h1 className="text-[28px] font-normal leading-9 tracking-[-0.02em]">
          Roles
        </h1>
        <p className="mt-1 text-xs leading-[18px] text-[var(--color-ink-muted)]">
          Review access levels and granular permissions · Demo roles
        </p>
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
        aria-label="Workspace roles"
        className="min-w-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)]"
      >
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <h2 className="text-sm font-medium">Workspace roles</h2>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            System roles define the actions available to each team member.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table
            role="table"
            aria-label="Roles"
            className="w-full min-w-[720px] border-collapse text-left text-sm"
          >
            <thead className="bg-[var(--color-canvas-subtle)] text-xs text-[var(--color-ink-muted)]">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Role
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Description
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Permissions
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Access
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {roles.map((role) => (
                <tr key={role.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-4 font-medium">
                    {role.name}
                    {role.id === "owner" && (
                      <span className="ml-2 rounded-full bg-[var(--color-primary-soft)] px-2 py-1 text-[11px] font-normal">
                        Owner-only
                      </span>
                    )}
                  </td>
                  <td className="max-w-sm px-4 py-4 text-xs leading-[18px] text-[var(--color-ink-secondary)]">
                    {role.description}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    {role.permissions.length} enabled
                  </td>
                  <td className="px-4 py-4 text-xs">
                    {role.id === "owner"
                      ? "All workspace actions"
                      : role.id === "viewer"
                        ? "Read-only"
                        : "Scoped actions"}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      aria-expanded={expanded === role.id}
                      aria-controls={`permissions-${role.id}`}
                      aria-label={`${expanded === role.id ? "Collapse" : "Expand"} ${role.name} permissions`}
                      onClick={() =>
                        setExpanded((current) =>
                          current === role.id ? null : role.id,
                        )
                      }
                      className="min-h-9 whitespace-nowrap rounded-md px-2 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
                    >
                      {expanded === role.id
                        ? "Hide permissions"
                        : "Edit permissions"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div aria-label="Roles on mobile" className="space-y-3 sm:hidden">
        {roles.map((role) => (
          <article
            key={role.id}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium">
                {role.name}
                {role.id === "owner" && (
                  <span className="ml-2 rounded-full bg-[var(--color-primary-soft)] px-2 py-1 text-[11px] font-normal">
                    Owner-only
                  </span>
                )}
              </h3>
              <span className="shrink-0 text-xs text-[var(--color-ink-muted)]">
                {role.permissions.length} permissions
              </span>
            </div>
            <p className="mt-2 text-xs leading-[18px] text-[var(--color-ink-secondary)]">
              {role.description}
            </p>
            <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
              {role.id === "owner"
                ? "All workspace actions"
                : role.id === "viewer"
                  ? "Read-only"
                  : "Scoped actions"}
            </p>
            <button
              type="button"
              aria-expanded={expanded === role.id}
              aria-controls={`permissions-${role.id}`}
              aria-label={`${expanded === role.id ? "Collapse" : "Expand"} ${role.name} permissions`}
              onClick={() =>
                setExpanded((current) => (current === role.id ? null : role.id))
              }
              className="mt-3 min-h-9 rounded-md px-2 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
            >
              {expanded === role.id ? "Hide permissions" : "Edit permissions"}
            </button>
          </article>
        ))}
      </div>
      {expanded &&
        (() => {
          const role = roles.find((item) => item.id === expanded);
          if (!role) return null;
          return (
            <section
              id={`permissions-${role.id}`}
              aria-labelledby="permissions-heading"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-4 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2
                    id="permissions-heading"
                    className="text-base font-medium"
                  >
                    {role.name} permissions
                  </h2>
                  <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                    Changes are saved to this demo session. Fee and sweep access
                    is restricted to Owner.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpanded(null)}
                  className="min-h-9 rounded-md px-2 text-sm text-[var(--color-primary)]"
                >
                  Done
                </button>
              </div>
              <fieldset className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <legend className="sr-only">
                  {role.name} permission controls
                </legend>
                {allPermissions.map((permission) => {
                  const ownerOnly = feePermissions.has(permission);
                  const disabled = ownerOnly && role.id !== "owner";
                  const isChecked = role.permissions.includes(permission);
                  return (
                    <label
                      key={permission}
                      className={`flex min-h-11 items-center gap-3 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm ${disabled ? "opacity-60" : "hover:bg-[var(--color-canvas-subtle)]"}`}
                    >
                      <input
                        type="checkbox"
                        aria-label={
                          role.id === "owner"
                            ? `Owner: ${permission}`
                            : permission
                        }
                        checked={isChecked}
                        disabled={disabled}
                        onChange={(event) =>
                          toggle(role, permission, event.target.checked)
                        }
                        className="size-4 shrink-0 accent-[var(--color-primary)]"
                      />
                      <span>
                        {permission}
                        {disabled && (
                          <span className="ml-1 text-xs text-[var(--color-ink-muted)]">
                            · Owner only
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            </section>
          );
        })()}
      <style>{`@media (max-width: 639px) { [aria-label="Workspace roles"] > .overflow-x-auto { display: none; } }`}</style>
    </main>
  );
}

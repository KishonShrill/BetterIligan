"use client";

import { useActionState } from "react";
import { ShieldCheck, Siren, TriangleAlert } from "lucide-react";
import {
  activateIncident,
  deactivateIncident,
  type ActionResult,
} from "@/actions/bangonAdmin";
import type { IncidentStateRow } from "@/validations/bangonSchema";

const ACTION_OK: ActionResult = { success: true };

// Runtime standby↔active switch. When active, shows the live incident + a
// "Stand down" button; otherwise a form to declare one. Both persist to D1 and
// revalidate the homepage banner + command center, so no redeploy is needed.
//
// Client component so action failures (e.g. the bangon_incident_state table
// missing because migrations weren't applied) render inline feedback instead of
// failing silently — the original report of this bug was a silent no-op button.
export function IncidentStatusPanel({
  state,
  active,
}: {
  state: IncidentStateRow | null;
  active: boolean;
}) {
  const [deactivateState, deactivateAction, isDeactivating] = useActionState(
    deactivateIncident,
    ACTION_OK,
  );
  const [activateState, activateAction, isActivating] = useActionState(
    activateIncident,
    ACTION_OK,
  );

  if (active && state) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-2 text-[11px] font-bold tracking-widest text-red-700 uppercase">
              <Siren className="h-4 w-4" /> Incident active
              {state.declared_at && (
                <span className="font-semibold tracking-normal text-red-500 normal-case">
                  · since {state.declared_at}
                </span>
              )}
            </p>
            <p className="mt-1 text-base font-extrabold text-slate-900">
              {state.title}
            </p>
            {state.summary && (
              <p className="mt-0.5 text-sm text-slate-600">{state.summary}</p>
            )}
            <p className="mt-2 text-xs text-slate-400">
              The homepage banner and command center are showing the active
              state now.
            </p>
            {!deactivateState.success && (
              <ErrorNote message={deactivateState.error} />
            )}
          </div>
          <form action={deactivateAction}>
            <button
              type="submit"
              disabled={isDeactivating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              <ShieldCheck className="h-4 w-4" />
              {isDeactivating ? "Standing down…" : "Stand down"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200";
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Siren className="h-5 w-5 text-red-600" />
        <h2 className="text-lg font-bold text-slate-900">
          Declare an incident
        </h2>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
          Standby
        </span>
      </div>
      <p className="mb-4 text-sm text-slate-500">
        Activating flips the homepage banner and the command center to active
        immediately — no redeploy.
      </p>
      <form action={activateAction} className="space-y-3">
        <input
          name="title"
          required
          maxLength={120}
          defaultValue={state?.title ?? ""}
          placeholder="Incident title (e.g. Bangon Iligan — Typhoon Response)"
          className={inputCls}
        />
        <textarea
          name="summary"
          rows={2}
          maxLength={400}
          defaultValue={state?.summary ?? ""}
          placeholder="Short summary — what happened and the current situation."
          className={`${inputCls} resize-none`}
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-slate-500">
            Declared
            <input
              type="date"
              name="declaredAt"
              defaultValue={state?.declared_at || ""}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            />
          </label>
          <button
            type="submit"
            disabled={isActivating}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            <Siren className="h-4 w-4" />
            {isActivating ? "Activating…" : "Activate incident"}
          </button>
        </div>
      </form>
      {!activateState.success && <ErrorNote message={activateState.error} />}
    </section>
  );
}

function ErrorNote({ message }: { message: string }) {
  return (
    <p className="mt-3 flex items-start gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
      <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {message}
    </p>
  );
}

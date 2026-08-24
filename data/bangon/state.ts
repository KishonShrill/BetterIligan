// SERVER-ONLY — resolves the effective Bangon Iligan page config by overlaying
// the runtime D1 incident state (bangon_incident_state) onto the committed
// static config (incident.json).
//
// The JSON supplies the standby copy, donation channels, and feature flags; D1
// controls `active` + `activeIncident`, so a moderator can toggle them from
// /admin without a redeploy. Falls back to the static config when D1 is
// unavailable (missing binding / row), so pages still render.
//
// Do NOT import from a 'use client' file — this pulls in zod + the D1 binding.
import { bangonConfig } from ".";
import { getIncidentState } from "./queries";
import type { BangonConfig } from "@/validations/bangonSchema";

export async function getEffectiveBangonConfig(): Promise<BangonConfig> {
    const state = await getIncidentState();
    if (!state) return bangonConfig;

    const active = state.active === 1;
    return {
        ...bangonConfig,
        active,
        // Only surface the D1 incident copy while active; otherwise keep the
        // static default (never shown on standby anyway).
        activeIncident: active
            ? { title: state.title, summary: state.summary, declaredAt: state.declared_at }
            : bangonConfig.activeIncident,
    };
}

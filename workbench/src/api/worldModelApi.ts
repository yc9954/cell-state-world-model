/**
 * Client for the local harness proxy (server/proxy.mjs), which holds the Claude
 * key server-side and forwards to the Modal model endpoints. The browser only
 * ever talks to this proxy — never to Claude or Modal directly.
 *
 * Live response shapes (verified against the deployment):
 *   /cell       -> { cell, w, real, gen, S_norm }
 *   /trajectory -> { start, end, steps, w, frames[], real_start, real_end, alphas[], dist_from_start[] }
 *   /intervene  -> { start, end, toward, at, strength, steps, w, frames[], real_toward }
 */
const BASE = (import.meta.env.VITE_PROXY_BASE || "http://localhost:8787").replace(/\/$/, "");

export interface Plan {
  mode: "cell" | "trajectory" | "intervene";
  cellId: number;
  end?: number;
  steps?: number;
  w?: number;
  intervene?: { at: number; toward: number; strength: number };
  rationale?: string;
}

export interface Frames {
  images: string[]; // generated frames (a single frame in "cell" mode)
  real?: string; // real morphology of the starting cell
  realEnd?: string; // real morphology of the trajectory destination
  realToward?: string; // real morphology of the intervention target
  dist?: number[]; // S-space distance from the start, per frame
  interveneAt?: number; // frame index where the intervention kicks in
  sNorm?: number;
  info?: string;
}

async function getJSON(path: string): Promise<any> {
  const r = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(240000) });
  if (!r.ok) throw new Error(`proxy ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

export async function interpret(text: string): Promise<Plan> {
  const r = await fetch(`${BASE}/api/interpret`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(60000),
  });
  if (!r.ok) throw new Error(`interpret ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return (await r.json()).plan;
}

export async function cell(id: number, w = 3): Promise<Frames> {
  const d = await getJSON(`/api/cell?id=${id}&w=${w}`);
  return {
    images: [d.gen],
    real: d.real,
    sNorm: d.S_norm,
    info: `cell ${d.cell} · w=${d.w} · |S|=${Number(d.S_norm).toFixed(1)}`,
  };
}

export async function trajectory(start: number, end: number, steps = 8, w = 3): Promise<Frames> {
  const d = await getJSON(`/api/trajectory?start=${start}&end=${end}&steps=${steps}&w=${w}`);
  return {
    images: d.frames ?? [],
    real: d.real_start,
    realEnd: d.real_end,
    dist: d.dist_from_start,
    info: `trajectory ${d.start}→${d.end} · ${d.steps} frames · w=${d.w}`,
  };
}

export async function intervene(
  start: number,
  end: number,
  steps: number,
  at: number,
  toward: number,
  strength: number,
  w = 3,
): Promise<Frames> {
  const d = await getJSON(
    `/api/intervene?start=${start}&end=${end}&steps=${steps}&at=${at}&toward=${toward}&strength=${strength}&w=${w}`,
  );
  return {
    images: d.frames ?? [],
    realToward: d.real_toward,
    interveneAt: d.at,
    info: `intervene at t=${d.at} → toward ${d.toward} (strength ${d.strength}) · ${d.steps} frames`,
  };
}

/** Run an interpreted plan against the right endpoint. */
export async function runPlan(plan: Plan): Promise<Frames> {
  const w = plan.w ?? 3;
  if (plan.mode === "cell") return cell(plan.cellId, w);
  const end = plan.end ?? plan.cellId + 1000;
  const steps = plan.steps ?? 8;
  if (plan.mode === "trajectory") return trajectory(plan.cellId, end, steps, w);
  const iv = plan.intervene ?? { at: Math.floor(steps / 2), toward: end + 500, strength: 0.9 };
  return intervene(plan.cellId, end, steps, iv.at, iv.toward, iv.strength, w);
}

/** Ask Claude a question about the current cell, grounded in its state numbers. */
export async function ask(question: string, context: Record<string, unknown>): Promise<string> {
  const r = await fetch(`${BASE}/api/ask`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question, context }),
    signal: AbortSignal.timeout(60000),
  });
  if (!r.ok) throw new Error(`ask ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return (await r.json()).answer;
}

export async function health(): Promise<any> {
  return getJSON(`/api/health`);
}

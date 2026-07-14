import { useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface Comment { author: "you" | "model"; text: string }
export interface Annotation { id: string; x: number; y: number; comments: Comment[] }

interface Props {
  src: string; // data URI of the generated frame
  size: number;
  annotations: Annotation[];
  post?: boolean; // frame is after an intervention
  channel: string; // readout label
  onAddAnnotation: (x: number, y: number, text: string) => void;
  onReply: (id: string, text: string) => void;
  onRemoveAnnotation: (id: string) => void;
  replying?: boolean;
}

/** The real model-generated cell, with coordinate-anchored annotation threads. */
export function ImageViewport(props: Props) {
  const { src, size, annotations, post, channel } = props;
  const boxRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<{ x: number; y: number } | null>(null);
  const [text, setText] = useState("");
  const [openAnn, setOpenAnn] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  const xy = (e: React.MouseEvent) => {
    const r = boxRef.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  };
  const pos = (x: number, y: number) => ({
    left: `${Math.min(90, Math.max(3, x * 100))}%`,
    top: `${Math.min(90, Math.max(3, y * 100))}%`,
  });
  const fmt = (n: number) => n.toFixed(3);
  const active = annotations.find((a) => a.id === openAnn) ?? null;

  return (
    <div className="relative select-none" style={{ width: size }}>
      <div
        ref={boxRef}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-pin]")) return;
          setOpenAnn(null);
          setDraft(xy(e));
        }}
        onMouseMove={(e) => setHover(xy(e))}
        onMouseLeave={() => setHover(null)}
        className={cn("relative cursor-crosshair overflow-hidden border bg-black", post ? "" : "border-border")}
        style={{ width: size, height: size, borderColor: post ? "var(--series-5)" : undefined }}
      >
        <img src={src} alt="generated cell" width={size} height={size}
          style={{ imageRendering: "pixelated", width: size, height: size, display: "block" }} />

        {/* grid */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: 0.5 }}>
          {[0.25, 0.5, 0.75].map((f) => (
            <g key={f}>
              <line x1={`${f * 100}%`} y1="0" x2={`${f * 100}%`} y2="100%" stroke="rgba(120,140,160,0.14)" strokeWidth="1" />
              <line x1="0" y1={`${f * 100}%`} x2="100%" y2={`${f * 100}%`} stroke="rgba(120,140,160,0.14)" strokeWidth="1" />
            </g>
          ))}
        </svg>

        {/* crosshair */}
        {hover && !draft && !active && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute h-full w-px bg-white/25" style={{ left: `${hover.x * 100}%` }} />
            <div className="absolute h-px w-full bg-white/25" style={{ top: `${hover.y * 100}%` }} />
          </div>
        )}

        {/* scale bar */}
        <div className="pointer-events-none absolute bottom-2 right-2 flex flex-col items-end gap-0.5">
          <div className="h-[3px] w-12 bg-white/80" />
          <span className="font-mono text-[9px] text-white/80">10 µm</span>
        </div>

        {/* annotation pins */}
        {annotations.map((a, i) => (
          <button key={a.id} data-pin
            onClick={(e) => { e.stopPropagation(); setDraft(null); setOpenAnn(a.id === openAnn ? null : a.id); }}
            className="absolute grid h-4 w-4 -translate-x-1/2 -translate-y-1/2 place-items-center border border-white bg-accent font-mono text-[9px] font-bold text-accent-fg"
            style={pos(a.x, a.y)}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* coordinate readout */}
      <div className="flex items-center justify-between border-x border-b border-border bg-surface px-2 py-1 font-mono text-[10px] text-muted">
        <span>x {hover ? fmt(hover.x) : "—.———"}  y {hover ? fmt(hover.y) : "—.———"}</span>
        <span style={post ? { color: "var(--series-5)" } : undefined}>{channel}</span>
      </div>

      {/* new annotation popover */}
      {draft && (
        <div className="absolute z-20 w-60 -translate-x-1/2 border border-border bg-surface shadow-pop"
          style={{ left: pos(draft.x, draft.y).left, top: `calc(${pos(draft.x, draft.y).top} + 12px)` }}
          onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-border bg-surface-2 px-2 py-1">
            <span className="font-mono text-[10px] text-muted">ANNOTATE · x={fmt(draft.x)} y={fmt(draft.y)}</span>
            <button onClick={() => setDraft(null)} className="text-muted hover:text-text"><X size={12} /></button>
          </div>
          <div className="p-2">
            <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} rows={2}
              placeholder="Note or question about this spot…"
              className="w-full resize-none border border-border bg-surface-2 px-1.5 py-1 text-[12px] outline-none focus:border-accent" />
            <button
              onClick={() => { if (text.trim()) { props.onAddAnnotation(draft.x, draft.y, text.trim()); setText(""); setDraft(null); } }}
              disabled={!text.trim()}
              className="mt-1.5 w-full border border-accent bg-accent py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-fg disabled:opacity-40">
              Add annotation
            </button>
          </div>
        </div>
      )}

      {/* thread popover */}
      {active && (
        <div className="absolute z-20 w-64 -translate-x-1/2 border border-border bg-surface shadow-pop"
          style={{ left: pos(active.x, active.y).left, top: `calc(${pos(active.x, active.y).top} + 12px)` }}
          onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-border bg-surface-2 px-2 py-1">
            <span className="font-mono text-[10px] text-muted">ANNOT · x={fmt(active.x)} y={fmt(active.y)}</span>
            <button onClick={() => props.onRemoveAnnotation(active.id)} className="text-muted hover:text-error"><X size={12} /></button>
          </div>
          <div className="max-h-44 space-y-px overflow-y-auto bg-border">
            {active.comments.map((c, i) => (
              <div key={i} className="bg-surface px-2 py-1 text-[12px]">
                <span className={cn("mr-1 font-mono text-[9px] uppercase", c.author === "you" ? "text-accent" : "text-ok")}>
                  {c.author === "you" ? "user" : "claude"}
                </span>
                <span className="text-text">{c.text}</span>
              </div>
            ))}
            {props.replying && <div className="bg-surface px-2 py-1 font-mono text-[10px] text-muted">claude is answering…</div>}
          </div>
          <div className="border-t border-border">
            <input value={reply} onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && reply.trim()) { props.onReply(active.id, reply.trim()); setReply(""); } }}
              placeholder="ask Claude about this spot…"
              className="w-full bg-surface px-2 py-1 text-[12px] outline-none" />
          </div>
        </div>
      )}
    </div>
  );
}

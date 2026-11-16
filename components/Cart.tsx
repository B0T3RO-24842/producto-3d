"use client";

import { priceOf, type Line } from "@/lib/product";

const step = "grid size-7 place-items-center rounded-full border border-white/20 transition hover:border-white/60 focus-visible:outline-2 focus-visible:outline-hueso";

export function Cart({ lines, onBump }: { lines: readonly Line[]; onBump: (line: Line, d: number) => void }) {
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((n, l) => n + l.qty * priceOf(l.color, l.size), 0);

  return (
    <>
      <button type="button" popoverTarget="cart" className="rounded-full border border-white/15 px-4 py-2 text-sm transition hover:border-white/50 focus-visible:outline-2 focus-visible:outline-hueso">
        Carrito <span aria-live="polite">({count})</span>
      </button>

      {/* Native popover: closes with Escape or a click outside, no extra code. */}
      <div id="cart" popover="auto" className="inset-auto top-16 right-4 m-0 w-88 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-[#141518] p-5 text-hueso shadow-2xl md:right-6">
        <h2 className="text-lg font-semibold">Tu carrito</h2>

        {lines.length === 0 ? (
          <p className="mt-3 text-sm opacity-60">Aún no has agregado nada.</p>
        ) : (
          <>
            <ul className="mt-2 divide-y divide-white/10">
              {lines.map((l) => {
                const name = `Termo X ${l.size.label} ${l.color.label}`;
                return (
                  <li key={`${l.color.id}-${l.size.id}`} className="flex items-center gap-3 py-3">
                    <span className="size-6 shrink-0 rounded-full" style={{ background: l.color.hex }} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium whitespace-nowrap">
                        {l.size.label} · {l.color.label}
                      </p>
                      <p className="text-xs opacity-60">${priceOf(l.color, l.size)} c/u</p>
                    </div>
                    <button type="button" className={step} aria-label={`Quitar uno: ${name}`} onClick={() => onBump(l, -1)}>
                      −
                    </button>
                    <span className="w-4 text-center text-sm tabular-nums">{l.qty}</span>
                    <button type="button" className={step} aria-label={`Agregar uno: ${name}`} onClick={() => onBump(l, 1)}>
                      +
                    </button>
                    <button type="button" className="ml-1 text-xs underline opacity-60 transition hover:opacity-100 focus-visible:outline-2 focus-visible:outline-hueso" aria-label={`Eliminar ${name}`} onClick={() => onBump(l, -l.qty)}>
                      Eliminar
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 flex justify-between border-t border-white/10 pt-4 font-semibold">
              <span>Total</span>
              <span className="tabular-nums">${total}</span>
            </p>
          </>
        )}
      </div>
    </>
  );
}

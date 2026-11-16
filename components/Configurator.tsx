"use client";

import dynamic from "next/dynamic";
import { useState, type CSSProperties } from "react";
import { COLORS, SIZES, bump, priceOf, type ColorOption, type Line, type SizeOption } from "@/lib/product";
import { Cart } from "./Cart";

// WebGL only exists in the browser.
const ProductViewer = dynamic(() => import("./ProductViewer"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm opacity-60">Cargando 3D…</div>,
});

const SPECS = [
  ["24 h", "frío"],
  ["12 h", "calor"],
  ["0 %", "BPA"],
] as const;

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hueso";

export function Configurator() {
  const [color, setColor] = useState<ColorOption>(COLORS[0]);
  const [size, setSize] = useState<SizeOption>(SIZES[0]);
  const [cart, setCart] = useState<Line[]>([]);
  const [added, setAdded] = useState(false);
  const price = priceOf(color, size);

  const add = () => {
    setCart((ls) => bump(ls, color, size, 1));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="stage relative min-h-dvh overflow-hidden" style={{ "--accent": color.hex } as CSSProperties}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-sm font-semibold tracking-[0.3em]">TERMO</span>
        <Cart lines={cart} onBump={(l, d) => setCart((ls) => bump(ls, l.color, l.size, d))} />
      </header>

      <main className="mx-auto grid max-w-6xl items-center gap-6 px-6 pb-28 md:grid-cols-[1.1fr_1fr] md:gap-12 md:pb-10">
        <section className="relative h-[40dvh] md:h-[78dvh]">
          <div className="glow pointer-events-none absolute inset-[6%]" aria-hidden />
          <div className="viewer absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing">
            <ProductViewer color={color} size={size} />
          </div>
          <p className="pointer-events-none absolute inset-x-0 bottom-1 text-center text-xs opacity-50">Arrastra para girar</p>
        </section>

        <section className="space-y-7">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">Colección 2027</p>
            <h1 className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">Termo X</h1>
            <p className="mt-3 max-w-md opacity-70">Acero inoxidable de doble pared con acabado mate. Elige color y capacidad: el modelo y el precio cambian contigo.</p>
          </div>

          <ul className="flex gap-8">
            {SPECS.map(([n, t]) => (
              <li key={t}>
                <span className="block text-xl font-semibold">{n}</span>
                <span className="text-xs uppercase tracking-widest opacity-60">{t}</span>
              </li>
            ))}
          </ul>

          <fieldset>
            <legend className="mb-3 text-sm opacity-70">
              Color · <span className="text-hueso">{color.label}</span>
            </legend>
            <div className="flex gap-4">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-label={c.label}
                  aria-pressed={c.id === color.id}
                  onClick={() => setColor(c)}
                  style={{ background: c.hex }}
                  className={`size-10 rounded-full ring-offset-4 ring-offset-tinta transition hover:scale-110 aria-pressed:ring-2 aria-pressed:ring-hueso ${focus}`}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm opacity-70">Capacidad</legend>
            <div className="flex gap-3">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={s.id === size.id}
                  onClick={() => setSize(s)}
                  className={`rounded-2xl border border-white/15 px-5 py-3 text-left transition hover:border-white/40 aria-pressed:border-hueso aria-pressed:bg-hueso aria-pressed:text-tinta ${focus}`}
                >
                  <span className="block font-medium">{s.label}</span>
                  <span className="text-xs opacity-60">${priceOf(color, s)}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* fixed buy bar on phones, inline on desktop */}
          <div className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 border-t border-white/10 bg-tinta/85 px-6 py-4 backdrop-blur md:static md:justify-start md:gap-8 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
            <p aria-live="polite">
              <span key={price} className="inline-block animate-pop text-4xl font-semibold tabular-nums md:text-5xl">
                ${price}
              </span>
              <span className="block text-xs opacity-60">
                {size.label} · {color.label}
              </span>
            </p>
            <button type="button" onClick={add} className={`min-w-48 rounded-full bg-hueso px-7 py-4 font-medium text-tinta transition hover:bg-white active:scale-95 ${focus}`}>
              {added ? "Agregado ✓" : "Agregar al carrito"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

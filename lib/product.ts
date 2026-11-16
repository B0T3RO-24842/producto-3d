export const COLORS = [
  { id: "naranja", label: "Naranja", hex: "#f2572c", extra: 0 },
  { id: "azul", label: "Azul", hex: "#2f6bff", extra: 2 },
  { id: "verde", label: "Verde", hex: "#1fa35c", extra: 3 },
  { id: "rosa", label: "Rosa", hex: "#ec4899", extra: 4 },
] as const;

// scale = [width, height] of the 3D body relative to the 500 ml bottle
export const SIZES = [
  { id: "500", label: "500 ml", price: 29, scale: [1, 1] },
  { id: "750", label: "750 ml", price: 34, scale: [1.05, 1.2] },
  { id: "1000", label: "1 L", price: 39, scale: [1.1, 1.4] },
] as const;

export type ColorOption = (typeof COLORS)[number];
export type SizeOption = (typeof SIZES)[number];

export const priceOf = (c: ColorOption, s: SizeOption) => s.price + c.extra;

export type Line = { color: ColorOption; size: SizeOption; qty: number };

// Adds d units of a variant to the cart (negative removes); lines that reach 0 disappear.
export function bump(lines: readonly Line[], color: ColorOption, size: SizeOption, d: number): Line[] {
  const same = (l: Line) => l.color.id === color.id && l.size.id === size.id;
  const next = lines.some(same) ? lines.map((l) => (same(l) ? { ...l, qty: l.qty + d } : l)) : [...lines, { color, size, qty: d }];
  return next.filter((l) => l.qty > 0);
}

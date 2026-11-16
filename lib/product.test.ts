import assert from "node:assert/strict";
import { test } from "node:test";
import { COLORS, SIZES, bump, priceOf } from "./product.ts";

const [naranja, azul] = COLORS;
const [s500, , s1000] = SIZES;

test("price adds the colour extra to the size price", () => {
  assert.equal(priceOf(naranja, s500), 29);
  assert.equal(priceOf(azul, s1000), 41);
});

test("cart merges the same variant, separates others and drops empty lines", () => {
  let cart = bump([], naranja, s500, 1);
  cart = bump(cart, naranja, s500, 1);
  cart = bump(cart, azul, s500, 1);
  assert.deepEqual(cart.map((l) => l.qty), [2, 1]);

  cart = bump(cart, naranja, s500, -1);
  assert.deepEqual(cart.map((l) => l.qty), [1, 1]);

  cart = bump(cart, naranja, s500, -1);
  assert.deepEqual(cart.map((l) => l.color.id), ["azul"]);

  assert.deepEqual(bump([], azul, s1000, -1), []);
});

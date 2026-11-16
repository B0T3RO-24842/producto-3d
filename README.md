# Producto 3D · Termo X

Página de producto con un termo en 3D: gira solo, se arrastra con el mouse o el dedo, y el color, el tamaño y el precio cambian con cada clic. Incluye un carrito de demostración para sumar, restar y eliminar productos.

**Demo:** https://b0t3ro-24842.github.io/producto-3d/

**Stack:** Next.js 16 (exportación estática), React 19, TypeScript, Tailwind CSS 4, Three.js con React Three Fiber y drei.

```bash
npm install
npm run dev
```

`npm test` prueba los precios y la lógica del carrito.

## Cómo está hecho

- `lib/product.ts`: colores, capacidades, precios y carrito.
- `components/Bottle.tsx`: el modelo, hecho con código (sin archivos 3D ni descargas).
- `components/ProductViewer.tsx`: escena, dos luces fijas con sombras reales y controles.
- `components/Configurator.tsx`: la página y el estado.
- `components/Cart.tsx`: carrito desplegable.

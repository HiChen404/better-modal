import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.tsx'],
  splitting: true,
  sourcemap: false,
  clean: true,
  target: 'node14',
  format: ['esm'],
  minify: false,
  treeshake: true,
  dts: true,
})

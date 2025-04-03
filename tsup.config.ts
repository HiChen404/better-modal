import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: true,
  sourcemap: false,
  clean: true,
  target: 'node14',
  format: ['esm'],
  minify: true,
  treeshake: true,
})

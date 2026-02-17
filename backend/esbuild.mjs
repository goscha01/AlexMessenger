import { build } from 'esbuild';

await build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/server.js',
  format: 'cjs',
  packages: 'external',
  alias: {
    '@': '.',
  },
  sourcemap: true,
  logLevel: 'info',
});

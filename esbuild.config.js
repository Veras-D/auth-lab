const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outdir: "dist",
  platform: "node",
  target: "node20",
  format: "cjs",
  sourcemap: true,
  loader: { ".ts": "ts" },
}).catch(() => process.exit(1));
// Adds transparent padding around the Android adaptive-icon foreground so the
// logo isn't oversized in the app drawer. Android's adaptive icon expects the
// artwork to sit within a central safe zone (~66% of the canvas); a full-bleed
// foreground reads as "too big / cropped".
//
// Usage (the user runs this — the assistant does not execute terminal):
//   npm install                # installs sharp (devDependency)
//   node scripts/pad-adaptive-icon.mjs            # ~66% content (default)
//   CONTENT=0.6 node scripts/pad-adaptive-icon.mjs  # smaller logo
// Then regenerate native assets:
//   npx expo prebuild --clean
//
// Only touches assets/adaptive-icon.png (Android). iOS icon.png must stay
// full-bleed, so it is intentionally left alone. A one-time backup is kept at
// assets/adaptive-icon.original.png and used as the source, so re-running is safe.

import sharp from 'sharp';
import { existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';

const SIZE = 1024;
const CONTENT = Number(process.env.CONTENT ?? 0.66); // fraction of canvas for logo
const SRC = path.resolve('assets/adaptive-icon.png');
const BACKUP = path.resolve('assets/adaptive-icon.original.png');

async function main() {
  if (!existsSync(SRC)) {
    throw new Error(`No se encontró ${SRC}`);
  }
  if (CONTENT <= 0 || CONTENT > 1) {
    throw new Error(`CONTENT debe estar entre 0 y 1 (recibido: ${CONTENT})`);
  }
  // Keep a pristine backup and always pad from it (idempotent re-runs).
  if (!existsSync(BACKUP)) {
    copyFileSync(SRC, BACKUP);
    console.log(`Backup creado: ${BACKUP}`);
  }

  const target = Math.round(SIZE * CONTENT);
  const offset = Math.round((SIZE - target) / 2);

  const logo = await sharp(BACKUP)
    .resize(target, target, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: logo, top: offset, left: offset }])
    .png()
    .toFile(SRC);

  console.log(
    `Listo: logo al ${Math.round(CONTENT * 100)}% sobre ${SIZE}x${SIZE} → ${SRC}`,
  );
  console.log('Ahora ejecuta: npx expo prebuild --clean');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

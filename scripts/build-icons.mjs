#!/usr/bin/env node
/**
 * Genera le icone PNG della PWA a partire da public/favicon.svg.
 *
 * - pwa-192.png / pwa-512.png: icone "any", sfondo feltro (niente trasparenza,
 *   che su Android diventerebbe nera).
 * - pwa-maskable-512.png: il disegno sta dentro il 70% centrale, così la
 *   maschera circolare/squircle di Android non taglia le carte.
 * - apple-touch-icon.png: 180px, iOS non applica maschere ma arrotonda da sé.
 *
 * Usage: npm run icons
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = join(root, 'public')
const SOURCE = join(PUBLIC_DIR, 'favicon.svg')
const BACKGROUND = '#092820' // --color-felt-3, uguale al theme-color

/** Il cerchio del favicon tocca i bordi: qui lo si rimpicciolisce dentro il canvas. */
const render = async (size, inset) => {
  const art = Math.round(size * inset)
  const drawing = await sharp(await readFile(SOURCE), { density: 384 })
    .resize(art, art)
    .png()
    .toBuffer()

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BACKGROUND,
    },
  })
    .composite([{ input: drawing, gravity: 'centre' }])
    .png()
    .toBuffer()
}

const icons = [
  { file: 'pwa-192.png', size: 192, inset: 0.92 },
  { file: 'pwa-512.png', size: 512, inset: 0.92 },
  { file: 'pwa-maskable-512.png', size: 512, inset: 0.7 },
  { file: 'apple-touch-icon.png', size: 180, inset: 0.88 },
]

for (const { file, size, inset } of icons) {
  const buffer = await render(size, inset)
  await writeFile(join(PUBLIC_DIR, file), buffer)
  console.log(`${file.padEnd(24)} ${size}×${size}  ${(buffer.length / 1024).toFixed(1)} kB`)
}

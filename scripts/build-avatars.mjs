#!/usr/bin/env node
/**
 * Converts the full-resolution character art in avatars-src/ into the small WebP
 * files the app actually ships. Seats render at ~60px and the drawer grid at ~70px,
 * so 256px covers even 3x displays.
 *
 * Usage: npm run avatars
 */
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = join(root, 'avatars-src')
const OUT_DIR = join(root, 'src', 'assets', 'avatars')
const SIZE = 256
const QUALITY = 82
const SOURCE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`

const sources = (await readdir(SRC_DIR).catch(() => {
  console.error(`Cartella non trovata: ${SRC_DIR}`)
  console.error('Crea avatars-src/ e mettici le immagini originali.')
  process.exit(1)
}))
  .filter((file) => SOURCE_EXTENSIONS.has(extname(file).toLowerCase()))
  .sort()

if (sources.length === 0) {
  console.error(`Nessuna immagine in ${SRC_DIR}`)
  process.exit(1)
}

await mkdir(OUT_DIR, { recursive: true })

let totalIn = 0
let totalOut = 0

for (const file of sources) {
  const inPath = join(SRC_DIR, file)
  const outPath = join(OUT_DIR, `${file.slice(0, -extname(file).length)}.webp`)

  const buffer = await sharp(inPath)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
    .webp({ quality: QUALITY })
    .toBuffer()

  await writeFile(outPath, buffer)

  const inSize = (await stat(inPath)).size
  totalIn += inSize
  totalOut += buffer.length
  console.log(`${file.padEnd(20)} ${kb(inSize).padStart(10)} → ${kb(buffer.length)}`)
}

console.log(
  `\n${sources.length} avatar · ${kb(totalIn)} → ${kb(totalOut)} ` +
    `(${((1 - totalOut / totalIn) * 100).toFixed(1)}% in meno)`,
)

const orphans = (await readdir(OUT_DIR))
  .filter((file) => extname(file) === '.webp')
  .filter(
    (file) =>
      !sources.some((source) => source.slice(0, -extname(source).length) === file.slice(0, -5)),
  )

if (orphans.length > 0) {
  console.warn(
    `\n⚠ ${orphans.length} file in src/assets/avatars/ non hanno più un originale ` +
      `in avatars-src/: ${orphans.join(', ')}`,
  )
  console.warn('  Sono ancora selezionabili nell’app: eliminali a mano se non ti servono.')
}

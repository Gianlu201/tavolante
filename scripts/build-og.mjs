#!/usr/bin/env node
/**
 * Genera public/og-cover.png (1200×630), l'anteprima che WhatsApp, Telegram,
 * Facebook, X e iMessage mostrano quando si condivide il link.
 *
 * Il disegno è un SVG scritto qui e rasterizzato da sharp: niente screenshot,
 * così l'immagine si rigenera ovunque con `npm run og`. I titoli usano Georgia
 * (il fallback di Fraunces dichiarato in @theme) perché librsvg vede solo i
 * font installati nel sistema, non quelli caricati dalla pagina.
 *
 * Usage: npm run og
 */
import { writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'public', 'og-cover.png')

const W = 1200
const H = 630

// Token del tema (src/index.css), ripetuti qui perché l'SVG non vede il CSS.
const FELT_1 = '#134a37'
const FELT_3 = '#092820'
const GOLD = '#c9a15a'
const GOLD_LIGHT = '#ecd8a3'
const CREAM = '#f4ecdd'

/** Sei posti attorno al tavolo, come li disporrebbe src/lib/table.ts. */
const seats = Array.from({ length: 6 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2
  return {
    x: 895 + Math.cos(angle) * 132,
    y: 315 + Math.sin(angle) * 132,
    // Il posto di partenza è quello in alto: è il risultato che l'app calcola.
    highlight: index === 0,
  }
})

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="felt" cx="50%" cy="0%" r="120%">
      <stop offset="0%" stop-color="${FELT_1}"/>
      <stop offset="55%" stop-color="${FELT_3}"/>
      <stop offset="100%" stop-color="#04150f"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cardFace" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fbf6ec"/>
      <stop offset="100%" stop-color="#e7dcc6"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#felt)"/>
  <circle cx="895" cy="315" r="300" fill="url(#glow)"/>
  <rect x="18" y="18" width="${W - 36}" height="${H - 36}" rx="28"
        fill="none" stroke="${GOLD}" stroke-opacity="0.4" stroke-width="2"/>

  <!-- Colonna sinistra: il testo che si legge anche nell'anteprima piccola. -->
  <text x="86" y="212" font-family="Verdana, DejaVu Sans, sans-serif" font-size="26"
        letter-spacing="7" fill="${GOLD}" fill-opacity="0.9">MURLAN</text>
  <text x="82" y="316" font-family="Georgia, Times New Roman, serif" font-size="104"
        font-weight="bold" fill="${CREAM}">Tavolante</text>
  <text x="86" y="382" font-family="Verdana, DejaVu Sans, sans-serif" font-size="30"
        fill="${GOLD_LIGHT}" fill-opacity="0.95">Distributore di carte</text>
  <text x="86" y="440" font-family="Verdana, DejaVu Sans, sans-serif" font-size="23"
        fill="${CREAM}" fill-opacity="0.7">Da chi iniziare a distribuire perché</text>
  <text x="86" y="474" font-family="Verdana, DejaVu Sans, sans-serif" font-size="23"
        fill="${CREAM}" fill-opacity="0.7">l’ultima carta vada al vincitore.</text>
  <rect x="86" y="516" width="250" height="52" rx="26"
        fill="${GOLD}" fill-opacity="0.14" stroke="${GOLD}" stroke-opacity="0.55"/>
  <text x="211" y="549" text-anchor="middle" font-family="Verdana, DejaVu Sans, sans-serif"
        font-size="21" fill="${GOLD_LIGHT}">tavolante.it</text>

  <!-- Colonna destra: il tavolo con il posto di partenza acceso. -->
  <circle cx="895" cy="315" r="196" fill="#0c3226" stroke="${GOLD}" stroke-opacity="0.45" stroke-width="3"/>
  <circle cx="895" cy="315" r="163" fill="none" stroke="${GOLD_LIGHT}" stroke-opacity="0.2"
          stroke-width="2" stroke-dasharray="3 12"/>
  ${seats
    .map(
      ({ x, y, highlight }) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="30"
    fill="${highlight ? GOLD : '#0f3a2c'}"
    stroke="${highlight ? GOLD_LIGHT : GOLD}" stroke-opacity="${highlight ? 1 : 0.5}" stroke-width="3"/>`,
    )
    .join('\n  ')}
  <g transform="translate(872,332) rotate(-9)">
    <rect x="-42" y="-58" width="84" height="116" rx="12" fill="url(#cardFace)"
          stroke="${GOLD}" stroke-width="3"/>
    <rect x="-27" y="-42" width="54" height="84" rx="7" fill="none"
          stroke="${GOLD}" stroke-opacity="0.45" stroke-width="2"/>
  </g>
  <g transform="translate(946,300) rotate(14)">
    <rect x="-42" y="-58" width="84" height="116" rx="12" fill="url(#cardFace)"
          stroke="${GOLD}" stroke-width="3"/>
    <rect x="-27" y="-42" width="54" height="84" rx="7" fill="none"
          stroke="${GOLD}" stroke-opacity="0.45" stroke-width="2"/>
  </g>
</svg>`

const buffer = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer()
await writeFile(OUT, buffer)
console.log(`og-cover.png  ${W}×${H}  ${(buffer.length / 1024).toFixed(1)} kB`)

import { avatarSrc } from './avatars'
import { labelInitials } from './settings'
import { offPodium, podiumSteps, type Standing, type Tournament } from './tournament'

/**
 * Disegna il podio finale su un canvas 1080 px di larghezza (4:5, si legge bene
 * nelle chat) e lo restituisce come PNG. Tutto avviene sul telefono: avatar e font
 * sono già nella cache della PWA, quindi funziona anche offline.
 */

const WIDTH = 1080
const BASE_HEIGHT = 1350
const OTHERS_PER_ROW = 5
const OTHERS_ROW_HEIGHT = 190

const SERIF = 'Fraunces, Georgia, serif'
const SANS = 'Manrope, system-ui, sans-serif'
const MONO = '"JetBrains Mono", ui-monospace, monospace'

const STEP_WIDTH = 290
const STEP_GAP = 14
const BASE_Y = 950
/** Drawn left to right: 2nd, 1st, 3rd. */
const STEP_LAYOUT = [
  { step: 1, height: 220 },
  { step: 0, height: 300 },
  { step: 2, height: 160 },
]
const STEP_COLORS = [
  ['#f3e3b5', '#c9a15a'],
  ['#eef0f3', '#a9b0ba'],
  ['#efb98f', '#b8693a'],
]

const dateFormat = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const handsLabel = (count: number) => (count === 1 ? '1 mano' : `${count} mani`)

/** Theme colours follow the seasonal palette when one is active. */
const themeColor = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

const loadImage = async (src: string | null) => {
  if (!src) return null
  try {
    const image = new Image()
    image.src = src
    await image.decode()
    return image
  } catch {
    return null
  }
}

const loadFonts = async () => {
  try {
    await Promise.all(
      [
        `600 76px ${SERIF}`,
        `700 130px ${SERIF}`,
        `600 32px ${SANS}`,
        `700 38px ${SANS}`,
        `800 40px ${SANS}`,
        `600 26px ${MONO}`,
      ].map((font) => document.fonts.load(font)),
    )
  } catch {
    // system fallbacks are fine
  }
}

const fitText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  if (ctx.measureText(text).width <= maxWidth) return text
  let fitted = text
  while (fitted.length > 1 && ctx.measureText(`${fitted}…`).width > maxWidth) {
    fitted = fitted.slice(0, -1)
  }
  return `${fitted}…`
}

const setSpacing = (ctx: CanvasRenderingContext2D, px: number) => {
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${px}px`
}

/** Deterministic scatter: the same tournament always gets the same confetti. */
const scatter = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

const drawConfetti = (ctx: CanvasRenderingContext2D) => {
  const colors = ['#c9a15a', '#ecd8a3', '#f4ecdd', '#e08363', '#c9ced6']
  for (let i = 0; i < 70; i++) {
    const x = scatter(i, 1) * WIDTH
    // Mostly along the top and the sides, away from the podium itself.
    const y = scatter(i, 2) < 0.65 ? scatter(i, 3) * 330 : 330 + scatter(i, 4) * 520
    // Keep the title readable and the podium clear.
    if (y > 330 && x > 150 && x < WIDTH - 150) continue
    if (y > 60 && y < 290 && x > 200 && x < WIDTH - 200) continue
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(scatter(i, 5) * Math.PI)
    ctx.globalAlpha = 0.55 + scatter(i, 6) * 0.4
    ctx.fillStyle = colors[i % colors.length]
    if (i % 4 === 0) {
      ctx.beginPath()
      ctx.arc(0, 0, 6 + scatter(i, 7) * 4, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillRect(-7, -12, 14 + scatter(i, 8) * 6, 22 + scatter(i, 9) * 8)
    }
    ctx.restore()
  }
}

const drawAvatar = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  name: string,
  cx: number,
  cy: number,
  radius: number,
  ring: string,
) => {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)'
  ctx.fill()
  ctx.clip()
  if (image) {
    ctx.drawImage(image, cx - radius, cy - radius, radius * 2, radius * 2)
  } else {
    ctx.fillStyle = 'rgba(244, 236, 221, 0.12)'
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
    ctx.fillStyle = '#f4ecdd'
    ctx.font = `700 ${Math.round(radius * 0.62)}px ${MONO}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(labelInitials(name), cx, cy + radius * 0.04)
  }
  ctx.restore()

  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.lineWidth = 6
  ctx.strokeStyle = ring
  ctx.stroke()
}

const roundedTop = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  ctx.beginPath()
  ctx.moveTo(x, y + height)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height)
  ctx.closePath()
}

export const renderPodiumImage = async (tournament: Tournament, rows: Standing[]) => {
  const steps = podiumSteps(rows)
  const others = offPodium(rows)
  const otherRows = Math.ceil(others.length / OTHERS_PER_ROW)
  const height =
    others.length === 0
      ? BASE_HEIGHT - 170
      : BASE_HEIGHT + Math.max(0, otherRows - 1) * OTHERS_ROW_HEIGHT

  const images = new Map(
    await Promise.all(
      rows.map(async (row) => [row.id, await loadImage(avatarSrc(row.avatarId))] as const),
    ),
  )
  await loadFonts()

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D non disponibile')

  const background = ctx.createRadialGradient(WIDTH / 2, 320, 60, WIDTH / 2, 420, 1150)
  background.addColorStop(0, themeColor('--color-felt-1', '#134a37'))
  background.addColorStop(0.62, themeColor('--color-felt-2', '#0c3226'))
  background.addColorStop(1, themeColor('--color-felt-3', '#092820'))
  ctx.fillStyle = background
  ctx.fillRect(0, 0, WIDTH, height)

  const glow = ctx.createRadialGradient(WIDTH / 2, 0, 0, WIDTH / 2, 0, 620)
  glow.addColorStop(0, 'rgba(201, 161, 90, 0.22)')
  glow.addColorStop(1, 'rgba(201, 161, 90, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, WIDTH, 620)

  drawConfetti(ctx)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = 'rgba(201, 161, 90, 0.9)'
  ctx.font = `600 28px ${MONO}`
  setSpacing(ctx, 6)
  ctx.fillText('TAVOLANTE · MURLAN', WIDTH / 2, 110)
  setSpacing(ctx, 0)

  ctx.fillStyle = '#f4ecdd'
  ctx.font = `600 76px ${SERIF}`
  ctx.fillText('Il podio del torneo', WIDTH / 2, 200)

  ctx.fillStyle = 'rgba(244, 236, 221, 0.62)'
  ctx.font = `600 32px ${SANS}`
  ctx.fillText(
    `${dateFormat.format(tournament.endedAt ?? tournament.startedAt)} · ${handsLabel(tournament.hands.length)}`,
    WIDTH / 2,
    258,
  )

  const left = (WIDTH - (STEP_WIDTH * 3 + STEP_GAP * 2)) / 2

  STEP_LAYOUT.forEach(({ step, height: stepHeight }, column) => {
    const x = left + column * (STEP_WIDTH + STEP_GAP)
    const top = BASE_Y - stepHeight
    const [light, dark] = STEP_COLORS[step]

    const fill = ctx.createLinearGradient(0, top, 0, BASE_Y)
    fill.addColorStop(0, light)
    fill.addColorStop(1, dark)
    roundedTop(ctx, x, top, STEP_WIDTH, stepHeight, 18)
    ctx.fillStyle = fill
    ctx.fill()

    const numeral = step === 0 ? 130 : 110
    ctx.fillStyle = 'rgba(32, 22, 15, 0.5)'
    ctx.font = `700 ${numeral}px ${SERIF}`
    ctx.fillText(String(step + 1), x + STEP_WIDTH / 2, top + numeral * 0.78 + 8)

    const players = steps[step]
    if (players.length === 0) return

    const baseRadius = step === 0 ? 95 : 80
    const radius = Math.min(
      baseRadius,
      (STEP_WIDTH - (players.length - 1) * 12) / players.length / 2,
    )
    const avatarY = top - 120 - radius
    players.forEach((player, i) => {
      const cx =
        x + STEP_WIDTH / 2 + (i - (players.length - 1) / 2) * (radius * 2 + 12)
      drawAvatar(ctx, images.get(player.id) ?? null, player.name, cx, avatarY, radius, dark)
    })

    ctx.fillStyle = '#f4ecdd'
    ctx.font = `700 ${players.length > 1 ? 30 : 38}px ${SANS}`
    ctx.fillText(
      fitText(ctx, players.map((player) => player.name).join(' · '), STEP_WIDTH + 10),
      x + STEP_WIDTH / 2,
      top - 72,
    )

    ctx.fillStyle = '#ecd8a3'
    ctx.font = `800 40px ${SANS}`
    ctx.fillText(`${players[0].points} pt`, x + STEP_WIDTH / 2, top - 26)
  })

  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.fillRect(left - 20, BASE_Y, STEP_WIDTH * 3 + STEP_GAP * 2 + 40, 12)

  if (others.length > 0) {
    ctx.fillStyle = 'rgba(201, 161, 90, 0.8)'
    ctx.font = `600 24px ${MONO}`
    setSpacing(ctx, 5)
    ctx.fillText('ALLA BASE DEL PODIO', WIDTH / 2, 1022)
    setSpacing(ctx, 0)

    others.forEach((player, i) => {
      const row = Math.floor(i / OTHERS_PER_ROW)
      const inRow = Math.min(OTHERS_PER_ROW, others.length - row * OTHERS_PER_ROW)
      const slot = 200
      const cx = WIDTH / 2 + ((i % OTHERS_PER_ROW) - (inRow - 1) / 2) * slot
      const cy = 1106 + row * OTHERS_ROW_HEIGHT
      drawAvatar(ctx, images.get(player.id) ?? null, player.name, cx, cy, 46, 'rgba(244, 236, 221, 0.35)')
      ctx.fillStyle = '#f4ecdd'
      ctx.font = `700 26px ${SANS}`
      ctx.fillText(fitText(ctx, player.name, slot - 16), cx, cy + 86)
      ctx.fillStyle = 'rgba(236, 216, 163, 0.85)'
      ctx.font = `600 24px ${MONO}`
      ctx.fillText(`${player.points} pt`, cx, cy + 120)
    })
  }

  ctx.fillStyle = 'rgba(201, 161, 90, 0.7)'
  ctx.font = `600 26px ${MONO}`
  ctx.fillText('tavolante.vercel.app', WIDTH / 2, height - 48)

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Esportazione non riuscita'))),
      'image/png',
    ),
  )
}

const MEDALS = ['🥇', '🥈', '🥉']

/** The plain-text ranking for WhatsApp's own link, which cannot carry an image. */
export const podiumText = (tournament: Tournament, rows: Standing[]) =>
  [
    `🏆 Torneo di Murlan · ${dateFormat.format(tournament.endedAt ?? tournament.startedAt)}`,
    '',
    ...rows.map(
      (row) =>
        `${row.points > 0 ? (MEDALS[row.rank - 1] ?? `${row.rank}°`) : `${row.rank}°`} ${row.name} · ${row.points} pt`,
    ),
    '',
    `${handsLabel(tournament.hands.length)} giocate · tavolante.vercel.app`,
  ].join('\n')

export const podiumFileName = (tournament: Tournament) => {
  const date = new Date(tournament.endedAt ?? tournament.startedAt)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `tavolante-podio-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.png`
}

/**
 * Opens the phone's share sheet (WhatsApp sits among the first targets); browsers
 * that cannot share files get a download instead. Only the file is passed: iOS
 * drops the image for WhatsApp when a title or text travels with it.
 */
export const shareImage = async (file: File) => {
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return 'shared' as const
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled' as const
    }
  }
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  return 'downloaded' as const
}

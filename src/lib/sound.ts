/**
 * Effetti sonori sintetizzati con Web Audio: nessun file da scaricare, quindi
 * funzionano anche offline e non pesano sul precache della PWA.
 */

let context: AudioContext | null = null

type WindowWithWebkitAudio = Window & { webkitAudioContext?: typeof AudioContext }

/**
 * Must run inside a tap: iOS only lets audio start during a user gesture. Sounds
 * scheduled later on the same context then play without needing another one.
 */
export const unlockAudio = () => {
  try {
    const AudioCtor =
      window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext
    if (!AudioCtor) return null
    context ??= new AudioCtor()
    if (context.state === 'suspended') void context.resume()
    return context
  } catch {
    return null
  }
}

const SOUND_KEY = 'tavolante:sound:v1'

export const loadSoundOn = () => {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off'
  } catch {
    return true
  }
}

export const saveSoundOn = (on: boolean) => {
  try {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off')
  } catch {
    // preference stays in memory only
  }
}

/**
 * A party blower: two detuned buzzy oscillators gliding up into the note, darkened
 * by a resonant low-pass and shaken by a fast tremolo — the paper reed flutter.
 */
const horn = (
  ctx: AudioContext,
  out: AudioNode,
  start: number,
  duration: number,
  frequency: number,
) => {
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 2300
  filter.Q.value = 5

  const tremolo = ctx.createGain()
  tremolo.gain.value = 0.7
  const flutter = ctx.createOscillator()
  flutter.frequency.value = 26
  const flutterDepth = ctx.createGain()
  flutterDepth.gain.value = 0.3
  flutter.connect(flutterDepth).connect(tremolo.gain)

  const envelope = ctx.createGain()
  envelope.gain.setValueAtTime(0, start)
  envelope.gain.linearRampToValueAtTime(0.32, start + 0.03)
  envelope.gain.setValueAtTime(0.32, start + duration - 0.08)
  envelope.gain.linearRampToValueAtTime(0, start + duration)

  filter.connect(tremolo).connect(envelope).connect(out)

  const voices: [OscillatorType, number][] = [
    ['sawtooth', 0],
    ['square', 9],
  ]
  for (const [type, detune] of voices) {
    const osc = ctx.createOscillator()
    osc.type = type
    osc.detune.value = detune
    osc.frequency.setValueAtTime(frequency * 0.8, start)
    osc.frequency.exponentialRampToValueAtTime(frequency, start + 0.08)
    osc.connect(filter)
    osc.start(start)
    osc.stop(start + duration + 0.05)
  }
  flutter.start(start)
  flutter.stop(start + duration + 0.05)
}

/** The confetti cannon: a short band-passed noise burst. */
const pop = (ctx: AudioContext, out: AudioNode, start: number) => {
  const length = Math.floor(ctx.sampleRate * 0.12)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3

  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 1400
  band.Q.value = 0.8
  const gain = ctx.createGain()
  gain.gain.value = 0.9
  noise.connect(band).connect(gain).connect(out)
  noise.start(start)
}

/**
 * Schedules the podium fanfare `delay` seconds from now on the unlocked context.
 * Returns a function that silences it, also halfway through.
 */
export const playFanfare = (delay: number) => {
  const ctx = context
  if (!ctx) return () => {}

  const master = ctx.createGain()
  master.gain.value = 0.8
  master.connect(ctx.destination)

  const t = ctx.currentTime + delay
  pop(ctx, master, t)
  horn(ctx, master, t + 0.05, 0.22, 311)
  horn(ctx, master, t + 0.34, 0.8, 311)
  horn(ctx, master, t + 0.38, 0.76, 392)

  return () => {
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setValueAtTime(0, ctx.currentTime)
    window.setTimeout(() => master.disconnect(), 100)
  }
}

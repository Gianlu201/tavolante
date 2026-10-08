import type { SeasonChoice } from './seasons'

export type ThemeOption = { choice: SeasonChoice; emoji: string; name: string; detail?: string }

/** The entries of the secret theme panel: the two modes, then the themes in calendar order. */
export const THEME_OPTIONS: ThemeOption[] = [
  { choice: 'auto', emoji: '📅', name: 'Automatico', detail: 'segue il calendario' },
  { choice: 'off', emoji: '🃏', name: 'Classico', detail: 'mai nessun tema' },
  { choice: 'carnevale', emoji: '🎭', name: 'Carnevale' },
  { choice: 'pasqua', emoji: '🐣', name: 'Pasqua' },
  { choice: 'pesce', emoji: '🐟', name: "Pesce d'aprile" },
  { choice: 'luminara', emoji: '✨', name: 'Luminara' },
  { choice: 'palio', emoji: '🚣', name: 'Palio' },
  { choice: 'agosto', emoji: '🌠', name: "Notti d'agosto" },
  { choice: 'halloween', emoji: '🎃', name: 'Halloween' },
  { choice: 'natale', emoji: '🎄', name: 'Natale' },
  { choice: 'capodanno', emoji: '🎆', name: 'Capodanno' },
  { choice: 'mezzanotte', emoji: '🎇', name: 'Mezzanotte', detail: 'conto alla rovescia' },
]

export const themeName = (choice: SeasonChoice) =>
  THEME_OPTIONS.find((option) => option.choice === choice)?.name ?? choice

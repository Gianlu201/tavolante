import { celebrantsOn, joinNames } from './birthdays'
import { parseDayKey, type SeasonChoice } from './seasons'

export type ThemeOption = { choice: SeasonChoice; emoji: string; name: string; detail?: string }

/**
 * The entries of the secret theme panel: the two modes, the birthdays (they beat every
 * other theme), then the themes in calendar order.
 */
export const THEME_OPTIONS: ThemeOption[] = [
  { choice: 'auto', emoji: '📅', name: 'Automatico', detail: 'segue il calendario' },
  { choice: 'off', emoji: '🃏', name: 'Classico', detail: 'mai nessun tema' },
  { choice: 'compleanno', emoji: '🎂', name: 'Compleanno' },
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

const longDay = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long' })

/** «Compleanno · 6 settembre» for a birthday forced on a day, else the theme name. */
export const choiceLabel = (choice: SeasonChoice, birthdayDay: string | null) => {
  const date = choice === 'compleanno' ? parseDayKey(birthdayDay) : null
  return date ? `${themeName(choice)} · ${longDay.format(date)}` : themeName(choice)
}

/** Why a forced birthday is not on screen yet: it needs someone celebrating at the table. */
export const birthdayHint = (date: Date, guests: string[]) => {
  if (celebrantsOn(date, guests).length > 0) return ''
  const names = celebrantsOn(date).map((birthday) => birthday.name)
  return names.length > 0
    ? `. Si vedrà con ${joinNames(names)} al tavolo`
    : '. Nessun compleanno in lista quel giorno'
}

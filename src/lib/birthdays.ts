/**
 * I compleanni del gruppo: nel giorno di uno di loro, se il festeggiato è seduto al
 * tavolo, l'app si veste a festa e il tema del compleanno vince su qualsiasi altro
 * periodo (Halloween, Natale, Capodanno…). Il nome è confrontato con quello scritto sul
 * posto senza badare a maiuscole e spazi: «gianluca » vale quanto «Gianluca».
 */
export type Birthday = { name: string; month: number; day: number }

export const BIRTHDAYS: Birthday[] = [
  { name: 'Ranieri', month: 5, day: 8 }, // 8 maggio
  { name: 'Ilaria', month: 5, day: 29 }, // 29 maggio
  { name: 'Matteo', month: 6, day: 5 }, // 5 giugno
  { name: 'Giulio', month: 6, day: 7 }, // 7 giugno
  { name: 'Gianluca', month: 7, day: 11 }, // 11 luglio
  { name: 'Chiara', month: 9, day: 6 }, // 6 settembre
  { name: 'Genni', month: 9, day: 14 }, // 14 settembre
]

/** The birthday in `year`: 29 February falls on 1 March in common years. */
export const birthdayIn = ({ month, day }: Birthday, year: number) =>
  new Date(year, month - 1, day)

const normalize = (name: string) => name.trim().toLowerCase()

/** The birthdays of whoever is named in `guests`, or all of them when it is omitted. */
export const birthdaysOf = (guests?: string[]) => {
  if (!guests) return BIRTHDAYS
  const seated = new Set(guests.map(normalize))
  return BIRTHDAYS.filter((birthday) => seated.has(normalize(birthday.name)))
}

/** Who celebrates on `date` among `guests` (everyone when omitted), in list order. */
export const celebrantsOn = (date: Date, guests?: string[]) =>
  birthdaysOf(guests).filter((birthday) => {
    const when = birthdayIn(birthday, date.getFullYear())
    return when.getMonth() === date.getMonth() && when.getDate() === date.getDate()
  })

/** Whether the name typed on a seat belongs to someone celebrating on `date`. */
export const isCelebrated = (name: string, date: Date) => celebrantsOn(date, [name]).length > 0

/** «Chiara», «Chiara e Genni», «Chiara, Genni e Mirko». */
export const joinNames = (names: string[]) =>
  names.length < 2 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} e ${names.at(-1)}`

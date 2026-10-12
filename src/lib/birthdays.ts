/**
 * I compleanni del gruppo: in quei giorni l'app si veste a festa e il tema del
 * compleanno vince su qualsiasi altro periodo (Halloween, Natale, Capodanno…).
 * Il nome è quello scritto sul posto, maiuscole e spazi esclusi: chi lo porta al
 * tavolo riceve la corona al posto del cappellino.
 */
export type Birthday = { name: string; month: number; day: number }

// Date d'esempio, da sostituire con quelle vere.
export const BIRTHDAYS: Birthday[] = [
  { name: 'Gianluca', month: 10, day: 28 },
  { name: 'Chiara', month: 3, day: 9 },
  { name: 'Lorenzo', month: 7, day: 21 },
]

/** The birthday in `year`: 29 February falls on 1 March in common years. */
export const birthdayIn = ({ month, day }: Birthday, year: number) =>
  new Date(year, month - 1, day)

/** Whoever has a birthday on `date`, in list order. */
export const birthdaysOn = (date: Date) =>
  BIRTHDAYS.filter((birthday) => {
    const when = birthdayIn(birthday, date.getFullYear())
    return when.getMonth() === date.getMonth() && when.getDate() === date.getDate()
  })

const normalize = (name: string) => name.trim().toLowerCase()

/** Whether the name typed on a seat belongs to someone celebrating on `date`. */
export const isCelebrated = (name: string, date: Date) =>
  normalize(name) !== '' &&
  birthdaysOn(date).some((birthday) => normalize(birthday.name) === normalize(name))

/** «Chiara», «Chiara e Genni», «Chiara, Genni e Mirko». */
export const joinNames = (names: string[]) =>
  names.length < 2 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} e ${names.at(-1)}`

import type { ComponentType, ReactNode } from 'react'
import type { PlayerProfile } from '../lib/settings'

export type SeatInfo = {
  index: number
  profile: PlayerProfile
  /** Every seat at the table, for accessories that pick one player out of all. */
  profiles: PlayerProfile[]
}

/** Everything a seasonal theme can add to the page. Colours live in index.css. */
export type ThemeModule = {
  /** Behind the whole page: sky, characters, decorations. */
  Scene: ComponentType
  /** Above everything and never in the way of taps: intros, countdowns. */
  Overlay?: ComponentType
  /** Around the felt, under the seats. */
  TableDecoration?: ComponentType
  /** Worn by a seat; the dragged copy wears it too. */
  seatAccessory?: (seat: SeatInfo) => ReactNode
  /** In place of the small text above the title. */
  Kicker?: ComponentType
  /** Extra room above the title, for decorations hanging from the top edge. */
  roomyHeader?: boolean
  /** Extra classes on the box that holds the table. */
  tableClassName?: string
}

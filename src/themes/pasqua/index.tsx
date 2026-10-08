import type { ThemeModule } from '../types'
import BunnyEars from './BunnyEars'
import ChocolateEgg from './ChocolateEgg'
import EasterScene from './Scene'

/**
 * Pasqua (dalla Domenica delle Palme a Pasquetta): il tavolo è un uovo di cioccolato
 * aperto nella sua stagnola, i giocatori hanno le orecchie da coniglio.
 */
const pasqua: ThemeModule = {
  Scene: EasterScene,
  TableDecoration: ChocolateEgg,
  seatAccessory: () => <BunnyEars />,
}

export default pasqua

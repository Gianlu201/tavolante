import type { ThemeModule } from '../types'
import SantaHat from './SantaHat'
import ChristmasScene from './Scene'
import Wreath from './Wreath'

/**
 * Natale: notte con la luna e la slitta, tavolo di velluto rosso dentro una ghirlanda,
 * cappellino di Babbo Natale su ogni giocatore.
 */
const natale: ThemeModule = {
  Scene: ChristmasScene,
  TableDecoration: Wreath,
  seatAccessory: () => <SantaHat />,
  roomyHeader: true,
}

export default natale

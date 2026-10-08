import type { ThemeModule } from '../types'
import Pennant from './Pennant'
import QuartieriRing from './QuartieriRing'
import PalioScene from './Scene'

/**
 * Palio di San Ranieri (17 giugno): il giorno dopo la Luminara, tramonto sull'Arno e le
 * galee dei quattro quartieri in gara. Ogni giocatore porta la bandierina di uno di loro.
 */
const palio: ThemeModule = {
  Scene: PalioScene,
  TableDecoration: QuartieriRing,
  seatAccessory: ({ index }) => <Pennant index={index} />,
  roomyHeader: true,
}

export default palio

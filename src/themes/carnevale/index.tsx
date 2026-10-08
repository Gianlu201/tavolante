import type { ThemeModule } from '../types'
import Cannons from './Cannons'
import Mask from './Mask'
import CarnivalScene from './Scene'
import StreamerRing from './StreamerRing'

/**
 * Carnevale di Viareggio (tre fine settimana di corsi fino al Martedì grasso): si apre con
 * i tre colpi di cannone, Burlamacco saluta, ogni giocatore ha la sua mascherina.
 */
const carnevale: ThemeModule = {
  Scene: CarnivalScene,
  Overlay: Cannons,
  TableDecoration: StreamerRing,
  seatAccessory: ({ index }) => <Mask index={index} />,
  roomyHeader: true,
}

export default carnevale

import Lampanino from '../pisa/Lampanino'
import LuminiRing from '../pisa/LuminiRing'
import type { ThemeModule } from '../types'
import LuminaraIntro from './Intro'
import LuminaraScene from './Scene'

/**
 * Luminara di San Ranieri (16 giugno): i Lungarni si spengono e si accendono di
 * lampanini, il tavolo è l'Arno di notte con un anello di lumini, a fine serata i fuochi.
 */
const luminara: ThemeModule = {
  Scene: LuminaraScene,
  Overlay: LuminaraIntro,
  TableDecoration: LuminiRing,
  seatAccessory: () => <Lampanino />,
}

export default luminara

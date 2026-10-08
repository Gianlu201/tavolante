import type { ThemeModule } from '../types'
import LifeRing from './LifeRing'
import AugustScene from './Scene'
import Sunglasses from './Sunglasses'

/**
 * Notti d'agosto (dal 9 al 16 agosto): stelle cadenti di San Lorenzo, il tavolo dentro
 * un salvagente, occhiali da sole sulla testa di ogni giocatore.
 */
const agosto: ThemeModule = {
  Scene: AugustScene,
  TableDecoration: LifeRing,
  seatAccessory: () => <Sunglasses />,
}

export default agosto

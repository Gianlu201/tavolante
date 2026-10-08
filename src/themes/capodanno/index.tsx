import type { ThemeModule } from '../types'
import NewYearCountdown from './NewYearCountdown'
import NewYearsEveScene from './Scene'

/** Capodanno: stelline e fuochi d'artificio, poi il conto alla rovescia a mezzanotte. */
const capodanno: ThemeModule = { Scene: NewYearsEveScene, Overlay: NewYearCountdown }

export default capodanno

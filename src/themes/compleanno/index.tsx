import { isCelebrated } from '../../lib/birthdays'
import { clockNow } from '../../lib/seasons'
import type { ThemeModule } from '../types'
import CakeTable from './CakeTable'
import Crown from './Crown'
import BirthdayIntro from './Intro'
import PartyHat from './PartyHat'
import BirthdayScene from './Scene'

/**
 * Compleanno (i giorni di BIRTHDAYS, prima di ogni altro tema): si apre spegnendo le
 * candeline, il tavolo è una torta, cappellini da festa per tutti e la corona per chi
 * compie gli anni, se è seduto al tavolo.
 */
const compleanno: ThemeModule = {
  Scene: BirthdayScene,
  Overlay: BirthdayIntro,
  TableDecoration: CakeTable,
  seatAccessory: ({ index, profile }) =>
    isCelebrated(profile.name, clockNow()) ? <Crown /> : <PartyHat index={index} />,
  roomyHeader: true,
}

export default compleanno

import { useState } from 'react'
import { PODIUM_POINTS, podiumSteps, type Standing, type Tournament } from '../lib/tournament'
import BottomSheet from './BottomSheet'
import { PLACE_BADGE_CLASS } from './placeStyles'
import PlayerAvatar from './PlayerAvatar'

const HINT_CLASS = 'm-0 text-[12.5px] leading-normal text-cream/60'

const PRIMARY_BUTTON_CLASS =
  'w-full cursor-pointer rounded-[13px] bg-[linear-gradient(180deg,var(--color-gold-bright),var(--color-gold))] p-3.25 font-display text-[15.5px] font-bold text-ink disabled:cursor-default disabled:opacity-45'

const SECONDARY_BUTTON_CLASS =
  'w-full cursor-pointer rounded-[13px] border border-cream/20 bg-cream/6 p-3 text-[13.5px] font-semibold text-cream/85 disabled:cursor-default disabled:opacity-40'

const timeFormat = new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' })
const dayFormat = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long' })

const handsLabel = (count: number) => (count === 1 ? '1 mano' : `${count} mani`)

const placingsLabel = (placings: number[]) =>
  placings
    .map((count, place) => (count > 0 ? `${count}× ${place + 1}°` : null))
    .filter(Boolean)
    .join(' · ') || 'nessun piazzamento'

type TournamentDrawerProps = {
  tournament: Tournament | null
  rows: Standing[]
  onStart: () => void
  onUndoLastHand: () => void
  onEnd: () => void
  onDiscard: () => void
  onShowPodium: () => void
  onClose: () => void
}

export default function TournamentDrawer({
  tournament,
  rows,
  onStart,
  onUndoLastHand,
  onEnd,
  onDiscard,
  onShowPodium,
  onClose,
}: TournamentDrawerProps) {
  const [confirmingEnd, setConfirmingEnd] = useState(false)
  const active = tournament !== null && tournament.endedAt === null

  if (!active) {
    const champions = tournament ? podiumSteps(rows)[0] : []
    return (
      <BottomSheet label="Modalità torneo" title="Modalità torneo" onClose={onClose}>
        <p className={HINT_CLASS}>
          A fine mano premi <b className="text-cream">Fine mano</b> e tocca in ordine chi ha
          chiuso 1°, 2° e 3°: prendono {PODIUM_POINTS.join(', ')} punti, gli altri 0. Il primo
          diventa anche il vincitore per la distribuzione successiva. Quando volete chiudere
          la serata, <b className="text-cream">Termina torneo</b> mostra il podio.
        </p>

        {tournament?.endedAt != null && (
          <div className="flex flex-col gap-2.5 rounded-[14px] border border-gold/25 bg-black/20 p-3">
            <span className="font-mono text-[10px] tracking-[0.08em] text-gold/80 uppercase">
              Ultimo torneo · {dayFormat.format(tournament.endedAt)} ·{' '}
              {handsLabel(tournament.hands.length)}
            </span>
            {champions.length > 0 && (
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {champions.map((row) => (
                    <PlayerAvatar
                      key={row.id}
                      name={row.name}
                      avatarId={row.avatarId}
                      className="size-9 border-[1.5px] border-gold text-[11px]"
                    />
                  ))}
                </div>
                <span className="text-[13.5px] text-cream/85">
                  Vinto da{' '}
                  <b className="text-gold-light">
                    {champions.map((row) => row.name).join(' e ')}
                  </b>
                </span>
              </div>
            )}
            <button type="button" className={SECONDARY_BUTTON_CLASS} onClick={onShowPodium}>
              🏆 Rivedi il podio
            </button>
          </div>
        )}

        <button type="button" className={PRIMARY_BUTTON_CLASS} onClick={onStart}>
          {tournament ? 'Inizia un nuovo torneo' : 'Inizia il torneo'}
        </button>
      </BottomSheet>
    )
  }

  const hands = tournament.hands.length

  return (
    <BottomSheet label="Classifica del torneo" title="Classifica" onClose={onClose}>
      <span className="-mt-2 font-mono text-[10.5px] tracking-[0.06em] text-cream/50">
        Iniziato alle {timeFormat.format(tournament.startedAt)} · {handsLabel(hands)}
      </span>

      <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
        {rows.map((row) => {
          const medal = row.points > 0 && row.rank <= PODIUM_POINTS.length
          return (
            <li
              key={row.id}
              className={`flex items-center gap-3 rounded-[14px] border px-3 py-2.25 ${
                medal && row.rank === 1
                  ? 'border-gold/60 bg-gold/12'
                  : 'border-cream/12 bg-black/18'
              }`}
            >
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[11.5px] font-bold ${
                  medal ? PLACE_BADGE_CLASS[row.rank - 1] : 'bg-cream/10 text-cream/70'
                }`}
              >
                {row.rank}
              </span>
              <PlayerAvatar
                name={row.name}
                avatarId={row.avatarId}
                className="size-10 border-[1.5px] border-cream/22 text-[12px]"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[14.5px] font-semibold text-cream">
                  {row.name}
                </span>
                <span className="truncate text-[11.5px] text-cream/50">
                  {placingsLabel(row.placings)} · {handsLabel(row.hands)}
                </span>
              </span>
              <span className="shrink-0 text-right font-mono text-[20px] font-bold text-gold-light">
                {row.points}
                <span className="ml-0.5 text-[10.5px] font-semibold text-gold/70">pt</span>
              </span>
            </li>
          )
        })}
      </ol>

      {hands === 0 && (
        <p className={HINT_CLASS}>
          Nessuna mano registrata: a fine mano premi <b className="text-cream">Fine mano</b>.
        </p>
      )}

      <div className="flex flex-col gap-2 border-t border-cream/10 pt-3">
        <button
          type="button"
          className={SECONDARY_BUTTON_CLASS}
          disabled={hands === 0}
          onClick={onUndoLastHand}
        >
          Annulla l'ultima mano registrata
        </button>
        {hands > 0 ? (
          <button
            type="button"
            className={PRIMARY_BUTTON_CLASS}
            onClick={() => (confirmingEnd ? onEnd() : setConfirmingEnd(true))}
          >
            {confirmingEnd ? 'Tocca di nuovo per terminare' : '🏆 Termina torneo e mostra il podio'}
          </button>
        ) : (
          <button
            type="button"
            className={`w-full cursor-pointer rounded-[13px] border p-3 text-[13.5px] font-semibold ${
              confirmingEnd
                ? 'border-ember bg-ember text-cream'
                : 'border-ember/45 bg-transparent text-ember-soft'
            }`}
            onClick={() => (confirmingEnd ? onDiscard() : setConfirmingEnd(true))}
          >
            {confirmingEnd ? 'Tocca di nuovo per confermare' : 'Annulla il torneo'}
          </button>
        )}
      </div>
    </BottomSheet>
  )
}

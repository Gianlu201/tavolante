import { Fragment, useRef, useState, type ReactNode } from 'react';
import { arrayMove, useSeatDrag } from '../hooks/useSeatDrag';
import { avatarSrc } from '../lib/avatars';
import { profileInitials, type PlayerProfile } from '../lib/settings';
import type { SeatInfo } from '../themes/types';
import { seatPosition } from '../lib/table';
import { PLACE_BADGE_CLASS } from './placeStyles';

const TABLE_CLASS =
  "relative aspect-square w-[min(86vw,46dvh,360px)] rounded-full bg-[radial-gradient(circle_at_50%_40%,var(--color-felt-1),var(--color-felt-2)_70%,var(--color-felt-3)_100%)] shadow-[0_0_0_2px_var(--color-rim),0_0_0_8px_rgba(0,0,0,0.25),inset_0_0_40px_rgba(0,0,0,0.55),0_24px_50px_-12px_rgba(0,0,0,0.6)] before:absolute before:inset-[9%] before:rounded-full before:border before:border-dashed before:border-cream/16 before:content-['']";

const CARD_BACK_CLASS =
  "absolute inset-0 rounded-[14%] border-2 border-gold-light bg-[linear-gradient(135deg,var(--color-deck-1)_0%,var(--color-deck-2)_100%)] shadow-[0_2px_0_rgba(0,0,0,0.3)] after:absolute after:inset-[14%] after:flex after:items-center after:justify-center after:rounded-[10%] after:border after:border-cream/55 after:text-[clamp(10px,3.4vw,16px)] after:leading-none after:text-gold-light after:content-(--deck-emblem)";

const FLYING_CARD_CLASS =
  "pointer-events-none absolute top-1/2 left-1/2 z-4 flex aspect-[0.7/1] w-[9.5%] items-center justify-center rounded-[16%] border-2 border-gold bg-[linear-gradient(135deg,var(--color-cream),var(--color-cream-deep))] opacity-0 shadow-[0_4px_10px_rgba(0,0,0,0.45)] transition-opacity duration-250 [transform:translate(-50%,-50%)] after:text-[60%] after:text-ink after:opacity-75 after:content-['♠']";

/** Geometria e tipografia condivise dai posti reali e dal fantasma trascinato. */
const SEAT_SHAPE_CLASS =
  'absolute flex aspect-square w-[17%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] p-0 font-mono font-semibold select-none';

const SEAT_IDLE_TRANSITION =
  'transition-[background-color,border-color,scale,box-shadow] duration-200 ease-out';

/* Durante il riordino il posto scivola fra le posizioni, quindi la transizione
   copre anche left/top: il puntatore deve poter trascinare senza scrollare. */
const SEAT_EDITING_TRANSITION =
  'cursor-grab touch-none transition-[left,top,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.28,0.64,1)]';

type SeatState = {
  hasAvatar: boolean;
  isWinner: boolean;
  isStart: boolean;
  editing: boolean;
  /** A tournament hand is being recorded, and whether this seat already has its place. */
  recording?: boolean;
  placed?: boolean;
};

/** Precedenza: modifica > registrazione della mano > partenza > vincitore. */
const seatSkin = ({
  hasAvatar,
  isWinner,
  isStart,
  editing,
  recording = false,
  placed = false,
}: SeatState) => {
  const surface = editing
    ? 'border-dashed border-gold bg-gold/14'
    : recording
      ? placed
        ? 'border-gold-light bg-gold/22'
        : 'border-cream/55 bg-cream/12 animate-seat-invite motion-reduce:animate-none'
      : isStart
      ? 'border-gold-light bg-gold'
      : isWinner
        ? 'border-gold bg-gold/22'
        : hasAvatar
          ? 'border-cream/22 bg-black/25'
          : 'border-cream/22 bg-cream/10';

  const ink = isStart
    ? 'text-ink'
    : isWinner
      ? 'text-gold-light'
      : 'text-cream';

  const glow = isStart
    ? 'shadow-[0_0_0_6px_rgba(201,161,90,0.22),0_0_22px_rgba(201,161,90,0.5)]'
    : isWinner
      ? 'shadow-[0_0_0_3px_rgba(201,161,90,0.18)]'
      : '';

  /* Il posto non ritaglia mai: la stellina del vincitore e la matita sporgono
     dal cerchio. È l'avatar a ritagliarsi da solo (clip-path). */
  return `${surface} ${ink} ${glow} overflow-visible`;
};

type CardTableProps = {
  players: number;
  profiles: PlayerProfile[];
  winnerIndex: number;
  startIndex: number | null;
  editing: boolean;
  /** Seat indexes in finishing order while a tournament hand is recorded, else null. */
  finishOrder: number[] | null;
  disabled: boolean;
  onSelectWinner: (index: number) => void;
  onEditPlayer: (index: number) => void;
  onMarkFinish: (index: number) => void;
  onReorder: (from: number, to: number) => void;
  cardRef: React.RefObject<HTMLDivElement | null>;
  /** Seasonal dressing around the felt, painted under the seats. */
  decoration?: ReactNode;
  /** Seasonal touch worn by the seats, the dragged one included. */
  seatAccessory?: (seat: SeatInfo) => ReactNode;
};

export default function CardTable({
  players,
  profiles,
  winnerIndex,
  startIndex,
  editing,
  finishOrder,
  disabled,
  onSelectWinner,
  onEditPlayer,
  onMarkFinish,
  onReorder,
  cardRef,
  decoration,
  seatAccessory,
}: CardTableProps) {
  const recording = finishOrder !== null;
  const tableRef = useRef<HTMLDivElement>(null);
  /** Bumped on every tap of the deck: remounting the cards replays the riffle. */
  const [shuffles, setShuffles] = useState(0);
  const shuffled = shuffles > 0;
  const { drag, consumeClickSuppression, seatHandlers } = useSeatDrag({
    tableRef,
    players,
    enabled: editing && !disabled,
    onReorder,
  });

  // While dragging, everyone else slides into the layout the drop would produce.
  const previewOrder =
    drag && !drag.dropping
      ? arrayMove(
          Array.from({ length: players }, (_, index) => index),
          drag.sourceIndex,
          drag.targetSlot,
        )
      : null;

  const slotOf = (index: number) =>
    previewOrder ? previewOrder.indexOf(index) : index;

  // Once dropped the data is already reordered, so the flying seat is the target one.
  const ghostIndex = drag
    ? drag.dropping
      ? drag.targetSlot
      : drag.sourceIndex
    : null;
  const ghostPosition =
    drag?.dropping === true
      ? seatPosition(drag.targetSlot, players)
      : drag
        ? { x: drag.x, y: drag.y }
        : null;

  return (
    <div className={TABLE_CLASS} ref={tableRef}>
      {decoration}

      <button
        type='button'
        className='absolute top-1/2 left-1/2 z-3 aspect-[0.7/1] w-[15%] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[14%] border-none bg-transparent p-0 disabled:cursor-default'
        disabled={disabled || editing || recording}
        aria-label='Mescola il mazzo'
        onClick={() => {
          setShuffles((count) => count + 1);
          navigator.vibrate?.([8, 140, 8, 140, 14]);
        }}
      >
        <Fragment key={shuffles}>
          <span
            className={`${CARD_BACK_CLASS} translate-x-[1.5px] translate-y-[1.5px] -rotate-3 ${
              shuffled ? 'animate-deck-square motion-reduce:animate-none' : ''
            }`}
          />
          <span
            className={`${CARD_BACK_CLASS} -translate-x-px -translate-y-px rotate-2 ${
              shuffled ? 'animate-riffle-left motion-reduce:animate-none' : ''
            }`}
          />
          <span
            className={`${CARD_BACK_CLASS} ${
              shuffled ? 'animate-riffle-right motion-reduce:animate-none' : ''
            }`}
          />
        </Fragment>
      </button>

      <div className={FLYING_CARD_CLASS} ref={cardRef} />

      {Array.from({ length: players }, (_, index) => {
        const profile = profiles[index];
        const isWinner = index === winnerIndex;
        const hasAvatar = Boolean(profile.avatarId);
        const place = finishOrder ? finishOrder.indexOf(index) : -1;
        const { x, y } = seatPosition(slotOf(index), players);
        const label = profile.name || `Giocatore ${index + 1}`;

        return (
          <button
            key={index}
            type='button'
            className={[
              SEAT_SHAPE_CLASS,
              'z-2 cursor-pointer disabled:cursor-default',
              editing ? SEAT_EDITING_TRANSITION : SEAT_IDLE_TRANSITION,
              'not-disabled:active:scale-94',
              seatSkin({
                hasAvatar,
                isWinner,
                isStart: index === startIndex,
                editing,
                recording,
                placed: place >= 0,
              }),
              index === ghostIndex ? 'opacity-0' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ left: `${x}%`, top: `${y}%` }}
            disabled={disabled}
            aria-pressed={editing || recording ? undefined : isWinner}
            aria-label={
              editing
                ? `Personalizza o trascina ${label}`
                : recording
                  ? place >= 0
                    ? `${label}, ${place + 1}° posto: tocca per correggere`
                    : `Segna ${label} come ${(finishOrder?.length ?? 0) + 1}°`
                  : `${label}${isWinner ? ', vincitore della mano precedente' : ''}`
            }
            onPointerDown={seatHandlers.onPointerDown(index)}
            onPointerMove={seatHandlers.onPointerMove}
            onPointerUp={seatHandlers.onPointerUp}
            onPointerCancel={seatHandlers.onPointerCancel}
            onClick={() => {
              if (consumeClickSuppression()) return;
              if (editing) onEditPlayer(index);
              else if (recording) onMarkFinish(index);
              else onSelectWinner(index);
            }}
          >
            <SeatContent
              profile={profile}
              index={index}
              isWinner={isWinner}
              accessory={seatAccessory?.({ index, profile, profiles })}
            />
            <span
              className={`pointer-events-none absolute -right-0.5 -bottom-0.5 flex aspect-square w-[42%] items-center justify-center rounded-full bg-gold text-[clamp(8px,2.2vw,11px)] text-ink transition-[opacity,scale] duration-180 ease-out ${
                editing ? 'scale-100 opacity-100' : 'scale-40 opacity-0'
              } ${hasAvatar ? 'z-1' : ''}`}
              aria-hidden='true'
            >
              ✎
            </span>
            {place >= 0 && (
              <span
                className={`pointer-events-none absolute -top-1 -left-1 z-1 flex aspect-square w-[46%] animate-place-pop items-center justify-center rounded-full font-mono text-[clamp(9px,2.4vw,12px)] font-bold shadow-[0_2px_6px_rgba(0,0,0,0.4)] motion-reduce:animate-none ${PLACE_BADGE_CLASS[place]}`}
                aria-hidden='true'
              >
                {place + 1}
              </span>
            )}
          </button>
        );
      })}

      {drag && !drag.dropping && (
        <span
          className='pointer-events-none absolute z-1 aspect-square w-[17%] -translate-x-1/2 -translate-y-1/2 animate-drop-slot-pulse rounded-full border-2 border-dashed border-gold bg-gold/12 motion-reduce:animate-none'
          style={{
            left: `${seatPosition(drag.targetSlot, players).x}%`,
            top: `${seatPosition(drag.targetSlot, players).y}%`,
          }}
          aria-hidden='true'
        />
      )}

      {ghostIndex !== null && ghostPosition && (
        <div
          className={[
            SEAT_SHAPE_CLASS,
            'pointer-events-none z-12 cursor-grabbing',
            seatSkin({
              hasAvatar: Boolean(profiles[ghostIndex]?.avatarId),
              isWinner: ghostIndex === winnerIndex,
              isStart: false,
              editing: true,
            }),
            drag?.dropping
              ? 'scale-100 shadow-[0_0_0_0_rgba(201,161,90,0)] transition-[left,top,scale,box-shadow] duration-340 ease-[cubic-bezier(0.22,1.35,0.5,1)]'
              : 'scale-116 animate-seat-lift shadow-[0_12px_26px_rgba(0,0,0,0.5),0_0_0_4px_rgba(201,161,90,0.28)] transition-[left,top] duration-300 ease-[cubic-bezier(0.34,1.28,0.64,1)] motion-reduce:animate-none',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ left: `${ghostPosition.x}%`, top: `${ghostPosition.y}%` }}
          aria-hidden='true'
        >
          <SeatContent
            profile={profiles[ghostIndex]}
            index={ghostIndex}
            isWinner={ghostIndex === winnerIndex}
            accessory={seatAccessory?.({
              index: ghostIndex,
              profile: profiles[ghostIndex],
              profiles,
            })}
          />
        </div>
      )}
    </div>
  );
}

type SeatContentProps = {
  profile: PlayerProfile;
  index: number;
  isWinner: boolean;
  accessory?: ReactNode;
};

function SeatContent({ profile, index, isWinner, accessory }: SeatContentProps) {
  const src = avatarSrc(profile.avatarId);
  const initials = profileInitials(profile.name);

  return (
    <>
      <span
        className={`absolute -top-2.25 text-[12px] transition-[opacity,translate] duration-200 ease-out ${
          isWinner ? 'translate-y-0 opacity-100' : 'translate-y-0.5 opacity-0'
        } ${src ? 'z-1' : ''}`}
        aria-hidden='true'
      >
        ★
      </span>
      {src ? (
        <img
          className='pointer-events-none absolute inset-0 size-full rounded-full object-cover [-webkit-user-drag:none] [clip-path:circle(50%)]'
          src={src}
          alt=''
          draggable={false}
        />
      ) : (
        <span
          className={
            initials
              ? 'text-[clamp(9px,2.7vw,12.5px)] tracking-[0.02em]'
              : 'text-[clamp(12px,3.6vw,16px)] tracking-normal'
          }
        >
          {initials || index + 1}
        </span>
      )}
      {accessory}
    </>
  );
}

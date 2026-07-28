import { useRef, useState } from 'react';
import CardTable from './components/CardTable';
import Controls from './components/Controls';
import Footer from './components/Footer';
import PlayerDrawer from './components/PlayerDrawer';
import { useDealAnimation } from './hooks/useDealAnimation';
import { useSettings } from './hooks/useSettings';
import {
  computeStartSeat,
  directionLabel,
  MIN_PLAYERS,
  resolveDeckSize,
  type Direction,
} from './lib/dealing';
import {
  applyEasterEgg,
  EMPTY_PROFILE,
  type PlayerProfile,
  type Settings,
} from './lib/settings';

const EDIT_TOGGLE_BASE =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-[background-color,border-color,color] duration-180 ease-out disabled:cursor-default disabled:opacity-45';

type Result = {
  startIndex: number;
  winnerIndex: number;
  players: number;
  cards: number;
  direction: Direction;
};

export default function App() {
  const {
    settings,
    update,
    updateProfile,
    reorderPlayers,
    removePlayer,
    reset,
  } = useSettings();
  const cardRef = useRef<HTMLDivElement>(null);
  const { spinning, deal, hideCard } = useDealAnimation(cardRef);
  const [result, setResult] = useState<Result | null>(null);
  const [editing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const cards = resolveDeckSize(settings.deckPreset, settings.customCards);

  const playerName = (index: number) =>
    settings.profiles[index]?.name.trim() || `Giocatore ${index + 1}`;

  const clearResult = () => {
    setResult(null);
    hideCard();
  };

  const handleChange = (patch: Partial<Settings>) => {
    clearResult();
    update(patch);
  };

  const handleReset = () => {
    clearResult();
    setEditing(false);
    setEditIndex(null);
    reset();
  };

  const handleProfileChange = (
    index: number,
    patch: Partial<PlayerProfile>,
  ) => {
    const current = settings.profiles[index] ?? EMPTY_PROFILE;
    updateProfile(index, applyEasterEgg(current, patch));
  };

  const handleReorder = (from: number, to: number) => {
    clearResult();
    reorderPlayers(from, to);
  };

  const handleRemovePlayer = (index: number) => {
    clearResult();
    removePlayer(index);
    setEditIndex(null);
  };

  const toggleEditing = () => {
    setEditIndex(null);
    setEditing((current) => !current);
  };

  const handleDeal = async () => {
    if (spinning) return;
    setResult(null);
    const startIndex = computeStartSeat(
      settings.players,
      cards,
      settings.winnerIndex,
      settings.direction,
    );
    const landed = await deal(startIndex, settings.players, settings.direction);
    if (landed) {
      setResult({
        startIndex,
        winnerIndex: settings.winnerIndex,
        players: settings.players,
        cards,
        direction: settings.direction,
      });
    }
  };

  return (
    <main className='mx-auto flex min-h-dvh w-full max-w-130 flex-col gap-2.5 px-4 pt-[calc(14px+env(safe-area-inset-top,0px))] pb-[calc(14px+env(safe-area-inset-bottom,0px))]'>
      <header className='shrink-0 text-center'>
        <p className='mb-1 font-mono text-[11px] tracking-[0.16em] text-gold/85 uppercase'>
          Tavolante · Murlan
        </p>
        <h1 className='font-display text-2xl font-semibold text-cream'>
          Distributore di{' '}
          <em className='font-medium text-gold-light italic'>carte</em>
        </h1>
      </header>

      <div className='flex shrink-0 justify-center'>
        <button
          type='button'
          className={`${EDIT_TOGGLE_BASE} ${
            editing
              ? 'border-gold-light bg-gold text-ink'
              : 'border-cream/20 bg-cream/5 text-cream/80'
          }`}
          disabled={spinning}
          aria-pressed={editing}
          onClick={toggleEditing}
        >
          {editing ? '✓ Fatto' : '✎ Personalizza giocatori'}
        </button>
      </div>

      <div className='flex min-h-0 flex-1 items-center justify-center py-1'>
        <CardTable
          players={settings.players}
          profiles={settings.profiles}
          winnerIndex={settings.winnerIndex}
          startIndex={result?.startIndex ?? null}
          editing={editing}
          disabled={spinning}
          onSelectWinner={(winnerIndex) => handleChange({ winnerIndex })}
          onEditPlayer={setEditIndex}
          onReorder={handleReorder}
          cardRef={cardRef}
        />
      </div>

      <p
        className='m-0 min-h-8.5 shrink-0 text-center text-[13px] leading-[1.4] text-balance text-cream/60'
        aria-live='polite'
      >
        {spinning ? (
          'La carta gira e rallenta fino al giocatore di partenza…'
        ) : editing ? (
          'Tocca un giocatore per assegnargli un nome o un personaggio.'
        ) : result ? (
          <>
            Con <b className='font-bold text-gold-light'>{result.players}</b>{' '}
            giocatori e{' '}
            <b className='font-bold text-gold-light'>{result.cards}</b> carte in
            senso {directionLabel(result.direction)}, per far arrivare l'ultima
            carta a{' '}
            <b className='font-bold text-gold-light'>
              {playerName(result.winnerIndex)}
            </b>{' '}
            inizia a distribuire da{' '}
            <b className='text-[15px] font-bold text-cream'>
              {playerName(result.startIndex)}
            </b>
          </>
        ) : (
          <>
            Tocca il giocatore che ha vinto la mano precedente: riceverà
            l'ultima carta del mazzo.
          </>
        )}
      </p>

      <Controls
        settings={settings}
        disabled={spinning}
        onChange={handleChange}
        onDeal={handleDeal}
        onReset={handleReset}
      />

      <Footer />

      {editIndex !== null && (
        <PlayerDrawer
          key={editIndex}
          index={editIndex}
          profile={settings.profiles[editIndex] ?? EMPTY_PROFILE}
          canRemove={settings.players > MIN_PLAYERS}
          onChange={(patch) => handleProfileChange(editIndex, patch)}
          onRemove={() => handleRemovePlayer(editIndex)}
          onClose={() => setEditIndex(null)}
        />
      )}
    </main>
  );
}

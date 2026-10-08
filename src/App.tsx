import { useRef, useState } from 'react';
import CardTable from './components/CardTable';
import Controls from './components/Controls';
import Footer from './components/Footer';
import Notice, { type NoticeData } from './components/Notice';
import PlayerDrawer from './components/PlayerDrawer';
import Podium from './components/Podium';
import SeasonLayer from './components/SeasonLayer';
import TournamentDrawer from './components/TournamentDrawer';
import { useDealAnimation } from './hooks/useDealAnimation';
import { useSeason } from './hooks/useSeason';
import { useSettings } from './hooks/useSettings';
import { useTournament } from './hooks/useTournament';
import {
  computeStartSeat,
  directionLabel,
  MIN_PLAYERS,
  resolveDeckSize,
  type Direction,
} from './lib/dealing';
import { seatLabel, type Settings } from './lib/settings';
import { unlockAudio } from './lib/sound';
import { completeOrder, finishersNeeded, standings } from './lib/tournament';
import { useThemeModule } from './themes';

const PILL_BASE =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-[background-color,border-color,color] duration-180 ease-out disabled:cursor-default disabled:opacity-45';

const PILL_ACTIVE = 'border-gold-light bg-gold text-ink';
const PILL_IDLE = 'border-cream/20 bg-cream/5 text-cream/80';

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
    selectWinnerById,
    reset,
  } = useSettings();
  const {
    tournament,
    start: startTournament,
    recordHand,
    undoLastHand,
    end: endTournament,
    discard: discardTournament,
  } = useTournament();
  const { season, greeting } = useSeason();
  const theme = useThemeModule(season);
  const cardRef = useRef<HTMLDivElement>(null);
  const noticeKeyRef = useRef(0);
  const { spinning, deal, hideCard } = useDealAnimation(cardRef);
  const [result, setResult] = useState<Result | null>(null);
  const [editing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  /** Ids of the players tapped so far while closing a tournament hand. */
  const [recording, setRecording] = useState<string[] | null>(null);
  const [tournamentOpen, setTournamentOpen] = useState(false);
  const [podiumOpen, setPodiumOpen] = useState(false);
  const [notice, setNotice] = useState<(NoticeData & { key: number }) | null>(
    null,
  );

  const cards = resolveDeckSize(settings.deckPreset, settings.customCards);
  const tournamentActive = tournament !== null && tournament.endedAt === null;
  const rows = tournament
    ? standings(tournament, tournamentActive ? settings.profiles : [])
    : [];
  const busy = spinning || recording !== null;

  const playerName = (index: number) =>
    seatLabel(settings.profiles[index], index);

  const showNotice = (data: NoticeData) => {
    noticeKeyRef.current += 1;
    setNotice({ ...data, key: noticeKeyRef.current });
  };

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
    setRecording(null);
    reset();
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

  const handleFinishHand = () => {
    clearResult();
    setEditing(false);
    setEditIndex(null);
    setRecording([]);
  };

  const commitHand = (tapped: string[]) => {
    const seated = settings.profiles.map((profile) => profile.id);
    const order = completeOrder(tapped, seated);
    const winnerIndex = seated.indexOf(order[0]);
    const previousWinnerId = settings.profiles[settings.winnerIndex].id;
    const handNumber = (tournament?.hands.length ?? 0) + 1;

    recordHand(order, settings.profiles);
    setRecording(null);
    // Whoever closed first gets the last card of the next deal.
    handleChange({ winnerIndex });
    showNotice({
      text: `Mano ${handNumber} registrata: l'ultima carta andrà a ${playerName(winnerIndex)}.`,
      onUndo: () => {
        undoLastHand();
        clearResult();
        selectWinnerById(previousWinnerId);
      },
    });
  };

  /** Taps fill the places in order; tapping a placed seat takes it and the ones after back. */
  const handleMarkFinish = (index: number) => {
    if (!recording) return;
    const id = settings.profiles[index].id;
    const placed = recording.indexOf(id);
    if (placed >= 0) {
      setRecording(recording.slice(0, placed));
      return;
    }
    const tapped = [...recording, id];
    if (tapped.length < finishersNeeded(settings.players)) setRecording(tapped);
    else commitHand(tapped);
  };

  const handleStartTournament = () => {
    clearResult();
    startTournament(settings.profiles);
    setTournamentOpen(false);
    showNotice({ text: 'Torneo iniziato: a fine mano premi «Fine mano».' });
  };

  const handleEndTournament = () => {
    unlockAudio();
    endTournament(settings.profiles);
    setTournamentOpen(false);
    setPodiumOpen(true);
  };

  const handleShowPodium = () => {
    unlockAudio();
    setTournamentOpen(false);
    setPodiumOpen(true);
  };

  const handleDiscardTournament = () => {
    discardTournament();
    setTournamentOpen(false);
    showNotice({ text: 'Torneo annullato.' });
  };

  const hands = tournament?.hands.length ?? 0;
  const leaders = rows.filter((row) => row.rank === 1 && row.points > 0);

  return (
    <>
      {theme && <SeasonLayer Scene={theme.Scene} />}
      <main
        // Some themes hang decorations from the top edge: leave them some room.
        className={`relative z-1 mx-auto flex min-h-dvh w-full max-w-130 flex-col gap-2.5 px-4 pb-[calc(14px+env(safe-area-inset-bottom,0px))] ${
          theme?.roomyHeader
            ? 'pt-[calc(28px+env(safe-area-inset-top,0px))]'
            : 'pt-[calc(14px+env(safe-area-inset-top,0px))]'
        }`}
      >
        <header className='shrink-0 text-center'>
          <p className='mb-1 font-mono text-[11px] tracking-[0.16em] text-gold/85 uppercase'>
            {theme?.Kicker ? <theme.Kicker /> : (greeting ?? 'Tavolante · Murlan')}
          </p>
          <h1 className='font-display text-2xl font-semibold text-cream'>
            Distributore di{' '}
            <em className='font-medium text-gold-light italic'>carte</em>
          </h1>
        </header>

        <div className='flex shrink-0 flex-wrap justify-center gap-2'>
          <button
            type='button'
            className={`${PILL_BASE} ${editing ? PILL_ACTIVE : PILL_IDLE}`}
            disabled={busy}
            aria-pressed={editing}
            onClick={toggleEditing}
          >
            {editing ? '✓ Fatto' : '✎ Personalizza'}
          </button>
          <button
            type='button'
            className={`${PILL_BASE} ${
              tournamentActive
                ? 'border-gold/60 bg-gold/14 text-gold-light'
                : PILL_IDLE
            }`}
            disabled={busy || editing}
            onClick={() => setTournamentOpen(true)}
          >
            {tournamentActive ? '🏆 Classifica' : '🏆 Torneo'}
          </button>
        </div>

        <div
          className={`flex min-h-0 flex-1 items-center justify-center py-1 ${theme?.tableClassName ?? ''}`}
        >
          <CardTable
            players={settings.players}
            profiles={settings.profiles}
            winnerIndex={settings.winnerIndex}
            startIndex={result?.startIndex ?? null}
            editing={editing}
            finishOrder={
              recording
                ? recording.map((id) =>
                    settings.profiles.findIndex((profile) => profile.id === id),
                  )
                : null
            }
            disabled={spinning}
            onSelectWinner={(winnerIndex) => handleChange({ winnerIndex })}
            onEditPlayer={setEditIndex}
            onMarkFinish={handleMarkFinish}
            onReorder={handleReorder}
            cardRef={cardRef}
            decoration={theme?.TableDecoration && <theme.TableDecoration />}
            seatAccessory={theme?.seatAccessory}
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
          ) : recording ? (
            <>
              Tocca chi ha chiuso{' '}
              <b className='text-[15px] font-bold text-gold-light'>
                {recording.length + 1}°
              </b>
              {recording.length > 0 &&
                ' · tocca di nuovo un giocatore segnato per correggere'}
            </>
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
          ) : tournamentActive && leaders.length > 0 ? (
            <>
              Torneo · {hands === 1 ? '1 mano' : `${hands} mani`} · in testa{' '}
              <b className='font-bold text-gold-light'>
                {leaders.map((row) => row.name).join(' e ')}
              </b>{' '}
              con {leaders[0].points} pt. A fine mano premi «Fine mano».
            </>
          ) : tournamentActive ? (
            <>
              Torneo in corso: a fine mano premi{' '}
              <b className='font-bold text-gold-light'>Fine mano</b> e tocca chi
              ha chiuso 1°, 2° e 3°.
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
          disabled={busy}
          tournamentActive={tournamentActive}
          recording={recording !== null}
          onChange={handleChange}
          onDeal={handleDeal}
          onReset={handleReset}
          onFinishHand={handleFinishHand}
          onCancelRecording={() => setRecording(null)}
        />

        <Footer />

        {editIndex !== null && (
          <PlayerDrawer
            key={editIndex}
            index={editIndex}
            profile={settings.profiles[editIndex]}
            canRemove={settings.players > MIN_PLAYERS}
            onChange={(patch) => updateProfile(editIndex, patch)}
            onRemove={() => handleRemovePlayer(editIndex)}
            onClose={() => setEditIndex(null)}
          />
        )}

        {tournamentOpen && (
          <TournamentDrawer
            tournament={tournament}
            rows={rows}
            onStart={handleStartTournament}
            onUndoLastHand={() => {
              undoLastHand();
              showNotice({ text: 'Ultima mano annullata.' });
            }}
            onEnd={handleEndTournament}
            onDiscard={handleDiscardTournament}
            onShowPodium={handleShowPodium}
            onClose={() => setTournamentOpen(false)}
          />
        )}

        {podiumOpen && tournament?.endedAt != null && (
          <Podium tournament={tournament} onClose={() => setPodiumOpen(false)} />
        )}

        {notice && (
          <Notice
            key={notice.key}
            text={notice.text}
            onUndo={notice.onUndo}
            onDismiss={() => setNotice(null)}
          />
        )}
      </main>
      {theme?.Overlay && <theme.Overlay />}
    </>
  );
}

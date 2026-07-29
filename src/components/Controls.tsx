import { useState } from 'react'
import {
  clamp,
  MAX_CARDS,
  MAX_PLAYERS,
  MIN_CARDS,
  MIN_PLAYERS,
  type DeckPreset,
} from '../lib/dealing'
import type { Settings } from '../lib/settings'

/** The custom entry is not here: its chip turns into the stepper once selected. */
const DECK_PRESETS: { value: DeckPreset; label: string }[] = [
  { value: 54, label: '54' },
  { value: 106, label: '106' },
]

const FIELD_CLASS =
  'flex flex-col gap-1.75 rounded-[14px] border border-cream/14 bg-black/20 px-2.75 py-2.25'

const FIELD_LABEL_CLASS =
  'font-mono text-[10px] tracking-[0.08em] text-gold/80 uppercase'

const STEPPER_BUTTON_CLASS =
  'flex size-8.5 cursor-pointer items-center justify-center rounded-[10px] border border-cream/20 bg-cream/6 text-[18px] leading-none text-cream not-disabled:active:bg-cream/18 disabled:cursor-default disabled:opacity-35'

const CHIP_BASE_CLASS =
  'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-1 py-2.25 text-[12.5px] font-semibold disabled:cursor-default'

const CHIP_ACTIVE_CLASS = 'border-gold bg-gold/18 text-gold-light'
const CHIP_IDLE_CLASS = 'border-cream/16 bg-cream/5 text-cream/75'

const CHIP_ICON_CLASS =
  'size-3.75 fill-none stroke-current stroke-2 [stroke-linecap:round]'

type ControlsProps = {
  settings: Settings
  disabled: boolean
  onChange: (patch: Partial<Settings>) => void
  onDeal: () => void
  onReset: () => void
}

export default function Controls({
  settings,
  disabled,
  onChange,
  onDeal,
  onReset,
}: ControlsProps) {
  const chipClass = (active: boolean) =>
    `${CHIP_BASE_CLASS} ${active ? CHIP_ACTIVE_CLASS : CHIP_IDLE_CLASS}`

  return (
    <section className="flex shrink-0 flex-col gap-2.5 rounded-[20px] border border-gold/18 bg-felt-3/55 p-3.5 backdrop-blur-[6px]">
      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 cursor-pointer rounded-[14px] bg-[linear-gradient(180deg,var(--color-gold-bright),var(--color-gold))] p-3.5 font-display text-[16px] font-bold text-ink shadow-[0_6px_14px_rgba(201,161,90,0.25)] transition-[scale,translate,box-shadow,opacity] duration-120 ease-out not-disabled:active:translate-y-px not-disabled:active:scale-99 not-disabled:active:shadow-[0_3px_8px_rgba(201,161,90,0.2)] disabled:cursor-default disabled:opacity-55"
          disabled={disabled}
          onClick={onDeal}
        >
          Distribuisci le carte
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-[14px] border border-cream/20 bg-cream/6 px-4 py-3.5 text-[13px] font-semibold text-cream/85 not-disabled:active:bg-cream/16 disabled:cursor-default disabled:opacity-55"
          disabled={disabled}
          onClick={onReset}
          aria-label="Ripristina i valori predefiniti"
        >
          Reset
        </button>
      </div>

      <div className={FIELD_CLASS}>
        <span className={FIELD_LABEL_CLASS}>Giocatori</span>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className={STEPPER_BUTTON_CLASS}
            aria-label="Meno giocatori"
            disabled={disabled || settings.players <= MIN_PLAYERS}
            onClick={() => onChange({ players: settings.players - 1 })}
          >
            −
          </button>
          <output className="font-mono text-[18px] font-bold text-cream">
            {settings.players}
          </output>
          <button
            type="button"
            className={STEPPER_BUTTON_CLASS}
            aria-label="Più giocatori"
            disabled={disabled || settings.players >= MAX_PLAYERS}
            onClick={() => onChange({ players: settings.players + 1 })}
          >
            +
          </button>
        </div>
      </div>

      <div className={FIELD_CLASS}>
        <span className={FIELD_LABEL_CLASS}>Carte nel mazzo</span>
        <div className="flex gap-2">
          {DECK_PRESETS.map((preset) => (
            <button
              key={String(preset.value)}
              type="button"
              className={chipClass(settings.deckPreset === preset.value)}
              disabled={disabled}
              aria-pressed={settings.deckPreset === preset.value}
              onClick={() => onChange({ deckPreset: preset.value })}
            >
              {preset.label}
            </button>
          ))}
          {settings.deckPreset === 'custom' ? (
            <CustomCardsField
              value={settings.customCards}
              disabled={disabled}
              onCommit={(customCards) => onChange({ customCards })}
            />
          ) : (
            <button
              type="button"
              className={chipClass(false)}
              disabled={disabled}
              aria-pressed={false}
              onClick={() => onChange({ deckPreset: 'custom' })}
            >
              Personalizzato
            </button>
          )}
        </div>
      </div>

      <div className={FIELD_CLASS}>
        <span className={FIELD_LABEL_CLASS}>Senso di distribuzione</span>
        <div className="flex gap-2">
          <button
            type="button"
            className={chipClass(settings.direction === 'cw')}
            disabled={disabled}
            aria-pressed={settings.direction === 'cw'}
            onClick={() => onChange({ direction: 'cw' })}
          >
            <svg viewBox="0 0 24 24" className={CHIP_ICON_CLASS} aria-hidden="true">
              <path d="M20 12a8 8 0 1 1-2.3-5.6" />
              <path d="M20 4v5h-5" />
            </svg>
            Orario
          </button>
          <button
            type="button"
            className={chipClass(settings.direction === 'ccw')}
            disabled={disabled}
            aria-pressed={settings.direction === 'ccw'}
            onClick={() => onChange({ direction: 'ccw' })}
          >
            <svg viewBox="0 0 24 24" className={CHIP_ICON_CLASS} aria-hidden="true">
              <path d="M4 12a8 8 0 1 0 2.3-5.6" />
              <path d="M4 4v5h5" />
            </svg>
            Antiorario
          </button>
        </div>
      </div>
    </section>
  )
}

type CustomCardsFieldProps = {
  value: number
  disabled: boolean
  onCommit: (value: number) => void
}

const CUSTOM_STEPPER_BUTTON_CLASS =
  'flex size-7.5 shrink-0 cursor-pointer items-center justify-center rounded-[9px] border-none bg-cream/10 text-[17px] leading-none text-gold-light not-disabled:active:bg-cream/22 disabled:cursor-default disabled:opacity-35'

function CustomCardsField({ value, disabled, onCommit }: CustomCardsFieldProps) {
  const [text, setText] = useState(String(value))

  const commit = (next: number) => {
    const clamped = clamp(next, MIN_CARDS, MAX_CARDS)
    setText(String(clamped))
    onCommit(clamped)
  }

  /* Prende il posto del chip "Personalizzato" senza aggiungere una riga: stessa
     altezza dei chip, ma più largo perché contiene input e due pulsanti. */
  return (
    <div className="flex flex-[1.7] items-center gap-0.5 rounded-xl border border-gold bg-gold/18 px-0.75 py-0.5">
      <button
        type="button"
        className={CUSTOM_STEPPER_BUTTON_CLASS}
        aria-label="Meno carte"
        disabled={disabled || value <= MIN_CARDS}
        onClick={() => commit(value - 1)}
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        className="w-full min-w-0 flex-1 border-none bg-transparent p-0 text-center font-mono text-[16px] font-bold text-gold-light [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        min={MIN_CARDS}
        max={MAX_CARDS}
        value={text}
        disabled={disabled}
        aria-label="Numero di carte"
        onChange={(event) => {
          setText(event.target.value)
          const parsed = Number.parseInt(event.target.value, 10)
          if (!Number.isNaN(parsed) && parsed >= MIN_CARDS && parsed <= MAX_CARDS) {
            onCommit(parsed)
          }
        }}
        onBlur={(event) => {
          const parsed = Number.parseInt(event.target.value, 10)
          commit(Number.isNaN(parsed) ? value : parsed)
        }}
      />
      <button
        type="button"
        className={CUSTOM_STEPPER_BUTTON_CLASS}
        aria-label="Più carte"
        disabled={disabled || value >= MAX_CARDS}
        onClick={() => commit(value + 1)}
      >
        +
      </button>
    </div>
  )
}

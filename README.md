# 🃏 Tavolante — Distributore di carte per il Murlan

> **Da chi devo iniziare a distribuire perché l'ultima carta finisca al vincitore?**
> Tavolante risponde in un tocco.

Web app mobile-first, gratuita e installabile, che calcola il giocatore da cui
iniziare la distribuzione affinché **l'ultima carta del mazzo arrivi esattamente al
vincitore della mano precedente** — la regola con cui si distribuisce nel Murlan
(e in molti altri giochi a mazzo intero).

🔗 **[tavolante.vercel.app](https://tavolante.vercel.app/)**

| | |
| --- | --- |
| **Versione** | 1.0.2 |
| **Stack** | React 19 · TypeScript 6 · Vite 8 · Tailwind CSS v4 · PWA |
| **Lingua UI** | Italiano |
| **Offline** | Sì, una volta installata |
| **Backend** | Nessuno — tutto gira nel browser |

---

## Indice

- [Il problema che risolve](#il-problema-che-risolve)
- [Guida all'uso](#guida-alluso)
  - [1. Imposta la partita](#1-imposta-la-partita)
  - [2. Indica chi ha vinto](#2-indica-chi-ha-vinto)
  - [3. Distribuisci](#3-distribuisci)
  - [4. Personalizza i giocatori](#4-personalizza-i-giocatori)
  - [5. Reset](#5-reset)
- [Installare l'app sul telefono](#installare-lapp-sul-telefono)
- [Easter egg](#-easter-egg)
- [La matematica dietro al calcolo](#la-matematica-dietro-al-calcolo)
- [Stack tecnologico](#stack-tecnologico)
- [Architettura del progetto](#architettura-del-progetto)
- [Scelte tecniche interessanti](#scelte-tecniche-interessanti)
- [Sviluppo](#sviluppo)
- [Pipeline degli asset](#pipeline-degli-asset)
- [SEO e anteprime di condivisione](#seo-e-anteprime-di-condivisione)
- [Deploy](#deploy)
- [Crediti](#crediti)

---

## Il problema che risolve

Nel **Murlan** (e in generale in tutti i giochi in cui si distribuisce l'intero
mazzo) vige una convenzione: chi ha vinto la mano precedente deve ricevere
**l'ultima carta**. Il mazziere quindi non può iniziare da chi vuole — deve
partire da un giocatore preciso, che dipende da:

- **quanti giocatori** ci sono al tavolo,
- **quante carte** contiene il mazzo,
- **in che senso** si distribuisce (orario o antiorario),
- **chi** ha vinto la mano precedente.

Farlo a mente ogni mano è scomodo e si sbaglia. Tavolante fa il conto, e lo mostra
con un'animazione: una carta gira intorno al tavolo, rallenta e si ferma sul
giocatore da cui iniziare.

---

## Guida all'uso

L'interfaccia è una schermata sola, pensata per stare in una mano: in alto il
titolo, al centro il **tavolo** con i posti disposti in cerchio, sotto la frase di
stato e il **pannello dei controlli**.

```
┌───────────────────────────────┐
│      TAVOLANTE · MURLAN       │
│    Distributore di carte      │
│                               │
│   [ ✎ Personalizza giocatori ]│
│                               │
│           ①                   │
│      ╭─────────╮              │
│   ④  │   🂠🂠   │  ②   ← tavolo
│      ╰─────────╯              │
│           ③                   │
│                               │
│  «Tocca il giocatore che ha   │
│   vinto la mano precedente»   │
│                               │
│ ┌───────────────────────────┐ │
│ │ [Distribuisci le carte]   │ │
│ │ Giocatori     −   4   +   │ │
│ │ Carte     54 | 106 | Pers.│ │
│ │ Senso   Orario| Antiorario│ │
│ └───────────────────────────┘ │
└───────────────────────────────┘
```

### 1. Imposta la partita

Nel pannello in basso ci sono tre campi:

| Campo | Valori | Note |
| --- | --- | --- |
| **Giocatori** | da **2** a **12** | stepper `−` / `+`; i posti si ridispongono sul tavolo in tempo reale |
| **Carte nel mazzo** | **54**, **106**, o **personalizzato** (1–999) | toccando *Personalizzato* il chip si trasforma nel campo numerico con i suoi stepper |
| **Senso di distribuzione** | **orario** / **antiorario** | il default è antiorario |

Ogni modifica azzera il risultato precedente: la carta sparisce dal tavolo e la
frase di stato torna all'invito iniziale, così non resta mai a schermo un risultato
calcolato con impostazioni diverse da quelle visibili.

**Tutto viene salvato automaticamente** in `localStorage`: chiudendo e riaprendo
l'app ritrovi il tuo tavolo esattamente com'era.

### 2. Indica chi ha vinto

**Tocca sul tavolo il giocatore che ha vinto la mano precedente.** Il posto si
accende con un bordo dorato e compare una **stellina ★** sopra di esso.

### 3. Distribuisci

Premi **«Distribuisci le carte»**: una carta esce dal mazzo al centro, gira intorno
al tavolo per tre giri completi, **rallenta progressivamente** e si ferma sul
giocatore da cui iniziare, che resta evidenziato in oro pieno.

Sotto al tavolo compare la frase riepilogativa completa:

> Con **4** giocatori e **54** carte in senso antiorario, per far arrivare l'ultima
> carta a **Giocatore 1** inizia a distribuire da **Giocatore 2**

Durante l'animazione tutti i comandi sono disabilitati, così non si può cambiare
un'impostazione mentre la carta sta ancora girando.

> ♿ Se il sistema operativo ha attivo **«riduci animazioni»**, l'animazione viene
> saltata: la carta appare direttamente sul posto di partenza.

### 4. Personalizza i giocatori

Il tap semplice su un posto seleziona il vincitore — è l'azione più frequente e
deve costare un solo tocco. Per dare a un giocatore un nome o un personaggio si
entra in **modalità modifica** con il pulsante **«✎ Personalizza giocatori»** in
alto: i posti diventano tratteggiati, compare una matita su ognuno e cambia cosa
fanno il tap e il trascinamento.

In modalità modifica puoi:

- **🏷️ Assegnare un nome** — tocca un posto: si apre un pannello dal basso
  (*drawer*) con il campo nome (max **14 caratteri**). Sul tavolo compaiono le
  **prime 3 lettere maiuscole** del nome (es. `Giovanni` → `GIO`).
- **🎭 Scegliere un personaggio** — nello stesso drawer c'è una griglia di **28
  avatar** illustrati. Se scegli un personaggio, sul tavolo l'immagine ha la
  precedenza sul nome. Il primo riquadro della griglia («nessun personaggio»)
  riporta al nome/numero.
- **🔀 Riordinare i posti** — **trascina** un giocatore su un altro punto del
  cerchio: gli altri scivolano in tempo reale nella disposizione che il rilascio
  produrrebbe, e uno slot tratteggiato pulsa sulla destinazione. Utile quando al
  tavolo vero ci si siede in un ordine diverso da quello inserito. Il vincitore
  selezionato "viaggia" con il giocatore, non con la posizione.
- **🗑️ Rimuovere un giocatore** — in fondo al drawer; richiede **doppia conferma**
  (il pulsante prima chiede «Tocca di nuovo per confermare»). Il tavolo scende di
  un posto. Sotto i 2 giocatori non si può scendere.
- **🧹 Azzerare un giocatore** — cancella nome e personaggio lasciando il posto.

Si esce dalla modalità modifica con **«✓ Fatto»**.

### 5. Reset

Il pulsante **Reset** accanto a «Distribuisci» riporta tutto ai valori predefiniti:
**4 giocatori, 54 carte, senso antiorario, Giocatore 1 vincitore**, nomi e
personaggi cancellati.

---

## Installare l'app sul telefono

Tavolante è una **PWA**: si installa sulla home del telefono e da lì si apre a
schermo intero, senza barra del browser e **senza connessione**.

Il link **«Installa app»** compare **in fondo alla pagina**, nel footer, e solo
quando ha senso mostrarlo — sparisce da solo se l'app è già installata o se il
browser non supporta l'installazione.

| Piattaforma | Come si installa |
| --- | --- |
| **Android** (Chrome, Edge, Samsung Internet) | tocca **Installa app**: si apre il dialogo nativo del browser |
| **iPhone / iPad** (Safari) | tocca **Installa app**: iOS non espone alcun evento di installazione, quindi il pulsante mostra il percorso — **Condividi → Aggiungi alla schermata Home** |
| **Desktop** (Chrome, Edge) | **Installa app**, oppure l'icona di installazione nella barra degli indirizzi |

**Requisito:** serve **HTTPS** (o `localhost`). Da un `file://` o da un IP in HTTP
il service worker non si registra e l'installazione non viene proposta.

**Aggiornamenti:** sono automatici (`registerType: 'autoUpdate'`). Alla riapertura
l'app scarica la versione nuova e si ricarica da sola; le impostazioni vivono in
`localStorage` e sopravvivono all'aggiornamento.

---

## 🥚 Easter egg

Da qualche parte, dentro Tavolante, è nascosto un piccolo easter egg.

Non troverai qui nessun indizio su cosa sia né su come si sblocchi: fa parte del
gioco. Se ci inciampi, te ne accorgerai. 😉

---

## La matematica dietro al calcolo

Tutto il "cervello" dell'app sta in una funzione di **cinque righe**
([`src/lib/dealing.ts`](src/lib/dealing.ts)).

Numerando i posti da `0` a `players - 1` e chiamando `step` il verso di
distribuzione (`+1` orario, `−1` antiorario), la carta **k-esima** (1-based) finisce
al posto:

```
seat(k) = ( start + (k − 1) · step )  mod  players
```

Noi conosciamo il risultato — l'ultima carta (`k = cards`) deve finire al
`winnerIndex` — e cerchiamo l'incognita `start`. Invertendo:

```
start = ( winner − (cards − 1) · step )  mod  players
```

Il modulo di JavaScript restituisce valori negativi per operandi negativi, quindi
la normalizzazione finale è `((raw % players) + players) % players`.

```ts
export const computeStartSeat = (
  players: number,
  cards: number,
  winnerIndex: number,
  direction: Direction,
) => {
  const step = directionStep(direction)
  const raw = winnerIndex - (cards - 1) * step
  return ((raw % players) + players) % players
}
```

**Esempio.** 4 giocatori, mazzo da 54, senso antiorario (`step = −1`), vincitore il
posto `0`:

```
raw   = 0 − 53 · (−1) = 53
start = 53 mod 4 = 1        →  si inizia dal Giocatore 2
```

Verifica: la carta 54 finisce al posto `(1 + 53·(−1)) mod 4 = (1 − 53) mod 4 = 0` ✓

Il calcolo è **istantaneo e indipendente dal numero di carte**: non simula la
distribuzione carta per carta, risolve l'equazione. Con 999 carte costa quanto con 2.

---

## Stack tecnologico

| Tecnologia | Versione | Ruolo nel progetto |
| --- | --- | --- |
| **[React](https://react.dev/)** | 19.2 | UI a componenti, in `StrictMode` |
| **[React Compiler](https://react.dev/learn/react-compiler)** | 1.0 | memoizzazione automatica: nessun `useMemo`/`memo` scritto a mano nel codice |
| **[TypeScript](https://www.typescriptlang.org/)** | ~6.0 | tipizzazione stretta (`noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `verbatimModuleSyntax`) |
| **[Vite](https://vite.dev/)** | 8.1 | dev server e build (bundler **Rolldown**) |
| **[Tailwind CSS](https://tailwindcss.com/)** | 4.3 | **tutto** lo stile, via plugin Vite ufficiale — zero file CSS per componente |
| **[vite-plugin-pwa](https://vite-pwa-org.netlify.app/)** | 1.3 | manifest + service worker Workbox, precache e runtime caching |
| **[Babel](https://babeljs.io/)** + `@rolldown/plugin-babel` | 7.29 | esegue il preset del React Compiler dentro la pipeline Rolldown |
| **[sharp](https://sharp.pixelplumbing.com/)** | 0.35 | script Node offline: avatar WebP, icone PWA, copertina Open Graph |
| **[ESLint](https://eslint.org/)** | 10.6 | `typescript-eslint`, `react-hooks`, `react-refresh` in flat config |

**Nessuna dipendenza di runtime oltre a React e React DOM.** Niente router (è una
schermata sola), niente state manager (basta `useState` + un hook custom), niente
libreria di animazione (l'animazione è scritta a mano su `requestAnimationFrame`),
niente libreria di drag & drop (Pointer Events nativi).

**Peso del bundle di produzione:**

| Asset | Dimensione | Gzip |
| --- | --- | --- |
| JS | 238,7 kB | **79,5 kB** |
| CSS | 71,3 kB | **12,7 kB** |
| Workbox runtime | 5,7 kB | 2,2 kB |
| Precache totale (bundle + icone + avatar WebP) | 628 KiB | — |

---

## Architettura del progetto

```
tavolante/
├── index.html                  # <head> statico: SEO, Open Graph, JSON-LD, font, noscript
├── vite.config.ts              # plugin: react + tailwind + babel(React Compiler) + PWA
├── avatars-src/                # 🖼️ sorgenti a piena risoluzione degli avatar (PNG)
├── docs/
│   └── avatar-prompts.md       # prompt e requisiti per generare nuovi personaggi
├── scripts/                    # 🔧 generatori di asset offline (Node + sharp)
│   ├── build-avatars.mjs       #    avatars-src/*.png → WebP 256×256
│   ├── build-icons.mjs         #    favicon.svg → icone PWA + apple-touch-icon
│   └── build-og.mjs            #    SVG disegnato a codice → og-cover.png 1200×630
├── public/                     # favicon, icone PWA, og-cover, robots.txt, sitemap.xml
└── src/
    ├── main.tsx                # bootstrap React + registrazione service worker
    ├── index.css               # import di Tailwind + @theme (unica sede dei token)
    ├── App.tsx                 # stato di pagina, orchestrazione, frase di stato
    ├── components/
    │   ├── CardTable.tsx       # tavolo, posti, mazzo, carta volante, fantasma del drag
    │   ├── Controls.tsx        # pannello: giocatori, mazzo, senso, distribuisci, reset
    │   ├── PlayerDrawer.tsx    # pannello dal basso: nome, personaggio, azzera, rimuovi
    │   └── Footer.tsx          # copyright, link al sito, invito all'installazione
    ├── hooks/
    │   ├── useSettings.ts      # stato impostazioni + persistenza + riordino/rimozione
    │   ├── useDealAnimation.ts # animazione della carta lungo l'arco del tavolo
    │   ├── useSeatDrag.ts      # drag & drop dei posti con Pointer Events
    │   └── useInstallPrompt.ts # stato del pulsante "Installa app"
    ├── lib/
    │   ├── dealing.ts          # 🧠 regole, limiti e calcolo del posto di partenza
    │   ├── table.ts            # geometria polare dei posti attorno al tavolo
    │   ├── settings.ts         # schema, parsing difensivo e persistenza localStorage
    │   └── avatars.ts          # raccolta degli avatar e composizione della griglia
    └── assets/avatars/         # 🖼️ WebP generati — cartella di output, non toccare a mano
```

### Il flusso dei dati

```
                     ┌──────────────────┐
   localStorage ◄───►│  useSettings()   │  players, deckPreset, customCards,
   tavolante:…:v1    └────────┬─────────┘  direction, winnerIndex, profiles[]
                              │
                              ▼
                     ┌──────────────────┐
                     │      App         │  computeStartSeat(…) → startIndex
                     └───┬────┬────┬────┘
                         │    │    │
        ┌────────────────┘    │    └────────────────┐
        ▼                     ▼                     ▼
   CardTable            Controls              PlayerDrawer
   (tavolo, posti)      (impostazioni)        (nome, personaggio)
        │
        ├─ useSeatDrag()        → riordino dei posti
        └─ useDealAnimation()   → la carta gira e si ferma
```

Lo stato vive tutto in `App` e in `useSettings`: i componenti sono **presentazionali
e controllati**, ricevono dati e callback e non conoscono `localStorage`.

### I moduli chiave

| File | Responsabilità |
| --- | --- |
| [`lib/dealing.ts`](src/lib/dealing.ts) | costanti di dominio (`MIN/MAX_PLAYERS`, `MIN/MAX_CARDS`), tipi `Direction` e `DeckPreset`, `clamp`, `resolveDeckSize` e `computeStartSeat`. **Puro, senza dipendenze** |
| [`lib/table.ts`](src/lib/table.ts) | converte l'indice di un posto in coordinate percentuali: `seatAngleDeg` parte da `−90°` (posto 0 in alto) e `polarToPercent` proietta angolo + raggio su `left`/`top` in `%`. Percentuali, non pixel: il tavolo resta responsive senza ricalcoli |
| [`lib/settings.ts`](src/lib/settings.ts) | schema `Settings`, valori di default, e **parsing difensivo** di quanto letto da `localStorage` |
| [`hooks/useSettings.ts`](src/hooks/useSettings.ts) | le mutazioni non banali: rimuovere un posto, riordinarli, e in entrambi i casi far seguire al `winnerIndex` la **persona**, non l'indice |
| [`hooks/useDealAnimation.ts`](src/hooks/useDealAnimation.ts) | l'animazione, in coordinate polari, cancellabile e `async` |
| [`hooks/useSeatDrag.ts`](src/hooks/useSeatDrag.ts) | drag & drop circolare: soglia tap/drag, slot dall'angolo del puntatore, zona morta centrale, soppressione del click post-drag |

---

## Scelte tecniche interessanti

### 🎯 L'animazione della carta

[`useDealAnimation`](src/hooks/useDealAnimation.ts) non anima da un posto all'altro
in linea retta: dipinge la carta **ogni frame a partire da coordinate polari**
(angolo + raggio), così la traiettoria è un vero **arco** del cerchio dei posti e
non una corda che taglia il tavolo.

La sequenza è: **stacco dal mazzo** (raggio 0 → raggio dei posti, `easeOutCubic`,
280 ms) → **giro** (3 giri completi più i posti necessari a fermarsi su quello
giusto) → **atterraggio** (rientra verso il centro con `easeOutBack`, 420 ms), che
dà il piccolo rimbalzo finale.

Il rallentamento è il dettaglio che fa sembrare la cosa "fisica": il ritardo fra un
posto e il successivo cresce da **28 ms a 460 ms** con una curva di potenza
`progress^3.2` — quindi resta veloce a lungo e frena bruscamente solo alla fine,
come una ruota della fortuna.

Il numero di passi si ricava dalla stessa aritmetica modulare del calcolo:

```ts
const ticks = LOOPS * players + ((((startIndex * step) % players) + players) % players)
```

L'intera animazione è una `Promise` **annullabile**: un contatore `runIdRef`
invalida i frame di una corsa precedente, così cambiare impostazione a metà giro
non lascia due carte che si contendono lo stesso elemento. Con
`prefers-reduced-motion: reduce` l'animazione viene sostituita da un singolo
`paint()` sul posto finale.

### 🔀 Drag & drop dei posti su un cerchio

[`useSeatDrag`](src/hooks/useSeatDrag.ts) usa **Pointer Events nativi** con
`setPointerCapture`, quindi funziona identico con dito, mouse e penna senza
librerie né HTML5 drag-and-drop (che su mobile non esiste).

Tre dettagli che risolvono altrettanti problemi reali:

- **Soglia di 8 px** prima che una pressione diventi trascinamento: sotto quella
  soglia resta un tap che apre il drawer, quindi le due azioni convivono sullo
  stesso gesto iniziale.
- **Slot dall'angolo**: la destinazione non si calcola per sovrapposizione ma
  dall'`atan2` della posizione del dito rispetto al centro — su un cerchio l'angolo
  *è* l'indice. Vicino al centro l'angolo impazzirebbe, quindi una **zona morta**
  del 12% congela l'ultimo slot valido.
- **Soppressione del click**: al rilascio parte comunque un evento `click`;
  `consumeClickSuppression()` lo intercetta una volta sola, altrimenti ogni
  trascinamento aprirebbe anche il drawer.

Il feedback è a tre livelli: gli altri posti **scivolano in anteprima** nella
disposizione che il rilascio produrrebbe, uno slot tratteggiato **pulsa** sulla
destinazione, e un **fantasma** ingrandito segue il dito e poi vola nello slot con
una curva elastica. Sui dispositivi che lo supportano, ogni cambio di slot dà un
`navigator.vibrate(8)`.

### 💾 Persistenza difensiva

`localStorage` è testo arbitrario che l'utente può modificare e che una versione
vecchia dell'app può aver scritto in un altro formato. Per questo
[`parseSettings`](src/lib/settings.ts) **non si fida** di `JSON.parse`: valida ogni
campo uno per uno, arrotonda e limita i numeri nei range consentiti, verifica che
`deckPreset` sia uno dei valori ammessi, tronca i nomi a 14 caratteri e ricade sul
default a ogni dubbio. Anche `winnerIndex` viene ricondotto dentro il numero di
giocatori effettivo.

Tutte e tre le operazioni (`load`, `save`, `clear`) sono in `try/catch`: in modalità
privata o a quota esaurita `localStorage` **lancia**, e l'app deve continuare a
funzionare tenendo le impostazioni solo in memoria.

La chiave è versionata — `tavolante:settings:v1` — così un futuro cambio di schema
incompatibile può convivere con i dati vecchi invece di corromperli.

### 👥 Indici che seguono le persone

Quando si rimuove o si sposta un giocatore, gli indici di tutti gli altri cambiano.
Se `winnerIndex` restasse fermo, il vincitore diventerebbe silenziosamente un'altra
persona. `useSettings` ricalcola l'indice a ogni mutazione perché continui a
puntare **allo stesso giocatore**:

```ts
if (winnerIndex === from) winnerIndex = to
else if (from < winnerIndex && winnerIndex <= to) winnerIndex -= 1
else if (to <= winnerIndex && winnerIndex < from) winnerIndex += 1
```

Simmetricamente, ridurre il numero di giocatori **tronca** l'array dei profili: se
poi si rialza il contatore, il posto che ritorna è vuoto e non resuscita il nome di
chi se n'era andato.

### 🎨 Tailwind v4 e i token nel `@theme`

Non esistono fogli di stile per componente: ogni elemento è stilizzato dalle classi
utility nel proprio JSX. [`src/index.css`](src/index.css) contiene **solo** l'import
di Tailwind e il blocco `@theme` con i token del progetto — colori del feltro, oro,
panna, brace; famiglie `sans` / `display` / `mono`; keyframe delle animazioni — che
Tailwind trasforma in classi come `bg-felt-3`, `text-gold-light`, `font-display` o
`animate-drawer-in`.

Gli stati che in CSS avrebbero richiesto selettori discendenti
(`.table.is-editing .seat`) sono calcolati in TypeScript e restituiti come stringhe
di classi: è il ruolo di `seatSkin()` in
[`CardTable.tsx`](src/components/CardTable.tsx), che risolve la precedenza
**modifica > partenza > vincitore** in una funzione pura invece che nella cascata.

Le classi lunghe e riutilizzate (il feltro del tavolo, il dorso delle carte, la
forma dei posti) sono estratte in costanti in cima al file: la stessa costante veste
sia il posto reale sia il fantasma trascinato, e non possono divergere.

### ♿ Accessibilità

- Ogni posto è un `<button>` reale, raggiungibile da tastiera, con `aria-label`
  descrittivo che cambia fra le due modalità e `aria-pressed` sul vincitore.
- La frase di stato sotto il tavolo è `aria-live="polite"`: chi usa uno screen
  reader sente il risultato senza doverlo cercare.
- Il drawer è `role="dialog"` + `aria-modal`, si chiude con **Esc** o toccando lo
  sfondo.
- `prefers-reduced-motion: reduce` è rispettato su tre livelli: le transizioni CSS
  sono ridotte a `0.01ms` in `@layer base`, le animazioni decorative sono spente con
  `motion-reduce:animate-none`, e l'animazione della carta viene proprio saltata.
- Il campo nome usa `font-size: 16px`, la soglia sotto cui iOS fa zoom automatico
  al focus.

### 📱 Dettagli mobile

`env(safe-area-inset-*)` su padding superiore e inferiore per il notch e la barra
gesture; `100dvh` invece di `100vh` perché la barra degli indirizzi mobile non
tagli il layout; `touch-action: none` sui posti in modalità modifica perché il
trascinamento non faccia scrollare la pagina; `overscroll-none` e
`-webkit-tap-highlight-color: transparent` per togliere il rimbalzo e il flash blu
al tocco; `user-scalable=no` perché lo zoom accidentale rovinerebbe il tavolo.

---

## Sviluppo

**Requisiti:** Node.js ≥ 20 (gli script usano top-level `await` ed ESM), npm.

```bash
git clone <repo>
cd tavolante
npm install
npm run dev          # http://localhost:5173
```

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | dev server Vite con HMR. **Il service worker è attivo** (`devOptions.enabled`), quindi installazione e modalità offline si provano già qui |
| `npm run build` | `tsc -b` (type-check dell'intero progetto) **e poi** build di produzione in `dist/` con generazione del service worker |
| `npm run preview` | serve `dist/` in locale, per verificare la build reale |
| `npm run lint` | ESLint su tutto il progetto |
| `npm run avatars` | rigenera i WebP degli avatar da `avatars-src/` |
| `npm run icons` | rigenera le icone PWA da `public/favicon.svg` |
| `npm run og` | rigenera `public/og-cover.png` |

I tre comandi di asset sono **manuali e non fanno parte della build**: producono
file versionati in git, così un deploy non deve avere `sharp` disponibile.

**Configurazione TypeScript:** project references (`tsconfig.json` →
`tsconfig.app.json` per `src/`, `tsconfig.node.json` per config e script). Target
`ES2023`, `moduleResolution: bundler`, `noEmit` — a emettere ci pensa Vite.

---

## Pipeline degli asset

### 🎭 Avatar

Gli avatar sono semplicemente **i file immagine dentro `src/assets/avatars/`**,
raccolti a build time da `import.meta.glob`. Aggiungerne uno **non richiede di
toccare il codice**: il nome del file senza estensione diventa l'`id` salvato nelle
impostazioni.

```
avatars-src/29-nuovo.png   (1,7 MB, piena risoluzione)
        │
        │  npm run avatars     ← sharp: resize 256×256 cover + WebP q82
        ▼
src/assets/avatars/29-nuovo.webp   (~7 kB)   →  id: "29-nuovo"
        │
        │  import.meta.glob (eager)
        ▼
  compare nella griglia del drawer, in ordine di nome file
```

Il prefisso numerico (`01-`, `02-`, …) serve a controllare l'ordine nella griglia,
che è ordinata sul nome file con collazione italiana e comparazione numerica.

⚠️ **Rinominare** un avatar già in uso lo scollega dai giocatori che l'avevano
scelto: l'`id` salvato non troverebbe più corrispondenza.

Lo script riporta il risparmio ottenuto e **segnala gli orfani** — i `.webp` che non
hanno più un originale in `avatars-src/`. I prompt e i requisiti tecnici per
generare nuovi personaggi coerenti con la serie sono in
[`docs/avatar-prompts.md`](docs/avatar-prompts.md).

### 🔷 Icone

`npm run icons` genera da [`public/favicon.svg`](public/favicon.svg) le quattro
icone che il manifest e iOS richiedono:

| File | Dimensione | Inset | Perché |
| --- | --- | --- | --- |
| `pwa-192.png` | 192×192 | 92% | icona standard |
| `pwa-512.png` | 512×512 | 92% | splash e store |
| `pwa-maskable-512.png` | 512×512 | **70%** | Android ritaglia con maschera circolare/squircle: il disegno deve stare nella zona sicura |
| `apple-touch-icon.png` | 180×180 | 88% | iOS ignora il manifest e arrotonda da sé |

Lo sfondo è tinta piena `#092820` (lo stesso `theme_color`): una PNG trasparente su
Android diventerebbe nera. Vanno rigenerate se cambia il favicon.

### 🖼️ Copertina delle condivisioni

[`scripts/build-og.mjs`](scripts/build-og.mjs) **disegna** un SVG 1200×630 con i
colori del tema — feltro in gradiente, tavolo con i posti e quello di partenza
acceso, due carte, il badge con il dominio — e lo rasterizza con sharp. Nessuno
screenshot da rifare a mano: si rigenera con un comando.

I titoli usano **Georgia** (il fallback di Fraunces dichiarato nel `@theme`) perché
sharp vede solo i font installati nel sistema, non quelli di Google Fonts.

---

## SEO e anteprime di condivisione

WhatsApp, Telegram, Facebook e iMessage **non eseguono JavaScript**: qualsiasi meta
tag impostato da React arriverebbe troppo tardi. Per questo tutto sta **statico
nell'`<head>`** di [`index.html`](index.html), con URL assoluti:

- `title` e `description` costruiti sul nome **Tavolante** più la parola chiave del
  problema («distribuire le carte», «Murlan»);
- **Open Graph** e **Twitter Card** completi di `og:image` 1200×630 con `alt`;
- **JSON-LD** `WebApplication` (nome, categoria, prezzo 0, lingua, `featureList`):
  è quello che dice a Google che «Tavolante» è un'app, non una pagina qualsiasi;
- un `<noscript>` con titolo e descrizione, l'unico contenuto testuale visibile a
  chi non esegue JS;
- `canonical`, `robots`, `theme-color` e i meta `apple-mobile-web-app-*` (iOS ignora
  il manifest: senza quelli l'icona in home aprirebbe Safari con la barra degli
  indirizzi invece dell'app a schermo intero).

**Il dominio è scritto in quattro punti** — `index.html` (canonical, `og:url`,
JSON-LD), [`public/robots.txt`](public/robots.txt),
[`public/sitemap.xml`](public/sitemap.xml) e il badge disegnato in
`scripts/build-og.mjs`. **Se cambia il dominio vanno aggiornati tutti e quattro**, e
va rilanciato `npm run og`.

### Service worker e caching

| Cosa | Strategia |
| --- | --- |
| Bundle, CSS, icone, avatar WebP | **precache** (49 voci, 628 KiB) |
| `og-cover.png` | **escluso** dal precache (`globIgnores`): serve ai crawler, non all'app installata |
| CSS di Google Fonts | `StaleWhileRevalidate` |
| File dei font (`fonts.gstatic.com`) | `CacheFirst`, 30 voci, 1 anno |

Senza il runtime caching dei font l'app installata ripiegherebbe sui font di sistema
appena messa offline — il motivo per cui vale la pena delle sette righe di
configurazione in [`vite.config.ts`](vite.config.ts).

---

## Deploy

Build statica pura: `npm run build` produce `dist/`, servibile da qualsiasi host
statico. Il progetto è pubblicato su **Vercel** senza configurazione aggiuntiva
(framework preset *Vite*).

| Impostazione | Valore |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |
| Variabili d'ambiente | nessuna |

Dopo il primo deploy conviene registrare il sito in
[Google Search Console](https://search.google.com/search-console) e controllare
l'anteprima con il
[debugger di Facebook](https://developers.facebook.com/tools/debug/): le anteprime
restano in cache a lungo, quindi va fatto **prima** di condividere il link in giro.

---

## Crediti

Progettato e sviluppato da **[Gianluca Di Diego](https://www.gianlucadidiego.it)**.

Font: [Fraunces](https://fonts.google.com/specimen/Fraunces),
[Manrope](https://fonts.google.com/specimen/Manrope) e
[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts.

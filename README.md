# Tavolante — Distributore di carte (Murlan)

Web app mobile che calcola da quale giocatore iniziare a distribuire, in modo che
l'ultima carta del mazzo arrivi al vincitore della mano precedente.

L'utente sceglie il numero di giocatori (2–12), la dimensione del mazzo (54, 106 o
un valore personalizzato), il senso di distribuzione (orario/antiorario) e tocca sul
tavolo il giocatore che ha vinto la mano precedente. Una carta gira intorno al tavolo
e rallenta fino a fermarsi sul giocatore da cui iniziare.

Le impostazioni sono salvate in `localStorage`; il pulsante **Reset** riporta tutto ai
valori predefiniti (4 giocatori, 54 carte, senso antiorario, Giocatore 1 vincitore).

## Personalizzare i giocatori

Il tap su un segnaposto seleziona il vincitore in un solo tocco. Per assegnare nome o
personaggio si passa dal pulsante **Personalizza giocatori**: i segnaposti entrano in
modalità modifica e il tap apre un drawer dal basso. Sul tavolo l'avatar ha la
precedenza sul nome, di cui vengono mostrate le prime 3 lettere maiuscole.

Gli avatar sono i file immagine dentro `src/assets/avatars/`, raccolti in automatico
da `import.meta.glob`. Per aggiungerne: copia il PNG originale in `avatars-src/` e
lancia `npm run avatars`, che lo ridimensiona a 256×256 e lo comprime in WebP
(da ~1,7 MB a ~7 kB). Vedi [docs/avatar-prompts.md](docs/avatar-prompts.md) per i
prompt di generazione.

## App installabile (PWA)

L'app è una **PWA**: si installa sul telefono e poi si apre a schermo intero,
senza barra del browser e senza connessione. Il service worker è generato da
[`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) (configurato in
`vite.config.ts`), che precarica il bundle e gli avatar e tiene in cache i font
di Google, altrimenti offline si ripiegherebbe sui font di sistema.

Come si installa:

- **Android / Chrome, Edge**: il pulsante **Installa app** accanto a
  «Personalizza giocatori» apre il dialogo nativo. Il pulsante compare solo
  quando il browser segnala l'app come installabile e sparisce dopo.
- **iPhone / Safari**: iOS non espone alcun evento, quindi lo stesso pulsante
  spiega il percorso — *Condividi → Aggiungi alla schermata Home*.

Serve **HTTPS** (o `localhost`): da un `file://` o da un IP in HTTP il service
worker non si registra e l'installazione non viene proposta. Con `npm run dev`
il service worker è attivo (`devOptions.enabled`), così install e modalità
offline si provano anche in sviluppo.

Gli aggiornamenti sono automatici (`registerType: 'autoUpdate'`): alla riapertura
l'app scarica la versione nuova e ricarica da sola: le impostazioni vivono in
`localStorage` e restano.

### Icone

`npm run icons` rigenera da `public/favicon.svg` le icone PNG richieste dal
manifest (192, 512, una **maskable** 512 con il disegno dentro il 70% centrale
perché Android ritaglia, e l'`apple-touch-icon` da 180). Vanno rigenerate se
cambia il favicon.

## SEO e anteprima nelle condivisioni

Il sito vive su **https://tavolante.vercel.app/**: l'indirizzo è scritto in
`index.html` (canonical, `og:url`, JSON-LD), in `public/robots.txt`, in
`public/sitemap.xml` e nel badge disegnato da `scripts/build-og.mjs`. Se cambia
il dominio vanno aggiornati tutti e quattro (e va rilanciato `npm run og`).

`index.html` contiene, statici nell'`<head>`:

- `title` e `description` costruiti sul nome **Tavolante** più la parola chiave
  del problema («distribuire le carte», «Murlan»);
- **Open Graph** e **Twitter Card** con URL assoluti: WhatsApp, Telegram,
  Facebook e iMessage non eseguono JavaScript, quindi qualsiasi meta impostato
  da React arriverebbe troppo tardi;
- **JSON-LD** `WebApplication` (nome, categoria, prezzo 0, lingua, funzionalità):
  è quello che dice a Google che «Tavolante» è un'app, non una pagina qualsiasi;
- un `<noscript>` con titolo e descrizione, l'unico contenuto testuale visibile a
  chi non esegue JS.

L'immagine di anteprima è `public/og-cover.png` (1200×630), generata da
`npm run og`: [scripts/build-og.mjs](scripts/build-og.mjs) disegna un SVG con i
colori del tema e lo rasterizza con sharp, così si rigenera senza screenshot.
I titoli usano Georgia — il fallback di Fraunces dichiarato in `@theme` — perché
sharp vede solo i font installati nel sistema. L'immagine è esclusa dal precache
del service worker (`globIgnores`): serve ai crawler, non all'app installata.

Dopo il primo deploy conviene registrare il sito in
[Google Search Console](https://search.google.com/search-console) e controllare
l'anteprima con il
[debugger di Facebook](https://developers.facebook.com/tools/debug/) — le
anteprime restano in cache a lungo, quindi va fatto prima di condividere il link
in giro.

## Stile

L'interfaccia è realizzata interamente con **Tailwind CSS v4**: non esistono più fogli
di stile per componente, ogni elemento è stilizzato dalle classi utility nel proprio
JSX. `src/index.css` contiene solo l'import di Tailwind e il blocco `@theme` con i
token del progetto (colori del feltro, oro, panna; famiglie `sans`/`display`/`mono`;
keyframe delle animazioni), che Tailwind trasforma in classi come `bg-felt-3`,
`text-gold-light`, `font-display` o `animate-drawer-in`.

Gli stati che nel CSS dipendevano dalle classi del genitore (`.table.is-editing .seat`)
sono ora calcolati in TypeScript e restituiti come stringhe di classi: vedi `seatSkin()`
in `src/components/CardTable.tsx`.

## Sviluppo

```bash
npm install
npm run dev      # server di sviluppo
npm run build    # type-check + build di produzione
npm run lint
```

## Struttura

- `src/lib/dealing.ts` — regole di distribuzione e calcolo del giocatore di partenza
- `src/lib/table.ts` — geometria polare dei posti attorno al tavolo
- `src/lib/settings.ts` — schema e persistenza delle impostazioni
- `src/hooks/useDealAnimation.ts` — animazione della carta lungo l'arco del tavolo
- `src/hooks/useInstallPrompt.ts` — stato del pulsante di installazione della PWA
- `src/components/` — tavolo e pannello dei controlli
- `src/index.css` — import di Tailwind e token del tema (`@theme`)

# Cartella generata

I file `.webp` qui dentro sono prodotti da `npm run avatars` a partire dalle immagini
originali in `avatars-src/`. Non modificarli a mano: al prossimo run vengono
sovrascritti.

Per aggiungere un personaggio: metti il PNG in `avatars-src/` e lancia `npm run avatars`.

Il nome del file (senza estensione) è l'identificativo salvato nelle impostazioni dei
giocatori, quindi rinominare un avatar già in uso lo scollega dal giocatore che l'aveva
scelto. L'ordine nel drawer è alfabetico/numerico sul nome file: il prefisso numerico
(`01-`, `02-`, …) serve proprio a controllarlo.

## Easter egg

I ritratti senza prefisso numerico (`chiaraRucaj`, `gianlucaDiDiego`, …) **non compaiono
nella griglia di scelta**: si assegnano da soli quando un giocatore viene chiamato col
nome corrispondente. La mappa nome → immagine è in `src/lib/avatars.ts`
(`EASTER_EGG_BY_NAME`): per aggiungerne uno serve l'immagine qui più la voce lì.

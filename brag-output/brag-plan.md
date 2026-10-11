# Tavolante — piano del video (/brag-slim)

## Cos'è, per chi
- **Cosa:** web app gratuita e installabile (PWA) che dice al mazziere da chi iniziare a distribuire perché l'ultima carta arrivi a chi ha vinto la mano precedente (regola del Murlan).
- **Per chi:** chi gioca a Murlan (e a ogni gioco a mazzo intero) con gli amici, col telefono in mano.
- **Cosa la distingue:** risponde in un tocco, con la carta che gira intorno al tavolo e rallenta fino al giocatore giusto; 28 avatar; torneo con podio da condividere; temi che si attivano da soli (Luminara, Palio, Carnevale, Natale…); si installa sulla Home e funziona offline.
- **Claim:** «Tavolante risponde in un tocco» (README).
- **Hook:** la Home di un iPhone, il tocco sull'icona di Tavolante, l'app che si apre a schermo intero e la carta che vortica.

## Angolo e tono
Tono `default` (pulito, giocoso) con un momento `cinematic`: la Luminara a tutto schermo.
Pensato per il telefono: 1080×1920, 30 fps, ~38 s (più dei 20 s standard per richiesta: uso, interfacce, PWA e temi).
Le schermate sono l'app vera: build di produzione registrata frame per frame a 393×852 @3x,
con le safe area di un iPhone in modalità standalone (come quando è installata sulla Home).
Colori e font dell'app: feltro #092820, oro #c9a15a / #ecd8a3, crema #f4ecdd; Fraunces, Manrope, JetBrains Mono.

## Musica e suono
«Happy Beats / Business Moves vol. 9» di ende.app (CC BY 4.0), da 61,61 s della traccia:
il basso entra a 5,77 s, quando la carta si ferma su Bruno; stacco senza basso 20,5–22,6 s mentre salgono i gradini del podio;
il basso rientra sull'oro. Passa-basso sulla musica mentre i Lungarni sono al buio, che si riapre con i lampanini.
Effetti Kenney (CC0): un tick per ogni posto toccato dalla carta, fiches sui piazzamenti, carte che scivolano sul muro dei temi.

## Storyboard
| # | Tempo | Scena | Testo |
|---|---|---|---|
| 1 | 0,00–5,77 | **Hook + PWA.** Home dell'iPhone (meteo di Pisa, dock), tocco sull'icona di Tavolante, apertura a schermo intero; tocco su «Distribuisci le carte», la camera entra nel tavolo, la carta gira e si ferma su Bruno | MURLAN · NUOVA MANO / «Da chi si inizia a *distribuire*?» |
| 2 | 5,77–9,98 | **Reveal.** Il posto di Bruno si accende d'oro; inquadrati tavolo e frase del risultato, poi si torna al telefono | «Tavolante risponde *in un tocco*.» / «L'ultima carta arriva sempre a chi ha vinto la mano.» |
| 3 | 9,98–15,25 | **Come funziona.** Giocatori 4→6, mazzo 106, tocco sul vincitore, Distribuisci | 1 Giocatori e mazzo · 2 Tocca *chi ha vinto* · 3 Distribuisci |
| 4 | 15,25–18,41 | **Personalizza.** Pannello del giocatore: scrive «Leo», sceglie il personaggio; avatar veri che spuntano ai lati | PERSONALIZZA / «Nomi e *28 personaggi* al tavolo.» |
| 5 | 18,41–24,72 | **Torneo.** Fine mano: 1°, 2°, 3° → podio con coriandoli e trombette | MODALITÀ TORNEO / «Punti, classifica e *podio*.» / «Condividi il podio su WhatsApp.» |
| 6 | 24,72–32,09 | **Luminara.** Il telefono si spegne («Si spengono i Lungarni…»), si passa a tutto schermo: i lampanini si accendono e la camera segue l'onda di luce fino a «Luminara di San Ranieri · Pisa · 16 giugno»; il telefono torna con il tavolo blu notte e la carta con la croce pisana | TEMI STAGIONALI / «Si veste a festa *da sola*.» |
| 7 | 32,09–35,25 | **Muro dei temi.** Sei telefoni distribuiti come carte: Natale, Carnevale, Halloween, Palio, Pasqua, San Lorenzo | «Un tema per *ogni festa*.» |
| 8 | 35,25–38,40 | **Outro.** Icona, nome, vantaggi, crediti, indirizzo | Tavolante / Il distributore di carte per il Murlan. / Gratis · Offline · Si installa / Sviluppata da Gianluca Di Diego / tavolante.vercel.app |

Poster (frame 0 e `brag.jpg`): il tavolo a 5,66 s, con la carta che si posa accanto a Bruno, sotto «Da chi si inizia a *distribuire*?» a fuoco.

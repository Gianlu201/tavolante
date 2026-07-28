# Prompt per generare gli avatar dei giocatori

Le immagini generate vanno salvate in **`avatars-src/`** (originali a piena
risoluzione). Poi `npm run avatars` le converte in WebP 256×256 dentro
`src/assets/avatars/`, che è la cartella letta dall'app tramite `import.meta.glob`:
non serve modificare il codice.

Il nome del file diventa l'identificativo salvato nelle impostazioni, quindi **non
rinominare** un avatar già usato.

```
avatars-src/13-aisha.png   (1,7 MB)
        ↓  npm run avatars
src/assets/avatars/13-aisha.webp   (~7 kB)  → id: "13-aisha"
```

## Requisiti tecnici

| Aspetto | Valore |
| --- | --- |
| Formato | PNG (la conversione in WebP la fa `npm run avatars`) |
| Proporzioni | quadrate 1:1 |
| Dimensione | qualunque ≥ 256 px — vengono comunque ridotte a 256×256 |
| Inquadratura | testa e spalle, soggetto centrato con margine — l'immagine viene **ritagliata a cerchio** |
| Sfondo | tinta piena o gradiente semplice, colore diverso per ogni personaggio |
| Nome file | `01-mia.png`, `02-leo.png`, … (numerati: definiscono l'ordine nel drawer) |

> ⚠️ Il ritaglio è circolare: tieni orecchie, capelli e cappelli **dentro** il cerchio,
> non far toccare i bordi al soggetto.

## Prompt base (stile comune a tutta la serie)

Incollalo in Gemini sostituendo `{{PERSONAGGIO}}` e `{{SFONDO}}` con le varianti sotto.

```text
Create a 3D-rendered cartoon character portrait in the style of a modern animated
feature film (Pixar / DreamWorks look): smooth glossy surfaces, soft studio lighting,
subtle rim light, rich saturated colors, high-quality subsurface shading on the skin.

SUBJECT: {{PERSONAGGIO}}

COMPOSITION RULES (strict):
- Exactly ONE character in the image. No second person, no hands or objects entering
  the frame from outside.
- Head-and-shoulders portrait, facing the camera, centered both horizontally and
  vertically.
- Leave generous empty margin on all four sides: the image will be cropped into a
  CIRCLE, so hair, ears, hats and accessories must stay well inside the central area
  and must never touch the edges.
- Square 1:1 aspect ratio, 512x512 px.

STYLE RULES:
- Oversized expressive cartoon eyes, exaggerated friendly features, clean stylized
  proportions with a slightly large head.
- Bold, readable silhouette that still works when displayed very small (50 px).
- Background: {{SFONDO}} — flat color or simple smooth radial gradient only. No
  scenery, no furniture, no patterns, no props behind the character.
- No text, no letters, no numbers, no watermark, no logo, no frame or border,
  no drop shadow outside the character.

Output a single PNG image.
```

### Per mantenere lo stile coerente

Genera **prima** il personaggio n.1. Quando è convincente, per tutti gli altri allega
quell'immagine e aggiungi in coda al prompt:

```text
Use the attached image as the STYLE REFERENCE: match its rendering style, lighting,
level of detail, eye style and overall art direction exactly. Only the character
described above changes.
```

## Le 12 varianti

| # | Nome file | `{{PERSONAGGIO}}` | `{{SFONDO}}` |
| --- | --- | --- | --- |
| 1 | `01-mia.png` | A cheerful teenage girl with long brown hair in a high ponytail, freckles across her nose, thick eyebrows, gold hoop earrings, giving a confident smirk | warm orange |
| 2 | `02-leo.png` | A young man with messy curly dark hair and round oversized glasses, wide open mouth caught mid-laugh, eyes squeezed shut with joy | bright teal |
| 3 | `03-max.png` | A deadpan young man wearing large black sunglasses and a slick side-parted haircut, completely straight face, arms unseen, radiating cool confidence | electric blue |
| 4 | `04-nina.png` | A playful girl with a short bright pink bob haircut, one eye winking, tongue sticking out cheekily, small star sticker on her cheek | hot magenta |
| 5 | `05-bruno.png` | A stout older man with an enormous curled handlebar moustache and extremely bushy eyebrows, raising one eyebrow suspiciously | mustard yellow |
| 6 | `06-zoe.png` | A girl with a huge voluminous afro, large statement earrings, beaming radiant smile with dimples | vivid purple |
| 7 | `07-tom.png` | A blond boy wearing a backwards baseball cap, lopsided goofy grin showing a gap between his front teeth, one cheek puffed | fresh green |
| 8 | `08-rosa.png` | A sweet grandmother with a lilac permed hairdo and half-moon reading glasses perched low on her nose, sly mischievous grin | soft coral pink |
| 9 | `09-merlino.png` | A funny little wizard with a long white beard, an oversized floppy pointed hat covered in stars and crescent moons, wide amazed eyes | deep indigo |
| 10 | `10-sky.png` | A bored-looking girl with electric blue straight hair and chunky headphones around her neck, half-lidded unimpressed expression, chewing gum | cyan |
| 11 | `11-ombra.png` | A cartoon burglar character wearing a black domino eye mask and a striped beanie, one eyebrow raised, smirking guiltily | dark slate grey |
| 12 | `12-pippo.png` | A silly clown-ish man with a wild rainbow-colored frizzy wig and a round red nose, enormous open-mouthed laugh | bright red |

## Serie 2 — personaggi 13-30

Seconda infornata: ragazzi e ragazze, più robot e creature fantasiose. Si usa lo
**stesso prompt base** di sopra, cambiando solo `{{PERSONAGGIO}}` e `{{SFONDO}}`.

> Per la coerenza allega **una delle immagini della serie 1 già approvate** (es.
> `01-mia.png`) come style reference, con la frase riportata sopra. È il modo più
> affidabile per non far scivolare lo stile tra una serie e l'altra.

Per i non-umani (robot, creature) aggiungi in coda al prompt:

```text
The character is not human, but keep the same cartoon art direction: same rendering
style, same oversized expressive eyes, same friendly appeal, same lighting. It must
look like it belongs to the same character set as the reference image.
```

| # | Nome file | `{{PERSONAGGIO}}` | `{{SFONDO}}` |
| --- | --- | --- | --- |
| 13 | `13-aisha.png` | A girl with long box braids gathered over one shoulder, oversized round nerdy glasses, warm confident closed-lip smile | turquoise |
| 14 | `14-vito.png` | A skater boy with messy mint-green dyed hair, a small bandage on his cheek, cocky lopsided grin | lime green |
| 15 | `15-bullone.png` | A boxy vintage tin robot with a single spring antenna, riveted metal panels, two big round glowing bulb eyes, a friendly painted grin | rust orange |
| 16 | `16-pixel.png` | A sleek modern round-headed robot with a glossy white shell and a wide dark visor screen showing two cyan pixel-heart eyes | steel blue |
| 17 | `17-zork.png` | A goofy little green alien with three eyes on short stalks, two tiny antennae and a wide toothy grin | deep violet |
| 18 | `18-yeti.png` | A fluffy pale-blue yeti creature with shaggy fur, small horns and a shy sweet smile showing two little fangs | icy pale blue |
| 19 | `19-sara.png` | A sporty girl with a high messy bun and a bright headband, small towel over one shoulder, energetic determined grin | amber yellow |
| 20 | `20-kofi.png` | A young man with long dreadlocks tied back and large retro over-ear headphones, calm cool half-smile | burgundy |
| 21 | `21-drago.png` | A chubby baby dragon with rounded emerald scales, tiny useless wings, a puff of smoke escaping one nostril, delighted grin | peach |
| 22 | `22-luna.png` | A goth girl with straight dark-purple hair and blunt bangs, heavy eyeliner, black choker, deadpan unimpressed stare | plum |
| 23 | `23-enzo.png` | A hipster man with a thick well-groomed beard, a small flat cap and suspenders, raising his eyebrows knowingly | olive |
| 24 | `24-aureo.png` | A retro golden robot butler with an art-deco domed head, monocle-like lens over one eye, dignified polite expression | dark teal |
| 25 | `25-bu.png` | A small round cartoon ghost, soft glowing white body with a wobbly bottom edge, tiny arms up, playfully spooky open-mouthed smile | midnight navy |
| 26 | `26-amira.png` | A cheerful young woman wearing a brightly patterned hijab, big warm smile with dimples, small gold nose stud | rose pink |
| 27 | `27-ragnar.png` | A comedic stout viking with a huge red braided beard and a horned helmet slightly too small for his head, hearty open-mouthed laugh | sand beige |
| 28 | `28-blaze.png` | A young man with a platinum-blond afro, mirrored aviator sunglasses and a gold tooth flashing in a wide confident smile | crimson |

### Spunti non ancora generati

Due personaggi della lista iniziale sono rimasti fuori: riprendili quando vuoi
ampliare la serie, numerandoli dal 29 in poi.

| Nome | `{{PERSONAGGIO}}` | `{{SFONDO}}` |
| --- | --- | --- |
| `milo` (gatto) | An elegant anthropomorphic cat with sleek grey fur, a crisp bow tie and a smug half-closed-eyes expression | forest green |
| `otto` (polpo) | A friendly cartoon octopus with a big round purple head, tentacles curling at the bottom of the frame, wearing tiny reading glasses | sea green |

## Dopo la generazione

1. Copia i PNG in `avatars-src/`.
2. Lancia `npm run avatars`: ridimensiona a 256×256 e comprime in WebP dentro
   `src/assets/avatars/` (da ~1,7 MB a ~7 kB per immagine, senza perdita visibile
   alle dimensioni a cui l'app li mostra).
3. Ricarica l'app: gli avatar compaiono nel drawer del giocatore.

Lo script avvisa se in `src/assets/avatars/` restano file senza più un originale in
`avatars-src/`, così te ne accorgi invece di trovarti avatar fantasma nel drawer.

# Animation de présentation : balsamique Bronzo

Vinaigre balsamique de Modène IGP bio, Série Bronzo 250 ml (Santa Caterina de Guerzoni), campagne *Natale Nostro*.

## Livrables (`export/`)

| Fichier | Usage |
|---|---|
| `bronzo-20s-9x16.mp4` | Reel Instagram et Facebook, story |
| `bronzo-20s-1x1.mp4` | Post fil d'actualité |
| `bronzo-20s-16x9.mp4` | Site (fiche produit, page Noël), YouTube |
| `bronzo-6s-9x16.mp4` | Story ou publicité courte |
| `bronzo-6s-1x1.mp4` | Publicité courte en fil d'actualité |
| `bronzo-email.gif` | Email Brevo (400 px, ~1 Mo) |

Vidéos muettes : ajoutez la musique dans Instagram ou Facebook (bibliothèque sous licence) ou au montage.

## Déroulé (version 20 s)

| Temps | Scène | Texte |
|---|---|---|
| 0 à 2 s | Une goutte de balsamique tombe, ondes dorées à l'impact | – |
| 2 à 5 s | La bouteille surgit de la nappe dans un halo | **Bronzo** · Vinaigre balsamique de Modène IGP · Bio |
| 5 à 8 s | Zoom sur l'étiquette, reflet lumineux, fûts flous en fond | *10 ans d'excellence* |
| 8 à 11 s | Trois pictos | Bio · Modène IGP · Vieilli en fût |
| 11 à 15 s | Burrata, fraises, parmesan : un filet de balsamique se dessine | *Sur la burrata, les fraises, le parmesan…* |
| 15 à 18 s | La bouteille descend dans le coffret kraft, le ruban se noue | Dans le coffret *Tavola di Natale* |
| 18 à 20 s | Plan final | SOLENOSTRO · Natale Nostro · solenostro.fr · [Découvrir le coffret] |

La version 6 s enchaîne la goutte, la bouteille et le plan final.

## ⚠️ Avant diffusion

- **La bouteille est un visuel provisoire** dessiné en SVG. Elle ne reproduit pas l'étiquette réelle de Guerzoni. Remplacez-la par la photo détourée du produit : dans `index.html`, élément `<svg id="bottle">`, par une `<image>` PNG au format 1:3.
- **« 10 ans d'excellence »** reprend le nom du produit sur solenostro.fr. Faites valider la mention par le producteur : la réglementation IGP encadre les mentions de vieillissement.
- Aucun prix n'est affiché.

## Modifier et refaire le rendu

```bash
# aperçu dans le navigateur
open "index.html?w=1080&h=1920"            # boucle 20 s
open "index.html?w=1080&h=1080&t=13.5"     # image figée à 13,5 s
open "index.html?w=1080&h=1920&mode=short" # version 6 s

# rendu (Node + Playwright + ffmpeg)
node render.mjs          # les 5 vidéos dans export/
node render.mjs short    # seulement les versions 6 s
node render.mjs stills   # images de contrôle
# GIF email :
ffmpeg -i export/bronzo-6s-1x1.mp4 -vf "fps=10,scale=400:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=4" export/bronzo-email.gif
```

Les durées des scènes se règlent dans la fonction `renderLong(t)` de `index.html`.

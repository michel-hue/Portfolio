# Maquettes du portfolio — « Portfolio archange. »

Ces fichiers sont la **référence visuelle** du nouveau site. Ils proviennent de l'artefact Claude Design « Portfolio archange. » (5 écrans, 1440px de large). Reproduis-les fidèlement dans Next.js, en données réelles.

| Écran | Maquette | Capture | Route Next.js |
|---|---|---|---|
| Accueil | `maquettes/Main.dc.html` | `captures/Main.png` | `/` |
| Projets | `maquettes/Projets.dc.html` | `captures/Projets.png` | `/projets` |
| Projet — détail | `maquettes/Projet.dc.html` | `captures/Projet.png` | `/projets/[slug]` |
| À propos | `maquettes/APropos.dc.html` | `captures/APropos.png` | `/a-propos` |
| Contact | `maquettes/Contact.dc.html` | `captures/Contact.png` | `/contact` |

## Comment lire les maquettes

- C'est du HTML avec des **styles en ligne** : ils donnent les mesures exactes (tailles, espacements, rayons, couleurs). Reprends ces valeurs, mais écris-les avec les **variables de la charte** (`charte/code/tokens.css`) et non en dur. Correspondances : `#1f1c19` = `--bg`, `#26221e` = `--surface`, `#2d2924` = `--surface-raised`, `#3a352f` = `--line`, `#7f766c` = `--line-strong`, `#efe9e1` = `--ink`, `#b7aea3` = `--ink-muted`, `#9e958a` = `--ink-subtle`, `#e3997e` = `--accent`, `#3d2b22` = `--accent-soft`, `#2a150c` = `--on-accent`, `#f2a39b` = `--danger` (valeurs du thème sombre).
- Les balises `<x-dc>`, `<helmet>`, `<sc-for>`, `<sc-if>`, les `{{…}}` et le `<script type="text/x-dc">` appartiennent à l'outil de maquettage : ce sont des boucles, des conditions et l'état du prototype. Traduis-les en composants React. Ne les recopie pas et ignore `support.js` (absent).
- Le bloc `<style>` de chaque maquette donne les **états de survol, de focus et les animations** (`.btn-primary`, `.btn-ghost`, `.card`, `.chip`, `.field`, `.dot`, `.rise`).
- Le texte entre crochets (`[Nom du projet]`, `[Ton portrait]`, `[ton@email.com]`…) est un emplacement : il vient de la base de données ou des réglages du profil.
- Les captures montrent le rendu statique. Le point final des titres est animé (il apparaît en dernier) et les blocs `.rise` glissent à l'arrivée.

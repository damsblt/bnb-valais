# BnB Valais — Refonte Next.js

Refonte du site [bnb-valais.ch](https://bnb-valais.ch/) en **Next.js 16 + React 19 + Tailwind CSS 4**.

## Recommandation technique

**Next.js + Tailwind** (les deux) :

- **Next.js** : rendu statique/SSR, SEO, optimisation images, routing FR/EN
- **Tailwind CSS** : styles maintenables, responsive, fidèle au design Elementor sans dépendance WordPress

## Démarrage

```bash
cd web
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Pages

| Route FR | Route EN | Contenu |
|----------|----------|---------|
| `/` | `/en` | Accueil |
| `/reservations` | `/en/reservations` | Tarifs + formulaire Typeform |
| `/chambres` | `/en/chambres` | Présentation des chambres + lien vers le formulaire |

## Réservations

Les demandes de réservation passent **uniquement** par le formulaire Typeform sur la page `/reservations` (comme sur le site actuel). Booking.com reste géré séparément via l’extranet Booking.

## Contenu extrait

- Textes FR/EN depuis l’API WordPress et le HTML public
- 12 images téléchargées dans `public/images/`
- Carte Google Maps (BnB La Sittelle)
- Formulaire Typeform (`01JN38VBCPQKPJFGQK77ZR4JDG`)

## À compléter (optionnel)

1. **Clé Google Maps** — migrer vers une variable d’environnement (`NEXT_PUBLIC_GOOGLE_MAPS_KEY`)
2. **Analytics** — GTM / GA si souhaité (`GTM-MHTV6SCJ`, `G-ZC0CT5BB2Z`)

## Déploiement (GitHub + Vercel)

1. Pousser le code sur GitHub
2. Importer le dépôt sur [vercel.com/new](https://vercel.com/new)
3. Configurer le domaine `bnb-valais.ch` dans Vercel → Settings → Domains
4. Chez **Infomaniak** (DNS du domaine, sans hébergement web) :
   - **A** `@` → `76.76.21.21`
   - **CNAME** `www` → `cname.vercel-dns.com`

La propagation DNS prend en général 15 min à 24 h.


```
web/src/
├── app/           # Routes Next.js (FR + /en)
├── components/    # UI React
└── lib/           # Contenu i18n + traductions
```

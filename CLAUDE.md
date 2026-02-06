# CLAUDE.md — ImmoJuste

## Présentation

ImmoJuste est une plateforme technologique belge de matching immobilier. Elle met en relation des acheteurs qualifiés avec des vendeurs et agents immobiliers, sans être une agence immobilière (conformité IPI).

**Principe** : L'acheteur crée un profil avec ses critères → l'algorithme le matche avec des biens → le vendeur paie 79€ TTC pour activer un espace d'échange privé avec un acheteur.

---

## Stack technique

| Technologie | Version | Usage |
|---|---|---|
| Next.js | 16.1.6 | Framework fullstack (App Router) |
| React | 19.2.3 | UI |
| TypeScript | 5.x | Typage |
| Tailwind CSS | 4.x | Styling (attention : config via `@theme` dans CSS, pas `tailwind.config.ts`) |
| Prisma ORM | 5.22 | ORM + migrations |
| PostgreSQL | 16 (Docker) | Base de données |
| NextAuth | 4.24 | Authentification (OTP, pas de mot de passe) |
| Stripe | 20.x | Paiements (79€/unlock vendeur, abonnements agents) |
| Resend | 6.x | Emails transactionnels |
| Zod | 4.3.6 | Validation de schemas |
| react-hook-form | 7.x | Gestion de formulaires |
| class-variance-authority | 0.7 | Variants pour composants UI |
| lucide-react | 0.563 | Icônes |

---

## Setup environnement

### Prérequis

- Node.js 20+
- Docker (pour PostgreSQL)
- npm

### Installation

```bash
cd poc/

# 1. Installer les dépendances
npm install

# 2. Lancer PostgreSQL via Docker
docker compose up -d

# 3. Copier le fichier .env (voir section Variables d'environnement)
cp .env.example .env  # ou créer manuellement

# 4. Appliquer le schéma Prisma
npx prisma db push

# 5. Générer le client Prisma
npx prisma generate

# 6. Lancer le serveur de dev
npm run dev
```

L'app tourne sur **http://localhost:4000**.

### Variables d'environnement (.env)

```env
# Database — PostgreSQL via Docker sur port 5433
DATABASE_URL="postgresql://immojuste:immojuste_local_pwd@localhost:5433/immojuste?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:4000"
NEXTAUTH_SECRET="immojuste-dev-secret-change-in-production-abc123xyz"

# Stripe (clés de test)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend (emails)
RESEND_API_KEY="re_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:4000"
```

### Docker Compose (PostgreSQL)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: immojuste_db
    environment:
      POSTGRES_USER: immojuste
      POSTGRES_PASSWORD: immojuste_local_pwd
      POSTGRES_DB: immojuste
    ports:
      - "5433:5432"   # ⚠️ Port 5433, pas 5432
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### Mode développement — Raccourcis

- **OTP** : En `NODE_ENV=development`, le code OTP est toujours `111111` et l'email n'est pas envoyé (log console).
- **Prisma** : Utiliser `npx prisma db push` au lieu de `prisma migrate dev` (terminal non-interactif).
- **Stripe** : Non requis pour le dev basique. Les matches peuvent être débloqués manuellement en DB.

---

## Structure du projet

```
poc/
├── prisma/
│   └── schema.prisma            # Schéma complet (18 modèles)
├── public/
│   └── logo-immojuste.jpeg      # Logo officiel
├── src/
│   ├── app/
│   │   ├── globals.css          # ⚠️ Tailwind CSS 4 : @theme, @utility, @keyframes
│   │   ├── layout.tsx           # Root layout (SessionProvider)
│   │   ├── page.tsx             # Landing page
│   │   ├── acheteur/page.tsx    # Page marketing acheteurs
│   │   ├── vendeur/page.tsx     # Page marketing vendeurs
│   │   ├── agent/page.tsx       # Page marketing agents
│   │   ├── auth/
│   │   │   ├── login/page.tsx   # Ouvre SecureAccessSheet
│   │   │   └── register/page.tsx # Redirect → /onboarding/acheteur
│   │   ├── onboarding/
│   │   │   ├── layout.tsx       # Layout léger (logo + lien connexion)
│   │   │   ├── acheteur/page.tsx # Formulaire multi-step acheteur (pré-auth)
│   │   │   ├── vendeur/page.tsx  # Formulaire multi-step vendeur (pré-auth)
│   │   │   └── agent/page.tsx    # Formulaire multi-step agent (pré-auth)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx       # Sidebar + topbar (auth required)
│   │   │   ├── page.tsx         # Redirect selon rôle
│   │   │   ├── buyer/           # Pages acheteur (dashboard, profile, matches, notifications)
│   │   │   ├── seller/          # Pages vendeur (dashboard, property, matches, notifications)
│   │   │   └── agent/           # Pages agent (dashboard, leads, profile, subscription)
│   │   ├── legal/               # CGV, confidentialité, cookies
│   │   └── api/                 # Routes API (voir section dédiée)
│   ├── components/
│   │   ├── auth/
│   │   │   └── secure-access-sheet.tsx  # Modale OTP (email → code 6 chiffres)
│   │   ├── layout/
│   │   │   ├── header.tsx       # Header public (nav + auth buttons)
│   │   │   └── footer.tsx       # Footer (liens, contact, légal)
│   │   ├── providers.tsx        # SessionProvider wrapper
│   │   └── ui/                  # Composants UI réutilisables
│   │       ├── button.tsx       # Button avec variants (CVA)
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── textarea.tsx
│   │       ├── checkbox.tsx
│   │       ├── badge.tsx
│   │       ├── modal.tsx
│   │       └── progress.tsx
│   ├── hooks/
│   │   └── use-onboarding-draft.ts  # Sauvegarde localStorage + API (debounce 500ms)
│   ├── lib/
│   │   ├── auth.ts              # NextAuth config (OTP CredentialsProvider)
│   │   ├── email.ts             # Templates Resend (OTP, welcome, match, unlock, payment)
│   │   ├── matching.ts          # Algorithme de matching (score 0-100, grades A/B/C)
│   │   ├── onboarding-schemas.ts # Schemas Zod pour les 3 formulaires
│   │   ├── prisma.ts            # Singleton Prisma client
│   │   ├── stripe.ts            # Config Stripe + prix (79€ unlock, abos agent)
│   │   ├── utils.ts             # cn() helper (clsx + tailwind-merge)
│   │   └── zod-helpers.ts       # safeNum() / safeNumOptional() pour Zod v4
│   └── types/
│       └── next-auth.d.ts       # Extension types NextAuth (role, id)
├── docker-compose.yml
├── package.json
├── tailwind.config.ts           # Config étendue (couleurs, shadows — Tailwind 4 legacy)
├── tsconfig.json
└── next.config.ts
```

---

## Routes API

| Route | Méthode | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler (session, CSRF, etc.) |
| `/api/auth/otp/send` | POST | Envoie un code OTP 6 chiffres par email |
| `/api/auth/otp/verify` | POST | Vérifie le code OTP. Si nouveau → crée le compte depuis le draft |
| `/api/onboarding/draft` | GET/POST | Sauvegarde/récupère le brouillon d'onboarding (JSON, TTL 7 jours) |
| `/api/buyers/profile` | GET/PUT | Profil acheteur (critères, budget, zones) |
| `/api/sellers/profile` | GET/PUT | Profil vendeur |
| `/api/properties` | GET/POST | Gestion des biens |
| `/api/properties/[id]` | GET/PUT/DELETE | CRUD bien individuel |
| `/api/matches` | GET | Liste des matches (filtrés par rôle) |
| `/api/matches/[id]/unlock` | POST | Déclenche le paiement Stripe 79€ pour activer l'espace d'échange |
| `/api/agents/profile` | GET/PUT | Profil agent |
| `/api/agents/leads` | GET | Leads qualifiés pour l'agent |
| `/api/payments/create-checkout` | POST | Crée une session Stripe Checkout |
| `/api/webhooks/stripe` | POST | Webhook Stripe (confirme paiement, débloque match) |

---

## Authentification (OTP)

**Pas de mot de passe.** L'auth fonctionne par code OTP envoyé par email.

### Flow

1. L'utilisateur entre son email dans `SecureAccessSheet`
2. `POST /api/auth/otp/send` → génère un code 6 chiffres, TTL 10 min, rate limit 3/email/15min
3. L'utilisateur entre le code
4. `POST /api/auth/otp/verify` → vérifie le code
   - **Si l'utilisateur existe** → crée une session NextAuth
   - **Si l'utilisateur n'existe pas** → cherche un `OnboardingDraft`, crée le User + profil associé, supprime le draft, envoie email de bienvenue, crée la session

### Config NextAuth (`src/lib/auth.ts`)

- Provider : `CredentialsProvider` custom (OTP)
- Adapter : `PrismaAdapter`
- Session strategy : `jwt`
- Callbacks : `jwt` (ajoute role + id) et `session` (expose role + id)

---

## Onboarding (pré-auth)

Les formulaires d'inscription sont accessibles **AVANT** connexion. L'utilisateur remplit tout, puis s'authentifie via OTP.

### Flow

1. Visiteur va sur `/onboarding/acheteur` (ou `/vendeur`, `/agent`)
2. Remplit un formulaire multi-step (3-4 étapes)
3. Les données sont sauvegardées en temps réel :
   - **localStorage** (debounce 500ms, via `use-onboarding-draft.ts`)
   - **API** (`POST /api/onboarding/draft`) quand l'email est renseigné
4. À la dernière étape, `SecureAccessSheet` s'ouvre avec l'email pré-rempli
5. L'OTP verify crée le compte depuis le draft

### Champs par formulaire

**Acheteur** : nom, email, téléphone, budget (min/max), types de bien, zones (communes), chambres, surface, timing, financement, must-have, dealbreakers, consentements

**Vendeur** : nom, email, téléphone, type de bien, commune, surface, chambres, état, prix, négociable (oui/non), disponibilités visites, timing, lien Immoweb, caractéristiques, consentements

**Agent** : nom, email, téléphone, agence, n° IPI (obligatoire), zones, spécialités, consentements

---

## Algorithme de matching (`src/lib/matching.ts`)

Score de 0 à 100 calculé sur 6 critères :

| Critère | Points max | Logique |
|---|---|---|
| Localisation | 30 | Commune/code postal match avec zones acheteur |
| Budget | 25 | Prix dans le budget → 25pts. Déviation <10% → 15pts. <20% → 5pts |
| Timing | 15 | Compatible si ≤1 step d'écart ou vendeur plus flexible |
| Critères (type, chambres, surface) | 20 | 10pts type + 5pts chambres + 5pts surface |
| Must-have bonus | 10 | 3pts par critère trouvé dans features du bien |
| Dealbreakers | -100 | Éliminatoire si un dealbreaker matche une contrainte |

**Grades** : A (≥80), B (≥60), C (≥40). En dessous de 40 = non compatible.

---

## Pricing

### Vendeur : 79€ TTC par activation

- Un seul prix : **79€ TTC** par "activation d'espace d'échange privé"
- Pas de packs, pas d'abonnement
- Le vendeur voit un acheteur compatible → clique "Activer l'espace d'échange — 79€" → Stripe Checkout → webhook confirme → match débloqué

### Agent : Abonnements mensuels

| Tier | Prix | Leads/mois | Zones |
|---|---|---|---|
| Essentiel | 99€ | 10 | 3 |
| Pro | 199€ | 30 | 10 |
| Premium | 349€ | 100 | Illimitées |

---

## Système de couleurs (Tailwind CSS 4)

### Palette — Règle 95-5%

- **Navy `#2B3A5A`** (95%) : texte, headers, sidebar, sections sombres, fond dark
- **Green `#5AAE85`** (5%) : CTAs, boutons principaux, badges, accents, indicateurs

### Configuration critique — Tailwind CSS 4

⚠️ **Tailwind CSS 4 utilise `@theme` dans `globals.css`**, pas `tailwind.config.ts` pour les valeurs custom.

Les valeurs custom sont définies dans `src/app/globals.css` :

```css
@theme {
  --color-brand-primary: #5AAE85;
  --color-brand-primary-dark: #4A9B73;
  --color-brand-primary-light: #E8F5EE;
  --color-brand-dark: #2B3A5A;
  --color-brand-secondary-dark: #1E2A42;
  --color-brand-gray: #6B7280;
  --color-brand-gray-light: #E5E7EB;
  --color-brand-background: #F5F7FA;
  --color-error: #DC2626;
  /* + shadows, radius, fonts, animations... */
}
```

Les **background-image** (gradients) ne peuvent pas être dans `@theme` → ils sont dans des blocs `@utility` :

```css
@utility bg-gradient-primary {
  background-image: linear-gradient(135deg, #5AAE85 0%, #4A9B73 100%);
}
```

### Variants du Button (`src/components/ui/button.tsx`)

- `default` : gradient vert (CTA principal)
- `secondary` : navy plein
- `outline` : bordure navy, hover navy plein
- `ghost` : transparent, hover fond léger
- `success` : vert plein
- `danger` : rouge
- `white` : blanc avec bordure
- `link` : texte vert souligné

---

## Base de données — Schéma Prisma

### Modèles principaux (18 total)

| Modèle | Description |
|---|---|
| `User` | Utilisateur (email unique, rôle, consentements, pas de password) |
| `BuyerProfile` | Profil acheteur (budget, critères, scoring, zones via `BuyerZone`) |
| `SellerProfile` | Profil vendeur (disponibilités, lien Immoweb) |
| `Property` | Bien immobilier (lié au SellerProfile) |
| `AgentProfile` | Profil agent (agence, n° IPI, abonnement, zones via `AgentZone`) |
| `Match` | Match acheteur↔bien (score, grade, statut, lien paiement) |
| `Payment` | Paiement Stripe (type: SELLER_SINGLE_UNLOCK ou AGENT_SUBSCRIPTION) |
| `Notification` | Notifications in-app |
| `OtpToken` | Codes OTP (email, code, expiresAt, used) |
| `OnboardingDraft` | Brouillons d'onboarding (email unique, rôle, data JSON, TTL 7j) |
| `Account` / `Session` / `VerificationToken` | NextAuth standard |

### Enums

- `UserRole` : BUYER, SELLER, AGENT, ADMIN
- `PropertyType` : APARTMENT, HOUSE, STUDIO, LOFT, VILLA, DUPLEX, PENTHOUSE, OTHER
- `PropertyCondition` : NEW, EXCELLENT, GOOD, TO_REFRESH, TO_RENOVATE
- `MatchGrade` : A, B, C
- `MatchStatus` : PENDING, VIEWED, UNLOCKED, CONFIRMED, CONTACTED, REJECTED, EXPIRED
- `FinancingStatus` : NOT_STARTED, SIMULATED, PRE_APPROVED, APPROVED, CASH
- `Timing` : URGENT, SHORT_TERM, MEDIUM_TERM, FLEXIBLE
- `PaymentType` : SELLER_SINGLE_UNLOCK, AGENT_SUBSCRIPTION
- `SubscriptionTier` : NONE, ESSENTIAL, PRO, PREMIUM

### Migrations

```bash
# Appliquer le schéma (dev, sans migration formelle)
npx prisma db push

# Ou créer une migration (si terminal interactif)
npx prisma migrate dev --name nom_migration

# Reset complet
npx prisma db push --force-reset
```

---

## Seed — Données de test

Pour créer des données de test, exécuter ces requêtes via `npx prisma studio` ou un script :

```sql
-- Créer un vendeur de test
INSERT INTO "User" (id, email, "firstName", "lastName", role, "consentTerms", "consentPrivacy")
VALUES ('seller-1', 'vendeur@test.be', 'Jean', 'Dupont', 'SELLER', true, true);

INSERT INTO "SellerProfile" (id, "userId")
VALUES ('sp-1', 'seller-1');

INSERT INTO "Property" (id, "sellerProfileId", commune, "postalCode", "propertyType", bedrooms, bathrooms, surface, "askingPrice", "priceNegotiable", "isActive")
VALUES ('prop-1', 'sp-1', 'Ixelles', '1050', 'APARTMENT', 2, 1, 85, 350000, true, true);

-- Créer un acheteur de test
INSERT INTO "User" (id, email, "firstName", "lastName", role, "consentTerms", "consentPrivacy")
VALUES ('buyer-1', 'acheteur@test.be', 'Sophie', 'Martin', 'BUYER', true, true);

INSERT INTO "BuyerProfile" (id, "userId", "budgetMin", "budgetMax", timing, "isActive")
VALUES ('bp-1', 'buyer-1', 250000, 400000, 'MEDIUM_TERM', true);

INSERT INTO "BuyerZone" (id, "buyerProfileId", commune, "postalCode")
VALUES ('bz-1', 'bp-1', 'Ixelles', '1050');

-- Créer un match
INSERT INTO "Match" (id, "buyerProfileId", "propertyId", "compatibilityScore", "compatibilityGrade", status)
VALUES ('match-1', 'bp-1', 'prop-1', 85, 'A', 'PENDING');
```

Pour se connecter en dev : utiliser l'email du User créé + code OTP `111111`.

---

## Terminologie IPI (juridique)

ImmoJuste n'est **pas** une agence immobilière. La terminologie doit respecter le cadre IPI :

| ❌ Ne pas utiliser | ✅ Utiliser |
|---|---|
| mise en relation | activation d'espace d'échange privé |
| intermédiaire | plateforme technologique |
| débloquer un contact | activer un espace d'échange |
| contact débloqué | espace d'échange activé |
| agent immobilier (pour ImmoJuste) | plateforme technologique de matching |

---

## Quirks techniques à connaître

### Zod v4

- `z.record()` requiert 2 arguments : `z.record(z.string(), z.unknown())`
- `z.number()` rejette `NaN` → utiliser `safeNum()` / `safeNumOptional()` de `src/lib/zod-helpers.ts`
- Les schemas d'API utilisent `z.preprocess()` pour convertir les strings vides/NaN en 0 ou undefined

### Prisma

- `prisma migrate dev` requiert un terminal interactif → utiliser `npx prisma db push` en CI/dev
- Le type `Json` de Prisma nécessite un cast : `data as Record<string, string | number | boolean | null>`
- Supprimer un champ du schema cascade en erreurs TypeScript dans tous les fichiers qui le référencent

### Tailwind CSS 4

- Les valeurs custom **doivent** être dans `@theme {}` dans `globals.css`
- Les `background-image` custom **ne peuvent pas** être dans `@theme` → utiliser `@utility`
- `tailwind.config.ts` existe encore mais principalement pour le legacy ; la source de vérité est `globals.css`

### NextAuth v4

- Strategy : JWT (pas de sessions en DB)
- Le token JWT contient `role` et `id` (ajoutés dans le callback `jwt`)
- La session expose `user.role` et `user.id` (callback `session`)
- Types étendus dans `src/types/next-auth.d.ts`

---

## Scripts npm

```bash
npm run dev      # Next.js dev server sur port 4000
npm run build    # Build production
npm run start    # Start production
npm run lint     # ESLint
```

---

## Git

- **Branche principale** : `develop`
- **Remote** : `git@github.com:olivier-omb/immojuste.git`
- **Convention de commit** : Messages en anglais, descriptifs

---

## Checklist pour continuer le développement

- [ ] Configurer Stripe (clés test dans `.env`, webhook endpoint `/api/webhooks/stripe`)
- [ ] Configurer Resend (clé API dans `.env`, domaine vérifié)
- [ ] Ajouter un script de seed automatique (`prisma/seed.ts`)
- [ ] Implémenter le chat/messaging entre vendeur et acheteur après activation
- [ ] Ajouter la gestion des photos de biens (upload S3/Cloudinary)
- [ ] Tests unitaires (matching algorithm) et e2e (Playwright/Cypress)
- [ ] Rate limiting production (Redis)
- [ ] Monitoring et logs (Sentry, Vercel Analytics)
- [ ] Déploiement (Vercel + Supabase/Neon pour PostgreSQL)

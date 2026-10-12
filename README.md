# Gestion IEPP

Logiciel de gestion des circonscriptions de l'enseignement préscolaire et primaire (IEPP) de Côte d'Ivoire.

| Partie | Dossier | Hébergement |
|---|---|---|
| Application web (React + Vite) | `frontend/` | Vercel |
| Serveur des comptes (Node + Express) | `backend/` | Render |
| Base de données (PostgreSQL + sécurité RLS) | `supabase/` | Supabase |

## Modules

Tableau de bord · Paramétrage circonscription (fiche IEPP, années scolaires, DRENA, barème des matières) · Secteurs pédagogiques · Écoles (fiche, infrastructures, classes, personnel) · Personnel (affectations annuelles, reconduction) · Élèves (inscriptions, changement de classe) · Compositions et saisie des notes · Bilan annuel (moyennes, rangs, décisions, synthèse) · Relevés de notes · Statistiques (export Excel) · Suivi de la saisie · Cartes scolaires · Fiches EPS · CEPE (centres, candidats, numéros de table, convocations, résultats) · Importer (Excel) · Comptes utilisateurs.

## Rôles

| Rôle | Périmètre |
|---|---|
| Superviseur | Toutes les circonscriptions, paramètres nationaux |
| Inspecteur (IEPP) | Sa circonscription, crée les comptes de ses agents |
| Conseiller pédagogique | Lecture de son secteur |
| Directeur d'école | Son école : élèves, notes, documents |
| Agent de saisie | Son école : élèves et notes |

La sécurité est appliquée **dans la base** (RLS) : même avec la clé publique, un compte ne peut lire ou modifier que son périmètre.

---

## Installation

### 1. Base de données (Supabase)

Deux fichiers au choix, selon l'hébergement :

- `supabase/001_schema_public.sql` — **projet Supabase dédié** (schéma `public`).
- `supabase/001_schema_iepp.sql` — **projet partagé** avec une autre application : tout est créé dans un schéma séparé `iepp`, sans toucher aux tables existantes. Il faut ensuite ajouter `iepp` dans *Project Settings → Data API → Exposed schemas*.

Ouvrir *SQL Editor*, coller le fichier choisi, exécuter.

### 2. Premier compte (superviseur)

```bash
cd backend
npm install
SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=eyJ... DB_SCHEMA=public \
  node creer-superviseur.js votre@email.ci "MotDePasse123" "Votre Nom"
```

(`DB_SCHEMA=iepp` si vous avez installé le schéma partagé.)

### 3. Serveur (Render)

New → Web Service → dépôt GitHub → *Root Directory* : `backend`, *Build* : `npm install`, *Start* : `npm start`.
Variables : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DB_SCHEMA` (`public` ou `iepp`), `CORS_ORIGINS` (adresse Vercel, ou `*`).
Le fichier `render.yaml` à la racine permet aussi un déploiement « Blueprint ».

> La clé `service_role` ne va **que** sur Render, jamais dans Vercel ni dans le code du navigateur.

### 4. Application web (Vercel)

New Project → même dépôt → *Root Directory* : `frontend` (Vite détecté automatiquement).
Variables :

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...          (clé publique « anon »)
VITE_DB_SCHEMA=public                  (ou iepp)
VITE_API_URL=https://gestion-iepp-api.onrender.com
```

### 5. Premiers pas dans l'application (superviseur)

1. Paramétrage → Années scolaires : créer `2026-2027` et l'**activer**.
2. Paramétrage → DRENA & circonscriptions : créer la DRENA puis l'IEPP.
3. Paramétrage → Barème des matières : cocher les matières de chaque niveau (note sur, coefficient) — « Copier sur tous les niveaux » pour aller vite.
4. Comptes utilisateurs : créer le compte de l'inspecteur.

L'inspecteur crée ensuite ses secteurs, écoles (ou les importe depuis Excel), son personnel, les classes, et les comptes des directeurs.

## Règles de calcul

- Moyenne d'une composition ramenée sur 10 : Σ(note / note_sur × 10 × coef) / Σ(coef).
- Une note absente (`A`) ou non saisie n'entre pas dans la moyenne.
- Moyenne annuelle = moyenne des compositions de l'année ; seuil de passage réglable (5/10 par défaut).

## Développement local

```bash
cd frontend && cp .env.example .env && npm install && npm run dev
cd backend && npm install && SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm start
```

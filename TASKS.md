# TASKS — Plateforme Nova Terra (Webcup 2026)

Répartition des 67 demandes de `request.json` en tâches. Le backend (`webcup-backend`) est considéré complet ; le frontend est à construire.

**État actuel frontend** : landing, login/register/forgot/reset/verify-email, admin users, shell sidebar + guards. Tout le reste est à faire. `/dashboard` est un stub vide.

**Légende demandes** : D01–D20 (demandes socle/fonctionnelles), F21–F68 (demandes citoyennes). Références API backend indiquées entre parenthèses.

---

## 👨‍💻 Dev 1 — Espace citoyen (12 tâches)

Fondations du parcours citoyen + composants partagés.

### 1. Espace citoyen socle

- [ ] **F1 — Dashboard citoyen** (D07, D03) : remplacer le stub `/dashboard` (actuellement `<div></div>`) par un tableau de bord hiérarchisé : services, démarches en cours, alertes, notifications. Appels : `GET /auth/me`, `GET /services`, `GET /requests/me`, `GET /alerts/active`, `GET /notifications`.
- [ ] **F2 — Catalogue des services** (D05, F32, F28, F64) : liste des services (`GET /services`), recherche (`GET /services/search?q=`), services mis en avant (`GET /services/featured`), page détail (`GET /services/:id`) avec état/disponibilité (opérationnel/perturbé/indisponible), message de maintenance, service alternatif.
- [ ] **F3 — Actualités & annonces** (D06) : liste des publications (`GET /news`) + annonces publiques (`GET /announcements`), page de détail.
- [ ] **F4 — Formulaire de contact** (D04, D16) : `POST /contact`, afficher la référence `CT-xxxxxx` en confirmation après envoi.
- [ ] **F5 — Signalement de problème** (F25, D16) : formulaire de signalement (ex. lampadaire cassé, description + lieu) → `POST /requests`, confirmation avec référence `REQ-…`.
- [ ] **F6 — Mes demandes** (D11, F26) : liste des demandes (`GET /requests/me`), état actuel, historique des statuts (`GET /requests/me/history`), filtres.
- [ ] **F7 — Profil** (D12) : édition du profil (`PATCH /auth/me`), taux de complétion + champs manquants (`GET /auth/me/profile-completion`).

### 3. Multilinguisme

- [ ] **F12 — Sélecteur de langue + i18n** (D14, F27) : choix de langue (`PATCH /auth/me/preferences`), traductions UI (`GET /i18n/ui/:locale`), traductions de contenu (`GET /i18n/translations?locale=&entityType=&entityId=`).

### 4. Navigation & onboarding

- [ ] **F13 — Breadcrumb** (D15) : fil d'Ariane sur toutes les pages internes.
- [ ] **F14 — Guides 1re connexion** (D12, F35) : étapes guidées (`GET /guides`, `GET /guides/me`, `POST /guides/:key/complete`, `POST /guides/:key/dismiss`).

### 8. Mobilité & lieux

- [ ] **F27 — Transports** (F36) : lignes et horaires (`GET /mobility/lines`, `GET /mobility/lines/:id?day=`), recherche de ligne.
- [ ] **F28 — Carte des services + urgences** (F45, F46) : carte des services physiques (`GET /places`), lieux d'urgence (hôpitaux, police…) (`GET /places/emergency`).

---

## 👨‍💻 Dev 2 — Espace agent & communications (14 + 2 backend)

Back-office, alertes, sécurité, rendez-vous.

### 5. Espace agent

- [ ] **F15 — Workspace agent** (D19, F22, D17) : liste des demandes avec filtres statut/priorité (`GET /requests`), badges d'état, compteur "en attente" (`GET /requests/indicators`).
- [ ] **F16 — Détail demande** (F49) : vue détail (`GET /requests/:id`), changement de statut/priorité/assignation/note interne (`PATCH /requests/:id`). La notification citoyenne est gérée côté backend.
- [ ] **F17 — Tableau de bord agent** (F50, D19) : KPIs (`GET /dashboard/stats`), données Nova Terra (`GET /dashboard/nova-terra`).
- [ ] **F18 — Journal d'audit** (F47, F48) : page consultable (`GET /audit`) avec filtres (acteur, type, action, dates).

### 6. Communications & alertes

- [ ] **F19 — UI notifications** (F30, F49, F54) : cloche + liste (`GET /notifications`), non-lus (`GET /notifications/unread-count`), tout marquer lu (`PATCH /notifications/read-all`), préférences (`GET/PATCH /notifications/preferences`).
- [ ] **F20 — Bannières d'alertes** (F29, F31) : alertes actives (`GET /alerts/active`), affichage zone, criticités, recommandations adaptées (y compris générées par IA pour la canicule).
- [ ] **F21 — Création/diffusion côté agent** (D18, F29, F31) : créer annonces (`POST /announcements`), créer/diffuser alertes (`POST /alerts`, `POST /alerts/:id/diffuse`), génération IA (`POST /alerts/ai/generate`).

### 7. Comptes & sécurité

- [ ] **F22 — Login sans mot de passe** (D02) : demande de code magique (`POST /auth/passwordless/request`), vérification (`POST /auth/passwordless/verify`).
- [ ] **F23 — UI 2FA** (F53) : défi au login (`requiresTwoFactor`/`pendingToken` — actuellement rejeté dans `src/auth.ts`), setup TOTP (QR) (`POST /auth/2fa/setup`, `activate`), email MFA (`/auth/2fa/email/*`).
- [ ] **F24 — Suppression de compte** (F33) : parcours de suppression avec confirmation (`DELETE /auth/me`).
- [ ] **F25 — Gestion admin des comptes** (F34) : étendre la page admin existante : détail (`GET /accounts/:id`), suspension/restauration/suppression (`PATCH/DELETE /accounts/:id`, `POST /accounts/:id/restore`).
- [ ] **F26 — État verrouillé** (F37) : afficher le verrouillage après échecs de connexion (`GET /security/locks` côté agent, messages adaptés côté citoyen).

### 9. Rendez-vous

- [ ] **F29 — Prise de rendez-vous** (F39) : créneaux (`GET /appointments/slots`), réservation (`POST /appointments`), mes rendez-vous (`GET /appointments/me`), annulation (`POST /appointments/:id/cancel`).
- [ ] **F30 — Rappels** (F40) : affichage des rappels de rendez-vous (notifications programmées, déjà générées par le backend).

### Backend

- [ ] **B1 — Route récupération 2FA** (F53) : exposer `POST /auth/2fa/recovery` (`verifyRecoveryCode()` existe déjà dans le service, pas de controller).
- [ ] **B2 — Validation** : `npm run build` + `npm run test` pour valider l'existant.

---

## 👨‍💻 Dev 3 — Inclusion, participation & performance (13 tâches)

### 2. Accessibilité & inclusion

- [ ] **F8 — Réglages accessibilité** (F21, F23, F24, F43, F44, D20) : panneau de réglages (taille texte, contraste élevé, police lisible, interligne, schémas couleurs, daltonisme, langage simplifié) → `PATCH /auth/me/preferences` + application des classes CSS correspondantes.
- [ ] **F9 — Navigation clavier** (F41, F42) : skip-link, focus visible, pièges à clavier, `aria` corrects sur formulaires/champs/messages d'erreur (s'appuyer sur les patterns existants dans `components/auth`).
- [ ] **F10 — Langage simple** (D13) : glossaire (`GET /glossary`), mode `plainLanguage` appliqué aux contenus, définitions des termes complexes.
- [ ] **F11 — Zoom 200%** (F44) : layout robuste au zoom sans chevauchement, contenu non coupé.

### 10. Participation

- [ ] **F31 — Projets de la ville** (F67, F66) : liste (`GET /projects`), détail, avis/feedback (`POST /projects/:id/feedback`), résumé public (`GET /projects/:id/feedback/summary`).
- [ ] **F32 — Consultations** (F65) : liste (`GET /consultations`), répondre (`POST /consultations/:id/respond`), résultats (`GET /consultations/:id/results`).
- [ ] **F33 — Proposer une idée** (F68) : `POST /ideas` avec référence `IDEA-…`, mes idées (`GET /ideas/me`).
- [ ] **F34 — Soutenir une demande** (F52) : `POST/DELETE /requests/:id/support`, compteur + "soutenu par moi" (`GET /requests/:id/support`).
- [ ] **F35 — Préoccupations données** (F51) : soumission (`POST /participation/concerns`), suivi de mes préoccupations (`GET /participation/concerns/me`).

### 11. Données & vie privée

- [ ] **F36 — Export de mes données** (F55, F56) : export JSON structuré (`GET /privacy/export`), téléchargement récapitulatif demandes CSV (`GET /requests/me/summary/download`).

### 12. Performance & éco

- [ ] **F37 — Mode léger/éco** (F57, F58, F59, F60, F61, F62) : mode "léger" (mode `light` des API), optimisation images (lazy-load, formats modernes), réduction du JS/CSS, performance sur connexion lente et appareils peu puissants.
- [ ] **F38 — Badges état service** (F64, F38) : affichage de l'état de chaque service (disponible/perturbé/indisponible + message de maintenance) avant de commencer une démarche.
- [ ] **F39 — Désactivation admin d'un service** (F63) : `POST /services/:id/availability` (motif obligatoire), historique des statuts (`GET /services/:id/status-history`).

---

## Récapitulatif

| Dev | Domaine | Tâches |
|-----|---------|--------|
| Dev 1 | Espace citoyen (1, 3, 4, 8) | 12 |
| Dev 2 | Agent & comms (5, 6, 7, 9) + backend | 16 |
| Dev 3 | Inclusion, participation, perf (2, 10, 11, 12) | 13 |
| **Total** | | **41** |

**Ordre de démarrage** : Dev 1 d'abord (pose le socle : layout, services, composants partagés). Dev 2 et Dev 3 en parallèle sur leurs pages indépendantes.

## Conventions

- Nouveaux pages dans `src/app/(private)/…` (coquille sidebar existante + guards de rôle `admin` / `agent_municipal` / `citoyen`).
- API via les services `src/services/*` (axios avec Bearer token, pattern existant).
- Schémas zod dans `src/schemas/*` (pattern `schemas/auth`).
- React Query (`@tanstack/react-query`) est installé mais non branché : brancher `QueryProvider` dans le layout racine avant d'utiliser `useQuery`.
- Backend : `http://localhost:5000/api` (`NEXT_PUBLIC_BASE_URL`).
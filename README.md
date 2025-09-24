# PayeTonKawa - Frontend E-commerce

Une application e-commerce moderne construite avec Next.js 14, TypeScript et Tailwind CSS.

## 🚀 Technologies utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **React Hook Form** - Gestion des formulaires
- **Zustand** - Gestion d'état global
- **Axios** - Client HTTP
- **TanStack Query** - Gestion des données et cache
- **React Hot Toast** - Notifications
- **Lucide React** - Icônes

## 🏗️ Architecture

Le projet suit une architecture modulaire avec :

```
src/
├── app/                    # Pages Next.js (App Router)
├── components/
│   ├── ui/                # Composants UI réutilisables
│   ├── layout/            # Composants de mise en page
│   └── providers/         # Providers React Query, etc.
├── hooks/                 # Hooks React Query personnalisés
├── services/              # Services API
├── store/                 # Stores Zustand
├── types/                 # Types TypeScript
├── lib/                   # Utilitaires
└── config/                # Configuration (API endpoints)
```

## 🔧 APIs Backend

Le frontend communique avec les APIs suivantes :

- **API Customers**: https://customers.payetonkawa.shop/
- **API Orders**: https://orders.payetonkawa.shop/
- **API Products**: https://products.payetonkawa.shop/
- **API Message Broker**: https://message-broker.payetonkawa.shop/

## 📋 Fonctionnalités

### Pages publiques
- 🏠 **Accueil** - Présentation et produits en vedette
- 🛍️ **Catalogue produits** - Navigation et filtres
- 🔍 **Détail produit** - Informations complètes et ajout au panier
- 🛒 **Panier** - Gestion des articles
- 💳 **Checkout** - Processus de commande

### Authentification
- 🔐 **Connexion/Inscription** - Gestion des comptes utilisateurs
- 👤 **Profil** - Modification des informations personnelles

### Espace client
- 📦 **Mes commandes** - Historique et suivi
- 📋 **Détail commande** - Informations complètes

### Administration (rôle admin)
- 📊 **Dashboard** - Vue d'ensemble
- 👥 **Gestion clients** - CRUD clients
- 🏷️ **Gestion produits** - CRUD produits et stock
- 📦 **Gestion commandes** - Suivi et changement de statut

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd front
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
cp .env.example .env.local
```

4. **Démarrer le serveur de développement**
```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 🔧 Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run start` - Démarre l'application en mode production
- `npm run lint` - Vérifie la qualité du code

## 🌍 Variables d'environnement

```env
# API Configuration
NEXT_PUBLIC_API_CUSTOMER_URL=https://customers.payetonkawa.shop
NEXT_PUBLIC_API_ORDERS_URL=https://orders.payetonkawa.shop
NEXT_PUBLIC_API_PRODUCTS_URL=https://products.payetonkawa.shop
NEXT_PUBLIC_API_MESSAGE_BROKER_URL=https://message-broker.payetonkawa.shop

# Application Configuration
NEXT_PUBLIC_APP_NAME="PayeTonKawa Shop"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

## 📱 Fonctionnalités techniques

### Gestion d'état
- **Zustand** pour l'authentification et le panier
- **React Query** pour le cache des données API
- **LocalStorage** pour la persistance

### Authentification
- JWT avec refresh automatique
- Routes protégées par rôle (customer/admin)
- Gestion des permissions

### Performance
- **Server-Side Rendering** avec Next.js
- **Mise en cache intelligente** avec TanStack Query
- **Optimisation des images** avec Next.js Image
- **Code splitting** automatique

### UX/UI
- **Design responsive** mobile-first
- **Thème sombre/clair** automatique
- **Notifications toast** pour le feedback
- **Loading states** et gestion d'erreur
- **Formulaires validés** avec React Hook Form

## 🧪 Tests et qualité

Le projet utilise :
- **ESLint** pour la qualité du code
- **TypeScript** pour la sécurité des types
- **Prettier** pour le formatage (à configurer)

## 🚀 Déploiement

Pour déployer en production :

1. **Construire l'application**
```bash
npm run build
```

2. **Démarrer en mode production**
```bash
npm run start
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👥 Équipe

Développé par l'équipe PayeTonKawa pour le projet MSPR EPSI 2024-2025.

---

**Note**: Ce frontend est conçu pour fonctionner avec l'architecture microservices PayeTonKawa. Assurez-vous que tous les services backend sont déployés et accessibles.

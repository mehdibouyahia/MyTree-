# MyTree

**Auteurs**: EL BOJADDAINI Chakir, BOUYAHIA Elmehdi, BENKIRAN Mohamed Taha  
**Date**: Mai 2023

## Introduction

MyTree est une application de généalogie développée dans le cadre du projet PG219 2023. Cette application permet aux utilisateurs de créer et de gérer leurs arbres généalogiques. Le projet comprend une interface web développée avec React, un backend utilisant Node.js, Express et MongoDB, ainsi qu'une application mobile basée sur Cordova pour Android.

## Mise en route

### Prérequis

- Node.js (v14 ou plus récent)
- npm (v6 ou plus récent)
- MongoDB
- Cordova (pour l'application mobile)

### Configuration du projet

#### Backend

1. Accédez au répertoire backend :
   ```sh
   cd backend
   ```
2. Installez les dépendances :
   ```sh
   npm install
   ```
3. Démarrez le serveur :
   ```sh
   npm start
   ```

#### Frontend

1. Accédez au répertoire frontend :
   ```sh
   cd src/frontend
   ```
2. Installez les dépendances :
   ```sh
   npm install
   ```
3. Démarrez le serveur de développement :
   ```sh
   npm run dev
   ```

#### Application mobile (Cordova)

1. Accédez à la racine du projet :

2. Ajoutez la plateforme Android :
   ```sh
   cordova platform add android
   ```
3. Compilez le projet :
   ```sh
   cordova build android
   ```
4. Exécutez l'application sur un appareil ou un émulateur Android :
   ```sh
   cordova run android
   ```

## Explication du projet

### Backend

Le backend est construit en utilisant Node.js, Express et MongoDB. Il gère l'authentification des utilisateurs, la gestion des arbres généalogiques et fournit une API REST pour l'interface web et l'application mobile. Les fonctionnalités principales incluent :

- **Authentification des utilisateurs** : Authentification basée sur JWT pour une gestion sécurisée des sessions. Chaque membre de l'équipe a contribué à la mise en place des routes d'authentification dans `user.js` et à la configuration de JWT dans `index.js`.
- **Gestion des arbres généalogiques** : Opérations CRUD pour les membres de la famille et leurs relations. Tous les membres ont participé à la conception et à l'implémentation des modèles Mongoose dans `User.js`.
- **Fonctionnalités administratives** : Validation des utilisateurs, gestion des rôles et administration générale de l'application. Tous les membres ont travaillé sur les fonctions d'administration dans `user.js`.

Les fichiers clés incluent :

- `index.js` : Point d'entrée principal du serveur, configuré par l'équipe pour gérer les connexions et les configurations initiales.
- `user.js` : Fichier de routage pour les utilisateurs, incluant les routes d'authentification et de gestion des arbres généalogiques. Chaque membre a contribué à différentes parties de ce fichier.
- `User.js` : Modèle Mongoose pour la gestion des utilisateurs et des arbres généalogiques. Conçu et implémenté collectivement par l'équipe.

### Frontend

L'interface web est développée en utilisant React et intègre `react-d3-tree` pour la visualisation des arbres généalogiques. Nous avons préféré `react-d3-tree` à `d3js` car il offre une intégration plus simple avec les composants React, facilitant ainsi la gestion de l'état et le rendu. `react-d3-tree` abstrait certaines des complexités de l'utilisation directe de `d3js`, ce qui permet un développement plus rapide et un code plus facile à maintenir.

Les composants clés incluent :

- `Admin.jsx` : Composant pour l'interface d'administration permettant la gestion des utilisateurs. Tous les membres ont contribué à la création de ce composant en ajoutant les fonctionnalités nécessaires pour l'administration.
- `DropdownMenu.jsx` : Composant pour le menu déroulant de navigation. Conçu par toute l'équipe pour permettre une navigation facile entre les différentes sections de l'application.
- `FamilyTree.jsx` : Composant pour l'affichage et la gestion de l'arbre généalogique. L'intégration de `react-d3-tree` a été une collaboration de toute l'équipe pour assurer une visualisation efficace des arbres.
- `NodeModal.jsx` : Composant modal pour ajouter, modifier et visualiser les informations des membres de la famille. Chaque membre de l'équipe a participé à la conception et à l'implémentation de ce composant.
- `Signup.jsx`, `Login.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx` : Composants pour l'authentification des utilisateurs. Développés collectivement, chaque membre a contribué à l'ajout de fonctionnalités et à l'amélioration de l'expérience utilisateur.

### Application mobile

L'application mobile est développée en utilisant Cordova et offre les mêmes fonctionnalités que l'application web. Elle permet aux utilisateurs d'accéder et de gérer leurs arbres généalogiques en déplacement.

- **Configuration et développement avec Cordova** : Toute l'équipe a participé à la configuration initiale de Cordova, à l'ajout de la plateforme Android et à la gestion des plugins nécessaires.
- **Intégration avec le backend et le frontend** : Chaque membre a travaillé sur l'intégration des fonctionnalités backend et frontend dans l'application mobile pour garantir une cohérence et une continuité entre les différentes plateformes.
- **Tests et déploiement** : L'ensemble de l'équipe a participé aux tests sur différents appareils Android pour s'assurer que l'application fonctionne correctement et sans erreurs.

## Contributions

Le développement de MyTree a été un effort collaboratif où chaque membre de l'équipe a apporté sa contribution à toutes les parties du projet pour garantir une compréhension et une mise en œuvre complètes. Voici un aperçu de nos contributions

### Authentification des utilisateurs

- **EL BOJADDAINI Chakir** : Conception et développement de l'API d'authentification dans `user.js`, mise en œuvre du modèle utilisateur dans `User.js`, et création des composants frontend pour l'authentification.
- **BOUYAHIA Elmehdi** : Mise en place des routes d'authentification dans `user.js`, configuration de JWT dans `index.js` coté backend, et développement des composants frontend pour l'authentification des utilisateurs.
- **BENKIRAN Mohamed Taha** : Contribution à la conception de l'API d'authentification, développement du modèle utilisateur dans `User.js`, et création des composants frontend pour l'authentification.

### Gestion des arbres généalogiques

- **EL BOJADDAINI Chakir** : Développement de l'API de gestion des arbres dans `user.js`, intégration de `react-d3-tree` pour la visualisation des arbres dans `FamilyTree.jsx`, et création du composant `NodeModal.jsx` pour gérer les interactions utilisateur.
- **BOUYAHIA Elmehdi** : Participation à l'implémentation des modèles Mongoose dans `User.js`, intégration de `react-d3-tree` dans `FamilyTree.jsx`, et développement de `NodeModal.jsx` pour l'ajout et la modification des membres de la famille.
- **BENKIRAN Mohamed Taha** : Développement de l'API de gestion des arbres, intégration de `react-d3-tree` pour la visualisation des arbres, et création du composant `NodeModal.jsx` pour la gestion des membres de la famille.

### Revue de code et tests

- **EL BOJADDAINI Chakir** : Participation active aux revues de code, tests unitaires et fonctionnels, et résolution des bugs.
- **BOUYAHIA Elmehdi** : Participation active aux revues de code, tests unitaires et fonctionnels, et résolution des bugs.
- **BENKIRAN Mohamed Taha** : Participation active aux revues de code, tests unitaires et fonctionnels, et résolution des bugs.

## Conclusion

MyTree est une application de généalogie complète qui combine un backend puissant, une interface utilisateur intuitive et une application mobile pour offrir une expérience utilisateur fluide dans la gestion des arbres généalogiques. L'utilisation de technologies modernes telles que React et Cordova, ainsi que des choix de conception réfléchis, ont abouti à une application robuste et conviviale.

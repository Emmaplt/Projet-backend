# Mon Vieux grimoire

## Description

Ce projet est une application de gestion des livres où les utilisateurs peuvent ajouter des livres, les noter, et voir les livres les mieux notés.
Il inclut une fonctionnalité d'authentification utilisateur avec des jetons JWT, ainsi qu'une validation des mots de passe pour garantir la sécurité.

## Installation

Clonez ce projet sur votre machine locale et installez les dépendances.

```bash
git clone https://github.com/Emmaplt/backend.git
cd backend
npm install
```

## Dépendances

Voici les principales dépendances utilisées dans ce projet :

1. **express** : Framework web pour créer les routes API et gérer les requêtes HTTP.
2. **mongoose** : ODM pour interagir avec MongoDB.
3. **bcrypt** : Outil pour hacher les mots de passe.
4. **jsonwebtoken** : Gestion des tokens JWT pour l'authentification.
5. **mongoose-unique-validator** : Plugin Mongoose pour garantir l'unicité des champs (ex: email).
6. **multer** : Middleware pour gérer l'upload de fichiers (ex: images).
7. **dotenv** : Charge les variables d'environnement depuis un fichier `.env`.
8. **cors** : Middleware pour configurer les en-têtes CORS, permettant les requêtes cross-origin.

## Configuration

Créez un fichier `.env` à la racine du projet et ajoutez les variables suivantes :

```bash
MONGODB=mongodb+srv://votre_mongo_db
TOKEN=votre_token_secret
```

## Utilisation

Lancez le projet en mode développement :

```bash
npm start
```

## API

L'API expose plusieurs routes pour la gestion des utilisateurs, des livres et des notations. Voici un aperçu des principales routes et de leur utilisation.

### Authentification

1. **Inscription (`POST /api/auth/signup`)**
Crée un nouvel utilisateur.

- **Body** (JSON) :

```json
{
"email": "user@example.com",
"password": "yourpassword"
}
```

- **Réponse** :

```json
{
"message": "Utilisateur créé !"
}
```

> ⚠️ Le mot de passe doit comporter au moins 8 caractères.

2. **Connexion (`POST /api/auth/login`)**
Connecte un utilisateur existant.

- **Body** (JSON) :
```json
{
"email": "user@example.com",
"password": "yourpassword"
}
```
- **Réponse** :
```json
{
"userId": "id",
"token": "jwt_token"
}
```

### Gestion des livres

1. **Créer un livre (`POST /api/books`)**
Crée un nouveau livre (authentification requise).

- **Headers** : `Authorization: Bearer <token>`
- **Body** (multipart/form-data) :
- `book`: JSON avec les détails du livre (titre, auteur, année, genre)
- `image`: Fichier d'image

- **Exemple** :
```json
{
"title": "Harry Potter",
"author": "J.K. Rowling",
"year": 1997,
"genre": "Fantasy"
}
```

2. **Obtenir un livre (`GET /api/books/:id`)**
Récupère les détails d'un livre spécifique par ID.

- **Réponse** (JSON) :
```json
{
"_id": "id",
"title": "Harry Potter",
"author": "J.K. Rowling",
"year": 1997,
"genre": "Fantasy",
"averageRating": 4.5,
"ratings": [
    {
    "userId": "user1",
    "grade": 5
    },
    {
    "userId": "user2",
    "grade": 4
    }
]
}
```

3. **Modifier un livre (`PUT /api/books/:id`)**
Met à jour les détails d'un livre (authentification requise).

- **Headers** : `Authorization: Bearer <token>`
- **Body** (multipart/form-data) : Comme pour la création de livre.

4. **Supprimer un livre (`DELETE /api/books/:id`)**
Supprime un livre (authentification requise).

- **Headers** : `Authorization: Bearer <token>`

5. **Noter un livre (`POST /api/books/:id/rating`)**
Permet à un utilisateur de noter un livre (authentification requise).

- **Headers** : `Authorization: Bearer <token>`
- **Body** (JSON) :
```json
{
"userId": "user_id",
"rating": 4
}
```

6. **Meilleurs livres (`GET /api/books/bestrating`)**
Récupère les trois livres ayant les meilleures notes.

- **Réponse** (JSON) :
```json
[
{
    "_id": "id",
    "title": "Harry Potter",
    "averageRating": 4.8
},
{
    "_id": "id2",
    "title": "Le Seigneur des Anneaux",
    "averageRating": 4.7
}
]
```

### Gestion des erreurs

Les réponses en cas d'erreur suivront généralement le format suivant :
- **Code 400** : Mauvaise requête (ex : mot de passe trop court)
- **Code 401** : Non autorisé (ex : token JWT manquant ou invalide)
- **Code 403** : Accès interdit (ex : tentative de modification ou suppression d'un livre par un utilisateur qui n'en est pas le propriétaire).
- **Code 404** : Ressource non trouvée (ex : livre non existant)
- **Code 500** : Erreur serveur

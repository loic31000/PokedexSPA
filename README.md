# PokedexSPA

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/API-PokéBuild-EF5350?style=for-the-badge" alt="PokéBuild API">
  <img src="https://img.shields.io/badge/Apache-HTTPD-D22128?style=for-the-badge&logo=apache&logoColor=white" alt="Apache HTTPD">
</p>

Pokédex en Single Page Application développé en JavaScript natif et alimenté par PokéBuild API.

## Fonctionnalités vérifiées

- chargement de la liste des Pokémon depuis PokéBuild API ;
- affichage d'une liste cliquable avec numéro, nom et image ;
- fiche détaillée d'un Pokémon ;
- affichage des types ;
- affichage des évolutions lorsqu'elles existent ;
- navigation en cliquant sur une évolution ;
- recherche dynamique par nom ou identifiant ;
- affichage d'un message d'erreur lorsque la requête de détail échoue.

Le script charge actuellement jusqu'à 898 Pokémon pour construire la liste.

## Architecture

```text
PokedexSPA/
├── index.html
├── script.js
├── style.css
├── dockerfile
└── README.md
```

L'interface repose sur des éléments `<template>` HTML clonés et remplis dynamiquement par `script.js`.

## Lancement simple

Aucune étape de build n'est nécessaire.

Vous pouvez servir le dossier avec un serveur HTTP local. Par exemple avec Python :

```bash
git clone https://github.com/loic31000/PokedexSPA.git
cd PokedexSPA
python -m http.server 8000
```

Ouvrez ensuite `http://localhost:8000`.

## Lancement avec Docker

Le `dockerfile` utilise Apache HTTPD 2.4.

```bash
docker build -f dockerfile -t pokedex-spa .
docker run --rm -p 8080:80 --name pokedex-spa pokedex-spa
```

Ouvrez ensuite `http://localhost:8080`.

## API

Source des données :

`https://pokebuildapi.fr/api/v1/`

Le fonctionnement de l'application dépend donc de la disponibilité de ce service externe.

## État du projet

Le dépôt ne contient actuellement ni tests automatisés ni fichier de licence.

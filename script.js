// Variables globales : on récupère des éléments HTML par leur ID pour manipuler la page
const conteneurPokemons = document.getElementById('conteneurPokemons'); // Conteneur pour la liste des Pokémon
const templateListe = document.getElementById('templateListe'); // Modèle HTML pour un item de la liste
const templatePokemon = document.getElementById('templatePokemon'); // Modèle HTML pour la fiche détaillée d’un Pokémon
const resultatRecherche = document.getElementById('resultatRecherche'); // Zone où s’affiche la fiche détaillée
const barreRecherche = document.getElementById('barreRecherche'); // Barre de recherche pour saisir le nom ou numéro

// Variable pour stocker la liste des Pokémon récupérés
let pokemonsList = []; 

// Fonction pour trouver un Pokémon dans la liste grâce à son ID pokédex
function trouverPokemonParId(id) {
  return pokemonsList.find(p => p.pokedexId === id); // Cherche dans pokemonsList un Pokémon avec l’ID donné
}

// Fonction pour créer un élément dans la liste affichée à gauche (mini-card Pokémon)
function creerItemListe(pokemon, callbackClick) {
  const clone = templateListe.content.cloneNode(true); // Clone le template HTML de liste
  clone.querySelector('.numero-pokemon').textContent = pokemon.pokedexId; // Remplit le numéro
  clone.querySelector('.nom-pokemon').textContent = pokemon.name; // Remplit le nom
  clone.querySelector('.mini-image').src = pokemon.image; // Met l’image du Pokémon
  clone.querySelector('.mini-image').alt = pokemon.name; // Texte alternatif pour l’image (accessibilité)
  clone.querySelector('.item-liste').addEventListener('click', () => { // Quand on clique sur l’élément
    callbackClick(pokemon.pokedexId); // Appelle la fonction donnée avec l’ID du Pokémon
  });
  return clone; // Retourne l’élément construit
}

// Fonction pour créer la liste des types (feu, eau, etc.) d’un Pokémon
function creerTypes(types) {
  const h2Types = document.createElement('h2'); // Crée un titre h2
  h2Types.classList.add('pokemon-types'); // Ajoute une classe CSS
  types.forEach(type => { // Pour chaque type dans la liste
    const pType = document.createElement('p'); // Créé un paragraphe
    const imgType = document.createElement('img'); // Créé une image
    imgType.src = type.image; // Source de l’image correspond au type
    imgType.alt = type.name; // Texte alternatif nom du type
    imgType.width = 60; // Largeur fixe
    imgType.height = 60; // Hauteur fixe
    pType.appendChild(imgType); // Ajoute l’image dans le paragraphe
    pType.append(` ${type.name}`); // Ajoute aussi le nom du type en texte
    h2Types.appendChild(pType); // Ajoute ce paragraphe au titre h2
  });
  return h2Types; // Retourne ce bloc de types
}

// Fonction pour créer la liste des évolutions (formes évoluées) d’un Pokémon
function creerEvolutions(evolutions, callbackClick, currentId) {
  if (!evolutions || evolutions.length === 0) return null; // Pas d’évolutions ? On retourne rien

  const divEvolutions = document.createElement('div'); // Div qui va contenir la liste
  divEvolutions.classList.add('evolutions-list'); // Ajoute une classe CSS

  const titre = document.createElement('h4'); // Titre pour les évolutions
  titre.textContent = 'Evolution'; // Texte du titre
  divEvolutions.appendChild(titre); // Ajoute le titre à la div

  evolutions.forEach(evo => { // Pour chaque évolution passée
    if ((evo.pokedexId || evo.id) === currentId) return; // Ignore l’évolution si c’est le même Pokémon que celui affiché

    const fullPokemon = trouverPokemonParId(evo.pokedexId || evo.id); // Trouve les détails complets du Pokémon évolué

    // Création d’une ligne pour chaque évolution
    const ligne = document.createElement("div");
    ligne.classList.add('evolution-item'); // Classe CSS pour styling
    ligne.style.backgroundColor = '#2d2d2d'; // Couleur de fond sombre
    ligne.style.gap = '10px'; // Espacement interne
    ligne.style.cursor = 'pointer'; // Curseur comme un lien/cliquable

    // Span pour afficher le numéro du Pokémon
    const spanNumero = document.createElement('span');
    spanNumero.classList.add('evolution-number');
    spanNumero.textContent = fullPokemon ? `${fullPokemon.pokedexId}` : ''; // Affiche le numéro ou rien
    spanNumero.style.minWidth = '40px';
    spanNumero.style.color = '#fff';
    spanNumero.style.fontWeight = 'bold';

    // Image de l’évolution
    const imgEvo = document.createElement('img');
    imgEvo.classList.add('evolution-image');
    imgEvo.src = fullPokemon ? fullPokemon.image : ''; // Image du Pokémon évolué
    imgEvo.alt = fullPokemon ? fullPokemon.name : evo.name; // Texte alternatif nom
    imgEvo.width = 42;
    imgEvo.height = 42;

    // Nom du Pokémon évolution en texte
    const spanNom = document.createElement('span');
    spanNom.classList.add('evolution-name');
    spanNom.textContent = evo.name;
    spanNom.style.color = '#fff';
    spanNom.style.fontSize = '1em';

    // Ajoute le numéro, le nom et l’image dans la ligne
    ligne.appendChild(spanNumero);
    ligne.appendChild(spanNom);
    ligne.appendChild(imgEvo);

    // Ajoute un clic sur la ligne pour afficher l’évolution sélectionnée
    ligne.addEventListener('click', () => {
      callbackClick(evo.pokedexId || evo.id || evo.name);
    });

    // Ajoute la ligne à la div des évolutions
    divEvolutions.appendChild(ligne);
  });

  return divEvolutions; // Retourne la div contenant la liste des évolutions
}

// Fonction pour créer la fiche détaillée complète d’un Pokémon
function creerPokemon(pokemon, callbackClick) {
  const clone = templatePokemon.content.cloneNode(true); // Clone le template pour fiche détaillée

  clone.querySelector('.pokemon-image').src = pokemon.image; // Met l’image du Pokémon
  clone.querySelector('.pokemon-image').alt = pokemon.name; // Texte alternatif image
  clone.querySelector('.pokemon-nom').textContent = pokemon.name; // Affiche le nom du Pokémon
  clone.querySelector('.pokemon-id').textContent = `N°${pokemon.pokedexId}`; // Affiche son numéro

  // Affiche les types du Pokémon dans le conteneur types (ex : feu, eau)
  const conteneurTypes = clone.querySelector('.pokemon-types');
  conteneurTypes.innerHTML = ''; // Vide le contenu précédent
  pokemon.apiTypes.forEach(type => { // Pour chaque type
    const pType = document.createElement('p'); // Crée un paragraphe
    const imgType = document.createElement('img'); // Crée une image pour le type
    imgType.src = type.image; // Source image type
    imgType.alt = type.name; // Texte alternatif type
    imgType.width = 80;
    imgType.height = 80;
    pType.appendChild(imgType); // Ajoute l’image dans le paragraphe
    conteneurTypes.appendChild(pType); // Ajoute le paragraphe au conteneur
  });

  // Affiche les évolutions dans la fiche détaillée
  const conteneurEvolutions = clone.querySelector('.pokemon-evolutions');
  conteneurEvolutions.innerHTML = ''; // Vide contenu précédent
  const evolutionsElem = creerEvolutions(pokemon.apiEvolutions, callbackClick, pokemon.pokedexId);
  if (evolutionsElem) {
    conteneurEvolutions.appendChild(evolutionsElem); // Ajoute la liste des évolutions si elle existe
  } else {
    conteneurEvolutions.textContent = 'Pas d\'évolution'; // Sinon affiche un message
  }

  // Ajoute un clic sur l’image pour afficher ce Pokémon (ré-affichage)
  clone.querySelector('.pokemon-image').addEventListener('click', () => {
    if (callbackClick) callbackClick(pokemon.pokedexId);
  });

  return clone; // Retourne la fiche Pokémon complète prête à être affichée
}

// Fonction qui affiche la fiche détaillée d’un Pokémon donné par son id ou nom
async function afficherPokemon(idOuNom) {
  try {
    const res = await fetch(`https://pokebuildapi.fr/api/v1/pokemon/${idOuNom}`); // Récupère les données du Pokémon via une API
    if (!res.ok) throw new Error('Pokémon non trouvé'); // Si erreur, lance une exception
    const data = await res.json(); // Transforme la réponse en objet JSON
    resultatRecherche.innerHTML = ''; // Vide la zone résultat
    const comp = creerPokemon(data, afficherPokemon); // Crée la fiche Pokémon avec données reçues
    resultatRecherche.appendChild(comp); // Ajoute la fiche dans la page
  } catch (err) {
    resultatRecherche.innerHTML = `<p style="color:red;">${err.message}</p>`; // Affiche message d’erreur en rouge si problème
  }
}

// Fonction principale qui démarre la plupart des opérations
async function main() {
  // Récupère les 151 premiers Pokémon via API
  const reponse = await fetch('https://pokebuildapi.fr/api/v1/pokemon/limit/898');
  pokemonsList = await reponse.json(); // Met la liste reçue dans pokemonsList

  conteneurPokemons.innerHTML = ''; // Vide le conteneur de la liste

  // Pour chaque Pokémon, crée un item de liste et l’ajoute à la page
  pokemonsList.forEach(pokemon => {
    const comp = creerItemListe(pokemon, afficherPokemon); // Crée un élément liste cliquable
    conteneurPokemons.appendChild(comp); // Ajoute à la page
  });

  afficherPokemon(1); // Affiche directement la fiche du Pokémon numéro 1 au démarrage

  // Ajoute un événement sur la barre recherche pour afficher Pokémon quand on écrit dedans
  barreRecherche.addEventListener('input', () => {
    const valeurRecherche = barreRecherche.value.trim().toLowerCase(); // Récupère texte recherché en minuscule
    if (!valeurRecherche) {
      resultatRecherche.innerHTML = ''; // Vide la fiche si champ vide
      return;
    }
    afficherPokemon(valeurRecherche); // Sinon affiche le Pokémon correspondant
  });
}

// Lance la fonction principale au démarrage
main();

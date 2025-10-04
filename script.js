// Sélectionne la colonne de gauche pour la liste des Pokémon
const conteneurPokemons = document.getElementById('conteneurPokemons');
// Sélectionne le template HTML pour un item dans la liste de gauche
const templateListe = document.getElementById('templateListe');

// Sélectionne le template HTML de la fiche à droite (détail)
const templatePokemon = document.getElementById('templatePokemon');
// Sélectionne l'élément résultat où on place la fiche à droite
const resultatRecherche = document.getElementById('resultatRecherche');
// Sélectionne l'input pour la barre de recherche en haut à droite
const barreRecherche = document.getElementById('barreRecherche');

// Fonction qui crée un item de la liste Pokémon (pour la colonne de gauche)
function creerItemListe(pokemon, callbackClick) {
  // Clone le template de la liste (structure modèle)
  const clone = templateListe.content.cloneNode(true);
  // Met le numéro du Pokémon (dans le span prévu)
  clone.querySelector('.numero-pokemon').textContent = pokemon.pokedexId;
  // Met le nom du Pokémon dans le bon span
  clone.querySelector('.nom-pokemon').textContent = pokemon.name;
  // Met l'image du Pokémon
  clone.querySelector('.mini-sprite').src = pokemon.sprite || pokemon.image;
  // Précise le texte alternatif de l'image pour l'accessibilité
  clone.querySelector('.mini-sprite').alt = pokemon.name;
  // Ajoute un événement au clic sur l'item : affiche la fiche détaillée à droite
  clone.querySelector('.item-liste').addEventListener('click', () => {
    callbackClick(pokemon.pokedexId);
  });
  // Retourne l'élément HTML prêt à insérer
  return clone;
}

// Fonction qui crée la liste des types (herbe, feu, etc.) d'un Pokémon
function creerTypes(types) {
  // Crée une liste HTML <ul> pour afficher chaque type
  const ulTpes = document.createElement('ul');
  // Ajoute la classe CSS spéciale pour le style
  ulTpes.classList.add('pokemon-types');
  // Pour chaque type du tableau...
  types.forEach(type => {
    // Crée un élément de liste <li>
    const liType = document.createElement('li');
    // Crée une image pour l'icône du type
    const imgType = document.createElement('img');
    // Attribue l’URL de l’icône à l’image
    imgType.src = type.image;
    // Attribue le nom comme texte alternatif (accessibilité)
    imgType.alt = type.name;
    // Ajuste la taille de l'image
    imgType.width = 24;
    imgType.height = 24;
    // Place l’icône dans la liste
    liType.appendChild(imgType);
    // Ajoute le nom du type juste à côté
    liType.append(` ${type.name}`);
    // Place ce <li> dans la <ul>
    ulTpes.appendChild(liType);
  });
  // Retourne toute la liste <ul> finie
  return ulTpes;
}

// Fonction pour afficher la section "évolutions" (Pokémon suivants)
function creerEvolutions(evolutions, callbackClick) {
  // Si pas d'évolutions ou tableau vide, on retourne rien
  if (!evolutions || evolutions.length === 0) return null;
  // Crée un conteneur <div> pour tout le bloc évolutions
  const divEvolutions = document.createElement('div');
  // Ajoute la classe CSS pour le style spécifique
  divEvolutions.classList.add('pokemon-evolutions');
  // Titre "Évolutions :"
  const titre = document.createElement('h4');
  titre.textContent = 'Évolutions :';
  // Ajoute le titre au bloc évolutions
  divEvolutions.appendChild(titre);
  // Crée une liste HTML <ul> pour toutes les évolutions
  const ulEvolutions = document.createElement('ul');
  // Pour chaque évolution proposée par l’API
  evolutions.forEach(evo => {
    // Crée l’entrée de la liste
    const liEvolution = document.createElement('li');
    // Nom cliquable (span)
    const spanClickable = document.createElement('span');
    spanClickable.textContent = evo.name;
    // Style bleu souligné comme un lien
    spanClickable.style.cursor = 'pointer';
    spanClickable.style.textDecoration = 'underline';
    // Quand on clique sur l'évolution, on affiche sa fiche dans la partie détail
    spanClickable.addEventListener('click', () => {
      callbackClick(evo.pokedexId || evo.id || evo.name);
    });
    // Ajoute le lien à la ligne
    liEvolution.appendChild(spanClickable);
    // Ajoute la ligne à la liste ul
    ulEvolutions.appendChild(liEvolution);
  });
  // Ajoute toute la liste <ul> au bloc évolutions
  divEvolutions.appendChild(ulEvolutions);
  // Retourne toute la section construite
  return divEvolutions;
}

// Fonction qui crée la grosse carte détaillée (fiche pokémon)
function creerPokemon(pokemon, callbackClick) {
  // Clone le template complet pour la fiche détaillée
  const clone = templatePokemon.content.cloneNode(true);
  // Image centrale du Pokémon
  clone.querySelector('.pokemon-image').src = pokemon.image;
  // Texte alternatif pour l'image (accessibilité)
  clone.querySelector('.pokemon-image').alt = pokemon.name;
  // Nom du Pokémon en gros titre
  clone.querySelector('.pokemon-nom').textContent = pokemon.name;
  // Numéro du pokémon type #25
  clone.querySelector('.pokemon-id').textContent = `#${pokemon.pokedexId}`;
  // Liste de tous ses types
  const conteneurTypes = clone.querySelector('.pokemon-types');
  // Pour chaque type, on ajoute l’icône + nom à la fiche
  pokemon.apiTypes.forEach(type => {
    const liType = document.createElement('li');
    const imgType = document.createElement('img');
    imgType.src = type.image;
    imgType.alt = type.name;
    imgType.width = 24;
    imgType.height = 24;
    liType.appendChild(imgType);
    liType.append(` ${type.name}`);
    conteneurTypes.appendChild(liType);
  });
  // Zone qui accueillera les évolutions
  const conteneurEvolutions = clone.querySelector('.pokemon-evolutions');
  // Crée et affiche la liste des évolutions
  const evolutionsElem = creerEvolutions(pokemon.apiEvolutions, callbackClick);
  // Si évolutions trouvées, on les affiche
  if (evolutionsElem) {
    conteneurEvolutions.appendChild(evolutionsElem);
  } else {
    // Sinon, on affiche "Pas d'évolution"
    conteneurEvolutions.textContent = 'Pas d\'évolution';
  }
  // Si on clique sur l'image centrale, on recharge la fiche (utile si besoin)
  clone.querySelector('.pokemon-image').addEventListener('click', () => {
    if (callbackClick) callbackClick(pokemon.pokedexId);
  });
  // Retourne toute la fiche formatée
  return clone;
}

// Fonction qui affiche la fiche/infos d'un Pokémon à droite
async function afficherPokemon(idOuNom) {
  try {
    // On demande à l’API les infos du Pokémon recherché (id ou nom)
    const res = await fetch(`https://pokebuildapi.fr/api/v1/pokemon/${idOuNom}`);
    if (!res.ok) throw new Error('Pokémon non trouvé');
    const data = await res.json();
    // On vide le détail précédent
    resultatRecherche.innerHTML = '';
    // On affiche la nouvelle fiche du pokémon
    const comp = creerPokemon(data, afficherPokemon);
    resultatRecherche.appendChild(comp);
  } catch (err) {
    // En cas d'erreur, message en rouge
    resultatRecherche.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// Fonction initiale, lancée au démarrage de la page
async function main() {
  // On télécharge toute la liste des 151 premiers Pokémon via l’API
  const reponse = await fetch('https://pokebuildapi.fr/api/v1/pokemon/limit/151');
  const donnees = await reponse.json();
  // Vide le conteneur pour être sûr de n’avoir aucun doublon
  conteneurPokemons.innerHTML = '';
  // Pour chaque Pokémon, crée un item dans la colonne gauche
  donnees.forEach(pokemon => {
    const comp = creerItemListe(pokemon, afficherPokemon);
    conteneurPokemons.appendChild(comp);
  });
  // Par défaut, affiche Bulbizarre (#1)
  afficherPokemon(1);
  // Sur changement de la barre de recherche : affiche le détail du Pokémon tapé
  barreRecherche.addEventListener('input', () => {
    const valeurRecherche = barreRecherche.value.trim().toLowerCase();
    // Si on vide la barre, ça efface la fiche
    if (!valeurRecherche) {
      resultatRecherche.innerHTML = '';
      return;
    }
    // Sinon, affiche le pokémon correspondant à ce texte
    afficherPokemon(valeurRecherche);
  });
}

// Démarre tout dès le chargement
main();
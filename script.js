// Variables globales
const conteneurPokemons = document.getElementById('conteneurPokemons');
const templateListe = document.getElementById('templateListe');
const templatePokemon = document.getElementById('templatePokemon');
const resultatRecherche = document.getElementById('resultatRecherche');
const barreRecherche = document.getElementById('barreRecherche');

let pokemonsList = []; 


function trouverPokemonParId(id) {
  return pokemonsList.find(p => p.pokedexId === id);
}

// Crée un item dans la liste à gauche
function creerItemListe(pokemon, callbackClick) {
  const clone = templateListe.content.cloneNode(true);
  clone.querySelector('.numero-pokemon').textContent = pokemon.pokedexId;
  clone.querySelector('.nom-pokemon').textContent = pokemon.name;
  clone.querySelector('.mini-image').src = pokemon.image;
  clone.querySelector('.mini-image').alt = pokemon.name;
  clone.querySelector('.item-liste').addEventListener('click', () => {
    callbackClick(pokemon.pokedexId);
  });
  return clone;
}

// Crée la liste des types
function creerTypes(types) {
  const h2Types = document.createElement('h2');
  h2Types.classList.add('pokemon-types');
  types.forEach(type => {
    const pType = document.createElement('p');
    const imgType = document.createElement('img');
    imgType.src = type.image;
    imgType.alt = type.name;
    imgType.width = 60;
    imgType.height = 60;
    pType.appendChild(imgType);
    pType.append(` ${type.name}`);
    h2Types.appendChild(pType);
  });
  return h2Types;
}

// Crée la liste des évolutions avec image, numéro et nom
function creerEvolutions(evolutions, callbackClick, currentId) {
  if (!evolutions || evolutions.length === 0) return null;
  const divEvolutions = document.createElement('div');
  divEvolutions.classList.add('evolutions-list');
  const titre = document.createElement('h4');
  titre.textContent = 'Evolution';
  divEvolutions.appendChild(titre);

  evolutions.forEach(evo => {
    if ((evo.pokedexId || evo.id) === currentId) return;

    const fullPokemon = trouverPokemonParId(evo.pokedexId || evo.id);

    const ligne = document.createElement("div");
    ligne.classList.add('evolution-item');
    ligne.style.backgroundColor = '#2d2d2d';
    ligne.style.gap = '10px';
    ligne.style.cursor = 'pointer';

    const spanNumero = document.createElement('span');
    spanNumero.classList.add('evolution-number');
    spanNumero.textContent = fullPokemon ? `${fullPokemon.pokedexId}` : '';
    spanNumero.style.minWidth = '40px';
    spanNumero.style.color = '#fff';
    spanNumero.style.fontWeight = 'bold';

    const imgEvo = document.createElement('img');
    imgEvo.classList.add('evolution-image');
    imgEvo.src = fullPokemon ? fullPokemon.image : '';
    imgEvo.alt = fullPokemon ? fullPokemon.name : evo.name;
    imgEvo.width = 42;
    imgEvo.height = 42;

    const spanNom = document.createElement('span');
    spanNom.classList.add('evolution-name');
    spanNom.textContent = evo.name;
    spanNom.style.color = '#fff';
    spanNom.style.fontSize = '1em';

    ligne.appendChild(spanNumero);
    ligne.appendChild(spanNom);
    ligne.appendChild(imgEvo);
    ligne.addEventListener('click', () => {
      callbackClick(evo.pokedexId || evo.id || evo.name);
    });

    divEvolutions.appendChild(ligne);
  });

  return divEvolutions;
}

// Crée la fiche détaillée d'un Pokémon
function creerPokemon(pokemon, callbackClick) {
  const clone = templatePokemon.content.cloneNode(true);
  clone.querySelector('.pokemon-image').src = pokemon.image;
  clone.querySelector('.pokemon-image').alt = pokemon.name;
  clone.querySelector('.pokemon-nom').textContent = pokemon.name;
  clone.querySelector('.pokemon-id').textContent = `N°${pokemon.pokedexId}`;

  const conteneurTypes = clone.querySelector('.pokemon-types');
  conteneurTypes.innerHTML = '';
  pokemon.apiTypes.forEach(type => {
    const pType = document.createElement('p');
    const imgType = document.createElement('img');
    imgType.src = type.image;
    imgType.alt = type.name;
    imgType.width = 80;
    imgType.height = 80;
    pType.appendChild(imgType);
    conteneurTypes.appendChild(pType);
  });

  const conteneurEvolutions = clone.querySelector('.pokemon-evolutions');
  conteneurEvolutions.innerHTML = '';
  const evolutionsElem = creerEvolutions(pokemon.apiEvolutions, callbackClick, pokemon.pokedexId);
  if (evolutionsElem) {
    conteneurEvolutions.appendChild(evolutionsElem);
  } else {
    conteneurEvolutions.textContent = 'Pas d\'évolution';
  }

  clone.querySelector('.pokemon-image').addEventListener('click', () => {
    if (callbackClick) callbackClick(pokemon.pokedexId);
  });

  return clone;
}

// Affiche la fiche détaillée d'un Pokémon
async function afficherPokemon(idOuNom) {
  try {
    const res = await fetch(`https://pokebuildapi.fr/api/v1/pokemon/${idOuNom}`);
    if (!res.ok) throw new Error('Pokémon non trouvé');
    const data = await res.json();
    resultatRecherche.innerHTML = '';
    const comp = creerPokemon(data, afficherPokemon);
    resultatRecherche.appendChild(comp);
  } catch (err) {
    resultatRecherche.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// Fonction principale
async function main() {
  const reponse = await fetch('https://pokebuildapi.fr/api/v1/pokemon/limit/151');
  pokemonsList = await reponse.json();
  conteneurPokemons.innerHTML = '';
  pokemonsList.forEach(pokemon => {
    const comp = creerItemListe(pokemon, afficherPokemon);
    conteneurPokemons.appendChild(comp);
  });
  afficherPokemon(1);
  barreRecherche.addEventListener('input', () => {
    const valeurRecherche = barreRecherche.value.trim().toLowerCase();
    if (!valeurRecherche) {
      resultatRecherche.innerHTML = '';
      return;
    }
    afficherPokemon(valeurRecherche);
  });
}

main();

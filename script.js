const pokemonList = document.getElementById("pokemonList");
const resultDiv = document.getElementById("searchResult");
const inputSearch = document.querySelector("#searchBar");
const pokemonImageElem = document.getElementById("pokemonImage");
const pokemonNameElem = document.getElementById("pokemonName");
const pokemonIdElem = document.getElementById("pokemonId");
const evolutionSection = document.getElementById("evolutionSection"); 
const evolutionListElem = document.getElementById("evolutionList");


async function main() {
  console.log("script loaded");
  // On fetch les données de l'API
  const response = await fetch(
    "https://pokebuildapi.fr/api/v1/pokemon/limit/151"
  );
  const data = await response.json();
  console.log(data);

  // On boucle sur les données et on crée les éléments HTML
  data.forEach((pokemon) => {
    const li = document.createElement("li");

    const spanId = document.createElement("span");
    spanId.textContent = `#${pokemon.pokedexId}`;

    const spanName = document.createElement("span");
    spanName.textContent = pokemon.name;

    const img = document.createElement("img");
    img.src = pokemon.sprite;
    img.alt = pokemon.name;

    li.appendChild(spanId);
    li.appendChild(spanName);
    li.appendChild(img);

    pokemonList.appendChild(li);
  });

  // Recherche de Pokémon par nom ou ID
  inputSearch.addEventListener("change", function () {
    const searchValue = inputSearch.value.trim();

    fetch("https://pokebuildapi.fr/api/v1/pokemon/" + searchValue)
      .then((res) => {
        if (!res.ok) throw new Error("Pokémon non trouvé");
        return res.json();
      })
      .then((pokemon) => {
        console.log(pokemon);
        resultDiv.innerHTML = `
          <ul>${pokemon.name}</ul>
          <img src="${pokemon.image}" alt="${pokemon.name}" width="150">
        `;
      })
      .catch((err) => {
        resultDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
      });
  });

//const mama = ()=> document.etc...

  // inputSearch.addEventListener("change", function () {
   
  //   fetch("https://pokebuildapi.fr/api/v1/types")
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Pokémon non trouvé");
  //       return res.json();
  //     })
  //     .then((pokemon) => {
  //      console.log(pokemon);

  //     // Création de la liste des types
  //     const typesHtml = pokemon.apiTypes
  //     .map(
  //     (t) =>
  //       `<li><img src="${t.image}" alt="${t.name}" width="30"> ${t.name}</li>`
  //     )
  //     .join("");

  // resultDiv.innerHTML = `
  //   <h2>${pokemon.name} (#${pokemon.pokedexId})</h2>
  //   <img src="${pokemon.image}" alt="${pokemon.name}" width="150">
  //   <ul>${typesHtml}</ul>
  // `;
  // });

// main();
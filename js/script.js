//variaveis com valores
let searchValue = null;
let allPokemon = [];
let numberFormat = null;

//variaveis com elementos
let searchInput = null;
let searchSubmit = null;
let searchForm = null;
let results = null
let modal = null;
let modalContent = null;
let load = null;


window.addEventListener('load', () => {
  searchInput = document.querySelector('#search');
  searchForm = document.querySelector('#form');
  searchSubmit = document.querySelector('#submit');
  results = document.querySelector('#results');
  modal = document.querySelector('#myModal');
  modalContent = document.querySelector('#modalC');
  load = document.querySelector('#load');

  searchInput.focus();
  searchInput.addEventListener('tap', () => {
    searchInput.focus();
  });

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.classList.remove("show");
    }
  });

  numberFormat = Intl.NumberFormat('pt-BR', {
    minimumIntegerDigits: 3
  })

  searchForm.addEventListener('submit', doSearch);
  //evita uma repetição de requisições
  if (localStorage.getItem('dofetch') !== 'true') {
    doFetch();
  } else {
    allPokemon = JSON.parse(localStorage.getItem('allPokemon'));
    render(allPokemon);
  }
});

function doSearch(event) {
  event.preventDefault();
  let valueSearch = searchInput.value.toLowerCase();
  filterPokemon = allPokemon.filter(poke => {
    return poke.name.includes(valueSearch);
  });
  render(filterPokemon);
}
async function doFetch() {
  const generalRes = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=807');
  const generalJson = await generalRes.json();
  allPokemon = generalJson.results;
  //tentar trocar por foreach
  for (let i = 0; i < allPokemon.length; i++) {
    const data = await getData(allPokemon[i].url);
    allPokemon[i] = data;
  }
  localStorage.setItem('dofetch', true);
  localStorage.setItem('allPokemon', JSON.stringify(allPokemon));
  render(allPokemon);
}


async function getData(link) {

  const pokeRes = await fetch(`${link}`);
  const pokeJson = await pokeRes.json();
  let pokemonData = null;
  pokemonData = {
    id: pokeJson.id,
    name: pokeJson.name,
    sprite: pokeJson.sprites.front_default,
    types: pokeJson.types,
    abilities: pokeJson.abilities,
    height: (pokeJson.height / 10),
    weight: (pokeJson.weight / 10),
    stats: pokeJson.stats
  }
  return pokemonData;
}


function render(param) {
  results.innerHTML = "";
  param.forEach(poke => {
    //cria a div com o pokémon e atribui a classe .poke à ela
    let div = document.createElement("div");
    div.classList.add("poke");


    //abre o modal quando a div for clicada
    div.addEventListener('click', () => {
      modal.innerHTML = `
      <div class="modal-content">

        <span class="close">&times;</span>

        <section class="principal">
        <img src='${poke.sprite}'>
        <section><span class="pokeID">#${format(poke.id)}</span>&nbsp${poke.name}</section>
        <section class="modalTypes">
        ${poke.types.map(_type => {
        return `<span class="type ${_type.type.name}">${_type.type.name}</span>`
      }).join('')}
        </section>
        </section>

        <section class="data">
        <section class="abilities">
        <span class="title">Abilities</span>
        ${poke.abilities.map(_ab => {
        return `<span>${_ab.ability.name}</span>`;
      }).join('')}
        </section>
        <section class="hw-eight">
        <span class="title">Characteristics</span>
        <span>height: ${poke.height}&nbspm</span>
        <span>weight: ${poke.weight}&nbspkg</span>
        </section>
        </section>

        <section class="stats">
        <span class="title">Stats</span>
        ${poke.stats.map(_stat => {
        return `<section><span class="nameStat">${_stat.stat.name}:</span><span class="valueStat">${_stat.base_stat}</span></section>`
      }).join('')}
        </section>

      </div>
      `
      modal.classList.add("show");
      let span = document.querySelector(".close");
      span.addEventListener('click', () => {
        modal.classList.remove("show");
      });
    });


    //trata o caso do pokémon não ter imagem
    if (poke.sprite === null) {
      poke.sprite = 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg';
    }

    //html da div
    div.innerHTML = `
    <section class='leftPoke'>
    <img src="${poke.sprite}">
    <span class="pokeName">${poke.name}</span>
    </section>
    <section class='rightPoke'>
    
    <span class="pokeID">#${format(poke.id)}</span>
    <section class="types">
    ${poke.types.map(_type => {
      return `<span class="type ${_type.type.name}">${_type.type.name}</span>`
    }).join('')}
    </section>
    `;

    results.appendChild(div);
  });

  load.style.display = "none";
  searchInput.classList.remove("blocked");
  searchSubmit.classList.remove("blocked");
}

function format(num) {
  return numberFormat.format(num);
}
const pokedex = document.querySelector('.list');

const fetchPokemon = () => {
    const promises = [];
    for (let i = 1; i <= 151; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }
    Promise.all(promises).then((results) => {
        const pokemon = results.map((result) => ({
            name: result.name,
            sprite: result.sprites['front_default'],
            icon: `https://img.pokemondb.net/sprites/black-white/normal/${result.name}.png `,
            iconanim: `https://img.pokemondb.net/sprites/black-white/anim/normal/${result.name}.gif `,
            image: `https://projectpokemon.org/images/normal-sprite/${result.name.replace(
				'-',
				'_'
			)}.gif `,
            type: result.types.map((type) => type.type.name).join(', '),
            typecss: result.types
                .map((type) => type.type.name)
                .join('); --type-secondary: var(--'),
            id: result.id,
        }));
        displayPokemon(pokemon);
    });
};

const displayPokemon = (pokemon) => {
    const pokemonList = pokemon
        .map(
            (pokeman) => `
        <div class="item" style="--type-primary:var(--${
			pokeman.typecss
		});" onclick="selectPokemon(${pokeman.id})">
            <div class="image">
                <img class="icon" src="${pokeman.icon}"/>
                <img class="iconanim" src="${pokeman.iconanim}"/>
            </div>
            <div class="info">
                <div class="id">${pokeman.id.toString().padStart(3, '0')}</div>
                <h2 class="name capitalize">${pokeman.name
					.replace('an-f', 'an ♀')
					.replace('an-m', 'an ♂')
					.replace('r-m', 'r.M')}</h2>
            </div>
        </div>
    `
        )
        .join('');
    pokedex.innerHTML = pokemonList;
};

const selectPokemon = async (id) => {
    const pksurl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    const pksres = await fetch(pksurl);
    const pks = await pksres.json();

    const pkmurl = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const pkmres = await fetch(pkmurl);
    const pkm = await pkmres.json();

    const type = pkm.types.map((type) => type.type.name).join(', ');

    const description = pks.flavor_text_entries.map(
        (text) => text['flavor_text']
    );
    const pokemonPopup = `
        <div class="pokemon-popup-wrapper">
        <div class="pokemon-popup" style="--type-primary:var(--${type.replace(
			', ',
			'); --type-secondary: var(--'
		)});">
            <div class="pokemon-popup-close" onclick="closePopup()"></div>
            <div class="image pt-4 -mx-4">
            <img src="https://img.pokemondb.net/sprites/go/normal/${
				pks.name
			}.png"/>
            </div>
            <div class="card">
                <div class="id text-center text-sm font-bold text-gray-500">#${pks.id.toString().padStart(3, '0')}</div>
                <h2 class="name capitalize text-center text-lg font-bold mb-3">${pks.name
					.replace('an-f', 'an ♀')
					.replace('an-m', 'an ♂')
					.replace('r-m', 'r.M')}</h2>
                <div class="type">
                    <span>${type.replace(', ', '</span><span>')}</span>
                </div>
                <p class="mt-3 text-gray-700">${description[3]}</p>
                <div class="carousel">
                    <div class="carousel-cell"><img src="${pkm.sprites['front_default']}" /></div>
                    <div class="carousel-cell"><img src="${pkm.sprites['back_default']}" /></div>
                    <div class="carousel-cell"><img src="${pkm.sprites['front_shiny']}" /></div>
                    <div class="carousel-cell"><img src="${pkm.sprites['back_shiny']}" /></div>
                </div>
            </div>
        </div>
        <div class="pokemon-popup-bg" onclick="closePopup()"</div>
        </div>
    `;
    document
        .querySelector('.pokedex-screen')
        .insertAdjacentHTML('beforeend', pokemonPopup);

    $('.carousel').flickity({
        prevNextButtons: false,
        wrapAround: true
    });
};

const closePopup = () => {
    const popup = document.querySelector('.pokemon-popup-wrapper');
    popup.parentElement.removeChild(popup);
};

fetchPokemon();

function pokedexOpen() {
    document.querySelector('.pokedex').classList.add('is-active');
}

function pokedexClose() {
    var popup = document.querySelector('.pokemon-popup-wrapper');
    if (typeof popup != 'undefined' && popup != null) {
        closePopup();
    }
    document.querySelector('.pokedex').classList.remove('is-active');
}
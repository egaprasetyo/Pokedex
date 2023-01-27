"use strict"

localStorage.setItem('currentId', 0);
localStorage.setItem('offset', 0);
$('#searchKey').val('');

const pokemonList = async(offset = 0, limit=20, idPokemon = 1) => {
    let url = 'https://pokeapi.co/api/v2/pokemon?offset=' + offset + '&limit=' + limit;

    try {
        let res = await fetch(url);
        let result = await res.json();
        let content = '';

        for(let key in result.results){
            let id = Number(key)+idPokemon;

            let pokemon = await getPokemonDetail(id);
            let pokemonImg = pokemon[0].img;
            let pokemonType = pokemon[0].type;
            
            let pokedex = await getPokedex(id);

            content += `
                <div class="col" data-aos="flip-left">
                    <div id="pokemonID" class="card h-100 rounded-2 border-light border-opacity-25 text-center" pokemonid=${id} style="background-color: #364C60;">
                        <img src="${pokemonImg}" class="card-img-top pokemonImg" alt="...">
                        <div class="card-body">
                            <p class="text-info">#${pokedex[0].index}</p>
                            <h5 class="card-title fw-bold mt-2 mb-2 text-white text-capitalize">${result.results[key].name}</h5>
                            ${
                                pokemonType.map(function(item){
                                    return `<span class="badge me-1 mb-1" style="background-color: ${typeBadgeColor(item.type)}; height: 23px; width:60px;">${item.type}</span>`
                                }).join("")
                            }
                            <p class="card-text text-white mt-2" style="opacity: 0.7">${pokedex[0].description}</p>
                        </div>
                    </div>
                </div>
            `
        }
        $('#content').append(content);
    } catch (error) {
        console.log(error);
    }
}

const getPokemonDetail = async(id) => {
    let url = 'https://pokeapi.co/api/v2/pokemon/' + id;
    
    try {
        let res = await fetch(url);
        let result = await res.json();
        let typePokemon = [];
        let pokemonDetail = [];

        for(let key in result.types){
            typePokemon.push({
                type: result.types[key].type.name
            });
        }

        pokemonDetail.push({
            type: typePokemon,
            img: result.sprites.front_default
        })

        return pokemonDetail;
    } catch (error) {
        console.log(error);
    }
}

const getPokedex = async (id) => {
    let url = 'https://pokeapi.co/api/v2/pokemon-species/' + id;
    
    try {
        let res = await fetch(url);
        let result = await res.json();
        
        let pokedex = result.pokedex_numbers[0].entry_number;
        let pokeDesc = result.flavor_text_entries[0].flavor_text;

        let detail = [];
        detail.push({
            index: pokedex,
            description: pokeDesc
        })

        return detail ;
    } catch (error) {
        console.log(error);
    }
}

const typeBadgeColor = (type) =>{
    if(type == "grass"){
        return "#78C850";
    } else if(type == "fire"){
        return "#F08030";
    } else if(type == "poison"){
        return "#A040A0";
    } else if(type == "flying"){
        return "#F85888";
    } else if(type == "normal"){
        return "#A8A878";
    } else if(type == "bug"){
        return "#A8B820";
    } else if(type == "water"){
        return "#6890F0"
    } else if(type == "electric"){
        return "#F8D030"
    } else if(type == "ice"){
        return "#98D8D8"
    } else if(type == "fighting"){
        return "#C03028"
    } else if(type == "ground"){
        return "#E0C068"
    } else if(type == "psychic"){
        return "#F85888"
    } else if(type == "rock"){
        return "#B8A038"
    } else if(type == "ghost"){
        return "#725B94"
    } else if(type == "dark"){
        return "#705848"
    } else if(type == "dragon"){
        return "#7038F8"
    } else if(type == "steel"){
        return "#B8B8D0"
    } else if(type == "fairy"){
        return "#EEB5BB"
    } else{
        return "#000"
    }
}

// Next
$(document).on('click', '.next', function(){
    $('#content').empty();
    $(".disabledToggle").removeClass('disabled');
    let limit = 20;
    let offset = Number(localStorage.getItem('offset')) + 20;
    let id = Number(localStorage.getItem('currentId')) + 20;
    localStorage.setItem("currentId", id);
    localStorage.setItem("offset", offset);

    pokemonList(Number(localStorage.getItem('offset')), limit, Number(localStorage.getItem('currentId')) + 1);
});

// Previous
$(document).on('click', '.previous', function(){

    if(localStorage.getItem('currentId') == 0){
        $(".disabledToggle").addClass('disabled');
        $(".pagination .disabled").css("color", "#ececec");
    } else{
        $('#content').empty();
        let limit = 20;
        let offset = Number(localStorage.getItem('offset')) - 20;
        let id = Number(localStorage.getItem('currentId')) - 20;
        localStorage.setItem("currentId", id);
        localStorage.setItem("offset", offset);
    
        pokemonList(Number(localStorage.getItem('offset')), limit, Number(localStorage.getItem('currentId')) + 1);
    }
});

// Search
$(document).on('click', '#btnSearch',function(){
    $('#content').empty();
    $('#contentSearch').empty();
    $('#content').attr('hidden', true);
    $('#contentSearch').attr('hidden', false);
    const searchKey = $('#searchKey').val();
    if(searchKey == ""){
        location.reload();
        return;
    } else{
        $.ajax({
            url: 'https://pokeapi.co/api/v2/pokemon/' + searchKey,
            type: 'GET',
            dataType: 'json',
            success: function(data){
                let content = '';
                content += `
                <div class="col d-flex justify-content-center">
                    <div id="pokemonID" class="card" style="width: 18rem;background-color: #364C60;">
                        <img src="${data.sprites.front_default}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title text-uppercase text-white fw-bold mt-2 mb-2">${data.name}</h5>
                            ${
                                data.types.map(function(item){
                                    return `<span class="badge me-1 mb-1" style="background-color: ${typeBadgeColor(item.type.name)}; height: 23px; width:60px;">${item.type.name}</span>`
                                }).join("")
                            }
                            <p class="card-text"></p>
                        </div>
                    </div>
                </div>
            `
                $('#contentSearch').append(content);
            },
            error: function(data){
                const errorMessage = data.responseText;

                let content = '';
                content += `
                    <div class="col d-flex justify-content-center">
                        <div id="pokemonID" class="card" style="width: 18rem;background-color: #364C60;">
                            <div class="card-body">
                                <h5 class="card-title text-uppercase text-white fw-bold mt-2 mb-2 text-center">${errorMessage}</h5>
                            </div>
                        </div>
                    </div>
                 `

                $('#contentSearch').append(content);
            },
        });
    }

});


pokemonList();
// console.log(getPokedex(2));
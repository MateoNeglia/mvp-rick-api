'use strict';



const d = document;
const searchInput = d.getElementById('search-input');
const searchButton = d.getElementById('search-button');
const responseContainer = d.getElementById('response-container');
const charactersContainer = d.getElementById('characters-container');
const episodesSearchInput = d.getElementById('episodes-search-input');
const episodesSearchButton = d.getElementById('episodes-search-button');

let charactersArray = [];
let favCharactersArray = [];
let loadingContainer = d.createElement('div');
let firstCall = false;

if (!navigator.onLine){        
  offlineNotification();
  if(searchInput && searchButton) {
    document.getElementById('logo-container').style.background = 'url(imgs/offline-logo.png) center center no-repeat';
    document.getElementById('search-input').placeholder = "I'm your doom Rick";
  } else if(episodesSearchButton || episodesSearchInput || charactersContainer){
    document.getElementById('logo-container').style.background = 'url(../imgs/offline-logo.png) center center no-repeat';
  }
  
  document.getElementById('main-header').className = 'dark-purple-bg';
  
} else {
document.getElementById('main-header').className = 'klein-blue-bg';
}

if(localStorage.favouriteCharactersArray && charactersContainer) {  
  favCharactersArray = JSON.parse(localStorage.favouriteCharactersArray);
  if(favCharactersArray.length > 0) {
    favCharactersArray.forEach((char) => {
      characterCardGenerator(char, 'favCharacters');    
    })
  } else {
    localStorage.clear();
  }
  
} else if (charactersContainer && !localStorage.favouriteCharactersArray) {
  let favCharDisclaimer = d.createElement('p');
  let homeLink = d.createElement('a');
  homeLink.href = '../index.html';
  homeLink.innerHTML = 'HOME';
  favCharDisclaimer.innerHTML = "Keep it up Kid, you first need to load your characters from the Character's Finder at ";
  favCharDisclaimer.style.color = "#f0f0f0";
  favCharDisclaimer.appendChild(homeLink);
  charactersContainer.appendChild(favCharDisclaimer);
}

if(searchButton) {
  searchButton.addEventListener('click', ()=>{
    

    if (firstCall) {
      d.querySelectorAll('.container-character-cards').forEach((element) => {
        element.remove();
      })
    }
    firstCall = true;
    
    let loadingImgOne = d.createElement('img');
    let loadingImgTwo = d.createElement('img');
    loadingImgOne.src = 'imgs/rick-animated.gif';
    loadingImgTwo.src = 'imgs/morty-animated.gif';
    loadingContainer.className = 'mt-5';
    loadingContainer.appendChild(loadingImgOne);
    loadingContainer.appendChild(loadingImgTwo);
    responseContainer.appendChild(loadingContainer);
    
    let inputValue = searchInput.value;
  
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },    
      body: JSON.stringify({
        query: queryConstructor(inputValue)
      })
    }
    
  
  
      fetch('https://rickandmortyapi.com/graphql', options)
      .then(function (response){
        return response.json();     
          
      }).then(function(json){
        
        let results = [];      
        results = json.data.characters.results;
        console.log('array de results ', results);
        if(results.length) {        
          results.forEach(element => {        
            characterCardGenerator(element, 'characterFinder');            
          })
        };
  
      }).finally(function(){
        
        loadingImgOne.remove();
        loadingImgTwo.remove();
        loadingContainer.remove();
        searchInput.value = '';
      })
      .catch(function (err){
          console.log('We had the following error: ', err);
      }) 
  
  
  });
}

if(searchInput || episodesSearchInput) {
  searchInput?.addEventListener('keypress', (event) => {    
    if (event.key === "Enter") {
        event.preventDefault();
        searchButton.click();
      }
  } )

  episodesSearchInput?.addEventListener('keypress', (event) => {    
    if (event.key === "Enter") {
        event.preventDefault();
        episodesSearchButton.click();
      }
  } )
} 

function queryConstructor(value) {
  return `query {
    characters(filter: { name: "${value}" }) {
      info {
        count
      }
      results {
        id
        name
        status
        species
        type
        gender
        origin {
          name          
          dimension
          type
          
        }
        image
        episode {
          id
          name
          episode
          air_date
          created
          characters {
            name
          }
  
        }
        location {
          name
          created         
          
        }
      }
    }
  }`
}


function characterCardGenerator(filteredData, pageDisplay) {

  let containerDiv = d.createElement('div');
  let card = d.createElement('div');
  let nameCont = d.createElement('h3');
  let imgCont = d.createElement('img');
  let episodeData = d.createElement('ul');
  let characterId = d.createElement('li');
  let characterStatus = d.createElement('li');
  let characterSpecies = d.createElement('li');
  let characterType = d.createElement('li');
  let characterGender = d.createElement('li');
  let characterOriginDimension = d.createElement('li');
  let characterOriginPlanet = d.createElement('li');
  let characterOriginType = d.createElement('li');
  let addCharacterButton = d.createElement('button');
  let removeCharacterButton = d.createElement('button');
  let typeRefactor = filteredData.type !== '' ? filteredData.type : 'unknown';
  let DimensionRefactor = filteredData.origin.dimension !== null ? filteredData.origin.dimension : 'unknown';
  let PlanetTypeRefactor = filteredData.origin.type !== null ? filteredData.origin.type : 'unknown';

  containerDiv.className = 'container-character-cards';
  card.className = 'card dark-grey-bg character-cards p-3 m-2';
  nameCont. innerHTML = filteredData.name;
  nameCont.className = 'card-title';
  imgCont.src = filteredData.image;
  imgCont.alt = filteredData.name;
  episodeData.className = 'mt-3';
  characterId.innerHTML = '<b>ID: </b>' + filteredData.id;
  let statusColorClass = filteredData.status == 'Alive' ? 'light-green-color' : 'light-red-color';
  characterStatus.innerHTML = `<b>Status: </b> <span class=${statusColorClass}>`+ filteredData.status + '</span>' ;


  characterSpecies.innerHTML = '<b>Species: </b>' + filteredData.species;
  characterType.innerHTML = '<b>Type: </b>' + typeRefactor;
  characterGender.innerHTML = '<b>Gender: </b>' + filteredData.gender;
  characterOriginDimension.innerHTML = '<b>Dimension of Origin: </b>' + DimensionRefactor;
  characterOriginPlanet.innerHTML = '<b>Place of Origin: </b>' + filteredData.origin.name;
  characterOriginType.innerHTML = '<b>Type of Origin: </b>' + PlanetTypeRefactor;


  //button for the finder display
  addCharacterButton.innerHTML = 'Add to Favourites';
  addCharacterButton.className = 'btn dark-purple-bg add-char-button';
  addCharacterButton.id = 'add-char-button';

  //button for the characters display
  removeCharacterButton.innerHTML = 'Remove from Favourites';
  removeCharacterButton.className = 'btn dark-purple-bg add-char-button';
  removeCharacterButton.id = 'remove-char-button';

  episodeData.appendChild(characterId);
  episodeData.appendChild(characterStatus);
  episodeData.appendChild(characterSpecies);
  episodeData.appendChild(characterType);
  episodeData.appendChild(characterGender);
  episodeData.appendChild(characterOriginDimension);
  episodeData.appendChild(characterOriginPlanet);
  episodeData.appendChild(characterOriginType);
  
  card.appendChild(nameCont);
  card.appendChild(imgCont);
  card.appendChild(episodeData);
  
  if(pageDisplay === 'characterFinder') {
    card.appendChild(addCharacterButton);
    containerDiv.appendChild(card);
    responseContainer.appendChild(containerDiv);
  }  

  if(pageDisplay === 'favCharacters') {
    card.appendChild(removeCharacterButton);
    containerDiv.appendChild(card);
    charactersContainer.appendChild(containerDiv);
  }

  addCharacterButton.addEventListener('click', () => {
    addtoFavourites(filteredData);
    
  })

  removeCharacterButton.addEventListener('click', () => {
    removeFromFavourites(filteredData);
    
  })

}


function addtoFavourites(character) {  
  if(localStorage.favouriteCharactersArray) {
    charactersArray = JSON.parse(localStorage.favouriteCharactersArray);       
    displayNotification('You added a Character to Favourites, good job!', 'home');
    charactersArray.push(character);
    let favouriteCharactersArray = JSON.stringify(charactersArray);
    localStorage.setItem('favouriteCharactersArray', favouriteCharactersArray);        
    
  } else if(!localStorage.favouriteCharactersArray) {    
    displayNotification('You added a Character to Favourites, good job!', 'home');
    charactersArray.push(character);
    let favouriteCharactersArray = JSON.stringify(charactersArray);
    localStorage.setItem('favouriteCharactersArray', favouriteCharactersArray);
  }     

}

function removeFromFavourites(character) {
  console.log('removing', character);
  let characterIndex = favCharactersArray.indexOf(character);  
  favCharactersArray.splice(characterIndex, 1);    
  let updatedFavCharacters = favCharactersArray;
  console.log('updated characters array from remov', updatedFavCharacters);
  if(updatedFavCharacters.length > 0) {
    let newFavourites = JSON.stringify(updatedFavCharacters);
    localStorage.setItem('favouriteCharactersArray', newFavourites);
    displayNotification("Deleted a Guy from Favs, I guess it wasn't working out anymore!", 'favs');
    location.reload();
  } else {
    localStorage.clear();
    location.reload();
  }

}

if(episodesSearchButton) {
  episodesSearchButton.addEventListener('click', () => {    
    if (firstCall) {
      d.querySelectorAll('.container-episode-cards').forEach((element) => {
        element.remove();
      })
    }
    firstCall = true;
    
    let loadingImgOne = d.createElement('img');
    let loadingImgTwo = d.createElement('img');
    loadingImgOne.src = '../imgs/rick-animated.gif';
    loadingImgTwo.src = '../imgs/morty-animated.gif';
    loadingContainer.className = 'mt-5';
    loadingContainer.appendChild(loadingImgOne);
    loadingContainer.appendChild(loadingImgTwo);
    responseContainer.appendChild(loadingContainer);
    let inputValue = episodesSearchInput.value;
  
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },    
      body: JSON.stringify({
        query: episodeQueryBuilder(inputValue)
      })
    }   
 
  
      fetch('https://rickandmortyapi.com/graphql', options)
      .then(function (response){        
        return response.json();     
        
      }).then(function(json){ 
        console.log('json',json);
        let results = [];      
        results = json.data.episodes.results;
        console.log('array de results ', results);
        if(results.length) {        
          results.forEach(element => {        
            episodeCardGenerator(element);      
          })
        };
  
      }).finally(function(){        
        loadingImgOne.remove();
        loadingImgTwo.remove();
        loadingContainer.remove();
        episodesSearchInput.value = '';
      })
      .catch(function (err){
          console.log('We had the following error: ', err);
      }) 
  
  
  }); 

}



function episodeQueryBuilder(value) {
  return `query {
    episodes(filter: {
      name: "${value}"
    }){
      info {
        count
      }
      results {
        name
        air_date
        episode       
        characters {
          name
          image
        }
      }
    }    
    }`
}


function episodeCardGenerator(episode) {
  let containerDiv = d.createElement('div');
  let card = d.createElement('div');
  let nameCont = d.createElement('h3');
  let episodeData = d.createElement('ul');
  let airDate = d.createElement('li');
  let episodeNumber = d.createElement('li');
  let episodeCharacters = d.createElement('h5');
  let episodeCharactersContainer = d.createElement('div');

  
  containerDiv.className = 'container-episode-cards';  
  card.className = 'card dark-grey-bg episode-cards p-3 m-2';
  nameCont. innerHTML = episode.name;
  nameCont.className = 'card-title light-blue-color';
  episodeData.className = 'mt-3';
  airDate.innerHTML = '<b>Air Date: </b>' + episode.air_date;
  episodeNumber.innerHTML = '<b>Episode Number: </b>' + episode.episode; 
  episodeCharacters.innerHTML = 'Characters on this Episode: ';
  episodeCharactersContainer.className = 'd-flex flex-wrap justify-content-center overflow-auto';

  episodeData.appendChild(airDate);
  episodeData.appendChild(episodeNumber)
  card.appendChild(nameCont);  
  card.appendChild(episodeData);  
  card.appendChild(episodeCharacters);
  episode.characters.forEach((character) => {    
    episodeCharactersContainer.appendChild(charactersPerEpisode(character));
  })
  card.appendChild(episodeCharactersContainer);
  containerDiv.appendChild(card);
  responseContainer.appendChild(containerDiv);

}

function charactersPerEpisode(character) {
  let characterList = d.createElement('div');
  let characterName = d.createElement('p');
  let characterPicture = d.createElement('img');
  characterName.innerHTML = character.name;
  characterName.style.marginBottom = '.2rem';
  characterPicture.src = character.image;
  characterPicture.alt = character.name;
  characterPicture.style.width = '100px';
  characterList.className = 'm-2';  
  characterList.appendChild(characterName);
  characterList.appendChild(characterPicture);
  return characterList;
}

function displayNotification(message, location ) {   
  let logoRickImg = d.createElement('img');
  let messageDisclaimer = d.createElement('p');

  location === 'home' ? logoRickImg.src = 'imgs/page-logo.png' : logoRickImg.src = '../imgs/page-logo.png';  
  messageDisclaimer.innerHTML = message;

  d.getElementById('notification-success').appendChild(logoRickImg);
  d.getElementById('notification-success').appendChild(messageDisclaimer);
  d.getElementById('notification-success').style.display = 'flex';
  
  setTimeout(
    removeDisplay, 1500
  );  

}

const removeDisplay = () => {  
  d.getElementById('notification-success').innerHTML = '';
  d.getElementById('notification-success').style.display = 'none';
  
}; 

function offlineNotification() {
  d.getElementById('offline-notification').style.display = 'block';
  setTimeout(
    () => {d.getElementById('offline-notification').style.display = 'none';}, 2000
  );  
}


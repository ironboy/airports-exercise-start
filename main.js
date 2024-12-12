// store - simplifies the usage of localStorage
let store;
try {
  store = JSON.parse(localStorage.store);
}
catch (e) {
  store = {};
}

store.save = function () {
  localStorage.store = JSON.stringify(this);
};


let airports = await $.ajax('airports.json');

// filter and sort airports (only North American Airports, ordered by name)
airports = airports
  .filter(airport => airport.continent === 'NA')
  .sort((a, b) => a.name > b.name ? 1 : -1);

// create an array with the codes of the users favorite airports
// in the store, if it doesn't exist already
if (!store.favorites) {
  store.favorites = [];
  store.save();
}

// ask the user if we are allowed to store persistant data
// (the airports that the user has chosen as favorites)
if (store.gdprConfirmation === undefined) {
  store.gdprConfirmation = confirm('Tillåter du att vi lagrar dina val av favoritflygplatser med cookie-liknande teknik? (Om inte klicka Avbryt)');
  store.save();
}

// set a class on the body if the gdprConfirmation is true
if (store.gdprConfirmation) {
  $('body').addClass('gdpr-ok');
}

function showAirports() {
  // empty the contents of body
  $('body').empty();
  // lop through the airports and add html to the body
  for (let { code, name, location, elevationFeet, continent, countryCode } of airports) {
    let favoriteClass = '';
    if (store.favorites.includes(code)) {
      favoriteClass = 'favorite'
    }
    $('body').append(`
      <article class="airport ${favoriteClass}">
        <h3>${name}</h3>
        <p>Code: <span class="code">${code}</span></p>
        <p>Location: ${location}</p>
        <p>Elevation (m) ${(elevationFeet * 0.3048).toFixed(2)}</p>
        <p>Continent: ${continent}</p>
        <p>Country code: ${countryCode}</p>
        <p>
          <img class="unfilled" src="images/star-unfilled.png">
          <img class="filled" src="images/star-filled.png">
        </p>
      </article>
    `);
  }
}

showAirports();

// do something on click on images/stars in an airport article
$(document).on('click', '.airport img', function () {
  // get the airport code corresponding to which img I've clicked
  let code = $(this).parents('.airport').find('.code').text();
  // if favorites does not include the code then add it
  if (!store.favorites.includes(code)) {
    store.favorites.push(code);
  }
  // otherwise the code is already in favorites so remove it
  else {
    store.favorites = store.favorites.filter(x => x !== code);
  }
  store.save();
  // show the airports again (with updated favorites)
  showAirports();
});
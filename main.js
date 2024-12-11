// store - simple usage of localStorage
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

// create the array store.favAirportCodes if it doesn't exist
if (!store.favAirportCodes) {
  store.favAirportCodes = [];
  store.save();
}

// read all airport data from the josn file
let allAirports = await $.ajax('airports.json');
// remove duplicates (won't be needed in similar exam assignment)
allAirports = [...new Set(allAirports.map(x => x.code))].map(code => allAirports.find(x => code === x.code));

// sort and filer airports (ordered by name, only North American Airports)
let airports = allAirports
  .sort((a, b) => a.name > b.name ? 1 : -1)
  .filter(airport => airport.continent === 'EU');

// a basic html structure (with table headers)
$('body').append(`
  <table class="airport-list">
    <thead>
      <tr>
        <th colspan="8"><h3>Airports</h3></th>
      <tr>
        <th>Code</th>
        <th>Name</th>
        <th>Location</th>
        <th colspan="2" class="align-center">Elevation</th>
        <th class="align-center">Continent</th>
        <th class="align-center">CountryCode</th>
        <th class="align-center">Favorite</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
`);

function showAirports() {
  // empty the html version of the airport list
  $('.airport-list tbody').empty();
  // loop throught all airports
  for (let { code, name, location, elevationFeet, continent, countryCode } of airports) {
    // set an elevation comment (High, Medium or Low)
    let elevationComment;
    if (elevationFeet > 2000) {
      elevationComment = 'High'
    }
    else if (elevationFeet > 300) {
      elevationComment = 'Medium';
    }
    else {
      elevationComment = 'Low'
    }
    // check if the airport is a favorite - if so add a favorite css class
    let favorite = '';
    if (store.favAirportCodes.includes(code)) {
      favorite = 'favorite'
    }
    // add html for the airport to the html version of the airport list
    $('.airport-list tbody').append(`
      <tr class="airport ${favorite}">
        <td>${code}</td>
        <td>${name}</td>
        <td>${location}</td>
        <td>${elevationComment}</td>
        <td class="align-right">${(elevationFeet * 0.3048).toFixed(0)} m</td>
        <td class="align-center">${continent}</td>
        <td class="align-center">${countryCode}</td>
        <td class="align-center star">
          <img class="star-unfilled" src="images/star-unfilled.png">
          <img class="star-filled" src="images/star-filled.png">
        </td>
      </tr>
    `);
  }
}

// when you click upon a star
$(document).on('click', '.star', function () {
  // get the airport code of the airport we clicked the favorite/star on
  let airportCode = $(this).parent().find('td').first().text();
  // remove or add the airport code to our stored favorite airport codes
  if (store.favAirportCodes.includes(airportCode)) {
    store.favAirportCodes = store.favAirportCodes.filter(x => x !== airportCode);
  }
  else {
    store.favAirportCodes.push(airportCode);
  }
  store.save();
  // show the airports again
  showAirports();
});

showAirports();
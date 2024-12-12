let airports = await $.ajax('airports.json');

// filter and sort airports (only North American Airports, ordered by name)
airports = airports
  .filter(airport => airport.continent === 'NA')
  .sort((a, b) => a.name > b.name ? 1 : -1);

function showAirports() {
  // empty the contents of body
  $('body').empty();
  // lop through the airports and add html to the body
  for (let { code, name, location, elevationFeet, continent, countryCode } of airports) {
    $('body').append(`
      <article class="airport">
        <h3>${name}</h3>
        <p>Code: <span class="code">${code}</span></p>
        <p>Location: ${location}</p>
        <p>Elevation (m) ${(elevationFeet * 0.3048).toFixed(2)}</p>
        <p>Continent: ${continent}</p>
        <p>Country code: ${countryCode}</p>
      </article>
    `);
  }
}

showAirports();
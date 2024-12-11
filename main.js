let airports = await $.ajax('airports.json');

// filter and sort airports (only North American Airports, ordered by name)
airports = airports
  .filter(airport => airport.contintent === 'NA')
  .sort((a, b) => a.name > b.name ? 1 : -1);


console.log(airports);
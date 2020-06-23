/**
 * @desc Abgabe 1 zur Übung 3, Geosoftware 1, SoSe 2020 auf Basis der Musterlösung von Abgabe 2
 * @author Malte Tiemann, m_tiem07@wwu.de
 */

//declaration of the global variable 'current' to use for currentPosition out of the scope of the function showPosition
var current = {};


/**
 * @function sortByDistance
 * @desc takes a point and an array of points and sorts them by distance ascending
 * @param point array of [lon, lat] coordinates
 * @param pointArray array of points to compare to
 * @returns Array with JSON Objects, which contain coordinate and distance
 */
function sortByDistance(point, pointArray) {
  let output = [];

  for (let i = 0; i < pointArray.features.length; i++) {
    let distance = twoPointDistance(point, pointArray.features[i].geometry.coordinates);
    let j = 0;
    //Searches for the Place
    while (j < output.length && distance > output[j].distance) {
      j++;
    }
    let newPoint = {
      coordinates: pointArray.features[i].geometry.coordinates,
      distance: distance
    };
    output.splice(j, 0, newPoint);
  }

  return output;
}

/**
 * @function displayParsedGeoJSON
 * @desc function that displays given text in it's corresponding div on the page
 * @param text String of the text that is to be displayed
 */
function displayParsedGeoJSON(text) {
  //replace line-breaks with according html
  text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
  //replace white space with according html
  text = text.replace(/\s/g, '&nbsp');
  document.getElementById('geoJSON').innerHTML = text;
}

/**
 * @function computeBearing
 * @desc takes two coordinates and calculates the bearing the first coordinate to the second.
 * uses the Haversine formula, based on https://www.igismap.com/formula-to-find-bearing-or-heading-angle-between-two-points-latitude-longitude/
 * @param start, array of [lon,lat] coordinates
 * @param end, array of [lon,lat] coordinates
 * @returns number, representing the bearing in degrees from start to end
 */
function computeBearing(start, end) {
  const earthRadius = 6371e3; //Radius
  let deltaLat = toRadians(end[1] - start[1]); //difference in latitude at start- and end-point. in radians.
  let deltaLon = toRadians(end[0] - start[0]); //difference in longitude at start- and end-point. in radians.

  let x = Math.cos(toRadians(end[1])) * Math.sin(deltaLon);
  let y = Math.cos(toRadians(start[1])) * Math.sin(toRadians(end[1])) -
    Math.sin(toRadians(start[1])) * Math.cos(toRadians(end[1])) *
    Math.cos(deltaLon);

  let bearing = Math.atan2(x, y);
  //convert bearing to degrees
  bearing = toDegrees(bearing);

  // (degrees + 360)%360 to map -180->180 to 0->360
  bearing = (bearing + 360) % 360;

  return bearing;
}

/**
 * @function twoPointDistance
 * @desc takes two geographic points and returns the distance between them. Uses the Haversine formula (http://www.movable-type.co.uk/scripts/latlong.html, https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)
 * @param start array of [lon, lat] coordinates
 * @param end array of [lon, lat] coordinates
 * @returns the distance between 2 points on the surface of a sphere with earth's radius
 */
function twoPointDistance(start, end) {
  //variable declarations
  var earthRadius; //the earth radius in meters
  var phi1;
  var phi2;
  var deltaLat;
  var deltaLong;

  var a;
  var c;
  var distance; //the distance in meters

  //function body
  earthRadius = 6371e3; //Radius
  phi1 = toRadians(start[1]); //latitude at starting point. in radians.
  phi2 = toRadians(end[1]); //latitude at end-point. in radians.
  deltaLat = toRadians(end[1] - start[1]); //difference in latitude at start- and end-point. in radians.
  deltaLong = toRadians(end[0] - start[0]); //difference in longitude at start- and end-point. in radians.

  a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  distance = earthRadius * c;

  return distance;
}

/**
 * @function validGeoJSONPoint
 * @desc funtion that validates the input GeoJSON so it'S only a point
 * @param geoJSON the input JSON that is to be validated
 * @returns boolean true if okay, false if not
 */
function validGeoJSONPoint(geoJSON) {
  if (geoJSON.features.length == 1 &&
    geoJSON.features[0].geometry.type.toUpperCase() == "POINT"
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * @function toRadians
 * @desc helping function, takes degrees and converts them to radians
 * @returns a radian value
 */
function toRadians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

/**
 * @function toDegrees
 * @desc helping function, takes radians and converts them to degrees
 * @returns a degree value
 */
function toDegrees(radians) {
  var pi = Math.PI;
  return radians * (180 / pi);
}

/**
 * @function bearingToCardinalDirection
 * @desc takes a bearing in degrees and returns a cardinal direction. e.g. "NE"
 * @param bearing degree value of direction
 * @returns string that describes cardinal direction
 */
function bearingToCardinalDirection(bearing) {
  if ((bearing >= 0 && bearing < 22.5) || (bearing >= 337.5 && bearing <= 360)) {
    return "N";
  } else if (bearing >= 22.5 && bearing < 67.5) {
    return "NE";
  } else if (bearing >= 67.5 && bearing < 112.5) {
    return "E";
  } else if (bearing >= 112.5 && bearing < 157.5) {
    return "SE";
  } else if (bearing >= 157.5 && bearing < 202.5) {
    return "S";
  } else if (bearing >= 202.5 && bearing < 247.5) {
    return "SW";
  } else if (bearing >= 247.5 && bearing < 292.5) {
    return "W";
  } else if (bearing >= 292.5 && bearing < 337.5) {
    return "NW";
  } else {
    return undefined;
  }
}

/**
 * @function getLocation
 * @desc function that requests the position of the browser
 */
function getLocation() {
  var x = document.getElementById("userPosition");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

/**
 * @function showPosition
 * @desc Shows the position of the user in the textarea
 * @param {*} position Json object of the user
 */


function showPosition(position) {
  var x = document.getElementById("userPosition");
  //"Skeleton" of a valid geoJSON Feature collection

  // I changed let outJSON to a global variable to use it for my getHaltestellen function
  current.outJSON = {
    "type": "FeatureCollection",
    "features": []
  };
  //skelly of a (point)feature
  let pointFeature = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": []
    }
  };
  pointFeature.geometry.coordinates = [position.coords.longitude, position.coords.latitude];
  //add the coordinates to the geoJson
  current.outJSON.features.push(pointFeature);
  x.innerHTML = JSON.stringify(current.outJSON);
  console.log(current.outJSON.features[0].geometry.coordinates);
  //added the call for displayLocation Function here
  navigator.geolocation.getCurrentPosition(displayLocation);
}


/**
 * @function Haltestelle
 * @desc Constructor for creating an new object 'Haltestelle'
 */

function Haltestelle(name, distance, direction, coords) {
  this.name = name;
  this.distance = distance;
  this.direction = direction;
  this.coords = coords;
}
/**
 * @function HeatStop
 * @desc Constructor for creating an new object 'Haltestelle'
 */

function HeatStop(long, lat) {
  this.long = long;
  this.lat = lat;
}

/*
function Abfahrt (abfahrtzeit) {
  this.abfahrtzeit = abfahrtzeit;
}
*/

/*
 * @desc function to sort the Haltestellen by distance
 * @param Haltestellen with the data from the fetch request
 * @source https://www.w3schools.com/js/js_array_sort.asp
 */
function sortHaltestellen(Haltestellen) {

  Haltestellen.sort(function(a, b) {
    return a.distance - b.distance
  });
}
/*
 * @desc creating a custum icon for Haltestllen markers
 */

var HaltestellenIcon = L.icon({
  iconUrl: 'images/stop.png',

  iconSize: [10, 10], // size of the icon
  iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
  popupAnchor: [3, -10] // point from which the popup should open relative to the iconAnchor
});


/*
 * @desc function to fetch the Haltestellen, create a new array and fill it with objects
 */

async function getHaltestellen() {
  const haltestellen_url = 'https://rest.busradar.conterra.de/prod/haltestellen/';
  const response = await fetch(haltestellen_url);
  const data = await response.json();
  var currentPosition = current.outJSON.features[0].geometry.coordinates;
  var Haltestellen = new Array();


  //Loop goes through the data from the fetch request and creates new objects within Haltestellen Array

  for (let i = 0; i < data.features.length; i++) {

    Haltestellen[i] = new Haltestelle(
      data.features[i].properties.lbez,
      twoPointDistance(currentPosition, data.features[i].geometry.coordinates),
      bearingToCardinalDirection(computeBearing(currentPosition, data.features[i].geometry.coordinates)),
      data.features[i].geometry.coordinates
    );

    sortHaltestellen(Haltestellen);

  }
  //  console.log(Haltestellen);

  for (var i = 0; i < Haltestellen.length; i++) {
    //console.log(Haltestellen[i].coords);


    marker = new L.marker([Haltestellen[i].coords[1], Haltestellen[i].coords[0]], {
      icon: HaltestellenIcon
    }).addTo(map);
    marker.bindPopup("Haltestelle: " + Haltestellen[i].name + "<br> Distanz von Ihrer Position: " + Haltestellen[i].distance + "m <br> Richtung: " + Haltestellen[i].direction)

  }

  console.log(Haltestellen);

  // creating a table consisting of name, distance and direction of the next 5 Haltestellen
  var rows = 1, // 3 cells per row
    table = "<table><tr>";

  // iterating through array and creating cells
  for (var i = 0; i < 5; i++) {
    table += "<td>" + Haltestellen[i].name + "</td>";
    table += "<td>" + Haltestellen[i].distance + "</td>";
    table += "<td>" + Haltestellen[i].direction + "</td>";

    // starting the next row of the table
    var nextrow = i + 1;
    if (nextrow % rows == 0 && nextrow != 5) {
      table += "</tr><tr>";
    }
  }
  table += "</tr></table>";

  // connecting the table to the corresponding container
  document.getElementById("closest_Haltestellen").innerHTML = table;


}

// function to display a heatmap of Haltestellen after getting the location of the user
async function showHeatmap() {
  const haltestellen_url = 'https://rest.busradar.conterra.de/prod/haltestellen/';
  const response = await fetch(haltestellen_url);
  const data = await response.json();
  var currentPosition = current.outJSON.features[0].geometry.coordinates;
  var Haltestellen = new Array();
  var HeatStops = new Array();
console.log(data);
console.log(data.features[0].geometry.coordinates[0]);
console.log(data.features[0].geometry.coordinates[1]);
  for (let i = 0; i < data.features.length; i++) {

    Haltestellen[i] = new Haltestelle(
      data.features[i].properties.lbez,
      twoPointDistance(currentPosition, data.features[i].geometry.coordinates),
      bearingToCardinalDirection(computeBearing(currentPosition, data.features[i].geometry.coordinates)),
      data.features[i].geometry.coordinates
    );

    sortHaltestellen(Haltestellen);

  }
//filling a new array with only lat long values of the haltestellen data gathered beforehand
  for (let i = 0; i < data.features.length; i++) {

    HeatStops[i] = new HeatStop(
      data.features[i].geometry.coordinates[0],
      data.features[i].geometry.coordinates[1]
    );

  }
  console.log(HeatStops);

  // throws a leaflet Error: Invalid LatLng object: (51.9574469, undefined) ???? Array is only filled with lat and long values
    var heat = L.heatLayer(HeatStops).addTo(map);

}


/**Adding a leaflet map to the page
 *contains only an OpenStreetMap Layer and is extended with markers by pressing the buttons on top of the page
 *API used for Geocoding is leaflet-control-Geocoder
 *source: https://github.com/perliedman/leaflet-control-geocoder
 */

var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  osm = L.tileLayer(osmUrl, {
    maxZoom: 18,
    attribution: osmAttrib
  }),
  //setup a map with the view centered in Münster
  map = new L.Map('map', {
    center: new L.LatLng(51.9606649, 7.6261347),
    zoom: 13
  });

//add OpenStreetMap layer to map
L.control.layers({
  'osm': osm.addTo(map)
});

// Adding address search to leaflet Map
L.Control.geocoder({
  placeholder: "Suchen...",
  collapsed: false
}).addTo(map);


/*
 * @desc Function to display the current location of the user on a map
 * @param position with the geolocation of the user
 * @return displays a marker on the map with an additional popup
 */
function displayLocation(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  var marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup("This is your current position: " + lng + " " + lat);
  marker.openPopup();;
  map.setView([lat, lng], 16);
}

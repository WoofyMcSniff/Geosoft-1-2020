/**Adding a leaflet drawmap to the page
 *contains the draw tools and and the drawn features can be written into the text area below by pressing a button on the sidemap
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
  drawmap = new L.Map('drawmap', {
    center: new L.LatLng(51.9606649, 7.6261347),
    zoom: 13
  });
/** Feature group where the drawn items get saved to , the user can copy this
 * data from a text file in GeoJSON format
 *
 * @type {L.FeatureGroup}
 */
var drawnItems = new L.FeatureGroup();

drawmap.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  }
});
drawmap.addControl(drawControl);

/**Function that reads the layer with the drawn files , converts them to GeoJSON
 * an writes this data into a text area
 */
function exportGeoJSON() {

  var x = document.getElementById("drawGeoJSON");
  var data = drawnItems.toGeoJSON(); // Array data wird zwar erstellt, aber ist leer, ich weiß nicht wie ich die richtigen Daten zu erstellung des GeoJSON extrahieren kann
  console.log(drawnItems);
  console.log(data);


  x.innerHTML = JSON.stringify(data);

}


//add OpenStreetMap layer to map
L.control.layers({
  'osm': osm.addTo(drawmap)
});

// Adding address search to leaflet Map
L.Control.geocoder({
  placeholder: "Suchen...",
  collapsed: false
}).addTo(drawmap);

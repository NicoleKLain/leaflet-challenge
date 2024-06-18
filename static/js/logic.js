// Create a map centered somewhere in Kansas with zoom level 4
var map = L.map('map').setView([39.7749, -100.4194], 5);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Make an API call to retrieve the earthquake all summary data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


fetch(link)
  .then(response => response.json())
  .then(data => {
    // Loop through the features and add markers to the map
    data.features.forEach(function(feature) {
      var magnitude = feature.properties.mag;
      var depth = feature.geometry.coordinates[2];

      var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        radius: magnitude * 5, // Adjust the multiplier for better visualization
        fillColor: getColor(depth), // Function to determine color based on depth
        color: '#000',
        weight: 1,
        fillOpacity: 0.7
      }).addTo(map);

      marker.bindPopup(`<b>${feature.properties.place}</b><br>Magnitude: ${magnitude}<br>Depth: ${depth}`); // Add popup with info
    });
  })
  .catch(error => console.error('Error fetching earthquake data:', error));

// Function to determine color based on depth with a color gradient from light green to red based on different depth levels
function getColor(depth) {
  if (depth <= 10) {
    return '#00FF80'; 
  } else if (depth <= 30) {
    return '#ADFF2F'; 
  } else if (depth <= 50) {
    return '#FFFF00'; 
  } else if (depth <= 70) {
    return '#FFA500'; 
  } else if (depth <= 90) {
    return '#FF6347'; 
  } else {
    return '#FF0000'; 
  }
}


// Define the legend content and position
var legend = L.control({ position: 'bottomright' });
// Define the legend range
legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend');
  var depths = [-10, 10, 30, 50, 70, 90]; 
  var labels = [];
  // Loop through depth ranges to generate labels with corresponding colors
  for (var i = 0; i < depths.length; i++) {
    var from = depths[i];
    var to = depths[i + 1];
    labels.push(
      '<i style="background:' + getColor(from + 1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
  }
  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(map);
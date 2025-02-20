// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map


// Create the map object with center and zoom options.
let myMap = L.map("map", {
  center: [39.8283, -98.5795], // Center of the USA
  zoom: 5,
  layers: [basemap] // Start with the basemap layer
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(myMap);
// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(features) {
    return {
      radius: getRadius(features.properties.mag), // Get radius based on magnitude
      fillColor: getColor(features.geometry.coordinates[2]), // Get color based on depth
      color: "#000", // Outline color
      weight: 1, // Outline weight
      opacity: 1, // Outline opacity
      fillOpacity: 0.6 // Fill opacity
    };
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    if (depth > 90) {
      return "#FF0000"; // Red for deep earthquakes
    } else if (depth > 70) {
      return "#FF7F00"; // Orange for moderately deep earthquakes
    } else if (depth > 50) {
      return "#FFFF00"; // Yellow for slightly deep earthquakes
    } else if (depth > 30) {
      return "#CCFF00"; // Lighter green for shallow earthquakes
    } else if (depth > 10) {
      return "#66FF00"; // Light green for very shallow earthquakes
    } else {
      return "#00FF00"; // Green for the shallowest earthquakes
    }
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    return magnitude * 4; // Scale radius by a factor
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (features, layer) {
      layer.bindPopup("Magnitude: " + features.properties.mag + "<br>Location: " + features.properties.place);
    }
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(myMap);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
  
    // Set the background color and other styles for the legend
    div.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; // White background with some transparency
    div.style.padding = "10px"; // Add some padding for better spacing
    div.style.borderRadius = "5px"; // Optional: Add rounded corners
    div.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)"; // Optional: Add a shadow for better visibility
  
    // Initialize depth intervals and colors for the legend
    const depthIntervals = [-10, 10, 30, 50, 70, 90];
    const colors = ["#00FF00", "#66FF00", "#CCFF00", "#FFFF00", "#FF7F00", "#FF0000"];
  
    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depthIntervals.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        (depthIntervals[i] ? depthIntervals[i] + (depthIntervals[i + 1] ? '&ndash;' + depthIntervals[i + 1] + ' km' : '+ km') : depthIntervals[0]+'&ndash;'+depthIntervals[1]+ ' km') + '<br>';
    }
  
    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(myMap);

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  //d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.


    // Then add the tectonic_plates layer to the map.

 // });
});

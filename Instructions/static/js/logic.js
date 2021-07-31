function getMag(mag) {
    if (mag==0) {
        return 1
    }
    return mag*5
}

function getDepth(depth) {
    if (depth>90) {
        return "red"
    } 
    else if (depth>70) {
        return "tomato"
    }
    else if (depth>50) {
        return "orange"
    }
    else if (depth>30) {
        return "yellow"
    }
    else if (depth>10) {
        return "yellowgreen"
    }
    else return "green"
}

function createMap(eqStations) {

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
      });

    var baseMaps = {
      "Light Map": lightmap,
      "Satellite Map": satellitemap
    };
  
    var overlayMaps = {
      "Earthquake Stations": eqStations
    };
  
    var map = L.map("map", {
      center: [0, 0],
      zoom: 2,
      layers: [lightmap, eqStations]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(response) {
  
    var features = response.features;
  
    var eqMarkers = [];
  
    for (var index = 0; index < features.length; index++) {
      var feature = features[index];
  
      var eqMarker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          radius:getMag(feature.properties.mag), 
          fillColor: getDepth(feature.geometry.coordinates[2]),
          fillOpacity: .5,
          color: "white",
          weight: 7,
          opacity: .5,
          stroke: false
      })
        .bindPopup("<h3>Depth: " + feature.geometry.coordinates[2] + "</h3><h3>Magnitude: " + feature.properties.mag + "</h3>");
  
      eqMarkers.push(eqMarker);
    }
  
    createMap(L.layerGroup(eqMarkers));
}

function createLegend(response){
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 30, 50, 70, 90],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getDepth(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    createLegend(legend.addTo(map));
  
  }

//   console.log("test")
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(createMarkers);
  
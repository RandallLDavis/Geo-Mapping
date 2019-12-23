var monthlyEQurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

var geoJsonEQ = "GeoJSON/PB2002_boundaries.json";

var EQAPI = monthlyEQurl + geojson

d3.json(EQAPI, function(response) {
  console.log(response);
  createFeatures(data.features);
});

function createFeatures(EQdata) {
    var earthquakes = L.geoJSON(EQdata, {
        pointToLayer: function (feature, latlng) {
          var geojsonMarkers = {
            radius: 10,
            stroke: false,
            radius: markerSize(feature),
            fillColor: "blue",
            weight: 5,
            opacity: .75,
            fillOpacity: .60
          };
          return L.circleMarker(latlng, geojsonMarkers);
        },
  
        onEachFeature: function (feature, layer) {
          return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
        }
      });

      var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
      });
      
      var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
      });
      
      var baseMaps = {
        "Satellite": satelliteMap,
        "Grayscale": lightMap,
      };

      var overlayMaps = {
        "Plates": plates,
        "Earthquakes": earthquakes,
      };
  
      var map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [satelliteMap, lightMap, plates, earthquakes]
      });
  
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);
  
      var legend = L.control({ position: "bottomright" });
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson.options.limits;
        var colorlabel = geojson.options.colors;
        var textlabel = [];
  
        var color =  "<ul>" + color.join("") + "</ul>";
        var text = `<div id="labels-text">${text.join("<br>")}</div>`;
  
        var legendInfo = "<h1>Earthquake<br>Magnitude</h1>" +
          "<div class=\"labels\">" + color + text
          "</div>";
        div.innerHTML = legendInfo;
  
        limits.forEach(function(limit, index) {
          textlabel.push("<li style=\"background-color: " + colorlabel[index] + "\"></li>");
        });

        return div;
  
      legend.addTo(map);
}};
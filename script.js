// Initialize the map
var map = L.map('map').setView([46.603354, 1.888334], 6);

// Base layers
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var satelliteLayer = L.tileLayer('http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Map data: &copy; <a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">ESRI</a>'
}).addTo(map);

// var srtmLayer = L.tileLayer.wms("https://ows.terrestris.de/osm/service?", {
//     layers: 'SRTM30-Colored-Hillshade',
//     format: 'image/png',
//     transparent: true,
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);


// Layer control
var baseLayers = {
    "OpenStreetMap": osmLayer,
    "Satellite": satelliteLayer
    // "SRTM Elevation": srtmLayer
};

// L.control.layers(baseLayers).addTo(map);

// Add scale control
L.control.scale().addTo(map);

// Add Leaflet.draw control to draw polygons
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
    },
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);
    updateGrid(layer);
});

map.on('draw:edited', function (event) {
    var layers = event.layers;
    layers.eachLayer(function (layer) {
        updateGrid(layer);
    });
});

// Handle mode selector
document.addEventListener("DOMContentLoaded", function () {
    const modeSelector = document.getElementById("modeSelector");
    const manualModeDiv = document.getElementById("manualMode"); // Mode manuel
    const autoModeDiv = document.getElementById("autoMode");   // Mode auto

    // Fonction pour mettre à jour l'affichage des divs en fonction du mode sélectionné
    function updateModeDisplay() {
        const selectedMode = modeSelector.value;

        if (selectedMode === "manual") {
            manualModeDiv.style.display = "block"; // Afficher le mode manuel
            autoModeDiv.style.display = "none";   // Masquer le mode auto
        } else {
            manualModeDiv.style.display = "none";   // Masquer le mode manuel
            autoModeDiv.style.display = "block"; // Afficher le mode auto
        }     
        updateGrid(drawnItems.getLayers()[0]);       
    }

    // Initialiser l'affichage selon l'option par défaut (automatique)
    modeSelector.value = "auto";
    updateModeDisplay();

    // // Écouteur pour les sliders du mode automatique
    // document.getElementById("altitudeSlider").addEventListener("input", function () {
    //     document.getElementById("altitudeValue").innerText = this.value;
    // });

    // document.getElementById("overlapHSlider").addEventListener("input", function () {
    //     document.getElementById("overlapHValue").innerText = this.value;
    // });

    // document.getElementById("overlapVSlider").addEventListener("input", function () {
    //     document.getElementById("overlapVValue").innerText = this.value;
    // });

    // document.getElementById("lineOffsetSlider").addEventListener("input", function () {
    //     document.getElementById("lineOffsetValue").innerText = this.value;
    // });

    // Écouter les changements sur le sélecteur de mode
    modeSelector.addEventListener("change", updateModeDisplay);
});

// Initialize sliders and displays
var sliders = {
    spacing: {
        element: document.getElementById('spacingSlider'),
        display: document.getElementById('spacingValue')
    },
    orientation: {
        element: document.getElementById('orientationSlider'),
        display: document.getElementById('orientationValue')
    },
    density: {
        element: document.getElementById('densitySlider'),
        display: document.getElementById('densityValue')
    },
    height: {
        element: document.getElementById('heightSlider'),
        display: document.getElementById('heightValue')
    },
    autoHeight: {
        element: document.getElementById('altitudeSlider'),
        display: document.getElementById('altitudeValue')
    },
    overlapH: {
        element: document.getElementById('overlapHSlider'),
        display: document.getElementById('overlapHValue')
    },
    overlapV: {
        element: document.getElementById('overlapVSlider'),
        display: document.getElementById('overlapVValue')
    },
    offset: {
        element: document.getElementById('lineOffsetSlider'),
        display: document.getElementById('lineOffsetValue')
    }
};

// Initialize the sliders
var spacingSlider = document.getElementById('spacingSlider');
var orientationSlider = document.getElementById('orientationSlider');
var densitySlider = document.getElementById('densitySlider');
var heightSlider = document.getElementById('heightSlider');
var altitudetSlider = document.getElementById('autoHeightSlider');
var overlapHSlider = document.getElementById('overlapHSlider');
var overlapVSlider = document.getElementById('overlapVSlider');
var slideSlider = document.getElementById('lineOffsetSlider');



// Function to update the background gradient and display value
function updateSlider(slider) {
    var value = (slider.element.value - slider.element.min) / (slider.element.max - slider.element.min) * 100;
    slider.element.style.background = 'linear-gradient(to right, #6b8dff 0%, #ff2a5f ' + value + '%, #fff ' + value + '%, #fff 100%)';
    slider.display.innerHTML = slider.element.value;
}

// Attach the function to the 'input' event of each slider and call it once at page load
for (var key in sliders) {
    if (sliders.hasOwnProperty(key)) {
        var slider = sliders[key];
        slider.element.oninput = (function(slider) {
            return function() {
                updateSlider(slider);
            };
        })(slider);

        // Call the function once at page load
        updateSlider(slider);
    }
}

// Listen for slider changes
spacingSlider.addEventListener('input', function () {
    console.log("Hello world!")
    updateGrid(drawnItems.getLayers()[0]);
});
orientationSlider.addEventListener('input', function () {
    updateGrid(drawnItems.getLayers()[0]);
});
densitySlider.addEventListener('input', function () {
    updateGrid(drawnItems.getLayers()[0]);
});
heightSlider.addEventListener('input', function () {
    updateGrid(drawnItems.getLayers()[0]);
});
altitudeSlider.addEventListener('input', function () {
    updateGrid(drawnItems.getLayers()[0]);
});
overlapHSlider.addEventListener('input', function () {
    updateGrid(drawnItems.getLayers()[0]);
});
overlapVSlider.addEventListener('input', function () {
    updateGrid(drawnItems.getLayers()[0]);
});
slideSlider.addEventListener('input', function () {
    updateGrid(drawnItems.getLayers()[0]);
});
document.getElementById('droneModelSelector').addEventListener("change", function () {
    updateGrid(drawnItems.getLayers()[0]);
});

var wayPts = [];
var takeOffPoint = null;
var takeOffMode = false; // Mode for placing the takeoff point

// Add takeoff button functionality
document.getElementById('takeOffBtn').addEventListener('click', function() {
    takeOffMode = !takeOffMode;
    this.innerText = takeOffMode ? 'Cancel TakeOff Point' : 'Place TakeOff Point';
});

// Handle map click event for placing the takeoff point
map.on('click', function(e) {
    if (takeOffMode) {
        if (takeOffPoint) {
            drawnItems.removeLayer(takeOffPoint);
        }
        takeOffPoint = L.marker(e.latlng, {
            icon: L.divIcon({
                className: 'mytakeOff',
                html: '<div style="background-color: green; width: 15px; height: 15px; border-radius: 50%;"></div>'
            })
        }).addTo(drawnItems);
        takeOffMode = false;
        document.getElementById('takeOffBtn').innerText = 'Place TakeOff Point';
        // updateGrid(drawnItems.getLayers()[0]);
    }
});

function updateGrid(polygon) {
    wayPts = [];
    if (!polygon) return;

    // Clear existing grid and markers
    drawnItems.eachLayer(function (layer) {
        if (layer.options.color === 'orange' || layer.options.color === 'green' || layer.options.color === 'white' || (layer instanceof L.Marker && layer.options.icon.options.className === 'my-div-icon' || layer instanceof L.Marker && layer.options.icon.options.className === 'my-line-index-icon')) {
            drawnItems.removeLayer(layer);
        }
    });

    // Add takeoff point if exists
    if (takeOffPoint) {
        takeOffPoint.addTo(drawnItems);
        wayPts.push(takeOffPoint.getLatLng());
    }

    var spacing = parseFloat(spacingSlider.value);
    var orientation = parseFloat(orientationSlider.value);
    var density = parseFloat(densitySlider.value);
    var height = parseFloat(heightSlider.value);
    var altitude = parseFloat(altitudeSlider.value);
    var overlapH = parseFloat(overlapHSlider.value);
    var overlapV = parseFloat(overlapVSlider.value);
    var slide = parseFloat(slideSlider.value);

    // Calculate the barycenter of the polygon
    var latlngs = polygon.getLatLngs()[0];
    var centroid = getCentroid(latlngs);

    // Get the bounds of the polygon
    var bounds = polygon.getBounds();
    var minLat = bounds.getSouth();
    var maxLat = bounds.getNorth();
    var minLng = bounds.getWest();
    var maxLng = bounds.getEast();

    // Calculate the direction vector for the spacing and the perpendicular vector for the lines
    var orientationRad = orientation * Math.PI / 180;
    var perpendicularOrientationRad = (orientation + 90) * Math.PI / 180;

    var dx = Math.cos(perpendicularOrientationRad) * spacing / 111320; // Spacing in degrees latitude
    var dy = Math.sin(perpendicularOrientationRad) * spacing / (111320 * Math.cos(minLat * Math.PI / 180)); // Spacing in degrees longitude

    // Calculate the extent of the bounding box in the direction of the perpendicular vector
    var maxExtent = Math.max(bounds.getNorthEast().distanceTo(bounds.getSouthWest()), bounds.getNorthWest().distanceTo(bounds.getSouthEast()));

    // Function to calculate the length of the polygon's diagonal
    function getPolygonDiagonal(polygon) {
        var bounds = polygon.getBounds();
        return bounds.getNorthEast().distanceTo(bounds.getSouthWest());
    }

    // Adjust the starting point of the lines to ensure they traverse the entire polygon
    var polygonDiagonal = getPolygonDiagonal(polygon);

    let cameraOptions = [
                {name: 'DJI Mavic 3 E', sensorWidth: 17.3, focalLength: 12.01, imageWidth: 5280, imageHeight: 3956}, //checked DNG
                {name: 'DJI Mini 3 Pro', sensorWidth: 9.7, focalLength: 6.97, imageWidth: 4032, imageHeight: 3024}, //checked DNG
                {name: 'DJI Mini 2', sensorWidth: 6.3, focalLength: 4.49, imageWidth: 4000, imageHeight: 3000}, //checked DNG
                {name: 'DJI Mavic Mini', sensorWidth: 6.3, focalLength: 4.49, imageWidth: 4000, imageHeight: 3000}, //checked DNG
                {name: 'DJI Mini SE', sensorWidth: 6.3, focalLength: 4.49, imageWidth: 4000, imageHeight: 3000}, //checked DNG
                {name: 'DJI Air 2S', sensorWidth: 13.2, focalLength: 8.4, imageWidth: 5472, imageHeight: 3648}, //checked DNG
                {name: 'DJI Mavic Air', sensorWidth: 13.2, focalLength: 4.7, imageWidth: 4056, imageHeight: 3040}, //checked DNG
                {name: 'DJI Mavic Air 2', sensorWidth: 6.3, focalLength: 4.49, imageWidth: 8000, imageHeight: 6000}, //checked DNG
                {name: 'DJI Mavic 2 Pro', sensorWidth: 13.2, focalLength: 10.3, imageWidth: 5472, imageHeight: 3648}, //checked DNG
                {name: 'DJI Mavic 2 Zoom', sensorWidth: 6.3, focalLength: 8.6, imageWidth: 4000, imageHeight: 3000}, //checked DNG
                {name: 'DJI Phantom 3', sensorWidth: 6.3, focalLength: 3.61, imageWidth: 4000, imageHeight: 3000}, //all models similar photo specs
                {name: 'DJI Phantom 4', sensorWidth: 6.3, focalLength: 3.61, imageWidth: 4000, imageHeight: 3000}, //confirmed multiple places
                {name: 'DJI Phantom 4 Pro / 2.0 / Advanced', sensorWidth: 13.2, focalLength: 8.8, imageWidth: 5472, imageHeight: 3648}, //checked DNG, all drones same camera
            ];
    // Obtenez les paramètres de la caméra du drone sélectionné
    var droneModelSelector = document.getElementById('droneModelSelector');
    var selectedDroneName = droneModelSelector ? droneModelSelector.value : "";

    // Affichez la valeur sélectionnée pour le débogage
    console.log("Drone sélectionné :", selectedDroneName);

    var drone = cameraOptions.find(camera => camera.name === selectedDroneName);

    // Vérifiez si le drone est défini
    if (!drone) {
        console.error("Drone non trouvé ou sélection invalide. Veuillez sélectionner un drone valide.");
        return; // Arrête l'exécution si le drone est indéfini
    }

    console.log(drone);

    // Récupérez les paramètres nécessaires
    var sensorWidth = drone.sensorWidth;
    var focalLength = drone.focalLength;
    var imageWidth = drone.imageWidth;
    var imageHeight = drone.imageHeight;

    // Récupérez la valeur du slider d'altitude
    var altitude = parseFloat(altitudeSlider.value); // en mètres    

    // Calculez sensorHeight
    var sensorHeight = (sensorWidth * imageHeight) / imageWidth; // en mm

    // Calculez les dimensions de l'emprise de la photo au sol
    var h = (sensorWidth * altitude) / focalLength; // en mètres
    var v = (sensorHeight * altitude) / focalLength; // en mètres
    

   // Generate the lines within the polygon - autoMode or manualMode
    var modeSelector = document.getElementById("modeSelector");
    var selectedMode = modeSelector.value;
    var lines = [];    
    var offset = -maxExtent / 2 - polygonDiagonal; // Start far enough outside the polygon 
    var slideLat = (slide * Math.cos(perpendicularOrientationRad)) / 111320;
    var slideLng = (slide * Math.sin(perpendicularOrientationRad)) / (111320 * Math.cos(minLat * Math.PI / 180));

    if (selectedMode === "manual") {

        while (offset <= maxExtent / 2 + polygonDiagonal) {
            var lineStart = movePoint(centroid, dx * offset, dy * offset);
            var lineEnd = movePoint(lineStart, polygonDiagonal * Math.cos(orientationRad) / 111320, polygonDiagonal * Math.sin(orientationRad) / (111320 * Math.cos(minLat * Math.PI / 180)));

            // Ensure the line extends in both directions
            var extendedLineStart = movePoint(lineStart, -polygonDiagonal * Math.cos(orientationRad) / 111320, -polygonDiagonal * Math.sin(orientationRad) / (111320 * Math.cos(minLat * Math.PI / 180)));
            var extendedLineEnd = lineEnd;

            var line = [extendedLineStart, extendedLineEnd];
            // console.log(line);

            // slide lines      
            line[0].lat += slideLat*3;
            line[0].lng += slideLng*3;
            line[1].lat += slideLat*3;
            line[1].lng += slideLng*3;

            if (lineIntersectsPolygon(line, polygon)) {
                lines.push(line);
            }

            offset += spacing/10;        
        }
        
    } else if (selectedMode === "auto") {
        // Mode automatique, comme précédemment
        var interval = -maxExtent / 2 - polygonDiagonal;
        console.log(interval);
            
        var droneModelSelector = document.getElementById('droneModelSelector');
        var selectedDroneName = droneModelSelector ? droneModelSelector.value : "";
    
        console.log("Drone sélectionné :", selectedDroneName);
    
        var drone = cameraOptions.find(camera => camera.name === selectedDroneName);
    
        if (!drone) {
            console.error("Drone non trouvé ou sélection invalide. Veuillez sélectionner un drone valide.");
            return;
        }
    
        console.log(drone);
    
        var sensorWidth = drone.sensorWidth;
        var focalLength = drone.focalLength;
        var imageWidth = drone.imageWidth;
        var imageHeight = drone.imageHeight;
    
        var altitude = parseFloat(altitudeSlider.value);
    
        var sensorHeight = (sensorWidth * imageHeight) / imageWidth;
    
        var h = (sensorWidth * altitude) / focalLength;
        var v = (sensorHeight * altitude) / focalLength;
    
        var distanceBetweenLines = h * (1 - overlapH / 100);
    
        var centerLat = centroid.lat;
        var centerLng = centroid.lng;
    
        var centerLatRad = centerLat * Math.PI / 180;
    
        var offsetAngleRad = orientationRad + Math.PI / 2;
    
        var translationLat = (distanceBetweenLines * Math.cos(offsetAngleRad)) / 111320;
        var translationLng = (distanceBetweenLines * Math.sin(offsetAngleRad)) / (111320 * Math.cos(centerLatRad));
    
        var lines = [];
        var currentPoint = {
            lat: centroid.lat,
            lng: centroid.lng
        };
    
        var maxLines = Math.ceil((maxExtent + polygonDiagonal) / distanceBetweenLines);
    
        // Génération des lignes de part et d'autre du centre
        console.log(maxLines);
        for (var i = -maxLines * 1.5; i <= maxLines * 1.5; i++) { // Ajuster la portée pour couvrir plus large
            var lineStart = {
                lat: currentPoint.lat + translationLat * i,
                lng: currentPoint.lng + translationLng * i
            };
    
            var lineEnd = movePoint(
                lineStart,
                polygonDiagonal * Math.cos(orientationRad) / 111320,
                polygonDiagonal * Math.sin(orientationRad) / (111320 * Math.cos(centerLatRad))
            );
    
            var extendedLineStart = movePoint(
                lineStart,
                -polygonDiagonal * Math.cos(orientationRad) / 111320,
                -polygonDiagonal * Math.sin(orientationRad) / (111320 * Math.cos(centerLatRad))
            );
            var extendedLineEnd = lineEnd;
    
            var line = [extendedLineStart, extendedLineEnd];
    
            var offsetLat = (offset * Math.cos(perpendicularOrientationRad)) / 111320;
            var offsetLng = (offset * Math.sin(perpendicularOrientationRad)) / (111320 * Math.cos(minLat * Math.PI / 180));
    
            var offsetLine = [
                {
                    lat: line[0].lat + offsetLat + slideLat*3,
                    lng: line[0].lng + offsetLng + slideLng*3
                },
                {
                    lat: line[1].lat + offsetLat + slideLat*3,
                    lng: line[1].lng + offsetLng + slideLng*3
                }
            ];

            if (lineIntersectsPolygon(offsetLine, polygon)) {
                lines.push(offsetLine);
            }
        }
    }

    // Cut lines by polygon
    var turfPoly = latlngs;
    turfPoly.push(latlngs[0]);

    var geoJSONPoly = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[]] // Initialiser avec un tableau vide pour stocker les coordonnées
        }
    };

    turfPoly.forEach(function(point) {
        geoJSONPoly.geometry.coordinates[0].push([point.lng, point.lat]); // Ajouter les coordonnées à la liste de coordonnées
    });

    var geoJSONLines = [];

    console.log(lines);

    lines.forEach(function(pair) {
        var lineString = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [pair[0].lng, pair[0].lat], // Premier point
                    [pair[1].lng, pair[1].lat]  // Deuxième point
                ]
            }
        };
        geoJSONLines.push(lineString);
    });

    var cutLines = [];

    geoJSONLines.forEach(function(line) {
        var intersects = turf.lineIntersect(line, geoJSONPoly);
        
        // Si l'intersection n'a pas au moins 2 points, ignorez cette ligne
        if (intersects.features.length < 2) return; 
    
        // Créez une nouvelle ligne coupée en utilisant les points d'intersection
        var cutLine = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": intersects.features.map(feature => feature.geometry.coordinates)
            }
        };
    
        // Ajoutez la ligne coupée aux lignes finales après conversion des coordonnées
        cutLines.push(cutLine.geometry.coordinates.map(coord => ({ lat: coord[1], lng: coord[0] })));
    });
    
    console.log(cutLines);
    

    // Normalize line orientation
    cutLines.forEach(function(line) {
        if (line[0].lng > line[1].lng) {
            line.reverse();
        }
    });

    // Ensure alternating directions
    for (var i = 1; i < cutLines.length; i += 2) {
        cutLines[i].reverse();
        cutLines[i].color = 'orange';
    }

    for (var i = 0; i < cutLines.length; i += 2) {
        cutLines[i].color = 'green';
    }

    // Color for first line
    cutLines[0].color = 'white';
    density = 1 / density * 100;

    // Draw the lines and add index markers
    cutLines.forEach(function(line, index) {
        L.polyline(line, { color: line.color }).addTo(drawnItems);

        var lat1 = line[0].lat;
        var lng1 = line[0].lng;
        var lat2 = line[1].lat;
        var lng2 = line[1].lng;
        
        var distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));

        distance = distance / 360 * 40075000; // Convert to meters
        console.log(distance);
        

        if (selectedMode === "manual") {
            var numPoints = distance / density;
            console.log(numPoints);
        }

        if (selectedMode === "auto") {
            console.log(v);
            console.log(overlapV);
        
            // Calculez le facteur de recouvrement vertical
            var overlapFactor = (100 - overlapV) / 100; // Facteur de recouvrement vertical
        
            // Espacement constant entre les points en mètres, sans ajustement par rapport à l'orientation
            var pointSpacing = v * overlapFactor; // Espacement entre les points sur le terrain
        
            // Calculez le nombre de points le long de la ligne, en utilisant un espacement constant
            var numPoints = Math.ceil(distance / pointSpacing);
        
            console.log("Espacement entre les points :", pointSpacing);
            console.log("Nombre de points calculés :", numPoints);
        }
        
        var unitVector = {
            lat: (lat2 - lat1) / numPoints,
            lng: (lng2 - lng1) / numPoints
        };

        for (var i = 0; i <= numPoints; i++) {
            var point = {
                lat: lat1 + unitVector.lat * i,
                lng: lng1 + unitVector.lng * i
            };
            wayPts.push(point);
        
            // Définir la couleur et le style du marqueur en fonction de la position
            var color = 'rgb(255, 83, 83, .5)'; // Couleur par défaut (rouge)
            
            if (i === 0) {
                color = 'rgba(255, 0, 255, .5)'; // Le premier point sera bleu
            } else if (i == numPoints) {
                color = 'rgba(255, 0, 255, .5)'; // Le dernier point sera violet
            }
        
            // Ajouter le marqueur pour chaque point
            L.marker(point, {
                icon: L.divIcon({
                    className: 'my-div-icon',
                    html: `<div style="background-color:${color}; background-opacity: 0.1; border-style: inset; border-width: 2px; border-color: ${color}; width: 10px; height: 10px; border-radius: 50%;"></div>`
                })
            }).addTo(drawnItems);
        
            // Assurez-vous que le dernier point est ajouté correctement
            if (selectedMode === "manual") {
                    if (i == Math.floor(numPoints)) {
                    wayPts.push(line[1]); // Ajouter le dernier point
                    L.marker(line[1], {
                        icon: L.divIcon({
                            className: 'my-div-icon',
                            html: '<div style="background-color:purple; border-style: inset; border-width: 2px; border-color: purple; width: 10px; height: 10px; border-radius: 50%;"></div>'
                        })
                    }).addTo(drawnItems);
                }
            }
            
            console.log(wayPts);
        }
        
    });
}



// Function to calculate the centroid of a polygon
function getCentroid(latlngs) {
    var centroid = {lat: 0, lng: 0};
    latlngs.forEach(function(latlng) {
        centroid.lat += latlng.lat;
        centroid.lng += latlng.lng;
    });
    centroid.lat /= latlngs.length;
    centroid.lng /= latlngs.length;
    return centroid;
}

// Function to move a point by a given offset
function movePoint(point, dLat, dLng) {
    return L.latLng(point.lat + dLat, point.lng + dLng);
}

// Function to slide a line by a given vector
function moveLine(line, dLat, dLng) {
    console.log(line);
    let slidedLine = line;
    return slidedLine;
}

// Function to check if a line intersects with a polygon
function lineIntersectsPolygon(line, polygon) {
    var polyPoints = polygon.getLatLngs()[0];
    var lineStart = line[0];
    var lineEnd = line[1];

    for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        var polyStart = polyPoints[i];
        var polyEnd = polyPoints[j];

        if (linesIntersect(lineStart, lineEnd, polyStart, polyEnd)) {
            return true;
        }
    }
    return false;
}

// Function to check if two lines intersect
function linesIntersect(p1, p2, p3, p4) {
    var s1_x = p2.lng - p1.lng;
    var s1_y = p2.lat - p1.lat;
    var s2_x = p4.lng - p3.lng;
    var s2_y = p4.lat - p3.lat;

    var s = (-s1_y * (p1.lng - p3.lng) + s1_x * (p1.lat - p3.lat)) / (-s2_x * s1_y + s1_x * s2_y);
    var t = ( s2_x * (p1.lat - p3.lat) - s2_y * (p1.lng - p3.lng)) / (-s2_x * s1_y + s1_x * s2_y);

    return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
}

document.addEventListener("DOMContentLoaded", function () {
    var exportCsvBtn = document.getElementById("exportCsvBtn");

    // Ajouter un écouteur d'événement sur le bouton d'export CSV
    exportCsvBtn.addEventListener("click", function () {
        console.log(wayPts);
        console.log(heightSlider.value)
        exportPointsToCSV(wayPts, heightSlider.value); // Remplacez cutLines par votre variable contenant les lignes à exporter
    });
});

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en kilomètres

    const dLat = toRadians(lat2 - lat1); // Différence de latitude en radians
    const dLon = toRadians(lon2 - lon1); // Différence de longitude en radians

    const lat1Rad = toRadians(lat1); // Conversion de la latitude du point 1 en radians
    const lat2Rad = toRadians(lat2); // Conversion de la latitude du point 2 en radians

    // Formule de Haversine
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance en kilomètres

    return distance;
}

var tiffData = [];
var rasterLayer;
var overlays = {};  // Assurez-vous que ce soit global pour ajouter des couches dynamiquement
var layerControl = L.control.layers(baseLayers, overlays).addTo(map);

document.getElementById("tiffInput").addEventListener("change", function(event) {
    var file = event.target.files[0];
    console.log("file:", file);

    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = function() {
        var arrayBuffer = reader.result;

        parseGeoraster(arrayBuffer).then(georaster => {
            console.log("georaster:", georaster);
            tiffData = georaster;

            var pixelValues = [];
            var noDataValue = georaster.noDataValue;

            // Extraction des valeurs de pixels à partir des données raster
            for (var y = 0; y < georaster.height; y++) {
                for (var x = 0; x < georaster.width; x++) {
                    var value = georaster.values[0][y][x]; // Accès à la valeur du pixel à (x, y)
                    if (value !== noDataValue) {
                        pixelValues.push(value);
                    }
                }
            }

            console.log("pixelValues length:", pixelValues.length);
            if (pixelValues.length === 0) {
                console.error("No valid pixel values found.");
                return;
            }

            // Trier les valeurs des pixels
            pixelValues.sort(function(a, b) {
                return a - b;
            });

            console.log("Sorted pixel values:", pixelValues);

            // Calcul des indices pour exclure les 2% extrêmes
            var excludeCount = Math.floor(pixelValues.length * 0.02);
            var newMin = pixelValues[excludeCount];
            var newMax = pixelValues[pixelValues.length - 1 - excludeCount];

            console.log("newMin:", newMin, "newMax:", newMax);

            // Créer une échelle de couleurs avec chroma.js
            var colorScale = chroma.scale('Spectral').domain([newMin, newMax]);

            rasterLayer = new GeoRasterLayer({
                georaster: georaster,
                opacity: 0.5,
                resolution: 256,
                pixelValuesToColorFn: function(pixelValues) {
                    var pixelValue = pixelValues[0]; // Supposons que le raster est monocanal
                    if (pixelValue === georaster.noDataValue) {
                        return null;
                    } else {
                        return colorScale(pixelValue).hex();
                    }
                }
            });

            console.log("rasterLayer:", rasterLayer);
            rasterLayer.addTo(map);
            rasterLayer.bringToFront();
            map.fitBounds(rasterLayer.getBounds());

            // Ajouter la couche raster au contrôle des overlays
            overlays["Imported TIFF"] = rasterLayer;
            layerControl.addOverlay(rasterLayer, "Imported TIFF");
        }).catch(error => {
            console.error("Error parsing georaster:", error);
        });
    };
});

// Fonction de temporisation
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fonction pour obtenir l'altitude avec gestion des erreurs et des limites de requêtes
async function getAltitude(latlng) {
    console.log(tiffData);
    if (tiffData.xmax != undefined) { // si il existe des données tiff uploadées
        var point = [latlng.lng, latlng.lat]; // Note the order [lng, lat]
        var result = geoblaze.identify(tiffData, point);
        console.log(result);
        if(result != null){    
            return result ? result[0] : null;
        }
        else{
            const url = `https://api.opentopodata.org/v1/mapzen?locations=${latlng.lat},${latlng.lng}`;

            console.log("Fetching altitude for:", latlng);

            let retries = 0;
            const maxRetries = 5;
            const delayMs = 1000; // Délai en millisecondes

            while (retries < maxRetries) {
                try {
                    const response = await fetch(url);

                    if (!response.ok) {
                        if (response.status === 429) {
                            console.error('Too Many Requests. Retrying...');
                            await delay(delayMs); // Attendre avant de réessayer
                            retries++;
                        } else {
                            console.error('Error fetching altitude:', response.statusText);
                            return NaN;
                        }
                    } else {
                        const data = await response.json();

                        if (data && data.results && data.results.length > 0) {
                            const elevation = data.results[0].elevation;
                            console.log("Elevation:", elevation);
                            return elevation;
                        } else {
                            console.error('Invalid altitude data:', data);
                            return NaN;
                        }
                    }
                } catch (error) {
                    console.error('Error fetching altitude:', error);
                    return NaN;
                }
            }

            console.error('Max retries reached. Returning NaN.');
            return NaN;
        }
        
    }
    else{
        const url = `https://api.opentopodata.org/v1/mapzen?locations=${latlng.lat},${latlng.lng}`;

        console.log("Fetching altitude for:", latlng);

        let retries = 0;
        const maxRetries = 5;
        const delayMs = 1000; // Délai en millisecondes

        while (retries < maxRetries) {
            try {
                const response = await fetch(url);

                if (!response.ok) {
                    if (response.status === 429) {
                        console.error('Too Many Requests. Retrying...');
                        await delay(delayMs); // Attendre avant de réessayer
                        retries++;
                    } else {
                        console.error('Error fetching altitude:', response.statusText);
                        return NaN;
                    }
                } else {
                    const data = await response.json();

                    if (data && data.results && data.results.length > 0) {
                        const elevation = data.results[0].elevation;
                        console.log("Elevation:", elevation);
                        return elevation;
                    } else {
                        console.error('Invalid altitude data:', data);
                        return NaN;
                    }
                }
            } catch (error) {
                console.error('Error fetching altitude:', error);
                return NaN;
            }
        }

        console.error('Max retries reached. Returning NaN.');
        return NaN;
    }
    
}
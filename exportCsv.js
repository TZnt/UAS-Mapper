async function exportPointsToCSV(wayPts, height) {
    console.log(height);

    let csvContent = "data:text/csv;charset=utf-8,";

    // Obtenir l'altitude du premier point pour calculer la référence
    const refAltitude = await getAltitude({ lat: wayPts[0].lat, lng: wayPts[0].lng });
    const refHeight = refAltitude - height;
    console.log("Référence Altitude:", refAltitude);
    console.log("Référence Height:", refHeight);

    for (const point of wayPts) {
        let altitude = await getAltitude({ lat: point.lat, lng: point.lng });
        if (isNaN(altitude)) {
            altitude = "N/A";
        }

        const pointHeight = altitude !== "N/A" ? altitude - refHeight : "N/A";
        console.log("Point Altitude:", altitude);
        console.log("Point Height:", pointHeight);

        csvContent += `${point.lat},${point.lng},${pointHeight}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "litchi_mission.csv");
    document.body.appendChild(link);
    link.click();
}

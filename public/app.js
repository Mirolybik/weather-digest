var fileInput = document.getElementById('myFileInput');
fileInput.addEventListener('change', function(event) {
    var myFile = event.target.files[0];

    if (myFile == undefined) {
        return; // если ничего не выбрали
    }

    var reader = new FileReader();

    reader.onload = function(e) {
        try {
            var weatherData = JSON.parse(e.target.result);

            document.getElementById('resultDiv').style.display = 'block';

            document.getElementById('cityTitle').innerText = "Город: " + weatherData.name + " (" + weatherData.country + ")";
            document.getElementById('coordsText').innerText = "Широта: " + weatherData.lat + ", Долгота: " + weatherData.lon;
            var tbody = document.getElementById('myTableBody');
            tbody.innerHTML = '';

            for (var i = 0; i < weatherData.daily.time.length; i++) {
                var row = document.createElement('tr');

                row.innerHTML =
                    "<td>" + weatherData.daily.time[i] + "</td>" +
                    "<td>" + weatherData.daily.temperature_2m_min[i] + " °C</td>" +
                    "<td>" + weatherData.daily.temperature_2m_max[i] + " °C</td>" +
                    "<td>" + weatherData.daily.precipitation_sum[i] + "</td>";

                tbody.appendChild(row);
            }
        } catch (err) {
            alert("Ой! Кажется это не правильный JSON файл.");
        }
    };
    reader.readAsText(myFile);
});

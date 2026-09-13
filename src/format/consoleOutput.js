
export function printNiceWeather(weather_data) {
  console.log("\n=======================================");
  console.log("Город: " + weather_data.name + ", Страна: " + weather_data.country);
  console.log("Координаты: широта " + weather_data.lat + ", долгота " + weather_data.lon);
  console.log("=======================================\n");

  var table_arr = [];

  if (weather_data.daily != undefined && weather_data.daily.time != undefined) {

    for (let i = 0; i < weather_data.daily.time.length; i++) {

      let one_day = {
        "Дата": weather_data.daily.time[i],
        "Мин. темп (C)": weather_data.daily.temperature_2m_min[i],
        "Макс. темп (C)": weather_data.daily.temperature_2m_max[i],
        "Осадки (мм)": weather_data.daily.precipitation_sum[i]
      };

      table_arr.push(one_day);
    }

    console.table(table_arr);

  } else {
    console.log("Ой, почему-то нет данных по дням...");
  }
}

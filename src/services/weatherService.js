import { myFetch } from '../api/apiClient.js';

export async function getWeatherForCity(city_name, days_count) {
  var geoUrlBase = process.env.GEO_API_URL;
  if (geoUrlBase == undefined) {
    geoUrlBase = 'https://geocoding-api.open-meteo.com/v1/search';
  }


  let url1 = new URL(geoUrlBase);
  url1.searchParams.append('name', city_name);
  url1.searchParams.append('count', '1');
  url1.searchParams.append('language', 'ru');
  url1.searchParams.append('format', 'json');

  let geoData = await myFetch(url1.toString());

  // проверяем нашел ли
  if (geoData.results == undefined || geoData.results.length == 0) {
    throw new Error("Город с таким названием не найден");
  }


  var my_lat = geoData.results[0].latitude;
  var my_lon = geoData.results[0].longitude;
  var real_name = geoData.results[0].name;
  var counrty_name = geoData.results[0].country;


  var weatherUrlBase = process.env.WEATHER_API_URL;
  if (weatherUrlBase == undefined) {
    weatherUrlBase = 'https://api.open-meteo.com/v1/forecast';
  }

  let url2 = new URL(weatherUrlBase);
  url2.searchParams.append('latitude', my_lat);
  url2.searchParams.append('longitude', my_lon);
  url2.searchParams.append('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum');
  url2.searchParams.append('forecast_days', days_count);
  url2.searchParams.append('timezone', 'auto');

  // console.log("Запрашиваем погоду по координатам");
  let weather_json = await myFetch(url2.toString());

  // собираем финальный ответ
  let final_result = {
    name: real_name,
    country: counrty_name,
    lat: my_lat,
    lon: my_lon,
    daily: weather_json.daily
  };

  return final_result;
}

import 'dotenv/config';
import { getWeatherForCity } from './services/weatherService.js';
import { makeFolder, checkCache, saveToCache } from './storage/fileStorage.js';
import { printNiceWeather } from './format/consoleOutput.js';

async function main() {
  let args = process.argv.slice(2);
  let citiesString = '';
  let days = 3;
  let noCache = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--city') {
      citiesString = args[i + 1];
    }
    if (args[i] === '--days') {
      days = parseInt(args[i + 1], 10);
    }
    if (args[i] === '--no-cache') {
      noCache = true;
    }
  }

  if (!citiesString) {
    console.error('Ошибка: Вы не передали обязательный параметр --city!');
    process.exit(1);
  }

  if (isNaN(days) || days < 1 || days > 7) {
    console.error('Ошибка: Параметр --days должен быть числом от 1 до 7!');
    process.exit(1);
  }

  var citiesArray = citiesString.split(',');
  var cities = [];

  for (let i = 0; i < citiesArray.length; i++) {
    let cleanCity = citiesArray[i].trim();
    if (cleanCity.length > 0) {
      cities.push(cleanCity);
    }
  }
  await makeFolder();

  let myDate = new Date();
  let m = myDate.getMonth() + 1;
  let d = myDate.getDate();

  if (m < 10) m = "0" + m;
  if (d < 10) d = "0" + d;

  var today_string = myDate.getFullYear() + "-" + m + "-" + d;


  var promisesList = [];

  for (let i = 0; i < cities.length; i++) {
    let current_city = cities[i];
    let file_name_for_cache = current_city + "-" + today_string + ".json";

    let city_task = async function() {

      if (noCache == false) {
        var cachedData = await checkCache(file_name_for_cache);
        if (cachedData != null) {
          console.log("\n[ДАННЫЕ ИЗ КЭША для: " + current_city + "]");
          printNiceWeather(cachedData);
          return { success: true, city: current_city };
        }
      }

      try {
        let weather_obj = await getWeatherForCity(current_city, days);

        await saveToCache(file_name_for_cache, weather_obj);

        console.log("\n[ДАННЫЕ ИЗ ИНТЕРНЕТА для: " + current_city + "]");
        printNiceWeather(weather_obj);

        return { success: true, city: current_city };
      } catch (err) {
        console.error("\n[ОШИБКА] Не получилось узнать погоду для " + current_city + ": " + err.message);
        // прокидываем ошибку
        throw err;
      }
    };

    promisesList.push(city_task());
  }

  var all_results = await Promise.allSettled(promisesList);

  var bad_count = 0;

  for (let i = 0; i < all_results.length; i++) {
    if (all_results[i].status == "rejected") {
      bad_count = bad_count + 1;
    }
  }

  if (bad_count == all_results.length) {
    console.error("\nУжас! Ни один город не сработал!");
    process.exit(1);
  } else if (bad_count > 0) {
    console.error("\nГотово, но " + bad_count + " городов завершились с ошибкой.");
    process.exit(1);
  } else {
    console.log("\nУра! Всё прошло успешно!");
    process.exit(0); // 0 значит успех
  }
}

main().catch((error) => {
  console.error('\nСлучилась самая главная непредвиденная ошибка:', error.message);
  process.exit(1);
});

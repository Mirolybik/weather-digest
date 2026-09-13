async function main() {
  const args = process.argv.slice(2);

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
    console.error('Пример: node src/index.js --city "Москва, Казань" --days 5');
    process.exit(1);


  if (isNaN(days) || days < 1 || days > 7) {
    console.error('Ошибка: Параметр --days должен быть числом от 1 до 7!');
    process.exit(1);
  }

  const citiesArray = citiesString.split(',');
  const cities = [];

  for (let i = 0; i < citiesArray.length; i++) {
    const cleanCity = citiesArray[i].trim();
    if (cleanCity.length > 0) {
      cities.push(cleanCity);
    }
  }


  console.log('--- Проверка параметров CLI ---');
  console.log('Города для поиска:', cities);
  console.log('Количество дней:', days);
  console.log('Использовать кэш:', !noCache);
  console.log('-------------------------------\n');
  console.log('Здесь в будущем будет вызываться логика работы с API...');
}

main().catch((error) => {
  console.error('Случилась непредвиденная ошибка:', error.message);
  process.exit(1);
});

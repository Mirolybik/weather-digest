import fs from 'fs/promises';
import path from 'path';

export async function makeFolder() {
  var dirName = process.env.REPORTS_DIR;
  if (dirName == undefined) {
    dirName = 'reports';
  }

  try {
    await fs.mkdir(dirName, { recursive: true });
    // console.log("Папка создана или уже есть");
  } catch (err) {
    console.log("Ой, ошибка с созданием папки: ", err);
  }
}

// Читаем из кэша
export async function checkCache(fileName) {
  let myDir = process.env.REPORTS_DIR;

  if (myDir == undefined) {
    myDir = 'reports';
  }

  // соединяем путь
  var full_path = path.join(myDir, fileName);

  try {
    let fileText = await fs.readFile(full_path, 'utf-8');
    var parsed_data = JSON.parse(fileText);

    return parsed_data;
  } catch (e) {
    return null;
  }
}

// Сохраняем в кэш
export async function saveToCache(fileName, weather_object) {
  var myDir = process.env.REPORTS_DIR;

  if (myDir == undefined) {
    myDir = 'reports';
  }

  var full_path = path.join(myDir, fileName);

  let text_to_save = JSON.stringify(weather_object, null, 2);

  try {
    await fs.writeFile(full_path, text_to_save, 'utf-8');
    // console.log("Успешно сохранили в файл!");
  } catch (e) {
    console.log("Что-то пошло не так при сохранении файла...", e);
  }
}

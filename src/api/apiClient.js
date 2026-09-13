export async function myFetch(url) {
  var myTimeout = process.env.API_TIMEOUT;

  if (myTimeout == undefined) {
    myTimeout = 5000;
  }


  let controller = new AbortController();
  var timerId = setTimeout(function() {
    controller.abort();
  }, myTimeout);

  try {

    let response = await fetch(url, { signal: controller.signal });

    clearTimeout(timerId);


    if (response.status >= 400 && response.status <= 499) {
      throw new Error("Ошибка 4xx! Наверное неправильный город.");
    }
    if (response.status >= 500) {
      throw new Error("Ошибка 5xx! Сервер погоды сломался.");
    }

    var data_json = await response.json();


    return data_json;

  } catch (err) {
    clearTimeout(timerId);

    if (err.name == 'AbortError') {
      throw new Error("Время вышло! Таймаут запроса.");
    }

    if (err.cause != undefined && err.cause.code == 'ENOTFOUND') {
      throw new Error("Нет интернета или плохой адрес!");
    }

    throw err; // если другая ошибка - кидаем дальше
  }
}

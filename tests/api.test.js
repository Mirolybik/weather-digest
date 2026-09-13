import test from 'node:test';
import assert from 'node:assert';

function checkMyStatus(status) {
    if (status >= 400 && status < 500) return new Error("Ошибка 4xx");
    if (status >= 500) return new Error("Ошибка 5xx");
    return "Всё ок";
}

test('Проверка статуса 200 должна возвращать Всё ок', function() {
    var result = checkMyStatus(200);
    assert.strictEqual(result, "Всё ок");
});

test('Проверка статуса 404 должна выдавать ошибку', function() {
    var result = checkMyStatus(404);
    // Проверяем, что вернулась ошибка
    assert.ok(result instanceof Error);
    assert.strictEqual(result.message, "Ошибка 4xx");
});

test('Проверка статуса 500 должна выдавать ошибку сервера', function() {
    var result = checkMyStatus(500);
    assert.ok(result instanceof Error);
    assert.strictEqual(result.message, "Ошибка 5xx");
});

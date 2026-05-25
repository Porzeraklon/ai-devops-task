// Importujemy funkcję, którą chcemy przetestować
const sum = require('./sum');

// Blok 'test' przyjmuje opis testu oraz funkcję z jego logiką
test('dodaje 1 + 2, aby otrzymać 3', () => {
  // Asercja: oczekujemy, że wynik sum(1, 2) wyniesie 3
  expect(sum(1, 2)).toBe(3);
});

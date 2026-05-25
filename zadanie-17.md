Oto funkcja w języku JavaScript, która wykonuje dokładnie to, o co prosisz. Wykorzystuje do tego wbudowane metody tablicowe, co pozwala na zwięzły i czytelny kod.

```javascript
function getCompletedTaskTitles(tasks) {
  return tasks
    .filter(task => task.status === 'completed')
    .sort((a, b) => a.id - b.id)
    .map(task => task.title);
}

```

### Jak to działa

Wymienione operacje są wykonywane łańcuchowo (tzw. *chaining*), co oznacza, że wynik jednej metody jest od razu przekazywany do kolejnej:

* **`filter()`**: Przechodzi przez wszystkie elementy tablicy i zwraca nową tablicę zawierającą wyłącznie te obiekty, w których wartość właściwości `status` jest równa dokładnie `"completed"`.
* **`sort()`**: Układa przefiltrowane zadania rosnąco na podstawie właściwości `id`. Działanie `a.id - b.id` zapewnia, że elementy o mniejszym ID znajdą się przed tymi o większym ID (zwykłe wywołanie `sort()` bez tej funkcji strzałkowej posortowałoby wartości jako tekst).
* **`map()`**: Przekształca ostateczną tablicę obiektów w nową tablicę, do której trafiają wyłącznie wartości z pola `title`.

### Przykład użycia

Możesz przetestować tę funkcję, przekazując do niej przykładową tablicę:

```javascript
const tasksList = [
  { id: 3, title: 'Napisać dokumentację', status: 'completed' },
  { id: 1, title: 'Zaktualizować system', status: 'pending' },
  { id: 4, title: 'Wdrożyć poprawki', status: 'pending' },
  { id: 2, title: 'Zrobić kopię zapasową', status: 'completed' }
];

const completedTitles = getCompletedTaskTitles(tasksList);
console.log(completedTitles); 
// Wynik: [ 'Zrobić kopię zapasową', 'Napisać dokumentację' ]

```

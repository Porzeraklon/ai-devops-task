Oto kompletny przewodnik, jak skonfigurować i napisać test dla Twojej funkcji za pomocą frameworka Jest.

### Czym jest Jest?

**Jest** to potężny i niezwykle popularny framework do testowania kodu w języku JavaScript (oraz TypeScript), stworzony pierwotnie przez Facebooka. Jego największą zaletą jest to, że działa w modelu "zero configuration" – zazwyczaj nie wymaga skomplikowanego ustawiania przed pierwszym użyciem.

Jest dostarcza wszystko, czego potrzebujesz w jednym pakiecie:

* **Test runner:** narzędzie, które wyszukuje i uruchamia Twoje testy.
* **Bibliotekę asercji:** funkcje takie jak `expect()`, które pozwalają sprawdzić, czy wynik działania kodu jest zgodny z oczekiwaniami.
* **Narzędzia do mockowania:** funkcje pozwalające na izolowanie testowanego kodu poprzez symulowanie innych części systemu (np. zapytań do bazy danych czy zewnętrznych API).

---

### 1. Struktura plików projektu

Dla tak prostego testu struktura Twojego katalogu powinna wyglądać następująco:

```text
moj-projekt/
├── package.json      # Plik z konfiguracją zależności (powstanie po instalacji)
├── sum.js            # Plik z logiką Twojej aplikacji
└── sum.test.js       # Plik zawierający testy dla sum.js

```

---

### 2. Instalacja Jesta

Pracując w terminalu, przejdź do pustego katalogu, w którym chcesz stworzyć projekt. Upewnij się, że masz zainstalowane środowisko Node.js, a następnie wykonaj te dwa kroki:

1. **Zainicjuj projekt**, co wygeneruje plik `package.json`:
```bash
npm init -y

```


2. **Zainstaluj Jest** jako zależność deweloperską (potrzebną tylko do tworzenia i testowania, a nie do działania samej aplikacji na produkcji):
```bash
npm install --save-dev jest

```



---

### 3. Kod i Test jednostkowy

Aby Jest mógł przetestować Twoją funkcję, musisz ją najpierw wyeksportować z pliku źródłowego, a następnie zaimportować w pliku z testem. Otwórz swój edytor i przygotuj poniższe pliki.

**`sum.js`**

```javascript
function sum(a, b) {
  return a + b;
}

// Wyeksportowanie funkcji w standardzie CommonJS
module.exports = sum;

```

**`sum.test.js`**

```javascript
// Importujemy funkcję, którą chcemy przetestować
const sum = require('./sum');

// Blok 'test' przyjmuje opis testu oraz funkcję z jego logiką
test('dodaje 1 + 2, aby otrzymać 3', () => {
  // Asercja: oczekujemy, że wynik sum(1, 2) wyniesie 3
  expect(sum(1, 2)).toBe(3);
});

```

---

### 4. Jak uruchomić test

Najlepszą i najwygodniejszą praktyką jest podpięcie Jesta pod standardowe skrypty NPM. Otwórz plik `package.json` i zmodyfikuj w nim sekcję `"scripts"`, aby wyglądała w ten sposób:

```json
"scripts": {
  "test": "jest"
}

```

Teraz wystarczy wywołać w terminalu komendę:

```bash
npm test

```

Jest automatycznie przeszuka Twój projekt w poszukiwaniu plików z rozszerzeniem `.test.js` lub `.spec.js`, uruchomi je i wypisze w konsoli czytelny raport informujący, czy funkcja zwróciła poprawny wynik.

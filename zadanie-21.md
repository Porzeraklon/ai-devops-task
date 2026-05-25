## Proces Konwersji JSON do CSV

Proces transformacji danych o strukturze hierarchicznej (JSON) do formatu płaskiego (CSV) składa się z kilku powtarzalnych etapów:

1. **Parsowanie (Odczyt danych):** System wczytuje ciąg znaków JSON i przekształca go na wewnętrzną strukturę danych w pamięci (np. słowniki i listy).
2. **Lokalizacja wezła docelowego:** W przypadku złożonych plików JSON (jak obiekt zawierający klucz `users`), skrypt musi "zejść" do poziomu tablicy, która zawiera właściwe rekordy do eksportu.
3. **Ekstrakcja nagłówków:** System skanuje klucze w obiektach, aby wygenerować pierwszy wiersz pliku CSV (tzw. wiersz nagłówkowy). Najczęściej zbiera się wszystkie unikalne klucze ze wszystkich obiektów w tablicy.
4. **Płaszczenie (Flattening) i mapowanie wartości:** Skrypt przechodzi przez każdy obiekt i wyciąga wartości odpowiadające nagłówkom.
5. **Formatowanie i zapis:** Wartości są łączone zdefiniowanym separatorem (najczęściej przecinkiem) i zapisywane jako kolejne wiersze tekstu, z uwzględnieniem odpowiedniego zabezpieczenia znaków specjalnych (tzw. escaping).

---

## Główne wyzwania i strategie ich rozwiązywania

Największym problemem przy takiej konwersji jest niedopasowanie strukturalne: JSON to struktura wielowymiarowa (drzewo), podczas gdy CSV jest płaską tabelą (dwa wymiary).

### 1. Reprezentacja tablic (np. klucz `roles`)

Tablice wewnątrz obiektów JSON nie mają naturalnego odpowiednika w pojedynczej komórce CSV. Istnieją trzy główne strategie radzenia sobie z tym problemem:

* **Serializacja do tekstu (Najczęstsza metoda):** Wartości tablicy są łączone w jeden ciąg znaków (string) za pomocą innego separatora (np. spacji lub znaku `|`) i otaczane cudzysłowami.
* *Przykład:* `"admin, user"` lub `admin|user`. Pozwala to zachować wszystkie dane w jednej kolumnie bez psucia struktury CSV.


* **Rozbicie na wiele kolumn (Płaszczenie poziome):** Tworzone są dodatkowe kolumny dla każdego elementu tablicy (np. `role_1`, `role_2`).
* *Wyzwanie:* Jeśli jeden użytkownik ma 10 ról, a reszta tylko 1, plik zyska 10 nowych kolumn, które dla większości wierszy będą puste.


* **Powielanie wierszy (Płaszczenie pionowe / Explode):** Dla każdej roli tworzony jest oddzielny wiersz z duplikacją pozostałych danych.
* *Przykład:* Jeden wiersz dla "Jana Kowalskiego jako admina" i drugi dla "Jana Kowalskiego jako usera".
* *Wyzwanie:* Psuje unikalność klucza głównego (`id`) w pierwszej kolumnie i sztucznie pompuje rozmiar pliku.



### 2. Zagnieżdżone obiekty

Jeśli JSON zawiera wewnątrz obiekty (np. `{"address": {"city": "Gdańsk", "zip": "80-000"}}`), ich bezpośredni eksport jest niemożliwy.

* **Rozwiązanie:** Stosuje się tzw. *dot notation* (notację kropkową), tworząc połączone nagłówki kolumn: `address.city` oraz `address.zip`.

### 3. Brakujące klucze i niespójność schematu

W JSON jeden obiekt może posiadać klucz `phone`, a kolejny w ogóle go nie mieć.

* **Rozwiązanie:** Parser generujący CSV musi zebrać wszystkie możliwe klucze przed rozpoczęciem zapisu. Wiersze, którym brakuje danej wartości, otrzymują w jej miejscu puste pole (zapisywane jako dwa sąsiadujące separatory, np. `,,`).

### 4. Konflikt znaków specjalnych

Dane w JSON (np. pole komentarza lub opisu) mogą zawierać przecinki, cudzysłowy oraz znaki nowej linii (`\n`).

* **Rozwiązanie:** Ścisłe stosowanie standardu RFC 4180. Pola zawierające separator muszą być otoczone podwójnymi cudzysłowami (np. `"tekst, z przecinkiem"`). Jeśli wewnątrz tekstu występuje sam cudzysłów, musi zostać podwojony (tzw. ucieczka znaków: `"Oto ""cytat"""`).

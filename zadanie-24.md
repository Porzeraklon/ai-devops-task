Analiza Twoich metryk wskazuje na system, który radzi sobie ze standardowym obciążeniem, ale ma wyraźne problemy w momentach stresowych. Ruch na poziomie 15 000 zapytań na dobę nie jest przytłaczający (to średnio kilkanaście zapytań na minutę), co sprawia, że niektóre z tych odczytów są dość niepokojące.

Oto szczegółowa interpretacja danych i potencjalne problemy, które z nich wynikają:

### 🚩 Główne problemy

**1. Niebezpieczny limit pamięci (Krytyczne)**
Skoki zużycia RAM do 3.5GB na maszynie, która sprzętowo dysponuje 4GB, to stąpanie po kruchym lodzie. System operacyjny (np. Debian) potrzebuje pamięci do własnych procesów. Zbliżanie się do tej granicy najpewniej powoduje **swapowanie** (zrzucanie danych z RAM-u na dysk), co drastycznie spowalnia system, lub ryzykuje, że proces zostanie nagle "ubity" przez systemowy mechanizm OOM (Out Of Memory) Killer.

**2. Długi ogon opóźnień (P99)**
Średni czas 230ms jest akceptowalny, podobnie jak 450ms dla 95% zapytań. Jednak fakt, że 1% zapytań (około 150 requestów) czeka aż **1200ms**, oznacza poważne blokady. Ten "długi ogon" zjawisk jest silnie skorelowany z punktem pierwszym. Kiedy serwer zaczyna swapować z powodu braku pamięci lub Garbage Collector (w językach takich jak Java, C# czy Node.js) próbuje desperacko zwolnić RAM, procesor zatrzymuje obsługę zapytań, co winduje czas odpowiedzi powyżej sekundy.

**3. Skoki CPU i Błędy 5xx**
Skoki procesora do 80% przy relatywnie niskim średnim ruchu sugerują, że w systemie występują "ciężkie" operacje – mogą to być skomplikowane zapytania do bazy danych, przetwarzanie dużych plików lub nieefektywne pętle w kodzie. Z kolei 120 błędów 5xx (wewnętrzny błąd serwera) to wskaźnik awaryjności na poziomie 0.8%. W zdrowym API powinno to być bliżej 0.01%. Błędy te najprawdopodobniej pokrywają się w czasie ze skokami użycia RAM-u (aplikacja nie ma zasobów na odpowiedź) lub timeoutami procesora (zapytanie trwało zbyt długo).

---

### 🛠️ Sugestie poprawy wydajności

Aby ustabilizować ten serwer bez konieczności natychmiastowej zmiany sprzętu na mocniejszy, proponuję następujące kroki:

* **Zbadaj logi pod kątem 5xx:** Otwórz szybko logi błędów na serwerze (możesz użyć do tego `micro`, by wygodnie przefiltrować pliki w terminalu). Szukaj fraz takich jak `Timeout`, `Out of Memory`, czy `Connection pool exhausted`. To wskaże Ci dokładnego winowajcę.
* **Zoptymalizuj zarządzanie pamięcią:** Mając twardy sufit w postaci 4GB, nie masz miejsca na "zasobożerne" rozwiązania in-memory bez ścisłych limitów.
* Jeśli używasz bazy danych na tej samej maszynie, upewnij się, że jej bufory pamięci są sztywno ograniczone.
* Zmniejsz liczbę workerów/wątków aplikacji obsługujących API. Mniej workerów oznacza mniejsze bazowe zużycie RAM, co paradoksalnie może przyspieszyć aplikację poprzez wyeliminowanie zjawiska swapowania.


* **Analiza zapytań do bazy (N+1 problem):** Skoki CPU do 80% często wynikają ze słabo zoptymalizowanych zapytań. Upewnij się, że używasz odpowiednich indeksów w bazie danych i nie pobierasz w pętlach danych, które można by pobrać jednym zapytaniem `JOIN`.
* **Zabezpiecz się przed dużymi payloadami:** Jeśli aplikacja przyjmuje dane od użytkowników, upewnij się, że istnieje twardy limit wielkości przesyłanego body (np. w konfiguracji Nginx). Próba wczytania zbyt dużego JSON-a do pamięci potrafi błyskawicznie "zjeść" cenne megabajty.

W jakiej technologii (język programowania i ewentualny framework) jest napisane to API? Ta informacja pozwoli mi dobrać dla Ciebie bardziej precyzyjne parametry konfiguracyjne do zbadania.

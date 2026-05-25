pierwszy diagram:

  +----------------+         +------------------+         +----------------+
  |                |         |                  |         |                |
  |     Klient     |  HTTP/  | Serwer Aplikacji |  TCP/IP |   Baza Danych  |
  | (Przeglądarka/ | <-----> |     (Backend)    | <-----> |   (SQL/NoSQL)  |
  |   Aplikacja)   |  HTTPS  |                  |         |                |
  |                |         |                  |         |                |
  +----------------+         +------------------+         +----------------+

drugi diagram:

+-----------------------+               +-----------------------+               +-----------------------+
|                       |               |                       |               |                       |
|        KLIENT         |               |   SERWER APLIKACJI    |               |      BAZA DANYCH      |
|                       |               |                       |               |                       |
| [Interfejs/Frontend]  |               |  [Logika Biznesowa]   |               | [Magazyn Informacji]  |
|                       |  1. Żądanie   |                       | 2. Zapytanie  |                       |
| * Wyświetlanie UI     |  (np. GET)    | * Walidacja danych    | (np. SELECT)  | * Trwały zapis        |
| * Zbieranie danych    | ------------> | * Autoryzacja         | ------------> | * Wyszukiwanie        |
| * Reakcja na akcje    |               | * Przetwarzanie       |               | * Aktualizacja        |
|   użytkownika         |               | * Komunikacja z DB    |               |                       |
|                       | <------------ |                       | <------------ |                       |
|                       | 4. Odpowiedź  |                       | 3. Zestaw     |                       |
|                       | (np. JSON)    |                       |    danych     |                       |
+-----------------------+               +-----------------------+               +-----------------------+

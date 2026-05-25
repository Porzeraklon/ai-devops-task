Ignorowanie tych konkretnych plików za pomocą `.gitignore` opiera się na trzech głównych filarach dobrej praktyki programistycznej: **bezpieczeństwie, wydajności oraz czystości pracy**.

Oto dlaczego pomijanie poszczególnych sekcji jest tak istotne:

**1. Ochrona danych wrażliwych i sekretów (`.env`)**
To najważniejszy powód ze względów bezpieczeństwa. Pliki `.env` zawierają hasła, klucze do zewnętrznych API, nazwy użytkowników czy adresy URL bazy danych. Wrzucenie tych plików do repozytorium Git (szczególnie publicznego, np. na GitHubie) oznacza natychmiastowe ujawnienie tych sekretów, co może prowadzić do kradzieży danych lub nieautoryzowanego użycia płatnych usług podpiętych pod Twoje konto.

**2. Zarządzanie rozmiarem repozytorium (`node_modules/`, `mongodb_data/`)**
Repozytorium Git powinno zawierać wyłącznie kod źródłowy i niezbędne konfiguracje, a nie pliki binarne czy pobrane zależności.

* **`node_modules/`:** Katalog z bibliotekami potrafi ważyć setki megabajtów, a nawet gigabajty, i składać się z dziesiątek tysięcy małych plików. Śledzenie tego w Gicie drastycznie spowolniłoby jego działanie. Zamiast tego, każdy kto pobierze Twój kod, po prostu uruchamia `npm install`, aby odtworzyć te biblioteki na podstawie pliku `package.json`.
* **`mongodb_data/`:** Lokalne pliki bazy danych w Dockerze to ciężkie, binarne struktury, które ulegają zmianie przy każdym dodaniu czy usunięciu rekordu z bazy. Próba ich wersjonowania doprowadziłaby do ogromnego rozrostu wagi repozytorium i natychmiastowych konfliktów w Gicie.

**3. Unikanie konfliktów w plikach generowanych automatycznie (`logs/`, `dist/`, `pids`)**
Wszelkie pliki logów, raporty z testów czy pliki skompilowane (np. folder `dist/` po zbudowaniu aplikacji) powstają automatycznie jako efekt uruchomienia kodu. Ponieważ zmieniają się niemal przy każdym odpaleniu aplikacji, ich obecność w systemie kontroli wersji generowałaby nieustanne, sztuczne zmiany do zatwierdzenia (commity) i ciągłe konflikty przy próbie łączenia kodu (merge conflicts).

**4. Czystość i niezależność środowiska pracy (pliki systemowe i IDE)**
Każdy programista ma swój własny zestaw narzędzi. Edytory terminalowe, takie jak `micro` czy `nano`, często w tle generują pliki tymczasowe lub kopie zapasowe (np. kończące się tyldą `*~` czy `.bak`), a poszczególne dystrybucje Linuksa, na przykład Debian, mogą obsługiwać specyficzne dla siebie metadane. Śledzenie ich w repozytorium zanieczyszcza historię projektu i narzucałoby te "śmieciowe" pliki innym osobom w zespole, które mogą pracować na zupełnie innych systemach operacyjnych. Repozytorium powinno pozostać neutralne i zawierać tylko to, co jest faktycznie potrzebne do uruchomienia aplikacji.

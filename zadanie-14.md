To dość klasyczny scenariusz awarii w środowisku kontenerowym – bardzo typowy widok, gdy konfiguruje się usługi w domowym laboratorium lub stawia nowe kontenery na serwerze z Debianem.

Analizując te trzy linijki logów krok po kroku, widać wyraźny ciąg przyczynowo-skutkowy:

### **Co dokładnie się wydarzyło? (Analiza chronologiczna)**

* **`10:15:32` – Pozorny sukces:** Kontener o ID `78a2b3c4` przeszedł ze stanu *starting* (uruchamianie) w stan *healthy* (zdrowy). Oznacza to, że zdefiniowany w Dockerfile (lub docker-compose) mechanizm *healthcheck* na początku zwrócił poprawny wynik. Usługa wystartowała.
* **`10:16:45` – Wystąpienie błędu:** Nieco ponad minutę później aplikacja wewnątrz kontenera próbowała nawiązać połączenie z adresem IP **`172.17.0.3`** na porcie **`5432`**. Połączenie zostało odrzucone (`connection refused`).
* **`10:16:47` – Zmiana statusu:** Dwie sekundy po błędzie połączenia, mechanizm sprawdzający kondycję kontenera zorientował się, że aplikacja nie działa poprawnie, i zmienił jej status z *healthy* na *unhealthy* (niezdrowy). Prawdopodobnie skrypt healthchecka opiera się na udanym połączeniu z bazą danych lub prawidłowym działaniu aplikacji, która właśnie uległa awarii.

---

### **Jakie problemy można zidentyfikować?**

Głównym winowajcą jest tutaj błąd `connection refused` na porcie `5432`. Biorąc to pod uwagę, można zdiagnozować następujące problemy:

**1. Brak dostępu do bazy danych PostgreSQL**
Port `5432` to domyślny port dla bazy PostgreSQL. Komunikat `connection refused` oznacza, że aplikacja dotarła pod wskazany adres IP, ale żadna usługa nie nasłuchuje na tym porcie. Może to oznaczać, że:

* Kontener z bazą danych w ogóle nie został uruchomiony.
* Baza danych uległa awarii i zrestartowała się, a w tym momencie nie była gotowa na przyjmowanie połączeń.
* Proces bazy danych działa, ale jest skonfigurowany tak, aby nasłuchiwać tylko na `localhost` wewnątrz swojego własnego kontenera, a nie na zewnątrz.

**2. Problem z adresacją sieciową (Hardcoding IP)**
Adres `172.17.0.3` to typowy adres z domyślnej sieci `bridge` Dockera. Opieranie konfiguracji na "sztywnych" adresach IP w Dockerze to zła praktyka. Przy każdym restarcie kontener bazy danych mógłby otrzymać inny adres IP (np. `172.17.0.4`), co spowoduje, że Twoja aplikacja będzie pukać w puste miejsce.

**3. Zła kolejność uruchamiania (Race Condition)**
Aplikacja wstała szybciej niż baza danych. Kontener z aplikacją uzyskał status *healthy*, zanim musiał wykonać pierwszą operację na bazie. Kiedy przyszła pora na komunikację (ponad minutę później), okazało się, że baza nie odpowiada, co ostatecznie położyło samą aplikację.

### **Co warto zrobić dalej?**

Jeśli będziesz diagnozować to dalej (np. z poziomu terminala w `micro`), polecam sprawdzić dwie rzeczy:

1. **Status bazy:** Wpisz `docker ps -a`, aby sprawdzić, czy kontener z bazą danych w ogóle działa i czy nie wpada w pętlę restartów (stan *restarting*). Warto przejrzeć też jego logi (`docker logs <id_kontenera_bazy>`).
2. **Konfiguracja sieci:** Zamiast domyślnej sieci `bridge` i sztywnych adresów IP, utwórz dedykowaną sieć dla swoich kontenerów (`docker network create...`) lub użyj `docker-compose`. Dzięki temu kontenery będą mogły komunikować się ze sobą po swoich nazwach (np. łącząc się z `postgres:5432` zamiast `172.17.0.3:5432`), co rozwiązuje problem zmieniających się adresów IP.

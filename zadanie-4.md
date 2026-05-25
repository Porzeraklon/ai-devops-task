Jak rozwiązać problem z dużym zużyciem pamięci przez kontener Docker?

Rozwiązanie problemu z dużym zużyciem pamięci przez kontener Docker wymaga zazwyczaj połączenia odpowiedniej diagnozy, nałożenia twardych limitów oraz optymalizacji samej aplikacji działającej wewnątrz.

Oto kompleksowe podejście do zidentyfikowania i rozwiązania tego problemu:

### 1. Diagnoza sytuacji

Zanim zaczniesz zmieniać konfigurację, upewnij się, co dokładnie zużywa zasoby.

* **Sprawdź statystyki w czasie rzeczywistym:**
Użyj polecenia `docker stats`, aby zobaczyć, który kontener konsumuje najwięcej pamięci (kolumna `MEM USAGE / LIMIT`).
```bash
docker stats --no-stream

```


* **Zajrzyj w logi:**
Często aplikacje wyrzucają ostrzeżenia przed całkowitym zapchaniem pamięci. Sprawdź logi podejrzanego kontenera:
```bash
docker logs <nazwa_kontenera> --tail 100

```



### 2. Nałożenie limitów pamięci (Hard & Soft Limits)

Szczególnie w środowiskach serwerowych o ograniczonej puli zasobów (np. gdy dysponujesz maszyną mającą 4 GB RAM), jeden niesforny kontener może doprowadzić do zadziałania mechanizmu OOM (Out-Of-Memory) Killera na poziomie systemu operacyjnego (np. Twojego Debiana) i zabić kluczowe procesy.

Należy wymusić ograniczenia na poziomie platformy Docker.

**Jeśli używasz `docker run`:**
Dodaj flagę `--memory` (limit twardy) oraz opcjonalnie `--memory-swap` (limit pamięci + swap).

```bash
docker run -d --name moja_aplikacja --memory="512m" --memory-swap="1g" moj_obraz

```

**Jeśli używasz `docker-compose`:**
Gdy edytujesz plik `docker-compose.yml` w terminalu (na przykład otwierając go w `micro`), skonfiguruj sekcję `deploy`:

```yaml
services:
  moja_aplikacja:
    image: moj_obraz
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

```

*Uwaga: `reservations` to miękki limit – Docker postara się utrzymać zużycie w tych ryzach, gdy na hoście brakuje pamięci.*

### 3. Optymalizacja samej aplikacji

Docker to tylko środowisko uruchomieniowe. Jeśli aplikacja w środku ma wycieki pamięci, nałożenie limitów spowoduje po prostu jej częstsze restartowanie.

* **Aplikacje Java:** Maszyna wirtualna Javy (JVM) domyślnie może zająć dużą część dostępnej pamięci RAM. Wymuś limity bezpośrednio w zmiennych środowiskowych przekazywanych do kontenera:
```yaml
environment:
  - JAVA_OPTS=-Xmx256m -Xms256m

```


* **Node.js:** V8 engine również potrafi być zachłanny. Ogranicz jego apetyt flagą:
```yaml
environment:
  - NODE_OPTIONS=--max-old-space-size=256

```


* **Bazy danych (np. MySQL, PostgreSQL):** Mają własne pliki konfiguracyjne określające rozmiary buforów (np. `innodb_buffer_pool_size` w MySQL lub `shared_buffers` w Postgresie). Należy je dostosować do limitów kontenera.

### 4. Sprawdzenie polityki restartów

Jeśli nałożysz limity i kontener zacznie być ubijany przez OOM Killera, upewnij się, że masz poprawnie ustawioną politykę restartów w Dockerze (`restart: unless-stopped` lub `restart: on-failure`), aby usługa wstała ponownie po awarii. Możesz sprawdzić, czy kontener padł z powodu braku pamięci, używając:

```bash
docker inspect <nazwa_kontenera> --format='{{.State.OOMKilled}}'

```

---

Jaka konkretnie aplikacja lub obraz znajduje się w tym problematycznym kontenerze?


Jesteś doświadczonym DevOps Engineerem z 10-letnim doświadczeniem. Jak rozwiązać problem z dużym zużyciem pamięci przez kontener Docker?

Cześć! Z perspektywy dekady pracy w kulturze DevOps powiem Ci, że wysokie zużycie pamięci przez kontenery to jeden z najczęstszych pożarów, z jakimi się spotykamy. Konteneryzacja daje nam izolację, ale bez odpowiednich ram, aplikacja z wyciekiem pamięci pociągnie za sobą cały serwer.

Podejdźmy do tego systemowo – od szybkiej diagnozy, przez zabezpieczenie infrastruktury, aż po znalezienie przyczyny źródłowej (Root Cause).

### 1. Rozpoznanie bojem (Diagnostyka)

Zanim zaczniesz cokolwiek restartować, musisz wiedzieć, z czym walczysz.

* **Podstawowy pogląd:** Odpal `docker stats --no-stream`. Zobaczysz, czy to jeden kontener zjada zasoby, czy to systematyczny wzrost na wielu usługach.
* **Weryfikacja na poziomie hosta:** Na maszynach z Debianem 13 domyślnie używany jest mechanizm `cgroup v2`, co daje bardzo dokładne metryki. Użyj `htop`, aby sprawdzić ogólne obciążenie węzła i upewnić się, że to faktycznie Docker, a nie np. procesy systemowe.

### 2. Zabezpieczenie hosta (Hard Limits)

To absolutny priorytet. Szczególnie na mniejszych węzłach roboczych lub serwerach dysponujących np. skromnymi 4GB RAM, pojedynczy kontener bez limitów to gwarancja, że systemowy OOM (Out Of Memory) Killer zacznie losowo ubijać krytyczne procesy (w tym samego demona Dockera).

Musisz nałożyć twarde limity w konfiguracji. Szybka edycja pliku (np. używając `micro docker-compose.yml`) pozwala na wdrożenie "kagańca":

```yaml
services:
  mojaplikacja:
    image: my-app:latest
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

```

Dzięki temu, jeśli kontener dobije do 512MB, zostanie zabity tylko on, a host przetrwa. Opcjonalnie możesz sterować zachowaniem OOM Killera dla specyficznego kontenera dodając flagę `oom_kill_disable: true` (choć zalecam z tym ostrożność).

### 3. Wejście pod maskę (Root Cause Analysis)

Skoro zabezpieczyliśmy infrastrukturę, musimy zrozumieć, *dlaczego* aplikacja puchnie. W 90% przypadków to nie wina samego Dockera, lecz źle skonfigurowanego środowiska uruchomieniowego wewnątrz kontenera:

* **Aplikacje Java:** JVM w starszych wersjach (przed Java 10) nie "widzi" limitów cgroups Dockera i myśli, że ma do dyspozycji cały RAM hosta. Zawsze ustawiaj flagi `-Xmx` (Max Heap Size) z odpowiednim zapasem w stosunku do limitu kontenera. W nowszych wersjach używaj `-XX:MaxRAMPercentage`.
* **Aplikacje Node.js:** V8 engine ma swój własny limit pamięci (domyślnie ok. 1.5GB na systemach 64-bit). Jeśli Node próbuje zjeść więcej, a kontener ma limit np. 1GB, aplikacja zginie. Skonfiguruj flagę `--max-old-space-size=X` (gdzie X to wartość w megabajtach, nieco mniejsza niż limit kontenera).
* **Python/Ruby:** Te języki często cierpią na fragmentację pamięci lub tzw. memory leaks w bibliotekach C. Zbadaj, czy używasz odpowiednich workerów (np. `gunicorn` z flagą `--max-requests`, która okresowo i bezpiecznie restartuje workery, zanim zjedzą cały RAM).

### 4. Analiza procesów zombie i warstw

Wejdź do żywego kontenera: `docker exec -it <container_id> /bin/bash` i sprawdź, co dokładnie tam działa (`ps aux`). Zdarza się, że główny proces (PID 1) nie radzi sobie z przekazywaniem sygnałów do procesów potomnych, tworząc tzw. "zombie processes", które konsumują zasoby. Rozwiązaniem jest użycie lekkiego init-systemu jak `tini` (dodając `--init` przy uruchamianiu kontenera).

---

Abyśmy mogli dokładniej zdiagnozować ten przypadek: w jakiej technologii (język, framework, ewentualnie baza danych) napisana jest aplikacja działająca w tym problematycznym kontenerze?

Implementacja zasady nieuprzywilejowanego użytkownika (Non-Root) wymaga odpowiednich wpisów zarówno na etapie budowania obrazu (`Dockerfile`), jak i podczas jego konfiguracji uruchomieniowej (`docker-compose.yml`). Poniżej znajduje się praktyczny przewodnik oraz gotowe szablony konfiguracyjne, które pozwalają wdrożyć tę praktykę.

### 1. Konfiguracja w `Dockerfile`

W pliku `Dockerfile` kluczowe jest stworzenie dedykowanej grupy oraz użytkownika systemowego, przypisanie im odpowiednich uprawnień do katalogu roboczego aplikacji, a następnie jawne przełączenie kontekstu wykonawczego za pomocą instrukcji `USER`.

Oto przykład bezpiecznej konfiguracji opartej na odchudzonym obrazie systemowym:

```dockerfile
# Użycie stabilnego i minimalnego obrazu bazowego
FROM debian:stable-slim

# Definiowanie jawnych ID dla użytkownika i grupy (np. zakres powyżej 10000 dla bezpieczeństwa)
ARG USER_ID=10001
ARG GROUP_ID=10001

# Tworzenie grupy oraz użytkownika bez uprawnień administratora
RUN groupadd -g ${GROUP_ID} appgroup && \
    useradd -l -u ${USER_ID} -g appgroup -m -s /bin/bash appuser

# Ustawienie katalogu roboczego aplikacji
WORKDIR /app

# Kopiowanie plików projektu z jednoczesną zmianą właściciela (chown)
# Zapobiega to sytuacji, w której pliki należą do roota, a aplikacja nie ma do nich dostępu
COPY --chown=appuser:appgroup . .

# Przełączenie kontekstu bezpieczeństwa na nowego użytkownika
# Wszystkie kolejne instrukcje oraz domyślny proces kontenera uruchomią się jako 'appuser'
USER appuser

# Domyślne uruchomienie aplikacji
CMD ["./twoja-aplikacja"]

```

### 2. Konfiguracja w `docker-compose.yml`

Podczas korzystania z Docker Compose, zwłaszcza w połączeniu z montowanymi wolumenami danych, często pojawia się problem z uprawnieniami do plików na maszynie hosta. Jeśli kontener zapisze pliki wewnątrz wolumenu jako użytkownik `10001`, a Twój lokalny profil użytkownika na systemie operacyjnym posiada inne ID (np. domyślne `1000`), zmiana lub usunięcie tych plików bezpośrednio z poziomu hosta będzie utrudnione.

Najbardziej eleganckim rozwiązaniem jest dynamiczne przekazywanie identyfikatorów UID i GID z systemu operacyjnego wprost do kontenera za pomocą pliku Compose:

```yaml
version: '3.8'

services:
  moja-aplikacja:
    build:
      context: .
      dockerfile: Dockerfile
    image: moja-aplikacja:latest
    
    # Nadpisanie użytkownika uruchamiającego procesy wewnątrz kontenera.
    # Użycie zmiennych środowiskowych pozwala dopasować uprawnienia kontenera
    # do aktualnego użytkownika na systemie hosta. W przypadku braku zmiennych, domyślnie przyjmie 1000.
    user: "${UID:-1000}:${GID:-1000}"
    
    environment:
      - NODE_ENV=production
    
    volumes:
      - ./dane_aplikacji:/app/data
    
    restart: unless-stopped

```

*Wskazówka:* Aby zmienne `${UID}` oraz `${GID}` były automatycznie podstawiane przez Docker Compose, upewnij się, że są one wyeksportowane w Twoim środowisku powłoki (możesz dodać wpis `export UID GID` do pliku `.bashrc` lub utworzyć lokalny plik `.env` obok pliku `docker-compose.yml`).

---

Zrozumienie, w jaki sposób identyfikatory użytkowników (UID/GID) przenikają między systemem operacyjnym hosta a wnętrzem izolowanego kontenera, bywa skomplikowane. Poniższy interaktywny symulator pozwala przetestować różne scenariusze konfiguracji uprawnień, montowania wolumenów oraz ocenić poziom bezpieczeństwa środowiska w zależności od wybranych parametrów.

```python
readme_content = """# Simple Task API

REST API do zarządzania zadaniami, napisane w środowisku Node.js przy użyciu frameworka Express oraz bazy danych MongoDB. Projekt oferuje podstawowe operacje CRUD, filtrowanie zadań oraz bezpieczny mechanizm autoryzacji użytkowników.

## Spis treści
- [Opis](#opis)
- [Główne funkcje](#główne-funkcje)
- [Wymagania wstępne](#wymagania-wstępne)
- [Instalacja](#instalacja)
- [Użycie](#użycie)
- [Endpointy API](#endpointy-api)

## Opis
Simple Task API to lekkie i skalowalne rozwiązanie backendowe stworzone z myślą o organizacji zadań codziennych lub projektowych. Pozwala użytkownikom na pełne zarządzanie ich własną listą zadań przy zachowaniu prywatności dzięki autoryzacji tokenami.

## Główne funkcje
- **Pełny CRUD:** Tworzenie, odczytywanie, aktualizacja i usuwanie zadań.
- **Filtrowanie zaawansowane:** Możliwość sortowania i filtrowania zadań według ich statusu oraz priorytetu.
- **Autoryzacja użytkowników:** Rejestracja i logowanie zabezpieczone przy użyciu tokenów JWT (JSON Web Tokens).

## Wymagania wstępne
Przed uruchomieniem projektu upewnij się, że masz zainstalowane na swoim środowisku:
- **Node.js** (rekomendowana wersja LTS)
- **MongoDB** (uruchomione lokalnie lub instancja w chmurze, np. MongoDB Atlas)

## Instalacja

1. Sklonuj repozytorium na swój dysk lokalny:
   ```bash
   git clone [https://github.com/twoj-username/simple-task-api.git](https://github.com/twoj-username/simple-task-api.git)
   cd simple-task-api

```

2. Zainstaluj wszystkie wymagane zależności projektu:
```bash
npm install

```


3. Utwórz plik `.env` w głównym katalogu projektu i zdefiniuj w nim zmienne środowiskowe:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/taskdb
JWT_SECRET=twoj_super_tajny_klucz_jwt

```



## Użycie

1. Uruchom serwer aplikacji w trybie produkcyjnym lub deweloperskim:
```bash
# Uruchomienie standardowe
npm start

# Uruchomienie w trybie deweloperskim (jeśli skonfigurowano nodemon)
npm run dev

```


Domyślnie serwer uruchomi się pod adresem: `http://localhost:3000`
2. Do testowania punktów końcowych (endpoints) możesz wykorzystać narzędzia takie jak Postman, Bruno lub cURL.

## Endpointy API

### Autoryzacja

| Metoda | Endpoint | Opis | Wymaga tokenu |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Rejestracja nowego konta użytkownika | Nie |
| `POST` | `/api/auth/login` | Logowanie użytkownika i zwrot tokenu JWT | Nie |

### Zarządzanie zadaniami (Tasks)

*Uwaga: Wszystkie poniższe endpointy wymagają przekazania ważnego tokenu w nagłówku zapytania: `Authorization: Bearer <TWÓJ_TOKEN_JWT>`.*

| Metoda | Endpoint | Opis |
| --- | --- | --- |
| `GET` | `/api/tasks` | Pobranie listy wszystkich zadań zalogowanego użytkownika |
| `GET` | `/api/tasks/:id` | Pobranie szczegółowych informacji o konkretnym zadaniu |
| `POST` | `/api/tasks` | Utworzenie nowego zadania |
| `PUT` | `/api/tasks/:id` | Aktualizacja wybranego zadania (modyfikacja pól) |
| `DELETE` | `/api/tasks/:id` | Bezpowrotne usunięcie konkretnego zadania |

#### Filtrowanie zadań

Endpoint `GET /api/tasks` obsługuje parametry zapytania (Query Parameters), które pozwalają zawęzić listę wyników:

* `status` – filtruje zadania po ich stanie (np. `pending`, `in-progress`, `completed`)
* `priority` – filtruje zadania po stopniu ważności (np. `low`, `medium`, `high`)

**Przykład zapytania z filtrowaniem:**

```http
GET /api/tasks?status=pending&priority=high

```

"""

with open("README.md", "w", encoding="utf-8") as f:
f.write(readme_content)

```
Twój plik MD jest gotowy  
[file-tag: code-generated-file-0-1779712535930874273]

Stworzyłem plik README z przejrzystą strukturą opartą na powszechnie przyjętych standardach tworzenia dokumentacji dla projektów open source. Dokument zawiera przejrzysty opis, proste instrukcje klonowania repozytorium oraz konfiguracji bazy MongoDB, jak również czytelne tabele wizualizujące wszystkie niezbędne ścieżki routingu oraz użycie parametrów zapytań (query parameters) do filtrowania wyników.

Zaproponowana dokumentacja opiera się na składni Markdown, co pozwala na poprawne renderowanie kodu, tabel oraz nagłówków zarówno w widoku na platformie GitHub, jak i GitLab lub Bitbucket.

```

### `GET /api/users`

Zwraca listę użytkowników zarejestrowanych w systemie. Endpoint obsługuje stronicowanie (paginację) wyników oraz opcjonalne filtrowanie zwracanych danych na podstawie przypisanej roli.

---

#### Parametry zapytania (Query Parameters)

| Parametr | Typ | Wymagany | Opis |
| --- | --- | --- | --- |
| **`page`** | `integer` | Nie | Numer żądanej strony. Domyślnie: `1`. |
| **`limit`** | `integer` | Nie | Liczba wyników zwracanych na jedną stronę. Domyślnie: `10`, Maksymalnie: `100`. |
| **`role`** | `string` | Nie | Filtr pozwalający na zawężenie listy użytkowników do konkretnej roli (np. `admin`, `user`). |

---

#### Przykładowe żądanie (Request)

Pobranie pierwszej strony wyników, ograniczonej do 2 użytkowników, wyfiltrowanych po roli administratora:

```http
GET /api/users?page=1&limit=2&role=admin HTTP/1.1
Host: api.example.com
Accept: application/json

```

---

#### Przykładowa odpowiedź (Response)

**Status Code:** `200 OK`

```json
{
  "data": [
    {
      "id": 101,
      "username": "jkowalski",
      "email": "jan.kowalski@example.com",
      "role": "admin",
      "createdAt": "2023-11-01T10:00:00Z"
    },
    {
      "id": 102,
      "username": "anowak",
      "email": "anna.nowak@example.com",
      "role": "admin",
      "createdAt": "2023-11-05T14:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 2,
    "totalCount": 5,
    "totalPages": 3
  }
}

```

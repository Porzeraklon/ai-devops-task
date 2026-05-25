Oto rozbicie kodu linia po linii, wyjaśnione prostym językiem:

* `#!/bin/bash`
To tak zwany *shebang*. Jest to informacja dla systemu operacyjnego, jakiego "tłumacza" (interpretera) ma użyć do przeczytania i wykonania tego pliku. W tym przypadku wskazujemy na Basha, który jest domyślnym językiem terminala w systemach takich jak Debian.
* `SERVICE="docker"`
Tworzymy tutaj **zmienną** o nazwie `SERVICE` i wrzucamy do niej tekst `"docker"`. Zmienną możesz wyobrazić sobie jako pudełko z etykietą. Robimy to po to, aby nie wpisywać słowa "docker" wielokrotnie w całym kodzie. Jeśli w przyszłości zechcesz przerobić ten skrypt, aby sprawdzał np. usługę `nginx`, wystarczy, że zmienisz tylko tę jedną linijkę.
* `if systemctl is-active --quiet "$SERVICE"; then`
To początek **instrukcji warunkowej** (od angielskiego *if* – jeśli). Sprawdzamy tutaj, czy usługa (podstawiona z naszego pudełka `"$SERVICE"`) jest aktywna.
* `systemctl is-active` to komenda, która pyta system o status.
* Flaga `--quiet` (cicho) sprawia, że komenda nie wypisze na ekran niepotrzebnego komunikatu o statusie – interesuje nas tylko sam fakt, czy działa (prawda), czy nie (fałsz).
* `; then` (to) oznacza: "jeśli powyższe jest prawdą, wykonaj instrukcje poniżej".


* `echo "Usługa $SERVICE już działa."`
Komenda `echo` po prostu wypisuje tekst na ekranie (w terminalu). System automatycznie podmieni `$SERVICE` na słowo "docker".
* `else`
Oznacza "w przeciwnym wypadku". Jeśli warunek z linijki `if` nie został spełniony (czyli usługa nie działa), skrypt przeskoczy od razu tutaj i zacznie wykonywać kod poniżej.
* `echo "Usługa $SERVICE nie działa. Próbuję uruchomić..."`
Ponownie wypisujemy komunikat dla użytkownika, informując o podjęciu działania.
* `sudo systemctl start "$SERVICE"`
To właściwe polecenie uruchamiające. Używamy `sudo`, aby wykonać komendę z uprawnieniami administratora (uruchamianie usług tego wymaga). `systemctl start docker` wydaje systemowi polecenie włączenia demona.
* `if systemctl is-active --quiet "$SERVICE"; then`
To **wewnętrzna** instrukcja warunkowa. Skoro spróbowaliśmy uruchomić usługę linijkę wyżej, teraz chcemy się upewnić, że faktycznie się włączyła. Sprawdzamy status dokładnie tak samo, jak na początku.
* `echo "Pomyślnie uruchomiono usługę $SERVICE."`
Jeśli drugie sprawdzenie potwierdziło działanie usługi, wypisujemy komunikat o sukcesie.
* `else`
W przeciwnym wypadku (jeśli po naszej próbie uruchomienia usługa wciąż jest nieaktywna).
* `echo "Błąd: Nie udało się uruchomić usługi $SERVICE."`
Wyświetlamy informację, że operacja się nie powiodła.
* `echo "Sprawdź logi systemowe za pomocą komendy: journalctl -u $SERVICE"`
Wypisujemy podpowiedź. Polecenie `journalctl` to dziennik zdarzeń w systemie Linux. Dodanie flagi `-u docker` przefiltruje ten dziennik tak, aby pokazać tylko błędy i komunikaty bezpośrednio związane z Dockerem, co bardzo ułatwia naprawę problemu.
* `fi`
Zakończenie wewnętrznej instrukcji warunkowej (słowo *if* pisane od tyłu).
* `fi`
Zakończenie głównej (pierwszej) instrukcji warunkowej. Skrypt dobiega końca.

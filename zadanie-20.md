^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$

To wyrażenie regularne jest skonstruowane tak, aby precyzyjnie sprawdzać każdy z czterech bloków (oktetów) adresu IPv4, upewniając się, że wartości mieszczą się w zakresie 0-255 i nie zawierają nieprawidłowych zer wiodących.

Oto podsumowanie logiki dla pojedynczego oktetu:

* `25[0-5]` wyłapuje liczby **250-255**.
* `2[0-4][0-9]` wyłapuje liczby **200-249**.
* `1[0-9]{2}` wyłapuje liczby **100-199**.
* `[1-9]?[0-9]` wyłapuje liczby **0-99** (zabezpieczając przed zerami na początku, np. akceptuje `0` lub `99`, ale odrzuca `01`).

Następnie wzorzec ten powtarza się jeszcze trzy razy, zawsze poprzedzony kropką `(\. ... ){3}`.

### Przykłady poprawne (zostaną zaakceptowane)

1. **`192.168.1.1`** – Standardowy, prywatny adres IP. Wszystkie liczby są w odpowiednich przedziałach.
2. **`255.255.255.255`** – Maksymalne dopuszczalne wartości w każdym z oktetów.
3. **`0.0.0.0`** – Minimalne dopuszczalne wartości, brak zer wiodących (samotne zero jest poprawne).
4. **`10.0.12.34`** – Adres o zróżnicowanej długości znaków w oktetach, w pełni poprawny.

### Przykłady niepoprawne (zostaną odrzucone)

1. **`256.1.2.3`** – Odrzucony. Pierwszy oktet to `256`, a maksimum to `255`.
2. **`192.168.01.1`** – Odrzucony. Trzeci oktet to `01`. Wyrażenie celowo odrzuca zera wiodące przed innymi cyframi.
3. **`192.168.1.1.1`** – Odrzucony. Pięć oktetów zamiast wymaganych czterech. Znaczniki `^` i `$` blokują dopasowanie tylko części ciągu.
4. **`192.168.1`** – Odrzucony. Tylko trzy oktety.
5. **`192.168.1.`** – Odrzucony. Kropka na końcu ciągu nie jest poprawna.
6. **`abc.def.ghi.jkl`** – Odrzucony. Wyrażenie dopuszcza wyłącznie cyfry i kropki.

Poniżej przygotowałem dla Ciebie interaktywne narzędzie. Możesz w nim samodzielnie wpisywać własne przykłady lub klikać w przygotowane szablony, aby na żywo zobaczyć, jak to wyrażenie regularne radzi sobie z różnymi formatami.

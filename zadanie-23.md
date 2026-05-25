To bardzo klasyczny przykład algorytmu, który sprawdza się dla małych zbiorów danych, ale przy większych tablicach zaczyna mieć problemy z wydajnością.

### Złożoność Twojego algorytmu

* **Złożoność czasowa:** $O(n^2)$
Zastosowano tutaj dwie zagnieżdżone pętle. Zewnętrzna pętla iteruje przez każdy element tablicy (co daje nam $n$ kroków). Dla każdego z tych kroków wewnętrzna pętla iteruje przez pozostałą część tablicy. Całkowita liczba operacji rośnie więc kwadratowo względem rozmiaru wejściowego.
* **Złożoność pamięciowa:** $O(1)$
Jeśli nie bierzemy pod uwagę tablicy wynikowej `pairs` (ponieważ musimy ją zwrócić, jest to często traktowane osobno), algorytm zużywa stałą ilość dodatkowej pamięci. Alokujesz tylko dwie zmienne pomocnicze dla liczników `i` oraz `j`.

---

### Czy można to zoptymalizować?

**Zdecydowanie tak.** Możemy zejść ze złożoności czasowej $O(n^2)$ do $O(n)$ za pomocą struktury danych takiej jak **Hash Map** (w JavaScripcie obiekt `Map` lub po prostu słownik).

Zamiast sprawdzać każdą parę, możemy podczas jednego przejścia przez tablicę sprawdzać, czy brakuje nam już jakiejś liczby, którą widzieliśmy wcześniej.

Oto zoptymalizowana wersja, która dokładnie odwzorowuje Twoją logikę (w tym obsługę duplikatów):

```javascript
function findPairsOptimized(arr, targetSum) {
  const pairs = [];
  const seen = new Map();

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const complement = targetSum - current;

    // Jeśli widzieliśmy już brakującą wartość, tworzymy z nią pary
    if (seen.has(complement)) {
      const count = seen.get(complement);
      // Jeśli liczba wystąpiła wcześniej wiele razy, dodajemy odpowiednią liczbę par
      for (let k = 0; k < count; k++) {
        pairs.push([complement, current]);
      }
    }

    // Dodajemy aktualną liczbę do mapy (lub zwiększamy jej licznik)
    seen.set(current, (seen.get(current) || 0) + 1);
  }
  
  return pairs;
}

```

### Porównanie po optymalizacji:

* **Nowa złożoność czasowa:** $O(n)$ – Przechodzimy przez tablicę tylko jeden raz. Wyszukiwanie i zapisywanie w strukturze `Map` kosztuje nas średnio $O(1)$ czasu operacyjnego.
* **Nowa złożoność pamięciowa:** $O(n)$ – To jest kompromis (trade-off) tej optymalizacji. Płacimy pamięcią za szybkość, ponieważ musimy przechować historię odwiedzonych elementów w strukturze `Map`. W najgorszym scenariuszu zapiszemy tam wszystkie elementy tablicy.

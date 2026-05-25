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

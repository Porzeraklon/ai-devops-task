/**
 * Sprawdza, czy podany ciąg znaków jest poprawnym adresem IPv4.
 * * @param {string} ip - Ciąg znaków do weryfikacji.
 * @returns {boolean} - Zwraca true, jeśli adres jest poprawny, w przeciwnym razie false.
 */
function isValidIPv4(ip) {
    // Przypisanie wyrażenia regularnego do stałej. 
    // Pamiętaj o usunięciu cudzysłowów i otoczeniu wzorca ukośnikami /.../ w JS.
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;

    // Metoda .test() weryfikuje ciąg znaków względem wzorca
    return ipv4Regex.test(ip);
}

// --- Przykłady użycia (możesz przetestować w konsoli) ---

console.log("Poprawne adresy:");
console.log(isValidIPv4("192.168.1.1"));       // Oczekiwany wynik: true
console.log(isValidIPv4("255.255.255.255"));   // Oczekiwany wynik: true
console.log(isValidIPv4("0.0.0.0"));           // Oczekiwany wynik: true
console.log(isValidIPv4("10.0.12.34"));        // Oczekiwany wynik: true

console.log("\nNiepoprawne adresy:");
console.log(isValidIPv4("256.1.2.3"));         // Oczekiwany wynik: false (256 to za dużo)
console.log(isValidIPv4("192.168.01.1"));      // Oczekiwany wynik: false (niedozwolone wiodące zero)
console.log(isValidIPv4("192.168.1.1.1"));     // Oczekiwany wynik: false (5 oktetów)
console.log(isValidIPv4("192.168.1"));         // Oczekiwany wynik: false (3 oktety)
console.log(isValidIPv4("tekst.zamiast.cyfr"));// Oczekiwany wynik: false (nieprawidłowe znaki)

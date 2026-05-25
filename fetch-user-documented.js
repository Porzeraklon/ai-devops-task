/**
 * Pobiera dane użytkownika z API na podstawie przekazanego identyfikatora.
 *
 * @param {string|number} userId - Unikalny identyfikator użytkownika.
 * @returns {Promise<{name: string, email: string, lastLogin: Date} | null>} Obietnica (Promise) zwracająca sformatowany obiekt z danymi użytkownika lub `null` w przypadku wystąpienia błędu.
 */
function fetchUserData(userId) {
    return fetch(`https://api.example.com/users/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return {
                name: data.name,
                email: data.email,
                lastLogin: new Date(data.lastLoginTimestamp)
            };
        })
        .catch(error => {
            console.error('Fetch error:', error);
            return null;
        });
}

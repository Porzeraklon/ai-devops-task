#!/bin/bash

SERVICE="docker"

# Sprawdzenie, czy usługa działa cicho (bez wypisywania standardowego wyjścia)
if systemctl is-active --quiet "$SERVICE"; then
    echo "Usługa $SERVICE już działa."
else
    echo "Usługa $SERVICE nie działa. Próbuję uruchomić..."
    
    # Próba uruchomienia usługi
    sudo systemctl start "$SERVICE"

    # Weryfikacja, czy uruchomienie się powiodło
    if systemctl is-active --quiet "$SERVICE"; then
        echo "Pomyślnie uruchomiono usługę $SERVICE."
    else
        echo "Błąd: Nie udało się uruchomić usługi $SERVICE."
        echo "Sprawdź logi systemowe za pomocą komendy: journalctl -u $SERVICE"
    fi
fi

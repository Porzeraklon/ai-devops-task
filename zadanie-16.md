Najważniejsze różnice i uwagi:

    Zmienne środowiskowe: Upewnij się, że katalog zawierający mysqldump.exe (zazwyczaj katalog bin w folderze instalacyjnym MySQL/MariaDB) znajduje się w systemowej zmiennej środowiskowej PATH.

    Zarządzanie błędami: Odpowiednikiem bashowego $? (statusu wyjścia ostatniej komendy) w PowerShellu w kontekście natywnych aplikacji jest zmienna $LASTEXITCODE.

    Przekierowanie strumienia: Aby uniknąć problemów PowerShella z kodowaniem znaków (np. niepożądane UTF-16, które może uszkodzić plik zrzutu SQL), do wykonania zrzutu użyto obejścia & cmd.exe /c "...". Wprowadza to klasyczne zachowanie strumieni, które bez problemu trawi i zapisuje surowe dane SQL.

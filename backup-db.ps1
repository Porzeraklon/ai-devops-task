<#
Prosty skrypt do backupu bazy danych
#>

$DbName = "app_database"
$BackupDir = "C:\backups\db" # Przykładowa ścieżka w stylu Windows
$Date = Get-Date -Format "yyyyMMdd_HHmmss"

# Rozdzielamy nazwę na plik tymczasowy SQL i docelowe archiwum ZIP
$SqlFile = Join-Path -Path $BackupDir -ChildPath "${DbName}_${Date}.sql"
$ZipFile = Join-Path -Path $BackupDir -ChildPath "${DbName}_${Date}.zip"

# Sprawdź czy katalog istnieje
if (-not (Test-Path -Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    Write-Host "Utworzono katalog $BackupDir"
}

# Wykonaj backup
Write-Host "Rozpoczynam backup bazy $DbName..."

# Uruchomienie mysqldump. Używamy cmd.exe, aby bezproblemowo przekierować strumień do pliku z odpowiednim kodowaniem
& cmd.exe /c "mysqldump -u root -p $DbName > `"$SqlFile`""

# Sprawdzenie kodu wyjścia (odpowiednik $? z Bash)
if ($LASTEXITCODE -eq 0) {
    # Kompresja pliku do formatu ZIP
    Compress-Archive -Path $SqlFile -DestinationPath $ZipFile -Force
    
    # Usunięcie nieskompresowanego pliku .sql
    Remove-Item -Path $SqlFile -Force

    Write-Host "Backup zakończony sukcesem: $ZipFile"
}
else {
    Write-Host "Błąd podczas wykonywania backupu!" -ForegroundColor Red
    
    # Sprzątanie po nieudanym zrzucie
    if (Test-Path -Path $SqlFile) {
        Remove-Item -Path $SqlFile -Force
    }
    
    exit 1
}

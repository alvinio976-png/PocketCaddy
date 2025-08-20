@echo off
REM Démarrer un petit serveur local (nécessite Python 3) + ouvrir le navigateur
setlocal
where python >nul 2>&1
if %errorlevel% neq 0 (
  echo Python 3 introuvable. Ouverture simple sans serveur...
  call "%~dp0Ouvrir_localement_sans_serveur.cmd"
  exit /b
)
cd /d "%~dp0"
start "" http://localhost:8080/
python -m http.server 8080

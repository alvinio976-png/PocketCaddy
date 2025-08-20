@echo off
REM Ouvrir localement sans serveur (pas de service worker en file://)
setlocal
set INDEX=%~dp0index.html
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" "%INDEX%"
) else (
  start "" "%INDEX%"
)

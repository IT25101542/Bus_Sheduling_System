@echo off
title Lanka Transit System - Master Launcher
color 0A
echo ======================================================================
echo           LANKA TRANSIT SERVICES (PVT) LTD - TURNKEY RUNNER
echo         University Software Engineering Group Project (6 Members)
echo ======================================================================
echo.
echo Launching Spring Boot Backend and React Frontend in separate windows...
echo.

start "Lanka Transit - Backend" cmd /k "%~dp0run-backend.bat"
timeout /t 3 /nobreak >nul
start "Lanka Transit - Frontend" cmd /k "%~dp0run-frontend.bat"

echo.
echo Both servers have been launched:
echo  * Backend API:  http://localhost:8080/api
echo  * Frontend App: http://localhost:5173
echo.
echo You may close this launcher window at any time.
pause

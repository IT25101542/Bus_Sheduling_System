@echo off
title Lanka Transit System - React Vite Frontend (Port 5173)
color 0E
echo ======================================================================
echo           LANKA TRANSIT SERVICES (PVT) LTD - FRONTEND UI
echo         University Software Engineering Group Project (6 Members)
echo ======================================================================
echo.

cd /d "%~dp0frontend"
echo Starting Vite Development Server at http://localhost:5173 ...
echo ======================================================================
call npm.cmd run dev
pause

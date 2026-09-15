@echo off
title Lanka Transit System - Spring Boot Backend (Port 8080)
color 0B
echo ======================================================================
echo           LANKA TRANSIT SERVICES (PVT) LTD - BACKEND SERVER
echo         University Software Engineering Group Project (6 Members)
echo ======================================================================
echo.

cd /d "%~dp0backend"
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot"
set "PATH=%JAVA_HOME%\bin;%~dp0backend\tools\apache-maven-3.9.9\bin;%PATH%"

echo [1/2] Verifying Java 17 & Maven environment...
java -version
echo.

echo [2/2] Starting Spring Boot Server on http://localhost:8080 ...
echo Press Ctrl+C to terminate the server.
echo ======================================================================
call mvnw.cmd spring-boot:run
pause

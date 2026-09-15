@echo off
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "e:\SLIIT\Software E\Group project 02\backend"
call mvnw.cmd spring-boot:run

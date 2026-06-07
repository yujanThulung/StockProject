@echo off

:: Get script directory
SET SCRIPT_DIR=%~dp0

:: Check LSTM virtual environment
IF NOT EXIST "%SCRIPT_DIR%lstm\venv\Scripts\python.exe" (
    echo [ERROR] LSTM venv not found
    pause
    exit /b 1
)

:: Check Sentiment virtual environment
IF NOT EXIST "%SCRIPT_DIR%sentiment\venv\Scripts\python.exe" (
    echo [ERROR] Sentiment venv not found
    pause
    exit /b 1
)

:: Start LSTM service in new terminal
echo [*] Starting LSTM API on http://localhost:8080 ...
start "NuroStock - LSTM API" cmd /k "cd /d %SCRIPT_DIR%lstm && venv\Scripts\python.exe run.py"

:: Start Sentiment service in new terminal
echo [*] Starting Sentiment API on http://localhost:5001 ...
start "NuroStock - Sentiment API" cmd /k "cd /d %SCRIPT_DIR%sentiment && venv\Scripts\python.exe run.py"

:: Show service URLs
echo.
echo LSTM API      → http://localhost:8080
echo Sentiment API → http://localhost:5001
echo Close the opened windows to stop services.
echo.

pause
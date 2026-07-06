@echo off
title Skill Sharing Among Villagers Launcher
echo ==========================================================
echo  Skill Sharing Among Villagers - Local Service Launcher
echo ==========================================================
echo.
echo Booting concurrent backend and frontend services...
echo.

:: Prepend the portable Node.js executable to the path for this execution
set PATH=C:\Users\harsh\.gemini\antigravity-ide\node\node-v22.12.0-win-x64;%PATH%

:: Check if node is available
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js was not found in path. Please check setup.
    pause
    exit /b
)

:: Run npm concurrently script in background
start /b cmd /c "npm run dev"

echo Waiting 5 seconds for local ports to bind...
timeout /t 5 /nobreak > nul

echo Opening local portal in default browser...
start http://localhost:5173

echo.
echo ==========================================================
echo  SUCCESS: Servers are running in the background!
echo  Keep this terminal window open to keep services active.
echo  Press Ctrl+C or close this window to terminate services.
echo ==========================================================
echo.
pause

@echo off
setlocal

if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="status" goto status
if "%1"=="logs" goto logs
if "%1"=="connect" goto connect
goto usage

:start
echo 🚀 Starting MongoDB and Mongo Express...
docker-compose -f docker-compose.dev.yml up mongodb mongo-express -d
echo ✅ MongoDB: http://localhost:27017
echo ✅ Mongo Express Web UI: http://localhost:8081
echo.
echo Starting Next.js development server...
start cmd /k "npm run dev"
goto end

:stop
echo 🛑 Stopping all services...
docker-compose -f docker-compose.dev.yml down
taskkill /f /im node.exe >nul 2>&1
echo ✅ All services stopped
goto end

:status
echo 📊 Service Status:
echo.
echo Docker Containers:
docker ps --filter "name=cg_portal_feedback" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.
echo Services:
echo 🗄️  MongoDB: http://localhost:27017
echo 🌐 Mongo Express: http://localhost:8081
echo 📱 Next.js App: http://localhost:3000
goto end

:logs
echo 📋 Recent logs:
echo.
echo === MongoDB Logs ===
docker logs --tail 10 cg_portal_feedback-mongodb-1
echo.
echo === Mongo Express Logs ===
docker logs --tail 10 cg_portal_feedback-mongo-express-1
goto end

:connect
echo 🔌 Connecting to MongoDB shell...
docker exec -it cg_portal_feedback-mongodb-1 mongosh -u admin -p password123 --authenticationDatabase admin cg_portal_feedback
goto end

:usage
echo 🔧 CG Portal Feedback - Database Management
echo.
echo Usage: %0 {start^|stop^|status^|logs^|connect}
echo.
echo Commands:
echo   start   - Start MongoDB, Mongo Express, and Next.js
echo   stop    - Stop all services
echo   status  - Show service status
echo   logs    - Show recent logs
echo   connect - Connect to MongoDB shell
echo.
echo Web Interfaces:
echo   📱 App:         http://localhost:3000
echo   🌐 Mongo Express: http://localhost:8081
echo   🗄️  MongoDB:     mongodb://localhost:27017

:end

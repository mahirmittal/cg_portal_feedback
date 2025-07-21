!/bin/bash

# MongoDB and Web Interface Management Script

case "$1" in
  start)
    echo "🚀 Starting MongoDB and Mongo Express..."
    docker-compose -f docker-compose.dev.yml up mongodb mongo-express -d
    echo "✅ MongoDB: http://localhost:27017"
    echo "✅ Mongo Express Web UI: http://localhost:8081"
    echo ""
    echo "Starting Next.js development server..."
    npm run dev
    ;;
  
  stop)
    echo "🛑 Stopping all services..."
    docker-compose -f docker-compose.dev.yml down
    pkill -f "next dev"
    echo "✅ All services stopped"
    ;;
    
  status)
    echo "📊 Service Status:"
    echo ""
    echo "Docker Containers:"
    docker ps --filter "name=cg_portal_feedback" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "Services:"
    echo "🗄️  MongoDB: http://localhost:27017"
    echo "🌐 Mongo Express: http://localhost:8081"
    echo "📱 Next.js App: http://localhost:3000"
    ;;
    
  logs)
    echo "📋 Recent logs:"
    echo ""
    echo "=== MongoDB Logs ==="
    docker logs --tail 10 cg_portal_feedback-mongodb-1
    echo ""
    echo "=== Mongo Express Logs ==="
    docker logs --tail 10 cg_portal_feedback-mongo-express-1
    ;;
    
  connect)
    echo "🔌 Connecting to MongoDB shell..."
    docker exec -it cg_portal_feedback-mongodb-1 mongosh -u admin -p password123 --authenticationDatabase admin cg_portal_feedback
    ;;
    
  *)
    echo "🔧 CG Portal Feedback - Database Management"
    echo ""
    echo "Usage: $0 {start|stop|status|logs|connect}"
    echo ""
    echo "Commands:"
    echo "  start   - Start MongoDB, Mongo Express, and Next.js"
    echo "  stop    - Stop all services"
    echo "  status  - Show service status"
    echo "  logs    - Show recent logs"
    echo "  connect - Connect to MongoDB shell"
    echo ""
    echo "Web Interfaces:"
    echo "  📱 App:         http://localhost:3000"
    echo "  🌐 Mongo Express: http://localhost:8081"
    echo "  🗄️  MongoDB:     mongodb://localhost:27017"
    ;;
esac

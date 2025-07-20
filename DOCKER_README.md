# Docker Implementation Guide for CG Portal Feedback System

## 🐳 Complete Docker Setup - Step by Step Guide for Beginners

This guide will help you set up the entire Chhattisgarh Government Portal Feedback System using Docker, even if you're a complete beginner.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start (5 Minutes)](#quick-start)
3. [Detailed Setup Instructions](#detailed-setup-instructions)
4. [Understanding the Components](#understanding-the-components)
5. [Accessing the Applications](#accessing-the-applications)
6. [Common Issues and Solutions](#common-issues-and-solutions)
7. [Stopping and Managing Containers](#stopping-and-managing-containers)
8. [Development Guidelines](#development-guidelines)

---

## Prerequisites

### 1. Install Docker Desktop

**For Windows:**
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Run the installer and follow the setup wizard
3. Restart your computer when prompted
4. Open Docker Desktop and wait for it to start

**For Mac:**
1. Download Docker Desktop for Mac from: https://www.docker.com/products/docker-desktop/
2. Drag Docker to Applications folder
3. Launch Docker Desktop

**For Linux:**
1. Install Docker Engine: https://docs.docker.com/engine/install/
2. Install Docker Compose: https://docs.docker.com/compose/install/

### 2. Verify Installation
Open your terminal/command prompt and run:
```bash
docker --version
docker-compose --version
```

You should see version information for both commands.

---

## Quick Start (5 Minutes)

If you just want to get the system running quickly:

### Step 1: Clone or Download the Project
```bash
# If you have git installed
git clone https://github.com/prince04kumar/cg_portal_feedback.git
cd cg_portal_feedback

# OR download the ZIP file and extract it, then navigate to the folder
```

### Step 2: Start Everything with One Command
```bash
docker-compose up -d
```

### Step 3: Wait for Setup (2-3 minutes)
The system will automatically:
- Download required Docker images
- Set up MongoDB database
- Start the Next.js application
- Configure all connections

### Step 4: Access the Applications
- **Main Application**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin/login
- **Database Manager**: http://localhost:8081

**Default Login Credentials:**
- **Admin**: username: `admin`, password: `admin1234`
- **Executive**: username: `princekumar04`, password: `prince123@`

---

## Detailed Setup Instructions

### Understanding the Project Structure

```
cg_portal_feedback/
├── docker-compose.yml          # Main Docker configuration
├── docker-compose.dev.yml      # Development configuration
├── Dockerfile                  # Next.js app container definition
├── .env.local                  # Environment variables
├── package.json                # Node.js dependencies
└── app/                        # Next.js application code
```

### Step-by-Step Setup

#### Step 1: Prepare the Environment

1. **Navigate to Project Directory**
   ```bash
   cd cg_portal_feedback
   ```

2. **Check Environment File**
   Ensure `.env.local` exists with these settings:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://admin:password123@localhost:27017/cg_portal_feedback?authSource=admin
   
   # MongoDB Root Credentials (for Docker)
   MONGO_ROOT_USERNAME=admin
   MONGO_ROOT_PASSWORD=password123
   
   # Application Configuration
   NODE_ENV=development
   PORT=3000
   
   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
   ```

#### Step 2: Understanding Docker Compose Configuration

Our `docker-compose.yml` file defines three services:

1. **MongoDB Database** (Port 27017)
2. **Mongo Express** (Database Web Interface - Port 8081)
3. **Next.js Application** (Main App - Port 3000)

#### Step 3: Start the Services

**Option A: Start Everything (Recommended for beginners)**
```bash
docker-compose up -d
```

**Option B: Start with Logs (See what's happening)**
```bash
docker-compose up
```

**Option C: Start Individual Services**
```bash
# Start only database
docker-compose up -d mongodb

# Start database + web interface
docker-compose up -d mongodb mongo-express

# Start everything
docker-compose up -d
```

#### Step 4: Verify Everything is Running

```bash
# Check running containers
docker-compose ps

# You should see 3 containers running:
# - mongodb (database)
# - mongo-express (database interface)
# - nextjs-app (main application)
```

#### Step 5: Initialize the Database (Automatic)

The database is automatically initialized with:
- ✅ Schema validation for all collections
- ✅ Default admin user (admin/admin1234)
- ✅ Sample executive users
- ✅ Sample feedback data
- ✅ Proper indexes for performance

---

## Understanding the Components

### 1. MongoDB Database Container
- **Purpose**: Stores all application data (users, feedback, admin settings)
- **Port**: 27017 (internal), mapped to localhost:27017
- **Data**: Persisted in Docker volume `mongodb_data`
- **Access**: Via Mongo Express or direct connection

### 2. Mongo Express Container
- **Purpose**: Web-based MongoDB administration interface
- **Port**: 8081
- **URL**: http://localhost:8081
- **Login**: admin / password123
- **Use**: View and manage database collections

### 3. Next.js Application Container
- **Purpose**: Main web application (frontend + backend APIs)
- **Port**: 3000
- **URL**: http://localhost:3000
- **Features**: Admin dashboard, executive portal, feedback system

---

## Accessing the Applications

### 1. Main Application (http://localhost:3000)
- **Home Page**: Welcome screen with navigation
- **Executive Login**: `/login` - For call center executives
- **Admin Login**: `/admin/login` - For administrators
- **Feedback Form**: `/feedback` - For recording citizen feedback

### 2. Admin Dashboard (http://localhost:3000/admin/login)
**Login Credentials**: `admin` / `admin1234`

**Features:**
- View all feedback submissions
- Manage system users (create/edit/delete)
- Update feedback status
- System analytics

### 3. Executive Portal (http://localhost:3000/login)
**Login Credentials**: `princekumar04` / `prince123@`

**Features:**
- Record citizen feedback
- Submit call center interactions
- Track satisfaction levels

### 4. Database Manager (http://localhost:8081)
**Login Credentials**: `admin` / `password123`

**Features:**
- View all database collections
- Browse stored data
- Execute database queries
- Monitor database performance

---

## Common Issues and Solutions

### Issue 1: Port Already in Use
**Error**: `Port 3000 is already in use`

**Solution:**
```bash
# Stop any existing services on port 3000
# For Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# For Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or change the port in docker-compose.yml
```

### Issue 2: Database Connection Failed
**Error**: `MongoDB connection failed`

**Solution:**
```bash
# Restart MongoDB container
docker-compose restart mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Verify MongoDB is running
docker-compose ps
```

### Issue 3: Application Not Loading
**Error**: `Application fails to start`

**Solution:**
```bash
# Rebuild the application container
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check application logs
docker-compose logs nextjs-app
```

### Issue 4: Permission Denied (Linux/Mac)
**Error**: `Permission denied`

**Solution:**
```bash
# Fix permissions
sudo chown -R $USER:$USER .
chmod -R 755 .

# Or run with sudo
sudo docker-compose up -d
```

---

## Stopping and Managing Containers

### Stop All Services
```bash
docker-compose down
```

### Stop Specific Service
```bash
docker-compose stop mongodb
docker-compose stop mongo-express
docker-compose stop nextjs-app
```

### Remove Everything (Including Data)
```bash
# ⚠️ WARNING: This will delete all data
docker-compose down -v
docker system prune -a
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs mongodb
docker-compose logs nextjs-app

# Follow logs in real-time
docker-compose logs -f
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart mongodb
```

---

## Development Guidelines

### For Developers

#### 1. Development Mode
```bash
# Use development configuration
docker-compose -f docker-compose.dev.yml up -d

# This enables:
# - Hot reload for code changes
# - Development environment variables
# - Debug logging
# - Volume mounting for live editing
```

#### 2. Making Code Changes
```bash
# Code changes are automatically reflected (hot reload)
# If changes don't appear, restart the container:
docker-compose restart nextjs-app
```

#### 3. Adding New Dependencies
```bash
# After adding to package.json, rebuild:
docker-compose down
docker-compose build --no-cache nextjs-app
docker-compose up -d
```

#### 4. Database Management
```bash
# Access MongoDB shell
docker exec -it cg_portal_feedback-mongodb-1 mongosh -u admin -p password123

# Backup database
docker exec cg_portal_feedback-mongodb-1 mongodump --out /backup

# Restore database
docker exec -i cg_portal_feedback-mongodb-1 mongorestore /backup
```

### For Production Deployment

#### 1. Environment Setup
```bash
# Copy and modify environment file
cp .env.local .env.production

# Update production settings:
# - Change passwords
# - Update URLs
# - Set NODE_ENV=production
```

#### 2. Production Build
```bash
# Build for production
docker-compose -f docker-compose.yml build

# Deploy
docker-compose -f docker-compose.yml up -d
```

---

## System Requirements

### Minimum Requirements
- **RAM**: 2GB available
- **Storage**: 5GB free space
- **CPU**: 2 cores
- **OS**: Windows 10, macOS 10.14, or Linux

### Recommended Requirements
- **RAM**: 4GB available
- **Storage**: 10GB free space
- **CPU**: 4 cores
- **Network**: Stable internet connection

---

## Security Notes

### Default Credentials (Change in Production!)
- **MongoDB**: admin / password123
- **Admin User**: admin / admin1234
- **Sample Executive**: princekumar04 / prince123@

### Production Security Checklist
- [ ] Change all default passwords
- [ ] Update NEXTAUTH_SECRET
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS certificates
- [ ] Configure firewall rules
- [ ] Set up backup procedures

---

## Support and Troubleshooting

### Getting Help
1. **Check Logs**: Always start with `docker-compose logs`
2. **Verify Status**: Use `docker-compose ps` to check container status
3. **Restart Services**: Try `docker-compose restart` for most issues
4. **Clean Rebuild**: Use `docker-compose down && docker-compose up --build -d`

### Useful Commands
```bash
# System information
docker system df
docker system info

# Container management
docker container ls
docker image ls
docker volume ls

# Cleanup
docker system prune
docker volume prune
docker image prune
```

---

## Conclusion

This Docker setup provides a complete, production-ready environment for the CG Portal Feedback System. The containerized approach ensures:

- ✅ **Consistent Environment**: Same setup on any machine
- ✅ **Easy Deployment**: One-command setup
- ✅ **Isolated Dependencies**: No conflicts with existing software
- ✅ **Scalable Architecture**: Easy to add more services
- ✅ **Development Ready**: Hot reload and debugging support

For additional help or questions, refer to the official Docker documentation or contact the development team.

**Happy Coding! 🚀**
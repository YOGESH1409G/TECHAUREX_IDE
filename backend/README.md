# 🔧 TechAurex Backend

Express.js backend server for TechAurex - A real-time collaborative code editor with integrated chat and email invitation system.

## 🚀 Features

- **RESTful API** - Express 5 with modular routing
- **Real-time Communication** - Socket.IO for instant messaging and collaboration
- **Authentication** - JWT-based auth with refresh tokens
- **OAuth Integration** - Google and GitHub login
- **Email Service** - Brevo integration for room invitations
- **Database** - MongoDB with Mongoose ODM
- **Security** - Helmet, CORS, bcrypt password hashing
- **Logging** - Pino logger with pretty formatting
- **Background Jobs** - Scheduled tasks for cleanup and presence tracking

## 📋 Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose)
- **Cache:** Redis (optional)
- **Real-time:** Socket.IO
- **Authentication:** Passport.js, JWT
- **Email:** Brevo API
- **File Upload:** Cloudinary (optional)
- **Logger:** Pino

## 🚀 Quick Start

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Create a `.env` file:

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ROOM?retryWrites=true&w=majority

# Server
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# JWT Secrets
JWT_ACCESS_SECRET=your_64_char_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your_64_char_secret
JWT_REFRESH_EXPIRES=7d

# Brevo Email
BREVO_API_KEY=xkeysib-your_api_key_here
BREVO_SENDER_EMAIL=your_verified_email@gmail.com
BREVO_SENDER_NAME=TechAurex

# OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Redis (optional)
USE_REDIS=false
REDIS_URL=redis://localhost:6379

# Cloudinary (optional)
CLOUDINARY_URL=cloudinary://key:secret@cloud_name
```

### Generate JWT Secrets

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Run the Server

```bash
npm start
```

Server runs on `http://localhost:4000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration modules
│   │   ├── db.js           # MongoDB connection
│   │   ├── redis.js        # Redis connection
│   │   ├── passport.js     # Passport strategies
│   │   ├── socket.js       # Socket.IO config
│   │   └── logger.js       # Pino logger
│   │
│   ├── controllers/         # Route controllers
│   │   ├── auth.controller.js
│   │   ├── room.controller.js
│   │   ├── message.controller.js
│   │   ├── user.controller.js
│   │   └── media.controller.js
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── upload.middleware.js
│   │
│   ├── models/              # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── room.model.js
│   │   ├── message.model.js
│   │   ├── invitation.model.js
│   │   └── contact.model.js
│   │
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── room.routes.js
│   │   ├── message.routes.js
│   │   └── user.routes.js
│   │
│   ├── services/            # Business logic
│   │   ├── auth.service.js
│   │   ├── room.service.js
│   │   ├── email.service.js
│   │   └── presence.service.js
│   │
│   ├── sockets/             # Socket.IO handlers
│   │   ├── index.js
│   │   ├── handlers/       # Event handlers
│   │   └── namespaces/     # Socket namespaces
│   │
│   ├── utils/               # Utilities
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── shortHasher.js
│   │
│   ├── helpers/             # Helper functions
│   │   ├── jwt.helper.js
│   │   ├── password.helper.js
│   │   └── socketEvents.helper.js
│   │
│   ├── jobs/                # Background jobs
│   │   ├── cleanupMedia.job.js
│   │   └── presenceSweep.job.js
│   │
│   └── app.js              # Express app setup
│
├── server.js               # Entry point
├── package.json
└── .env
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/signup          # Register new user
POST   /api/v1/auth/login           # Login user
POST   /api/v1/auth/logout          # Logout user
POST   /api/v1/auth/refresh         # Refresh access token
GET    /api/v1/auth/me              # Get current user
```

### OAuth
```
GET    /api/v1/oauth/google         # Google OAuth
GET    /api/v1/oauth/google/callback
GET    /api/v1/oauth/github         # GitHub OAuth
GET    /api/v1/oauth/github/callback
```

### Rooms
```
GET    /api/v1/rooms                # Get user's rooms
POST   /api/v1/rooms                # Create room (1:1 or group)
POST   /api/v1/rooms/join           # Join room by code
```

### Users
```
GET    /api/v1/user/contacts        # Get user contacts
```

### Messages
```
POST   /api/v1/messages             # Send message
GET    /api/v1/messages/:roomId     # Get room messages
```

### Health
```
GET    /api/v1/health               # Server health check
```

## 🔐 Authentication Flow

1. **Signup/Login** - User credentials validated, JWT tokens issued
2. **Access Token** - Short-lived (15m), sent with each request
3. **Refresh Token** - Long-lived (7d), used to get new access tokens
4. **Protected Routes** - Middleware validates JWT before controller access
5. **OAuth** - Google/GitHub authentication with automatic user creation

## 📧 Email Invitation System

### Flow
1. User creates 1:1 room with email address
2. System checks if user exists:
   - **Exists:** Create room, add both users
   - **Not exists:** Create room, send invitation email
3. Email sent via Brevo with room code
4. Recipient clicks link → directed to join page
5. User joins with room code → automatically added to room

### Email Features
- Beautiful HTML templates
- 7-day invitation expiry
- Room code and join link
- Sender information
- Responsive design

## 🎯 Socket.IO Events

### Namespaces
- `/` - Main namespace
- `/chat` - Chat-specific events
- `/code` - Code collaboration events

### Events
```javascript
// Connection
socket.on('connection', (socket) => {})
socket.on('disconnect', () => {})

// Chat
socket.emit('message:send', { roomId, text })
socket.on('message:new', (message) => {})

// Presence
socket.emit('presence:update', { status })
socket.on('presence:online', (userId) => {})

// Room
socket.emit('room:join', { roomId })
socket.emit('room:leave', { roomId })
```

## 🗄️ Database Models

### User
- username, email, password
- avatar, status, lastSeen
- contacts[], rooms[], oneToOne[]
- OAuth provider info

### Room
- roomName, description, avatar
- group (boolean), isPrivate (boolean)
- participants[], createdBy
- roomCode (7-char unique)
- lastMessage

### Message
- roomId, senderId
- text, media
- readBy[], deliveredTo[]
- timestamps

### Invitation
- email, roomId, invitedBy
- token, status
- expiresAt (7 days)

## 🛠️ Development

### Run in Development Mode

```bash
npm start
```

### Logging
Pino logger with pretty formatting in development:
```javascript
logger.info('Message')
logger.error('Error message')
logger.debug('Debug info')
```

### Error Handling
Custom ApiError class:
```javascript
throw new ApiError(404, 'Resource not found')
```

## 🧪 Testing

```bash
npm test
```

Test files in `src/tests/`:
- auth.test.js
- room.test.js
- message.test.js

## 🚀 Deployment

### Environment Variables
Set all `.env` variables in your hosting platform

### Build & Run
```bash
npm install
npm start
```

### Recommended Platforms
- **Render** - Free tier available
- **Railway** - Auto-deploy from GitHub
- **Heroku** - Easy scaling
- **DigitalOcean** - App Platform

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Ensure network access for 0.0.0.0/0

### Socket.IO Connection Failed
- Verify CORS settings in `app.js`
- Check CLIENT_URL in `.env`
- Ensure Socket.IO client version matches server

### Emails Not Sending
- Verify Brevo API key (starts with `xkeysib-`)
- Check sender email is verified in Brevo dashboard
- Review Brevo logs at https://app.brevo.com/log

### JWT Token Errors
- Ensure secrets are properly set
- Check token expiry times
- Verify Authorization header format: `Bearer <token>`

## 📚 Resources

- [Express Documentation](https://expressjs.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Brevo API Documentation](https://developers.brevo.com/)

## 📄 License

ISC

---

**Backend API for TechAurex collaborative code editor**

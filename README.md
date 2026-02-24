# 🚀 TechAurex - Real-Time Collaborative Code Editor

A modern, real-time collaborative code editor with integrated chat, video conferencing, and email invitation system. Built with React, Node.js, Socket.IO, and MongoDB.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.1-61DAFB.svg)

## ✨ Features

### 🎨 Code Editor
- **Monaco Editor Integration** - Full-featured code editor with syntax highlighting
- **Multi-language Support** - JavaScript, TypeScript, Python, Java, HTML, CSS, JSON, and more
- **Theme Customization** - Multiple editor themes (VS Dark, Light, High Contrast)
- **Real-time Collaboration** - See changes from other users in real-time
- **Code Execution** - Run code snippets directly in the editor

### 💬 Chat & Communication
- **Real-time Messaging** - Instant messaging with Socket.IO
- **1:1 and Group Chats** - Private conversations or team discussions
- **Room Management** - Create, join, and manage chat rooms
- **Email Invitations** - Invite users via email with Brevo integration
- **Typing Indicators** - See when others are typing
- **Read Receipts** - Know when messages are read
- **Media Sharing** - Share files and images in conversations

### 🔐 Authentication & Security
- **JWT Authentication** - Secure token-based authentication
- **OAuth Integration** - Login with Google or GitHub
- **Password Encryption** - bcrypt hashing for secure password storage
- **Protected Routes** - Middleware-based route protection
- **CORS Configuration** - Secure cross-origin resource sharing

### 🎥 Real-Time Features
- **Socket.IO Integration** - Bi-directional real-time communication
- **Presence System** - Online/offline status tracking
- **Room Namespaces** - Isolated communication channels
- **Event Broadcasting** - Real-time updates across clients

### 📧 Email System
- **Brevo/SendinBlue Integration** - Professional email delivery
- **HTML Email Templates** - Beautiful, responsive invitation emails
- **Room Invitations** - Send room join links via email
- **Invitation Tracking** - Monitor invitation status and expiry

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Monaco Editor** - VS Code's editor
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **Bcrypt** - Password hashing
- **Brevo API** - Email service
- **Redis** - Caching (optional)
- **Pino** - Fast JSON logger

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB Atlas** account or local MongoDB instance
- **Brevo** account for email functionality
- **Google OAuth** credentials (optional)
- **GitHub OAuth** credentials (optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd IDE_PROJECT
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ROOM?retryWrites=true&w=majority

# Server
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES=7d

# Redis (optional)
REDIS_URL=redis://localhost:6379
USE_REDIS=false

# Cloudinary (optional for file uploads)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/oauth/google/callback

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:4000/api/v1/oauth/github/callback

# Brevo Email Service
BREVO_API_KEY=xkeysib-your_api_key_here
BREVO_SENDER_EMAIL=your_verified_email@gmail.com
BREVO_SENDER_NAME=TechAurex
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:4000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📁 Project Structure

```
IDE_PROJECT/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files (DB, Redis, Passport, etc.)
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── sockets/         # Socket.IO handlers
│   │   ├── utils/           # Utility functions
│   │   ├── helpers/         # Helper functions
│   │   ├── jobs/            # Background jobs
│   │   ├── tests/           # Test files
│   │   └── app.js           # Express app configuration
│   ├── server.js            # Entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Chat/        # Chat components
│   │   │   ├── CodeEditor.jsx
│   │   │   ├── CommandPalette.jsx
│   │   │   └── ...
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── workers/         # Web workers
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── README.md
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
GET    /api/v1/oauth/google         # Google OAuth login
GET    /api/v1/oauth/google/callback
GET    /api/v1/oauth/github         # GitHub OAuth login
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

### Media
```
POST   /api/v1/media/upload         # Upload file
```

### Health
```
GET    /api/v1/health               # Health check
```

## 🎯 Socket.IO Events

### Connection
- `connection` - Client connects
- `disconnect` - Client disconnects

### Chat
- `message:send` - Send message
- `message:new` - New message received
- `typing:start` - User started typing
- `typing:stop` - User stopped typing

### Room
- `room:join` - Join a room
- `room:leave` - Leave a room
- `room:users` - Get room users

### Presence
- `presence:update` - Update user status
- `presence:online` - User came online
- `presence:offline` - User went offline

## 🔧 Configuration

### Environment Variables

#### Backend
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)
- `JWT_ACCESS_SECRET` - JWT access token secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret
- `BREVO_API_KEY` - Brevo email API key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID (optional)

#### Frontend
- `VITE_API_URL` - Backend API URL

## 📧 Email Invitation System

The application includes a robust email invitation system:

1. **Create Room with Email** - When creating a 1:1 room, enter the recipient's email
2. **Email Sent** - Beautiful HTML email sent via Brevo with room code
3. **Join Link** - Email contains clickable link to join the room
4. **Invitation Tracking** - System tracks invitation status and 7-day expiry
5. **Auto-Join** - User automatically added to room upon joining with code

### Email Features
- Professional HTML templates
- 7-day invitation expiry
- Click-to-join functionality
- Room code display
- Responsive design

## 🎨 Customization

### Editor Themes
- VS Dark (default)
- VS Light
- High Contrast Dark
- High Contrast Light

### Editor Settings
- Font size: 12-24px
- Tab size: 2-8 spaces
- Word wrap: on/off
- Minimap: on/off
- Line numbers: on/off/relative

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Build for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🚀 Deployment

### Backend Deployment (Example: Render)
1. Create new Web Service
2. Connect your repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables from `.env`

### Frontend Deployment (Example: Vercel)
1. Connect your repository
2. Set root directory: `frontend`
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=your_backend_url`

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

**MongoDB connection error**
- Check your MongoDB URI
- Ensure IP whitelist in MongoDB Atlas includes your IP
- Verify username and password

**Emails not sending**
- Verify Brevo API key is correct
- Check sender email is verified in Brevo
- Ensure email has `xkeysib-` prefix

**Frontend not connecting to backend**
- Check `VITE_API_URL` in frontend `.env`
- Restart Vite dev server after changing `.env`
- Clear browser cache and do hard refresh

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Socket.IO](https://socket.io/) - Real-time communication
- [Brevo](https://www.brevo.com/) - Email service
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting section

## 🗺️ Roadmap

- [ ] Video/Audio conferencing
- [ ] Screen sharing
- [ ] Code execution in sandboxed environment
- [ ] Collaborative whiteboard
- [ ] File tree navigation
- [ ] Git integration
- [ ] Plugin system
- [ ] Mobile app

---

**Made with ❤️ by Yogesh and the TechAurex team**

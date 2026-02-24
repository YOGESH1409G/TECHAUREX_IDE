# 🎨 TechAurex Frontend

Modern React-based frontend for TechAurex - A real-time collaborative code editor with integrated chat, Monaco Editor, and beautiful UI.

## ✨ Features

- **Monaco Editor Integration** - Full VS Code editor experience
- **Real-time Collaboration** - Live code editing with Socket.IO
- **Chat System** - Instant messaging in rooms and 1:1 conversations
- **Room Management** - Create, join, and manage chat rooms
- **Email Invitations** - Invite users to rooms via email
- **OAuth Authentication** - Login with Google or GitHub
- **Responsive Design** - Works on desktop and mobile
- **Theme Customization** - Multiple editor themes and UI modes
- **Command Palette** - Quick access to all features
- **Settings Panel** - Customize editor and chat preferences

## 🛠️ Tech Stack

- **React 19.1.1** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first CSS framework
- **Monaco Editor** - VS Code's editor component
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library
- **Day.js** - Date/time formatting

## 📋 Prerequisites

- Node.js >= 18.0.0
- Backend API running on port 4000
- Modern browser (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Start

### Installation

```bash
cd frontend
npm install
```

### Environment Setup

Create a `.env` file:

```env
VITE_API_URL=http://localhost:4000
```

**Important:** Environment variables in Vite must be prefixed with `VITE_`

### Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Chat/           # Chat-related components
│   │   │   ├── ChatRoomList.jsx
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── CreateJoinModal.jsx
│   │   │   └── ChatMedia.jsx
│   │   ├── CodeEditor.jsx
│   │   ├── CommandPalette.jsx
│   │   ├── Navbar.jsx
│   │   └── Settings.jsx
│   │
│   ├── context/             # React context providers
│   │   ├── AuthContext.jsx # Authentication state
│   │   ├── SocketContext.jsx # Socket.IO connection
│   │   └── SettingsContext.jsx # User preferences
│   │
│   ├── pages/               # Page components
│   │   ├── Auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── JoinRoom.jsx
│   │   ├── EditorLayout.jsx
│   │   └── OAuthCallbackPage.jsx
│   │
│   ├── services/            # API service functions
│   │   ├── api.js          # Axios instance
│   │   ├── authService.js  # Auth API calls
│   │   ├── roomService.js  # Room API calls
│   │   └── messageService.js # Message API calls
│   │
│   ├── workers/             # Web workers
│   │
│   ├── assets/              # Static assets
│   │
│   ├── App.jsx              # Main app component
│   ├── App.css              # Global styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind imports
│
├── public/                  # Static files
├── index.html              # HTML template
├── package.json
├── vite.config.js          # Vite configuration
└── .env                    # Environment variables
```

## 🎯 Key Components

### CodeEditor
Monaco editor with:
- Syntax highlighting for 20+ languages
- Themes: VS Dark, Light, High Contrast
- Customizable font size, tab size
- Minimap, line numbers, word wrap
- Bracket pair colorization

### Chat System
- **ChatRoomList** - Display all user rooms
- **ChatRoom** - Individual chat interface
- **CreateJoinModal** - Create/join room modal
- **ChatMedia** - Media sharing panel

### Authentication
- Local signup/login with JWT
- OAuth (Google, GitHub)
- Protected routes with AuthContext
- Token refresh handling

### Settings
- Editor preferences
- Chat preferences
- UI customization
- Keyboard shortcuts

## 🔌 API Integration

### Axios Configuration

```javascript
// services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Request Interceptor
Automatically adds JWT token to requests:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor
Handles token refresh:
```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
    }
    return Promise.reject(error);
  }
);
```

## 🎨 Styling

### Tailwind CSS
Utility-first approach with custom configuration:
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Custom colors
      },
    },
  },
};
```

### CSS Modules
Component-scoped styles with good naming

### Global Styles
App.css and index.css for base styles

## 🔐 Authentication Flow

### Login Flow
1. User enters credentials
2. POST to `/api/v1/auth/login`
3. Receive access + refresh tokens
4. Store in localStorage
5. Redirect to editor
6. Socket.IO connects with auth

### OAuth Flow
1. Click Google/GitHub button
2. Redirect to `/api/v1/oauth/google`
3. OAuth provider consent
4. Callback to `/oauth/callback`
5. Parse tokens from URL
6. Store and redirect to editor

### Protected Routes
```jsx
<Route
  path="/editor"
  element={
    <ProtectedRoute>
      <EditorLayout />
    </ProtectedRoute>
  }
/>
```

## 💬 Chat Features

### Room Types
- **1:1 Chat** - Private conversation between two users
- **Group Chat** - Multiple participants with admin roles

### Create Room
```javascript
await createRoom({
  group: false,
  inviteByEmail: "friend@example.com"
});
```

### Join Room
```javascript
await joinRoomByCode("abc1234");
```

### Send Message
```javascript
socket.emit('message:send', {
  roomId: '123',
  text: 'Hello!',
  media: []
});
```

## ⚙️ Configuration

### Vite Config
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
});
```

### Environment Variables
```env
VITE_API_URL=http://localhost:4000
```

**Note:** Restart dev server after changing `.env`

## 🎯 Socket.IO Integration

### Connection
```javascript
import { io } from 'socket.io-client';

const socket = io(VITE_API_URL, {
  auth: {
    token: accessToken
  }
});
```

### Events
```javascript
// Listen for messages
socket.on('message:new', (message) => {
  console.log(message);
});

// Send message
socket.emit('message:send', {
  roomId: '123',
  text: 'Hello!'
});
```

## 🧪 Development Tips

### Hot Module Replacement
Vite provides instant HMR - changes reflect immediately

### Clear Cache
```bash
rm -rf node_modules/.vite
npm run dev
```

### Hard Refresh Browser
- Chrome/Firefox: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear localStorage if auth issues

### Debug API Calls
Check Network tab in DevTools for API requests

### Socket.IO Debug
```javascript
localStorage.setItem('debug', 'socket.io-client:*');
```

## 🚀 Deployment

### Build
```bash
npm run build
```

Output in `dist/` directory

### Deploy to Vercel
1. Connect GitHub repo
2. Set root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables: `VITE_API_URL`

### Deploy to Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Environment: `VITE_API_URL=your_backend_url`

### Deploy to GitHub Pages
```bash
npm run build
npm run deploy
```

## 🔧 Troubleshooting

### Environment Variable Not Loading
- Ensure it starts with `VITE_`
- Restart dev server
- Clear Vite cache

### API Calls Failing
- Check `VITE_API_URL` is correct
- Verify backend is running
- Check browser console for CORS errors

### Socket.IO Not Connecting
- Verify backend Socket.IO server running
- Check authentication token
- Review browser console for errors

### Monaco Editor Issues
- Ensure `@monaco-editor/react` is installed
- Check for conflicting CSS
- Verify browser supports Web Workers

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Monaco Editor React](https://github.com/suren-atoyan/monaco-react)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [Axios Documentation](https://axios-http.com/)

## 🎨 Customization

### Add New Language
Update language options in CodeEditor.jsx

### Add New Theme
Configure in Settings component

### Custom Components
Follow existing component structure in `src/components/`

## 📄 License

ISC

---

**Frontend for TechAurex collaborative code editor**


text

3. **Set frontend environment variables**

Create a `.env` file in the root directory:
VITE_API_URL=https://your-backend-url.com # Set by your backend team

text

4. **Start the app**
npm run dev

text

5. **Open in your browser**
http://localhost:5173

text

---

## 🎨 Project Structure

src/
├── components/
│ ├── Editor/
│ ├── FileExplorer/
│ ├── Chat/
│ ├── VideoCall/
│ ├── Presence/
│ └── ...
├── pages/
│ └── Dashboard.jsx
├── utils/
├── hooks/
├── styles/
└── App.jsx

text

---

## 🔗 Connected Services

- **WebSocket backend:** For real-time document and presence updates
- **REST API:** For project/file CRUD, code execution, and authentication (handled by backend team)

---

## 👨‍💻 How To Use

1. Login or sign up (handled by backend)
2. Create/join a project room
3. Start editing code—your changes sync in real time
4. Open chat sidebar for discussion
5. Start a video call to pair program
6. Explore/manage project files in the sidebar

---

## 🚦 Tips for Dev/Teamwork

- **Keep your branch up-to-date** with main or backend branches to avoid API mismatches.
- All editor state for CRDT sync uses Yjs; see `/src/utils/yjsProvider.js`.
- Ensure the backend you point to supports your Socket.IO and REST API structure.

---

## ✅ Available Scripts

- `npm run dev` – Start Vite dev server
- `npm run build` – Production build
- `npm run lint` – Lint source code

---

## 📄 License

MIT

---

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Yjs CRDT](https://yjs.dev/)
- [Socket.IO](https://socket.io/)
- [Your teammate(s) for backend and infra]

---

## 💬 Contact

Feel free to open issues, PRs, or reach out to yogeshg1409@gmail.com
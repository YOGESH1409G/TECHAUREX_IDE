# 🚀 Real-Time Collaborative Code Editor - Frontend

A modern React-based code editor for instant real-time collaboration. Built with Monaco Editor (VS Code core), Yjs CRDT, WebRTC, and Socket.IO client. Connects to a Node.js/Socket.IO backend for real-world team programming, code execution, chat, and collaborative features.

---

## ✨ Frontend Features

- **Monaco Editor** with syntax highlighting for 20+ languages
- **Real-time collaboration** (CRDT: Yjs)
- **Live cursors & user presence** indicators
- **Chat sidebar** for instant messaging
- **Peer-to-peer video calls** (WebRTC)
- **Project file explorer** (view, create, rename, delete)
- **Run code & view output** panel (via backend API)
- **Responsive design** and light/dark modes

---

## 🛠️ Technologies Used

- [React 18+ (Vite)](https://vitejs.dev/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Socket.IO (Client)](https://socket.io)
- [Yjs](https://docs.yjs.dev/) (CRDT sync)
- [Tailwind CSS](https://tailwindcss.com/)
- [Simple-Peer](https://github.com/feross/simple-peer) (WebRTC)
- State management: useState, Context API, or Zustand
- Icons: Heroicons/Phosphor

---

## ⚡ Getting Started

### Prerequisites

- Node.js >= 18
- Backend Socket.IO API endpoint (running and reachable)
- Recommended: MongoDB Atlas/Redis backend already set up (by your team)

### Installation

1. **Clone this branch**
git clone -b frontend https://github.com/your-username/realtime-collab-code-editor.git
cd realtime-collab-code-editor/frontend

text
2. **Install dependencies**
npm install

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
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useSettings } from './context/SettingsContext';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import OAuthCallbackPage from './pages/Auth/OAuthCallbackPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import CommandPalette from './components/CommandPalette';
import { ToastProvider } from './components/ToastProvider';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Editor Layout Component (Protected)
function EditorLayout() {
  const [language, setLanguage] = useState('javascript');
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  const username = user?.displayName || user?.email || user?.name || 'Anonymous';
  const [isDiff, setIsDiff] = useState(false);
  const [lastSaved, setLastSaved] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Keyboard shortcuts and save handling
  useEffect(() => {
    const keyHandler = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen(true); }
      if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); window.dispatchEvent(new Event('APP_SAVE')); }
      if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); setIsDiff((v) => !v); }
      if (mod && e.shiftKey && e.key.toLowerCase() === 'c') { e.preventDefault(); window.dispatchEvent(new Event('APP_OPEN_CHAT')); }
      if (mod && e.key.toLowerCase() === 'b') { e.preventDefault(); updateSettings('ui.sidebarVisible', !settings.ui.sidebarVisible); }
    };
    const onSaved = (e) => {
      setLastSaved(e.detail?.code || '');
      window.dispatchEvent(new CustomEvent('APP_TOAST', { detail: { message: 'Saved locally', opts: { type: 'success' } } }));
    };
    window.addEventListener('keydown', keyHandler);
    window.addEventListener('APP_SAVED', onSaved);
    return () => {
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('APP_SAVED', onSaved);
    };
  }, [settings.ui.sidebarVisible, updateSettings]);


  return (
    <div className="w-screen h-screen flex flex-col bg-gray-950 text-gray-100">
      <Navbar
        language={language}
        theme={settings.editor.theme}
        onLanguageChange={setLanguage}
        onThemeChange={(v) => updateSettings('editor.theme', v)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        {!settings.ui.sidebarVisible && (
          <button
            onClick={() => updateSettings('ui.sidebarVisible', true)}
            className="absolute left-2 top-14 z-30 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-gray-200 text-xs hover:bg-slate-700"
            title="Show sidebar"
          >
            ⟩
          </button>
        )}
        <div className="flex-1">
          <CodeEditor file="/sample.js" language={language} theme={settings.editor.theme} isDiff={isDiff} originalCode={lastSaved} />
        </div>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        actions={[
          { id: 'format', title: 'Format with Prettier', run: () => window.dispatchEvent(new CustomEvent('APP_FORMAT')) },
          { id: 'toggleWrap', title: 'Toggle Word Wrap', run: () => updateSettings('editor.wordWrap', settings.editor.wordWrap === 'on' ? 'off' : 'on') },
          { id: 'toggleDiff', title: 'Toggle Diff View', run: () => setIsDiff((v) => !v) },
          { id: 'themeDark', title: 'Theme: Dark', run: () => updateSettings('editor.theme', 'vs-dark') },
          { id: 'themeLight', title: 'Theme: Light', run: () => updateSettings('editor.theme', 'light') },
        ]}
      />
    </div>
  );
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

          {/* Protected Route - Editor */}
          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <EditorLayout />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

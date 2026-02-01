import { createContext, useContext, useEffect, useState } from 'react';

const defaultSettings = {
  editor: {
    fontSize: 14,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    theme: 'vs-dark',
    keymap: 'default', // 'default' | 'vim' | 'emacs'
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'off',
    minimap: true,
    lineNumbers: 'on',
    cursorStyle: 'line',
    renderWhitespace: 'none',
    folding: true,
    bracketPairColorization: true,
    autoSaveMs: 0,
  },
  chat: {
    enterToSend: true,
    showTimestamps: true,
    compactMode: false,
    soundNotifications: false,
    desktopNotifications: false,
    autoOpenLastRoom: true,
    typingIndicators: true,
  },
  ui: {
    sidebarVisible: true,
    sidebarWidth: 208,
    sidebarCollapsed: false,
    reduceMotion: false,
    dataSaver: false,
  },
  advanced: {
    socketUrl: '',
  },
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('app_settings');
    if (!saved) return defaultSettings;
    try {
      const parsed = JSON.parse(saved);
      return mergeWithDefaults(defaultSettings, parsed);
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (path, value) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let ref = next;
      for (let i = 0; i < keys.length - 1; i++) ref = ref[keys[i]];
      ref[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const resetSettings = () => setSettings(defaultSettings);

  const replaceSettings = (next) => setSettings(next);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, replaceSettings, defaultSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

function mergeWithDefaults(defs, value) {
  if (typeof defs !== 'object' || defs === null) return value ?? defs;
  const out = Array.isArray(defs) ? [...defs] : { ...defs };
  for (const key of Object.keys(defs)) {
    if (typeof defs[key] === 'object' && defs[key] !== null) {
      out[key] = mergeWithDefaults(defs[key], value?.[key]);
    } else {
      out[key] = value?.[key] !== undefined ? value[key] : defs[key];
    }
  }
  return out;
}

export const useSettings = () => useContext(SettingsContext);



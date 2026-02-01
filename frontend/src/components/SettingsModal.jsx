import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function SettingsModal({ onClose }) {
  const { settings, updateSettings, resetSettings, replaceSettings, defaultSettings } = useSettings();
  const [showResetPreview, setShowResetPreview] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[720px] max-h-[80vh] overflow-auto rounded-xl border border-slate-800 bg-[#0d0d0f] text-white p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700">×</button>
        </div>

        {/* Editor */}
        <section className="mb-6">
          <h3 className="font-medium mb-3">Editor</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Font size</span>
              <input type="number" min="10" max="28" value={settings.editor.fontSize}
                onChange={(e) => updateSettings('editor.fontSize', Number(e.target.value))}
                className="w-20 bg-slate-800 p-1 rounded outline-none" />
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Font family</span>
              <input type="text" value={settings.editor.fontFamily}
                onChange={(e) => updateSettings('editor.fontFamily', e.target.value)}
                className="w-64 bg-slate-800 p-1 rounded outline-none" />
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Theme</span>
              <select value={settings.editor.theme}
                onChange={(e) => updateSettings('editor.theme', e.target.value)}
                className="bg-slate-800 p-1 rounded outline-none">
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
                <option value="hc-black">High Contrast</option>
                <option value="vs">Visual Studio</option>
              </select>
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Keymap</span>
              <select value={settings.editor.keymap}
                onChange={(e) => updateSettings('editor.keymap', e.target.value)}
                className="bg-slate-800 p-1 rounded outline-none">
                <option value="default">Default</option>
                <option value="vim">Vim</option>
                <option value="emacs">Emacs</option>
              </select>
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Tab size</span>
              <input type="number" min="2" max="8" value={settings.editor.tabSize}
                onChange={(e) => updateSettings('editor.tabSize', Number(e.target.value))}
                className="w-20 bg-slate-800 p-1 rounded outline-none" />
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Use spaces for tabs</span>
              <input type="checkbox" checked={settings.editor.insertSpaces}
                onChange={(e) => updateSettings('editor.insertSpaces', e.target.checked)} />
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Word wrap</span>
              <select value={settings.editor.wordWrap}
                onChange={(e) => updateSettings('editor.wordWrap', e.target.value)}
                className="bg-slate-800 p-1 rounded outline-none">
                <option value="off">Off</option>
                <option value="on">On</option>
              </select>
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Minimap</span>
              <input type="checkbox" checked={settings.editor.minimap}
                onChange={(e) => updateSettings('editor.minimap', e.target.checked)} />
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Line numbers</span>
              <select value={settings.editor.lineNumbers}
                onChange={(e) => updateSettings('editor.lineNumbers', e.target.value)}
                className="bg-slate-800 p-1 rounded outline-none">
                <option value="on">On</option>
                <option value="off">Off</option>
                <option value="relative">Relative</option>
              </select>
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Cursor style</span>
              <select value={settings.editor.cursorStyle}
                onChange={(e) => updateSettings('editor.cursorStyle', e.target.value)}
                className="bg-slate-800 p-1 rounded outline-none">
                <option value="line">Line</option>
                <option value="block">Block</option>
                <option value="underline">Underline</option>
              </select>
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded col-span-2">
              <span>Render whitespace</span>
              <select value={settings.editor.renderWhitespace}
                onChange={(e) => updateSettings('editor.renderWhitespace', e.target.value)}
                className="bg-slate-800 p-1 rounded outline-none">
                <option value="none">None</option>
                <option value="boundary">Boundary</option>
                <option value="all">All</option>
              </select>
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Code folding</span>
              <input type="checkbox" checked={settings.editor.folding}
                onChange={(e) => updateSettings('editor.folding', e.target.checked)} />
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Bracket pair colorization</span>
              <input type="checkbox" checked={settings.editor.bracketPairColorization}
                onChange={(e) => updateSettings('editor.bracketPairColorization', e.target.checked)} />
            </label>
          </div>
        </section>

        {/* Chat */}
        <section className="mb-6">
          <h3 className="font-medium mb-3">Chat</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Enter to send</span>
              <input type="checkbox" checked={settings.chat.enterToSend}
                onChange={(e) => updateSettings('chat.enterToSend', e.target.checked)} />
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Show timestamps</span>
              <input type="checkbox" checked={settings.chat.showTimestamps}
                onChange={(e) => updateSettings('chat.showTimestamps', e.target.checked)} />
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Compact bubbles</span>
              <input type="checkbox" checked={settings.chat.compactMode}
                onChange={(e) => updateSettings('chat.compactMode', e.target.checked)} />
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded col-span-2">
              <span>Typing indicators</span>
              <input type="checkbox" checked={settings.chat.typingIndicators}
                onChange={(e) => updateSettings('chat.typingIndicators', e.target.checked)} />
            </label>
          </div>
        </section>

        {/* App/UI */}
        <section className="mb-6">
          <h3 className="font-medium mb-3">App / UI</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Show sidebar</span>
              <input type="checkbox" checked={settings.ui.sidebarVisible}
                onChange={(e) => updateSettings('ui.sidebarVisible', e.target.checked)} />
            </label>
            <label className="flex items-center justify-between bg-slate-900 p-3 rounded">
              <span>Sidebar width</span>
              <input type="number" min="160" max="360" value={settings.ui.sidebarWidth}
                onChange={(e) => updateSettings('ui.sidebarWidth', Number(e.target.value))}
                className="w-24 bg-slate-800 p-1 rounded outline-none" />
            </label>
          </div>
        </section>

        {/* Import / Export */}
        <section className="mt-6">
          <h3 className="font-medium mb-3">Settings Data</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'settings.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
            >
              Export JSON
            </button>

            <label className="px-3 py-2 rounded bg-slate-800 border border-slate-700 cursor-pointer">
              Import JSON
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const text = await file.text();
                    const parsed = JSON.parse(text);
                    if (!parsed.editor || !parsed.chat || !parsed.ui) throw new Error('Invalid settings file');
                    replaceSettings(parsed);
                  } catch (err) {
                    alert('Failed to import settings: ' + (err?.message || 'Unknown error'));
                  } finally {
                    e.target.value = '';
                  }
                }}
              />
            </label>
          </div>
        </section>

        <div className="flex justify-between mt-6">
          <button onClick={() => setShowResetPreview(true)} className="px-3 py-2 rounded bg-slate-800 border border-slate-700">Reset to defaults</button>
          <button onClick={onClose} className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-blue-500">Close</button>
        </div>
      </div>
      {showResetPreview && (
        <ResetPreview onCancel={() => setShowResetPreview(false)} onConfirm={() => { resetSettings(); setShowResetPreview(false); }} current={settings} defaults={defaultSettings} />
      )}
    </div>
  );
}

function ResetPreview({ onCancel, onConfirm, current, defaults }) {
  const changes = computeDiff(current, defaults);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
      <div className="w-[600px] max-h-[70vh] overflow-auto rounded-xl border border-slate-800 bg-[#0e0e10] text-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold mb-3">Reset settings preview</h3>
        {changes.length === 0 ? (
          <p className="text-slate-300 text-sm mb-4">Settings already match defaults.</p>
        ) : (
          <ul className="text-sm space-y-2 mb-4">
            {changes.map((c, i) => (
              <li key={i} className="flex justify-between bg-slate-900 p-2 rounded">
                <span className="text-slate-300">{c.path}</span>
                <span className="text-slate-400">{String(c.from)} → {String(c.to)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-3 py-2 rounded bg-slate-800 border border-slate-700">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-2 rounded bg-gradient-to-r from-indigo-500 to-blue-500">Confirm reset</button>
        </div>
      </div>
    </div>
  );
}

function computeDiff(curr, defs, path = '') {
  const diffs = [];
  for (const key of Object.keys(defs)) {
    const p = path ? `${path}.${key}` : key;
    if (typeof defs[key] === 'object' && defs[key] !== null) {
      diffs.push(...computeDiff(curr?.[key] ?? {}, defs[key], p));
    } else {
      const from = curr?.[key];
      const to = defs[key];
      if (from !== to) diffs.push({ path: p, from, to });
    }
  }
  return diffs;
}

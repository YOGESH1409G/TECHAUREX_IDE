import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function Sidebar() {
  const { settings, updateSettings } = useSettings();
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(settings.ui.sidebarWidth);
  const minWidth = 160;
  const maxWidth = 420;

  if (!settings.ui.sidebarVisible) return null;

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startXRef.current;
      const next = Math.min(maxWidth, Math.max(minWidth, startWidthRef.current + dx));
      updateSettings('ui.sidebarWidth', next);
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, updateSettings]);

  const beginDrag = (e) => {
    setDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = settings.ui.sidebarWidth;
  };

  const files = ['sample.js', 'index.html', 'style.css']; // placeholder files

  return (
    <div
      className="bg-gray-900 text-gray-300 h-[calc(100vh-3rem)] border-r border-gray-800 relative transition-[width] duration-200"
      style={{ width: settings.ui.sidebarWidth }}
    >
      <div className="px-3 py-2">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Files</h2>
      </div>

      <ul className="space-y-2 px-3">
        {files.map((file) => (
          <li key={file} className="hover:text-white cursor-pointer text-sm">
            {file}
          </li>
        ))}
      </ul>

      <div
        onMouseDown={beginDrag}
        className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-500/40"
        title="Drag to resize"
      />
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { useSettings } from '../context/SettingsContext';

const CodeEditor = ({ file, language, theme, isDiff = false, originalCode = '' , onSave }) => {
  const [code, setCode] = useState('// Start coding here...');
  const { settings } = useSettings();
  const workerRef = useRef(null);

  useEffect(() => {
    if (file) {
      fetch(file)
        .then((res) => res.text())
        .then((text) => setCode(text))
        .catch((err) => console.error('Error loading file:', err));
    }
  }, [file]);

  // Update default code based on language
  useEffect(() => {
    if (!file && code === '// Start coding here...') {
      const defaultCode = {
        javascript:
          '// Start coding here...\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}',
        typescript:
          '// TypeScript example\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}',
        html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Example</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>',
        css: '/* CSS Example */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}',
        json: '{\n  "name": "example",\n  "version": "1.0.0",\n  "description": "JSON example"\n}',
        python: '# Python example\ndef greet(name):\n    return f"Hello, {name}!"',
        java: '// Java example\npublic class Hello {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}',
      };
      setCode(defaultCode[language] || '// Start coding here...');
    }
  }, [language]);

  // Setup format and save event listeners
  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/prettierWorker.js', import.meta.url), { type: 'module' });
    const onFormat = () => {
      workerRef.current.postMessage({ code, language });
    };
    const onSave = () => {
      const evt = new CustomEvent('APP_SAVED', { detail: { code } });
      window.dispatchEvent(evt);
    };
    const onWorkerMsg = (e) => {
      if (e.data?.ok) {
        setCode(e.data.code);
        window.dispatchEvent(new CustomEvent('APP_TOAST', { detail: { message: 'Formatted', opts: { type: 'success' } } }));
      } else {
        window.dispatchEvent(new CustomEvent('APP_TOAST', { detail: { message: 'Format failed: ' + (e.data?.error || ''), opts: { type: 'error' } } }));
      }
    };
    workerRef.current.addEventListener('message', onWorkerMsg);
    window.addEventListener('APP_FORMAT', onFormat);
    window.addEventListener('APP_SAVE', onSave);
    return () => {
      window.removeEventListener('APP_FORMAT', onFormat);
      window.removeEventListener('APP_SAVE', onSave);
      workerRef.current?.removeEventListener('message', onWorkerMsg);
      workerRef.current?.terminate();
    };
  }, [code, language]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {isDiff ? (
        <DiffEditor
          height="100%"
          language={language}
          theme={settings?.editor?.theme || theme}
          original={originalCode}
          modified={code}
          options={{
            renderSideBySide: true,
            readOnly: false,
          }}
        />
      ) : (
        <Editor
        height="100%"
        language={language}
        theme={settings?.editor?.theme || theme}
        value={code}
        onChange={(value) => setCode(value || '')}
        options={{
          minimap: { enabled: settings?.editor?.minimap ?? true },
          fontSize: settings?.editor?.fontSize ?? 14,
          fontFamily: settings?.editor?.fontFamily,
          lineNumbers: settings?.editor?.lineNumbers ?? 'on',
          wordWrap: settings?.editor?.wordWrap ?? 'off',
          tabSize: settings?.editor?.tabSize ?? 2,
          insertSpaces: settings?.editor?.insertSpaces ?? true,
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          cursorStyle: settings?.editor?.cursorStyle ?? 'line',
          renderWhitespace: settings?.editor?.renderWhitespace ?? 'none',
          folding: settings?.editor?.folding ?? true,
          bracketPairColorization: settings?.editor?.bracketPairColorization ?? true,
          automaticLayout: true,
        }}
        />
      )}
    </div>
  );
};

export default CodeEditor;

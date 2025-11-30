import { useCallback, useEffect, useState } from 'react';
import Editor from './components/Editor';
import VersionsList from './components/VersionsList';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

function App() {
  const [content, setContent] = useState('');
  const [versions, setVersions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchVersions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/versions`);
      if (!response.ok) {
        throw new Error('Failed to load versions');
      }
      const data = await response.json();
      setVersions(data);
    } catch (err) {
      setError(err.message || 'Unable to load history');
    }
  }, []);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const handleSave = async () => {
    if (!content.trim()) {
      setError('Type something before saving.');
      return;
    }

    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      // TODO: show diff preview before hitting the API once UX is validated.
      const response = await fetch(`${API_BASE}/save-version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: 'Save failed' }));
        throw new Error(payload.message || 'Unable to save version');
      }

      await fetchVersions();
      setMessage('Version saved.');
    } catch (err) {
      setError(err.message || 'Unable to save version');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Mini Audit Trail Generator</h1>
        <p>Track lightweight text edits and inspect their diff summary.</p>
      </header>

      <main>
        <section className="editor-panel">
          <Editor
            content={content}
            onChange={setContent}
            onSave={handleSave}
            isSaving={isSaving}
            successMessage={message}
            errorMessage={error}
          />
        </section>

        <section className="history-panel">
          <VersionsList versions={versions} />
        </section>
      </main>
    </div>
  );
}

export default App;

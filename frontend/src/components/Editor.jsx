const MAX_LENGTH = 10_000;

function Editor({ content, onChange, onSave, isSaving, successMessage, errorMessage }) {
  const remaining = MAX_LENGTH - content.length;

  const handleChange = (event) => {
    if (event.target.value.length > MAX_LENGTH) {
      return;
    }
    onChange(event.target.value);
  };

  return (
    <div className="card">
      <label htmlFor="content-editor" className="field-label">
        Content Editor
      </label>

      <textarea
        id="content-editor"
        className="content-input"
        value={content}
        onChange={handleChange}
        maxLength={MAX_LENGTH}
        rows={10}
        placeholder="Type draft copy, meeting notes, or any text you'd like to version."
      />

      <div className="editor-controls">
        <span className="char-count">{remaining} characters remaining</span>
        <button onClick={onSave} disabled={isSaving} className="primary">
          {isSaving ? 'Saving…' : 'Save Version'}
        </button>
      </div>

      <div className="status-row">
        {successMessage && <p className="status success">{successMessage}</p>}
        {errorMessage && <p className="status error">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Editor;

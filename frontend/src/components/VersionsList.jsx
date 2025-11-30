function renderWordList(words) {
  if (!words || words.length === 0) {
    return <span className="muted">None</span>;
  }

  const preview = words.slice(0, 5);
  const extra = words.length - preview.length;

  return (
    <span>
      {preview.join(', ')}
      {extra > 0 && <span className="muted"> +{extra} more</span>}
    </span>
  );
}

function VersionsList({ versions }) {
  return (
    <div className="card">
      <h2>Version History</h2>
      {versions.length === 0 ? (
        <p className="muted">No versions saved yet. Hit "Save Version" after editing.</p>
      ) : (
        <ul className="versions">
          {versions.map((version) => (
            <li key={version.id} className="version-item">
              <div className="version-header">
                <strong>{version.timestamp}</strong>
                <span>
                  {version.oldLength} → {version.newLength} chars
                </span>
              </div>
              <div className="version-diff">
                <div>
                  <span className="diff-label">Added:</span> {renderWordList(version.addedWords)}
                </div>
                <div>
                  <span className="diff-label">Removed:</span> {renderWordList(version.removedWords)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VersionsList;

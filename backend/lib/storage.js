const fs = require('fs/promises');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'versions.json');
let writeQueue = Promise.resolve();

async function loadVersions() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

async function atomicWrite(payload) {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  const tempPath = `${DATA_FILE}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(payload, null, 2), 'utf8');
  await fs.rename(tempPath, DATA_FILE);
}

function persistVersions(payload) {
  const task = writeQueue.then(() => atomicWrite(payload));
  writeQueue = task.catch((err) => {
    console.error('Failed to persist versions', err);
  });
  return task;
}

module.exports = {
  loadVersions,
  persistVersions,
  DATA_FILE,
};

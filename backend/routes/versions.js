const express = require('express');
const dayjs = require('dayjs');
const { v4: uuidv4 } = require('uuid');
const { computeDiff } = require('../lib/diff');
const { loadVersions, persistVersions } = require('../lib/storage');

const router = express.Router();
const MAX_CONTENT_LENGTH = 10_000;

const publicFields = ({ content, createdAt, ...rest }) => rest;

router.post('/save-version', async (req, res) => {
  const { content } = req.body || {};
  if (typeof content !== 'string') {
    return res.status(400).json({ message: 'content must be a string' });
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return res
      .status(400)
      .json({ message: `Content is capped at ${MAX_CONTENT_LENGTH} characters.` });
  }

  try {
    const versions = await loadVersions();
    const prevContent = versions.length ? versions[versions.length - 1].content : '';
    const diff = computeDiff(prevContent, content);

    const versionRecord = {
      id: uuidv4(),
      timestamp: dayjs().format('YYYY-MM-DD HH:mm'),
      ...diff,
      content,
      createdAt: Date.now(),
    };

    versions.push(versionRecord);
    await persistVersions(versions); // TODO: switch to SQLite when concurrent writes matter.

    return res.status(201).json(publicFields(versionRecord));
  } catch (err) {
    console.error('Failed to save version', err);
    return res.status(500).json({ message: 'Unable to save version right now.' });
  }
});

router.get('/versions', async (_req, res) => {
  try {
    const versions = await loadVersions();
    const payload = versions
      .slice()
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .map(publicFields);

    return res.json(payload);
  } catch (err) {
    console.error('Failed to list versions', err);
    return res.status(500).json({ message: 'Unable to load version history.' });
  }
});

module.exports = router;

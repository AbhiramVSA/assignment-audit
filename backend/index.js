const express = require('express');
const cors = require('cors');
const versionsRouter = require('./routes/versions');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json({ limit: '256kb' }));
app.use('/', versionsRouter);

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Mini Audit Trail backend listening on http://localhost:${PORT}`);
});

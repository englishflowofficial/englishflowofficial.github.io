import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

app.get('/api/firebase-config', (req, res) => {
  try {
    const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Firebase config not found' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

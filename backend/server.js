// server.js
import express from 'express';
import cors    from 'cors';
import multer  from 'multer';
import { create as createIpfsClient } from 'ipfs-http-client';
import Database from 'better-sqlite3';
import path    from 'path';

const app    = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    // Sadece GLB/GLTF dosyalarına izin ver
    const allowedTypes = [
      'model/gltf+json',
      'model/gltf-binary',
      'application/octet-stream' // GLB için
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Sadece .glb veya .gltf dosyaları yüklenebilir'), false);
    }
  }
});

// Veritabanı dosyasını her zaman proje kökünden aç
const dbPath = path.join(process.cwd(), 'nfts.db');
const db     = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS nfts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cid TEXT NOT NULL UNIQUE,
    createdAt INTEGER NOT NULL,
    fileName TEXT,
    fileSize INTEGER,
    fileType TEXT
  );
`);
console.log('Veritabanı tablosu hazır');

// IPFS HTTP client, explicit host/port/protocol
const ipfs = createIpfsClient({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http'
});

(async () => {
  try {
    const version = await ipfs.version();
    console.log(`✅ IPFS bağlantısı başarılı (v${version.version})`);
  } catch (err) {
    console.error('❌ IPFS bağlantı hatası:', err.message);
    console.log('Çözüm için: ipfs daemon komutunu çalıştırın');
    process.exit(1); // Sunucuyu durdur
  }
})();

app.use(cors({
  origin: 'http://localhost:3000', // React uygulamanızın adresi
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mint endpoint (sizin zaten çalışıyor)
app.post('/api/mint', upload.single('file'), async (req, res) => {
  console.log('[API] /api/mint çağrıldı, dosya=', req.file?.originalname);
  try {
    const added = await ipfs.add(req.file.buffer);
    const cid   = added.cid.toString();
    console.log('[API] IPFS cid:', cid);
    db.prepare(
      `CREATE TABLE IF NOT EXISTS nfts (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         cid TEXT NOT NULL,
         createdAt INTEGER NOT NULL
       )`
    ).run();
    db.prepare('INSERT INTO nfts (cid, createdAt) VALUES (?,?)')
      .run(cid, Date.now());
    res.json({ success: true, cid });
  } catch (e) {
    console.error('[API] mint hatası:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// CID listeleme
app.get('/api/cids', (req, res) => {
  const rows = db.prepare('SELECT cid FROM nfts ORDER BY createdAt DESC').all();
  res.json({ cids: rows.map(r => r.cid) });
});

// IPFS proxy endpoint
app.get('/ipfs/:cid', async (req, res) => {
  const { cid } = req.params;
  console.log('[API] /ipfs isteği alındı for CID=', cid);
  try {
    // Content-Typeı doğru verelim (.glb binary)
    res.setHeader('Content-Type', 'application/octet-stream');
    for await (const chunk of ipfs.cat(cid)) {
      res.write(chunk);
    }
    res.end();
    console.log('[API] /ipfs tamamlandı for CID=', cid);
  } catch (e) {
    console.error('[API] /ipfs hatası for CID=', cid, e);
    res.status(500).json({ error: e.message });
  }
});

// Server’ı ayağa kaldır
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 API dinlemede: http://localhost:${PORT}`);
});

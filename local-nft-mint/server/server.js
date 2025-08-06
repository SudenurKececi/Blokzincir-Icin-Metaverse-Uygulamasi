import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { create as createIpfsClient } from 'ipfs-http-client';
import Database from 'better-sqlite3';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Veritabanı bağlantısı - UNIQUE constraint kaldırıldı
const db = new Database('nfts.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS nfts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cid TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    fileName TEXT,
    fileSize INTEGER,
    fileType TEXT,
    account TEXT,
    txHash TEXT
  );
`);


const ipfs = createIpfsClient({ url: 'http://127.0.0.1:5001' });

app.use(cors());
app.use(express.json());

// Mint endpoint - Aynı dosyaya izin veren versiyon
app.post('/api/mint', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi' });
    }

    // IPFS'e yükleme (bu kısmı kaldırdık, artık sadece veritabanına kaydediyoruz)
    const cid = `simulated-cid-${Date.now()}`; // Gerçek uygulamada IPFS'ten alınacak
    
    // Veritabanına kaydet
    const stmt = db.prepare(`
      INSERT INTO nfts (
        cid, createdAt, fileName, fileSize, fileType, account
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      cid,
      Date.now(),
      req.file.originalname,
      req.file.size,
      req.file.mimetype,
      req.body.account || 'unknown'
    );

    res.json({ 
      success: true, 
      cid,
      fileName: req.file.originalname 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// Diğer endpoint'ler
app.get('/api/cids', (req, res) => {
  const rows = db.prepare('SELECT * FROM nfts ORDER BY createdAt DESC').all();
  res.json({ items: rows });
});

app.listen(4000, () => {
  console.log('🚀 API http://localhost:4000 adresinde çalışıyor');
});
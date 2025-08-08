import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { create as createIpfsClient } from 'ipfs-http-client';
import Database from 'better-sqlite3';
import path    from 'path';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Veritabanını aç (aynı dizinde nfts.db dosyası yoksa oluşturulur.)
const db = new Database(path.join(process.cwd(), 'nfts.db'));

  db.exec(`
  CREATE TABLE IF NOT EXISTS nfts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cid TEXT NOT NULL UNIQUE,
    createdAt INTEGER NOT NULL
  );
`);


const ipfs = createIpfsClient({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http',
  timeout: 120000 //2dk timeout büyük dosyalar için
});

app.use(cors());
app.use(express.json());

// Mint endpoint 
app.post('/api/mint', upload.single('file'), async (req, res) => {
   console.log('[API] Mint başladı:', req.file?.originalname);
  try {
    if (!req.file) {
      return res.status(400).json({ success:false, error:'Dosya yok' });
    }

     // IPFS'e yüklemeden önce kontrol
   /* const ipfsId = await ipfs.id();
    console.log('IPFS Bağlantısı:', ipfsId); */

     const added = await ipfs.add(req.file.buffer, {
      timeout: 120000 // 2 dakika timeout büyük dosyalar için
    });

    const cid   = added.cid.toString();
    console.log('[API] IPFS’den dönen CID:', cid);

    // Veritabanına kaydet
   db.prepare('INSERT OR IGNORE INTO nfts (cid, createdAt) VALUES (?,?)')
      .run(cid, Date.now());
    
   
    res.json({ 
      success: true, 
      cid,
    
    });

  } catch (err) {
     console.error('[API] Mint hatası:', e);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// Diğer endpoint'ler
app.get('/api/cids', (req, res) => {
  const rows = db.prepare('SELECT * FROM nfts ORDER BY createdAt DESC').all();
    res.json({ cids: rows.map(r => r.cid) });
});
// 3) IPFS proxy: CID ile /ipfs/:cid çağrısı 
app.get('/ipfs/:cid', async (req, res) => {
  const cid = req.params.cid;
  console.log(`[API] /ipfs çağrıldı: ${cid}`);
  try {
    res.setHeader('Content-Type', 'application/octet-stream');
    for await (const chunk of ipfs.cat(cid)) {
      res.write(chunk);
    }
    res.end();
    console.log(`[API] /ipfs tamamlandı: ${cid}`);
  } catch (e) {
    console.error('[API] IPFS cat hatası:', e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 API http://localhost:${PORT} adresinde çalışıyor`);
});
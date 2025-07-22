import express from 'express';
import cors from 'cors';
import { create } from 'ipfs-http-client';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
const upload = multer({ dest: 'uploads/' });

// IPFS client oluştur
const ipfs = create({ 
  url: 'http://localhost:5001/api/v0'
});

// CORS ayarları
app.use(cors());
app.use(express.json());

// Mint endpoint'i (CAR olmadan)
app.post('/api/mint', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi' });
    }

    // 1. Dosyayı IPFS'e yükle
    const fileContent = fs.readFileSync(req.file.path);
    const added = await ipfs.add(fileContent);
    const cid = added.cid.toString();

    // 2. Geçici dosyayı sil
    fs.unlinkSync(req.file.path);

    // 3. Başarılı yanıt
    res.json({ 
      success: true,
      cid: cid,
      fileType: req.file.mimetype
    });

  } catch (err) {
    console.error('Mint hatası:', err);
    res.status(500).json({ error: err.message });
  }
});

// Sunucuyu başlat
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} üzerinde çalışıyor`);
});
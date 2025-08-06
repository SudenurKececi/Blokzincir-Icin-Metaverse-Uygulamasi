// src/components/Gallery.jsx
import React from 'react'
import './Gallery.css'

const IPFS_GATEWAY = 'http://localhost:8080/ipfs/'

export default function Gallery({ items }) {
  if (!items || items.length === 0) {
    return (
      <p style={{
        textAlign:'center',
        color:'#888',
        fontStyle:'italic',
        marginTop:'2rem'
      }}>
        Henüz mint edilmiş içerik yok.
      </p>
    )
  }

  return (
    <div className="gallery-grid">
      {items.map(({ cid, fileName, fileType, fileSize }) => {
        const url = IPFS_GATEWAY + cid
        const sizeText = fileSize > 1024 * 1024
          ? (fileSize / 1024 / 1024).toFixed(2) + ' MB'
          : (fileSize / 1024).toFixed(2) + ' KB'

        return (
          <div key={cid} className="gallery-card">
            <div className="gallery-img-wrapper">
              <img
                src={url}
                alt={fileName}
                loading="lazy"
                onError={e => { e.currentTarget.src = '/placeholder.png' }}
              />
            </div>
            <div className="gallery-info">
              <div className="title">{fileName}</div>
              <div className="meta">
                {fileType || '—'} · {sizeText}
              </div>
              <code>{cid}</code>
              <a href={url} target="_blank" rel="noopener noreferrer">
                Görüntüle / İndir
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}

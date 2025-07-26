// frontend/src/components/FilesList.jsx
import React from 'react'

/**
 * byte cinsinden gelen fileSize’ı okunaklı KB/MB formatına çevirir
 */
function formatSize(size) {
  if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + ' MB'
  }
  return (size / 1024).toFixed(2) + ' KB'
}

export default function FilesList({ items }) {
  if (!items || items.length === 0) {
    return (
      <p style={{
        textAlign: 'center',
        color: '#777',
        marginTop: '2rem'
      }}>
        Henüz mint edilmiş dosya yok.
      </p>
    )
  }

  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'sans-serif',
      fontSize: '14px'
    }}>
      <thead>
        <tr>
          <th style={thStyle}>Ad</th>
          
          <th style={{ ...thStyle, textAlign:'right' }}>Boyut</th>
          <th style={{ ...thStyle, textAlign:'right' }}>Tarih</th>
        </tr>
      </thead>
      <tbody>
        {items.map(({ cid, fileName, fileType, fileSize, timestamp }) => (
          <tr key={cid}>
            <td style={tdStyle}>{fileName}</td>
            
            <td style={{ ...tdStyle, textAlign:'right' }}>
              {formatSize(fileSize)}
            </td>
            <td style={{ ...tdStyle, textAlign:'right' }}>
              {timestamp}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ortak stil objeleri
const thStyle = {
  textAlign: 'left',
  padding: '8px',
  borderBottom: '1px solid #ddd'
}
const tdStyle = {
  padding: '8px',
  borderBottom: '1px solid #eee'
}

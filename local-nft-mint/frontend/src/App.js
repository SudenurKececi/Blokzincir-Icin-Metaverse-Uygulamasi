import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import UploadAndMint from './components/UploadAndMint'
import Scene         from './components/Scene'
import Gallery       from './components/Gallery'
import FilesList     from './components/FilesList'

function App() {
  // Tüm mint kayıtlarını bir dizi olarak tutuyoruz
  const [mintedList, setMintedList] = useState([])
  const [isMinting,   setIsMinting]   = useState(false)
  const [mintError,   setMintError]   = useState(null)
  const [showFiles,   setShowFiles]   = useState(false)

  // Son mint’lenen CID’i 3B sahnede göstermek için
  const lastCid = mintedList.length > 0
    ? mintedList[mintedList.length - 1].cid
    : null

  return (
    <div style={{ display:'flex', height:'100vh' }}>
      {/* ---------- 3B SAHNE ---------- */}
      <div style={{ flex:3 }}>
        <Canvas camera={{ position: [0,2,5] }}>
          <ambientLight />
          <pointLight position={[10,10,10]} />
          <Scene cid={lastCid} />
        </Canvas>
      </div>

      {/* ---------- YAN PANEL ---------- */}
      <div style={{
        flex:1,
        padding: '32px',           
        background: '#f9fafb',     
        display:'flex',
        flexDirection:'column'
      }}>
        <h2 style={{
          marginBottom: '24px',    
          fontSize: '1.75rem',    
          fontWeight: '700',
          color: '#222'
        }}>
          Upload &amp; Mint
        </h2>

        {/* Upload işlemini tetikleyen bileşen */}
        <UploadAndMint
          onMintingStart={() => {
            setIsMinting(true)
            setMintError(null)
          }}
          onMinted={(data) => {
            setMintedList(prev => [...prev, data])
            setIsMinting(false)
            setMintError(null)
          }}
          onError={(err) => {
            setMintError(err.message)
            setIsMinting(false)
          }}
        />

        {/* Mint süreci ve hata uyarıları */}
        {isMinting && (
          <div style={{
            marginTop:20,
            padding:10,
            background:'#fff3cd',
            borderRadius:4
          }}>
            ⏳ Mint işlemi devam ediyor...
          </div>
        )}
        {mintError && (
          <div style={{
            marginTop:20,
            padding:10,
            background:'#f8d7da',
            color:'#721c24',
            borderRadius:4
          }}>
            ❌ Hata: {mintError}
          </div>
        )}

        {/* Gallery / Files toggle */}
        <div style={{ marginTop:20, display:'flex', gap:10 }}>
          <button
            onClick={() => setShowFiles(false)}
            style={{
              flex:1,
              padding:'8px 12px',
              background: showFiles ? '#ccc' : '#0077cc',
              color: showFiles ? '#333' : '#fff',
              border:'none', borderRadius:4,
              cursor:'pointer'
            }}
          >
            Gallery
          </button>
          <button
            onClick={() => setShowFiles(true)}
            style={{
              flex:1,
              padding:'8px 12px',
              background: showFiles ? '#0077cc' : '#ccc',
              color: showFiles ? '#fff' : '#333',
              border:'none', borderRadius:4,
              cursor:'pointer'
            }}
          >
            Files
          </button>
        </div>

        {/* Görünüm Alanı */}
        <div style={{ flexGrow:1, overflowY:'auto', marginTop:20 }}>
          {showFiles
            ? <FilesList items={mintedList} />
            : <Gallery   items={mintedList} />
          }
        </div>
      </div>
    </div>
  )
}

export default App
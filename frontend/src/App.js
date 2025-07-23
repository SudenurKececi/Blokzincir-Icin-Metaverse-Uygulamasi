// frontend/src/App.js
import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import UploadAndMint from './components/UploadAndMint'
import Scene from './components/Scene'

function App() {
  const [mintedData, setMintedData] = useState(null)
  const [isMinting, setIsMinting] = useState(false)
  const [mintError, setMintError] = useState(null)

  return (
    <div style={{ display:'flex', height:'100vh' }}>
      <div style={{ flex:3 }}>
        <Canvas camera={{ position: [0,2,5] }}>
          <ambientLight />
          <pointLight position={[10,10,10]} />
          <Scene cid={mintedData?.cid} />
        </Canvas>
      </div>
      <div style={{ 
        flex:1, 
        padding:20, 
        background:'#eee',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Upload & Mint</h2>
        
        <UploadAndMint
          onMinted={(data) => {
            setMintedData(data)
            setIsMinting(false)
            setMintError(null)
          }}
          onMintingStart={() => {
            setIsMinting(true)
            setMintError(null)
          }}
          onError={(error) => {
            setMintError(error.message)
            setIsMinting(false)
          }}
        />

        {isMinting && (
          <div style={{ 
            marginTop: '20px',
            padding: '10px',
            background: '#fff3cd',
            borderRadius: '4px'
          }}>
            <p>⏳ Mint işlemi devam ediyor...</p>
          </div>
        )}

        {mintError && (
          <div style={{ 
            marginTop: '20px',
            padding: '10px',
            background: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px'
          }}>
            <p>❌ Hata: {mintError}</p>
          </div>
        )}

        {mintedData && !isMinting && (
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            background: 'white',
            borderRadius: '8px',
            flexGrow: 1
          }}>
            <h3 style={{ marginTop: 0 }}>Mint Bilgileri</h3>
            <p><strong>CID:</strong> 
              <span style={{ 
                display: 'inline-block',
                wordBreak: 'break-all',
                fontFamily: 'monospace'
              }}>
                {mintedData.cid}
              </span>
            </p>
            <p><strong>İşlem Hash:</strong> 
              <span style={{ 
                display: 'inline-block',
                wordBreak: 'break-all',
                fontFamily: 'monospace'
              }}>
                {mintedData.txHash}
              </span>
            </p>
            <p><strong>IPFS URL:</strong></p>
            <a 
              href={mintedData.ipfsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#0066cc',
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                display: 'inline-block',
                marginTop: '5px'
              }}
            >
              {mintedData.ipfsUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
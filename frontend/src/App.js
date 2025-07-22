// frontend/src/App.js
import React, { useState } from 'react'
import { Canvas }           from '@react-three/fiber'
import UploadAndMint       from './components/UploadAndMint'
import Scene               from './components/Scene'

function App() {
  const [cid, setCid]       = useState(null)
  const [fileName, setName] = useState('')

  return (
    <div style={{ display:'flex', height:'100vh' }}>
      <div style={{ flex:3 }}>
        <Canvas camera={{ position: [0,2,5] }}>
          <ambientLight />
          <pointLight position={[10,10,10]} />
          <Scene cid={cid} />
        </Canvas>
      </div>
      <div style={{ flex:1, padding:20, background:'#eee' }}>
        <h2>Upload & Mint</h2>
        <UploadAndMint
          onMinted={(newCid, name) => {
            setCid(newCid)
            setName(name)
          }}
        />
        {cid && (
          <>
            <p><strong>CID:</strong> {cid}</p>
            <p><strong>Name:</strong> {fileName}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default App

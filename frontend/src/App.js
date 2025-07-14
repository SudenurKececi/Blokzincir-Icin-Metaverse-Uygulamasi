// src/App.js
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';
import UploadAndMint from './components/UploadAndMint';
import Scene from './components/Scene';

function App() {
  const [lastCid,  setLastCid]  = useState(null);
  const [lastName, setLastName] = useState('');

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 3D Sahne */}
      <div style={{ flex: 3 }}>
        <Canvas camera={{ position: [0, 2, 5] }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />

          {/* Scene her zaman mount ediliyor */}
          <Scene cid={lastCid} fileName={lastName} />
        </Canvas>
      </div>

      {/* Mint Paneli */}
      <div style={{ flex: 1, padding: '1rem', background: '#f0f0f0' }}>
        <h2>Upload & Mint Asset</h2>
        <UploadAndMint
          onMinted={(cid, fileName) => {
            setLastCid(cid);
            setLastName(fileName);
          }}
        />
        {lastCid && (
          <>
            <p><strong>Last CID:</strong> {lastCid}</p>
            <p><strong>File Name:</strong> {lastName}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

// Project: Blockchain-Based Metaverse Web App
// Type: Efficient, Low‑Cost Block Storage + Interactive 3D Front‑End

/*
====================================================================
1) PREREQUISITES
--------------------------------------------------------------------
- Node.js (v16+)
- npm or yarn
- Metamask (or any Web3 wallet) for front‑end tests
- An Ethereum testnet account (e.g., Goerli)

Install global dependencies:
```bash
npm install -g hardhat
```

====================================================================
2) DIRECTORY STRUCTURE
--------------------------------------------------------------------
./
├── contracts/             # Solidity smart contracts
│   └── AssetStorage.sol
├── scripts/               # Deployment scripts
│   └── deploy.js
└── frontend/              # React application
    ├── package.json
    └── src/
        ├── App.jsx
        └── components/
            ├── UploadAndMint.jsx
            └── Scene.jsx
*/

// ┌───────────────────────────┐
// │ 3) On‑Chain Contract      │
// └───────────────────────────┘
pragma solidity ^0.8.18;

/// @title AssetStorage
/// @notice Maps unique IDs to IPFS CIDs, minimizing on‑chain payload
contract AssetStorage {
    // Incremental token ID counter
    uint256 public nextId;
    // token ID → IPFS CID (Content Identifier)
    mapping(uint256 => string) public cids;

    /// @notice Emitted when a new asset is registered
    event AssetRegistered(uint256 indexed id, string cid);

    /// @notice Registers a new asset CID on‑chain
    /// @param cid The IPFS CID string
    /// @return id The assigned token ID
    function register(string calldata cid) external returns (uint256 id) {
        id = nextId;
        cids[id] = cid;
        emit AssetRegistered(id, cid);
        nextId++;
    }
}

/*
Explanation:
- We store only a string (CID), not bulky data.
- `nextId` auto‑increments, giving each upload a unique key.
- `AssetRegistered` helps front‑ends index new uploads.
*/

// ┌───────────────────────────┐
// │ 4) Hardhat Deploy Script   │
// └───────────────────────────┘
const hre = require("hardhat");

async function main() {
  // Compile & get contract factory
  const AssetStorage = await hre.ethers.getContractFactory("AssetStorage");
  // Deploy to network configured in hardhat.config.js
  const storage = await AssetStorage.deploy();
  await storage.deployed();
  console.log("AssetStorage deployed to:", storage.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*
How to deploy:
1. Configure network in hardhat.config.js (e.g., Goerli with an INFURA key).
2. Run: `npx hardhat run scripts/deploy.js --network goerli`.
*/

// ┌───────────────────────────┐
// │ 5) React Front‑End         │
// └───────────────────────────┘
import React from 'react';
import { Canvas } from '@react-three/fiber';
import UploadAndMint from './components/UploadAndMint';
import Scene from './components/Scene';

export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 3D Viewport */}
      <div style={{ flex: 3 }}>
        <Canvas camera={{ position: [0, 2, 5] }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Scene />
        </Canvas>
      </div>
      {/* Control Panel */}
      <div style={{ flex: 1, padding: '1em', background: '#f0f0f0' }}>
        <h2>Upload & Mint Asset</h2>
        <UploadAndMint />
      </div>
    </div>
  );
}

/*
Explanation:
- We use @react-three/fiber for 3D rendering.
- The layout splits viewport (left) and controls (right).
*/

// ┌─────────────────────────────────────────────────────────────┐
// │ 6) UploadAndMint Component                                 │
// └─────────────────────────────────────────────────────────────┘
import React, { useState } from 'react';
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';
import AssetStorageAbi from '../../artifacts/contracts/AssetStorage.sol/AssetStorage.json';

const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });
// TODO: replace with your deployed contract address
const CONTRACT_ADDRESS = '<YOUR_CONTRACT_ADDRESS_HERE>';

export default function UploadAndMint() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  async function handleMint() {
    try {
      setStatus('Uploading file to IPFS...');
      const added = await ipfs.add(file);
      const cid = added.path;
      setStatus(`Uploaded: ${cid}`);

      setStatus('Connecting to wallet...');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        AssetStorageAbi.abi,
        signer
      );

      setStatus('Minting asset on-chain...');
      const tx = await contract.register(cid);
      await tx.wait();
      setStatus('✅ Asset successfully minted!');
    } catch (error) {
      console.error(error);
      setStatus('❌ Error: ' + error.message);
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleMint} disabled={!file}>
        Mint
      </button>
      <p>{status}</p>
    </div>
  );
}

/*
Key Points:
- We use ipfs-http-client to upload files.
- We get CID, then call our smart contract’s `register`.
- Status messages guide the user through each step.
*/

// ┌─────────────────────────────────────────────────────────────┐
// │ 7) Scene Component                                         │
// └─────────────────────────────────────────────────────────────┘
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Scene() {
  const box = useRef();
  // Rotate object every frame
  useFrame(() => {
    box.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={box} position={[0, 1, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

/*
This rotating cube is a placeholder. In production,
load and display the 3D asset fetched by CID.
*/

// ┌─────────────────────────────────────────────────────────────┐
// │ 8) RUNNING THE APP                                         │
// └─────────────────────────────────────────────────────────────┘
/*
1) Deploy contract:
   npx hardhat run scripts/deploy.js --network goerli
2) Note the contract address, paste into UploadAndMint.jsx
3) Start React app:
   cd frontend
   npm install
   npm start
4) Open http://localhost:3000, connect wallet, upload a file, and mint!
*/

import React, { useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import AssetStorageAbi from '../abis/AssetStorage.json';

const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

export default function UploadAndMint({ onMinted }) {
  const [file, setFile]     = useState(null);
  const [status, setStatus] = useState('');

  const handleFile = e => {
    setFile(e.target.files[0]);
  };

  const handleMint = async () => {
    if (!file) {
      setStatus('❌ Please select a file first.');
      return;
    }

    try {
      setStatus('📤 Uploading to Pinata…');
      const form = new FormData();
      form.append('file', file);
      form.append('pinataOptions', JSON.stringify({ wrapWithDirectory: false }));

      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          pinata_api_key:        process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET
        },
        body: form
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Pinata upload failed: ${text}`);
      }

      const data = await res.json();
      const cid  = data.IpfsHash;
      setStatus(`✅ Uploaded CID: ${cid}`);
      console.log('🔍 Minted CID is:', cid);

      // Cüzdan bağlama ve mint
      setStatus('🔗 Connecting wallet…');
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      setStatus('⛓️ Minting on-chain…');
      const signer   = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, AssetStorageAbi.abi, signer);
      const tx       = await contract.register(cid);
      await tx.wait();

      setStatus('🚀 Asset successfully minted!');
      onMinted && onMinted(cid, file.name);

    } catch (err) {
      console.error(err);
      setStatus('❌ ' + err.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFile} />
      <button onClick={handleMint}>Mint</button>
      <p>{status}</p>
    </div>
  );
}

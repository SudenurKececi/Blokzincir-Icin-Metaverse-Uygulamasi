import React, { useState, useEffect } from 'react';
import { create } from 'ipfs-http-client';

const ipfs = create({ 
  url: 'http://localhost:5001/api/v0' 
});

export default function UploadAndMint({ onMinted }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState('');
  const [contractAddress] = useState('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');

  // Sayfa yüklendiğinde cüzdan bağlantısını kontrol et
  useEffect(() => {
    if (window.ethereum?.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
    }
  }, []);

  // MetaMask bağlantı fonksiyonu
  const connectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        window.open('https://metamask.io/download.html', '_blank');
        throw new Error('MetaMask yüklü değil!');
      }

      // Hardhat ağını ekle
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x7A69',
          chainName: 'Hardhat Local',
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['http://localhost:8545'],
        }],
      });

      // Hesapları iste
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setAccount(accounts[0]);
      setStatus('✅ MetaMask bağlandı!');
    } catch (error) {
      setStatus(`❌ Hata: ${error.message}`);
    }
  };

  // Dosya seçme fonksiyonu
  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('✅ Dosya seçildi: ' + e.target.files[0].name);
    }
  };

  // Mint fonksiyonu (IPFS + Blockchain entegre)
  const handleMint = async () => {
    if (!account) {
      setStatus('⚠️ Önce MetaMask ile bağlanın');
      return;
    }

    if (!file) {
      setStatus('⚠️ Lütfen bir dosya seçin');
      return;
    }

    setIsLoading(true);
    setStatus('🔄 IPFS\'e yükleniyor...');

    try {
      // 1. Dosyayı IPFS'e yükle
      const added = await ipfs.add(file);
      const cid = added.cid.toString();
      setStatus('🔄 IPFS yükleme tamamlandı, mint işlemi başlatılıyor...');

      // 2. MetaMask ile mint işlemi
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: contractAddress,
          value: '0x' + (0.01 * 1e18).toString(16), // 0.01 ETH
          data: '0x1aa3a008' // Mint fonksiyonu hex kodu
        }]
      });

      setStatus(`✅ Mint başarılı! CID: ${cid} | TX: ${txHash}`);
      onMinted(cid); // Parent componente CID'i ilet
    } catch (error) {
      console.error('Mint hatası:', error);
      setStatus(`❌ Hata: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '500px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#333' }}>NFT Mint Sayfası</h2>
      
      {/* Dosya Yükleme */}
      <div style={{ margin: '15px 0' }}>
        <input
          type="file"
          onChange={handleFile}
          disabled={isLoading}
          style={{ display: 'block', marginBottom: '10px' }}
        />
      </div>

      {/* MetaMask Bağlantısı */}
      {!account ? (
        <button
          onClick={connectMetaMask}
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            background: '#f6851b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '10px 0',
            fontSize: '16px'
          }}
        >
          🔗 MetaMask ile Bağlan
        </button>
      ) : (
        <p style={{ margin: '10px 0' }}>
          Bağlı Cüzdan: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      )}

      {/* Mint Butonu */}
      <button
        onClick={handleMint}
        disabled={!file || !account || isLoading}
        style={{
          padding: '10px 15px',
          background: !file || !account ? '#cccccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: (!file || !account || isLoading) ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {isLoading ? '⏳ İşleniyor...' : '🏷️ Mint Yap (0.01 ETH)'}
      </button>

      {/* Durum Mesajı */}
      {status && (
        <div style={{ 
          marginTop: '20px',
          padding: '10px',
          background: status.includes('✅') ? '#e6ffed' : '#ffebee',
          borderRadius: '5px',
          borderLeft: status.includes('✅') ? '4px solid #2ecc71' : '4px solid #e74c3c'
        }}>
          {status}
        </div>
      )}
    </div>
  );
}
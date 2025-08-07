import React, { useState, useEffect } from 'react';
import { create } from 'ipfs-http-client';


const ipfs = create({ 
  url: 'http://localhost:5001/api/v0',
  timeout: '2m' // 2 dakika timeout büyük dosyalar ve güvenlik için
});

export default function UploadAndMint({ onMinted, onMintingStart, onError }) {

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState('');
  const [contractAddress] = useState('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');

  
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum?.selectedAddress) {
        setAccount(window.ethereum.selectedAddress);
        
        
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          if (chainId !== '0x7A69') {
            await switchToHardhatNetwork();
          }
        } catch (error) {
          console.error('Ağ kontrol hatası:', error);
          onError?.(error);
        }
      }
    };
    
    checkWalletConnection();
  }, [onError]);

  
  const switchToHardhatNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x7A69',
          chainName: 'Hardhat Local',
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['http://localhost:8545'],
        }],
      });
    } catch (error) {
      console.error('Ağ ekleme hatası:', error);
      onError?.(error);
      throw error;
    }
  };

  
  const connectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        window.open('https://metamask.io/download.html', '_blank');
        throw new Error('MetaMask yüklü değil!');
      }

      await switchToHardhatNetwork();

      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setAccount(accounts[0]);
      setStatus('✅ MetaMask bağlandı!');
    } catch (error) {
      console.error('Bağlantı hatası:', error);
      setStatus(`❌ Hata: ${error.message}`);
      onError?.(error);
    }
  };

  
  const handleFile = (e) => {
    if (!e.target.files?.[0]) return;

    const selectedFile = e.target.files[0];
    
    
    if (!selectedFile.name.match(/\.(glb|gltf)$/i)) {
      const err = new Error('Sadece .glb veya .gltf dosyaları yükleyebilirsiniz');
      setStatus(`❌ ${err.message}`);
      onError?.(err);
      return;
    }

    
    if (selectedFile.size > 50 * 1024 * 1024) {
      const err = new Error('Dosya boyutu 50MB sınırını aşıyor');
      setStatus(`❌ ${err.message}`);
      onError?.(err);
      return;
    }

    setFile(selectedFile);
    setStatus(`✅ Dosya seçildi: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`);
  };

  // Mint fonksiyonu (IPFS + Blockchain entegre)
  const handleMint = async () => {
    if (!account) {
      const err = new Error('Önce MetaMask ile bağlanın');
      setStatus(`⚠️ ${err.message}`);
      onError?.(err);
      return;
    }

    if (!file) {
      const err = new Error('Lütfen bir dosya seçin');
      setStatus(`⚠️ ${err.message}`);
      onError?.(err);
      return;
    }

    setIsLoading(true);
    setStatus('🔄 IPFS\'e yükleniyor...');
    onMintingStart?.();

     try {
      // 1. Dosyayı sunucuya gönder
      const formData = new FormData();
      formData.append('file', file);
      formData.append('account', account);

      setStatus('🔄 Dosya sunucuya yükleniyor...');
      const uploadResponse = await fetch('http://localhost:4000/api/mint', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error(await uploadResponse.text());
      }

      const { cid, fileName } = await uploadResponse.json();

      // 2. MetaMask ile mint işlemi
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: contractAddress,
          value: '0x0', // 0.00 ETH
          data: '0x85fb566d' // register(string) fonksiyonu hex kodu
        }]
      });

       // 3. Sonuçları işle
      setStatus(`✅ Mint başarılı!\nCID: ${cid}\nTX Hash: ${txHash}`);
      onMinted({
        cid,
        txHash,
        ipfsUrl: `ipfs://${cid}`,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        timestamp: new Date().toLocaleString()
      });

    } catch (error) {
      console.error('Mint hatası:', error);
      setStatus(`❌ Hata: ${error.message.split('\n')[0]}`);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '500px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#333', textAlign: 'center' }}>3D NFT Mint Arayüzü</h2>
      
      {/* Dosya Yükleme */}
      <div style={{ 
        margin: '20px 0',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px'
      }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          3D Model Dosyası Seç (.glb/.gltf)
        </label>
        <input
          type="file"
          onChange={handleFile}
          disabled={isLoading}
          accept=".glb,.gltf"
          style={{ 
            display: 'block',
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* MetaMask Bağlantısı */}
      <div style={{ 
        margin: '20px 0',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px'
      }}>
        {!account ? (
          <button
            onClick={connectMetaMask}
            disabled={isLoading}
            style={{
              padding: '12px 20px',
              background: '#f6851b',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>🔗</span> MetaMask ile Bağlan
          </button>
        ) : (
          <div>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Bağlı Cüzdan:</p>
            <div style={{
              padding: '10px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              wordBreak: 'break-all'
            }}>
              {account}
            </div>
          </div>
        )}
      </div>

      {/* Mint Butonu */}
      <button
        onClick={handleMint}
        disabled={!file || !account || isLoading}
        style={{
          padding: '12px 20px',
          background: (!file || !account || isLoading) ? '#cccccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: (!file || !account || isLoading) ? 'not-allowed' : 'pointer',
          width: '100%',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          margin: '20px 0'
        }}
      >
        {isLoading ? (
          <span>⏳ İşleniyor...</span>
        ) : (
          <>
            <span>🏷️</span> Mint Yap
          </>
        )}
      </button>

      {/* Durum Mesajı */}
      {status && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: status.includes('✅') ? '#e6ffed' : 
                         status.includes('❌') ? '#ffebee' : '#fff3cd',
          borderRadius: '8px',
          borderLeft: status.includes('✅') ? '4px solid #2ecc71' : 
                     status.includes('❌') ? '4px solid #e74c3c' : '4px solid #ffc107',
          whiteSpace: 'pre-line'
        }}>
          {status}
        </div>
      )}
    </div>
  );
}
# Blokzincir İçin Metaverse Uygulaması
Kullanıcıların .glb model dosyalarını NFT olarak mint ettiği, CID’lerin backend veritabanında saklandığı ve bu varlıkların Unity ile geliştirilen metaverse NFT müzesinde sergilendiği uçtan uca bir örnek.

<img width="1300" height="520" alt="image" src="https://github.com/user-attachments/assets/cb88b5a9-332f-48c5-80cf-cf0b1299e8c1" />


✨Özellikler 


• Cüzdan Bağlantısı: MetaMask/WalletConnect ile Ethereum/yan ağlar

• NFT Mint: Kullanıcının yüklediği .glb dosyasını IPFS’e yükleyip ERC‑721 olarak mint etme

• CID Yönetimi: Backend API, IPFS CID ve zincir üstü tokenId/txHash bilgilerini DB’de tutar

• Unity Müzesi: Backend’ten verileri çekip 3B galeride modelleri sergiler

• Güvenli Upload: Dosya boyutu/türü kontrolleri, basit oran sınırlama

<img width="880" height="506" alt="image" src="https://github.com/user-attachments/assets/b30656e2-add2-46a7-b8a0-dfe0f4d6f1e1" />

Önerilen Bileşenler:

• Smart Contract: ERC‑721, mintModel(cid, metadataURI)

• Depolama: IPFS (örn. web3.storage/Pinata/Filebase)

• Backend: Node.js

• DB: SQLite

• Unity: GLB yükleme + sahnede “slot” yerleşimi

Önerilen Depo Yapısı:

<img width="535" height="251" alt="image" src="https://github.com/user-attachments/assets/2bf202f0-377e-479e-a29a-864bbf67af8e" />


⚙️ Kurulum:
1) Akıllı Sözleşme:
   
<img width="589" height="156" alt="image" src="https://github.com/user-attachments/assets/d051d3d3-6c33-4b7f-af66-2e9870c08aa2" />


2) Backend API:

<img width="240" height="129" alt="image" src="https://github.com/user-attachments/assets/0d6789fc-f418-4982-a718-26d242777c89" />

.env örnek: 

<img width="643" height="246" alt="image" src="https://github.com/user-attachments/assets/0cc54801-51b4-4d49-9797-f77d6897e396" />

3) Unity İstemci:

Edit > Project Settings > Player > Scripting Backend vb. ayarları yap

unity/Assets/Scripts/Config.cs içinde API URL ve ağ bilgilerini ayarla:

<img width="605" height="97" alt="image" src="https://github.com/user-attachments/assets/92667a99-0b25-4ca5-b25b-7a2aa14874c2" />

Museum.unity sahnesini aç, Loader script’inde GET /api/nfts ile listeyi çekip CID üzerinden IPFS’ten .glb’i indir/yükle

🔐 Cüzdan & Mint Akışı:


• Cüzdan Bağla: Kullanıcı Connect Wallet butonuna tıklar (MetaMask/WalletConnect).

• Model Yükle: .glb seçilir, istemci /api/upload’a yollar.

• IPFS: Backend dosyayı IPFS’e yükler, CID döner.

• Mint: İstemci, sözleşmede mintModel(cid, metadataURI) çağrısını imzalatır.

• Kayıt: Backend, owner / cid / tokenId / txHash bilgilerini DB’ye yazar.

• Sergile: Unity müzesi /api/nfts ile verileri çeker, sahnede gösterir.

-----------------------------------------------------------------------------------------------------

🔌 API Uçları (örnek):


• POST /api/upload — multipart form ile .glb; dönüş: { cid }

• POST /api/nfts/mint — body: { cid, owner, tokenId, txHash, filename }

• GET /api/nfts — tüm NFT’ler: [{ id, owner, cid, tokenId, txHash, createdAt }]

• GET /api/nfts/:id — tekil kayıt

• GET /api/health — sağlık kontrolü

! Not: Dosya boyutu/uzantı kontrollü; CORS ve rate-limit önerilir.


| Mint Akışı Sekans Diyagramı |


<img width="1024" height="123" alt="image" src="https://github.com/user-attachments/assets/682c3210-eee1-462f-aee4-34e462142048" />


| Web Uygulamasından Ekran Görüntüleri |

<img width="1919" height="873" alt="image" src="https://github.com/user-attachments/assets/985ea0a2-3b43-4210-8ae5-9037d3567ad4" />

| Cüzdan Bağlantısı |

<img width="2188" height="1876" alt="image" src="https://github.com/user-attachments/assets/4ddd5cbb-3777-4abc-a416-54db8e8cec1f" />

<img width="1648" height="2440" alt="image" src="https://github.com/user-attachments/assets/54c2ca05-018a-4495-bd84-6b5baaf63afc" />

<img width="2200" height="2196" alt="image" src="https://github.com/user-attachments/assets/b009c22d-b414-41a5-b361-5ac1b56c06ac" />

| Dosya Mint Etme |

<img width="415" height="108" alt="image" src="https://github.com/user-attachments/assets/e69da38f-ce1e-4478-a79e-0702633c855d" />

<img width="652" height="273" alt="image" src="https://github.com/user-attachments/assets/f201dd6e-36e6-4b4d-8627-1136b9887984" />

<img width="422" height="356" alt="image" src="https://github.com/user-attachments/assets/69519f7b-6c99-4daa-bf48-b8e5350c31ee" />

<img width="481" height="751" alt="image" src="https://github.com/user-attachments/assets/47edeb5a-6270-4d51-aa3e-0c9349ef2d69" />

<img width="518" height="769" alt="image" src="https://github.com/user-attachments/assets/5271a645-7f1e-44e1-be7d-3babb889af87" />

<img width="1704" height="846" alt="image" src="https://github.com/user-attachments/assets/d66859f8-f887-4eb6-aec6-9d6b4057cd65" />

<img width="1683" height="837" alt="image" src="https://github.com/user-attachments/assets/89f3aec6-8af5-467b-8906-5bd66836ada0" />

| Veritabanı |

<img width="458" height="319" alt="image" src="https://github.com/user-attachments/assets/c3f49fc7-3ed9-4370-a15b-7915bc617700" />

| Metaverse NFT Müzesi Kısa Bir Tur |


[GIF’i doğrudan aç](nftmetaversemuseum/NFTMetaverseMuseum/Assets/NFTMuseum.gif?raw=1)





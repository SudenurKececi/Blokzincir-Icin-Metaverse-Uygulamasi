// backend/uploadPinata.js
import fs from 'fs'
import path from 'path'
import pinataSDK from '@pinata/sdk'
import dotenv from 'dotenv'
dotenv.config()

const pinata = pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
)

export async function uploadCarToPinata(carPath) {
  const stream = fs.createReadStream(carPath)
  const opts = {
    pinataOptions: { wrapWithDirectory: false },
    pinataMetadata: {
      name: path.basename(carPath),
      keyvalues: { method: 'car-only' }
    }
  }
  const { IpfsHash } = await pinata.pinFileToIPFS(stream, opts)
  return IpfsHash
}

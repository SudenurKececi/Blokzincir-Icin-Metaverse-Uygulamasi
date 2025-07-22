// frontend/src/components/Scene.jsx

import React, { useEffect, useRef, useState } from 'react'
import { useFrame }            from '@react-three/fiber'
import { GLTFLoader }          from 'three/examples/jsm/loaders/GLTFLoader'

// Öncelikle .env içindeki gateway'e bak, yoksa localhost:8080 kullan
const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY || 'http://localhost:8080'

export default function Scene({ cid }) {
  const meshRef       = useRef()
  const [sceneObject, setSceneObject] = useState(null)

  useEffect(() => {
    // Eğer henüz bir CID yoksa, önceki sahneyi kaldır
    if (!cid) {
      setSceneObject(null)
      return
    }

    // GLTFLoader ile fetch & parse
    const loader = new GLTFLoader()
    // Local IPFS gateway URL: http://localhost:8080/ipfs/<CID>
    //const modelUrl = `${IPFS_GATEWAY}/ipfs/${cid}`
const modelUrl = `http://localhost:8080/ipfs/${cid}`

    loader.load(
      modelUrl,
      gltf => {
        setSceneObject(gltf.scene)
      },
      // progress callback (isteğe bağlı)
      xhr => {
        console.log(`Model yükleniyor: ${((xhr.loaded/xhr.total)*100).toFixed(1)}%`)
      },
      err => {
        console.error('GLTF yükleme hatası:', err)
      }
    )
  }, [cid])

  // Eğer sceneObject yoksa basit bir dönen kutu göster
  useFrame((_, delta) => {
    if (!sceneObject && meshRef.current) {
      meshRef.current.rotation.y += delta
    }
  })

  // Render
  return sceneObject
    ? <primitive object={sceneObject} />
    : (
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    )
}

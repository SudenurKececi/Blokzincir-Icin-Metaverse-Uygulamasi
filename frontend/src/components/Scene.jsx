// frontend/src/components/Scene.jsx

import React, { useEffect, useRef, useState } from 'react'
import { useFrame }            from '@react-three/fiber'
import { GLTFLoader }          from 'three/examples/jsm/loaders/GLTFLoader'


const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY || 'http://localhost:8080'

export default function Scene({ cid }) {
  const meshRef       = useRef()
  const [sceneObject, setSceneObject] = useState(null)

  useEffect(() => {
  
    if (!cid) {
      setSceneObject(null)
      return
    }

    
    const loader = new GLTFLoader()
    // Local IPFS gateway URL: http://localhost:8080/ipfs/<CID>
    //const modelUrl = `${IPFS_GATEWAY}/ipfs/${cid}`
const modelUrl = `http://localhost:8080/ipfs/${cid}`

    loader.load(
      modelUrl,
      gltf => {
        setSceneObject(gltf.scene)
      },
      
      xhr => {
        console.log(`Model yükleniyor: ${((xhr.loaded/xhr.total)*100).toFixed(1)}%`)
      },
      err => {
        console.error('GLTF yükleme hatası:', err)
      }
    )
  }, [cid])

  
  useFrame((_, delta) => {
    if (!sceneObject && meshRef.current) {
      meshRef.current.rotation.y += delta
    }
  })

  
  return sceneObject
    ? <primitive object={sceneObject} />
    : (
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    )
}

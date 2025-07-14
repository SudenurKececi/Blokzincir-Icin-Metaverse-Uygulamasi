import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Scene({ cid, fileName }) {
  const meshRef = useRef();
  const [sceneObj, setSceneObj] = useState(null);

  // Dönen küp: cid yoksa her frame döndür
  useFrame((_, delta) => {
    if (!cid && meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });

  // CID değişince IPFS'ten buffer + parse
  useEffect(() => {
    if (!cid) {
      setSceneObj(null);
      return;
    }
    let canceled = false;
    const loader = new GLTFLoader();

    (async () => {
      try {
        const url = `https://gateway.pinata.cloud/ipfs/${cid}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buffer = await res.arrayBuffer();
        loader.parse(
          buffer,
          '',
          gltf => { if (!canceled) setSceneObj(gltf.scene); },
          err => console.error('Gltf parse error:', err)
        );
      } catch (e) {
        console.error('Fetch/parse failed:', e);
      }
    })();

    return () => { canceled = true; };
  }, [cid, fileName]);

  // Model geldi mi?
  if (sceneObj) {
    return <primitive object={sceneObj} />;
  }

  // Fallback: pembe küp
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#1365ff" />
    </mesh>
  );
}

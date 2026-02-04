import React, { useState, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls, Preload } from '@react-three/drei'
import * as THREE from 'three'

// 图片平面组件
function ImagePlane({ url, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const meshRef = React.useRef()
  const [material, setMaterial] = React.useState(null)

  React.useEffect(() => {
    if (!url) return
    
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      url,
      (texture) => {
        const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
        setMaterial(mat)
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error)
        const defaultMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.5 })
        setMaterial(defaultMat)
      }
    )

    return () => {
      if (material) {
        material.dispose()
      }
    }
  }, [url, material])

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  if (!material) return null

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={meshRef}>
        <primitive object={new THREE.PlaneGeometry(2, 1)} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  )
}

// 模型组件
function Model({ url, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], onLoaded }) {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const modelRef = React.useRef()

  const isImg = url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif'))

  const gltf = React.useMemo(() => {
    if (isImg) return null
    try {
      return useLoader(GLTFLoader, url || "https://hoer369.github.io/hoer.fstcode/kkk.glb")
    } catch (error) {
      console.error('Error loading 3D model:', error)
      return null
    }
  }, [url, isImg])

  React.useEffect(() => {
    if (!isImg && gltf && gltf.scene) {
      console.log('Processing 3D model:', url)
      setIsLoaded(false)
      
      setTimeout(() => {
        if (gltf.scene) {
          gltf.scene.position.set(0, 0, 0)
          gltf.scene.rotation.set(0, 0, 0)
          gltf.scene.scale.set(1, 1, 1)
          
          gltf.scene.traverse((child) => {
            if (child.isObject3D) {
              child.position.set(0, 0, 0)
              child.rotation.set(0, 0, 0)
              child.scale.set(1, 1, 1)
              child.updateMatrixWorld(true)
            }
          })
          
          gltf.scene.traverse((child) => {
            if (child.isMesh && child.geometry) {
              child.geometry.computeBoundingBox()
              child.geometry.computeBoundingSphere()
            }
          })
          
          const box = new THREE.Box3().setFromObject(gltf.scene)
          const center = box.getCenter(new THREE.Vector3())
          
          gltf.scene.position.set(-center.x, -center.y, -center.z)
          
          if (modelRef.current) {
            modelRef.current.position.set(0, 0, 0)
            modelRef.current.rotation.set(0, 0, 0)
            modelRef.current.scale.set(1, 1, 1)
          }
          
          setIsLoaded(true)
          if (onLoaded) onLoaded()
        }
      }, 100)
    }
  }, [url, isImg, gltf, onLoaded])

  if (isImg) {
    return <ImagePlane url={url} position={position} rotation={rotation} scale={scale} />
  } else if (gltf && gltf.scene) {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <group ref={modelRef}>
          <primitive object={gltf.scene} />
        </group>
      </group>
    )
  }

  return null
}

// 加载状态组件
function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
      <div className="text-xl font-semibold text-gray-800">Loading 3D Model...</div>
    </div>
  )
}

// 3D场景组件
function Scene3D({ modelUrl }) {
  const [isLoading, setIsLoading] = useState(true)

  const handleModelLoaded = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
  }, [modelUrl])

  return (
    <div className="w-full h-full relative">
      {isLoading && <LoadingScreen />}
      <Canvas camera={{ position: [0, -1, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <directionalLight position={[0, -10, 0]} intensity={0.3} />
        
        <Model 
          url={modelUrl || "https://hoer369.github.io/hoer.fstcode/kkk.glb"} 
          scale={[0.3, 0.3, 0.3]}
          onLoaded={handleModelLoaded}
        />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          maxPolarAngle={Math.PI * 0.8}
          target={[0, 0, 0]}
          autoRotate={false}
        />
        <Preload all />
      </Canvas>
    </div>
  )
}

export default Scene3D

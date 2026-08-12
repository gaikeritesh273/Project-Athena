'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function AthenaOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.8}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#0EA5E9"
          attach="material"
          distort={0.15}
          speed={1.2}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
    </Float>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  const count = 40;
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      data[i * 3] = (Math.random() - 0.5) * 20;
      data[i * 3 + 1] = (Math.random() - 0.5) * 20;
      data[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return data;
  }, []);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#14B8A6" transparent opacity={0.3} />
    </points>
  );
}

export default function Scene3D() {
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsWebGLSupported(Boolean(gl));
    } catch {
      setIsWebGLSupported(false);
    }
  }, []);

  if (!isWebGLSupported) {
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[#0B0F19]" />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-25">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#0EA5E9" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#14B8A6" />
        <Stars radius={100} depth={50} count={1500} factor={3} saturation={0} fade speed={0.5} />
        <AthenaOrb />
        <FloatingParticles />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
    </div>
  );
}
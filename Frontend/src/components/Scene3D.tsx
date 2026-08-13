'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useTheme } from '@/lib/theme';

function AthenaOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.04;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.06;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.7}>
      <mesh ref={meshRef} scale={1.6}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#0EA5E9"
          attach="material"
          distort={0.12}
          speed={0.8}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
    </Float>
  );
}

export default function Scene3D() {
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsWebGLSupported(Boolean(gl));
    } catch {
      setIsWebGLSupported(false);
    }

    // Respect reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
  }, []);

  if (!isWebGLSupported || isReducedMotion) {
    // Fallback: simple CSS gradient background — zero GPU cost
    return (
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            theme === 'light'
              ? 'radial-gradient(ellipse at 50% 30%, rgba(2,132,199,0.08) 0%, transparent 60%), #F1F5F9'
              : 'radial-gradient(ellipse at 50% 30%, rgba(14,165,233,0.06) 0%, transparent 60%), #0B0F19',
        }}
      />
    );
  }

  return (
    <div className={`fixed inset-0 -z-10 pointer-events-none ${theme === 'light' ? 'opacity-10' : 'opacity-20'}`}>
      {/* Lower DPR cap (max 1.5 instead of 2) + no OrbitControls = better performance */}
      <Canvas camera={{ position: [0, 0, 8], fov: 42 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.35} />
        <pointLight position={[8, 8, 8]} intensity={0.7} color="#0EA5E9" />
        <pointLight position={[-8, -8, -8]} intensity={0.3} color="#14B8A6" />
        {/* Fewer stars = lighter GPU load */}
        <Stars radius={80} depth={40} count={800} factor={3} saturation={0} fade speed={0.4} />
        <AthenaOrb />
        {/* No OrbitControls = no input event listeners, no mouse interaction */}
      </Canvas>
    </div>
  );
}
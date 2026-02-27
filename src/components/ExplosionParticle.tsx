import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';
import type { Particle as ParticleType } from '../types';

interface ExplosionParticleProps {
  particle: ParticleType;
  onUpdate: (id: number, position: [number, number, number], life: number) => void;
}

const ExplosionParticle: React.FC<ExplosionParticleProps> = ({ particle, onUpdate }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef(new THREE.Vector3(...particle.velocity));

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Apply gravity
    velocityRef.current.y -= 9.8 * delta * 0.6;

    // Update position
    meshRef.current.position.x += velocityRef.current.x * delta;
    meshRef.current.position.y += velocityRef.current.y * delta;
    meshRef.current.position.z += velocityRef.current.z * delta;

    // Decrease life
    const newLife = particle.life - delta * 1.2;

    // Update parent
    onUpdate(particle.id, meshRef.current.position.clone().toArray(), newLife);

    // Scale based on life
    const lifeRatio = Math.max(newLife / particle.maxLife, 0);
    const scale = lifeRatio * particle.size;
    meshRef.current.scale.set(scale, scale, scale);
  });

  const opacity = particle.life / particle.maxLife;

  return (
    <mesh ref={meshRef} position={particle.position}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color={particle.color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default ExplosionParticle;

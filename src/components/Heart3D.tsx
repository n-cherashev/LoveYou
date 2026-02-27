import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Heart as HeartType } from '../types';
import { SIZE_MAP } from '../types';

interface Heart3DProps {
  heart: HeartType;
  onExplode: (id: number, position: [number, number, number], color: string) => void;
  globalColor: THREE.Color;
}

// Create heart shape geometry
function createHeartShape() {
  const shape = new THREE.Shape();

  // Larger heart shape
  shape.moveTo(0, 0.3);
  shape.bezierCurveTo(0, 0.3, -0.3, 0.3, -0.5, 0);
  shape.bezierCurveTo(-0.8, -0.4, -0.8, -0.8, -0.5, -1);
  shape.bezierCurveTo(-0.3, -1.1, 0, -0.8, 0, -0.5);
  shape.bezierCurveTo(0, -0.8, 0.3, -1.1, 0.5, -1);
  shape.bezierCurveTo(0.8, -0.8, 0.8, -0.4, 0.5, 0);
  shape.bezierCurveTo(0.3, 0.3, 0, 0.3, 0, 0.3);

  return shape;
}

const Heart3D: React.FC<Heart3DProps> = ({ heart, onExplode, globalColor }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const geometry = useMemo(() => {
    const shape = createHeartShape();
    const extrudeSettings = {
      steps: 2,
      depth: 0.32,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 3,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center the geometry
    geo.center();
    // Rotate to face forward
    geo.rotateX(Math.PI);
    return geo;
  }, []);

  const baseScale = SIZE_MAP[heart.size];

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Floating motion (independent of cursor)
    meshRef.current.position.y = heart.y + Math.sin(time * heart.speed + heart.swayOffset) * 0.3;
    meshRef.current.position.x = heart.x + Math.sin(time * 0.5 + heart.swayOffset) * 0.2;

    // Gentle rotation to reveal 3D depth
    meshRef.current.rotation.z = Math.sin(time * 0.3 + heart.swayOffset) * 0.25;
    meshRef.current.rotation.y = Math.sin(time * 0.25 + heart.rotationSpeed) * 0.4;
    meshRef.current.rotation.x = Math.sin(time * 0.2 + heart.swayOffset * 0.7) * 0.2;

    // Pulse scale effect
    const pulse = 1 + Math.sin(time * 2 + heart.swayOffset) * 0.05;
    const targetScale = baseScale * heart.scale * pulse * (hovered ? 1.2 : 1);
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    // Synchronized color shifting with glow
    if (materialRef.current) {
      const baseHsl = globalColor.clone();
      const hoverBoost = hovered ? 0.15 : 0;

      materialRef.current.color = baseHsl.clone().offsetHSL(0, 0, hoverBoost);
      materialRef.current.emissive = baseHsl.clone().multiplyScalar(hovered ? 0.8 : 0.4);
      materialRef.current.emissiveIntensity = hovered ? 1 : 0.6;
    }
  });

  const handleClick = (e: THREE.Event & { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (meshRef.current) {
      onExplode(heart.id, meshRef.current.position.clone().toArray(), globalColor.getStyle());
    }
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      position={[heart.x, heart.y, heart.z]}
    >
      <meshStandardMaterial
        ref={materialRef}
        color={globalColor}
        emissive={globalColor}
        emissiveIntensity={0.45}
        metalness={0.45}
        roughness={0.3}
      />
    </mesh>
  );
};

export default Heart3D;

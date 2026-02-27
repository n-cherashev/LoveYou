import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { Star as StarType } from '../types';

interface StarFieldProps {
  stars: StarType[];
}

const StarField: React.FC<StarFieldProps> = ({ stars }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = timeRef.current;
    }
  });

  const { positions, colors, sizes } = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    stars.forEach((star) => {
      positions.push(...star.position);
      
      const color = new THREE.Color('#ffffff');
      colors.push(color.r, color.g, color.b);
      
      sizes.push(star.size);
    });

    return { positions, colors, sizes };
  }, [stars]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Gentle rotation of the entire star field
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(positions), 3]}
          count={positions.length / 3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[new Float32Array(colors), 3]}
          count={colors.length / 3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[new Float32Array(sizes), 1]}
          count={sizes.length}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={`
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;

          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

            // Twinkle effect
            float twinkle = sin(time * 2.0 + position.x * 10.0) * 0.5 + 0.5;
            gl_PointSize = size * (300.0 / -mvPosition.z) * (0.5 + twinkle * 0.5);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;

          void main() {
            float r = distance(gl_PointCoord, vec2(0.5));
            if (r > 0.5) discard;

            float glow = 1.0 - (r * 2.0);
            glow = pow(glow, 1.5);

            gl_FragColor = vec4(vColor, glow);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ time: { value: 0 } }}
      />
    </points>
  );
};

export default StarField;

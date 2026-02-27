import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Heart, Particle, Star } from '../types';
import ExplosionParticle from './ExplosionParticle';
import Heart3D from './Heart3D';
import StarField from './StarField';

const MAX_HEARTS = 60;
const SPAWN_INTERVAL = 800;
const PARTICLES_PER_EXPLOSION = 20;
const STAR_COUNT = 200;

interface SceneContentProps {
  hearts: Heart[];
  particles: Particle[];
  stars: Star[];
  mousePosition: [number, number];
  globalColor: THREE.Color;
  onExplode: (id: number, position: [number, number, number], color: string) => void;
  onParticleUpdate: (id: number, position: [number, number, number], life: number) => void;
  onSpawnHeart: () => void;
}

const SceneContent: React.FC<SceneContentProps> = ({
  hearts,
  particles,
  stars,
  mousePosition,
  globalColor,
  onExplode,
  onParticleUpdate,
  onSpawnHeart,
}) => {
  const { camera } = useThree();
  const cameraRef = useRef(new THREE.Vector3(0, 0, 15));
  const lastSpawnRef = useRef<number>(0);

  useFrame((state) => {
    const time = state.clock.elapsedTime * 1000;

    // Smooth camera movement based on mouse position
    const targetX = (mousePosition[0] - 0.5) * 0.7;
    const targetY = (mousePosition[1] - 0.5) * 0.4;

    const newX = cameraRef.current.x + (targetX - cameraRef.current.x) * 0.06;
    const newY = cameraRef.current.y + (-targetY - cameraRef.current.y) * 0.06;

    cameraRef.current.set(newX, newY, 15);
    camera.position.copy(cameraRef.current);
    camera.lookAt(0, 0, 0);

    // Spawn hearts inside Canvas context
    if (time - lastSpawnRef.current > SPAWN_INTERVAL && hearts.length < MAX_HEARTS) {
      onSpawnHeart();
      lastSpawnRef.current = time;
    }
  });

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.55} />

      {/* Point lights for depth */}
      <pointLight position={[10, 12, 14]} intensity={1.3} color={globalColor} />
      <pointLight position={[-12, -8, 10]} intensity={1.1} color={globalColor} />
      <pointLight position={[0, 0, 6]} intensity={0.6} color="#ce93d8" />

      {/* Background stars */}
      <StarField stars={stars} />

      {/* Floating hearts */}
      {hearts.map((heart) => (
        <Heart3D
          key={heart.id}
          heart={heart}
          onExplode={onExplode}
          mousePosition={mousePosition}
          globalColor={globalColor}
        />
      ))}

      {/* Explosion particles */}
      {particles.map((particle) => (
        <ExplosionParticle key={particle.id} particle={particle} onUpdate={onParticleUpdate} />
      ))}

      {/* Post-processing effects */}
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={0.2} intensity={0.6} radius={0.5} levels={9} />
        <Vignette darkness={0.4} offset={0.5} />
      </EffectComposer>
    </>
  );
};

interface HeartSceneProps {
  onHeartCountChange: (count: number) => void;
}

const HeartScene: React.FC<HeartSceneProps> = ({ onHeartCountChange }) => {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [mousePosition, setMousePosition] = useState<[number, number]>([0.5, 0.5]);
  const [globalColor, setGlobalColor] = useState(new THREE.Color('#9c27b0'));

  const heartIdRef = useRef<number>(0);
  const particleIdRef = useRef<number>(0);

  // Initialize stars
  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      newStars.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 30 - 10,
        ],
        size: 0.05 + Math.random() * 0.15,
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars(newStars);
  }, []);

  const createHeart = useCallback((): Heart => {
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const size = sizes[Math.floor(Math.random() * sizes.length)];

    const edge = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    const z = (Math.random() - 0.5) * 18;

    const horizontalRange = 18;
    const verticalRange = 10;

    if (edge === 0) {
      // Top
      x = (Math.random() - 0.5) * horizontalRange;
      y = verticalRange;
    } else if (edge === 1) {
      // Bottom
      x = (Math.random() - 0.5) * horizontalRange;
      y = -verticalRange;
    } else if (edge === 2) {
      // Left
      x = -horizontalRange;
      y = (Math.random() - 0.5) * verticalRange * 2;
    } else {
      // Right
      x = horizontalRange;
      y = (Math.random() - 0.5) * verticalRange * 2;
    }

    return {
      id: heartIdRef.current++,
      x,
      y,
      z,
      size,
      speed: 0.8 + Math.random() * 0.7,
      swayOffset: Math.random() * Math.PI * 2,
      rotationSpeed: Math.random() * Math.PI * 2,
      color: globalColor.getStyle(),
      scale: 0.8 + Math.random() * 0.4,
    };
  }, [globalColor]);

  const handleSpawnHeart = useCallback(() => {
    setHearts((prev) => [...prev, createHeart()]);
  }, [createHeart]);

  const handleParticleUpdate = useCallback(
    (id: number, position: [number, number, number], life: number) => {
      setParticles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, position, life } : p)).filter((p) => p.life > 0)
      );
    },
    []
  );

  const playPopSound = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioCtx();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 400 + Math.random() * 400;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch {
      // Audio not supported or blocked
    }
  }, []);

  const handleExplode = useCallback(
    (id: number, position: [number, number, number], color: string) => {
      setHearts((prev) => prev.filter((h) => h.id !== id));

      const newParticles: Particle[] = [];
      for (let i = 0; i < PARTICLES_PER_EXPLOSION; i++) {
        const theta = (Math.PI * 2 * i) / PARTICLES_PER_EXPLOSION + Math.random() * 0.3;
        const phi = Math.random() * Math.PI;
        const speed = 2 + Math.random() * 4;

        newParticles.push({
          id: particleIdRef.current++,
          position: [...position] as [number, number, number],
          velocity: [
            Math.sin(phi) * Math.cos(theta) * speed,
            Math.sin(phi) * Math.sin(theta) * speed,
            Math.cos(phi) * speed * 0.5,
          ],
          size: 0.1 + Math.random() * 0.15,
          color,
          life: 1.5 + Math.random() * 0.5,
          maxLife: 2,
        });
      }
      setParticles((prev) => [...prev, ...newParticles]);

      // Play sound effect
      playPopSound();
    },
    [playPopSound]
  );

  // Handle mouse movement for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition([e.clientX / window.innerWidth, e.clientY / window.innerHeight]);
    };

    // Handle touch movement for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMousePosition([
          e.touches[0].clientX / window.innerWidth,
          e.touches[0].clientY / window.innerHeight,
        ]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Update global color and heart positions using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      const delta = time - lastTime;

      if (delta >= 50) {
        // Update color every 50ms for smoother, faster transitions
        const seconds = time / 1000;
        const hue = (285 + Math.sin(seconds * 0.45) * 25) / 360;
        const saturation = 0.72 + Math.sin(seconds * 0.6) * 0.25;
        const lightness = 0.5 + Math.sin(seconds * 0.55) * 0.2;
        setGlobalColor(new THREE.Color().setHSL(hue, saturation, lightness));
        lastTime = time;
      }

      // Update heart positions – move from screen edges towards the center text
      setHearts((prev) =>
        prev
          .map((heart) => {
            const dirX = -heart.x;
            const dirY = -heart.y;
            const dirZ = -heart.z;
            const length = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ) || 1;
            const step = heart.speed * 0.028;

            return {
              ...heart,
              x: heart.x + (dirX / length) * step,
              y: heart.y + (dirY / length) * step,
              z: heart.z + (dirZ / length) * step,
            };
          })
          .filter((heart) => {
            const dist2 = heart.x * heart.x + heart.y * heart.y + heart.z * heart.z;
            return dist2 > 0.6;
          })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Update heart count for UI
  useEffect(() => {
    onHeartCountChange(hearts.length);
  }, [hearts.length, onHeartCountChange]);

  return (
    <div className="w-full h-screen absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <SceneContent
          hearts={hearts}
          particles={particles}
          stars={stars}
          mousePosition={mousePosition}
          globalColor={globalColor}
          onExplode={handleExplode}
          onParticleUpdate={handleParticleUpdate}
          onSpawnHeart={handleSpawnHeart}
        />
      </Canvas>

      {/* Background text "Я люблю тебя :)" */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        style={{
          perspective: '1000px',
        }}
      >
        <h2
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-center opacity-10"
          style={{
            fontFamily: "'Dancing Script', 'Pacifico', Georgia, cursive",
            color: '#ba68c8',
            textShadow: `
              0 0 40px rgba(186, 104, 200, 0.5),
              0 0 80px rgba(186, 104, 200, 0.3),
              0 0 120px rgba(186, 104, 200, 0.2)
            `,
            transform: 'translateZ(-50px)',
            letterSpacing: '0.1em',
          }}
        >
          Я люблю тебя :)
        </h2>
      </div>
    </div>
  );
};

export default HeartScene;

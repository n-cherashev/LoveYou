export interface Heart {
  id: number;
  x: number;
  y: number;
  z: number;
  size: 'small' | 'medium' | 'large';
  speed: number;
  swayOffset: number;
  rotationSpeed: number;
  color: string;
  scale: number;
}

export interface Particle {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface Star {
  id: number;
  position: [number, number, number];
  size: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export const HEART_COLORS = ['#9c27b0', '#ba68c8', '#ce93d8', '#e040fb', '#ea80fc'];

export const SIZE_MAP = {
  small: 0.3,
  medium: 0.5,
  large: 0.8,
};

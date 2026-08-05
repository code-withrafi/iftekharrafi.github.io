import { Float, Edges } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Configuration constants
const CONFIG = {
  baseDimensions: [2, 0.35, 2],
  chipDimensions: [1.5, 0.15, 1.5],
  pinCount: 8,
  pinRadius: 0.05,
  pinHeight: 0.15,
  rotationSpeed: 0.25,
  floatSpeed: 2,
  rotationIntensity: 0.3,
  floatIntensity: 0.5,
  coreColor: '#45A9A9',
  chipColor: '#98E8DE',
  emissiveColor: '#45A9A9',
  metalness: 0.8,
  roughness: 0.2,
};

export default function ProcessorCore({
  rotationSpeed = CONFIG.rotationSpeed,
  floatSpeed = CONFIG.floatSpeed,
  onHover,
  onUnhover,
  onClick,
} = {}) {
  const core = useRef();
  const glowMesh = useRef();

  // Memoized geometries
  const baseGeometry = useMemo(() => new THREE.BoxGeometry(...CONFIG.baseDimensions), []);
  const chipGeometry = useMemo(() => new THREE.BoxGeometry(...CONFIG.chipDimensions), []);
  const pinGeometry = useMemo(
    () => new THREE.CylinderGeometry(CONFIG.pinRadius, CONFIG.pinRadius, CONFIG.pinHeight, 16),
    [],
  );

  // Generate pin positions
  const pins = useMemo(() => {
    const positions = [];
    const spacing = CONFIG.baseDimensions[0] / (CONFIG.pinCount + 1);

    for (let i = 0; i < CONFIG.pinCount; i++) {
      // Bottom pins
      positions.push([
        -CONFIG.baseDimensions[0] / 2 + spacing * (i + 1),
        -0.25,
        -CONFIG.baseDimensions[2] / 2,
      ]);
      positions.push([
        -CONFIG.baseDimensions[0] / 2 + spacing * (i + 1),
        -0.25,
        CONFIG.baseDimensions[2] / 2,
      ]);
    }

    for (let i = 0; i < CONFIG.pinCount; i++) {
      // Side pins
      positions.push([
        -CONFIG.baseDimensions[0] / 2,
        -0.25,
        -CONFIG.baseDimensions[2] / 2 + spacing * (i + 1),
      ]);
      positions.push([
        CONFIG.baseDimensions[0] / 2,
        -0.25,
        -CONFIG.baseDimensions[2] / 2 + spacing * (i + 1),
      ]);
    }

    return positions;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Smooth rotation
    core.current.rotation.y += rotationSpeed * 0.016; // Delta-time based rotation

    // Pulsing glow effect
    if (glowMesh.current) {
      const pulse = Math.sin(t * 2) * 0.3 + 0.7;
      glowMesh.current.material.emissiveIntensity = 2 + pulse;
      glowMesh.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.02);
    }
  });

  return (
    <Float
      speed={floatSpeed}
      rotationIntensity={CONFIG.rotationIntensity}
      floatIntensity={CONFIG.floatIntensity}
    >
      <group
        ref={core}
        onPointerEnter={onHover}
        onPointerLeave={onUnhover}
        onClick={onClick}
        userData={{ type: 'processorCore' }}
      >
        {/* Main base */}
        <mesh geometry={baseGeometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={CONFIG.coreColor}
            metalness={CONFIG.metalness}
            roughness={CONFIG.roughness}
            clearcoat={0.1}
            clearcoatRoughness={0.2}
          />
          <Edges scale={1} threshold={15} color="#2a6b6b" lineWidth={0.5} />
        </mesh>

        {/* Inner chip detail */}
        <mesh ref={glowMesh} geometry={chipGeometry} position={[0, 0.25, 0]} castShadow>
          <meshStandardMaterial
            color={CONFIG.chipColor}
            emissive={CONFIG.emissiveColor}
            emissiveIntensity={4}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Core detail layers */}
        <mesh position={[0, 0.33, 0]} castShadow>
          <boxGeometry args={[1.2, 0.05, 1.2]} />
          <meshStandardMaterial
            color="#2a6b6b"
            metalness={0.9}
            roughness={0.1}
            emissive="#1a4a4a"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Connection pins */}
        {pins.map((position, index) => (
          <mesh key={index} geometry={pinGeometry} position={position} castShadow>
            <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
          </mesh>
        ))}

        {/* Glow ring */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
          <ringGeometry args={[1.05, 1.15, 64]} />
          <meshBasicMaterial
            color="#45A9A9"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </Float>
  );
}

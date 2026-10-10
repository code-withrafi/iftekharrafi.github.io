import { Float, Edges } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

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

const ROTATION_STEP = 0.016;
const PULSE_SPEED = 2;
const PULSE_AMOUNT = 0.3;
const GLOW_SCALE_SPEED = 1.5;
const GLOW_SCALE_AMOUNT = 0.02;

export default function ProcessorCore({
  rotationSpeed = CONFIG.rotationSpeed,
  floatSpeed = CONFIG.floatSpeed,
  onHover,
  onUnhover,
  onClick,
} = {}) {
  const core = useRef();
  const glowMesh = useRef();

  const baseGeometry = useMemo(() => new THREE.BoxGeometry(...CONFIG.baseDimensions), []);

  const chipGeometry = useMemo(() => new THREE.BoxGeometry(...CONFIG.chipDimensions), []);

  const pinGeometry = useMemo(
    () => new THREE.CylinderGeometry(CONFIG.pinRadius, CONFIG.pinRadius, CONFIG.pinHeight, 16),
    [],
  );

  const pins = useMemo(() => {
    const positions = [];
    const halfSize = CONFIG.baseDimensions[0] / 2;
    const spacing = CONFIG.baseDimensions[0] / (CONFIG.pinCount + 1);

    for (let i = 0; i < CONFIG.pinCount; i++) {
      const offset = -halfSize + spacing * (i + 1);

      positions.push(
        [offset, -0.25, -halfSize],
        [offset, -0.25, halfSize],
        [-halfSize, -0.25, offset],
        [halfSize, -0.25, offset],
      );
    }

    return positions;
  }, []);

  useFrame(({ clock }) => {
    const coreObject = core.current;

    if (coreObject) {
      coreObject.rotation.y += rotationSpeed * ROTATION_STEP;
    }

    const glowObject = glowMesh.current;

    if (glowObject) {
      const time = clock.getElapsedTime();
      const pulse = Math.sin(time * PULSE_SPEED) * PULSE_AMOUNT + 0.7;

      glowObject.material.emissiveIntensity = 2 + pulse;
      glowObject.scale.setScalar(1 + Math.sin(time * GLOW_SCALE_SPEED) * GLOW_SCALE_AMOUNT);
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

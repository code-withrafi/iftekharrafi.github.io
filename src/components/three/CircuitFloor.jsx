import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Configuration constants
const CONFIG = {
  floorSize: 30,
  gridDivisions: 30,
  streamCount: 16,
  streamLength: 8,
  streamSpeed: 0.4,
  nodeCount: 20,
  colors: {
    base: '#0F3040',
    gridMain: '#45A9A9',
    gridSecondary: '#3E3E75',
    stream: '#98E8DE',
    streamEmissive: '#45A9A9',
    nodeGold: '#FFD700',
    nodeCyan: '#00FFFF',
    nodePurple: '#7B2FBE',
  },
  metalness: 0.8,
  roughness: 0.35,
};

export default function CircuitFloor({ streamSpeed = 0.4, nodeCount = 20 }) {
  const linesRef = useRef();
  const linesRef2 = useRef();
  const particlesRef = useRef();
  const nodesRef = useRef([]);

  // Memoized geometries
  const streamGeometry = useMemo(() => new THREE.PlaneGeometry(0.04, CONFIG.streamLength), []);
  const streamGeometryWide = useMemo(
    () => new THREE.PlaneGeometry(0.08, CONFIG.streamLength * 0.6),
    [],
  );
  const nodeGeometry = useMemo(() => new THREE.CylinderGeometry(0.08, 0.1, 0.05, 16), []);
  const nodeGeometrySmall = useMemo(() => new THREE.CylinderGeometry(0.04, 0.06, 0.03, 8), []);
  const particleGeometry = useMemo(() => new THREE.SphereGeometry(0.03, 4, 4), []);

  // Generate data streams
  const streams = useMemo(() => {
    return Array.from({ length: CONFIG.streamCount }, (_, i) => {
      const x = Math.sin(i * 1.7) * CONFIG.floorSize * 0.4;
      const z = Math.cos(i * 2.3) * CONFIG.floorSize * 0.4 - CONFIG.floorSize * 0.2;
      const rotation = Math.atan2(
        Math.cos(i * 3.1) * 2 - Math.cos(i * 2.3) * CONFIG.floorSize * 0.4,
        Math.sin(i * 1.9) * 2 - Math.sin(i * 1.7) * CONFIG.floorSize * 0.4,
      );

      return {
        x,
        z,
        rotation,
        speed: 0.8 + Math.sin(i) * 0.4,
        isWide: i % 3 === 0,
        color: i % 4 === 0 ? CONFIG.colors.nodePurple : CONFIG.colors.stream,
        emissive: i % 4 === 0 ? CONFIG.colors.nodePurple : CONFIG.colors.streamEmissive,
      };
    });
  }, []);

  // Generate circuit nodes
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 5 + Math.sin(i * 2.5) * 4;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const isLarge = i % 3 === 0;

      return {
        x,
        z,
        isLarge,
        color:
          i % 5 === 0
            ? CONFIG.colors.nodeGold
            : i % 5 === 2
              ? CONFIG.colors.nodeCyan
              : CONFIG.colors.nodePurple,
        pulseSpeed: 1 + Math.sin(i) * 2,
        pulseOffset: i * 0.5,
      };
    });
  }, [nodeCount]);

  // Generate floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      x: Math.sin(i * 7.3) * CONFIG.floorSize * 0.45,
      z: Math.cos(i * 5.7) * CONFIG.floorSize * 0.45,
      speed: 0.5 + Math.sin(i * 3.1) * 1.5,
      offset: Math.sin(i * 2.1) * 5,
      size: 0.02 + Math.sin(i) * 0.03,
    }));
  }, []);

  // Generate corner connectors
  const cornerConnectors = useMemo(() => {
    const positions = [];
    const halfSize = CONFIG.floorSize / 2 - 0.5;

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      positions.push({
        x: Math.cos(angle) * halfSize,
        z: Math.sin(angle) * halfSize,
      });
    }
    return positions;
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Animate primary data streams
    if (linesRef.current) {
      linesRef.current.position.z += delta * streamSpeed;
      if (linesRef.current.position.z > CONFIG.floorSize * 0.4) {
        linesRef.current.position.z = -CONFIG.floorSize * 0.4;
      }
    }

    // Animate secondary data streams
    if (linesRef2.current) {
      linesRef2.current.position.z += delta * streamSpeed * 1.5;
      if (linesRef2.current.position.z > CONFIG.floorSize * 0.4) {
        linesRef2.current.position.z = -CONFIG.floorSize * 0.4;
      }
    }

    // Animate particles
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        const p = particles[i];
        particle.position.y = 0.05 + Math.sin(t * p.speed + p.offset) * 0.1;
        particle.material.opacity = 0.3 + Math.sin(t * p.speed + p.offset) * 0.2;
      });
    }

    // Animate circuit nodes
    nodesRef.current.forEach((node, i) => {
      if (node && nodes[i]) {
        const pulse = Math.sin(t * nodes[i].pulseSpeed + nodes[i].pulseOffset) * 0.5 + 0.5;
        node.material.emissiveIntensity = 1 + pulse * 3;
        node.scale.setScalar(1 + pulse * 0.2);
      }
    });
  });

  return (
    <group>
      {/* Motherboard Base */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[CONFIG.floorSize, CONFIG.floorSize]} />
        <meshStandardMaterial
          color={CONFIG.colors.base}
          metalness={CONFIG.metalness}
          roughness={CONFIG.roughness}
        />
      </mesh>

      {/* Base detail layer */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.04, 0]}>
        <planeGeometry args={[CONFIG.floorSize - 2, CONFIG.floorSize - 2]} />
        <meshStandardMaterial color="#0A2530" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Circuit Grid */}
      <gridHelper
        args={[
          CONFIG.floorSize,
          CONFIG.gridDivisions,
          CONFIG.colors.gridMain,
          CONFIG.colors.gridSecondary,
        ]}
        rotation-x={Math.PI / 2}
        position={[0, 0.01, 0]}
      />

      {/* Diagonal grid accent */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.015, 0]}>
        <ringGeometry args={[8, 8.05, 64]} />
        <meshBasicMaterial
          color={CONFIG.colors.gridMain}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.015, 0]}>
        <ringGeometry args={[12, 12.05, 64]} />
        <meshBasicMaterial
          color={CONFIG.colors.gridSecondary}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Primary Moving Data Streams */}
      <group ref={linesRef}>
        {streams.map((stream, i) => (
          <mesh
            key={`stream-${i}`}
            rotation-x={-Math.PI / 2}
            rotation-z={stream.rotation}
            position={[stream.x, 0.03, stream.z]}
            geometry={stream.isWide ? streamGeometryWide : streamGeometry}
          >
            <meshStandardMaterial
              color={stream.color}
              emissive={stream.emissive}
              emissiveIntensity={3}
              metalness={0.1}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Secondary Moving Data Streams (opposite direction) */}
      <group ref={linesRef2}>
        {streams.map((stream, i) => (
          <mesh
            key={`stream2-${i}`}
            rotation-x={-Math.PI / 2}
            rotation-z={stream.rotation + Math.PI}
            position={[stream.x + 0.5, 0.035, -stream.z]}
            geometry={streamGeometry}
          >
            <meshStandardMaterial
              color={stream.color}
              emissive={stream.emissive}
              emissiveIntensity={2}
              metalness={0.1}
              roughness={0.4}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* Circuit Nodes */}
      {nodes.map((node, i) => (
        <mesh
          key={`node-${i}`}
          ref={(el) => (nodesRef.current[i] = el)}
          geometry={node.isLarge ? nodeGeometry : nodeGeometrySmall}
          rotation-x={-Math.PI / 2}
          position={[node.x, 0.02, node.z]}
        >
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={2}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Floating Particles */}
      <group ref={particlesRef}>
        {particles.map((p, i) => (
          <mesh key={`particle-${i}`} geometry={particleGeometry} position={[p.x, 0.08, p.z]}>
            <meshBasicMaterial
              color={CONFIG.colors.stream}
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Corner Connectors */}
      {cornerConnectors.map((corner, i) => (
        <group key={`corner-${i}`} position={[corner.x, 0.02, corner.z]}>
          <mesh rotation-x={-Math.PI / 2}>
            <cylinderGeometry args={[0.15, 0.2, 0.08, 8]} />
            <meshStandardMaterial
              color={CONFIG.colors.nodeGold}
              emissive={CONFIG.colors.nodeGold}
              emissiveIntensity={2}
              metalness={0.5}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color={CONFIG.colors.nodeCyan}
              emissive={CONFIG.colors.nodeCyan}
              emissiveIntensity={3}
              metalness={0.1}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* Data Flow Lines (static) */}
      {[0, 1, 2, 3].map((line) => {
        const angle = (line * Math.PI) / 2;
        return (
          <mesh
            key={`data-line-${line}`}
            rotation-x={-Math.PI / 2}
            position={[0, 0.018, 0]}
            rotation-z={angle}
          >
            <planeGeometry args={[0.02, CONFIG.floorSize * 0.8]} />
            <meshBasicMaterial
              color={CONFIG.colors.gridMain}
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* Central Processing Area */}
      <group position={[0, 0.03, 0]}>
        <mesh rotation-x={-Math.PI / 2}>
          <ringGeometry args={[1.5, 2, 64]} />
          <meshStandardMaterial
            color="#1A4A5A"
            metalness={0.9}
            roughness={0.2}
            emissive="#0A2530"
            emissiveIntensity={0.5}
          />
        </mesh>

        <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0]}>
          <ringGeometry args={[1.6, 1.9, 64]} />
          <meshBasicMaterial
            color={CONFIG.colors.stream}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
          <circleGeometry args={[0.5, 32]} />
          <meshStandardMaterial
            color="#0F3040"
            metalness={0.9}
            roughness={0.1}
            emissive="#1A4A5A"
            emissiveIntensity={1}
          />
        </mesh>
      </group>
    </group>
  );
}

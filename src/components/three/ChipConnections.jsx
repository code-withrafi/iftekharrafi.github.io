import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';

function random(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Configuration constants
const CONFIG = {
  pinCount: 80,
  spreadRadius: 4,
  pinRadius: 0.03,
  pinHeight: 0.3,
  connectionLines: 20,
  colors: {
    pin: '#98E8DE',
    pinEmissive: '#45A9A9',
    pinGold: '#FFD700',
    pinCyan: '#00FFFF',
    line: '#45A9A9',
    node: '#7B2FBE',
  },
  metalness: 0.3,
  roughness: 0.2,
};

export default function ChipConnections({
  pinCount = CONFIG.pinCount,
  spreadRadius = CONFIG.spreadRadius,
  enableAnimation = true,
  enableConnections = true,
  enableNodes = true,
  pulseSpeed = 1.5,
}) {
  const groupRef = useRef();
  const connectionsRef = useRef([]);
  const nodesRef = useRef([]);

  // Generate pins with more properties
  const pins = useMemo(() => {
    return Array.from({ length: pinCount }, (_, i) => {
      const angle = random(i * 7) * Math.PI * 2;
      const radius = random(i * 13) * spreadRadius * 0.8 + spreadRadius * 0.2;

      // Different pin types
      const type = i % 3;
      let color, emissive, height;

      if (type === 0) {
        color = CONFIG.colors.pin;
        emissive = CONFIG.colors.pinEmissive;
        height = CONFIG.pinHeight;
      } else if (type === 1) {
        color = CONFIG.colors.pinGold;
        emissive = CONFIG.colors.pinGold;
        height = CONFIG.pinHeight * 1.2;
      } else {
        color = CONFIG.colors.pinCyan;
        emissive = CONFIG.colors.pinCyan;
        height = CONFIG.pinHeight * 0.8;
      }

      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        angle,
        radius,
        type,
        color,
        emissive,
        height,
        pulseSpeed: random(i * 17) * 2 + 1,
        pulseOffset: random(i * 19) * Math.PI * 2,
      };
    });
  }, [pinCount, spreadRadius]);

  // Generate connection lines between pins
  const connections = useMemo(() => {
    if (!enableConnections) return [];

    return Array.from({ length: CONFIG.connectionLines }, (_, i) => {
      const startIdx = Math.floor(random(i * 23) * pinCount);
      let endIdx = Math.floor(random(i * 29) * pinCount);

      // Ensure different pins
      while (endIdx === startIdx) {
        endIdx = Math.floor(random(i * 31) * pinCount);
      }

      return {
        start: startIdx,
        end: endIdx,
        color: i % 2 === 0 ? CONFIG.colors.line : CONFIG.colors.node,
        opacity: 0.3 + random(i * 37) * 0.3,
      };
    });
  }, [pinCount, enableConnections]);

  // Generate circuit nodes
  const nodes = useMemo(() => {
    if (!enableNodes) return [];

    return Array.from({ length: 12 }, (_, i) => {
      const angle = random(i * 41) * Math.PI * 2;
      const radius = random(i * 43) * spreadRadius * 0.6;

      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        scale: 0.5 + random(i * 47) * 1.5,
        color:
          i % 3 === 0
            ? CONFIG.colors.pinGold
            : i % 3 === 1
              ? CONFIG.colors.pinCyan
              : CONFIG.colors.node,
      };
    });
  }, [enableNodes, spreadRadius]);

  // Memoized geometries
  const pinGeometry = useMemo(
    () => new THREE.CylinderGeometry(CONFIG.pinRadius, CONFIG.pinRadius, 1, 8),
    [],
  );

  const pinGeometryThin = useMemo(
    () => new THREE.CylinderGeometry(CONFIG.pinRadius * 0.7, CONFIG.pinRadius * 0.7, 1, 6),
    [],
  );

  const nodeGeometry = useMemo(() => new THREE.CylinderGeometry(0.06, 0.08, 0.08, 16), []);

  const nodeGeometrySmall = useMemo(() => new THREE.BoxGeometry(0.1, 0.05, 0.1), []);

  const lineGeometry = useMemo(() => new THREE.CylinderGeometry(0.01, 0.01, 1, 4), []);

  useFrame(({ clock }, delta) => {
    if (!enableAnimation || !groupRef.current) return;

    const t = clock.getElapsedTime();

    // Subtle rotation of entire group
    groupRef.current.rotation.y += delta * 0.1;

    // Animate connections
    connectionsRef.current.forEach((connection, i) => {
      if (connection && connections[i]) {
        const pulse = Math.sin(t * 2 + i * 0.5) * 0.3 + 0.7;
        connection.material.opacity = connections[i].opacity * pulse;
      }
    });

    // Animate nodes
    nodesRef.current.forEach((node, i) => {
      if (node && nodes[i]) {
        const pulse = Math.sin(t * pulseSpeed + i * 0.7) * 0.5 + 0.5;
        node.material.emissiveIntensity = 1 + pulse * 3;
        node.scale.setScalar(nodes[i].scale * (1 + pulse * 0.2));
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Pins */}
      {pins.map((pin, i) => (
        <group key={`pin-${i}`} position={[pin.x, 0.15, pin.z]}>
          {/* Main pin */}
          <mesh
            geometry={pin.type === 1 ? pinGeometry : pinGeometryThin}
            scale={[1, pin.height, 1]}
            castShadow
          >
            <meshStandardMaterial
              color={pin.color}
              emissive={pin.emissive}
              emissiveIntensity={pin.type === 1 ? 4 : 3}
              metalness={CONFIG.metalness}
              roughness={CONFIG.roughness}
            />
          </mesh>

          {/* Pin tip glow */}
          <mesh position={[0, pin.height / 2 + 0.02, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial
              color={pin.emissive}
              emissive={pin.emissive}
              emissiveIntensity={5}
              metalness={0.1}
              roughness={0.2}
            />
          </mesh>

          {/* Pin base ring */}
          <mesh position={[0, -pin.height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[CONFIG.pinRadius * 1.2, CONFIG.pinRadius * 1.5, 16]} />
            <meshBasicMaterial
              color={pin.emissive}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {/* Connection Lines */}
      {connections.map((connection, i) => {
        const startPin = pins[connection.start];
        const endPin = pins[connection.end];

        if (!startPin || !endPin) return null;

        const midX = (startPin.x + endPin.x) / 2;
        const midZ = (startPin.z + endPin.z) / 2;
        const dx = endPin.x - startPin.x;
        const dz = endPin.z - startPin.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, dz);

        return (
          <mesh
            key={`connection-${i}`}
            ref={(el) => (connectionsRef.current[i] = el)}
            geometry={lineGeometry}
            position={[midX, 0.1, midZ]}
            rotation={[0, angle, Math.PI / 2]}
            scale={[1, distance, 1]}
          >
            <meshBasicMaterial
              color={connection.color}
              transparent
              opacity={connection.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* Circuit Nodes */}
      {nodes.map((node, i) => (
        <group key={`node-${i}`} position={[node.x, 0.2, node.z]}>
          <mesh
            ref={(el) => (nodesRef.current[i] = el)}
            geometry={i % 2 === 0 ? nodeGeometry : nodeGeometrySmall}
            rotation-x={-Math.PI / 2}
            castShadow
          >
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={2}
              metalness={0.5}
              roughness={0.1}
            />
          </mesh>

          {/* Node glow ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.08, 0.1, 32]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}

      {/* Central Hub */}
      <group position={[0, 0.25, 0]}>
        {/* Main chip */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.1, 0.8]} />
          <meshStandardMaterial
            color="#1A1A3E"
            metalness={0.9}
            roughness={0.1}
            emissive="#0A0A2E"
            emissiveIntensity={0.5}
          />
          <Edges scale={1} threshold={15} color="#45A9A9" lineWidth={0.5} />
        </mesh>

        {/* Chip core */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.4, 0.03, 0.4]} />
          <meshStandardMaterial
            color="#98E8DE"
            emissive="#45A9A9"
            emissiveIntensity={4}
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>

        {/* Corner markers */}
        {[0, 1, 2, 3].map((corner) => {
          const angle = (corner * Math.PI) / 2 + Math.PI / 4;
          const radius = 0.3;
          return (
            <mesh
              key={`corner-${corner}`}
              position={[Math.cos(angle) * radius, 0.06, Math.sin(angle) * radius]}
            >
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial
                color="#FFD700"
                emissive="#FFD700"
                emissiveIntensity={3}
                metalness={0.1}
                roughness={0.2}
              />
            </mesh>
          );
        })}
      </group>

      {/* Outer Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[spreadRadius * 0.9, spreadRadius * 0.92, 64]} />
        <meshBasicMaterial
          color={CONFIG.colors.line}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[spreadRadius * 0.5, spreadRadius * 0.52, 64]} />
        <meshBasicMaterial
          color={CONFIG.colors.pinCyan}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

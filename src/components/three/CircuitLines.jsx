import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function random(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Configuration constants
const CONFIG = {
  lineCount: 25,
  spreadSize: 18,
  minLength: 2,
  maxLength: 5,
  lineWidth: 0.04,
  lineHeight: 0.02,
  colors: {
    primary: '#45A9A9',
    secondary: '#7B2FBE',
    tertiary: '#FFD700',
    cyan: '#00FFFF',
  },
  pulseSpeed: 1.5,
  nodeCount: 15,
};

export default function CircuitLines({
  lineCount = CONFIG.lineCount,
  spreadSize = CONFIG.spreadSize,
  enableAnimation = true,
  enableNodes = true,
  enableSecondaryLines = true,
  enableGlow = true,
}) {
  const groupRef = useRef();
  const primaryLinesRef = useRef([]);
  const secondaryLinesRef = useRef([]);
  const nodesRef = useRef([]);
  const glowRefs = useRef([]);

  // Generate primary circuit lines
  const primaryLines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const angle = random(i * 11) * Math.PI * 2;
      const radius = random(i * 13) * spreadSize * 0.4;

      // Determine line direction (horizontal or vertical preference)
      const isHorizontal = random(i * 7) > 0.5;
      const length = random(i * 12) * (CONFIG.maxLength - CONFIG.minLength) + CONFIG.minLength;

      // Color variation
      const colorType = i % 4;
      let color, emissive;
      if (colorType === 0) {
        color = CONFIG.colors.primary;
        emissive = CONFIG.colors.primary;
      } else if (colorType === 1) {
        color = CONFIG.colors.secondary;
        emissive = CONFIG.colors.secondary;
      } else if (colorType === 2) {
        color = CONFIG.colors.tertiary;
        emissive = CONFIG.colors.tertiary;
      } else {
        color = CONFIG.colors.cyan;
        emissive = CONFIG.colors.cyan;
      }

      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        length,
        isHorizontal,
        rotation: isHorizontal ? 0 : Math.PI / 2,
        color,
        emissive,
        pulseSpeed: random(i * 17) * 2 + 0.5,
        pulseOffset: random(i * 19) * Math.PI * 2,
        width: random(i * 21) > 0.7 ? CONFIG.lineWidth * 1.5 : CONFIG.lineWidth,
      };
    });
  }, [lineCount, spreadSize]);

  // Generate secondary (perpendicular) lines
  const secondaryLines = useMemo(() => {
    if (!enableSecondaryLines) return [];

    return Array.from({ length: Math.floor(lineCount * 0.6) }, (_, i) => {
      const parentLine = primaryLines[i % primaryLines.length];
      const offset = (random(i * 23) - 0.5) * parentLine.length;
      const perpLength = random(i * 29) * 2 + 0.5;

      // Calculate position along the parent line
      const perpX = parentLine.isHorizontal ? offset : 0;
      const perpZ = parentLine.isHorizontal ? 0 : offset;

      return {
        x: parentLine.x + perpX,
        z: parentLine.z + perpZ,
        length: perpLength,
        rotation: parentLine.isHorizontal ? Math.PI / 2 : 0,
        color: parentLine.color,
        emissive: parentLine.emissive,
        opacity: 0.3 + random(i * 31) * 0.4,
      };
    });
  }, [primaryLines, lineCount, enableSecondaryLines]);

  // Generate circuit nodes (junction points)
  const nodes = useMemo(() => {
    if (!enableNodes) return [];

    return Array.from({ length: CONFIG.nodeCount }, (_, i) => {
      const angle = random(i * 37) * Math.PI * 2;
      const radius = random(i * 41) * spreadSize * 0.35;

      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        scale: 0.3 + random(i * 43) * 0.7,
        color:
          i % 3 === 0
            ? CONFIG.colors.tertiary
            : i % 3 === 1
              ? CONFIG.colors.cyan
              : CONFIG.colors.primary,
        pulseSpeed: random(i * 47) * 2 + 1,
        pulseOffset: random(i * 53) * Math.PI * 2,
      };
    });
  }, [enableNodes, spreadSize]);

  // Memoized geometries
  const lineGeometry = useMemo(
    () => new THREE.BoxGeometry(CONFIG.lineWidth, 1, CONFIG.lineHeight),
    [],
  );

  const lineGeometryWide = useMemo(
    () => new THREE.BoxGeometry(CONFIG.lineWidth * 1.5, 1, CONFIG.lineHeight),
    [],
  );

  const secondaryLineGeometry = useMemo(
    () => new THREE.BoxGeometry(CONFIG.lineWidth * 0.6, 1, CONFIG.lineHeight * 0.6),
    [],
  );

  const nodeGeometry = useMemo(() => new THREE.CylinderGeometry(0.06, 0.08, 0.04, 8), []);

  const nodeGeometrySmall = useMemo(() => new THREE.SphereGeometry(0.04, 8, 8), []);

  useFrame(({ clock }, delta) => {
    if (!enableAnimation || !groupRef.current) return;

    const t = clock.getElapsedTime();

    // Subtle rotation
    groupRef.current.rotation.y += delta * 0.05;

    // Animate primary lines
    primaryLinesRef.current.forEach((line, i) => {
      if (line && primaryLines[i]) {
        const pulse =
          Math.sin(t * primaryLines[i].pulseSpeed + primaryLines[i].pulseOffset) * 0.5 + 0.5;
        line.material.emissiveIntensity = 3 + pulse * 4;
        line.material.opacity = 0.7 + pulse * 0.3;
      }
    });

    // Animate secondary lines
    secondaryLinesRef.current.forEach((line, i) => {
      if (line) {
        const pulse = Math.sin(t * 1.5 + i * 0.3) * 0.3 + 0.7;
        line.material.opacity = (secondaryLines[i]?.opacity || 0.3) * pulse;
      }
    });

    // Animate nodes
    nodesRef.current.forEach((node, i) => {
      if (node && nodes[i]) {
        const pulse = Math.sin(t * nodes[i].pulseSpeed + nodes[i].pulseOffset) * 0.5 + 0.5;
        node.material.emissiveIntensity = 2 + pulse * 4;
        node.scale.setScalar(nodes[i].scale * (1 + pulse * 0.3));
      }
    });

    // Animate glow points
    glowRefs.current.forEach((glow, i) => {
      if (glow) {
        const pulse = Math.sin(t * 2 + i) * 0.3 + 0.7;
        glow.material.opacity = pulse * 0.6;
        glow.scale.setScalar(0.8 + pulse * 0.4);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Primary Circuit Lines */}
      {primaryLines.map((line, i) => (
        <group key={`primary-${i}`}>
          {/* Main line */}
          <mesh
            ref={(el) => (primaryLinesRef.current[i] = el)}
            rotation-x={-Math.PI / 2}
            rotation-z={line.rotation}
            position={[line.x, 0.01, line.z]}
            geometry={line.width > CONFIG.lineWidth ? lineGeometryWide : lineGeometry}
            scale={[1, line.length, 1]}
          >
            <meshStandardMaterial
              color={line.color}
              emissive={line.emissive}
              emissiveIntensity={5}
              metalness={0.1}
              roughness={0.3}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Line end caps */}
          {[-0.5, 0.5].map((end, endIndex) => {
            const offsetX = line.isHorizontal ? line.length * end : 0;
            const offsetZ = line.isHorizontal ? 0 : line.length * end;

            return (
              <mesh
                key={`end-${endIndex}`}
                position={[line.x + offsetX, 0.015, line.z + offsetZ]}
                rotation-x={-Math.PI / 2}
              >
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial
                  color={line.emissive}
                  emissive={line.emissive}
                  emissiveIntensity={6}
                  metalness={0.1}
                  roughness={0.2}
                />
              </mesh>
            );
          })}

          {/* Glow aura for main lines */}
          {enableGlow && line.width <= CONFIG.lineWidth && (
            <mesh
              ref={(el) => (glowRefs.current[i] = el)}
              rotation-x={-Math.PI / 2}
              rotation-z={line.rotation}
              position={[line.x, 0.012, line.z]}
              scale={[1.2, line.length * 1.05, 1.5]}
            >
              <boxGeometry args={[CONFIG.lineWidth * 1.5, 1, CONFIG.lineHeight * 1.5]} />
              <meshBasicMaterial
                color={line.emissive}
                transparent
                opacity={0.2}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Secondary Circuit Lines */}
      {secondaryLines.map((line, i) => (
        <mesh
          key={`secondary-${i}`}
          ref={(el) => (secondaryLinesRef.current[i] = el)}
          rotation-x={-Math.PI / 2}
          rotation-z={line.rotation}
          position={[line.x, 0.008, line.z]}
          geometry={secondaryLineGeometry}
          scale={[1, line.length, 1]}
        >
          <meshBasicMaterial
            color={line.emissive}
            transparent
            opacity={line.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Circuit Nodes (Junction Points) */}
      {nodes.map((node, i) => (
        <group key={`node-${i}`} position={[node.x, 0.015, node.z]}>
          {/* Main node body */}
          <mesh
            ref={(el) => (nodesRef.current[i] = el)}
            geometry={i % 2 === 0 ? nodeGeometry : nodeGeometrySmall}
            rotation-x={-Math.PI / 2}
          >
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={3}
              metalness={0.3}
              roughness={0.2}
            />
          </mesh>

          {/* Node glow ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.06, 0.08, 16]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Node connection dots */}
          {[0, 1, 2, 3].map((dot) => {
            const angle = (dot * Math.PI) / 2;
            return (
              <mesh
                key={`dot-${dot}`}
                position={[Math.cos(angle) * 0.08, 0, Math.sin(angle) * 0.08]}
              >
                <sphereGeometry args={[0.015, 4, 4]} />
                <meshBasicMaterial
                  color={node.color}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Central Processor Connection */}
      <group position={[0, 0.02, 0]}>
        {/* Center ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1, 64]} />
          <meshStandardMaterial
            color="#1A4A5A"
            metalness={0.9}
            roughness={0.2}
            emissive="#0A2530"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Center glow ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <ringGeometry args={[0.85, 0.95, 64]} />
          <meshBasicMaterial
            color={CONFIG.colors.primary}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Radial connection lines to center */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 0.9;
          return (
            <mesh
              key={`radial-${i}`}
              rotation-x={-Math.PI / 2}
              rotation-z={angle}
              position={[Math.cos(angle) * radius * 0.5, 0.005, Math.sin(angle) * radius * 0.5]}
              scale={[1, radius, 1]}
            >
              <boxGeometry args={[0.02, 1, 0.01]} />
              <meshBasicMaterial
                color={CONFIG.colors.primary}
                transparent
                opacity={0.3}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          );
        })}
      </group>

      {/* Corner Anchors */}
      {[0, 1, 2, 3].map((corner) => {
        const angle = (corner * Math.PI) / 2 + Math.PI / 4;
        const radius = spreadSize * 0.4;
        return (
          <group
            key={`anchor-${corner}`}
            position={[Math.cos(angle) * radius, 0.015, Math.sin(angle) * radius]}
          >
            <mesh rotation-x={-Math.PI / 2}>
              <cylinderGeometry args={[0.1, 0.12, 0.04, 8]} />
              <meshStandardMaterial
                color={CONFIG.colors.tertiary}
                emissive={CONFIG.colors.tertiary}
                emissiveIntensity={3}
                metalness={0.5}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial
                color={CONFIG.colors.cyan}
                emissive={CONFIG.colors.cyan}
                emissiveIntensity={4}
                metalness={0.1}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

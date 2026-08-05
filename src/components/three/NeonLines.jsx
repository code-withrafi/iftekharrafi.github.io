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
  minLength: 1,
  maxLength: 8,
  lineHeight: 0.01,
  lineWidth: 0.025,
  nodeCount: 15,
  colors: {
    primary: '#45A9A9',
    secondary: '#7B2FBE',
    tertiary: '#FFD700',
    cyan: '#00FFFF',
    pink: '#FF69B4',
    green: '#00FF88',
    orange: '#FF8C00',
  },
  pulseSpeed: 1.5,
  glowIntensity: 4,
};

export default function NeonLines({
  lineCount = CONFIG.lineCount,
  spreadSize = CONFIG.spreadSize,
  enableAnimation = true,
  enableGlow = true,
  enableNodes = true,
  enableParticles = true,
}) {
  const groupRef = useRef();
  const lineRefs = useRef([]);
  const nodeRefs = useRef([]);
  const glowRefs = useRef([]);
  const particleRefs = useRef([]);

  // Generate neon lines with more properties
  const lines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const angle = random(i * 13) * Math.PI * 2;
      const radius = random(i * 17) * spreadSize * 0.4;

      // Starting point
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      // Calculate endpoint (perpendicular or angled)
      const lineAngle = random(i * 19) * Math.PI * 2;
      const length = random(i * 23) * (CONFIG.maxLength - CONFIG.minLength) + CONFIG.minLength;

      const x2 = x1 + Math.cos(lineAngle) * length;
      const z2 = z1 + Math.sin(lineAngle) * length;

      // Color variation
      const colorKeys = Object.keys(CONFIG.colors);
      const colorKey = colorKeys[i % colorKeys.length];
      const color = CONFIG.colors[colorKey];

      return {
        x1,
        z1,
        x2,
        z2,
        midX: (x1 + x2) / 2,
        midZ: (z1 + z2) / 2,
        length,
        angle: lineAngle,
        color,
        pulseSpeed: random(i * 29) * 2 + 0.5,
        pulseOffset: random(i * 31) * Math.PI * 2,
        glowIntensity: 3 + random(i * 37) * 4,
        isWide: random(i * 41) > 0.7,
      };
    });
  }, [lineCount, spreadSize]);

  // Generate connection nodes
  const nodes = useMemo(() => {
    if (!enableNodes) return [];

    return Array.from({ length: CONFIG.nodeCount }, (_, i) => {
      // Place nodes at line intersections or endpoints
      const lineIndex = i % lines.length;
      const useStart = random(i * 43) > 0.5;
      const line = lines[lineIndex];

      const x = useStart ? line.x1 : line.x2;
      const z = useStart ? line.z1 : line.z2;

      return {
        x,
        z,
        color: line.color,
        scale: 0.3 + random(i * 47) * 0.7,
        pulseSpeed: random(i * 53) * 2 + 1,
        pulseOffset: random(i * 59) * Math.PI * 2,
      };
    });
  }, [lines, enableNodes]);

  // Generate floating particles along lines
  const particles = useMemo(() => {
    if (!enableParticles) return [];

    return Array.from({ length: 40 }, (_, i) => {
      const lineIndex = i % lines.length;
      const line = lines[lineIndex];
      const progress = random(i * 61);

      return {
        x: line.x1 + (line.x2 - line.x1) * progress,
        z: line.z1 + (line.z2 - line.z1) * progress,
        color: line.color,
        speed: 0.2 + random(i * 67) * 0.8,
        progress,
        lineIndex,
        size: 0.02 + random(i * 71) * 0.04,
      };
    });
  }, [lines, enableParticles]);

  // Memoized geometries
  const nodeGeometry = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);

  const nodeGeometryDiamond = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);

  const particleGeometry = useMemo(() => new THREE.SphereGeometry(0.03, 4, 4), []);

  const glowGeometry = useMemo(() => new THREE.PlaneGeometry(1, 0.05), []);

  useFrame(({ clock }, delta) => {
    if (!enableAnimation || !groupRef.current) return;

    const t = clock.getElapsedTime();

    // Animate line glow
    lineRefs.current.forEach((line, i) => {
      if (line && lines[i]) {
        const pulse = Math.sin(t * lines[i].pulseSpeed + lines[i].pulseOffset) * 0.4 + 0.6;
        line.material.emissiveIntensity = lines[i].glowIntensity * pulse;
        line.material.opacity = 0.7 + pulse * 0.3;

        // Subtle width pulse for wide lines
        if (lines[i].isWide) {
          line.scale.z = 1 + Math.sin(t * 2 + i) * 0.3;
        }
      }
    });

    // Animate nodes
    nodeRefs.current.forEach((node, i) => {
      if (node && nodes[i]) {
        const pulse = Math.sin(t * nodes[i].pulseSpeed + nodes[i].pulseOffset) * 0.5 + 0.5;
        node.material.emissiveIntensity = 2 + pulse * 5;
        node.scale.setScalar(nodes[i].scale * (1 + pulse * 0.3));

        // Rotate diamond nodes
        if (i % 2 === 0) {
          node.rotation.y += delta * 2;
        }
      }
    });

    // Animate particles along lines
    particleRefs.current.forEach((particle, i) => {
      if (particle && particles[i]) {
        const p = particles[i];
        p.progress += p.speed * delta * 0.5;

        // Loop back when reaching end
        if (p.progress > 1) {
          p.progress = 0;
        }
        if (p.progress < 0) {
          p.progress = 1;
        }

        const line = lines[p.lineIndex];
        if (line) {
          particle.position.x = line.x1 + (line.x2 - line.x1) * p.progress;
          particle.position.z = line.z1 + (line.z2 - line.z1) * p.progress;
          particle.position.y = 0.02 + Math.sin(t * 3 + i) * 0.02;

          // Glow pulse
          const pulse = Math.sin(t * 4 + i) * 0.3 + 0.7;
          particle.material.opacity = pulse;
          particle.scale.setScalar(p.size * pulse);
        }
      }
    });

    // Subtle group rotation
    groupRef.current.rotation.y += delta * 0.03;
  });

  return (
    <group ref={groupRef}>
      {/* Neon Lines */}
      {lines.map((line, i) => (
        <group key={`line-${i}`}>
          {/* Main line */}
          <mesh
            ref={(el) => (lineRefs.current[i] = el)}
            rotation-x={-Math.PI / 2}
            rotation-z={line.angle}
            position={[line.midX, line.isWide ? 0.012 : CONFIG.lineHeight, line.midZ]}
          >
            <boxGeometry
              args={[
                line.length,
                line.isWide ? CONFIG.lineWidth * 1.5 : CONFIG.lineWidth,
                CONFIG.lineHeight,
              ]}
            />
            <meshStandardMaterial
              color={line.color}
              emissive={line.color}
              emissiveIntensity={line.glowIntensity}
              metalness={0.1}
              roughness={0.3}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Line glow aura */}
          {enableGlow && (
            <mesh
              ref={(el) => (glowRefs.current[i] = el)}
              rotation-x={-Math.PI / 2}
              rotation-z={line.angle}
              position={[line.midX, CONFIG.lineHeight + 0.005, line.midZ]}
              geometry={glowGeometry}
              scale={[line.length * 1.05, 1, 2]}
            >
              <meshBasicMaterial
                color={line.color}
                transparent
                opacity={0.3}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* Line end caps */}
          {[
            { x: line.x1, z: line.z1 },
            { x: line.x2, z: line.z2 },
          ].map((endpoint, endIndex) => (
            <mesh
              key={`end-${endIndex}`}
              position={[endpoint.x, 0.015, endpoint.z]}
              rotation-x={-Math.PI / 2}
            >
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial
                color={line.color}
                emissive={line.color}
                emissiveIntensity={line.glowIntensity * 1.5}
                metalness={0.1}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Connection Nodes */}
      {nodes.map((node, i) => (
        <group key={`node-${i}`} position={[node.x, 0.02, node.z]}>
          {/* Main node */}
          <mesh
            ref={(el) => (nodeRefs.current[i] = el)}
            geometry={i % 2 === 0 ? nodeGeometry : nodeGeometryDiamond}
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

          {/* Node outer glow */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.08, 0.12, 32]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}

      {/* Floating Particles */}
      {particles.map((p, i) => (
        <mesh
          key={`particle-${i}`}
          ref={(el) => (particleRefs.current[i] = el)}
          geometry={particleGeometry}
          position={[p.x, 0.03, p.z]}
        >
          <meshBasicMaterial
            color={p.color}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Central Hub */}
      <group position={[0, 0.03, 0]}>
        {/* Hub ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 64]} />
          <meshStandardMaterial
            color="#1A4A5A"
            metalness={0.9}
            roughness={0.2}
            emissive="#0A2530"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Hub glow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <ringGeometry args={[0.55, 0.65, 64]} />
          <meshBasicMaterial
            color={CONFIG.colors.primary}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Hub center */}
        <mesh rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.3, 32]} />
          <meshStandardMaterial
            color="#0F3040"
            metalness={0.9}
            roughness={0.1}
            emissive="#1A4A5A"
            emissiveIntensity={1}
          />
        </mesh>
      </group>

      {/* Data Flow Rings */}
      {[0, 1, 2].map((ring) => (
        <mesh key={`ring-${ring}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
          <ringGeometry
            args={[spreadSize * 0.2 + ring * 1.5, spreadSize * 0.22 + ring * 1.5, 64]}
          />
          <meshBasicMaterial
            color={Object.values(CONFIG.colors)[ring % 6]}
            transparent
            opacity={0.1 - ring * 0.02}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

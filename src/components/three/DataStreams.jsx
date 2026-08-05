import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function random(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Configuration constants
const CONFIG = {
  particleCount: 120,
  spreadRadius: 15,
  maxHeight: 7,
  minSpeed: 0.01,
  maxSpeed: 0.05,
  particleSize: 0.025,
  colors: {
    primary: '#98E8DE',
    secondary: '#45A9A9',
    tertiary: '#7B2FBE',
    gold: '#FFD700',
    cyan: '#00FFFF',
  },
  trailCount: 20,
  ringCount: 3,
};

export default function DataStreams({
  particleCount = CONFIG.particleCount,
  spreadRadius = CONFIG.spreadRadius,
  maxHeight = CONFIG.maxHeight,
  enableAnimation = true,
  enableTrails = true,
  enableRings = true,
  enableParticles = true,
  streamSpeed = 1.0,
  direction = 'up', // 'up', 'down', 'bidirectional'
}) {
  const groupRef = useRef();
  const trailsRef = useRef([]);
  const ringsRef = useRef([]);
  const glowRefs = useRef([]);

  // Generate particles with more properties
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const angle = random(i * 7) * Math.PI * 2;
      const radius = random(i * 13) * spreadRadius * 0.9;

      // Determine particle type
      const type = i % 5;
      let color, emissive, size, shape;

      if (type === 0) {
        color = CONFIG.colors.primary;
        emissive = CONFIG.colors.secondary;
        size = CONFIG.particleSize;
        shape = 'sphere';
      } else if (type === 1) {
        color = CONFIG.colors.tertiary;
        emissive = CONFIG.colors.tertiary;
        size = CONFIG.particleSize * 1.3;
        shape = 'sphere';
      } else if (type === 2) {
        color = CONFIG.colors.gold;
        emissive = CONFIG.colors.gold;
        size = CONFIG.particleSize * 1.5;
        shape = 'diamond';
      } else if (type === 3) {
        color = CONFIG.colors.cyan;
        emissive = CONFIG.colors.cyan;
        size = CONFIG.particleSize * 0.8;
        shape = 'box';
      } else {
        color = CONFIG.colors.primary;
        emissive = CONFIG.colors.secondary;
        size = CONFIG.particleSize * 1.1;
        shape = 'sphere';
      }

      const speed = random(i * 11) * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed;
      const startY = random(i * 20) * maxHeight;

      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        startY,
        speed,
        type,
        color,
        emissive,
        size,
        shape,
        wobble: random(i * 17) * 0.5,
        wobbleSpeed: random(i * 19) * 2 + 1,
        pulseSpeed: random(i * 23) * 3 + 1,
        pulseOffset: random(i * 29) * Math.PI * 2,
      };
    });
  }, [particleCount, spreadRadius, maxHeight]);

  // Generate trail positions
  const trails = useMemo(() => {
    if (!enableTrails) return [];

    return Array.from({ length: CONFIG.trailCount }, (_, i) => {
      const angle = (i / CONFIG.trailCount) * Math.PI * 2;
      const radius = random(i * 31) * spreadRadius * 0.6 + spreadRadius * 0.1;

      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        length: 3 + random(i * 37) * 5,
        color: i % 2 === 0 ? CONFIG.colors.primary : CONFIG.colors.cyan,
        opacity: 0.1 + random(i * 41) * 0.2,
      };
    });
  }, [enableTrails, spreadRadius]);

  // Generate horizontal rings
  const rings = useMemo(() => {
    if (!enableRings) return [];

    return Array.from({ length: CONFIG.ringCount }, (_, i) => {
      const height = ((i + 1) / (CONFIG.ringCount + 1)) * maxHeight;
      const radius = spreadRadius * 0.3 + i * (spreadRadius * 0.2);

      return {
        height,
        radius,
        rotationSpeed: 0.1 + i * 0.05,
        color:
          i === 0 ? CONFIG.colors.primary : i === 1 ? CONFIG.colors.tertiary : CONFIG.colors.cyan,
        opacity: 0.15 - i * 0.03,
      };
    });
  }, [enableRings, maxHeight, spreadRadius]);

  // Memoized geometries
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);

  const diamondGeometry = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);

  const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  const trailGeometry = useMemo(() => new THREE.CylinderGeometry(0.01, 0.01, 1, 4), []);

  const ringGeometry = useMemo(() => new THREE.TorusGeometry(1, 0.02, 8, 64), []);

  useFrame(({ clock }, delta) => {
    if (!enableAnimation || !groupRef.current) return;

    const t = clock.getElapsedTime();

    // Animate particles
    groupRef.current.children.forEach((item, i) => {
      if (!item || !particles[i]) return;

      const p = particles[i];
      let newY;

      // Calculate movement based on direction
      if (direction === 'bidirectional') {
        const phase = Math.sin(t * 0.5 + i * 0.1);
        newY = item.userData.baseY + phase * maxHeight * 0.5;
      } else if (direction === 'down') {
        newY = item.position.y - p.speed * streamSpeed * delta * 60;
        if (newY < 0) newY = maxHeight;
      } else {
        // Up direction (default)
        newY = item.position.y + p.speed * streamSpeed * delta * 60;
        if (newY > maxHeight) newY = 0;
      }

      // Add wobble movement
      const wobbleX = Math.sin(t * p.wobbleSpeed + i) * p.wobble * delta * 30;
      const wobbleZ = Math.cos(t * p.wobbleSpeed + i) * p.wobble * delta * 30;

      item.position.y = newY;
      item.position.x += wobbleX;
      item.position.z += wobbleZ;

      // Reset position if drifted too far
      const distance = Math.sqrt(
        item.position.x * item.position.x + item.position.z * item.position.z,
      );
      if (distance > spreadRadius * 1.2) {
        item.position.x = p.x;
        item.position.z = p.z;
      }

      // Pulse effect
      const pulse = Math.sin(t * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7;
      item.scale.setScalar(p.size * pulse);

      // Update emissive intensity
      if (item.material) {
        item.material.emissiveIntensity = 3 + pulse * 4;
      }
    });

    // Animate trails
    trailsRef.current.forEach((trail, i) => {
      if (trail) {
        trail.rotation.z += delta * 0.5;
        trail.material.opacity = trails[i].opacity * (Math.sin(t * 0.5 + i) * 0.3 + 0.7);
      }
    });

    // Animate rings
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.z += delta * rings[i].rotationSpeed;
        ring.rotation.x += delta * rings[i].rotationSpeed * 0.5;
        ring.material.opacity = rings[i].opacity * (Math.sin(t * 0.3 + i) * 0.2 + 0.8);
      }
    });

    // Animate glow points
    glowRefs.current.forEach((glow, i) => {
      if (glow) {
        const pulse = Math.sin(t * 2 + i) * 0.3 + 0.7;
        glow.material.opacity = pulse * 0.5;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Data Particles */}
      {enableParticles &&
        particles.map((p, i) => (
          <group key={`particle-${i}`}>
            {/* Main particle */}
            <mesh
              position={[p.x, p.startY, p.z]}
              userData={{ baseY: p.startY }}
              geometry={
                p.shape === 'diamond'
                  ? diamondGeometry
                  : p.shape === 'box'
                    ? boxGeometry
                    : sphereGeometry
              }
              scale={[p.size, p.size, p.size]}
            >
              <meshStandardMaterial
                color={p.color}
                emissive={p.emissive}
                emissiveIntensity={5}
                metalness={0.1}
                roughness={0.2}
              />
            </mesh>

            {/* Particle glow */}
            <mesh
              ref={(el) => (glowRefs.current[i] = el)}
              position={[p.x, p.startY, p.z]}
              geometry={sphereGeometry}
              scale={[p.size * 2, p.size * 2, p.size * 2]}
            >
              <meshBasicMaterial
                color={p.emissive}
                transparent
                opacity={0.2}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}

      {/* Vertical Trails */}
      {enableTrails &&
        trails.map((trail, i) => (
          <mesh
            key={`trail-${i}`}
            ref={(el) => (trailsRef.current[i] = el)}
            geometry={trailGeometry}
            position={[trail.x, trail.length / 2, trail.z]}
            scale={[1, trail.length, 1]}
          >
            <meshBasicMaterial
              color={trail.color}
              transparent
              opacity={trail.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}

      {/* Horizontal Data Rings */}
      {enableRings &&
        rings.map((ring, i) => (
          <mesh
            key={`ring-${i}`}
            ref={(el) => (ringsRef.current[i] = el)}
            geometry={ringGeometry}
            position={[0, ring.height, 0]}
            scale={[ring.radius, ring.radius, ring.radius]}
          >
            <meshBasicMaterial
              color={ring.color}
              transparent
              opacity={ring.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}

      {/* Central Data Core */}
      <group position={[0, maxHeight / 2, 0]}>
        {/* Core beam */}
        <mesh>
          <cylinderGeometry args={[0.05, 0.08, maxHeight, 16]} />
          <meshStandardMaterial
            color={CONFIG.colors.primary}
            emissive={CONFIG.colors.secondary}
            emissiveIntensity={3}
            metalness={0.1}
            roughness={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Core glow */}
        <mesh>
          <cylinderGeometry args={[0.1, 0.15, maxHeight, 16]} />
          <meshBasicMaterial
            color={CONFIG.colors.secondary}
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Top orb */}
        <mesh position={[0, maxHeight / 2, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={CONFIG.colors.primary}
            emissive={CONFIG.colors.secondary}
            emissiveIntensity={5}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>

        {/* Bottom orb */}
        <mesh position={[0, -maxHeight / 2, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={CONFIG.colors.primary}
            emissive={CONFIG.colors.secondary}
            emissiveIntensity={3}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Data Flow Arrows */}
      {enableParticles &&
        [0, 1, 2, 3].map((arrow) => {
          const angle = (arrow * Math.PI) / 2;
          const radius = spreadRadius * 0.3;
          return (
            <group
              key={`arrow-${arrow}`}
              position={[Math.cos(angle) * radius, maxHeight * 0.3, Math.sin(angle) * radius]}
            >
              {/* Arrow particles in formation */}
              {Array.from({ length: 3 }, (_, j) => (
                <mesh
                  key={j}
                  position={[0, j * 0.3, 0]}
                  geometry={diamondGeometry}
                  scale={[0.04, 0.04, 0.04]}
                >
                  <meshStandardMaterial
                    color={CONFIG.colors.gold}
                    emissive={CONFIG.colors.gold}
                    emissiveIntensity={4}
                    metalness={0.1}
                    roughness={0.2}
                  />
                </mesh>
              ))}
            </group>
          );
        })}

      {/* Corner Data Collectors */}
      {[0, 1, 2, 3].map((corner) => {
        const angle = (corner * Math.PI) / 2 + Math.PI / 4;
        const radius = spreadRadius * 0.7;
        return (
          <group
            key={`collector-${corner}`}
            position={[Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius]}
          >
            <mesh rotation-x={-Math.PI / 2}>
              <cylinderGeometry args={[0.12, 0.15, 0.06, 8]} />
              <meshStandardMaterial
                color="#1A4A5A"
                metalness={0.9}
                roughness={0.2}
                emissive="#0A2530"
                emissiveIntensity={0.5}
              />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
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

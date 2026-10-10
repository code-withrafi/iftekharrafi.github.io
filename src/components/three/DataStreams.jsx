import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

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

const { primary, secondary, tertiary, gold, cyan } = CONFIG.colors;

function random(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function DataStreams({
  particleCount = CONFIG.particleCount,
  spreadRadius = CONFIG.spreadRadius,
  maxHeight = CONFIG.maxHeight,
  enableAnimation = true,
  enableTrails = true,
  enableRings = true,
  enableParticles = true,
  streamSpeed = 1,
  direction = 'up',
}) {
  const groupRef = useRef();
  const particleRefs = useRef([]);
  const trailsRef = useRef([]);
  const ringsRef = useRef([]);
  const glowRefs = useRef([]);

  /* ---------------------------------------------------------
     PARTICLES
     --------------------------------------------------------- */

  const particles = useMemo(() => {
    const result = new Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = random(i * 7) * Math.PI * 2;
      const radius = random(i * 13) * spreadRadius * 0.9;
      const type = i % 5;

      let color;
      let emissive;
      let size;
      let shape;

      switch (type) {
        case 0:
          color = primary;
          emissive = secondary;
          size = CONFIG.particleSize;
          shape = 'sphere';
          break;

        case 1:
          color = tertiary;
          emissive = tertiary;
          size = CONFIG.particleSize * 1.3;
          shape = 'sphere';
          break;

        case 2:
          color = gold;
          emissive = gold;
          size = CONFIG.particleSize * 1.5;
          shape = 'diamond';
          break;

        case 3:
          color = cyan;
          emissive = cyan;
          size = CONFIG.particleSize * 0.8;
          shape = 'box';
          break;

        default:
          color = primary;
          emissive = secondary;
          size = CONFIG.particleSize * 1.1;
          shape = 'sphere';
      }

      result[i] = {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        startY: random(i * 20) * maxHeight,
        speed: random(i * 11) * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed,
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
    }

    return result;
  }, [particleCount, spreadRadius, maxHeight]);

  /* ---------------------------------------------------------
     TRAILS
     --------------------------------------------------------- */

  const trails = useMemo(() => {
    if (!enableTrails) return [];

    const result = new Array(CONFIG.trailCount);

    for (let i = 0; i < CONFIG.trailCount; i++) {
      const angle = (i / CONFIG.trailCount) * Math.PI * 2;
      const radius = random(i * 31) * spreadRadius * 0.6 + spreadRadius * 0.1;

      result[i] = {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        length: 3 + random(i * 37) * 5,
        color: i % 2 === 0 ? primary : cyan,
        opacity: 0.1 + random(i * 41) * 0.2,
      };
    }

    return result;
  }, [enableTrails, spreadRadius]);

  /* ---------------------------------------------------------
     RINGS
     --------------------------------------------------------- */

  const rings = useMemo(() => {
    if (!enableRings) return [];

    const result = new Array(CONFIG.ringCount);

    for (let i = 0; i < CONFIG.ringCount; i++) {
      result[i] = {
        height: ((i + 1) / (CONFIG.ringCount + 1)) * maxHeight,

        radius: spreadRadius * 0.3 + i * (spreadRadius * 0.2),

        rotationSpeed: 0.1 + i * 0.05,

        color: i === 0 ? primary : i === 1 ? tertiary : cyan,

        opacity: 0.15 - i * 0.03,
      };
    }

    return result;
  }, [enableRings, maxHeight, spreadRadius]);

  /* ---------------------------------------------------------
     SHARED GEOMETRIES
     --------------------------------------------------------- */

  const geometry = useMemo(
    () => ({
      sphere: new THREE.SphereGeometry(1, 8, 8),
      diamond: new THREE.OctahedronGeometry(1, 0),
      box: new THREE.BoxGeometry(1, 1, 1),
      trail: new THREE.CylinderGeometry(0.01, 0.01, 1, 4),
      ring: new THREE.TorusGeometry(1, 0.02, 8, 64),

      coreBeam: new THREE.CylinderGeometry(0.05, 0.08, maxHeight, 16),

      coreGlow: new THREE.CylinderGeometry(0.1, 0.15, maxHeight, 16),

      orb: new THREE.SphereGeometry(0.15, 16, 16),
      bottomOrb: new THREE.SphereGeometry(0.1, 16, 16),

      collector: new THREE.CylinderGeometry(0.12, 0.15, 0.06, 8),

      collectorGlow: new THREE.SphereGeometry(0.05, 8, 8),
    }),
    [maxHeight],
  );

  /* ---------------------------------------------------------
     SHARED MATERIALS
     --------------------------------------------------------- */

  const material = useMemo(
    () => ({
      particlePrimary: new THREE.MeshStandardMaterial({
        color: primary,
        emissive: secondary,
        emissiveIntensity: 5,
        metalness: 0.1,
        roughness: 0.2,
      }),

      particlePurple: new THREE.MeshStandardMaterial({
        color: tertiary,
        emissive: tertiary,
        emissiveIntensity: 5,
        metalness: 0.1,
        roughness: 0.2,
      }),

      particleGold: new THREE.MeshStandardMaterial({
        color: gold,
        emissive: gold,
        emissiveIntensity: 5,
        metalness: 0.1,
        roughness: 0.2,
      }),

      particleCyan: new THREE.MeshStandardMaterial({
        color: cyan,
        emissive: cyan,
        emissiveIntensity: 5,
        metalness: 0.1,
        roughness: 0.2,
      }),

      glowPrimary: new THREE.MeshBasicMaterial({
        color: secondary,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),

      glowPurple: new THREE.MeshBasicMaterial({
        color: tertiary,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),

      glowGold: new THREE.MeshBasicMaterial({
        color: gold,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),

      glowCyan: new THREE.MeshBasicMaterial({
        color: cyan,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),

      coreBeam: new THREE.MeshStandardMaterial({
        color: primary,
        emissive: secondary,
        emissiveIntensity: 3,
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6,
      }),

      coreGlow: new THREE.MeshBasicMaterial({
        color: secondary,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),

      coreOrb: new THREE.MeshStandardMaterial({
        color: primary,
        emissive: secondary,
        emissiveIntensity: 5,
        metalness: 0.1,
        roughness: 0.1,
      }),

      bottomOrb: new THREE.MeshStandardMaterial({
        color: primary,
        emissive: secondary,
        emissiveIntensity: 3,
        metalness: 0.1,
        roughness: 0.1,
      }),

      collector: new THREE.MeshStandardMaterial({
        color: '#1A4A5A',
        metalness: 0.9,
        roughness: 0.2,
        emissive: '#0A2530',
        emissiveIntensity: 0.5,
      }),

      collectorGlow: new THREE.MeshStandardMaterial({
        color: cyan,
        emissive: cyan,
        emissiveIntensity: 4,
        metalness: 0.1,
        roughness: 0.2,
      }),
    }),
    [],
  );

  const particleGeometry = (shape) =>
    shape === 'diamond' ? geometry.diamond : shape === 'box' ? geometry.box : geometry.sphere;

  const particleMaterial = (type) => {
    switch (type) {
      case 1:
        return material.particlePurple;
      case 2:
        return material.particleGold;
      case 3:
        return material.particleCyan;
      default:
        return material.particlePrimary;
    }
  };

  const glowMaterial = (type) => {
    switch (type) {
      case 1:
        return material.glowPurple;
      case 2:
        return material.glowGold;
      case 3:
        return material.glowCyan;
      default:
        return material.glowPrimary;
    }
  };

  /* ---------------------------------------------------------
     ANIMATION
     --------------------------------------------------------- */

  useFrame(({ clock }, delta) => {
    if (!enableAnimation || !groupRef.current) return;

    const t = clock.getElapsedTime();
    const particlesRefList = particleRefs.current;

    /* Particles */
    for (let i = 0; i < particlesRefList.length; i++) {
      const item = particlesRefList[i];
      const p = particles[i];

      if (!item || !p) continue;

      let y;

      if (direction === 'bidirectional') {
        y = item.userData.baseY + Math.sin(t * 0.5 + i * 0.1) * maxHeight * 0.5;
      } else if (direction === 'down') {
        y = item.position.y - p.speed * streamSpeed * delta * 60;

        if (y < 0) y = maxHeight;
      } else {
        y = item.position.y + p.speed * streamSpeed * delta * 60;

        if (y > maxHeight) y = 0;
      }

      const wobbleX = Math.sin(t * p.wobbleSpeed + i) * p.wobble * delta * 30;

      const wobbleZ = Math.cos(t * p.wobbleSpeed + i) * p.wobble * delta * 30;

      item.position.y = y;
      item.position.x += wobbleX;
      item.position.z += wobbleZ;

      const distance = Math.hypot(item.position.x, item.position.z);

      if (distance > spreadRadius * 1.2) {
        item.position.x = p.x;
        item.position.z = p.z;
      }

      const pulse = Math.sin(t * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7;

      item.scale.setScalar(p.size * pulse);

      // Preserved from the original behavior.
      if (item.material) {
        item.material.emissiveIntensity = 3 + pulse * 4;
      }
    }

    /* Trails */
    for (let i = 0; i < trailsRef.current.length; i++) {
      const trail = trailsRef.current[i];

      if (!trail) continue;

      trail.rotation.z += delta * 0.5;

      trail.material.opacity = trails[i].opacity * (Math.sin(t * 0.5 + i) * 0.3 + 0.7);
    }

    /* Rings */
    for (let i = 0; i < ringsRef.current.length; i++) {
      const ring = ringsRef.current[i];

      if (!ring) continue;

      const speed = rings[i].rotationSpeed;

      ring.rotation.z += delta * speed;
      ring.rotation.x += delta * speed * 0.5;

      ring.material.opacity = rings[i].opacity * (Math.sin(t * 0.3 + i) * 0.2 + 0.8);
    }

    /* Glow */
    for (let i = 0; i < glowRefs.current.length; i++) {
      const glow = glowRefs.current[i];

      if (!glow) continue;

      glow.material.opacity = (Math.sin(t * 2 + i) * 0.3 + 0.7) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* DATA PARTICLES */}
      {enableParticles &&
        particles.map((p, i) => (
          <group
            key={`particle-${i}`}
            ref={(el) => {
              particleRefs.current[i] = el;
            }}
          >
            <mesh
              position={[p.x, p.startY, p.z]}
              userData={{ baseY: p.startY }}
              geometry={particleGeometry(p.shape)}
              material={particleMaterial(p.type)}
              scale={p.size}
            />

            <mesh
              ref={(el) => {
                glowRefs.current[i] = el;
              }}
              position={[p.x, p.startY, p.z]}
              geometry={geometry.sphere}
              material={glowMaterial(p.type)}
              scale={p.size * 2}
            />
          </group>
        ))}

      {/* VERTICAL TRAILS */}
      {enableTrails &&
        trails.map((trail, i) => (
          <mesh
            key={`trail-${i}`}
            ref={(el) => {
              trailsRef.current[i] = el;
            }}
            geometry={geometry.trail}
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

      {/* HORIZONTAL DATA RINGS */}
      {enableRings &&
        rings.map((ring, i) => (
          <mesh
            key={`ring-${i}`}
            ref={(el) => {
              ringsRef.current[i] = el;
            }}
            geometry={geometry.ring}
            position={[0, ring.height, 0]}
            scale={ring.radius}
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

      {/* CENTRAL DATA CORE */}
      <group position={[0, maxHeight / 2, 0]}>
        <mesh geometry={geometry.coreBeam} material={material.coreBeam} />

        <mesh geometry={geometry.coreGlow} material={material.coreGlow} />

        <mesh
          geometry={geometry.orb}
          material={material.coreOrb}
          position={[0, maxHeight / 2, 0]}
        />

        <mesh
          geometry={geometry.bottomOrb}
          material={material.bottomOrb}
          position={[0, -maxHeight / 2, 0]}
        />
      </group>

      {/* DATA FLOW ARROWS */}
      {enableParticles &&
        [0, 1, 2, 3].map((arrow) => {
          const angle = (arrow * Math.PI) / 2;
          const radius = spreadRadius * 0.3;

          return (
            <group
              key={`arrow-${arrow}`}
              position={[Math.cos(angle) * radius, maxHeight * 0.3, Math.sin(angle) * radius]}
            >
              {[0, 1, 2].map((j) => (
                <mesh key={j} position={[0, j * 0.3, 0]} geometry={geometry.diamond} scale={0.04}>
                  <meshStandardMaterial
                    color={gold}
                    emissive={gold}
                    emissiveIntensity={4}
                    metalness={0.1}
                    roughness={0.2}
                  />
                </mesh>
              ))}
            </group>
          );
        })}

      {/* CORNER DATA COLLECTORS */}
      {[0, 1, 2, 3].map((corner) => {
        const angle = (corner * Math.PI) / 2 + Math.PI / 4;

        const radius = spreadRadius * 0.7;

        return (
          <group
            key={`collector-${corner}`}
            position={[Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius]}
          >
            <mesh
              rotation-x={-Math.PI / 2}
              geometry={geometry.collector}
              material={material.collector}
            />

            <mesh
              position={[0, 0.04, 0]}
              geometry={geometry.collectorGlow}
              material={material.collectorGlow}
            />
          </group>
        );
      })}
    </group>
  );
}

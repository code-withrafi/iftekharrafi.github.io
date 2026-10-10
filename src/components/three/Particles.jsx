import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const PARTICLE_COUNT = 900;
const ROTATION_SPEED = 0.03;
const TILT_SPEED = 0.1;
const TILT_AMOUNT = 0.05;

function random(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function Particles() {
  const particlesRef = useRef();

  const positions = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = random(i * 11) * 15 + 3;
      const angle = random(i * 13) * Math.PI * 2;

      const index = i * 3;

      positions[index] = Math.cos(angle) * radius;
      positions[index + 1] = random(i * 17) * 8 + 0.5;
      positions[index + 2] = Math.sin(angle) * radius;
    }

    return positions;
  }, []);

  useFrame(({ clock }) => {
    const particles = particlesRef.current;
    if (!particles) return;

    const elapsed = clock.getElapsedTime();

    particles.rotation.y = elapsed * ROTATION_SPEED;
    particles.rotation.x = Math.sin(elapsed * TILT_SPEED) * TILT_AMOUNT;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial color="#98E8DE" size={0.045} transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

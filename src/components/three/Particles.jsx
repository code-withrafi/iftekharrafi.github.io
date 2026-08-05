import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function random(seed) {
  const x = Math.sin(seed) * 10000;

  return x - Math.floor(x);
}

export default function Particles() {
  const particlesRef = useRef();

  const positions = useMemo(() => {
    const arr = [];

    for (let i = 0; i < 900; i++) {
      const radius = random(i * 11) * 15 + 3;

      const angle = random(i * 13) * Math.PI * 2;

      const x = Math.cos(angle) * radius;

      const y = random(i * 17) * 8 + 0.5;

      const z = Math.sin(angle) * radius;

      arr.push(x, y, z);
    }

    return new Float32Array(arr);
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.03;

      particlesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"

          count={positions.length / 3}

          array={positions}

          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#98E8DE"

        size={0.045}

        transparent

        opacity={0.85}

        sizeAttenuation
      />
    </points>
  );
}

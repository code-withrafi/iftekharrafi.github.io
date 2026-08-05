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
  buildingCount: 55,
  cityRadius: 18,
  minHeight: 1,
  maxHeight: 6,
  minWidth: 0.3,
  maxWidth: 0.8,
  colors: {
    purple: '#4E1F6E',
    blue: '#3E3E75',
    cyan: '#2A5A7A',
    darkPurple: '#3A1850',
    darkBlue: '#2A2A55',
  },
  glowColor: '#98E8DE',
  glowEmissive: '#45A9A9',
  glowIntensity: 3,
  metalness: 0.8,
  roughness: 0.25,
};

export default function TechCity({ timeSpeed = 0.5 }) {
  const cityGroup = useRef();
  const lightBeams = useRef([]);

  const buildings = useMemo(() => {
    return Array.from({ length: CONFIG.buildingCount }, (_, i) => {
      const angle = random(i * 7) * Math.PI * 2;
      const radius = random(i * 13) * CONFIG.cityRadius * 0.8 + CONFIG.cityRadius * 0.2;
      const height = random(i * 23) * (CONFIG.maxHeight - CONFIG.minHeight) + CONFIG.minHeight;
      const width = random(i * 31) * (CONFIG.maxWidth - CONFIG.minWidth) + CONFIG.minWidth;

      // Determine building type
      const type = i % 4;
      const isSkyscraper = height > 4;
      const hasAntenna = height > 3.5 && random(i * 41) > 0.6;
      const hasWindows = random(i * 37) > 0.3;
      const windowLevels = hasWindows ? Math.floor(height * 2) : 0;

      // Color variation
      let color;
      if (type === 0) color = CONFIG.colors.purple;
      else if (type === 1) color = CONFIG.colors.blue;
      else if (type === 2) color = CONFIG.colors.cyan;
      else color = CONFIG.colors.darkBlue;

      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        height,
        width,
        type,
        isSkyscraper,
        hasAntenna,
        hasWindows,
        windowLevels,
        color,
        glowPulseSpeed: random(i * 43) * 2 + 1,
        glowPulseOffset: random(i * 47) * Math.PI * 2,
      };
    });
  }, []);

  // Memoized geometries
  const windowGeometry = useMemo(() => new THREE.BoxGeometry(0.05, 0.08, 0.02), []);
  const antennaGeometry = useMemo(() => new THREE.CylinderGeometry(0.02, 0.03, 0.3, 8), []);
  const antennaBallGeometry = useMemo(() => new THREE.SphereGeometry(0.04, 8, 8), []);
  const beamGeometry = useMemo(() => new THREE.CylinderGeometry(0.01, 0.03, 1, 8), []);

  // Generate window positions for each building
  const buildingWindows = useMemo(() => {
    return buildings.map((building) => {
      if (!building.hasWindows) return [];

      const windows = [];
      const windowSpacing = 0.15;
      const levelsCount = building.windowLevels;

      for (let level = 0; level < levelsCount; level++) {
        const y = level * windowSpacing - building.height / 2 + 0.2;
        if (y > building.height / 2 - 0.2) continue;

        // Windows on all four sides
        for (let side = 0; side < 4; side++) {
          const angle = (side * Math.PI) / 2;
          const offsetX = Math.cos(angle) * (building.width / 2 + 0.01);
          const offsetZ = Math.sin(angle) * (building.width / 2 + 0.01);

          windows.push({
            x: building.x + offsetX,
            y: y,
            z: building.z + offsetZ,
            rotationY: angle,
          });
        }
      }

      return windows;
    });
  }, [buildings]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * timeSpeed;

    // Rotate entire city slowly
    if (cityGroup.current) {
      cityGroup.current.rotation.y = t * 0.05;
    }

    // Animate light beams
    lightBeams.current.forEach((beam, index) => {
      if (beam) {
        const building = buildings[index];
        const intensity =
          (Math.sin(t * building.glowPulseSpeed + building.glowPulseOffset) + 1) / 2;
        beam.material.opacity = intensity * 0.3;
        beam.scale.y = intensity * 2 + 1;
      }
    });
  });

  return (
    <group ref={cityGroup}>
      {/* City platform/base */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[CONFIG.cityRadius * 0.9, 64]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Grid lines on platform */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[CONFIG.cityRadius * 0.3, CONFIG.cityRadius * 0.32, 64]} />
        <meshBasicMaterial color="#45A9A9" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[CONFIG.cityRadius * 0.6, CONFIG.cityRadius * 0.62, 64]} />
        <meshBasicMaterial color="#45A9A9" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {buildings.map((b, i) => (
        <group key={i}>
          {/* Main building */}
          <mesh position={[b.x, b.height / 2, b.z]} castShadow receiveShadow>
            <boxGeometry args={[b.width, b.height, b.width]} />
            <meshStandardMaterial
              color={b.color}
              metalness={CONFIG.metalness}
              roughness={CONFIG.roughness}
            />
            {/* Edge highlights */}
            <Edges
              scale={1}
              threshold={15}
              color={b.isSkyscraper ? '#7B2FBE' : '#5A5A95'}
              lineWidth={0.5}
            />
          </mesh>

          {/* Building windows */}
          {buildingWindows[i]?.map((window, wIndex) => (
            <mesh
              key={wIndex}
              geometry={windowGeometry}
              position={[window.x, window.y, window.z]}
              rotation={[0, window.rotationY, 0]}
            >
              <meshStandardMaterial
                color="#FFD700"
                emissive="#FFA500"
                emissiveIntensity={0.8}
                metalness={0.1}
                roughness={0.3}
              />
            </mesh>
          ))}

          {/* Rooftop glow pad */}
          <mesh position={[b.x, b.height + 0.05, b.z]} castShadow>
            <boxGeometry args={[b.width * 0.5, 0.05, b.width * 0.5]} />
            <meshStandardMaterial
              color={CONFIG.glowColor}
              emissive={CONFIG.glowEmissive}
              emissiveIntensity={CONFIG.glowIntensity}
              metalness={0.2}
              roughness={0.3}
            />
          </mesh>

          {/* Rooftop detail ring */}
          <mesh position={[b.x, b.height + 0.08, b.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[b.width * 0.25, b.width * 0.3, 32]} />
            <meshBasicMaterial
              color={CONFIG.glowEmissive}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Antenna for tall buildings */}
          {b.hasAntenna && (
            <group position={[b.x, b.height + 0.1, b.z]}>
              <mesh geometry={antennaGeometry} castShadow>
                <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.1} />
              </mesh>
              <mesh geometry={antennaBallGeometry} position={[0, 0.2, 0]}>
                <meshStandardMaterial
                  color="#FF0000"
                  emissive="#FF0000"
                  emissiveIntensity={2}
                  metalness={0.1}
                  roughness={0.4}
                />
              </mesh>
            </group>
          )}

          {/* Vertical light beam */}
          <mesh
            ref={(el) => (lightBeams.current[i] = el)}
            geometry={beamGeometry}
            position={[b.x, b.height + 0.5, b.z]}
            renderOrder={1}
          >
            <meshBasicMaterial
              color={CONFIG.glowColor}
              transparent
              opacity={0.2}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Ground glow disc */}
          <mesh position={[b.x, 0.02, b.z]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
            <circleGeometry args={[b.width * 0.6, 16]} />
            <meshBasicMaterial
              color={CONFIG.glowColor}
              transparent
              opacity={0.15}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Corner accent lights */}
          {b.isSkyscraper &&
            [0, 1, 2, 3].map((corner) => {
              const angle = (corner * Math.PI) / 2;
              return (
                <mesh
                  key={corner}
                  position={[
                    b.x + Math.cos(angle) * (b.width / 2),
                    b.height / 2,
                    b.z + Math.sin(angle) * (b.width / 2),
                  ]}
                >
                  <boxGeometry args={[0.02, b.height * 0.8, 0.02]} />
                  <meshBasicMaterial
                    color="#45A9A9"
                    transparent
                    opacity={0.4}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </mesh>
              );
            })}
        </group>
      ))}

      {/* Central data streams */}
      <group>
        {[0, 1, 2, 3].map((ring) => (
          <mesh
            key={ring}
            position={[0, 0.5 + ring * 0.3, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={2}
          >
            <ringGeometry args={[ring * 2 + 1, ring * 2 + 1.1, 64]} />
            <meshBasicMaterial
              color="#45A9A9"
              transparent
              opacity={0.2 - ring * 0.05}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}

        {/* Central pillar */}
        <mesh position={[0, 3, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, 6, 16]} />
          <meshStandardMaterial
            color="#2A5A7A"
            metalness={0.9}
            roughness={0.2}
            emissive="#1a3a5a"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Central core glow */}
        <mesh position={[0, 6.1, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#98E8DE"
            emissive="#45A9A9"
            emissiveIntensity={5}
            metalness={0.1}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}

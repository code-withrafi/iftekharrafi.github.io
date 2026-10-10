import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';

const CONFIG = {
  // Reduced from 50 → 42 for low-end devices
  buildingCount: 42,
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

const COLORS = CONFIG.colors;

function random(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getBuildingColor(type) {
  switch (type) {
    case 0:
      return COLORS.purple;
    case 1:
      return COLORS.blue;
    case 2:
      return COLORS.cyan;
    default:
      return COLORS.darkBlue;
  }
}

export default function TechCity({ timeSpeed = 0.5 }) {
  const cityGroup = useRef();
  const lightBeams = useRef([]);

  const buildings = useMemo(() => {
    const result = new Array(CONFIG.buildingCount);

    const { buildingCount, cityRadius, minHeight, maxHeight, minWidth, maxWidth } = CONFIG;

    const heightRange = maxHeight - minHeight;
    const widthRange = maxWidth - minWidth;
    const halfRadius = cityRadius * 0.2;
    const outerRadius = cityRadius * 0.8;

    for (let i = 0; i < buildingCount; i++) {
      const angle = random(i * 7) * Math.PI * 2;
      const radius = random(i * 13) * outerRadius + halfRadius;

      const height = random(i * 23) * heightRange + minHeight;
      const width = random(i * 31) * widthRange + minWidth;

      const type = i % 4;
      const isSkyscraper = height > 4;
      const hasAntenna = height > 3.5 && random(i * 41) > 0.6;
      const hasWindows = random(i * 37) > 0.3;

      result[i] = {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        height,
        width,
        type,
        isSkyscraper,
        hasAntenna,
        hasWindows,
        windowLevels: hasWindows ? Math.floor(height * 2) : 0,
        color: getBuildingColor(type),
        glowPulseSpeed: random(i * 43) * 2 + 1,
        glowPulseOffset: random(i * 47) * Math.PI * 2,
      };
    }

    return result;
  }, []);

  const geometries = useMemo(
    () => ({
      window: new THREE.BoxGeometry(0.05, 0.08, 0.02),
      antenna: new THREE.CylinderGeometry(0.02, 0.03, 0.3, 8),
      antennaBall: new THREE.SphereGeometry(0.04, 8, 8),
      beam: new THREE.CylinderGeometry(0.01, 0.03, 1, 8),

      platform: new THREE.CircleGeometry(CONFIG.cityRadius * 0.9, 64),

      buildingBase: new THREE.BoxGeometry(1, 1, 1),
      glowPad: new THREE.BoxGeometry(1, 1, 1),
      corner: new THREE.BoxGeometry(0.02, 1, 0.02),

      groundGlow: new THREE.CircleGeometry(1, 16),

      pillar: new THREE.CylinderGeometry(0.1, 0.15, 6, 16),
      core: new THREE.SphereGeometry(0.3, 16, 16),

      centralRing: new THREE.RingGeometry(1, 1.1, 64),
      gridRing: new THREE.RingGeometry(1, 1.02, 64),
      glowRing: new THREE.RingGeometry(1, 1.1, 32),
    }),
    [],
  );

  const materials = useMemo(
    () => ({
      window: new THREE.MeshStandardMaterial({
        color: '#FFD700',
        emissive: '#FFA500',
        emissiveIntensity: 0.8,
        metalness: 0.1,
        roughness: 0.3,
      }),

      antenna: new THREE.MeshStandardMaterial({
        color: '#C0C0C0',
        metalness: 1,
        roughness: 0.1,
      }),

      antennaBall: new THREE.MeshStandardMaterial({
        color: '#FF0000',
        emissive: '#FF0000',
        emissiveIntensity: 2,
        metalness: 0.1,
        roughness: 0.4,
      }),

      beam: new THREE.MeshBasicMaterial({
        color: CONFIG.glowColor,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),

      glow: new THREE.MeshStandardMaterial({
        color: CONFIG.glowColor,
        emissive: CONFIG.glowEmissive,
        emissiveIntensity: CONFIG.glowIntensity,
        metalness: 0.2,
        roughness: 0.3,
      }),

      ring: new THREE.MeshBasicMaterial({
        color: CONFIG.glowEmissive,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),

      groundGlow: new THREE.MeshBasicMaterial({
        color: CONFIG.glowColor,
        transparent: true,
        opacity: 0.15,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),

      corner: new THREE.MeshBasicMaterial({
        color: '#45A9A9',
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),

      platform: new THREE.MeshStandardMaterial({
        color: '#1a1a2e',
        metalness: 0.9,
        roughness: 0.1,
      }),

      grid: new THREE.MeshBasicMaterial({
        color: '#45A9A9',
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
      }),

      pillar: new THREE.MeshStandardMaterial({
        color: '#2A5A7A',
        metalness: 0.9,
        roughness: 0.2,
        emissive: '#1a3a5a',
        emissiveIntensity: 0.5,
      }),

      core: new THREE.MeshStandardMaterial({
        color: '#98E8DE',
        emissive: '#45A9A9',
        emissiveIntensity: 5,
        metalness: 0.1,
        roughness: 0.2,
      }),

      centralRing: new THREE.MeshBasicMaterial({
        color: '#45A9A9',
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    }),
    [],
  );

  const buildingWindows = useMemo(() => {
    return buildings.map((building) => {
      if (!building.hasWindows) return [];

      const windows = [];
      const spacing = 0.15;
      const halfWidth = building.width / 2;
      const levels = building.windowLevels;

      for (let level = 0; level < levels; level++) {
        const y = level * spacing - building.height / 2 + 0.2;

        if (y > building.height / 2 - 0.2) continue;

        for (let side = 0; side < 4; side++) {
          const angle = side * Math.PI * 0.5;
          const offset = halfWidth + 0.01;

          windows.push({
            x: building.x + Math.cos(angle) * offset,
            y,
            z: building.z + Math.sin(angle) * offset,
            rotationY: angle,
          });
        }
      }

      return windows;
    });
  }, [buildings]);

  useFrame(({ clock }) => {
    const city = cityGroup.current;

    if (!city) return;

    const time = clock.getElapsedTime() * timeSpeed;

    city.rotation.y = time * 0.05;

    const beams = lightBeams.current;

    for (let i = 0; i < beams.length; i++) {
      const beam = beams[i];

      if (!beam) continue;

      const building = buildings[i];

      const intensity =
        (Math.sin(time * building.glowPulseSpeed + building.glowPulseOffset) + 1) * 0.5;

      beam.material.opacity = intensity * 0.3;
      beam.scale.y = intensity * 2 + 1;
    }
  });

  return (
    <group ref={cityGroup}>
      {/* City platform */}
      <mesh
        position={[0, -0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        geometry={geometries.platform}
        material={materials.platform}
      />

      {/* Grid rings */}
      {[0.3, 0.6].map((scale, index) => (
        <mesh
          key={index}
          position={[0, -0.05, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={geometries.gridRing}
          scale={[CONFIG.cityRadius * scale, CONFIG.cityRadius * scale, 1]}
          material={materials.grid}
        />
      ))}

      {/* Buildings */}
      {buildings.map((building, index) => (
        <group key={index}>
          {/* Main building */}
          <mesh
            position={[building.x, building.height / 2, building.z]}
            scale={[building.width, building.height, building.width]}
            geometry={geometries.buildingBase}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={building.color}
              metalness={CONFIG.metalness}
              roughness={CONFIG.roughness}
            />

            <Edges
              scale={1}
              threshold={15}
              color={building.isSkyscraper ? '#7B2FBE' : '#5A5A95'}
              lineWidth={0.5}
            />
          </mesh>

          {/* Windows */}
          {buildingWindows[index].map((window, windowIndex) => (
            <mesh
              key={windowIndex}
              geometry={geometries.window}
              material={materials.window}
              position={[window.x, window.y, window.z]}
              rotation={[0, window.rotationY, 0]}
            />
          ))}

          {/* Rooftop glow */}
          <mesh
            position={[building.x, building.height + 0.05, building.z]}
            scale={[building.width * 0.5, 0.05, building.width * 0.5]}
            geometry={geometries.glowPad}
            material={materials.glow}
            castShadow
          />

          {/* Rooftop ring */}
          <mesh
            position={[building.x, building.height + 0.08, building.z]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[building.width * 0.25, building.width * 0.25, 1]}
            geometry={geometries.glowRing}
            material={materials.ring}
          />

          {/* Antenna */}
          {building.hasAntenna && (
            <group position={[building.x, building.height + 0.1, building.z]}>
              <mesh geometry={geometries.antenna} material={materials.antenna} castShadow />

              <mesh
                geometry={geometries.antennaBall}
                material={materials.antennaBall}
                position={[0, 0.2, 0]}
              />
            </group>
          )}

          {/* Light beam */}
          <mesh
            ref={(element) => {
              lightBeams.current[index] = element;
            }}
            geometry={geometries.beam}
            material={materials.beam}
            position={[building.x, building.height + 0.5, building.z]}
            renderOrder={1}
          />

          {/* Ground glow */}
          <mesh
            position={[building.x, 0.02, building.z]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[building.width * 0.6, building.width * 0.6, 1]}
            geometry={geometries.groundGlow}
            material={materials.groundGlow}
            renderOrder={1}
          />

          {/* Skyscraper corner lights */}
          {building.isSkyscraper &&
            [0, 1, 2, 3].map((corner) => {
              const angle = corner * Math.PI * 0.5;
              const offset = building.width * 0.5;

              return (
                <mesh
                  key={corner}
                  position={[
                    building.x + Math.cos(angle) * offset,
                    building.height / 2,
                    building.z + Math.sin(angle) * offset,
                  ]}
                  scale={[1, building.height * 0.8, 1]}
                  geometry={geometries.corner}
                  material={materials.corner}
                />
              );
            })}
        </group>
      ))}

      {/* Central structure */}
      <group>
        {[0, 1, 2, 3].map((ring) => (
          <mesh
            key={ring}
            position={[0, 0.5 + ring * 0.3, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[ring * 2 + 1, ring * 2 + 1, 1]}
            geometry={geometries.centralRing}
            material={materials.centralRing}
            renderOrder={2}
          />
        ))}

        {/* Central pillar */}
        <mesh
          position={[0, 3, 0]}
          geometry={geometries.pillar}
          material={materials.pillar}
          castShadow
        />

        {/* Central core */}
        <mesh position={[0, 6.1, 0]} geometry={geometries.core} material={materials.core} />
      </group>
    </group>
  );
}

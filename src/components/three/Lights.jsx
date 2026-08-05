import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import 'three';

// Configuration constants
const CONFIG = {
  ambient: {
    intensity: 0.4,
    color: '#1a1a3e',
  },
  main: {
    position: [5, 8, 5],
    intensity: 2,
    color: '#ffffff',
  },
  fill: {
    position: [-5, 3, -5],
    intensity: 1.5,
    color: '#4E1F6E',
  },
  rim: {
    position: [0, 2, -5],
    intensity: 1,
    color: '#45A9A9',
  },
  core: {
    position: [0, 3, 0],
    color: '#45A9A9',
    intensity: 3,
    pulseSpeed: 2,
    pulseAmount: 0.5,
  },
  accent: {
    positions: [
      [3, 1, 3],
      [-3, 1, 3],
      [3, 1, -3],
      [-3, 1, -3],
      [0, 5, 0],
    ],
    color: '#98E8DE',
    intensity: 2,
  },
  spotlights: {
    count: 3,
    color: '#7B2FBE',
    intensity: 5,
  },
  shadows: {
    enabled: true,
    mapSize: 1024,
    bias: -0.0001,
  },
};

export default function Lights({
  quality = 'high',
  shadows = true,
  enableAccents = true,
  enableSpotlights = true,
  enablePulsing = true,
  enableFill = true,
  enableRim = true,
  ambientIntensity = CONFIG.ambient.intensity,
  mainIntensity = CONFIG.main.intensity,
  coreIntensity = CONFIG.core.intensity,
  debug = false,
}) {
  const coreLight = useRef();
  const accentLights = useRef([]);
  const spotlightRefs = useRef([]);
  const fillLight = useRef();
  const rimLight = useRef();
  const mainLight = useRef();

  // Generate spotlight data
  const spotlights = useMemo(() => {
    if (!enableSpotlights) return [];

    return Array.from({ length: CONFIG.spotlights.count }, (_, i) => {
      const angle = (i / CONFIG.spotlights.count) * Math.PI * 2;
      const radius = 4;
      const height = 3 + i * 1.5;

      return {
        position: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        target: [Math.cos(angle + Math.PI) * 1.5, 1, Math.sin(angle + Math.PI) * 1.5],
        color: CONFIG.spotlights.color,
        intensity: CONFIG.spotlights.intensity,
        angle: 0.5,
        penumbra: 0.5,
        pulseSpeed: 1 + i * 0.5,
        pulseOffset: i * Math.PI * 0.5,
      };
    });
  }, [enableSpotlights]);

  // Quality-based shadow settings
  const shadowSettings = useMemo(
    () => ({
      low: { mapSize: 512, bias: -0.001 },
      medium: { mapSize: 1024, bias: -0.0005 },
      high: { mapSize: 2048, bias: -0.0001 },
    }),
    [],
  );

  const currentShadow = shadowSettings[quality] || shadowSettings.high;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse core light
    if (coreLight.current && enablePulsing) {
      coreLight.current.intensity =
        coreIntensity + Math.sin(t * CONFIG.core.pulseSpeed) * CONFIG.core.pulseAmount;

      // Subtle color shift
      const hue = 0.5 + Math.sin(t * 0.5) * 0.05;
      coreLight.current.color.setHSL(hue, 1, 0.5);
    }

    // Animate accent lights
    accentLights.current.forEach((light, i) => {
      if (light) {
        const pulse = Math.sin(t * 1.5 + i * 0.7) * 0.3 + 0.7;
        light.intensity = CONFIG.accent.intensity * pulse;

        // Subtle position wobble
        if (light.userData.basePosition) {
          light.position.x = light.userData.basePosition[0] + Math.sin(t * 0.5 + i) * 0.2;
          light.position.z = light.userData.basePosition[2] + Math.cos(t * 0.5 + i) * 0.2;
        }
      }
    });

    // Animate spotlights
    spotlightRefs.current.forEach((spotlight, i) => {
      if (spotlight && spotlights[i]) {
        const pulse =
          Math.sin(t * spotlights[i].pulseSpeed + spotlights[i].pulseOffset) * 0.3 + 0.7;
        spotlight.intensity = spotlights[i].intensity * pulse;

        // Rotate spotlight targets
        const angle = (i / spotlights.length) * Math.PI * 2 + t * 0.2;
        spotlight.target.position.x = Math.cos(angle) * 1.5;
        spotlight.target.position.z = Math.sin(angle) * 1.5;
      }
    });

    // Subtle fill light animation
    if (fillLight.current && enableFill) {
      fillLight.current.intensity = CONFIG.fill.intensity + Math.sin(t * 0.3) * 0.2;
    }

    // Subtle rim light animation
    if (rimLight.current && enableRim) {
      rimLight.current.intensity = CONFIG.rim.intensity + Math.cos(t * 0.4) * 0.2;
    }

    // Main light subtle movement
    if (mainLight.current) {
      mainLight.current.position.x = CONFIG.main.position[0] + Math.sin(t * 0.1) * 0.5;
      mainLight.current.position.z = CONFIG.main.position[2] + Math.cos(t * 0.1) * 0.5;
    }
  });

  return (
    <>
      {/* Ambient Light - Base illumination */}
      <ambientLight intensity={ambientIntensity} color={CONFIG.ambient.color} />

      {/* Main Directional Light - Key light */}
      <directionalLight
        ref={mainLight}
        position={CONFIG.main.position}
        intensity={mainIntensity}
        color={CONFIG.main.color}
        castShadow={shadows}
        shadow-mapSize-width={currentShadow.mapSize}
        shadow-mapSize-height={currentShadow.mapSize}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={currentShadow.bias}
        shadow-normalBias={0.02}
      />

      {/* Fill Light - Reduces harsh shadows */}
      {enableFill && (
        <pointLight
          ref={fillLight}
          position={CONFIG.fill.position}
          intensity={CONFIG.fill.intensity}
          color={CONFIG.fill.color}
          distance={20}
          decay={2}
        />
      )}

      {/* Rim Light - Separates subject from background */}
      {enableRim && (
        <pointLight
          ref={rimLight}
          position={CONFIG.rim.position}
          intensity={CONFIG.rim.intensity}
          color={CONFIG.rim.color}
          distance={15}
          decay={2}
        />
      )}

      {/* Core Pulsing Light - Main subject illumination */}
      <pointLight
        ref={coreLight}
        position={CONFIG.core.position}
        color={CONFIG.core.color}
        intensity={coreIntensity}
        distance={10}
        decay={2}
      />

      {/* Accent Lights - Edge highlights */}
      {enableAccents &&
        CONFIG.accent.positions.map((pos, i) => (
          <pointLight
            key={`accent-${i}`}
            ref={(el) => (accentLights.current[i] = el)}
            position={pos}
            color={CONFIG.accent.color}
            intensity={CONFIG.accent.intensity}
            distance={8}
            decay={2}
            userData={{ basePosition: pos }}
          />
        ))}

      {/* Spotlights - Dramatic focused beams */}
      {enableSpotlights &&
        spotlights.map((spotlight, i) => (
          <spotLight
            key={`spotlight-${i}`}
            ref={(el) => (spotlightRefs.current[i] = el)}
            position={spotlight.position}
            color={spotlight.color}
            intensity={spotlight.intensity}
            distance={15}
            angle={spotlight.angle}
            penumbra={spotlight.penumbra}
            decay={2}
            castShadow={shadows && quality === 'high'}
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
          >
            <object3D position={spotlight.target} />
          </spotLight>
        ))}

      {/* Bottom Fill - Reduces dark undersides */}
      <pointLight position={[0, -3, 0]} intensity={0.5} color="#1a1a3e" distance={10} decay={2} />

      {/* Hemisphere Light - Natural ambient gradient */}
      <hemisphereLight intensity={0.3} color="#45A9A9" groundColor="#0F3040" />

      {/* Debug helpers */}
      {debug && (
        <>
          <mesh position={CONFIG.core.position}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="red" />
          </mesh>

          {CONFIG.accent.positions.map((pos, i) => (
            <mesh key={`debug-accent-${i}`} position={pos}>
              <sphereGeometry args={[0.05, 4, 4]} />
              <meshBasicMaterial color="yellow" />
            </mesh>
          ))}

          {spotlights.map((spotlight, i) => (
            <group key={`debug-spotlight-${i}`}>
              <mesh position={spotlight.position}>
                <sphereGeometry args={[0.08, 4, 4]} />
                <meshBasicMaterial color="green" />
              </mesh>
              <mesh position={spotlight.target}>
                <sphereGeometry args={[0.04, 4, 4]} />
                <meshBasicMaterial color="blue" />
              </mesh>
            </group>
          ))}
        </>
      )}
    </>
  );
}

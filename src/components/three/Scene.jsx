import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Stats, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import CameraRig from './CameraRig';
import Lights from './Lights';
import TechCity from './TechCity';
import ProcessorCore from './ProcessorCore';
import CircuitFloor from './CircuitFloor';
import Particles from './Particles';
import DataStreams from './DataStreams';

// Configuration
const CONFIG = {
  camera: {
    position: [0, 5, 10],
    fov: 45,
    near: 0.1,
    far: 100,
  },
  dpr: [1, 2],
  performance: {
    minFps: 30,
    adaptiveQuality: true,
  },
  postProcessing: {
    bloom: {
      intensity: 0.8,
      luminanceThreshold: 0.2,
      luminanceSmoothing: 0.9,
    },
    vignette: {
      darkness: 0.5,
      offset: 0.3,
    },
  },
};

// FPS Monitor Component (inline)
function FPSMonitor({ onPerformanceChange }) {
  const fpsHistory = useRef([]);

  useFrame((_, delta) => {
    const fps = 1 / delta;
    fpsHistory.current.push(fps);

    if (fpsHistory.current.length > 60) {
      fpsHistory.current.shift();
    }

    // Calculate average FPS
    const avgFps = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
    onPerformanceChange(avgFps);
  });

  return null;
}

// Loading Screen Component
function LoadingOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#000510',
        zIndex: 1000,
        color: '#45A9A9',
        fontFamily: 'monospace',
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 20 }}>INITIALIZING SYSTEM</div>
      <div
        style={{
          width: 200,
          height: 2,
          background: '#0F3040',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '60%',
            height: '100%',
            background: '#45A9A9',
            animation: 'loading 1.5s infinite',
          }}
        />
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

export default function Scene({
  debug = false,
  enablePostProcessing = true,
  enableOrbitControls = false,
  qualityLevel = 'high', // 'low', 'medium', 'high'
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [performanceLevel, setPerformanceLevel] = useState(qualityLevel);
  const [showStats, setShowStats] = useState(debug);

  // Simulate loading completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key.toLowerCase()) {
        case 'd':
          setShowStats((prev) => !prev);
          break;
        case 'q':
          setPerformanceLevel((prev) => {
            const levels = ['low', 'medium', 'high'];
            const currentIndex = levels.indexOf(prev);
            const nextIndex = (currentIndex + 1) % levels.length;
            console.log(`Quality: ${levels[nextIndex]}`);
            return levels[nextIndex];
          });
          break;
        case 'f':
          // Toggle fullscreen
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.body.requestFullscreen();
          }
          break;
        case 'r':
          // Reset camera
          if (window.__cameraRig) {
            window.__cameraRig.reset();
          }
          break;
        case '1':
          if (window.__cameraRig) window.__cameraRig.setPresetView('overview');
          break;
        case '2':
          if (window.__cameraRig) window.__cameraRig.setPresetView('closeup');
          break;
        case '3':
          if (window.__cameraRig) window.__cameraRig.setPresetView('top');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle performance adaptation
  const handlePerformanceChange = useCallback(
    (fps) => {
      if (!CONFIG.performance.adaptiveQuality) return;

      if (fps < CONFIG.performance.minFps && performanceLevel !== 'low') {
        setPerformanceLevel('low');
      } else if (fps > 50 && performanceLevel === 'low') {
        setPerformanceLevel('medium');
      } else if (fps > 55 && performanceLevel === 'medium') {
        setPerformanceLevel('high');
      }
    },
    [performanceLevel],
  );

  // Quality-based settings
  const qualitySettings = {
    low: {
      dpr: [0.5, 1],
      shadows: false,
      particles: 20,
      bloomIntensity: 0.3,
      pixelRatio: 0.5,
    },
    medium: {
      dpr: [1, 1.5],
      shadows: true,
      particles: 50,
      bloomIntensity: 0.6,
      pixelRatio: 0.75,
    },
    high: {
      dpr: [1, 2],
      shadows: true,
      particles: 100,
      bloomIntensity: 0.8,
      pixelRatio: 1,
    },
  };

  const currentQuality = qualitySettings[performanceLevel];

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#000510' }}>
      {/* Loading Screen */}
      {isLoading && <LoadingOverlay />}

      <Canvas
        camera={{
          position: CONFIG.camera.position,
          fov: CONFIG.camera.fov,
          near: CONFIG.camera.near,
          far: CONFIG.camera.far,
        }}
        dpr={currentQuality.dpr}
        shadows={currentQuality.shadows}
        gl={{
          antialias: performanceLevel !== 'low',
          alpha: false,
          stencil: false,
          depth: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#000510'));
          gl.setPixelRatio(Math.min(window.devicePixelRatio, currentQuality.pixelRatio * 2));
        }}
      >
        {/* FPS Monitor */}
        {debug && <FPSMonitor onPerformanceChange={handlePerformanceChange} />}

        {/* Stats */}
        {showStats && <Stats />}

        {/* Optional Orbit Controls for debugging */}
        {enableOrbitControls && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2.2}
          />
        )}

        <Suspense fallback={null}>
          {/* Lighting */}
          <Lights quality={performanceLevel} shadows={currentQuality.shadows} />

          {/* Camera System */}
          <CameraRig
            mobileOptimized={true}
            enableIdleRotation={true}
            enableZoom={true}
            baseZ={10}
            debug={debug}
          />

          {/* Environment */}
          <color attach="background" args={['#000510']} />
          <fog attach="fog" args={['#000510', 15, 40]} />

          {/* Scene Elements */}
          <group position={[0, 0, 0]}>
            {/* Floor Layer */}
            <CircuitFloor streamSpeed={0.4} nodeCount={performanceLevel === 'low' ? 10 : 20} />

            {/* City Layer */}
            <TechCity timeSpeed={0.5} />

            {/* Main Subject */}
            <group position={[0, 2, 0]}>
              <ProcessorCore />
            </group>

            {/* Ambient Effects */}
            <DataStreams count={currentQuality.particles} quality={performanceLevel} />

            <Particles count={currentQuality.particles} quality={performanceLevel} />
          </group>

          {/* Post Processing */}
          {enablePostProcessing && (
            <EffectComposer
              multisampling={performanceLevel !== 'low' ? 2 : 0}
              disableNormalPass={performanceLevel === 'low'}
            >
              <Bloom
                intensity={currentQuality.bloomIntensity}
                luminanceThreshold={CONFIG.postProcessing.bloom.luminanceThreshold}
                luminanceSmoothing={CONFIG.postProcessing.bloom.luminanceSmoothing}
                mipmapBlur={performanceLevel !== 'low'}
                blendFunction={BlendFunction.SCREEN}
              />

              {performanceLevel !== 'low' && (
                <>
                  <Vignette
                    darkness={CONFIG.postProcessing.vignette.darkness}
                    offset={CONFIG.postProcessing.vignette.offset}
                    eskil={false}
                    blendFunction={BlendFunction.NORMAL}
                  />

                  <Noise opacity={0.02} premultiply blendFunction={BlendFunction.NORMAL} />

                  {performanceLevel === 'high' && (
                    <ChromaticAberration
                      offset={new THREE.Vector2(0.002, 0.002)}
                      radialModulation={false}
                      modulationOffset={0.1}
                      blendFunction={BlendFunction.NORMAL}
                    />
                  )}
                </>
              )}
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      {debug && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            color: '#45A9A9',
            fontFamily: 'monospace',
            fontSize: 12,
            background: 'rgba(0,0,0,0.7)',
            padding: 10,
            borderRadius: 5,
            pointerEvents: 'none',
          }}
        >
          <div>Quality: {performanceLevel.toUpperCase()}</div>
          <div>Press D: Toggle Stats</div>
          <div>Press Q: Cycle Quality</div>
          <div>Press F: Fullscreen</div>
          <div>Press R: Reset Camera</div>
          <div>Press 1/2/3: Camera Views</div>
        </div>
      )}
    </div>
  );
}

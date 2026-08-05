import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
  Glitch,
  Scanline,
  DepthOfField,
  HueSaturation,
  BrightnessContrast,
  ToneMapping,
} from '@react-three/postprocessing';
import { BlendFunction, GlitchMode, ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';

// Configuration constants
const CONFIG = {
  bloom: {
    intensity: 0.8,
    luminanceThreshold: 0.2,
    luminanceSmoothing: 0.9,
    mipmapBlur: true,
    radius: 0.8,
    levels: 8,
  },
  vignette: {
    darkness: 0.5,
    offset: 0.3,
    eskil: false,
  },
  noise: {
    opacity: 0.02,
    premultiply: true,
  },
  chromaticAberration: {
    offset: new THREE.Vector2(0.002, 0.002),
    radialModulation: false,
    modulationOffset: 0.1,
  },
  glitch: {
    delay: new THREE.Vector2(1.5, 3.5),
    duration: new THREE.Vector2(0.6, 1.0),
    strength: new THREE.Vector2(0.3, 0.5),
    mode: GlitchMode.SPORADIC,
    ratio: 0.85,
  },
  scanline: {
    density: 0.5,
    opacity: 0.1,
  },
  hueSaturation: {
    hue: 0,
    saturation: 0.1,
  },
  brightnessContrast: {
    brightness: 0.05,
    contrast: 0.1,
  },
  depthOfField: {
    focusDistance: 0,
    focalLength: 0.02,
    bokehScale: 2,
  },
  toneMapping: {
    mode: ToneMappingMode.ACES_FILMIC,
    resolution: 256,
  },
};

export default function PostFX({
  quality = 'high', // 'low', 'medium', 'high'
  enableBloom = true,
  enableVignette = true,
  enableNoise = true,
  enableChromaticAberration = true,
  enableGlitch = false,
  enableScanlines = false,
  enableDepthOfField = false,
  enableHueSaturation = false,
  enableBrightnessContrast = false,
  enableToneMapping = true,
  bloomIntensity = CONFIG.bloom.intensity,
  vignetteDarkness = CONFIG.vignette.darkness,
  chromaticAberrationOffset = CONFIG.chromaticAberration.offset,
  glitchMode = 'off', // 'off', 'sporadic', 'constant'
  cinematicMode = false,
}) {
  const composerRef = useRef();
  const bloomRef = useRef();
  const { camera } = useThree();

  // Quality-based settings
  const qualitySettings = useMemo(
    () => ({
      low: {
        multisampling: 0,
        bloomIntensity: 0.4,
        bloomMipmapBlur: false,
        noiseOpacity: 0.01,
      },
      medium: {
        multisampling: 2,
        bloomIntensity: 0.6,
        bloomMipmapBlur: true,
        noiseOpacity: 0.015,
      },
      high: {
        multisampling: 4,
        bloomIntensity: 0.8,
        bloomMipmapBlur: true,
        noiseOpacity: 0.02,
      },
    }),
    [],
  );

  const currentQuality = qualitySettings[quality] || qualitySettings.high;

  // Handle glitch mode
  const glitchSettings = useMemo(() => {
    if (glitchMode === 'off') return null;

    return {
      ...CONFIG.glitch,
      mode: glitchMode === 'constant' ? GlitchMode.CONSTANT_MILD : GlitchMode.SPORADIC,
    };
  }, [glitchMode]);

  // Cinematic mode settings
  const cinematicSettings = useMemo(() => {
    if (!cinematicMode) return null;

    return {
      vignette: { darkness: 0.7, offset: 0.2 },
      noise: { opacity: 0.03 },
      brightnessContrast: { brightness: -0.05, contrast: 0.15 },
      chromaticAberration: { offset: new THREE.Vector2(0.003, 0.003) },
      bloom: { intensity: 1.0 },
    };
  }, [cinematicMode]);

  // Merge settings based on mode
  const settings = useMemo(() => {
    const base = {
      bloom: {
        intensity: bloomIntensity,
        mipmapBlur: currentQuality.bloomMipmapBlur,
      },
      noise: {
        opacity: currentQuality.noiseOpacity,
      },
      vignette: {
        darkness: vignetteDarkness,
      },
      chromaticAberration: {
        offset: chromaticAberrationOffset,
      },
    };

    if (cinematicMode && cinematicSettings) {
      return {
        bloom: { ...base.bloom, ...cinematicSettings.bloom },
        noise: { ...base.noise, ...cinematicSettings.noise },
        vignette: { ...base.vignette, ...cinematicSettings.vignette },
        chromaticAberration: {
          ...base.chromaticAberration,
          ...cinematicSettings.chromaticAberration,
        },
        brightnessContrast: cinematicSettings.brightnessContrast,
      };
    }

    return base;
  }, [
    bloomIntensity,
    vignetteDarkness,
    chromaticAberrationOffset,
    cinematicMode,
    cinematicSettings,
    currentQuality,
  ]);

  // Memoized effect for focus distance
  const depthOfFieldTarget = useMemo(() => new THREE.Vector3(0, 2, 0), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Animate bloom intensity
    if (bloomRef.current && enableBloom) {
      const pulse = Math.sin(t * 0.5) * 0.1;
      bloomRef.current.intensity = settings.bloom.intensity + pulse;
    }

    // Animate chromatic aberration
    if (enableChromaticAberration) {
      // This would need to be handled differently in practice
    }

    // Update depth of field focus
    if (enableDepthOfField && camera) {
      // Focus on center of scene
      depthOfFieldTarget.set(0, 2 + Math.sin(t * 0.2) * 0.5, 0);
    }
  });

  return (
    <EffectComposer
      ref={composerRef}
      multisampling={currentQuality.multisampling}
      disableNormalPass={quality === 'low'}
      stencilBuffer={enableDepthOfField}
      autoClear={true}
    >
      {/* Bloom - Glow effect */}
      {enableBloom && (
        <Bloom
          ref={bloomRef}
          intensity={settings.bloom.intensity}
          luminanceThreshold={CONFIG.bloom.luminanceThreshold}
          luminanceSmoothing={CONFIG.bloom.luminanceSmoothing}
          mipmapBlur={settings.bloom.mipmapBlur}
          radius={CONFIG.bloom.radius}
          levels={CONFIG.bloom.levels}
          blendFunction={BlendFunction.SCREEN}
        />
      )}

      {/* Tone Mapping - Color space conversion */}
      {enableToneMapping && (
        <ToneMapping
          mode={CONFIG.toneMapping.mode}
          resolution={CONFIG.toneMapping.resolution}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

      {/* Vignette - Darken edges */}
      {enableVignette && (
        <Vignette
          darkness={settings.vignette.darkness}
          offset={CONFIG.vignette.offset}
          eskil={CONFIG.vignette.eskil}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

      {/* Chromatic Aberration - Color fringing */}
      {enableChromaticAberration && quality !== 'low' && (
        <ChromaticAberration
          offset={settings.chromaticAberration.offset}
          radialModulation={CONFIG.chromaticAberration.radialModulation}
          modulationOffset={CONFIG.chromaticAberration.modulationOffset}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

      {/* Noise - Film grain */}
      {enableNoise && (
        <Noise
          opacity={settings.noise.opacity}
          premultiply={CONFIG.noise.premultiply}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

      {/* Glitch - Digital artifacts */}
      {enableGlitch && glitchSettings && (
        <Glitch
          delay={glitchSettings.delay}
          duration={glitchSettings.duration}
          strength={glitchSettings.strength}
          mode={glitchSettings.mode}
          ratio={glitchSettings.ratio}
          columns={0.05}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

      {/* Scanlines - CRT monitor effect */}
      {enableScanlines && (
        <Scanline
          density={CONFIG.scanline.density}
          opacity={CONFIG.scanline.opacity}
          blendFunction={BlendFunction.OVERLAY}
        />
      )}

      {/* Hue/Saturation - Color adjustment */}
      {enableHueSaturation && (
        <HueSaturation
          hue={CONFIG.hueSaturation.hue}
          saturation={CONFIG.hueSaturation.saturation}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

      {/* Brightness/Contrast */}
      {enableBrightnessContrast && (
        <BrightnessContrast
          brightness={
            settings.brightnessContrast?.brightness || CONFIG.brightnessContrast.brightness
          }
          contrast={settings.brightnessContrast?.contrast || CONFIG.brightnessContrast.contrast}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

      {/* Depth of Field - Blur based on distance */}
      {enableDepthOfField && quality === 'high' && (
        <DepthOfField
          focusDistance={CONFIG.depthOfField.focusDistance}
          focalLength={CONFIG.depthOfField.focalLength}
          bokehScale={CONFIG.depthOfField.bokehScale}
          target={depthOfFieldTarget}
        />
      )}
    </EffectComposer>
  );
}

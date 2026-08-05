import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Configuration constants
const CONFIG = {
  lerpSpeed: 0.02,
  lookAtSpeed: 0.05,
  baseY: 4,
  baseZ: 8,
  pointerXRange: 0.8,
  pointerYRange: 0.5,
  idleRotationSpeed: 0.1,
  idleTimeout: 3000,
  minY: 2,
  maxY: 6,
  minZ: 5,
  maxZ: 12,
  mobileSensitivity: 0.5,
  smoothing: 0.1,
};

export default function CameraRig({
  lerpSpeed = CONFIG.lerpSpeed,
  lookAtSpeed = CONFIG.lookAtSpeed,
  baseY = CONFIG.baseY,
  baseZ = CONFIG.baseZ,
  pointerXRange = CONFIG.pointerXRange,
  pointerYRange = CONFIG.pointerYRange,
  enableIdleRotation = true,
  enableZoom = true,
  mobileOptimized = false,
  debug = false,
}) {
  const { camera, pointer, gl } = useThree();

  // Refs for smooth animation
  const targetPosition = useRef(new THREE.Vector3(0, baseY, baseZ));
  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const smoothedPointer = useRef(new THREE.Vector2(0, 0));
  const currentZoom = useRef(baseZ);
  const lastPointerMove = useRef(0); // Initialize with 0 instead of Date.now()
  const idleAngle = useRef(0);
  const cameraShake = useRef(new THREE.Vector3(0, 0, 0));
  const isInitialized = useRef(false);

  // Initialize camera position and timestamp
  useEffect(() => {
    camera.position.set(0, baseY, baseZ);
    camera.lookAt(targetLookAt.current);
    lastPointerMove.current = Date.now(); // Set timestamp in useEffect
    isInitialized.current = true;
  }, [camera, baseY, baseZ]);

  // Handle scroll zoom
  const handleWheel = useCallback(
    (event) => {
      if (!enableZoom) return;

      event.preventDefault();
      const zoomDelta = event.deltaY * 0.01;
      currentZoom.current = Math.max(
        CONFIG.minZ,
        Math.min(CONFIG.maxZ, currentZoom.current + zoomDelta),
      );
    },
    [enableZoom],
  );

  // Handle touch for mobile
  const handleTouchMove = useCallback(
    (event) => {
      if (!mobileOptimized) return;

      const touch = event.touches[0];
      const x = (touch.clientX / window.innerWidth) * 2 - 1;
      const y = -(touch.clientY / window.innerHeight) * 2 + 1;

      smoothedPointer.current.set(x, y);
      lastPointerMove.current = Date.now();
    },
    [mobileOptimized],
  );

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        currentZoom.current = Math.min(CONFIG.maxZ, currentZoom.current + 2);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add event listeners
  useEffect(() => {
    const canvas = gl.domElement;

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    if (mobileOptimized) {
      canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      if (mobileOptimized) {
        canvas.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [gl, handleWheel, handleTouchMove, mobileOptimized]);

  useFrame(({ clock }, delta) => {
    // Skip if not initialized
    if (!isInitialized.current) return;

    const time = clock.getElapsedTime();
    const now = Date.now();

    // Smooth pointer movement
    if (!mobileOptimized) {
      smoothedPointer.current.lerp(new THREE.Vector2(pointer.x, pointer.y), CONFIG.smoothing);
      lastPointerMove.current = now;
    }

    // Check if pointer is idle
    const isIdle = enableIdleRotation && now - lastPointerMove.current > CONFIG.idleTimeout;

    // Calculate target position
    if (isIdle) {
      // Auto-rotate when idle
      idleAngle.current += delta * CONFIG.idleRotationSpeed;

      targetPosition.current.set(
        Math.sin(idleAngle.current) * 2,
        baseY + Math.sin(time * 0.5) * 0.3,
        baseZ,
      );

      targetLookAt.current.set(0, 1, 0);
    } else {
      // Follow pointer
      const { x, y } = smoothedPointer.current;
      const sensitivity = mobileOptimized ? CONFIG.mobileSensitivity : 1;

      targetPosition.current.set(
        x * pointerXRange * sensitivity,
        baseY + y * pointerYRange * sensitivity,
        currentZoom.current,
      );

      // Dynamic look target with slight offset
      targetLookAt.current.set(x * 0.5, 1 + y * 0.2, 0);
    }

    // Clamp camera bounds
    targetPosition.current.y = Math.max(
      CONFIG.minY,
      Math.min(CONFIG.maxY, targetPosition.current.y),
    );

    // Add subtle camera shake/breathing
    const breathe = Math.sin(time * 0.8) * 0.02;
    cameraShake.current.set(
      Math.sin(time * 1.3) * breathe,
      Math.cos(time * 1.7) * breathe,
      Math.sin(time * 1.1) * breathe,
    );

    // Smooth lerp to target position
    camera.position.lerp(
      targetPosition.current.clone().add(cameraShake.current),
      lerpSpeed * delta * 60, // Frame-rate independent
    );

    // Smooth look at
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);

    const targetDirection = targetLookAt.current.clone().sub(camera.position).normalize();

    const smoothedDirection = new THREE.Vector3()
      .copy(currentLookAt)
      .lerp(targetDirection, lookAtSpeed * delta * 60);

    const lookAtPoint = camera.position.clone().add(smoothedDirection.multiplyScalar(5));

    camera.lookAt(lookAtPoint);

    // Debug visualization
    if (debug) {
      console.log({
        position: camera.position.toArray(),
        target: targetPosition.current.toArray(),
        pointer: [smoothedPointer.current.x, smoothedPointer.current.y],
        zoom: currentZoom.current,
        idle: isIdle,
      });
    }
  });

  // Camera presets for different views
  const setPresetView = useCallback((preset) => {
    const presets = {
      overview: { x: 0, y: 8, z: 12 },
      closeup: { x: 0, y: 2, z: 5 },
      right: { x: 6, y: 4, z: 8 },
      left: { x: -6, y: 4, z: 8 },
      top: { x: 0, y: 10, z: 0.1 },
    };

    const view = presets[preset] || presets.overview;
    targetPosition.current.set(view.x, view.y, view.z);
    currentZoom.current = view.z;
  }, []);

  // Expose controls via ref or window for external access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__cameraRig = {
        setPresetView,
        reset: () => {
          targetPosition.current.set(0, baseY, baseZ);
          currentZoom.current = baseZ;
          smoothedPointer.current.set(0, 0);
          idleAngle.current = 0;
          lastPointerMove.current = Date.now();
        },
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete window.__cameraRig;
      }
    };
  }, [setPresetView, baseY, baseZ]);

  return null;
}

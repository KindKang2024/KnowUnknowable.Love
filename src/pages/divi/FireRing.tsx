import React, {useMemo, useRef} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import * as THREE from 'three';

// Shader object containing vertex and fragment shaders
const FireRingShader = {
  /** Vertex Shader */
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /** Fragment Shader */
  fragmentShader: `
    uniform vec2 iResolution;
    uniform float iTime;
    uniform vec3 iMouse;
    uniform float sizeScale; // Uniform to control the circle size
    uniform float opacity; // Add opacity uniform
    varying vec2 vUv;

    const float M_PI = 3.1415926535897932384626433832795;
    const float M_TWO_PI = 2.0 * M_PI;

    // Pseudo-random number generator
    float rand(vec2 n) {
      return fract(sin(dot(n, vec2(12.9898, 12.1414))) * 83758.5453);
    }

    // Noise function
    float noise(vec2 n) {
      const vec2 d = vec2(0.0, 1.0);
      vec2 b = floor(n);
      vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
      return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
    }

    // Color ramp function
    vec3 ramp(float t) {
      return t <= 0.5 ? vec3(1.0 - t * 1.4, 0.2, 1.05) / t : vec3(0.3 * (1.0 - t) * 2.0, 0.2, 1.05) / t;
    }

    // Polar coordinate mapping with size scaling
    vec2 polarMap(vec2 uv, float shift, float inner) {
      uv = vec2(0.5) - uv;
      float scaledLength = length(uv) / sizeScale; // Scale the radial distance
      float px = 1.0 - fract(atan(uv.y, uv.x) / M_TWO_PI + 0.25) + shift;
      float py = (scaledLength * (1.0 + inner * 2.0) - inner) * 2.0;
      return vec2(px, py);
    }

    // Fire effect
    float fire(vec2 n) {
      return noise(n) + noise(n * 2.1) * 0.6 + noise(n * 5.4) * 0.42;
    }

    // Shade calculation
    float shade(vec2 uv, float t) {
      uv.x += uv.y < 0.5 ? 23.0 + t * 0.035 : -11.0 + t * 0.03;
      uv.y = abs(uv.y - 0.5);
      uv.x *= 35.0;
      float q = fire(uv - t * 0.013) / 2.0;
      vec2 r = vec2(fire(uv + q / 2.0 + t - uv.x - uv.y), fire(uv + q - t));
      return pow((r.y + r.y) * max(0.0, uv.y) + 0.1, 4.0);
    }

    // Color calculation
    vec3 color(float grad) {
      float m2 = iMouse.z < 0.0001 ? 1.15 : iMouse.y * 3.0 / iResolution.y;
      grad = sqrt(grad);
      vec3 col = ramp(grad);
      col /= (m2 + max(vec3(0.0), col));
      return col;
    }

    void main() {
     float m1 = iMouse.z < 0.0001 ? 3.6 : iMouse.x * 5.0 / iResolution.x;
     float t = iTime;
     vec2 uv = vUv; // Use raw UVs without aspect adjustment
    
     float ff = 1.0 - uv.y;
     vec2 uv2 = vec2(uv.x, 1.0 - uv.y);
    
     uv = polarMap(uv, 1.3, m1);
     uv2 = polarMap(uv2, 1.3, m1);
    
     vec3 c1 = color(shade(uv, t)) * ff;
     vec3 c2 = color(shade(uv2, t)) * (1.0 - ff);
    
     vec3 col = c1 + c2;
     col = max(col, vec3(0.1, 0.05, 0.0));
     float alpha = smoothstep(0.0, 0.6, length(col));
     col *= alpha;
    
     gl_FragColor = vec4(col, alpha * opacity); // Multiply alpha by opacity uniform
    }
  `,
};

/**
 * FireRing Component
 * Renders a plane with a fire ring effect using a custom shader.
 */
export default function FireRing({ width = 1, opacity = 1 }: { width: number, opacity?: number }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const { size, mouse } = useThree();

  // Update uniforms each frame for animation and interaction
  useFrame(({ clock }) => {
    if (materialRef.current) {
      // @ts-ignore
      materialRef.current.uniforms.iTime.value = clock.getElapsedTime();
      const mx = (mouse.x + 1) / 2 * size.width;
      const my = (mouse.y + 1) / 2 * size.height;
      // @ts-ignore
      materialRef.current.uniforms.iMouse.value.set(mx, my, 0);
      // @ts-ignore
      materialRef.current.uniforms.iResolution.value.set(size.width, size.height);
      // @ts-ignore
      materialRef.current.uniforms.opacity.value = opacity;
    }
  });

  // Define uniforms with initial values
  const uniforms = useMemo(
    () => ({
      iResolution: { value: new THREE.Vector2() },
      iTime: { value: 0 },
      iMouse: { value: new THREE.Vector3() },
      sizeScale: { value: 0.5 }, // Scales the fire ring size (0.5 makes it smaller)
      opacity: { value: 1 }, // Add opacity uniform
    }),
    []
  );

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[width, width]} />
      <shaderMaterial
        ref={materialRef}
        transparent={true} // Enable transparency
        side={THREE.DoubleSide} // Render both sides of the plane
        uniforms={uniforms}
        depthWrite={false}
        vertexShader={FireRingShader.vertexShader}
        fragmentShader={FireRingShader.fragmentShader}
      />
    </mesh>
  );
}
import * as THREE from 'three';
import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';

const RingMaterial = ({ emissiveIntensity }) => {
  const materialRef = useRef();

  // Update the time uniform on each frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.emissiveIntensity.value =
        emissiveIntensity.get ? emissiveIntensity.get() : emissiveIntensity;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={{
        time: { value: 0 },
        emissiveIntensity: { value: 1.0 },
      }}
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform float time;
        uniform float emissiveIntensity;
        varying vec2 vUv;

        // 2D rotation matrix
        mat2 rotate2d(float angle) {
          return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        }

        void main() {
          // Rotate UV coordinates over time
          float angle = time * 0.5; // Adjust speed here
          vec2 rotatedUv = rotate2d(angle) * (vUv - 0.5) + 0.5;

          // Color gradient inspired by GLSL example
          vec3 color = vec3(rotatedUv.x, rotatedUv.y, 0.7 - rotatedUv.y * rotatedUv.x);

          // Radial intensity: brightest at the middle of the ring's width
          float radialIntensity = 1.0 - 2.0 * abs(vUv.y - 0.5);

          // Final color with intensity scaling
          vec3 finalColor = color * radialIntensity * emissiveIntensity;
          gl_FragColor = vec4(finalColor, radialIntensity * 0.8);
        }
      `}
      transparent
      side={THREE.DoubleSide}
    />
  );
};

// Ring component
function MyRing({ radius = 1, emissiveIntensity = 1 }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius, 64]} />
      <RingMaterial emissiveIntensity={emissiveIntensity} />
    </mesh>
  );
}

export default MyRing;
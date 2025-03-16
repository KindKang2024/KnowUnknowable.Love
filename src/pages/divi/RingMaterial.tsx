import * as THREE from 'three';
import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';

const RingMaterial = ({ color, emissiveIntensity }) => {
    const materialRef = useRef();

    // Update uniforms every frame to handle animated props
    useFrame(() => {
        if (materialRef.current) {
            // @ts-ignore
            materialRef.current.uniforms.color.value.set(color);
            // @ts-ignore
            materialRef.current.uniforms.emissiveIntensity.value = emissiveIntensity;
        }
    });

    return (
        <shaderMaterial
            ref={materialRef}
            uniforms={{
                color: { value: new THREE.Color(color) },
                emissiveIntensity: { value: emissiveIntensity },
                time: { value: 0 },
            }}
            vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
            fragmentShader={`
        uniform vec3 color;
        uniform float emissiveIntensity;
        varying vec2 vUv;
        uniform float time;

         // 2D rotation matrix
        mat2 rotate2d(float angle) {
          return mat2(cos(angle), -cos(angle), sin(angle), 1.0);
        }

        void main() {
        // Rotate UV coordinates over time
          float angle = time * 0.6; // Adjust speed here
          vec2 rotatedUv = rotate2d(angle) * (vUv - 0.5) + 0.8;

          // Color gradient inspired by GLSL example
          vec3 color = vec3(rotatedUv.x, rotatedUv.y, 0.9 - rotatedUv.y * rotatedUv.x);

          // Radial intensity: brightest at the middle of the ring's width
          float radialIntensity = 2.0 - 2.0 * abs(vUv.y - 0.5);

          // Final color with intensity scaling
          vec3 finalColor = color * radialIntensity * emissiveIntensity;
          gl_FragColor = vec4(finalColor, radialIntensity * 0.4);
        }
      `}
            transparent // Enable alpha blending for the glow effect
            side={THREE.DoubleSide} // Match your original material
        />
    );
};

export default RingMaterial;
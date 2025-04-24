import {useMemo, useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
    attribute float size;
    varying vec3 vColor;
    varying float vDistance;
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    
    void main() {
        vColor = color;
        vUv = uv;
        vPosition = position;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vDistance = -mvPosition.z;
        
        // Enhanced pulsing effect with multiple frequencies
        float mainPulse = sin(time * 2.0 + length(position)) * 0.5;
        float secondaryPulse = cos(time * 1.5 + position.x) * 0.1;
        float pulse = mainPulse + secondaryPulse + 1.0;
        
        // Organic movement
        vec3 pos = position;
        float movement = time * 0.5;
        pos.x += sin(movement + position.z * 0.5) * 0.05;
        pos.y += cos(movement + position.x * 0.5) * 0.05;
        pos.z += sin(movement + position.y * 0.5) * 0.05;
        
        mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        // Dynamic point size based on distance and pulse
        gl_PointSize = 6.0 * size * (100.0 / -mvPosition.z) * pulse;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    varying vec3 vColor;
    varying float vDistance;
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    
    // Hyperbolic glow function from Shadertoy
    float getGlow(float dist, float radius, float intensity) {
        return pow(radius/dist, intensity);
    }
    
    void main() {
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        float r = dot(cxy, cxy);
        if (r > 1.0) discard;
        
        // Base glow with hyperbolic falloff
        float glow = getGlow(r, 0.5, 1.5);
        
        // Outer glow with different falloff
        float outerGlow = getGlow(r, 0.7, 1.0) * 0.3;
        
        // Time-varying color effect
        float hueShift = sin(time * 0.2) * 0.1;
        vec3 shiftedColor = vColor;
        shiftedColor.r = vColor.r + hueShift;
        shiftedColor.g = vColor.g + hueShift * 0.5;
        shiftedColor.b = vColor.b - hueShift;
        
        // Enhance color with time-based pulsing
        vec3 finalColor = shiftedColor * (1.2 + sin(time * 0.5) * 0.1);
        
        // Add subtle color variation based on position
        vec3 positionColor = vec3(
            sin(vPosition.x * 2.0 + time) * 0.1,
            cos(vPosition.y * 2.0 + time) * 0.1,
            sin(vPosition.z * 2.0 + time) * 0.1
        );
        finalColor += positionColor;
        
        // Add blue-ish outer glow
        finalColor += vec3(0.2, 0.4, 0.8) * outerGlow;
        
        // Distance-based fade with smooth transition
        // float distanceFade = 1.0 - smoothstep(0.0, 50.0, vDistance);
        float distanceFade = 1.0 - smoothstep(0.0, 500.0, vDistance);
        float intensity = mix(0.7, 1.0, distanceFade);
        
        // Combine all effects
        float alpha = (glow + outerGlow) * distanceFade;
        gl_FragColor = vec4(finalColor * intensity, alpha);
    }
`;

const ParticleRing = ({ radius, color, thickness = 0.1, particleCount = 500 }) => {
  const materialRef = useRef();

  // Generate particle geometry
  const geometry = useMemo(() => {
    const positions = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      // Add some randomness to radius for more organic look
      const radiusVariation = radius ;
      const x = Math.cos(angle) * radiusVariation + (Math.random() - 0.5) * 1.8;
      const y = (Math.random() - 0.5) * thickness * 0.1;
      const z = Math.sin(angle) * radiusVariation + (Math.random() - 0.5) * 1.8;
// const radiusVariation = radius ;
// const x = Math.cos(angle) * radiusVariation + (Math.random() - 0.5) * 1.8;
// const z = Math.sin(angle) * radiusVariation + (Math.random() - 0.5) * 1.8;
// // const y = (Math.random() - 0.5) * thickness * 0.08 - radius * 0.05;
// // const y =  - radius * 0.5;
// const y = 0;
      positions.push(x, y, z);

      // Enhanced color variation
      const hue = (Math.random() - 0.5) * 0.1;
      const saturation = (Math.random() - 0.5) * 0.2;
      const lightness = (Math.random() - 0.5) * 0.2;
      const particleColor = new THREE.Color(color).offsetHSL(hue, saturation, lightness);
      colors.push(particleColor.r, particleColor.g, particleColor.b);

      // Varied particle sizes for more dynamic look
      sizes.push(Math.random() * 0.08 + 0.13);
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    return geom;
  }, [radius, color, thickness, particleCount]);

  // Update shader time uniform for animation
  useFrame((state) => {
    if (materialRef.current) {
      // @ts-ignore
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        uniforms={{ time: { value: 0 } }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleRing;
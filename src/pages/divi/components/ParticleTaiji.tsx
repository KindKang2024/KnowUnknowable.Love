import {useMemo, useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
    attribute float size;
    varying vec3 vColor;
    varying float vDistance;
    // varying vec2 vUv; // vUv seems unused in the fragment shader now
    varying vec3 vPosition;
    uniform float time;
    
    // Simple pulsing
    const float pulseSpeed = 1.5;
    const float pulseMagnitude = 0.15;

    void main() {
        vColor = color;
        // vUv = uv;
        vPosition = position;
        
        vec3 pos = position;
        
        // Optional: Add subtle organic movement back if desired
        float movement = time * 0.5; // Use speed from ParticleRing
        pos.x += sin(movement + position.z * 0.5) * 0.05; // Use factors from ParticleRing
        pos.y += cos(movement + position.x * 0.5) * 0.05; // Use factors from ParticleRing
        // pos.z += sin(movement + position.y * 0.5) * 0.05; // Don't modify z if using XZ plane primarily
        // OR, if still using XY plane, apply to z:
        pos.z += sin(movement + pos.y * 0.5) * 0.05; // Apply z-movement based on y
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vDistance = -mvPosition.z;
        
        // Enhanced pulsing effect from ParticleRing
        float mainPulse = sin(time * 2.0 + length(position)) * 0.5;
        float secondaryPulse = cos(time * 1.5 + position.x) * 0.1;
        float pulse = mainPulse + secondaryPulse + 1.0;
        
        // Point size based on distance and base size attribute + pulse
        // Adopt factors from ParticleRing
        gl_PointSize = 6.0 * size * (100.0 / -mvPosition.z) * pulse;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

// Adopt fragment shader from ParticleRing
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
        // Use the updated fade distance from previous step
        float distanceFade = 1.0 - smoothstep(2.0, 50.0, vDistance); 
        float intensity = mix(0.7, 1.0, distanceFade);
        
        // Combine all effects
        float alpha = (glow + outerGlow) * distanceFade;
        gl_FragColor = vec4(finalColor * intensity, alpha);
    }
`;

// Revert default props for Taiji
const ParticleTaiji = ({ 
    radius = 64, 
    thickness = 0.2, 
    particleCount = 100000,
    elevated = false // Add startHeight prop
}) => {
  const materialRef = useRef();
  const groupRef = useRef<THREE.Group>(null!); // Add ref for the group

  // Generate particle geometry for a Taiji symbol
  const geometry = useMemo(() => {
    const positions = [];
    const colors = [];
    const sizes = [];

    // 3-Strand Archimedean Spiral Parameters
    const numArms = 2;
    const numTurns = 8; // Adjust turns for desired winding per arm
    const maxThetaPerArm = numTurns * 2 * Math.PI;
    // Calculate 'b' so each arm spiral reaches roughly 'radius' at its maxTheta
    const b = radius / maxThetaPerArm;
    const baseColor = new THREE.Color("purple"); // Base color
    const particlesPerArm = Math.floor(particleCount / numArms);

    for (let armIndex = 0; armIndex < numArms; armIndex++) {
        const baseAngle = armIndex * (2 * Math.PI / numArms);

        for (let i = 0; i < particlesPerArm; i++) {
            const currentParticleIndex = armIndex * particlesPerArm + i;
            if (currentParticleIndex >= particleCount) break; // Handle non-perfect division

            // Use sqrt distribution along the length of *this specific arm*
            const fraction = particlesPerArm <= 1 ? 0 : i / (particlesPerArm - 1); // Fraction along this arm
            const thetaArm = maxThetaPerArm * Math.sqrt(fraction); // Angle along this arm

            // Calculate radius based on the angle along the arm
            const r = b * thetaArm;

            // Add randomness to the radius for thickness/spread
            const radiusVariation = r;
            // Calculate final angle including arm offset
            const finalTheta = baseAngle + thetaArm;

            // Calculate position in XZ plane
            const x = radiusVariation * Math.cos(finalTheta) + (Math.random() - 0.5) * 0.1;
            const z = radiusVariation * Math.sin(finalTheta) + (Math.random() - 0.5) * 0.1;

            // Calculate base height: decreases linearly as the arm spirals outwards
            const heightFraction = thetaArm / maxThetaPerArm;
            // const y = baseHeight + (Math.random() - 0.5) * thickness * 0.5;
            // const y = - armIndex * thetaArm / maxThetaPerArm * 10 ;
            const y = - i * 0.0006;

            // Base color
            const particleColor = baseColor.clone();

            // Add subtle color variations
            const hue = (Math.random() - 0.5) * 0.1;
            const saturation = (Math.random() - 0.5) * 0.2;
            const lightness = (Math.random() - 0.5) * 0.2;
            particleColor.offsetHSL(hue, saturation, lightness);

            positions.push(x, y, z);
            colors.push(particleColor.r, particleColor.g, particleColor.b);
            sizes.push(Math.random() * 0.08 + 0.13); // Size calculation
        }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    return geom;
  }, [radius, thickness, particleCount]); // Add startHeight to dependency array

  // Update shader time uniform for animation and rotate the group
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    // Update shader time
    if (materialRef.current) {
      // @ts-ignore
      materialRef.current.uniforms.time.value = elapsedTime;
    }
    // Rotate the whole group
    if (groupRef.current) {
      const rotationSpeed = -0.01; // Adjust speed as needed
      groupRef.current.rotation.y = elapsedTime * rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}> {/* Wrap points in a group */}
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
    </group>
  );
};

export default ParticleTaiji;
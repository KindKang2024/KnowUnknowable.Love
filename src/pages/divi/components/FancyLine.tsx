import React, {useMemo, useRef} from 'react';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';

const FancyLine = ({ start, end, colorStart = 'white', colorEnd = 'yellow', pulsateSpeed = 5.0 }) => {
    const lineRef = useRef<THREE.Line<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);

    // Geometry: Define the line's vertices and a parameter attribute
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array([
            start.x, start.y, start.z, // Start point
            end.x, end.y, end.z       // End point
        ]);
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Parameter along the line (0 at start, 1 at end)
        const lineParams = new Float32Array([0, 1]);
        geo.setAttribute('lineParam', new THREE.BufferAttribute(lineParams, 1));
        return geo;
    }, [start, end]);

    // Material: Custom shader with gradient and pulsation
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                colorStart: { value: new THREE.Color(colorStart) },
                colorEnd: { value: new THREE.Color(colorEnd) },
                time: { value: 0.0 },
                pulsateSpeed: { value: pulsateSpeed }
            },
            vertexShader: `
        attribute float lineParam;
        varying float vLineParam;
        void main() {
          vLineParam = lineParam;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 colorStart;
        uniform vec3 colorEnd;
        uniform float time;
        uniform float pulsateSpeed;
        varying float vLineParam;
        void main() {
          // Pulsation effect based on time and position
          float pulsate = 0.5 + 0.5 * sin(time * pulsateSpeed + vLineParam * 6.2831);
          // Gradient color from start to end
          vec3 color = mix(colorStart, colorEnd, vLineParam);
          // Apply pulsation to color intensity
          color *= pulsate;
          if (mod(vLineParam * 10.0, 1.0) > 0.5) discard;
          gl_FragColor = vec4(color, 1.0);
        }
      `
        });
    }, [colorStart, colorEnd]);

    // Animation: Update time uniform each frame
    useFrame(({ clock }) => {
        if (lineRef.current) {
            lineRef.current.material.uniforms.time.value = clock.getElapsedTime();

        }
    });

    // Render the line
    return <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />;
};

export default FancyLine;
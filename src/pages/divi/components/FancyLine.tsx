import React, {useEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';

const FancyLine = ({ start, end, colorStart = 'white', colorEnd = 'yellow', pulsateSpeed = 5.0 }) => {
    const lineRef = useRef<THREE.Line<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
    const materialRef = useRef<THREE.ShaderMaterial>();
    const geometryRef = useRef<THREE.BufferGeometry>();

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
                    float pulsate = 0.5 + 0.5 * sin(time * pulsateSpeed + vLineParam * 6.2831);
                    vec3 color = mix(colorStart, colorEnd, vLineParam);
                    color *= pulsate;
                    if (mod(vLineParam * 10.0, 1.0) > 0.5) discard;
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });
    }, [colorStart, colorEnd, pulsateSpeed]);

    // Create the line object once and store refs
    useEffect(() => {
        if (!lineRef.current) {
            const line = new THREE.Line(geometry, material);
            lineRef.current = line;
            materialRef.current = material;
            geometryRef.current = geometry;
        }

        // Update geometry when start/end points change
        if (geometryRef.current) {
            const positions = new Float32Array([
                start.x, start.y, start.z,
                end.x, end.y, end.z
            ]);
            geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometryRef.current.attributes.position.needsUpdate = true;
        }

        // Cleanup
        return () => {
            if (lineRef.current) {
                lineRef.current.geometry.dispose();
                lineRef.current.material.dispose();
                lineRef.current = null;
            }
        };
    }, [start, end, geometry, material]);

    // Animation: Update time uniform each frame
    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = clock.getElapsedTime();
        }
    });

    // Render the line
    return lineRef.current ? <primitive object={lineRef.current} /> : null;
};

export default FancyLine;
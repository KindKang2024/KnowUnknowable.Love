import React, {useMemo, useRef} from 'react';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';

const LaserBeam = ({ start, end }) => {
    const materialRef = useRef();
    const timeRef = useRef({ value: 0 });

    const geometry = useMemo(() => {
        const r = 0.05; // small radius
        const R = 0.2;  // large radius
        const halfAngle = THREE.MathUtils.degToRad(45);
        const geo = new THREE.PlaneGeometry(1, 1, 72, 20);
        const pos = geo.attributes.position;
        const uv = geo.attributes.uv;

        for (let i = 0; i < pos.count; i++) {
            const y = 1 - uv.getY(i);
            const radius = r + (R - r) * y;
            const x = pos.getX(i);
            pos.setXY(i, Math.cos(x * halfAngle) * radius, Math.sin(x * halfAngle) * radius);
        }

        // Calculate the direction and length
        const direction = new THREE.Vector3(
            end[0] - start[0],
            end[1] - start[1],
            end[2] - start[2]
        );
        const length = direction.length();

        // Scale the geometry to match the length
        geo.scale(1, length, 1);
        return geo;
    }, [start, end]);

    const material = useMemo(() => {
        const mat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(1, 0, 0), // Red laser
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });

        mat.onBeforeCompile = (shader) => {
            shader.uniforms.time = timeRef.current;
            shader.fragmentShader = `
                uniform float time;
                ${shader.fragmentShader}
            `.replace(
                `#include <color_fragment>`,
                `#include <color_fragment>
                float t = time;
                float mainWave = sin((vUv.x - t * 0.2) * 1.5 * 3.14159 * 2.0) * 0.5 + 0.5;
                mainWave = mainWave * 0.25 + 0.25;
                mainWave *= (sin(t * 3.14159 * 2.0 * 5.0) * 0.5 + 0.5) * 0.25 + 0.75;
                float sideLines = smoothstep(0.45, 0.5, abs(vUv.x - 0.5));
                float scanLineSin = abs(vUv.x - (sin(t * 2.7) * 0.5 + 0.5));
                float scanLine = smoothstep(0.01, 0., scanLineSin);
                float fadeOut = pow(vUv.y, 2.7);
                
                float a = 0.0;
                a = max(a, mainWave);
                a = max(a, sideLines);
                a = max(a, scanLine);
                
                diffuseColor.a = a * fadeOut;
                diffuseColor.rgb *= 1.5; // Make it brighter
                `
            );
        };
        mat.defines = { "USE_UV": "" };
        return mat;
    }, []);

    useFrame((state) => {
        timeRef.current.value = state.clock.getElapsedTime();
        material.needsUpdate = true;
    });

    // Calculate rotation to point from start to end
    const rotation = useMemo(() => {
        const direction = new THREE.Vector3(
            end[0] - start[0],
            end[1] - start[1],
            end[2] - start[2]
        ).normalize();

        const quaternion = new THREE.Quaternion();
        const up = new THREE.Vector3(0, 1, 0);
        quaternion.setFromUnitVectors(up, direction);
        const euler = new THREE.Euler();
        euler.setFromQuaternion(quaternion);
        return euler;
    }, [start, end]);

    return (
        <group position={start}>
            <mesh
                geometry={geometry}
                material={material}
                rotation={rotation}
            />
        </group>
    );
};

export default LaserBeam;
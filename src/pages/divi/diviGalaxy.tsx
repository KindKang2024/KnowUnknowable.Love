import React, {useEffect, useMemo, useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from "three";
import galaxyVertexShader from "@/utils/shaders/galaxy/vertex.glsl";
import galaxyFragmentShader from "@/utils/shaders/galaxy/fragment.glsl";
import {getPalette} from '@/utils/colorPalettes';

interface GalaxyProps {
    count?: number;
    size?: number;
    radius?: number;
    branches?: number;
    spin?: number;
    randomness?: number;
    randomnessPower?: number;
    palette?: string;
    spinSpeed?: number;
    insideColor?: string;
    outsideColor?: string;
}

const DiviGalaxy: React.FC<GalaxyProps> = ({
    count = 200000,
    size = 2,
    radius = 5,
    branches = 4,
    spin = 1,
    randomness = 0.3,
    randomnessPower = 3,
    palette = 'cosmic',
    spinSpeed = 0.5,
    insideColor = '#000000',
    outsideColor = '#ffffff',
}) => {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // Get the color palette
    const colorPalette = useMemo(() => getPalette(palette), [palette]);

    // Generate galaxy geometry using useMemo to avoid recreating on every render
    const { geometry, positions, colors, scales, randomnessAttr } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const randomnessAttr = new Float32Array(count * 3);

        const insideColorObj = new THREE.Color(colorPalette.galaxyInside);
        const outsideColorObj = new THREE.Color(colorPalette.galaxyOutside);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            const r = Math.random() * radius;
            const branchAngle = ((i % branches) / branches) * Math.PI * 2;

            // Create points in local space
            positions[i3] = Math.cos(branchAngle) * r;     // X coordinate
            positions[i3 + 1] = Math.sin(branchAngle) * r; // Y coordinate
            positions[i3 + 2] = 0;                         // Z coordinate

            const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
            const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
            const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

            randomnessAttr[i3] = randomX;
            randomnessAttr[i3 + 1] = randomY;
            randomnessAttr[i3 + 2] = randomZ;

            const mixedColor = insideColorObj.clone();
            mixedColor.lerp(outsideColorObj, r / radius);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;

            scales[i] = Math.random() * size;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
        geometry.setAttribute("aRandomness", new THREE.BufferAttribute(randomnessAttr, 3));

        return { geometry, positions, colors, scales, randomnessAttr };
    }, [count, radius, branches, randomness, randomnessPower, colorPalette]);

    // Add matrix transform handling
    useEffect(() => {
        if (pointsRef.current) {
            pointsRef.current.matrixAutoUpdate = true; // Enable matrix auto-update
        }
    }, []);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSize: { value: 20 * (window.devicePixelRatio || 1) },
    }), []);

    // Animation loop using useFrame
    useFrame((state, delta) => {
        if (uniforms) {
            uniforms.uTime.value += delta * spinSpeed;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry attach="geometry" {...geometry} />
            <shaderMaterial
                ref={materialRef}
                attach="material"
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors={true}
                vertexShader={galaxyVertexShader}
                fragmentShader={galaxyFragmentShader}
                uniforms={uniforms}
            />
        </points>
    );
};

export default DiviGalaxy;
import {useMemo, useRef} from 'react';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';
import {myFragmentShader, myVertexShader} from '../../utils/shaders';

type MilkyGalaxy4Props = {
    c: number;
    C: number;
    r: number;
    R: number;
}

const MilkyGalaxy4 = ({ c = 1.6, C = 40, r = 3, R = 6 }: MilkyGalaxy4Props) => {
    const meshRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // Create geometry and material
    const [geometry, material] = useMemo(() => {
        const totalCount = c + C;

        const positions = new Float32Array(totalCount * 3);
        const sizes = new Float32Array(totalCount);
        const shifts = new Float32Array(totalCount * 4);

        for (let i = 0; i < totalCount; i++) {
            // Calculate shifts
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const angle = (Math.random() * 0.9 + 0.1) * Math.PI * 0.1;
            const strength = Math.random() * 0.9 + 0.1;
            shifts[i * 4] = theta;
            shifts[i * 4 + 1] = phi;
            shifts[i * 4 + 2] = angle;
            shifts[i * 4 + 3] = strength;

            // Calculate sizes

            if (i < c) {
                sizes[i] = Math.random() * r + 0.1 * r;
                // Center sphere particles
                const radius = Math.random() * 0.5 + 0.6;
                const pos = new THREE.Vector3().randomDirection().multiplyScalar(radius);
                positions[i * 3] = pos.x;
                positions[i * 3 + 1] = pos.y;
                positions[i * 3 + 2] = pos.z;
            } else {
                sizes[i] = Math.random() * R + 0.1 * R;
                const rand = Math.pow(Math.random(), 1.5);
                const radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
                const pos = new THREE.Vector3().setFromCylindricalCoords(
                    radius,
                    Math.random() * 2 * Math.PI,
                    (Math.random() - 0.5) * 2
                );
                positions[i * 3] = pos.x;
                positions[i * 3 + 1] = pos.y;
                positions[i * 3 + 2] = pos.z;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('aShift', new THREE.BufferAttribute(shifts, 4));

        const material = new THREE.ShaderMaterial({
            vertexShader: myVertexShader,
            fragmentShader: myFragmentShader,
            uniforms: {
                uTime: { value: 0 }
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });

        return [geometry, material];
    }, []);

    // Animation
    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
        }
        if (meshRef.current) {
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.01;
        }
    });

    return (
        <points ref={meshRef} rotation-z={0.2} rotation-order="ZYX" scale={[2, 2, 2]}>
            <primitive object={geometry} attach="geometry" />
            <primitive object={material} ref={materialRef} attach="material" />
        </points>
    );
};

export default MilkyGalaxy4; 
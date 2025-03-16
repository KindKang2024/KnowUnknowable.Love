import {useMemo, useRef} from "react";
import * as THREE from "three";

interface TaijiProps {
    position?: [number, number, number];
    scale?: [number, number, number];
    materials: {
        standard: THREE.MeshStandardMaterial;
        black: THREE.MeshBasicMaterial;
        white: THREE.MeshBasicMaterial;
    };
    opacity?: number;
}

const Taiji = ({ position = [0, 0, 0], scale = [1, 1, 1], materials, opacity = 1 }: TaijiProps) => {
    const groupRef = useRef<THREE.Group>();

    // Memoize geometries
    const geometries = useMemo(() => ({
        halfCircle: new THREE.CircleGeometry(1.8, 32, 0, Math.PI),
        largeCircle: new THREE.CircleGeometry(0.9, 32),
        smallCircle: new THREE.CircleGeometry(0.25, 16)
    }), []);

    const groupPosition = useMemo(() => new THREE.Vector3(...position), [position]);
    const groupScale = useMemo(() => new THREE.Vector3(...scale), [scale]);

    return (
        <group ref={groupRef} position={groupPosition} scale={groupScale} rotation-x={-Math.PI / 2}>
            {/* Half circles */}
            <mesh geometry={geometries.halfCircle}>
                <primitive object={materials.black} opacity={opacity} />
            </mesh>
            <mesh rotation-z={Math.PI} geometry={geometries.halfCircle}>
                <primitive object={materials.white} opacity={opacity} />
            </mesh>

            {/* Large circles front */}
            <mesh position={[-0.9, 0, 0.01]} geometry={geometries.largeCircle}>
                <primitive object={materials.black} opacity={opacity} />
            </mesh>
            <mesh position={[0.9, 0, 0.01]} geometry={geometries.largeCircle}>
                <primitive object={materials.white} opacity={opacity} />
            </mesh>

            {/* Small circles front */}
            <mesh position={[0.9, 0, 0.02]} geometry={geometries.smallCircle}>
                <primitive object={materials.black} opacity={opacity} />
            </mesh>
            <mesh position={[-0.9, 0, 0.02]} geometry={geometries.smallCircle}>
                <primitive object={materials.white} opacity={opacity} />
            </mesh>

            {/* Large circles back */}
            <mesh position={[-0.9, 0, -0.01]} geometry={geometries.largeCircle}>
                <primitive object={materials.black} opacity={opacity} />
            </mesh>

            <mesh position={[0.9, 0, -0.01]} geometry={geometries.largeCircle}>
                <primitive object={materials.white} opacity={opacity} />
            </mesh>

            {/* Small circles back */}
            <mesh position={[0.9, 0, -0.02]} geometry={geometries.smallCircle}>
                <primitive object={materials.black} opacity={opacity} />
            </mesh>
            <mesh position={[-0.9, 0, -0.02]} geometry={geometries.smallCircle}>
                <primitive object={materials.white} opacity={opacity} />
            </mesh>
        </group>
    );
};

export default Taiji;

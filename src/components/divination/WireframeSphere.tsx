import React, {forwardRef, useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {Constants} from '@/stores/uiStore';

interface WireframeSphereProps {
    opacity?: number;
    onClick?: (event: any) => void;
}

const WireframeSphere = forwardRef<THREE.Mesh, WireframeSphereProps>(({ opacity = Constants.SPHERE_OPACITY, onClick }, ref) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.1; // Slow rotation
        }
    });

    return (
        <group ref={groupRef}>
            <mesh ref={ref} onClick={onClick}>
                <sphereGeometry args={[
                    Constants.SPHERE_RADIUS,
                    Constants.SPHERE_WIDTH_SEGMENTS,
                    Constants.SPHERE_HEIGHT_SEGMENTS
                ]} />
                <meshBasicMaterial
                    color={Constants.SPHERE_COLOR}
                    wireframe={true}
                    transparent={true}
                    opacity={opacity}
                />
            </mesh>
        </group>
    );
});

WireframeSphere.displayName = 'WireframeSphere';

export default WireframeSphere;
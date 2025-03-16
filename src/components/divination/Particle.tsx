import React, {useRef} from 'react';
import * as THREE from 'three';
import {UnitProps} from '@/stores/uiStore';


const Particle: React.FC<UnitProps> = ({ position, color = '#ffffff', opacity = 1 }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial
                color={color}
                transparent={true}
                opacity={opacity}
            />
        </mesh>
    );
};

export default Particle;
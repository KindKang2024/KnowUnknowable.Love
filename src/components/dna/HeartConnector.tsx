import * as THREE from 'three';
import {useMemo} from 'react';

interface HeartConnectorProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    color?: string;
    scale?: number;
    opacity?: number;
}

const HeartConnector: React.FC<HeartConnectorProps> = ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    color = '#ff69b4',
    scale = 1,
    opacity = 1
}) => {
    const heartShape = useMemo(() => {
        const shape = new THREE.Shape();
        const x = 0, y = 0;

        shape.moveTo(x, y);
        shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2.0, y + 3.0, x, y + 3.0);
        shape.bezierCurveTo(x - 2.0, y + 3.0, x - 2.5, y + 2.5, x, y);

        return shape;
    }, []);

    const geometry = useMemo(() => {
        return new THREE.ShapeGeometry(heartShape);
    }, [heartShape]);

    return (
        <group
            position={new THREE.Vector3(...position)}
            rotation={new THREE.Euler(...rotation)}
            scale={scale}
        >
            <mesh geometry={geometry}>
                <meshBasicMaterial
                    color={color}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={opacity}
                />
            </mesh>
        </group>
    );
};

export default HeartConnector; 
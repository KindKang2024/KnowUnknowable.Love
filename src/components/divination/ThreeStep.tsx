import {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {a, useSpring} from '@react-spring/three';
import {Text} from '@react-three/drei';
import {processGuaText} from '@/utils/commonUtils';

interface LadderStepOptions {
    xLength: number;
    yLength: number;
    zLength: number;
}

export interface ThreeStepProps {
    yaoText: string;
    stepNumber: number;
    stepSize: LadderStepOptions;
    position: [number, number, number];
    manifested: boolean;
    material: THREE.Material;
    isYang?: boolean;
}

export const ThreeStep: React.FC<ThreeStepProps> = ({
    yaoText,
    stepNumber,
    stepSize,
    position = [0, 0, 0],
    material,
    isYang,
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const dividerRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    // Hover animation
    const spring = useSpring({
        scale: hovered ? 1.1 : 1,
        rotationY: 0,
        config: { tension: 300, friction: 10 }
    });

    // Create a simple spring for the divider width
    const [{ dividerWidth }, api] = useSpring(() => ({
        dividerWidth: isYang ? 0 : stepSize.xLength * 0.3,
        config: { tension: 60, friction: 20, duration: 1200 }
    }));

    // Animate when isYin changes
    useEffect(() => {
        // Animate smoothly to the new state
        api.start({
            dividerWidth: isYang ? 0 : stepSize.xLength * 0.3,
            config: {
                tension: 120,
                friction: 14,
                duration: 800
            }
        });
    }, [isYang, api, stepSize.xLength]);

    return (
        <>
            <group key={stepNumber} ref={groupRef}>
                {/* Base yao - complete block */}
                <a.mesh
                    position={position}
                    scale={spring.scale}
                    rotation-y={spring.rotationY}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    receiveShadow
                >
                    <boxGeometry
                        args={[
                            stepSize.xLength,
                            stepSize.yLength / 2,
                            stepSize.zLength
                        ]}
                    />
                    <meshPhongMaterial {...material} />
                </a.mesh>

                {/* Divider block - controls visibility and width */}
                <a.mesh
                    ref={dividerRef}
                    position={position}
                    scale-x={dividerWidth.to(w => w / (stepSize.xLength * 0.3))}
                    scale-y={spring.scale}
                    scale-z={spring.scale}
                    rotation-y={spring.rotationY}
                    visible={dividerWidth.to(w => w > 0.001)}
                >
                    <boxGeometry
                        args={[
                            stepSize.xLength * 0.3, // Fixed maximum width
                            stepSize.yLength / 2 + 0.01,
                            stepSize.zLength + 0.01
                        ]}
                    />
                    <meshBasicMaterial
                        color="black"
                        transparent={true}
                    />
                </a.mesh>

                {/* Animated Text component */}
                <a.group
                    position-x={position[0] - stepSize.xLength / 2}
                    position-y={position[1] - stepSize.yLength / 2 + 0.10}
                    position-z={0}
                    scale={spring.scale}
                    rotation-y={spring.rotationY}
                >
                    <Text
                        fontSize={0.12}
                        color="white"
                        anchorX="left"
                        anchorY="top"
                    >
                        {processGuaText(yaoText, 1)}
                    </Text>
                </a.group>
            </group>
        </>
    );
};

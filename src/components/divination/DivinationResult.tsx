import {useMemo} from 'react';
import {Text} from '@react-three/drei';

interface DivinationResultProps {
    yaoWidth: number;
    yaoHeight: number;
    yaoSpacing: number;
    baguaSpacing: number;
    vMargin: number;
    hMargin: number;
    onYaoClick?: (index: number) => void;
}

export const DivinationResult = ({
    yaoWidth,
    yaoHeight,
    yaoSpacing,
    baguaSpacing,
    vMargin,
    hMargin,
    onYaoClick
}: DivinationResultProps) => {
    const yaoCount = 6;

    // Calculate total dimensions
    const width = 2 * hMargin + yaoWidth;
    const height = 2 * vMargin + baguaSpacing + yaoCount * yaoHeight + 4 * yaoSpacing;

    const yaoPositions = useMemo(() => {
        const startY = -height / 2 + vMargin + yaoHeight / 2;
        return Array.from({ length: yaoCount }, (_, i) =>
            [0, startY + i * (yaoHeight + baguaSpacing), 0]
        );
    }, [height, yaoHeight, baguaSpacing, vMargin]);

    return (
        <group position={[0, 0, 0]}>
            {/* Background */}
            <mesh position={[0, 0, -0.2]} receiveShadow>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial
                    color="gray"
                    opacity={0.9}
                    transparent
                    roughness={0.7}
                    metalness={0.3}
                />
            </mesh>

            {yaoPositions.map((position, index) => (
                <group
                    key={index}
                    position={position as [number, number, number]}
                    onClick={() => onYaoClick?.(index)}
                >
                    <Text
                        position={[-yaoWidth / 2 + hMargin, 0, 0]}
                        fontSize={0.5}
                        color="#CCCCCC"
                        anchorX="right"
                    >
                        {index + 1}
                    </Text>

                    {/* <group position={[-yaoWidth / 2 + hMargin - 0.5, 0, 0]}>
                        <DaoIsLoveDivision
                            count={49}
                            radius={0.2}
                            color="#FFFFFF"
                        />
                    </group> */}

                    <mesh position={[0, 0, -0.05]}>
                        <planeGeometry args={[yaoWidth - 2 * hMargin, yaoHeight]} />
                        <meshBasicMaterial color="lightgray" />
                    </mesh>
                </group>
            ))}
        </group>
    );
}; 
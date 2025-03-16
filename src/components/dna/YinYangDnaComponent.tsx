import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import StrandLine from './StrandLine';
import CodonComponent, {LinePattern} from './CodonComponent';

interface YinYangDnaProps {
    rotationSpeed?: number;
    radius?: number;
    height?: number;
    segments?: number;
    rotations?: number;
    lineWidth?: number;
    spacing?: {
        smallGap: number;
        mediumGap: number;
        largeGap: number;
    };
}

const YinYangDnaComponent: React.FC<YinYangDnaProps> = ({
    rotationSpeed = 0.01,
    radius = 8,
    height = 40,
    segments = 120,
    rotations = 3,
    lineWidth = 2.0,
    spacing = {
        smallGap: 0.3,
        mediumGap: 0.6,
        largeGap: 1.2
    }
}) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += rotationSpeed;
        }
    });

    const createHelixPoints = (startAngle: number) => {
        const points = [];
        for (let i = 0; i < segments; i++) {
            const angle = startAngle + (i / segments) * Math.PI * 2 * rotations;
            const y = (i / segments) * height - height / 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            points.push([x, y, z] as [number, number, number]);
        }
        return points;
    };

    // Create two helix paths with opposite starting angles
    const helix1Points = createHelixPoints(0);
    const helix2Points = createHelixPoints(Math.PI);

    // Example patterns for codons (you can modify these as needed)
    const codonPatterns: [LinePattern, LinePattern, LinePattern][] = [
        [LinePattern.OldYang, LinePattern.OldYang, LinePattern.OldYang],
        // [LinePattern.OldYin, LinePattern.OldYin, LinePattern.OldYin],
        // [LinePattern.OldYang, LinePattern.OldYin, LinePattern.YoungYang],
        // [LinePattern.YoungYin, LinePattern.OldYang, LinePattern.OldYin],
        // [LinePattern.OldYin, LinePattern.YoungYang, LinePattern.YoungYin],
        // Add more pattern combinations as needed
    ];

    // Calculate spacing between codons
    const codonSpacing = 3 * (2 + Math.ceil(spacing.largeGap));

    return (
        <group ref={groupRef}>
            {/* First helix strand (Yin) */}
            <StrandLine
                points={helix1Points}
                name="yin"
                lineWidth={lineWidth}
            />

            {/* Second helix strand (Yang) */}
            <StrandLine
                points={helix2Points}
                name="yang"
                lineWidth={lineWidth}
            />

            {/* Codons (groups of three connecting segments) */}
            {Array.from({ length: Math.floor(segments / codonSpacing) }).map((_, i) => {
                if (i % 4 !== 0) {
                    return null;
                }

                const startIndex = i * codonSpacing;
                const patternIndex = i % codonPatterns.length;

                return (
                    <CodonComponent
                        key={`codon-${i}`}
                        points1={helix1Points}
                        points2={helix2Points}
                        startIndex={startIndex}
                        patterns={codonPatterns[patternIndex]}
                        lineWidth={lineWidth * 0.8}
                        spacing={spacing}
                    />
                );
            })}
        </group>
    );
};

export default YinYangDnaComponent; 
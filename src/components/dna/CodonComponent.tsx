import {Line} from '@react-three/drei';
import * as THREE from 'three';

export enum LinePattern {
    OldYang = 'OldYang',     // —— ——  (two solid line)
    OldYin = 'OldYin',       // -- --  -- -- (four equal segments with gaps)
    YoungYang = 'YoungYang', // -- —— (broken to solid)
    YoungYin = 'YoungYin'    // —— -- (solid to broken)
}

interface SpacingConfig {
    smallGap: number;    // Gap within a broken line
    mediumGap: number;   // Gap between double lines
    largeGap: number;    // Gap between segments in a codon
}

const defaultSpacing: SpacingConfig = {
    smallGap: 0.3,      // Increased gap for better visibility
    mediumGap: 0.6,     // Increased proportionally
    largeGap: 1.2       // Increased proportionally
};

interface CodonSegmentProps {
    startPoint: [number, number, number];
    endPoint: [number, number, number];
    pattern: LinePattern;
    lineWidth?: number;
    opacity?: number;
    spacing?: SpacingConfig;
}

const CodonSegment: React.FC<CodonSegmentProps> = ({
    startPoint,
    endPoint,
    pattern,
    lineWidth = 2.0,    // Increased default line width
    opacity = 0.8,      // Increased opacity for bolder appearance
    spacing = defaultSpacing
}) => {
    const direction = new THREE.Vector3(
        endPoint[0] - startPoint[0],
        endPoint[1] - startPoint[1],
        endPoint[2] - startPoint[2]
    ).normalize();

    const createPoint = (base: [number, number, number], offset: number): [number, number, number] => {
        return [
            base[0] + direction.x * offset,
            base[1] + direction.y * offset,
            base[2] + direction.z * offset
        ] as [number, number, number];
    };

    const totalLength = new THREE.Vector3(
        endPoint[0] - startPoint[0],
        endPoint[1] - startPoint[1],
        endPoint[2] - startPoint[2]
    ).length();

    // For OldYin, we need to divide the total length into 4 segments with 3 gaps
    const segmentLength = (totalLength - spacing.mediumGap) / 2;
    const yinSegmentLength = (segmentLength - spacing.smallGap) / 2;

    switch (pattern) {
        case LinePattern.OldYang:
            const yang1End = createPoint(startPoint, segmentLength);
            const yang2Start = createPoint(yang1End, spacing.mediumGap);
            return (
                <>
                    <Line
                        points={[startPoint, yang1End]}
                        color="#f39c12"
                        lineWidth={lineWidth}
                        transparent
                        opacity={opacity}
                    />
                    <Line
                        points={[yang2Start, endPoint]}
                        color="#f39c12"
                        lineWidth={lineWidth}
                        transparent
                        opacity={opacity}
                    />
                </>
            );
        case LinePattern.OldYin:
            // Calculate points for four segments
            const yin1Start = startPoint;
            const yin1End = createPoint(startPoint, yinSegmentLength);
            const yin2Start = createPoint(yin1End, spacing.smallGap);
            const yin2End = createPoint(yin2Start, yinSegmentLength);

            const yin3Start = createPoint(yin2End, spacing.mediumGap);
            const yin3End = createPoint(yin3Start, yinSegmentLength);
            const yin4Start = createPoint(yin3End, spacing.smallGap);
            const yin4End = endPoint;

            return (
                <>
                    <Line
                        points={[yin1Start, yin1End]}
                        color="#4a90e2"
                        lineWidth={lineWidth}
                        transparent
                        opacity={opacity}
                    />
                    <Line
                        points={[yin2Start, yin2End]}
                        color="#4a90e2"
                        lineWidth={lineWidth}
                        transparent
                        opacity={opacity}
                    />
                    <Line
                        points={[yin3Start, yin3End]}
                        color="#4a90e2"
                        lineWidth={lineWidth}
                        transparent
                        opacity={opacity}
                    />
                    <Line
                        points={[yin4Start, yin4End]}
                        color="#4a90e2"
                        lineWidth={lineWidth}
                        transparent
                        opacity={opacity}
                    />
                </>
            );
        case LinePattern.YoungYang:
            const youngYang1Mid = createPoint(startPoint, segmentLength / 2);
            const youngYang1Start = createPoint(youngYang1Mid, -segmentLength / 4);
            const youngYang1End = createPoint(youngYang1Mid, segmentLength / 4);
            const youngYang2Start = createPoint(youngYang1End, spacing.mediumGap);
            return (
                <>
                    <Line
                        points={[youngYang1Start, youngYang1End]}
                        color="#4a90e2"
                        lineWidth={lineWidth}
                        transparent
                        opacity={opacity}
                    />
                    <Line
                        points={[youngYang2Start, endPoint]}
                        color="#f39c12"
                        lineWidth={lineWidth}
                        transparent
                        opacity={opacity}
                    />
                </>
            );
        case LinePattern.YoungYin:
            const youngYin1End = createPoint(startPoint, segmentLength);
            const youngYin2Mid = createPoint(endPoint, -segmentLength / 2);
            const youngYin2Start = createPoint(youngYin2Mid, -segmentLength / 4);
            const youngYin2End = createPoint(youngYin2Mid, segmentLength / 4);
            return (
                <>
                    <Line
                        points={[startPoint, youngYin1End]}
                        color="#f39c12"
                        lineWidth={lineWidth}
                        transparent
                        opacity={opacity}
                    />
                    <Line
                        points={[youngYin2Start, youngYin2End]}
                        color="#4a90e2"
                        lineWidth={lineWidth}
                        transparent
                        opacity={opacity}
                    />
                </>
            );
    }
};

interface CodonProps {
    points1: [number, number, number][];
    points2: [number, number, number][];
    startIndex: number;
    patterns: [LinePattern, LinePattern, LinePattern];
    lineWidth?: number;
    spacing?: SpacingConfig;
}

const CodonComponent: React.FC<CodonProps> = ({
    points1,
    points2,
    startIndex,
    patterns,
    lineWidth = 1,
    spacing = defaultSpacing
}) => {
    return (
        <group>
            {[0, 1, 2].map((offset) => {
                const idx = startIndex + offset * (2 + Math.ceil(spacing.largeGap));
                if (idx >= points1.length) return null;

                return (
                    <CodonSegment
                        key={`codon-segment-${idx}`}
                        startPoint={points1[idx]}
                        endPoint={points2[idx]}
                        pattern={patterns[offset]}
                        lineWidth={lineWidth}
                        spacing={spacing}
                    />
                );
            })}
        </group>
    );
};

export default CodonComponent; 
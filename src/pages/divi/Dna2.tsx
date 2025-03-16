import * as THREE from 'three';
import {useMemo, useRef} from 'react';
import {useFrame} from '@react-three/fiber';

interface DNAProps {
    length?: number;
    density?: number;
    ladderspace?: number;
    scale?: number;
    rotationSpeed?: number;
    color?: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
}

interface DNAData {
    helixPositions: Float32Array;
    ladderPositions: Float32Array;
}

const initializeDNA = (
    length: number,
    density: number,
    ladderspace: number,
    scale: number
): DNAData => {
    // Helix parameters
    const numHelix = length * density; // Total helix points
    const totalTurns = 2.5; // Number of full turns over the length
    const totalAngle = totalTurns * 360; // Total rotation in degrees
    const radius = 5 * scale; // Helix radius, adjustable

    const helixPositions = new Float32Array(numHelix * 3);

    for (let i = 0; i < numHelix; i++) {
        const t = i / numHelix; // Normalized position [0, 1]
        const y = (t * length - length / 2) * scale; // Y from -length/2 to length/2
        const angle = t * totalAngle + (i % 2) * 180; // Angle with 180° offset for double helix
        const rad = angle * (Math.PI / 180); // Convert to radians

        const baseX = radius * Math.cos(rad);
        const baseZ = radius * Math.sin(rad);

        // Random offsets for organic look
        const random = Math.random();
        const diffX = (Math.random() * 2 - 1) * random * 0.5 * scale;
        const diffY = (Math.random() * 2 - 1) * random * 0.5 * scale;
        const diffZ = (Math.random() * 2 - 1) * random * 0.5 * scale;

        helixPositions[i * 3] = baseX + diffX;
        helixPositions[i * 3 + 1] = y + diffY;
        helixPositions[i * 3 + 2] = baseZ + diffZ;
    }

    // Ladder parameters
    const numLineSpace = Math.floor(length / ladderspace); // Number of ladder segments
    const numLine = density * 2; // Points per ladder rung
    const ladderPositions = new Float32Array(numLineSpace * numLine * 3);

    for (let j = 0; j < numLineSpace; j++) {
        const t = j / numLineSpace;
        const y = (t * length - length / 2) * scale;
        const angle = t * totalAngle; // Align with helix angle at this y
        const rad = angle * (Math.PI / 180);

        for (let k = 0; k < numLine; k++) {
            const u = numLine > 1 ? k / (numLine - 1) : 0; // Normalized [0, 1]
            const r = (u * 2 - 1) * radius; // Radius from -radius to radius
            const baseX = r * Math.cos(rad);
            const baseZ = r * Math.sin(rad);

            // Smaller random offsets for ladder
            const random = Math.random();
            const diffX = (Math.random() * 2 - 1) * random * 0.2 * scale;
            const diffY = (Math.random() * 2 - 1) * random * 0.2 * scale;
            const diffZ = (Math.random() * 2 - 1) * random * 0.2 * scale;

            const index = j * numLine + k;
            ladderPositions[index * 3] = baseX + diffX;
            ladderPositions[index * 3 + 1] = y + diffY;
            ladderPositions[index * 3 + 2] = baseZ + diffZ;
        }
    }

    return { helixPositions, ladderPositions };
};

const DNA: React.FC<DNAProps> = ({
    length = 300,
    density = 20,
    ladderspace = 4,
    scale = 1,
    rotationSpeed = 0.002,
    color = '#0000ff', // Start with blue as a nod to a typical original
    position = [0, 0, 0],
    rotation = [0, 0, 0]
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const doubleHelixRef = useRef<THREE.Points>(null);
    const ladderRef = useRef<THREE.Points>(null);

    // Initialize geometry data
    const { helixPositions, ladderPositions } = useMemo(
        () => initializeDNA(length, density, ladderspace, scale),
        [length, density, ladderspace, scale]
    );

    // Color animation state
    const colorState = useRef({
        r: 0,    // Current red
        g: 0,    // Current green
        b: 255,  // Current blue (starting with blue)
        rs: 0,   // Red step
        gs: 0,   // Green step
        bs: 0,   // Blue step
        rt: 0,   // Target red
        gt: 0,   // Target green
        bt: 255  // Target blue
    });

    // Random integer helper function
    const randint = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    // Animation
    useFrame(() => {
        const c = colorState.current;

        // Update current colors toward targets
        if (Math.abs(c.r - c.rt) >= 5) c.r += c.rs;
        if (Math.abs(c.g - c.gt) >= 5) c.g += c.gs;
        if (Math.abs(c.b - c.bt) >= 5) c.b += c.bs;

        // If close to target, pick a new random target
        if (
            Math.abs(c.r - c.rt) < 5 &&
            Math.abs(c.g - c.gt) < 5 &&
            Math.abs(c.b - c.bt) < 5
        ) {
            c.rt = randint(0, 255);
            c.gt = randint(0, 255);
            c.bt = randint(0, 255);
            const divisor = 50; // Controls speed of transition
            c.rs = (c.rt > c.r ? 1 : -1) * randint(5, 45) / divisor;
            c.gs = (c.gt > c.g ? 1 : -1) * randint(5, 45) / divisor;
            c.bs = (c.bt > c.b ? 1 : -1) * randint(5, 45) / divisor;
        }

        // Apply colors to materials
        if (doubleHelixRef.current && ladderRef.current) {
            const material1 = doubleHelixRef.current.material as THREE.PointsMaterial;
            const material2 = ladderRef.current.material as THREE.PointsMaterial;
            const r = Math.round(c.r);
            const g = Math.round(c.g);
            const b = Math.round(c.b);
            material1.color.setRGB(r / 255, g / 255, b / 255);
            material2.color.setRGB(r / 255, g / 255, b / 255);
        }

        // Rotate the DNA
        // if (groupRef.current) {
        //     groupRef.current.rotation.y += rotationSpeed;
        // }
    });

    return (
        <group ref={groupRef} position={position} rotation={rotation}>
            {/* Double Helix Points */}
            <points ref={doubleHelixRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={helixPositions}
                        itemSize={3}
                        count={helixPositions.length / 3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.5 * scale}
                    color={color}
                    sizeAttenuation={true}
                />
            </points>

            {/* Ladder Points */}
            <points ref={ladderRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={ladderPositions}
                        itemSize={3}
                        count={ladderPositions.length / 3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.3 * scale}
                    color={color}
                    sizeAttenuation={true}
                />
            </points>
        </group>
    );
};

export default DNA;
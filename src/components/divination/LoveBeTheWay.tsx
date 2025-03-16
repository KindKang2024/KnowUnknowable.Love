import {useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import {ThreeStep} from './ThreeStep';
import {Text} from '@react-three/drei';
import {Gua} from '@/stores/Gua';
import {useIChing} from '@/i18n/DataProvider';
import {useUIStore} from '@/stores/uiStore';

interface ThreeStepProps {
    gua: Gua;
    steps: number;
    scale?: number;
    targetStepPosition: [number, number, number];
    startStepPosition: [number, number, number];

    configSize?: {
        xLength: number;
        yLength: number;
        zLength: number;
        extraGap: number;
    };
}

// Calculate position for each step in the ladder
const calculateStepPosition = (
    startStepPosition: [number, number, number],
    dstStepPosition: [number, number, number],
    stepNumber: number,
    totalSteps: number,
    configSize: {
        xLength: number;
        yLength: number;
        zLength: number;
        // yGap: number;
        extraGap: number;
    },
): [number, number, number] => {
    // Keep x constant as we want steps to align vertically

    // Calculate the total distance to cover
    // const totalXGap = Math.abs(dstStepPosition[0] - startStepPosition[0]) - configSize.xLength * (totalSteps);
    const totalYGap = Math.abs(dstStepPosition[1] - startStepPosition[1]) - configSize.yLength * (totalSteps); // Distance from initial Y to 0
    // const totalZGap = Math.abs(dstStepPosition[2] - startStepPosition[2]) - configSize.zLength * (totalSteps); // Distance from initial Z to 0

    // Calculate the increment per step
    // const xGapIncrement = totalXGap / (totalSteps - 1);
    const yGapIncrement = totalYGap / (totalSteps - 1); // Add 1 to account for final position
    // const zGapIncrement = totalZGap / (totalSteps - 1);

    // Calculate new position
    // y increases (moves up) with each step
    // z decreases (moves closer) with each step
    const extraGap = (stepNumber >= 4) ? configSize.extraGap : 0;

    // const x = startStepPosition[0] + (xGapIncrement + configSize.xLength) * (stepNumber - 1);
    const y = startStepPosition[1] + extraGap + (yGapIncrement + configSize.yLength) * (stepNumber - 1);
    // const z = startStepPosition[2] + (zGapIncrement + configSize.zLength) * (stepNumber - 1);

    return [startStepPosition[0], y, startStepPosition[2]];
};

export const LoveBeTheWay: React.FC<ThreeStepProps> = ({
    gua,
    scale = 1,
    targetStepPosition,
    startStepPosition,
    configSize
}) => {
    const iChing = useIChing();

    const allPossibleEvolutions = useMemo(() => {
        return Gua.getAllPossibleEvolutions(gua);
    }, [gua]);

    const allPossibleBinary = useMemo(() => {
        return gua.getAllPossibleBinary();
    }, [gua]);

    // Add state to control all yao states
    const [evolutionStates, setEvolutionStates] = useState<boolean[]>(allPossibleEvolutions[0]);
    const [binary, setBinary] = useState<string>(allPossibleBinary[0]);

    const { focusedGuaBinary, speedMode } = useUIStore();
    const currentIndex = useRef(0);
    const intervalRef = useRef(null);
    const lastFocusTimeRef = useRef<number | null>(null);
    const previousFocusedRef = useRef(focusedGuaBinary);

    // Handle focused gua binary changes
    useEffect(() => {
        if (focusedGuaBinary) {
            const focusedIndex = allPossibleBinary.findIndex(bin => bin === focusedGuaBinary);
            if (focusedIndex !== -1) {
                setEvolutionStates(allPossibleEvolutions[focusedIndex]);
                setBinary(focusedGuaBinary);
                currentIndex.current = focusedIndex;
            }
        }

        // When focus is removed, set the last focus time
        if (previousFocusedRef.current && !focusedGuaBinary) {
            console.log("Focus removed, setting last focus time");
            lastFocusTimeRef.current = Date.now();
        }

        previousFocusedRef.current = focusedGuaBinary;
    }, [focusedGuaBinary, allPossibleBinary, allPossibleEvolutions]);

    // Main animation effect with interval
    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // // Don't start animation if we have a focused binary
        // if (focusedGuaBinary) {
        //     return;
        // }
        const intervalTime = speedMode === 'normal' ? 8000 : (speedMode === 'fast' ? 4000 : 1000);
        const focusPause = Math.min(intervalTime * 4, 10000);

        // Set up interval to check periodically
        intervalRef.current = setInterval(() => {
            const now = Date.now();

            // If we're within 10 seconds of last focus, don't update
            if (lastFocusTimeRef.current && now - lastFocusTimeRef.current < focusPause) {
                console.log("Within pause window, waiting...");
                return;
            }

            // If we're past the pause window, clear the timestamp
            if (lastFocusTimeRef.current && now - lastFocusTimeRef.current >= focusPause) {
                console.log("Pause window ended, resuming animation");
                lastFocusTimeRef.current = null;
            }

            // Update the animation state
            setEvolutionStates(allPossibleEvolutions[currentIndex.current]);
            setBinary(allPossibleBinary[currentIndex.current]);
            currentIndex.current = (currentIndex.current + 1) % allPossibleEvolutions.length;

        }, intervalTime);

        // Cleanup function
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [focusedGuaBinary, speedMode, allPossibleEvolutions, allPossibleBinary]);

    const positions = useMemo(() => {
        return Array.from({ length: 6 }, (_, index) => calculateStepPosition(startStepPosition, targetStepPosition, index + 1, 6, configSize));
    }, [startStepPosition, targetStepPosition, configSize]);

    const material = useMemo(() => {
        return new THREE.MeshPhongMaterial({
            color: "#00ff00",
            emissive: "#ffff00",
            emissiveIntensity: 1.2,
            transparent: true,
        });
    }, []);

    return (
        <group scale={scale} key={"love-be-the-way"}>
            <group position={[1.8, 0, 0]}>
                <Text fontSize={1} color="white" anchorX="left" anchorY="middle">
                    {iChing[binary].name}
                </Text>
                <Text fontSize={0.25}
                    position={[0.1, -0.7, 0]}
                    color="white" anchorX="left" anchorY="middle">
                    {Gua.binaryToDecimalString(binary)}
                </Text>
                <Text fontSize={0.1}
                    position={[0.65, -0.65, 0]}
                    color="white" anchorX="left" anchorY="middle">
                    {Gua.getGeneticCodeFromBinary(binary)}
                </Text>
                <Text fontSize={0.1}
                    position={[0.5, -0.75, 0]}
                    color="white" anchorX="left" anchorY="middle">
                    {binary}
                </Text>
            </group>

            {gua.yaos.map((yao, index) => (
                <ThreeStep
                    manifested={false}
                    yaoText={iChing[binary].yao_ci[index]}
                    material={material}
                    key={index}
                    stepNumber={index + 1}
                    stepSize={{ ...configSize }}
                    position={positions[index]}
                    isYang={evolutionStates[index]} // Pass the controlled state
                />
            ))}
        </group>
    );
};
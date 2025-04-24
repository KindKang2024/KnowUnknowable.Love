import {useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import {ThreeStep} from './ThreeStep';
import {Text} from '@react-three/drei';
import {Gua} from '@/stores/Gua';
import {useIChing} from '@/i18n/DataProvider';
import {useUIStore} from '@/stores/uiStore';
import {processGuaText} from '@/utils/commonUtils';

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

    const { focusedGuaBinary } = useUIStore();

    // Handle focused gua binary changes
    useEffect(() => {
        if (focusedGuaBinary) {
            const focusedIndex = allPossibleBinary.findIndex(bin => bin === focusedGuaBinary);
            if (focusedIndex !== -1) {
                setEvolutionStates(allPossibleEvolutions[focusedIndex]);
                setBinary(focusedGuaBinary);
            }
        }
    }, [focusedGuaBinary, allPossibleBinary, allPossibleEvolutions]);

    // const iterateIndex = useRef(0);
    // useEffect(() => {
    //     const allKeys = Object.keys(iChing).filter(key => key.length === 6);
    //     // iterate iChing every 1 second
    //     const interval = setInterval(() => {
    //         setBinary(allKeys[iterateIndex.current]);
    //         // setBinary("101100");
    //         // setBinary("111100");
    //         iterateIndex.current = (iterateIndex.current + 1) % allKeys.length;
    //     }, 100);
    //     return () => clearInterval(interval);
    // }, [binary]);

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



            <group position={[-1.12, 1.5, 0]}>

                <Text
                    position={[0.0, 0.14, 0]}
                    fontSize={0.16}
                    color="red"
                    anchorX="left"
                    anchorY="top"
                >
                    {processGuaText(iChing[binary].gua_ci, 1)}
                </Text>


                <group position={[0.88, 0.3, 0]}>
                    <Text fontSize={0.4} color="white" anchorX="left" anchorY="middle">
                        {iChing[binary].name}
                    </Text>



                    <group position={[-0.9, 0.7, 0]}>
                        <Text fontSize={0.38}
                            position={[0.0, -0.7, 0]}
                            color="white" anchorX="left" anchorY="middle">
                            {Gua.binaryToDecimalString(binary, true)}
                        </Text>

                        <Text fontSize={0.09}
                            position={[0.49, -0.60, 0]}
                            color="white" anchorX="left" anchorY="middle">
                            {Gua.getGeneticCodeFromBinary(binary)}
                        </Text>

                        <Text fontSize={0.09}
                            position={[0.49, -0.70, 0]}
                            color="white" anchorX="left" anchorY="middle">
                            {Gua.binaryToBinaryDecimalString(binary, true)}
                        </Text>


                        <Text fontSize={0.1}
                            position={[0.48, -0.80, 0]}
                            color="white" anchorX="left" anchorY="middle">
                            {binary}
                        </Text>
                    </group>
                </group>
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
                    isYang={evolutionStates[index]}
                />
            ))}
        </group>
    );
};
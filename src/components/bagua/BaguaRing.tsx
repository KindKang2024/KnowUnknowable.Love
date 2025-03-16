import {CompassRingData} from "@/i18n/types";
import {useEffect, useMemo, useRef} from "react";
import * as THREE from "three";
import {Text, Text3D} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";


interface BaguaRingProps extends CompassRingData {
    materials: {
        standard: THREE.MeshStandardMaterial;
        black: THREE.MeshBasicMaterial;
        white: THREE.MeshBasicMaterial;
        text3d: THREE.MeshStandardMaterial;
    };
    ringIndex?: number;
    textUse3d?: boolean;
}

// Ring function
const BaguaRing = ({
    materials,
    ringIndex,
    textUse3d = false,
    ...props
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const lineInstancesRef = useRef<THREE.InstancedMesh>(null);
    const matrix = useMemo(() => new THREE.Matrix4(), []);

    // Animation
    useFrame((state, delta) => {
        if (groupRef.current) {
            // Rotation
            if (props.direction && props.duration) {
                const rotationSpeed = (Math.PI * 2) / props.duration;
                groupRef.current.rotation.z += rotationSpeed * props.direction * delta;
            }
        }
    });

    // Memoize line positions and transformations
    const lineInstances = useMemo(() => {
        return Array.from({ length: props.lineNum }, (_, idx) => {
            const r = props.innerRing + props.outerRing / 2;
            const rad = ((2.0 * Math.PI) / props.lineNum) * idx;
            const x = Math.cos(rad) * r;
            const y = Math.sin(rad) * r;

            matrix.makeRotationZ(rad + Math.PI / 2);
            matrix.setPosition(x, y, 0);

            return matrix.clone();
        });
    }, [props.lineNum, props.innerRing, props.outerRing, matrix]);

    // Memoize text positions
    const textData = useMemo(() => {
        return Array.from({ length: props.lineNum }, (_, idx) => {
            const r = props.innerRing + props.outerRing / 2;
            const rad = ((2 * Math.PI) / props.lineNum) * idx + Math.PI / props.lineNum;
            return {
                position: new THREE.Vector3(
                    Math.cos(rad) * r,
                    Math.sin(rad) * r,
                    0
                ),
                rotation: new THREE.Euler(0, 0, rad - Math.PI / 2),
                text: props.ringItems[idx % props.ringItems.length].symbol
            };
        });
    }, [props.lineNum, props.innerRing, props.outerRing, props.ringItems]);

    // Update instance matrices
    useEffect(() => {
        if (lineInstancesRef.current) {
            lineInstances.forEach((matrix, i) => {
                lineInstancesRef.current.setMatrixAt(i, matrix);
            });
            lineInstancesRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [lineInstances]);

    return (
        <group
            ref={groupRef}
            key={props.ringIndex}
            rotation-x={-Math.PI / 2}
        >
            {/* Rings */}
            <mesh>
                <ringGeometry args={[props.innerRing, props.innerRing + props.circleWidth[0], 32]} />
                <primitive object={materials.standard} />
            </mesh>

            <mesh>
                <ringGeometry args={[props.innerRing + props.outerRing, props.innerRing + props.outerRing + props.circleWidth[1], 32]} />
                <primitive object={materials.standard} />
            </mesh>

            {/* Lines using instanced mesh */}
            <instancedMesh
                ref={lineInstancesRef}
                args={[null, null, props.lineNum]}
                material={materials.standard}
            >
                <planeGeometry args={[props.lineWidth, props.outerRing]} />
            </instancedMesh>

            {/* Text elements */}
            {textData.map((data, idx) => (
                textUse3d ?
                    (<Text3D
                        key={`bagua-ring-3d-${data.text}-${idx}`}
                        position={data.position}
                        rotation={data.rotation}
                        castShadow={false}
                        receiveShadow={false}

                        // font={"./fonts/LXGW WenKai TC_Regular.json"}
                        font={"./fonts/LXGW WenKai TC_Regular_Full.json"}
                        size={0.62}
                    >
                        {data.text}
                        <primitive object={props.materials.text3d} attach="material" />
                    </Text3D>) :
                    (<Text
                        key={`bagua-ring-2d-${data.text}-${idx}`}
                        position={data.position}
                        rotation={data.rotation}
                        fontSize={props.size}
                        color={0xffffff}
                        maxWidth={10}
                        textAlign="center"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {data.text}
                    </Text>)
            ))}
        </group>
    );
};

export default BaguaRing;
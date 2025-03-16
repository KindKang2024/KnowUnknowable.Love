import {Suspense, useMemo, useRef, useState} from 'react'
import {Canvas, extend} from '@react-three/fiber'
import {Stars} from '@react-three/drei'
import * as THREE from 'three'
import {Group} from 'three'
import CompassOracle, {enhancedRingsConfig} from './CompassOracle.tsx'
import DiviCircle from "./components/DiviCircle.tsx";
import {useNavigate} from 'react-router-dom'

// Import necessary postprocessing effects
import {UnrealBloomPass} from 'three-stdlib'
import {Perf} from 'r3f-perf'
import SolarSystemGua from '@/pages/divi/components/SolarSystemGua.tsx'
import CameraController from '@/components/galaxy/CameraController.tsx';
import DiviPanel from '@/pages/divi/DiviPanel';
import RippleCursor from '@/components/ui/cursor/RippleCursor';
import DiviLoadingScreen from '@/pages/divi/DiviLoadingScreen.tsx';
import {useUIStore} from '@/stores/uiStore';
import {useDivinationStore} from '@/stores/divineStore';
import {LoveBeTheWay} from '@/components/divination/LoveBeTheWay.tsx'

extend({ UnrealBloomPass })

// Globals.assign({
//     frameLoop: 'always',
// })

// Main component
const DiviScreen = () => {
    const [activeRing, setActiveRing] = useState<string | null>(null)
    const [autoRotate, setAutoRotate] = useState(true)
    // const [customConfig, setCustomConfig] = useState<RingConfig[]>(enhancedRingsConfig)
    // const [isLoaded, setIsLoaded] = useState(false);
    const [diviLoaded, setDiviLoaded] = useState(false);
    // const { diviLoaded, setDiviLoaded, diviFocusKey, divideReady, setDivideReady } = useUIStore();
    const { diviFocusKey, divideReady, setDivideReady } = useUIStore();
    const navigate = useNavigate();
    const { willSignature, isDivinationCompleted, gua } = useDivinationStore();
    const diviCircleRef = useRef<Group>(null);
    const loveBeTheWayRef = useRef<Group>(null);

    // Handle exit/return navigation
    const handleExit = () => {
        if (window.history.length > 2) {
            navigate(-1); // Go back one step in history
        } else {
            navigate('/'); // Navigate to home
        }
    };

    // Shared materials for all components
    const sharedMaterials = useMemo(() => ({
        standard: new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
        black: new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide, opacity: 1. }),
        white: new THREE.MeshBasicMaterial({ color: '#a98aff', side: THREE.DoubleSide, opacity: 1. }),
        text3d: new THREE.MeshStandardMaterial({
            color: "#ebbe89",
            toneMapped: true,
            emissive: "#ff4400",
            emissiveIntensity: 0.9,
            side: THREE.DoubleSide
        })
    }), []);



    return (
        <div className="w-full h-screen relative">
            {!diviLoaded && <div className="w-full h-screen relative bg-black">
                <DiviLoadingScreen
                    onLoadingComplete={() => setDiviLoaded(true)}
                    minDisplayTime={3000}
                    quickLoadThreshold={0}
                />
            </div>
            }

            <Suspense fallback={null}>
                <Canvas shadows
                    // orthographic
                    camera={{
                        // position: [0, 5, 10],
                        position: [0, 2, 10],
                        fov: 45,
                        zoom: 1,
                        far: 1000,
                        near: 0.1,
                    }}
                    gl={{ 
                        alpha: true,
                        antialias: true, // Disable antialiasing for performance
                        // powerPreference: 'high-performance'
                    }}
                    onCreated={({ gl, camera }) => {
                        if (camera instanceof THREE.PerspectiveCamera) {
                            // Limit pixel ratio for better performance
                            const pixelRatio = Math.min(window.devicePixelRatio, 2);
                            gl.setPixelRatio(pixelRatio);
                            camera.aspect = window.innerWidth / window.innerHeight;
                            camera.updateProjectionMatrix();
                        }
                    }}
                    resize={{
                        scroll: false,
                        debounce: {
                            scroll: 50,
                            resize: 50
                        }
                    }}
                    // frameloop="always" 
                    frameloop="demand" 
                    >
                    {/* <fog attach="fog" args={['#000', 5, 30]} /> */}
                    {/* <color attach="background" args={['#000000']} /> */}
                    {/* <Environment preset="night" /> */}

                    <CameraController />


                    {/* from drei */}
                    <Stars radius={100} depth={50} count={1000} factor={2} saturation={0} speed={1} />

                    {/* Lighting */}
                    <ambientLight intensity={1.5} />
                    <pointLight position={[0, 0, 0]} intensity={25} distance={15} decay={2} />

                    {/* <spotLight
                        position={[0, 0, 0]}
                        intensity={0.8}
                        angle={0.5}
                        penumbra={1}
                        castShadow
                    /> */}

                    {/* Main compass component */}
                    {diviLoaded && (
                        <group position={[0, -2, 0]}>
                            <CompassOracle
                                rings={enhancedRingsConfig}
                                initialHeight={0}
                                maxLiftHeight={3}
                                liftDuration={1200}
                                fontSize={0.16}
                                activeRing={activeRing}
                                liftSpacing={0.3}
                                glowIntensity={3}
                                taijiMaterials={sharedMaterials}
                            />
                            {/* <BlackHole position={[0, 2.8, 0]} scale={0.5} /> */}
                        </group>
                    )}

                    <group position={[0, 2.2, 0]}>
                        {!isDivinationCompleted() && (
                            <group position={[0, 0, 0]} ref={diviCircleRef}>
                                <DiviCircle
                                    initialPosition={new THREE.Vector3(0, -6, 0)}
                                    taijiPosition={new THREE.Vector3(0, -1.8, 0)}
                                    humanPosition={new THREE.Vector3(0, -1.5, 0)}
                                    returnPosition={new THREE.Vector3(0, -6, 0)}
                                    startY={0.6}
                                    radius={1.2}
                                    color={'#a98aff'}
                                    particleSize={0.2}
                                    count={50}
                                    animation={true}
                                    zIndex={0}
                                />
                            </group>
                        )}

                        {isDivinationCompleted() && (
                            <group position={[0, 0, 0]} ref={loveBeTheWayRef}>
                                <LoveBeTheWay
                                    gua={gua}
                                    scale={1}
                                    startStepPosition={[0, -1.2, 0]}
                                    targetStepPosition={[0, 1.2, 0]}
                                    steps={6}
                                    configSize={{
                                        xLength: 1.9,
                                        yLength: 0.2,
                                        zLength: 0.01,
                                        extraGap: 0.02
                                    }}
                                />
                            </group>
                        )}

                    </group>


                    {/* <DiviGalaxy spin={1} branches={4} /> */}


                    <SolarSystemGua position={[0, -3.3, -4]} scale={0.5} />


                    {/* Post-processing effects */}
                    {/* <Effects disableGamma> */}
                    {/* @ts-ignore - extend adds this */}
                    {/* <unrealBloomPass threshold={0.3} strength={0.8} radius={0.1} /> */}
                    {/* </Effects> */}

                    {process.env.NODE_ENV === 'development' && (
                        <>
                            <Perf
                                position="top-right"
                                minimal={false}
                            />
                            {/* <axesHelper args={[0.5]} position={[0, 0, 0]} /> */}
                        </>
                    )}
                </Canvas>
            </Suspense>

            {/* UI Controls */}
            <DiviPanel />

            {/* <CanvasCursor /> */}
            {/* {divideReady && <NeonCursor />} */}
            {divideReady && <RippleCursor />}
            {/* {<RippleCursor />} */}
            {/* <div>{diviFocusKey !== '' && <DetailCard />}</div> */}
        </div>

    )
}

export default DiviScreen 
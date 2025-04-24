import {Suspense, useMemo, useRef, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import {Preload} from '@react-three/drei'
import * as THREE from 'three'
import {Group} from 'three'
import CompassOracle from './CompassOracle.tsx'
import DiviCircle from "./components/DiviCircle.tsx";
import {useNavigate} from 'react-router-dom'

// Import necessary postprocessing effects
import {Perf} from 'r3f-perf'
import CameraController from '@/components/galaxy/CameraController.tsx';
import DiviPanel from '@/pages/divi/DiviPanel';
import RippleCursor from '@/components/ui/cursor/RippleCursor';
import DiviLoadingScreen from '@/pages/divi/DiviLoadingScreen.tsx';
import {useUIStore} from '@/stores/uiStore';
import {useDivinationStore} from '@/stores/divineStore';
import {LoveBeTheWay} from '@/components/divination/LoveBeTheWay.tsx'
import {usePageDiviData} from '@/i18n/DataProvider.tsx'
import VoyagerGoldenRecordsPlayer from '@/components/VoyagerGoldenRecordsPlayer.tsx'

const DiviScreen = () => {
    const [activeRing, setActiveRing] = useState<string | null>(null)
    const [diviLoaded, setDiviLoaded] = useState(false);
    const { diviFocusKey, divideReady, setDivideReady } = useUIStore();
    const navigate = useNavigate();
    const { willSignature, isDivinationCompleted, gua } = useDivinationStore();
    const diviCircleRef = useRef<Group>(null);
    const loveBeTheWayRef = useRef<Group>(null);
    const pageDiviData = usePageDiviData();

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
                    minDisplayTime={6000}
                    quickLoadThreshold={0}
                    loadingPhrase={pageDiviData.loadingPhrase}
                />
            </div>
            }

            <VoyagerGoldenRecordsPlayer />

            <Suspense fallback={null}>
                <Canvas shadows
                    // orthographic
                    camera={{
                        // position: [0, 5, 10],
                        position: [0, 2, 10],
                        fov: 60,
                        zoom: 1,
                        far: 2000,
                        near: 0.01,
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
                    frameloop="always" 
                    // frameloop="demand"
                >

                    <CameraController />


                    {/* Main compass component */}
                    <group position={[0, -2, 0]}>
                        <CompassOracle
                            initialHeight={-1.2}
                            maxLiftHeight={1.6}
                            liftDuration={1200}
                            fontSize={0.16}
                            activeRing={activeRing}
                            liftSpacing={0.28}
                            glowIntensity={2}
                            taijiMaterials={sharedMaterials}
                        />
                        {/* <BlackHole position={[0, 2.8, 0]} scale={0.5} /> */}
                    </group>

                    <group position={[0, 2.2, 0]}>
                        {!isDivinationCompleted() && (
                            <group position={[0, 0, 0]} ref={diviCircleRef}>
                                <DiviCircle
                                    initialPosition={new THREE.Vector3(0, -8.8, 0)}
                                    taijiPosition={new THREE.Vector3(0, -2.44, 0)}
                                    humanPosition={new THREE.Vector3(0, -2.24, 0)}
                                    returnPosition={new THREE.Vector3(0, -8.8, 0)}
                                    startY={0.6}
                                    radius={1.8}
                                    color={'#a98aff'}
                                    particleSize={0.3}
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
                                    startStepPosition={[0, -1.4, 0]}
                                    targetStepPosition={[0, 1.4, 0]}
                                    steps={6}
                                    configSize={{
                                        xLength: 2.2,
                                        yLength: 0.3,
                                        zLength: 0.01,
                                        extraGap: 0.02
                                    }}
                                />
                            </group>
                        )}

                    </group>


                    {false && process.env.NODE_ENV === 'development' && (
                        <>
                            <Perf
                                position="top-right"
                                minimal={false}
                            />
                            {/* <axesHelper args={[0.5]} position={[0, 0, 0]} /> */}
                        </>
                    )}
                    <Preload all />
                </Canvas>
            </Suspense>

            {/* UI Controls */}
            <DiviPanel diviPanelData={pageDiviData.diviPanelData}  />

            {/* <CanvasCursor /> */}
            {/* {divideReady && <NeonCursor />} */}
            {divideReady && !isDivinationCompleted() && <RippleCursor />}
            {/* {<RippleCursor />} */}
            {/* <div>{diviFocusKey !== '' && <DetailCard />}</div> */}
        </div>

    )
}

export default DiviScreen 
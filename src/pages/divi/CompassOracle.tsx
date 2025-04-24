import React, {useEffect, useRef, useState} from 'react'
import {useFrame} from '@react-three/fiber'
import {animated, config, useSpring} from '@react-spring/three'
import * as THREE from 'three'
import {Mesh} from 'three'
import Taiji from '@/components/bagua/Taiji'
import DNA from './Dna'
import {useUIStore} from '@/stores/uiStore'
import ParticleRing from './components/ParticleRing'
import planetsData, {PlanetData} from '@/lib/planetsData'
import Planet from "@/pages/divi/components/Planets";
import PlanetsUpdater from '@/components/galaxy/PlanetsUpdater'
import Sun from "./components/Sun";

export const sharedMaterials = {
    standard: new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
    black: new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }),
    white: new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
    text3d: new THREE.MeshStandardMaterial({
        color: "#ebbe89",
        toneMapped: true,
        emissive: "#ff4400",
        emissiveIntensity: 0.9,
        side: THREE.DoubleSide
    }),
    ring: new THREE.MeshBasicMaterial({
        // color: 0xffffff,
        color: "white",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    })
    //   <meshBasicMaterial color={ring.color}
    //                             side={THREE.DoubleSide}
    //                             transparent
    //                             opacity={0.8}
    //                         />
};


export enum RingType {
    Text,
    Divi,
    Taiji
}
export interface TextItem {
    text: string
    rotation: number
    symbol?: string
    num?: number
}
export interface RingConfig {
    id: string
    radius: number
    color: string
    type: RingType
    fontSize?: number
    yOffset?: number
    textItems: TextItem[]
    rotationSpeed?: number,
    planetData: PlanetData
}

interface CompassOracleProps {
    initialHeight?: number
    maxLiftHeight?: number
    liftDuration?: number
    fontSize?: number
    activeRing?: string | null
    liftSpacing?: number
    glowIntensity?: number
    taijiMaterials?: {
        standard: THREE.MeshStandardMaterial
        black: THREE.MeshBasicMaterial
        white: THREE.MeshBasicMaterial
    }
}

// Create an animated version of the group
const AnimatedGroup = animated('group')

export const CompassOracle = ({
    initialHeight = 0,
    maxLiftHeight = 2,
    liftDuration = 1000,
    fontSize = 0.1,
    activeRing = null,
    liftSpacing = 0.3,
    glowIntensity = 3.5,
    taijiMaterials,
}: CompassOracleProps) => {
    const [planetOrbitProgress, setPlanetOrbitProgress] = useState<{
        [key: string]: number;
    }>(
        planetsData.reduce<{ [key: string]: number }>((acc, planet: PlanetData) => {
            acc[planet.name] = 0;
            return acc;
        }, {})
    );


    // console.log(rings);
    const groupRef = useRef<THREE.Group>(null)
    const [selectedRing, setSelectedRing] = useState<string | null>(activeRing)
    const ringRefs = useRef<Record<string, THREE.Group | null>>({})
    const planetRefs = useRef<Record<string, React.RefObject<Mesh>>>({});

    const taijiRef = useRef<THREE.Group>(null)

    const { elevated, setElevated } = useUIStore();
    // Track which rings should be elevated based on the selected ring
    const [elevatedRings, setElevatedRings] = useState<string[]>([])

    // Helper function to get sorted rings by radius (smallest first)
    const getSortedRingsByRadius = (targetRingId: string | null) => {
        if (!targetRingId) return [];

        const activeIndex = enhancedRingsConfig.findIndex(r => r.id === targetRingId);
        if (activeIndex === -1) return [];

        // Get all rings up to the active one
        const ringsToElevate = enhancedRingsConfig
            .filter(r => enhancedRingsConfig.indexOf(r) <= activeIndex)
            .map(r => r.id);

        // Sort by radius (smallest first)
        ringsToElevate.sort((a, b) => {
            const ringA = enhancedRingsConfig.find(r => r.id === a);
            const ringB = enhancedRingsConfig.find(r => r.id === b);
            return (ringA?.radius || 0) - (ringB?.radius || 0);
        });

        return ringsToElevate;
    };

    // Initialize refs for each ring
    useEffect(() => {
        enhancedRingsConfig.forEach(ring => {
            if (!ringRefs.current[ring.id]) {
                ringRefs.current[ring.id] = null
            }
            if (!planetRefs.current[ring.planetData.id]) {
                planetRefs.current[ring.planetData.id] = React.createRef<Mesh>()
            }
        })
    }, [])

    useEffect(() => {
        if (elevated) {
            handleRingElevate(enhancedRingsConfig[enhancedRingsConfig.length - 1].id);
        } else {
            setElevatedRings([]);
        }
    }, [elevated]);

    // Rotate rings continuously based on their speed
    useFrame((_, delta) => {
        enhancedRingsConfig.forEach(ring => {
            const ringRef = ringRefs.current[ring.id]
            taijiRef.current.rotation.y += 0.0005
            if (ringRef) {
                ringRef.rotation.y += (ring.planetData.rotationSpeed * 0.05) * delta
            }

            const planetRef = planetRefs.current[ring.planetData.id]?.current
            if (planetRef) {
                //@ts-ignore
                planetRef.rotation.y += ring.planetData.rotationSpeed * delta
            }
        })
    })

    const { diviFocusKey, setDiviFocusKey } = useUIStore()

    const handleRingElevate = (ringId: string) => {
        const newSelectedRing = ringId === selectedRing ? null : ringId;
        setSelectedRing(newSelectedRing);
        setElevatedRings(getSortedRingsByRadius(newSelectedRing));
    }

    const handleRingClick = (ringId: string) => {
        // const newSelectedRing = ringId === selectedRing ? null : ringId;
        // setSelectedRing(newSelectedRing);
        // setElevatedRings(getSortedRingsByRadius(newSelectedRing));
    }

    const handleRingItemClick = (item: TextItem) => {
        setDiviFocusKey(item.text);
    }


    useEffect(() => {
        console.log(elevated)
        if (elevated) {
            handleRingElevate(enhancedRingsConfig[enhancedRingsConfig.length - 1].id);
        } else {
            handleRingElevate(enhancedRingsConfig[0].id);
        }
    }, [elevated]);

    // Create a spring for the Taiji component
    const taijiSpring = useSpring({
        y: elevated
            ? initialHeight + ((elevatedRings.length - 1) * liftSpacing)
            : initialHeight ,
        config: config.wobbly
    });

    return (
        <group ref={groupRef}>
            {enhancedRingsConfig.map((ring, index) => {
                // Calculate the lift height for this specific ring
                const isElevated = elevatedRings.includes(ring.id)
                const ringLiftIndex = isElevated ? elevatedRings.indexOf(ring.id) : 0
                // Reverse the lift index to make innermost rings go higher
                const reversedLiftIndex = isElevated ? elevatedRings.length - 1 - ringLiftIndex : 0
                const targetY = isElevated ? initialHeight + (reversedLiftIndex * liftSpacing) : initialHeight

                // Create spring animation for this ring
                const { position, emissiveIntensity } = useSpring({
                    position: [0, targetY + ring.yOffset - ring.planetData.position.x * 0.12, 0] as [number, number, number],
                    emissiveIntensity: isElevated ? glowIntensity : 0.5,
                    config: config.gentle,
                    delay: isElevated ? elevatedRings.indexOf(ring.id) * 100 : 0, // Stagger delay based on ring order
                })


                if (ring.type === RingType.Taiji) {
                    return (
                        <AnimatedGroup
                            key={ring.id}
                            ref={taijiRef}
                            position-y={taijiSpring.y}
                            // position-y={0}
                            position-x={0}
                            position-z={0}
                        >
                            <Taiji
                                materials={taijiMaterials}
                                scale={[0.3, 0.3, 0.3]}
                            />

                            <DNA
                                position={[0, -4.08, 0]}
                                rotation={[0, 0, 0]}
                                length={160}
                                scale={0.05}
                            />
                            <Sun position={[0, 0.3, 0]} radius={0.28} />
                        </AnimatedGroup>
                    )
                }

                return (
                    <AnimatedGroup
                        key={ring.id}
                        ref={el => (ringRefs.current[ring.id] = el)}
                        position={position}
                        onClick={() => handleRingClick(ring.id)}
                    >
                        {/* Ring circle */}
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <ringGeometry args={[ring.planetData.position.x - 0.02, ring.planetData.position.x, 64]} />
                            <meshBasicMaterial color={"gray"}
                                side={THREE.DoubleSide}
                                transparent
                                opacity={0.4}
                            />
                        </mesh>
                        <ParticleRing thickness={(6) * 0.6} radius={ring.planetData.position.x} color={"purple"} particleCount={64 * ring.planetData.position.x * ring.planetData.position.x} />

                        <Planet
                            key={ring.planetData.id}
                            id={ring.planetData.id}
                            name={ring.planetData.name}
                            texturePath={ring.planetData.texturePath}
                            position={ring.planetData.position}
                            radius={ring.planetData.radius}
                            rotationSpeed={ring.planetData.rotationSpeed}
                            tilt={ring.planetData.tilt}
                            orbitSpeed={ring.planetData.orbitSpeed}
                            wobble={ring.planetData.wobble}
                            rings={ring.planetData.rings}
                            orbitProgress={planetOrbitProgress[ring.planetData.name]}
                            meshRef={planetRefs.current[ring.planetData.id]}
                        />
                    </AnimatedGroup>
                )
            })}

            {/* <ParticleTaiji thickness={18} radius={12} particleCount={8000} /> */}

            <PlanetsUpdater
                setPlanetOrbitProgress={setPlanetOrbitProgress}
                planets={planetsData}
            />
        </group>
    )
}

const guaList = [
    {
        "name": "乾",
        "symbol": "䷀",
        "num": 1
    },
    {
        "name": "坤",
        "symbol": "䷁",
        "num": 2
    },
    {
        "name": "屯",
        "symbol": "䷂",
        "num": 3
    },
    {
        "name": "蒙",
        "symbol": "䷃",
        "num": 4
    },
    {
        "name": "需",
        "symbol": "䷄",
        "num": 5
    },
    {
        "name": "讼",
        "symbol": "䷅",
        "num": 6
    },
    {
        "name": "师",
        "symbol": "䷆",
        "num": 7
    },
    {
        "name": "比",
        "symbol": "䷇",
        "num": 8
    },
    {
        "name": "小畜",
        "symbol": "䷈",
        "num": 9
    },
    {
        "name": "履",
        "symbol": "䷉",
        "num": 10
    },
    {
        "name": "泰",
        "symbol": "䷊",
        "num": 11
    },
    {
        "name": "否",
        "symbol": "䷋",
        "num": 12
    },
    {
        "name": "同人",
        "symbol": "䷌",
        "num": 13
    },
    {
        "name": "大有",
        "symbol": "䷍",
        "num": 14
    },
    {
        "name": "谦",
        "symbol": "䷎",
        "num": 15
    },
    {
        "name": "豫",
        "symbol": "䷏",
        "num": 16
    },
    {
        "name": "随",
        "symbol": "䷐",
        "num": 17
    },
    {
        "name": "蛊",
        "symbol": "䷑",
        "num": 18
    },
    {
        "name": "临",
        "symbol": "䷒",
        "num": 19
    },
    {
        "name": "观",
        "symbol": "䷓",
        "num": 20
    },
    {
        "name": "噬嗑",
        "symbol": "䷔",
        "num": 21
    },
    {
        "name": "贲",
        "symbol": "䷕",
        "num": 22
    },
    {
        "name": "剥",
        "symbol": "䷖",
        "num": 23
    },
    {
        "name": "复",
        "symbol": "䷗",
        "num": 24
    },
    {
        "name": "无妄",
        "symbol": "䷘",
        "num": 25
    },
    {
        "name": "大畜",
        "symbol": "䷙",
        "num": 26
    },
    {
        "name": "颐",
        "symbol": "䷚",
        "num": 27
    },
    {
        "name": "大过",
        "symbol": "䷛",
        "num": 28
    },
    {
        "name": "坎",
        "symbol": "䷜",
        "num": 29
    },
    {
        "name": "离",
        "symbol": "䷝",
        "num": 30
    },
    {
        "name": "咸",
        "symbol": "䷞",
        "num": 31
    },
    {
        "name": "恒",
        "symbol": "䷟",
        "num": 32
    },
    {
        "name": "遯",
        "symbol": "䷠",
        "num": 33
    },
    {
        "name": "大壮",
        "symbol": "䷡",
        "num": 34
    },
    {
        "name": "晋",
        "symbol": "䷢",
        "num": 35
    },
    {
        "name": "明夷",
        "symbol": "䷣",
        "num": 36
    },
    {
        "name": "家人",
        "symbol": "䷤",
        "num": 37
    },
    {
        "name": "睽",
        "symbol": "䷥",
        "num": 38
    },
    {
        "name": "蹇",
        "symbol": "䷦",
        "num": 39
    },
    {
        "name": "解",
        "symbol": "䷧",
        "num": 40
    },
    {
        "name": "损",
        "symbol": "䷨",
        "num": 41
    },
    {
        "name": "益",
        "symbol": "䷩",
        "num": 42
    },
    {
        "name": "夬",
        "symbol": "䷪",
        "num": 43
    },
    {
        "name": "姤",
        "symbol": "䷫",
        "num": 44
    },
    {
        "name": "萃",
        "symbol": "䷬",
        "num": 45
    },
    {
        "name": "升",
        "symbol": "䷭",
        "num": 46
    },
    {
        "name": "困",
        "symbol": "䷮",
        "num": 47
    },
    {
        "name": "井",
        "symbol": "䷯",
        "num": 48
    },
    {
        "name": "革",
        "symbol": "䷰",
        "num": 49
    },
    {
        "name": "鼎",
        "symbol": "䷱",
        "num": 50
    },
    {
        "name": "震",
        "symbol": "䷲",
        "num": 51
    },
    {
        "name": "艮",
        "symbol": "䷳",
        "num": 52
    },
    {
        "name": "渐",
        "symbol": "䷴",
        "num": 53
    },
    {
        "name": "归妹",
        "symbol": "䷵",
        "num": 54
    },
    {
        "name": "丰",
        "symbol": "䷶",
        "num": 55
    },
    {
        "name": "旅",
        "symbol": "䷷",
        "num": 56
    },
    {
        "name": "巽",
        "symbol": "䷸",
        "num": 57
    },
    {
        "name": "兑",
        "symbol": "䷹",
        "num": 58
    },
    {
        "name": "涣",
        "symbol": "䷺",
        "num": 59
    },
    {
        "name": "节",
        "symbol": "䷻",
        "num": 60
    },
    {
        "name": "中孚",
        "symbol": "䷼",
        "num": 61
    },
    {
        "name": "小过",
        "symbol": "䷽",
        "num": 62
    },
    {
        "name": "既济",
        "symbol": "䷾",
        "num": 63
    },
    {
        "name": "未济",
        "symbol": "䷿",
        "num": 64
    }
]

type TupleConfig = {
    id?: string
    color: string
    texts: string[] | { name: string, symbol: string, num?: number }[]
    type: RingType
    rotationSpeed?: number
    yOffset?: number
    planetData: PlanetData
}

// Utility function to create rings with evenly distributed text
export const createRingConfig = (
    config: TupleConfig,
    index: number
): RingConfig => {
    const textItems: TextItem[] =
        config.texts.map((text, index) => {
            const rotation = (index / config.texts.length) * Math.PI * 2
            if (typeof text === 'string') {
                return { text, rotation } as TextItem
            } else {
                return { text: text.symbol, rotation, symbol: text.symbol, num: text.num } as TextItem
            }
        })

    // config.planetData.position.x = config.planetData.position.x * 0.6
    config.planetData.position.x = config.planetData.position.x 

    return {
        id: `ring_${index}`,
        radius: 1. + index * 0.3,
        color: config.color,
        textItems,
        type: config.type,
        rotationSpeed: config.rotationSpeed,
        yOffset: config.yOffset ?? 0,
        planetData: config.planetData
    }
}

export const enhancedRingsConfig: RingConfig[] = [
    {
        color: '#a98aff',
        texts: [],
        type: RingType.Taiji,
        rotationSpeed: 0.1,
        yOffset: 0,
        planetData: { position: { x: 0, y: 0, z: 0 } } as PlanetData
    },
    {
        color: '#FFA500',
        texts: [],
        type: RingType.Text,
        rotationSpeed: 0.05,
        yOffset: 0,
        planetData: planetsData[0]
    },
    {
        color: '#FFD700',
        texts: [],
        type: RingType.Text,
        rotationSpeed: 0.05,
        yOffset: 0,
        planetData: planetsData[1]
    },
    {
        color: '#0000FF',
        texts: guaList,
        type: RingType.Text,
        rotationSpeed: 0.05,
        yOffset: 0,
        planetData: planetsData[2]
    },
    {
        color: '#FF0000',
        texts: [],
        type: RingType.Text,
        rotationSpeed: 0.05,
        yOffset: 0,
        planetData: planetsData[3]
    },
    {
        color: '#FF8C00',
        texts: [],
        type: RingType.Text,
        rotationSpeed: 0.2,
        yOffset: 0,
        planetData: planetsData[4]
    },
    {
        color: '#F0E68C',
        texts: [],
        type: RingType.Text,
        rotationSpeed: 0.05,
        yOffset: 0,
        planetData: planetsData[5]
    },
    {
        color: '#00FFFF',
        texts: [],
        type: RingType.Text,
        rotationSpeed: 0.3,
        yOffset: 0,
        planetData: planetsData[6]
    },
    {
        color: '#00008B',
        texts: [],
        type: RingType.Text,
        rotationSpeed: 0.2,
        planetData: planetsData[7]
    },
].map((dat, index) => createRingConfig({ ...dat }, index))


export default CompassOracle 
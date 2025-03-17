import {useEffect, useRef, useState} from 'react'
import {useFrame} from '@react-three/fiber'
import {Text} from '@react-three/drei'
import {animated, config, useSpring} from '@react-spring/three'
import * as THREE from 'three'
import Taiji from '@/components/bagua/Taiji'
import {FakeGlowMaterial} from '@/utils/FakeGlowMaterial'
import DNA from './Dna'
import {useUIStore} from '@/stores/uiStore'
// Type definitions for the component

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
    })
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
    rotationSpeed?: number
}

interface CompassOracleProps {
    rings: RingConfig[]
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

// Glowing ring effect component
const GlowingRing = ({ radius, color, thickness = 0.02 }) => {
    const mesh = useRef<THREE.Mesh>(null)

    const spring = useSpring({
        emissiveIntensity: 2.0,
        from: { emissiveIntensity: 0.88 },
        config: { duration: 2000 },
        loop: { reverse: true },
    })

    // Calculate the dimensions for the second ring
    const innerRadius = radius - thickness;
    const outerRadius = radius + thickness;

    return (
        <>
            <mesh ref={mesh} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius - thickness, radius, 64]} />
                <animated.meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={spring.emissiveIntensity}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.6}
                />
                {/* <FakeGlowMaterial /> */}
            </mesh>
            {/* Add a second, larger glow ring for enhanced effect */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[innerRadius * 0.95, outerRadius * 1.05, 64]} />
                <FakeGlowMaterial />

                <animated.meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={spring.emissiveIntensity}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.3}
                />
            </mesh>
        </>
    )
}

export const CompassOracle = ({
    rings = [],
    initialHeight = 0,
    maxLiftHeight = 2,
    liftDuration = 1000,
    fontSize = 0.1,
    activeRing = null,
    liftSpacing = 0.3,
    glowIntensity = 3.5,
    taijiMaterials,
}: CompassOracleProps) => {
    // console.log(rings);
    const groupRef = useRef<THREE.Group>(null)
    const [selectedRing, setSelectedRing] = useState<string | null>(activeRing)
    const ringRefs = useRef<Record<string, THREE.Group | null>>({})
    const taijiRef = useRef<THREE.Group>(null)

    const { elevated, setElevated } = useUIStore();
    // Track which rings should be elevated based on the selected ring
    const [elevatedRings, setElevatedRings] = useState<string[]>([])

    // Helper function to get sorted rings by radius (smallest first)
    const getSortedRingsByRadius = (targetRingId: string | null) => {
        if (!targetRingId) return [];

        const activeIndex = rings.findIndex(r => r.id === targetRingId);
        if (activeIndex === -1) return [];

        // Get all rings up to the active one
        const ringsToElevate = rings
            .filter(r => rings.indexOf(r) <= activeIndex)
            .map(r => r.id);

        // Sort by radius (smallest first)
        ringsToElevate.sort((a, b) => {
            const ringA = rings.find(r => r.id === a);
            const ringB = rings.find(r => r.id === b);
            return (ringA?.radius || 0) - (ringB?.radius || 0);
        });

        return ringsToElevate;
    };

    // Initialize refs for each ring
    useEffect(() => {
        rings.forEach(ring => {
            if (!ringRefs.current[ring.id]) {
                ringRefs.current[ring.id] = null
            }
        })
    }, [rings])

    useEffect(() => {
        if (elevated) {
            handleRingElevate(rings[rings.length - 1].id);
        } else {
            setElevatedRings([]);
        }
    }, [elevated]);

    // Rotate rings continuously based on their speed
    useFrame((_, delta) => {
        rings.forEach(ring => {
            const ringRef = ringRefs.current[ring.id]
            // console.log(ring.rotationSpeed, ring.id)
            taijiRef.current.rotation.y += 0.0005
            if (ringRef) {
                ringRef.rotation.y += (ring.rotationSpeed) * delta

                // If this is the innermost ring and Taiji exists, sync its rotation
                if (ring.type === RingType.Taiji && taijiRef.current) {
                    // Update the rotation of the Taiji component to match the innermost ring
                    // We use rotation.z because the Taiji component is rotated differently
                    // taijiRef.current.rotation.z += ringRef.rotation.y
                    // taijiRef.current.rotation.y += 0.5


                    // groupRef.current.rotation.y += rotationSpeed;
                    // }
                    // taijiRef.current.rotation.y += ring.rotationSpeed * delta
                }
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
            handleRingElevate(rings[rings.length - 1].id);
        } else {
            handleRingElevate(rings[0].id);
        }
    }, [elevated]);

    // Create a spring for the Taiji component
    const taijiSpring = useSpring({
        y: elevatedRings.includes(rings[0]?.id)
            ? initialHeight + ((elevatedRings.length - 1) * liftSpacing)
            : initialHeight,
        config: config.gentle
    });

    // 添加一个共享的动画控制器
    const { rotationProgress } = useSpring({
        rotationProgress: elevated ? 0 : 1,
        config: { mass: 1, tension: 120, friction: 14 }
    });

    return (
        <group ref={groupRef}>
            {/* Add toggle button */}
            {/* <group position={[0, 2, 2]}>
                <mesh onClick={() => setElevated(!elevated)}>
                    <boxGeometry args={[0.5, 0.2, 0.1]} />
                    <meshStandardMaterial color={elevated ? "#4CAF50" : "#F44336"} />
                </mesh>
                <Text
                    position={[0, 0, 0.06]}
                    fontSize={0.08}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {elevated ? "Collapse" : "Expand"}
                </Text>
            </group> */}

            {rings.map((ring, index) => {
                // Calculate the lift height for this specific ring
                const isElevated = elevatedRings.includes(ring.id)
                const ringLiftIndex = isElevated ? elevatedRings.indexOf(ring.id) : 0
                // Reverse the lift index to make innermost rings go higher
                const reversedLiftIndex = isElevated ? elevatedRings.length - 1 - ringLiftIndex : 0
                const targetY = isElevated ? initialHeight + (reversedLiftIndex * liftSpacing) : initialHeight

                // Create spring animation for this ring
                const { position, emissiveIntensity } = useSpring({
                    position: [0, targetY + ring.yOffset, 0] as [number, number, number],
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
                                scale={[0.25, 0.25, 0.25]}
                            />

                            <DNA
                                position={[0, -2.5, 0]}
                                rotation={[0, 0, 0]}
                                length={100}
                                scale={0.05}
                            />
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
                            <ringGeometry args={[ring.radius - 0.02, ring.radius, 64]} />
                            <animated.meshStandardMaterial
                                color={ring.color}
                                side={THREE.DoubleSide}
                                emissive={ring.color}
                                emissiveIntensity={emissiveIntensity}
                                transparent
                                opacity={0.8}
                            />
                        </mesh>
                        {/* Text items on the ring */}
                        {ring.textItems.map((item, i) => {
                            const angle = item.rotation
                            const x = Math.cos(angle) * ring.radius
                            const z = Math.sin(angle) * ring.radius

                            // 计算两种状态下的旋转值
                            const elevatedRotation = [0, -angle + Math.PI / 2, 0];
                            const collapsedRotation = [-Math.PI / 2, 0, -angle + Math.PI / 2];

                            return (
                                <animated.group
                                    key={`${ring.id}-text-${i}`}
                                    position={[x, 0, z]}
                                    //@ts-ignore
                                    rotation={rotationProgress.to(p => [
                                        elevatedRotation[0] * (1 - p) + collapsedRotation[0] * p,
                                        elevatedRotation[1] * (1 - p) + collapsedRotation[1] * p,
                                        elevatedRotation[2] * (1 - p) + collapsedRotation[2] * p
                                    ])}
                                    onClick={() => handleRingItemClick(item)}
                                >
                                    <Text
                                        fontSize={fontSize}
                                        color="white"
                                        anchorX="center"
                                        anchorY="middle"
                                        outlineColor={ring.color}
                                        fillOpacity={1}
                                    >
                                        {item.text}
                                    </Text>
                                </animated.group>
                            )
                        })}

                        {/* <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <ringGeometry args={[ring.radius, ring.radius + 0.2, 64]} />
                            <animated.meshStandardMaterial
                                color={ring.color}
                                side={THREE.DoubleSide}
                                emissive={ring.color}
                                emissiveIntensity={emissiveIntensity}
                                transparent
                                opacity={0.8}
                            />
                        </mesh> */}
                    </AnimatedGroup>
                )
            })}
        </group>
    )
}


type TupleConfig = {
    id?: string
    color: string
    texts: string[] | { name: string, symbol: string, num?: number }[]
    type: RingType
    rotationSpeed?: number
    yOffset?: number
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

    return {
        id: `ring_${index}`,
        radius: 1. + index * 0.3,
        color: config.color,
        textItems,
        type: config.type,
        rotationSpeed: config.rotationSpeed,
        yOffset: config.yOffset ?? 0
    }
}

export const enhancedRingsConfig: RingConfig[] = [

    {
        color: '#a98aff',
        texts: [],
        type: RingType.Taiji,
        rotationSpeed: 0.1,
        yOffset: 0
    },
    // {
    //     color: '#a98aff',
    //     texts: ["⚋", "⚊"],
    //     type: RingType.Text,
    //     rotationSpeed: 0.06,
    //     yOffset: 0
    // },
    {
        color: 'red',
        texts: ["⚏", "⚎", "⚍", "⚎"],
        type: RingType.Text,
        rotationSpeed: 0.05,
        yOffset: 0
    },

    {
        color: '#a98aff',
        texts: ["☰", "☷", "☳", "☴", "☵", "☶", "☲", "☱"],
        type: RingType.Text,
        rotationSpeed: 0.05,
        yOffset: 0
    },
    // {
    //     color: '#a98aff',
    //     texts: ['壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾'],
    //     type: RingType.Text,
    //     rotationSpeed: 0.05,
    //     yOffset: 0
    // },
    {
        color: '#5e17eb',
        texts: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
        type: RingType.Text,
        rotationSpeed: 0.2,
        yOffset: 0
    },
    {
        color: '#8c52ff',
        texts: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
        type: RingType.Text,
        rotationSpeed: 0.05,
        yOffset: 0
    },
    {
        color: '#8c52ff',
        texts: ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
            '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
            '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
            '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'],
        type: RingType.Text,
        rotationSpeed: 0.3,
        yOffset: 0
    },
    {
        color: 'yellow',
        texts: [
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
        ],
        type: RingType.Text,
        rotationSpeed: 0.1,
    },
    {
        color: 'red',
        texts: [],
        type: RingType.Text,
        rotationSpeed: 0.1,
        yOffset: 0
    },
    {
        color: '#a98aff',
        texts: [],
        type: RingType.Divi,
        rotationSpeed: 0.1,
        yOffset: 0
    },


].map((dat, index) => createRingConfig({ ...dat }, index))


export default CompassOracle 
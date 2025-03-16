import {FC, useMemo} from 'react'
import * as THREE from 'three'
import {Text} from '@react-three/drei'
import {GroupProps} from '@react-three/fiber'

interface RingProps extends GroupProps {
    innerRing: number
    outerRing: number
    lineWidth: number
    circleWidth: [number, number]
    lineNum: number
    offsetX: number
    offsetY: number
    text: string[]
    size: number
    direction: number
    duration: number
    height?: number // Added height prop
}

export const BaguaRing: FC<RingProps> = ({
    innerRing,
    outerRing,
    lineWidth,
    circleWidth,
    lineNum,
    offsetX,
    offsetY,
    text,
    size,
    height = 0.5, // Default height
    ...props
}) => {
    // 使用 useMemo 缓存计算结果
    const circles = useMemo(() => {
        const circle = [0, outerRing]
        return circle.map((i, j) => ({
            innerRadius: innerRing + i,
            outerRadius: innerRing + circleWidth[j] + i,
        }))
    }, [innerRing, outerRing, circleWidth])

    // 计算线条位置
    const lines = useMemo(() => {
        const r = innerRing + outerRing / 2
        return Array.from({ length: lineNum }, (_, i) => {
            const rad = ((2 * Math.PI) / lineNum) * i
            return {
                position: [
                    Math.cos(rad) * r,
                    Math.sin(rad) * r,
                    0
                ] as [number, number, number],
                rotation: [0, 0, rad] as [number, number, number],
            }
        })
    }, [innerRing, outerRing, lineNum])

    // 计算文字位置
    const textPositions = useMemo(() => {
        if (!text.length || text.length <= 1) return []

        const r = innerRing + outerRing / 2
        return Array.from({ length: lineNum }, (_, i) => {
            const rad = ((2 * Math.PI) / lineNum) * i + Math.PI / lineNum
            return {
                position: [
                    Math.cos(rad) * r + offsetX,
                    Math.sin(rad) * r + offsetY,
                    height / 2 // Raise text to top of cylinder
                ] as [number, number, number],
                rotation: [0, 0, rad - Math.PI / 2] as [number, number, number],
                text: text[i % text.length],
            }
        })
    }, [innerRing, outerRing, lineNum, text, offsetX, offsetY, height])

    return (
        <group {...props}>
            {/* 添加坐标轴辅助线 */}
            <axesHelper args={[5]} /> {/* 参数5是轴线的长度 */}

            {/* 渲染圆环 - now using cylinderGeometry for 3D effect */}
            {circles.map((circle, index) => (
                <mesh key={`circle-${index}`}>
                    <cylinderGeometry
                        args={[
                            circle.outerRadius, // Top radius
                            circle.outerRadius, // Bottom radius 
                            height, // Height
                            64, // Radial segments
                            1, // Height segments
                            true // Open ended
                        ]}
                    />
                    <meshStandardMaterial
                        color={0xffffff}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}

            {/* 渲染线条 - now using boxGeometry for 3D effect */}
            {lines.map((line, index) => (
                <mesh
                    key={`line-${index}`}
                    position={line.position}
                    rotation={line.rotation}
                >
                    <boxGeometry args={[lineWidth, outerRing, height]} />
                    <meshStandardMaterial
                        color={0xffffff}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}

            {/* 渲染文字 */}
            {textPositions.map((textData, index) => (
                <Text
                    key={`text-${index}`}
                    position={textData.position}
                    rotation={textData.rotation}
                    fontSize={size}
                    color="red"
                >
                    {textData.text}
                </Text>
            ))}
        </group>
    )
}
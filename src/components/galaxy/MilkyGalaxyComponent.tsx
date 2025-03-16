import {useMemo, useRef} from 'react'
import {useFrame} from '@react-three/fiber'
import * as THREE from 'three'
import {DoubleSide, TextureLoader} from 'three'
import {shaderMaterial} from '@react-three/drei'
import barredSpiral from './glsl/barred-spiral.glsl'
import fragment from './glsl/fragment.glsl'
import particleTexture from '@/assets/particle-example.png'

// Test if shader import works
console.log('Vertex shader content:', barredSpiral);
console.log('Fragment shader content:', fragment);

interface Layer {
    count: number
    color: string
    texture: string
    sizeAmp?: number
    minRadius?: number
    maxRadius?: number
    speedAmp?: number
    yAmp?: number
}

interface MilkyGalaxyProps {
    // layers?: Layer[]
    backgroundColor?: string
}

// Create a custom shader material
const GalaxyMaterial = shaderMaterial(
    {
        time: 0,
        uTexture: null,
        uColor: new THREE.Color(),
        uMouse: new THREE.Vector3(),
        uSizeAmp: 1,
        uSpeedAmp: 1,
        uYTwistAmp: 1,
        resolution: new THREE.Vector4(),
        pixels: new THREE.Vector2(1, 1),
    },
    // vertex shader
    /* glsl */`
    ${THREE.ShaderChunk.common}
    ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
    
    ${barredSpiral}
    
    void main() {
        ${THREE.ShaderChunk.logdepthbuf_vertex}
    }
    `,
    // fragment shader
    /* glsl */`
    ${THREE.ShaderChunk.common}
    ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
    
    ${fragment}
    
    void main() {
        ${THREE.ShaderChunk.logdepthbuf_fragment}
    }
    `
)

const MilkyGalaxyComponent = ({ backgroundColor }: MilkyGalaxyProps) => {
    // const layers: Layer[] = useMemo(() => [
    //     {
    //         count: 5000,
    //         color: '#ffaa00',
    //         sizeAmp: 1.5,
    //         minRadius: 0.2,
    //         maxRadius: 2,
    //         speedAmp: 1,
    //         yAmp: 1
    //     },
    //     {
    //         count: 3000,
    //         color: '#ff5500',
    //         sizeAmp: 1.2,
    //         minRadius: 0.5,
    //         maxRadius: 2.5,
    //         speedAmp: 0.8,
    //         yAmp: 1.2
    //     }
    // ], []);


    const layers: Layer[] = useMemo(() => {
        return [
            {
                color: '#FFFFFF',
                texture: particleTexture,
                count: 100000,
                minRadius: 2,
                maxRadius: 3,
                sizeAmp: 6,
                yAmp: 10
            },
            {
                color: '#e39b00',
                texture: particleTexture,
                count: 100000,
                yAmp: 30,
                minRadius: 3,
                maxRadius: 9,
                sizeAmp: 6,

            },
            {
                color: '#6432ff',
                texture: particleTexture,
                count: 100000,
                yAmp: 30,
                minRadius: 3,
                maxRadius: 9,
                sizeAmp: 6
            }
        ]
    }, [])

    const groupRef = useRef<THREE.Group>(null)
    // const materialsRef = useRef<THREE.ShaderMaterial[]>([])

    // Initialize materials and geometries
    const meshes = useMemo(() => {
        return layers.map(layer => {
            const {
                count,
                color,
                texture,
                sizeAmp = 1,
                minRadius = 0.2,
                maxRadius = 2,
                speedAmp = 1,
                yAmp = 1
            } = layer

            // Create particle geometry
            const particleGeo = new THREE.PlaneGeometry(1, 1)
            const geo = new THREE.InstancedBufferGeometry()
            geo.instanceCount = count
            geo.setAttribute('position', particleGeo.getAttribute('position'))
            geo.index = particleGeo.index

            // Create positions
            const pos = new Float32Array(count * 3)
            for (let i = 0; i < count; i++) {
                const theta = Math.random() * 2 * Math.PI
                const r = THREE.MathUtils.lerp(minRadius, maxRadius, Math.random())
                const x = r * Math.sin(theta)
                const y = (Math.random() - 0.05) * (THREE.MathUtils.lerp(0.2, 0.1, Math.random()) * yAmp)
                const z = r * Math.cos(theta)
                pos.set([x, y, z], i * 3)
            }
            geo.setAttribute('pos', new THREE.InstancedBufferAttribute(pos, 3, false))

            // Create material
            // material.uniforms.color.value = new THREE.Color(color)
            const material = new THREE.ShaderMaterial({
                // extensions: {
                //     derivatives: true
                // },
                side: DoubleSide,
                uniforms: {
                    uTexture: { value: new TextureLoader().load(texture) },
                    uColor: { value: new THREE.Color(color) },
                    uSizeAmp: { value: sizeAmp },
                    uSpeedAmp: { value: speedAmp },
                    uYTwistAmp: { value: yAmp },
                    uMouse: { value: new THREE.Vector3() },
                    time: { value: 0 },
                    resolution: { value: new THREE.Vector4() }
                },
                // wireframe: true,
                transparent: true,
                depthTest: false,
                vertexShader: barredSpiral,
                fragmentShader: fragment
            });

            // materialsRef.current.push(material)

            return { geometry: geo, material }
        })
    }, [layers])


    // Animation loop
    useFrame((state, delta) => {
        if (!groupRef.current) return

        meshes.forEach(mesh => {
            mesh.material.uniforms.time.value += 1
        })
    })

    return (
        <group ref={groupRef}>
            {meshes.map((mesh, index) => (
                <mesh key={index} geometry={mesh.geometry} material={mesh.material} />
            ))}
        </group>
    )
}

export default MilkyGalaxyComponent 
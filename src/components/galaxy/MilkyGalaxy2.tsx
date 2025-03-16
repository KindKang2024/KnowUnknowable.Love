import {useMemo, useRef} from 'react';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';
import {useControls} from 'leva';

interface MilkyGalaxy2Props {
    size?: number;
    colorInside?: string;
    colorOutside?: string;
    radius?: number;
    branches?: number;
    particleCount?: number;
    rotationSpeed?: number;
}

const vertexShader = `
    attribute float aScale;
    attribute float aRadiusRatio;
    attribute float aBranchIndex;
    attribute vec3 aRandomOffset;
    
    uniform float uTime;
    uniform float uSize;
    uniform vec3 uColorInside;
    uniform vec3 uColorOutside;
    uniform float uRadius;
    uniform float uBranches;
    uniform float uRotationSpeed;
    
    varying vec3 vColor;
    varying vec2 vUv;
    
    const float PI = 3.141592653589793;
    const float PI2 = PI * 2.0;
    
    void main() {
        // Calculate particle scale (equivalent to range(0, 1).mul(size))
        float particleScale = aScale * uSize;
        
        // Calculate radius (equivalent to radiusRatio.pow(1.5).mul(5))
        float radius = pow(aRadiusRatio, 1.5) * uRadius;
        
        // Calculate branch angle (equivalent to range(0, branches).floor().mul(PI2.div(branches)))
        float branchAngle = (aBranchIndex * PI2) / uBranches;
        
        // Calculate rotation angle (equivalent to branchAngle.add(time.mul(radiusRatio.oneMinus())))
        float rotationAngle = branchAngle + uTime * uRotationSpeed * (1.0 - aRadiusRatio);
        
        // Calculate base position (equivalent to vec3(cos(angle), 0, sin(angle)).mul(radius))
        vec3 basePosition = vec3(
            cos(rotationAngle),
            0.0,
            sin(rotationAngle)
        ) * radius;
        
        // Add random offset (equivalent to randomOffset.mul(radiusRatio).add(0.2))
        vec3 offset = aRandomOffset * aRadiusRatio + 0.2;
        vec3 finalPosition = basePosition + offset;
        
        // Transform position
        vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
        mvPosition.xyz += position * particleScale;
        gl_Position = projectionMatrix * mvPosition;
        
        // Color calculation (equivalent to mix(colorInside, colorOutside, radiusRatio.oneMinus().pow(2).oneMinus()))
        float colorMix = 1.0 - pow(1.0 - aRadiusRatio, 2.0);
        vColor = mix(uColorOutside, uColorInside, colorMix);
        
        // UV for alpha calculation
        vUv = position.xy + vec2(0.5);
    }
`;

const fragmentShader = `
    varying vec3 vColor;
    varying vec2 vUv;
    
    void main() {
        // Calculate alpha (equivalent to float(0.1).div(uv().sub(0.5).length()).sub(0.2))
        float d = length(vUv - 0.5);
        if (d > 0.5) discard;
        float alpha = 0.1 / d - 0.2;
        gl_FragColor = vec4(vColor, alpha);
    }
`;

const MilkyGalaxy2 = ({
    size: sizeProp,
    colorInside: colorInsideProp,
    colorOutside: colorOutsideProp,
    radius: radiusProp,
    branches: branchesProp,
    particleCount: particleCountProp,
    rotationSpeed: rotationSpeedProp
}: MilkyGalaxy2Props = {}) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // GUI controls with props as initial values
    const {
        size,
        colorInside,
        colorOutside,
        radius,
        branches,
        particleCount,
        rotationSpeed
    } = useControls('Galaxy', {
        size: { value: sizeProp ?? 0.08, min: 0, max: 1, step: 0.001 },
        colorInside: { value: colorInsideProp ?? '#ffa575' },
        colorOutside: { value: colorOutsideProp ?? '#311599' },
        radius: { value: radiusProp ?? 5.0, min: 0.1, max: 20.0, step: 0.1 },
        branches: { value: branchesProp ?? 3, min: 2, max: 12, step: 1 },
        particleCount: { value: particleCountProp ?? 20000, min: 1000, max: 100000, step: 1000 },
        rotationSpeed: { value: rotationSpeedProp ?? 1.0, min: 0, max: 5.0, step: 0.1 }
    });

    // Use props if provided, otherwise use control values
    const finalValues = {
        size: sizeProp ?? size,
        colorInside: colorInsideProp ?? colorInside,
        colorOutside: colorOutsideProp ?? colorOutside,
        radius: radiusProp ?? radius,
        branches: branchesProp ?? branches,
        particleCount: particleCountProp ?? particleCount,
        rotationSpeed: rotationSpeedProp ?? rotationSpeed
    };

    // Create geometry and material
    const [geometry, material] = useMemo(() => {
        const planeGeometry = new THREE.PlaneGeometry(1, 1);
        const instancedGeometry = new THREE.InstancedBufferGeometry();

        // Copy base attributes
        Object.keys(planeGeometry.attributes).forEach(key => {
            instancedGeometry.setAttribute(key, planeGeometry.attributes[key]);
        });
        instancedGeometry.index = planeGeometry.index;

        // Create instance attributes
        const count = finalValues.particleCount;
        const scales = new Float32Array(count);
        const radiusRatios = new Float32Array(count);
        const branchIndices = new Float32Array(count);
        const randomOffsets = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Scale (0-1)
            scales[i] = Math.random();

            // Radius ratio (0-1)
            radiusRatios[i] = Math.random();

            // Branch index (0 to branches-1)
            branchIndices[i] = Math.floor(Math.random() * finalValues.branches);

            // Random offset (equivalent to range(vec3(-1), vec3(1)).pow(3))
            randomOffsets[i * 3] = Math.pow((Math.random() * 2 - 1), 3);
            randomOffsets[i * 3 + 1] = Math.pow((Math.random() * 2 - 1), 3);
            randomOffsets[i * 3 + 2] = Math.pow((Math.random() * 2 - 1), 3);
        }

        instancedGeometry.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1));
        instancedGeometry.setAttribute('aRadiusRatio', new THREE.InstancedBufferAttribute(radiusRatios, 1));
        instancedGeometry.setAttribute('aBranchIndex', new THREE.InstancedBufferAttribute(branchIndices, 1));
        instancedGeometry.setAttribute('aRandomOffset', new THREE.InstancedBufferAttribute(randomOffsets, 3));

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: finalValues.size },
                uColorInside: { value: new THREE.Color(finalValues.colorInside) },
                uColorOutside: { value: new THREE.Color(finalValues.colorOutside) },
                uRadius: { value: finalValues.radius },
                uBranches: { value: finalValues.branches },
                uRotationSpeed: { value: finalValues.rotationSpeed }
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        return [instancedGeometry, material];
    }, [finalValues]);

    // Animation
    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
            materialRef.current.uniforms.uSize.value = finalValues.size;
            materialRef.current.uniforms.uColorInside.value.set(finalValues.colorInside);
            materialRef.current.uniforms.uColorOutside.value.set(finalValues.colorOutside);
            materialRef.current.uniforms.uRadius.value = finalValues.radius;
            materialRef.current.uniforms.uBranches.value = finalValues.branches;
            materialRef.current.uniforms.uRotationSpeed.value = finalValues.rotationSpeed;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[geometry, material, finalValues.particleCount]}>
            <primitive object={material} ref={materialRef} attach="material" />
        </instancedMesh>
    );
};

export default MilkyGalaxy2; 
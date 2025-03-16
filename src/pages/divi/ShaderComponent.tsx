import {useEffect, useMemo, useState} from 'react';
import * as THREE from 'three';
import {useFrame, useThree} from '@react-three/fiber';
// @ts-ignore
import noise3d from '@/assets/aa.bin';

function ShaderComponent() {
    // State to hold the 3D texture
    const [texture, setTexture] = useState(null);

    // Get canvas size from React Three Fiber
    const { size } = useThree();

    // Load the 3D texture from a binary file
    useEffect(() => {
        const loadTexture = async () => {
            try {
                const data = new Uint8Array(noise3d);

                // Create a 3D texture (assuming 32x32x32 grayscale)
                const tex = new THREE.Data3DTexture(data, 32, 32, 32);
                tex.format = THREE.RedFormat; // Single-channel (red)
                tex.type = THREE.UnsignedByteType;
                tex.minFilter = THREE.LinearFilter;
                tex.magFilter = THREE.LinearFilter;
                tex.unpackAlignment = 1; // Ensure proper byte alignment
                tex.needsUpdate = true;

                setTexture(tex);
            } catch (error) {
                console.error('Failed to load 3D texture:', error);
            }
        };
        loadTexture();
    }, []);

    // Define uniforms
    const uniforms = useMemo(
        () => ({
            iResolution: { value: new THREE.Vector3(size.width, size.height, 1.0) },
            iTime: { value: 0 },
            iChannel0: { value: texture },
        }),
        [size, texture]
    );

    // Update time uniform each frame
    useFrame((state) => {
        uniforms.iTime.value = state.clock.getElapsedTime() / 4; // Match Shadertoy scaling
    });

    // Update resolution if canvas size changes
    useEffect(() => {
        uniforms.iResolution.value.set(size.width, size.height, 1.0);
    }, [size, uniforms]);

    // Vertex shader (simple pass-through for full-screen quad)
    const vertexShader = `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
  `;

    // Fragment shader (adapted from Shadertoy)
    const fragmentShader = `
    uniform vec3 iResolution;
    uniform float iTime;
    uniform sampler3D iChannel0;
    varying vec2 vUv;
    
    #define N(p) texture(iChannel0,(p)/1.9).r
    #define A  (mix( x*dot(p,x), p, -cos(t) ) + sin(t) *cross(p,x))
    
    void main() {
        // Map Shadertoy's C (pixel coordinates) to gl_FragCoord
        vec2 C = gl_FragCoord.xy;
        vec4 O = vec4(0.0);
        
        vec3 x = vec3(.22,.97,0),
             r = iResolution,
             d = vec3(C+C-r.xy,-r)/r.x,
             p=x-x, o = p;
        
        float R,a=.03,i=a,t=iTime;
        for(p.z=4., p+=d; i++<200.; p += d/40. ) {
            a *= min(R=dot(p,p),.2)/.2;
            o += (1.-d) * (N(A)+N(A*.3)-.5)
                  * a / max(A*A*400.,R).y/R;
            d -= p/400./R/R;
        }
        
        p = d/length(d)/.1;
        O.gbr = max(o,(N(A)-.75)*a*100.);
        
        gl_FragColor = O;
    }
  `;

    // Don't render until texture is loaded
    if (!texture) return null;

    return (
        <mesh>
            <planeGeometry args={[2, 2]} /> {/* Full-screen quad */}
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
            />
        </mesh>
    );
}

export default ShaderComponent;
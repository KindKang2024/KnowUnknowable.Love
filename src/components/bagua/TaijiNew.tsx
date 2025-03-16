import {useRef} from 'react';
import * as THREE from 'three';
import {shaderMaterial} from '@react-three/drei';
import {extend, useFrame} from '@react-three/fiber';

// Add type declarations for the shader material
declare global {
    namespace JSX {
        interface IntrinsicElements {
            taijiShaderMaterial: any
        }
    }
}

const TaijiShaderMaterial = shaderMaterial(
    {
        u_time: 0,
        u_resolution: new THREE.Vector2(1, 1),
    },
    // Vertex shader
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment shader
    `
    precision mediump float;

    uniform vec2 u_resolution;
    uniform float u_time;

    #define SMOOTH(t, x) smoothstep(t - EPSILON*0.5, t + EPSILON*0.5, x)
    #define SMOOTHR(t, x) smoothstep(t + EPSILON*0.5, t - EPSILON*0.5, x)
    #define WHITE_CIRCLE(r, o) SMOOTHR((r)*0.5, length(uv - o))
    #define BLACK_CIRCLE(r, o) SMOOTH((r)*0.5, length(uv - o))
    #define BIG_CIRCLE_RADIUS 1.8
    #define SMALL_CIRCLE_RADIUS 0.3
    #define STROKE_WIDTH 0.02
    #define EPSILON 0.01

    void main() {
      vec2 uv = gl_FragCoord.xy/u_resolution.xy;
      uv = uv*2. - 1.;
      const vec2 center = vec2(0.0);
      float v = 0.0;
      v += WHITE_CIRCLE(BIG_CIRCLE_RADIUS*2.0, center) * SMOOTH(0.0, uv.x);
      v += BLACK_CIRCLE(BIG_CIRCLE_RADIUS*2.0 + STROKE_WIDTH, center);
      vec2 centerTop = center + vec2(0.0, BIG_CIRCLE_RADIUS/2.0);
      vec2 centerBottom = center + vec2(0.0, -BIG_CIRCLE_RADIUS/2.0);
      v += WHITE_CIRCLE(BIG_CIRCLE_RADIUS, centerTop);
      v *= BLACK_CIRCLE(BIG_CIRCLE_RADIUS, centerBottom);
      v += WHITE_CIRCLE(SMALL_CIRCLE_RADIUS, centerBottom);
      v *= BLACK_CIRCLE(SMALL_CIRCLE_RADIUS, centerTop);
      gl_FragColor = vec4(v, v, v, 1.0);
    }
  `
);

// Register the shader material
extend({ TaijiShaderMaterial });

interface TaijiNewProps {
    position?: [number, number, number];
    scale?: [number, number, number];
}

const TaijiNew = ({ position = [0, 0, 0], scale = [1, 1, 1] }: TaijiNewProps) => {
    const materialRef = useRef<any>();

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.u_time = clock.getElapsedTime();
        }
    });

    return (
        <mesh position={position} scale={scale}>
            <planeGeometry args={[2, 2]} />
            <taijiShaderMaterial ref={materialRef} />
        </mesh>
    );
};

export default TaijiNew; 
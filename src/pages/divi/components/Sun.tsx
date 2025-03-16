import {AdditiveBlending, ShaderMaterial, Vector3} from "three";
import {useFrame} from "@react-three/fiber";
import {Sphere} from "@react-three/drei";
import {useMemo, useRef} from "react";

interface SunProps {
  position: Vector3 | [number, number, number];
  radius: number;
}

const vertexShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 eyeVector;

void main() {
    vNormal = normal;
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    eyeVector = normalize(worldPosition.xyz - cameraPosition);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 eyeVector;

//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  // Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

float surface(vec3 coord) {
    float n = 0.0;
    
    n += 0.5 * abs(snoise(coord * 8.0 + time * 0.3));
    n += 0.25 * abs(snoise(coord * 16.0 + time * 0.3));
    n += 0.125 * abs(snoise(coord * 32.0 + time * 0.3));
    n += 0.0625 * abs(snoise(coord * 64.0 + time * 0.3));
    
    return n;
}

void main() {
    float n = surface(vPosition);
    
    vec3 sunColor1 = vec3(1.0, 0.7, 0.3);  // Warm yellow
    vec3 sunColor2 = vec3(1.0, 0.3, 0.0);  // Orange-red
    
    vec3 color = mix(sunColor1, sunColor2, n);
    
    // Add Fresnel effect for edge glow
    float fresnel = pow(1.0 + dot(eyeVector, vNormal), 3.0);
    color = mix(color, vec3(1.0, 0.6, 0.2), fresnel * 0.6);
    
    gl_FragColor = vec4(color, 1.0);
}`;

export default function Sun({ position, radius }: SunProps) {
  const materialRef = useRef<ShaderMaterial>();

  // Create shader material
  const shaderMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: AdditiveBlending,
    });
  }, []);

  // Animate shader
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <>
      <pointLight
        position={position}
        intensity={2}
        distance={100}
        decay={2}
        color="#FDB813"
      />
      <mesh position={position}>
        <Sphere args={[radius, 64, 64]}>
          <primitive object={shaderMaterial} ref={materialRef} attach="material" />
        </Sphere>
      </mesh>
      <mesh position={position}>
        <Sphere args={[radius * 1.1, 32, 32]}>
          <meshBasicMaterial color="#FDB813" transparent opacity={0.1} blending={AdditiveBlending} />
        </Sphere>
      </mesh>
      <mesh position={position}>
        <Sphere args={[radius * 1.2, 32, 32]}>
          <meshBasicMaterial color="#FDB813" transparent opacity={0.05} blending={AdditiveBlending} />
        </Sphere>
      </mesh>
    </>
  );
}

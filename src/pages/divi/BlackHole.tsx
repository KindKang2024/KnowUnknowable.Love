import * as THREE from 'three';
import React, {useMemo, useRef} from 'react';
import {useFrame, useThree} from '@react-three/fiber';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
uniform vec3 iResolution;
uniform float iTime;
uniform float zoom;

varying vec2 vUv;

const float pi = 3.1415927;
const float R = 0.08;
const float ISCO = 3.0;
const float ICO = 1.5;
const vec3 c1 = vec3(0.05, 1.0, 0.0);
const vec3 c2 = vec3(0.05, 1.0, 2.25);

// # pure red
// const vec3 c1 = vec3(0.01, .0, 0.1);
// const vec3 c2 = vec3(0.15, 0.1, 0.2);



// const vec3 c1 = vec3(0.05, 1.0, 0.0), c2 = vec3(0.05, 1.0, 2.25);

vec2 rotate(vec2 p, float a) {
  return cos(a) * p + sin(a) * vec2(p.y, -p.x);
}

float hash(float n) { return fract(sin(n) * 753.5453123); }
float noise(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n = p.x + p.y * 157.0 + 113.0 * p.z;
  return mix(
    mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
        mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
    mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
        mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y), f.z);
}

vec3 HSV2RGB(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 getCor(float r, vec3 p, vec3 camray) {
  float d = (r - R * ISCO);
  float w = 0.01 / (d * d * d + 0.001);
  float v = w * r * dot(cross(p / r, vec3(0., -1., 0.)), camray);
  p.xz = rotate(p.xz, (1.1 + (d * 0.1) * w) * (iTime + 15.0));
  vec3 cor = mix(c1, c2, 1.8 * noise(vec3(p.xz * 15., r * 15. + iTime * 3.5))) * mix(0.0, 1.0, smoothstep(0., 0.1, d));
  cor.xz *= mix(1.25, 0., d / (R * 14. - R * ISCO));
  cor.x *= 1.0 / (1.0 - 0.2 * v);
  cor.z *= mix(0., 3.0, cor.x * 4.0);
  return HSV2RGB(cor);
}

float sphere(vec3 p, vec3 o, float r) {
  return smoothstep(0.0, -r, (length(p - o) - r));
}

float cone(vec3 p, vec3 o1, vec3 o2, float r1, float r2) {
  p.xy = rotate(p.xy, (0.1) * sin(p.y + 15.0 + iTime * 5.1));
  vec3 ux = vec3(1., 0., 0.);
  vec3 uy = normalize(o2 - o1);
  vec3 uz = normalize(cross(ux, uy));
  ux = cross(uy, uz);
  vec3 op = p - o1;
  vec3 pp = vec3(dot(op, ux), dot(op, uy), dot(op, uz));
  float fh = pp.y / (o2.y - o1.y);
  if (fh > 0. && fh < 1.) {
    float r = mix(r1, r2, (pp.y / (o2.y - o1.y)));
    if (length(pp.xz) < r) return 1.0;
  }
  return 0.;
}


bool shadow(vec3 p) {
  vec3 v = vec3(0., -0.01, 0.01);
  for (int i = 0; i < 20; i++) {
    p += v;
    float f1 = cone(p, vec3(0., 0., 0.), vec3(0., 0.5, -0.5), 0.25, 0.5);
    float f2 = cone(p, vec3(0., 0.5, -0.5), vec3(0.21, 2., 0.0), 0.25, 0.5);
    if (f1 + f2 > 0.0) return true;
  }
  return false;
}

vec3 shade(vec3 p, float v) {
  // vec3 cor = vec3(0.2, 0.7, 0.9);
  vec3 cor = vec3(0.2, 0.2, 0.2);
  cor = mix(cor, vec3(0.), -normalize(p).z);
  if (shadow(p)) return cor * 0.5;
  return cor;
}

void main() {
  vec2 pp = (-iResolution.xy + 2.0 * vUv * iResolution.xy) / iResolution.y;
  float eyer = 1.5;
  float eyea = .0;
  float eyef = (0.0 - 0.24) * pi * 2.0;

  vec3 cam = vec3(
    eyer * cos(eyea) * sin(eyef),
    eyer * cos(eyef),
    eyer * sin(eyea) * sin(eyef)
  );

  vec3 front = normalize(-cam);
  vec3 left = normalize(cross(normalize(vec3(0.0, 1, -0.5)), front));
  vec3 up = normalize(cross(front, left));
  vec3 v = normalize(front * 1.5 + left * pp.x + up * pp.y);

  vec3 p = cam;
  float dt = 0.01;
  vec4 cor = vec4(0.0);

  for (int i = 0; i < 400; i++) {
    float r = length(p);
    float rr = length(p.xz);
    if (r > R) {
      dt = mix(0.004, 0.02, smoothstep(0., 0.05, abs(p.y)));
      float f = R / (r * r);
      float n = 1.5 / (1.0 - R / r);
      f = n * f;
      vec3 a = normalize(p) * (-f);
      v += a * dt;
      vec3 np = p + (v / n) * dt;
      if (np.y * p.y < 0.) {
        if (r >= R * ISCO && r <= R * 13.) {
          cor = vec4(getCor(r, np, front), 1.0);
          break;
        }
      }
      p = np;
    }
  }
  gl_FragColor = cor;
}
`;

function BlackHole({ position = [0, 0, 0], scale = 1 }) {
  const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null);
  const { camera, size, mouse } = useThree();

  // Define the material with uniforms
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        iResolution: { value: new THREE.Vector3(size.width, size.height, 1) },
        iTime: { value: 0 },
        zoom: { value: 1.0 },
      },
      transparent: true, // Enable transparency
    });
  }, [size.width, size.height]);

  // Create plane geometry
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  // const geometry = useMemo(() => new THREE.SphereGeometry(1, 1), []);

  // Update the billboard every frame
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Update time uniform
      meshRef.current.material.uniforms.iTime.value = clock.getElapsedTime();

      // Update mouse uniform (mapped to screen space)
      // const mouseX = (mouse.x + 1) * size.width * 0.5;
      // const mouseY = (mouse.y + 1) * size.height * 0.5;
      // meshRef.current.material.uniforms.iMouse.value.set(mouseX, mouseY, 0, 0);
      meshRef.current.material.uniforms.zoom.value = 1.0;

      // Make the plane face the camera
      meshRef.current.lookAt(camera.position);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position as unknown as THREE.Vector3}
      scale={[scale, scale, scale]}
    />
  );
}

export default BlackHole;
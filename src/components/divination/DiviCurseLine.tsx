import {useEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {useFrame, useThree} from '@react-three/fiber';

interface DiviCurseLineProps {
    shaderPoints?: number;
    curvePoints?: number;
    curveLerp?: number;
    radius1?: number;
    radius2?: number;
    velocityTreshold?: number;
    sleepRadiusX?: number;
    sleepRadiusY?: number;
    sleepTimeCoefX?: number;
    sleepTimeCoefY?: number;
}


const defaultConfig = {
    shaderPoints: 8,
    curvePoints: 80,
    curveLerp: 0.75,
    radius1: 3,
    radius2: 5,
    velocityTreshold: 10,
    sleepRadiusX: 150,
    sleepRadiusY: 150,
    sleepTimeCoefX: 0.0025,
    sleepTimeCoefY: 0.0025
};

// Vertex shader with line thickness and proper line segments
const vertexShader = `
   varying vec2 vUv;
   void main() {
     vUv = uv;
     gl_Position = vec4(position, 1.0);
   } 
`;

// Fragment shader with smooth line and glow effect
const fragmentShader = `
    // https://www.shadertoy.com/view/wdy3DD
    // https://www.shadertoy.com/view/MlKcDD
    // Signed distance to a quadratic bezier
    float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C) {
      vec2 a = B - A;
      vec2 b = A - 2.0*B + C;
      vec2 c = a * 2.0;
      vec2 d = A - pos;
      float kk = 1.0 / dot(b,b);
      float kx = kk * dot(a,b);
      float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;
      float kz = kk * dot(d,a);
      float res = 0.0;
      float p = ky - kx*kx;
      float p3 = p*p*p;
      float q = kx*(2.0*kx*kx - 3.0*ky) + kz;
      float h = q*q + 4.0*p3;
      if(h >= 0.0){
        h = sqrt(h);
        vec2 x = (vec2(h, -h) - q) / 2.0;
        vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
        float t = uv.x + uv.y - kx;
        t = clamp( t, 0.0, 1.0 );
        // 1 root
        vec2 qos = d + (c + b*t)*t;
        res = length(qos);
      } else {
        float z = sqrt(-p);
        float v = acos( q/(p*z*2.0) ) / 3.0;
        float m = cos(v);
        float n = sin(v)*1.732050808;
        vec3 t = vec3(m + m, -n - m, n - m) * z - kx;
        t = clamp( t, 0.0, 1.0 );
        // 3 roots
        vec2 qos = d + (c + b*t.x)*t.x;
        float dis = dot(qos,qos);
        res = dis;
        qos = d + (c + b*t.y)*t.y;
        dis = dot(qos,qos);
        res = min(res,dis);
        qos = d + (c + b*t.z)*t.z;
        dis = dot(qos,qos);
        res = min(res,dis);
        res = sqrt( res );
      }
      return res;
    }

    uniform vec2 uRatio;
    uniform vec2 uSize;
    uniform vec2 uPoints[SHADER_POINTS];
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      float intensity = 1.0;
      float radius = 0.015;

      vec2 pos = (vUv - 0.5) * uRatio;

      vec2 c = (uPoints[0] + uPoints[1]) / 2.0;
      vec2 c_prev;
      float dist = 10000.0;
      for(int i = 0; i < SHADER_POINTS - 1; i++){
        c_prev = c;
        c = (uPoints[i] + uPoints[i + 1]) / 2.0;
        dist = min(dist, sdBezier(pos, c_prev, uPoints[i], c));
      }
      dist = max(0.0, dist);

      float glow = pow(uSize.y / dist, intensity);
      vec3 col = vec3(0.0);
      col += 10.0 * vec3(smoothstep(uSize.x, 0.0, dist));
      col += glow * uColor;

      // Tone mapping
      col = 1.0 - exp(-col);
      col = pow(col, vec3(0.4545));
  
      gl_FragColor = vec4(col, 1.0);
    }
`;

export const DiviCurseLine: React.FC<DiviCurseLineProps> = (props) => {
    const config = { ...defaultConfig, ...props };
    const { size, pointer, clock } = useThree();
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const hover = useRef(false);
    const velocity = useRef(new THREE.Vector3());
    const velocityTarget = useRef(new THREE.Vector3());

    // Initialize points and spline
    const { points, spline, uPoints, uRatio, uSize, uColor } = useMemo(() => {
        const points = new Array(config.curvePoints).fill(0).map(() => new THREE.Vector2());
        const spline = new THREE.SplineCurve(points);
        const uPoints = new Array(config.shaderPoints).fill(0).map(() => new THREE.Vector2());
        const uRatio = new THREE.Vector2();
        const uSize = new THREE.Vector2();
        const uColor = new THREE.Color(0xff00ff);

        return { points, spline, uPoints, uRatio, uSize, uColor };
    }, [config.curvePoints, config.shaderPoints]);

    // Create shader material with additional uniforms
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uPoints: { value: uPoints },
                uColor: { value: uColor },
                uSize: { value: uSize },
                uRatio: { value: uRatio },
                uThickness: { value: 0.02 },  // Line thickness
                uGlow: { value: 0.5 }        // Glow intensity
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
    }, [uPoints, uColor, uSize, uRatio]);

    // Handle resize
    useEffect(() => {
        const { width, height } = size;
        uSize.set(config.radius1, config.radius2);
        if (width >= height) {
            uRatio.set(1, height / width);
            uSize.multiplyScalar(1 / width);
        } else {
            uRatio.set(width / height, 1);
            uSize.multiplyScalar(1 / height);
        }
        if (materialRef.current) {
            materialRef.current.uniforms.uSize.value = uSize;
            materialRef.current.uniforms.uRatio.value = uRatio;
        }
    }, [size, config.radius1, config.radius2, uSize, uRatio]);

    // Animation frame updates
    useFrame(() => {
        if (!groupRef.current || !materialRef.current) return;

        // Update curve points
        for (let i = 1; i < config.curvePoints; i++) {
            points[i].lerp(points[i - 1], config.curveLerp);
        }

        // Update shader points
        for (let i = 0; i < config.shaderPoints; i++) {
            spline.getPoint(i / (config.shaderPoints - 1), uPoints[i]);
        }

        if (!hover.current) {
            // Sleep animation
            const t1 = clock.getElapsedTime() * config.sleepTimeCoefX;
            const t2 = clock.getElapsedTime() * config.sleepTimeCoefY;
            const cos = Math.cos(t1);
            const sin = Math.sin(t2);
            const r1 = config.sleepRadiusX * size.width / size.width;
            const r2 = config.sleepRadiusY * size.width / size.width;
            const x = r1 * cos;
            const y = r2 * sin;
            spline.points[0].set(x, y);
            uColor.r = 0.5 + 0.5 * Math.cos(clock.getElapsedTime() * 0.0015);
            uColor.g = 0;
            uColor.b = 1 - uColor.r;
        } else {
            // Active animation
            uColor.r = velocity.current.z;
            uColor.g = 0;
            uColor.b = 1 - velocity.current.z;
            velocity.current.multiplyScalar(0.95);
        }

        // Update uniforms
        materialRef.current.uniforms.uPoints.value = uPoints;
        materialRef.current.uniforms.uColor.value = uColor;
    });

    // Handle pointer movement
    const handlePointerMove = (event: THREE.Event & { movementX?: number; movementY?: number }) => {
        hover.current = true;
        const x = (0.5 * pointer.x) * uRatio.x;
        const y = (0.5 * pointer.y) * uRatio.y;
        spline.points[0].set(x, y);

        const deltaX = event.movementX || 0;
        const deltaY = event.movementY || 0;
        const delta = new THREE.Vector2(deltaX, deltaY);
        velocityTarget.current.x = Math.min(velocity.current.x + Math.abs(delta.x) / config.velocityTreshold, 1);
        velocityTarget.current.y = Math.min(velocity.current.y + Math.abs(delta.y) / config.velocityTreshold, 1);
        velocityTarget.current.z = Math.sqrt(
            velocityTarget.current.x * velocityTarget.current.x +
            velocityTarget.current.y * velocityTarget.current.y
        );
        velocity.current.lerp(velocityTarget.current, 0.05);
    };

    const handlePointerLeave = () => {
        hover.current = false;
    };

    return (
        <group
            ref={groupRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            <mesh>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={config.shaderPoints - 1}
                        array={new Float32Array(config.shaderPoints - 1)}
                        itemSize={1}
                    />
                    <bufferAttribute
                        attach="attributes-uv"
                        count={config.shaderPoints * 2}
                        array={new Float32Array(config.shaderPoints * 2)}
                        itemSize={2}
                    />
                    <bufferAttribute
                        attach="attributes-normal"
                        count={config.shaderPoints}
                        array={new Float32Array(config.shaderPoints * 2)}
                        itemSize={2}
                    />
                </bufferGeometry>
                <primitive object={shaderMaterial} ref={materialRef} attach="material" />
            </mesh>
        </group>
    );
};

export default DiviCurseLine; 
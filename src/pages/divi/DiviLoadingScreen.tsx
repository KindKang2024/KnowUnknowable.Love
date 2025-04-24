import {useProgress} from "@react-three/drei";
import {useEffect, useState} from "react";
import {Shader} from 'react-shaders'


// https://www.shadertoy.com/view/ttByDR
const code = `
#define ROT(p, a) p=cos(a)*p+sin(a)*vec2(p.y, -p.x)

const float pi = 3.1415927;
const float R = 0.08;
const float ISCO = 3.0;
const vec3 c1 = vec3(0.05, 1.0, 0.0), c2 = vec3(0.05, 1.0, 2.25);

// iq's noise    
float hash(float n) { return fract(sin(n)*753.5453123); }
float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix(hash(n+0.0), hash(n+1.0),f.x),
                   mix(hash(n+157.0), hash(n+158.0),f.x),f.y),
               mix(mix(hash(n+113.0), hash(n+114.0),f.x),
                   mix(hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

vec3 HSV2RGB(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 getCor(float r, vec3 p, vec3 camray) {
    float d = (r - R * ISCO);
    float w = 0.01 / (d*d*d + 0.001);
    float v = w * r * dot(cross(p / r, vec3(0.,-1.,0.)), camray);
    ROT(p.xz, (1.1 + (d * 0.1)*w) * (iTime + 15.0));
    vec3 cor = mix(c1, c2, 1.8 * noise(vec3(p.xz*15., r*15. + iTime*3.5))) * mix(0.0, 1.0, smoothstep(0., 0.1, d));
    cor.xz *= mix(1.25, 0., d / (R * 14. - R * ISCO));
    cor.x *= 1.0 / (1.0 - 0.2*v); // Doppler effect
    cor.z *= mix(0., 3.0, cor.x * 4.0);
    return HSV2RGB(cor);
}

vec3 glowingDot(vec2 uv, vec2 center, float baseRadius, float timeOffset, vec2 resolution) {
    vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
    vec2 adjustedUV = uv * aspect;
    vec2 adjustedCenter = center * aspect;
    
    float dist = length(adjustedUV - adjustedCenter);
    float pulse = 0.5 + 0.5 * sin(iTime * 2.0 + timeOffset); // 呼吸效果
    float radius = baseRadius * (1.0 + 0.2 * pulse); // 半径随时间变化
    float glow = smoothstep(radius, radius * 0.5, dist); // 光晕渐变
    float hue = fract(iTime * 0.1 + timeOffset);     // 颜色变化
    vec3 color = HSV2RGB(vec3(hue, 1.0, 1.0));       // HSV 转 RGB
    return color * glow;                             // 返回发光颜色
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 pp = (-iResolution.xy + 2.0*fragCoord.xy) / iResolution.y;
    float eyer = 1.5;
    float eyea = -(0. / iResolution.x) * pi * 2.0;
    float eyef = ((0. / iResolution.y) - 0.24) * pi * 2.0;
    
    vec3 cam = vec3(
        eyer * cos(eyea) * sin(eyef),
        eyer * cos(eyef),
        eyer * sin(eyea) * sin(eyef));
    
    vec3 front = normalize(-cam);
    vec3 left = normalize(cross(normalize(vec3(0.0, 1, -0.5)), front));
    vec3 up = normalize(cross(front, left));
    vec3 v = normalize(front*1.5 + left*pp.x + up*pp.y);
    
    vec3 p = cam;
    float dt = 0.01;
    vec3 cor = vec3(0.0);
    
    for(int i = 0; i < 400; i++) {
        float r = length(p);
        if(r > R) {
            dt = mix(0.004, 0.02, smoothstep(0., 0.05, abs(p.y)));
            float f = R / (r*r);
            float n = 1.5 / (1.0 - R/r);
            f = n * f;
            vec3 a = normalize(p) * (-f);
            v += a * dt;
            vec3 np = p + (v / n) * dt;
            if(np.y * p.y < 0.0) {
                if(r >= R * ISCO && r <= R * 13.0) {
                    cor = getCor(r, np, front);
                    break;
                }
            }
            p = np;
        } else {
            break;
        }
    }
    
    vec2 uv = fragCoord.xy / iResolution.xy; 
 
    vec3 dot1 = glowingDot(uv, vec2(0.46, 0.50), 0.02, 0.0, iResolution.xy);
    vec3 dot2 = glowingDot(uv, vec2(0.52, 0.56), 0.02, 2.0, iResolution.xy);
    vec3 dot3 = glowingDot(uv, vec2(0.53, 0.39), 0.02, 4.0, iResolution.xy);
    
    cor += dot1 + dot2 + dot3;
    
    fragColor = vec4(cor, 1.0);
}
`

interface DiviLoadingScreenProps {
    onLoadingComplete?: () => void;
    minDisplayTime?: number; // Minimum time to display the loading screen in ms
    quickLoadThreshold?: number; // Threshold in ms to determine if loading was "quick"
    loadingPhrase?: string ;
}

export const DiviLoadingScreen: React.FC<DiviLoadingScreenProps> = ({
    onLoadingComplete,
    minDisplayTime = 10000, 
    quickLoadThreshold = 1000,
    loadingPhrase = "Into the Unknowable..."
}) => {
    const { progress, active } = useProgress();
    const [loadingStartTime] = useState<number>(Date.now());
    const [loadingCompleteTime, setLoadingCompleteTime] = useState<number | null>(null);
    const [completionHandled, setCompletionHandled] = useState(false);


    // Handle progress reaching 100%
    useEffect(() => {
        
        if (progress >= 100 && !loadingCompleteTime) {
            const currentTime = Date.now();
            const loadingDuration = currentTime - loadingStartTime;
            setLoadingCompleteTime(currentTime);

            // If loading was quick (under threshold), complete immediately
            if (loadingDuration < quickLoadThreshold && !completionHandled) {
                setCompletionHandled(true);
                if (onLoadingComplete) onLoadingComplete();
            }
        }
    }, [progress, loadingCompleteTime, loadingStartTime, quickLoadThreshold, onLoadingComplete, completionHandled]);

    // Handle minimum display time for slower loads
    useEffect(() => {
        if (loadingCompleteTime && !completionHandled) {
            const loadingDuration = loadingCompleteTime - loadingStartTime;

            // If loading took longer than threshold, ensure we display for minimum time
            if (loadingDuration >= quickLoadThreshold) {
                const timeToWait = Math.max(0, minDisplayTime - loadingDuration);

                if (timeToWait <= 0) {
                    // We've already displayed for the minimum time
                    setCompletionHandled(true);
                    if (onLoadingComplete) onLoadingComplete();
                } else {
                    // Wait for the remaining time
                    const timeout = setTimeout(() => {
                        setCompletionHandled(true);
                        if (onLoadingComplete) onLoadingComplete();
                    }, timeToWait);

                    return () => clearTimeout(timeout);
                }
            }
        }
    }, [loadingCompleteTime, loadingStartTime, minDisplayTime, quickLoadThreshold, onLoadingComplete, completionHandled]);

    // Calculate a smoothed progress that never jumps too quickly
    const displayProgress = completionHandled && progress === 100 ? 100 : Math.min(progress, 95); // Cap at 95% until fully loaded

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
            {/* Animated rings */}
            <div className="w-128 h-128" style={{ display: 'none' }}>
                <div className="relative w-32 h-32 mb-8">
                    {/* Inner ring */}
                    <div className="absolute inset-0 border-2 border-purple-600 rounded-full animate-ping opacity-70"
                        style={{ animationDuration: '2s' }}></div>

                    {/* Middle ring */}
                    <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-ping opacity-60"
                        style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>

                    {/* Outer ring */}
                    <div className="absolute inset-0 border-2 border-indigo-400 rounded-full animate-ping opacity-50"
                        style={{ animationDuration: '4s', animationDelay: '1s' }}></div>

                    {/* Center circle */}
                    <div className="absolute inset-0 m-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full animate-pulse"></div>

                    {/* Rotating symbol */}
                    <div className="absolute inset-0 flex items-center justify-center animate-spin"
                        style={{ animationDuration: '8s' }}>
                        <div className="w-12 h-12 text-white text-3xl flex items-center justify-center">☯</div>
                    </div>
                </div>
            </div>

            <div className="w-128 h-128">
                <Shader fs={code} />
            </div>

            {/* Loading text */}
            <div className="text-center">
                <h2 className="text-xl font-medium text-white mb-2 h-8">
                    {loadingPhrase}
                </h2>

                {/* Progress bar */}
                <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mt-4">
                    <div
                        className="h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-300"
                        style={{ width: `${displayProgress}%` }}
                    ></div>
                </div>

                {/* Progress percentage */}
                <p className="text-white/70 mt-2 font-mono">
                    {Math.round(displayProgress)}%
                </p>
            </div>
        </div>
    );
};

export default DiviLoadingScreen; 
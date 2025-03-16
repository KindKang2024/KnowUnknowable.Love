


export const line_v = `
uniform float time;
uniform float amplitude;
uniform float frequency;
      
varying vec2 vUv;
varying float vElevation;
varying vec3 vPosition;
      
void main() {
  vUv = uv;
  vPosition = position;
  
  // Create a wave effect
  float wave = sin(position.x * frequency + time) * 
               cos(position.y * frequency + time) * amplitude;
               
  // Apply the wave to the z position for a ripple effect
  vec3 newPosition = position;
  newPosition.z += wave;
  
  vElevation = wave;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`

export const line_f = `
uniform vec3 color;
uniform float dashSize;
uniform float gapSize;
uniform float time;
uniform float colorShift;
uniform float dashCount;

varying vec2 vUv;
varying float vElevation;
varying vec3 vPosition;

void main(){
    float totalSize=dashSize+gapSize;
    float angle=atan(vUv.y-.5,vUv.x-.5)/(3.14159*2.)+.5;
    
    // Increase the multiplier to create more segments around the circle
    float modulo=mod(angle*dashCount+time*.2,1.);
    
    if(modulo>dashSize/totalSize){
        discard;
    }
    
    // Create a rainbow effect based on position and time
    vec3 colorVariation=vec3(
        sin(angle*6.28+time)*.5+.5,
        sin(angle*6.28+time+2.094)*.5+.5,
        sin(angle*6.28+time+4.188)*.5+.5
    );
    
    // Mix the base color with the rainbow effect
    vec3 finalColor=mix(color,colorVariation,colorShift);
    
    // Add glow based on elevation
    float glow=1.+abs(vElevation)*5.;
    
    gl_FragColor=vec4(finalColor*glow,1.);
}

`


export const divi_point_v = `
    attribute float aSize;
    attribute vec4 aRandom;
    attribute vec3 color;
                
    uniform float uTime;
    uniform float uSize;
                
    varying vec3 vColor;
    varying float vPulse;
    varying float vRandom;
                
    void main() {
        // Pass color and random values to fragment shader
        vColor = color;
        vRandom = aRandom.w;
        
        // Calculate animation with unique timing per particle
        float time = uTime * aRandom.z;
        
        // Pulsating effect for color only, not size
        float pulse = 0.5 + 0.5 * sin(time * 2.5 + aRandom.x * 5.0);
        vPulse = pulse;
        
        // Apply small position offset for subtle movement
        // vec3 pos = position;
        // pos.x += sin(time * 2.0) * aRandom.x * 0.08;
        // pos.y += cos(time * 2.0) * aRandom.y * 0.08;
        // pos.z += sin(time * 1.5) * (aRandom.x + aRandom.y) * 0.05;
        
        // Calculate position
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
        // All particles have exactly the same size - no pulse variation
        gl_PointSize = uSize * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }

`

export const divi_point_f = `
    varying vec3 vColor;
    varying float vPulse;
    varying float vRandom;
                
    uniform float uColorVariation;
    uniform float uGlowStrength;
    uniform float uTime;
                
    void main() {
        // Calculate distance from center of point
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);
        
        // Discard pixels outside of circle
        if (dist > 0.5) discard;
        
        // Create more dramatic soft edge with dynamic inner glow
        float alpha = smoothstep(0.5, 0.15, dist);
        
        // Add stronger glow effect with time variation
        float glow = uGlowStrength * smoothstep(0.5, 0.02, dist) * (0.8 + 0.4 * sin(uTime * 2.0 + vRandom * 10.0));
        
        // Create a radial color gradient effect
        vec3 innerColor = vColor * 1.5; // Brighter center
        vec3 outerColor = vColor * 0.8; // Darker edge
        vec3 gradientColor = mix(innerColor, outerColor, smoothstep(0.0, 0.5, dist));
        
        // Enhance color based on pulse and glow
        vec3 finalColor = gradientColor * (1.0 + 0.5 * vPulse + glow);
        
        // Add more dramatic sparkle effect
        float sparkle = pow(1.0 - dist, 8.0) * (0.8 + 0.6 * sin(uTime * 10.0 + vRandom * 30.0));
        finalColor += sparkle * vec3(1.0, 1.0, 1.0);
        
        // Add a subtle halo effect
        float haloEffect = smoothstep(0.35, 0.45, dist) * 0.9;
        finalColor += haloEffect * vec3(0.9, 0.95, 1.0) * vPulse;
        
        // Add a subtle color shift based on time
        float timeShift = sin(uTime * 0.2 + vRandom * 5.0) * 0.1;
        finalColor.r += timeShift;
        finalColor.b -= timeShift;
        
        // Output final color with alpha
        gl_FragColor = vec4(finalColor, alpha);
    }

`   
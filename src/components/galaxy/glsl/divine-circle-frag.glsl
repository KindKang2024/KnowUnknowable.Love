uniform float opacity;
uniform float time;
uniform float noiseScale;
uniform float flowSpeed;
uniform float pulseSpeed;
uniform vec3 glowColor;
varying vec2 vUv;

// Improved noise function
float random(vec2 st){
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

// Value noise
float noise(vec2 st){
    vec2 i=floor(st);
    vec2 f=fract(st);
    
    float a=random(i);
    float b=random(i+vec2(1.,0.));
    float c=random(i+vec2(0.,1.));
    float d=random(i+vec2(1.,1.));
    
    vec2 u=f*f*(3.-2.*f);
    return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}

void main(){
    float angle=atan(vUv.y-.5,vUv.x-.5);
    float radius=length(vUv-.5);
    
    // Create multiple layers of noise for particle effect
    vec2 noisePos=vec2(angle*noiseScale+time*flowSpeed,radius*10.+time*.5);
    float n1=noise(noisePos);
    float n2=noise(noisePos*2.+5.);
    float n3=noise(noisePos*4.+10.);
    
    // Combine noise layers with different frequencies
    float finalNoise=n1*.5+n2*.3+n3*.2;
    
    // Create sparkle effect
    float sparkle=pow(finalNoise,3.)*2.;
    
    // Add time-based shimmer and pulse
    float shimmer=.7+.3*sin(angle*10.+time*2.);
    float pulse=.8+.2*sin(time*pulseSpeed);
    
    // Create dynamic particle effect
    float particle=smoothstep(.4,.6,sparkle*shimmer*pulse);
    
    // Add glowing edge effect
    float edge=smoothstep(.48,.5,abs(radius-.5));
    float glow=(1.-edge)*.5*(1.+sin(time*2.));
    
    // Combine base color with glow
    vec3 baseColor=mix(glowColor,vec3(.8),particle);
    vec3 finalColor=mix(baseColor,glowColor,glow);
    
    gl_FragColor=vec4(finalColor,(particle+glow*.5)*opacity*pulse);
}
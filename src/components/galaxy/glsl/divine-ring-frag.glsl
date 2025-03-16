uniform float time;
uniform float opacity;
uniform float noiseScale;
uniform float flowSpeed;
uniform vec3 glowColor;
uniform float pulseSpeed;
varying vec2 vUv;

// Simple noise function
float random(vec2 st){
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

void main(){
    // Create flowing effect
    vec2 flowUv=vUv+vec2(time*flowSpeed,0.);
    float noise=random(flowUv*noiseScale);
    
    // Pulse effect
    float pulse=.5+.5*sin(time*pulseSpeed);
    
    // Edge glow
    float edgeGlow=smoothstep(.4,.5,abs(vUv.x-.5))*
    smoothstep(.4,.5,abs(vUv.y-.5));
    
    // Combine effects
    vec3 color=glowColor*(noise*.3+pulse*.2+edgeGlow);
    float alpha=opacity*(.6+noise*.2+pulse*.2);
    
    gl_FragColor=vec4(color,alpha);
}
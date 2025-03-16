varying vec3 vColor;

void main(){
    // Light point
    float strength=distance(gl_PointCoord,vec2(.5));
    strength=1.-strength;
    strength=pow(strength,10.);
    
    // Final color
    vec3 color=mix(vec3(0.),vColor,strength);
    
    gl_FragColor=vec4(color,1.);
}
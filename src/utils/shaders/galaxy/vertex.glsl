uniform float uTime;
uniform float uSize;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main(){
    // Compute spun position in local space
    vec3 localPosition=position;
    float angle=atan(localPosition.y,localPosition.x);
    float distanceToCenter=length(localPosition.xy);
    float angleOffset=-(1./distanceToCenter)*uTime*.2;
    float newAngle=angle+angleOffset;
    
    localPosition.x=cos(newAngle)*distanceToCenter;
    localPosition.y=sin(newAngle)*distanceToCenter;
    localPosition.z=position.z;// Keep original Z
    
    // Apply randomness in local space
    localPosition+=aRandomness;
    
    // Apply model matrix to transform to world space
    vec4 modelPosition=modelMatrix*vec4(localPosition,1.);
    
    // View and projection transformations
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    
    // Size and color
    gl_PointSize=uSize*aScale;
    gl_PointSize*=(1./-viewPosition.z);
    vColor=color;
}
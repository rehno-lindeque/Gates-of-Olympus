attribute vec3 vertexPosition;
//attribute vec2 textureCoord;
attribute vec3 targetPosition;
attribute float t;

uniform mat4 view;
uniform mat4 projection;
uniform float currentT;
uniform float lifeT;

//varying vec2 vTextureCoord;
varying float expired;

const float particleSize = 5.0;
const float speedScale = 0.1;

void main(void) {
  float lerpT = (currentT-t)/lifeT * speedScale;
  expired = lerpT;
  gl_Position = vec4(vertexPosition + min(lerpT, 1.0) * targetPosition, 1.0);
  gl_Position = projection * (view * gl_Position);
  //gl_PointSize = (view[0][0] * particleSize) / gl_Position.w;
  gl_PointSize = particleSize;
}


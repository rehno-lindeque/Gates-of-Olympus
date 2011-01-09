attribute vec3 vertexPosition;
//attribute vec2 textureCoord;
attribute vec3 targetPosition;
attribute float t;

uniform mat4 view;
uniform mat4 projection;

//varying vec2 vTextureCoord;

const float particleSize = 5.0;

void main(void) {
  gl_Position = vec4(vertexPosition + 0.00001 * t * targetPosition, 1.0);
  gl_Position = projection * (view * gl_Position);
  //gl_PointSize = (view[0][0] * particleSize) / gl_Position.w;
  gl_PointSize = particleSize;
}


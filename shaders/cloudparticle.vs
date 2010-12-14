attribute vec3 vertexPosition;
//attribute vec2 textureCoord;

uniform mat4 view;
uniform mat4 projection;

//varying vec2 vTextureCoord;

const float particleSize = 17.0;

void main(void) {
  gl_Position = view * vec4(vertexPosition, 1.0);
  gl_Position = projection * gl_Position;
  gl_PointSize = (view[0][0] * particleSize) / gl_Position.w;
}


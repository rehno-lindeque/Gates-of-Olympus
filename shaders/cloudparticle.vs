attribute vec3 vertexPosition;
//attribute vec2 textureCoord;

uniform mat4 view;
uniform mat4 projection;

//varying vec2 vTextureCoord;

void main(void) {
  gl_Position = view * vec4(vertexPosition, 1.0);
  gl_PointSize = 20.0;
  gl_Position = projection * gl_Position;
}


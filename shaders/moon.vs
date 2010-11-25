attribute vec2 vertexPosition;
attribute vec2 textureCoord;

uniform mat4 view;
uniform mat4 projection;

varying vec2 vTextureCoord;

void main(void) {
  gl_Position = vec4(vertexPosition, 0.0, 1.0);
  vTextureCoord = textureCoord;
}


attribute vec3 vertexPosition;
attribute vec2 textureCoord;

varying vec2 vTextureCoord;

void main(void) {
  gl_Position = vec4(vertexPosition, 1.0);
  vTextureCoord = textureCoord;
}


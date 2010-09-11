attribute vec2 vertexPosition;

void main(void) {
  gl_Position = vec4(vertexPosition, 1.0, 1.0);
}


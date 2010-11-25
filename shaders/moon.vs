attribute vec2 vertexPosition;

void main(void) {
  gl_Position = vec4(vertexPosition, 0.0, 1.0);
}


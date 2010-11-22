#ifdef GL_ES
precision highp float;
#endif

uniform mat4 view;
uniform float exposure;

void main(void) {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}


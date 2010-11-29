#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform float exposure;

void main(void) {
  if(distance(vTextureCoord, vec2(0.5, 0.5)) > 0.5)
    discard;
  gl_FragColor = vec4(1.0, 0.98, 0.9, 1.0);
}


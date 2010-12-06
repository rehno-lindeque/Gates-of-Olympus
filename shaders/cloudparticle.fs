#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

void main(void) {
  float dist = distance(vTextureCoord, vec2(0.5, 0.5));
  if(dist > 0.5)
    discard;
  gl_FragColor = vec4(1.0, 1.0, 1.0, dist * 2.0);
}


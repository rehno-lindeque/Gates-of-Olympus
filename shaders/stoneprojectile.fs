#ifdef GL_ES
precision highp float;
#endif

//varying vec2 vTextureCoord;

void main(void) {
  float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
  if(dist > 0.5)
    discard;
  gl_FragColor = vec4(0.4, 0.28, 0.15, 1.0);
}


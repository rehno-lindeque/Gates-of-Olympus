#ifdef GL_ES
precision highp float;
#endif

//varying vec2 vTextureCoord;

const float alphaFactor = 0.08;

void main(void) {
  float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
  if(dist > 0.5)
    discard;
  gl_FragColor = vec4(1.0, 1.0, 1.0, alphaFactor * max(1.0 - dist * 2.0, 0.0));
  //gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}


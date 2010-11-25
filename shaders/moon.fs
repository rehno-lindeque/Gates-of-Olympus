#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D colorSampler;
uniform float exposure;

void main(void) {
  //gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  //gl_FragColor = texture2D(colorSampler, vec2(vTextureCoord.s, vTextureCoord.t)) + vec4(0.5,0.0,0.0,1.0);
  //gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
  //gl_FragColor = vec4(vTextureCoord, 0.0, 1.0);
  gl_FragColor = texture2D(colorSampler, vTextureCoord);
}


attribute vec2 vertexPosition;
attribute vec2 textureCoord;

uniform vec2 orbit; // in spherical coordinates
uniform mat4 view;
uniform mat4 projection;

const float scale = 0.04;

varying vec2 vTextureCoord;

void main(void) {

  /* Since gates of olympus uses a left-handed coordinate system with
     z as the "up" vector, the inclination starts at (1,0,0) and goes up to (0,0,1)
  */

  float cosIncl = cos(orbit[0]);
  float sinIncl = sin(orbit[0]);
  float cosAzim = cos(orbit[1]);
  float sinAzim = sin(orbit[1]);
  vec4 pos = vec4(cosIncl * cosAzim, cosIncl * sinAzim, sinIncl, 0.0);
  vec4 p = view * pos;
  p.z = p.z > 0.0? -10.0 : 0.0;
  gl_Position = vec4(
    p.x + vertexPosition.x * projection[0][0] * scale, 
    p.y + vertexPosition.y * projection[1][1] * scale,
    p.z, 1.0);
  vTextureCoord = textureCoord;
}


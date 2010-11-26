attribute vec2 vertexPosition;
attribute vec2 textureCoord;

uniform vec2 orbit; // in spherical coordinates
uniform mat4 view;
uniform mat4 projection;

const float scale = 0.04;

varying vec2 vTextureCoord;

void main(void) {
  
  vec4 p = view * vec4(1.0,0.0,0.0,0.0);
  p.z = p.z > 0.0? -10.0 : 0.0;
  gl_Position = vec4(
    p.x + vertexPosition.x * projection[0][0] * scale, 
    p.y + vertexPosition.y * projection[1][1] * scale,
    p.z, 1.0);
  vTextureCoord = textureCoord;
}


attribute vec3 vertexPosition;
//attribute vec2 textureCoord;

uniform mat4 view;
uniform mat4 projection;

//varying vec2 vTextureCoord;

void main(void) {
  //vTextureCoord = vec2(0.5, 0.5);
  gl_PointSize = 20.0;
  gl_Position = projection * (view * vec4(vertexPosition, 1.0));
  //vec4 pos = projection * (view * vec4(vertexPosition, 1.0));
  //gl_Position = vec4(vertexPosition, 1.0);;

  //gl_Position.x *= 0.0;
  //gl_Position.y *= 0.0;
  //gl_Position.z = -1.0;
}


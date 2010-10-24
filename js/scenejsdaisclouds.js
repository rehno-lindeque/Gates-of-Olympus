var DaisClouds;
/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
A scenejs extension that renders a cloud particles around the daises
*/
/*
Dias clouds node type
*/
DaisClouds = SceneJS.createNodeType("dais-clouds");
DaisClouds.prototype._init = function(params) {
  return null;
};
DaisClouds.prototype.renderClouds = function() {
  var gl, saveState;
  gl = canvas.context;
  saveState = {
    blend: gl.getParameter(gl.BLEND),
    depthTest: gl.getParameter(gl.DEPTH_TEST)
  };
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  gl.useProgram(shaderProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  if (!saveState.blend) {
    gl.disable(gl.BLEND);
  }
  return null;
};
DaisClouds.prototype._render = function(traversalContext) {
  if (SceneJS._traversalMode === SceneJS._TRAVERSAL_MODE_RENDER) {
    this._renderNodes(traversalContext);
    if (!vertexBuffer) {
      createResources();
    }
    this.renderClouds();
  }
  return null;
};
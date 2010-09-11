var canvas, createResources, destroyResources, shaderProgram, vertexBuffer;
/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
A scenejs extension that renders a cloud dome using a full-screen quad and some procedural shaders.
*/
/*
Globals
*/
canvas = null;
shaderProgram = null;
vertexBuffer = null;
createResources = function() {
  var fragmentShader, gl, vertexShader, vertices;
  gl = canvas.context;
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  shaderProgram = gl.createProgram();
  fragmentShader = "";
  return (vertexShader = "");
};
destroyResources = function() {
  if (document.getElementById(canvas.canvasId)) {
    if (shaderProgram) {
      shaderProgram.destroy();
    }
    return vertexBuffer ? vertexBuffer.destroy() : null;
  }
};
/*
SceneJS listeners
*/
SceneJS._eventModule.addListener(SceneJS._eventModule.SCENE_RENDERING, function() {
  return (canvas = null);
});
SceneJS._eventModule.addListener(SceneJS._eventModule.CANVAS_ACTIVATED, function(c) {
  return (canvas = c);
});
SceneJS._eventModule.addListener(SceneJS._eventModule.CANVAS_DEACTIVATED, function() {
  return (canvas = null);
});
SceneJS._eventModule.addListener(SceneJS._eventModule.RESET, function() {
  destroyResources();
  return (canvas = null);
});
/*
Cloud dome node type
*/
SceneJS.CloudDome = SceneJS.createNodeType("cloudDome");
SceneJS.CloudDome.prototype._init = function(params) {
  this.setRadius(params.radius);
  return null;
};
SceneJS.CloudDome.prototype.setRadius = function(radius) {
  this.radius = radius || 100.0;
  this._setDirty();
  return this;
};
SceneJS.CloudDome.prototype.getColor = function() {
  return {
    radius: this.radius
  };
};
SceneJS.CloudDome.prototype.renderClouds = function() {
  gl.useProgram(shaderProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, _vertexBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
  return gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
SceneJS.CloudDome.prototype._render = function(traversalContext) {
  if (SceneJS._traversalMode === SceneJS._TRAVERSAL_MODE_RENDER) {
    this._renderNodes(traversalContext);
    if (!vertexBuffer) {
      createResources();
    }
  }
  return null;
};
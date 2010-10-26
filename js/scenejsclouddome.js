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
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  shaderProgram = gl.createProgram();
  vertexShader = compileShader(gl, "clouddome-vs");
  fragmentShader = compileShader(gl, "clouddome-fs");
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }
  gl.useProgram(shaderProgram);
  shaderProgram.vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPosition);
  return null;
};
destroyResources = function() {
  if (document.getElementById(canvas.canvasId)) {
    if (shaderProgram) {
      shaderProgram.destroy();
    }
    if (vertexBuffer) {
      vertexBuffer.destroy();
    }
  }
  return null;
};
/*
Cloud dome node type
*/
SceneJS.CloudDome = SceneJS.createNodeType("cloud-dome");
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
SceneJS.CloudDome.prototype._render = function(traversalContext) {
  if (SceneJS._traversalMode === SceneJS._TRAVERSAL_MODE_RENDER) {
    this._renderNodes(traversalContext);
    if (!vertexBuffer) {
      createResources();
    }
    this.renderClouds();
  }
  return null;
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
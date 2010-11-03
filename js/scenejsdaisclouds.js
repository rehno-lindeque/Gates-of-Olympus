var DaisClouds, DaisCloudsModule;
/*
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
*/
/*
A scenejs extension that renders a cloud particles around the daises
*/
/*
Dais Clouds Module
*/
DaisCloudsModule = {
  vertexBuffer: null,
  shaderProgram: null,
  createResources: function() {
    var fragmentShader, gl, vertexShader, vertices;
    gl = canvas.context;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.shaderProgram = gl.createProgram();
    vertexShader = compileShader(gl, "clouddome-vs");
    fragmentShader = compileShader(gl, "clouddome-fs");
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    gl.useProgram(this.shaderProgram);
    this.shaderProgram.vertexPosition = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(this.shaderProgram.vertexPosition);
    return null;
  },
  destroyResources: function() {
    if (document.getElementById(canvas.canvasId)) {
      if (this.shaderProgram) {
        this.shaderProgram.destroy();
      }
      if (this.vertexBuffer) {
        this.vertexBuffer.destroy();
      }
    }
    return null;
  }
};
/*
SceneJS listeners
*/
SceneJS._eventModule.addListener(SceneJS._eventModule.RESET, function() {
  return DaisCloudsModule.destroyResources();
});
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
var Atmosphere, CloudDomeModule;
/*
Copyright 2010, Rehno Lindeque.

 * This file is Dual licensed under the MIT or GPL Version 2 licenses.
 * It is intended to be compatible with http://scenejs.org/license so that changes can be back-ported.
*/
/*
A scenejs extension that renders a cloud dome using a full-screen quad and some procedural shaders.
*/
/*
Cloud Dome Module
*/
CloudDomeModule = {
  vertexBuffer: null,
  shaderProgram: null,
  transmittanceProgram: null,
  transmittanceTexture: null,
  createTransmittanceResources: function(gl) {
    var fragmentShader, frameBuffer, vertexShader;
    this.transmittanceProgram = gl.createProgram();
    vertexShader = compileShader(gl, "fullscreenquad-vs");
    fragmentShader = compileShader(gl, "atmosphere-fs");
    gl.attachShader(this.transmittanceProgram, vertexShader);
    gl.attachShader(this.transmittanceProgram, fragmentShader);
    gl.linkProgram(this.transmittanceProgram);
    if (!gl.getProgramParameter(this.transmittanceProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    gl.useProgram(this.transmittanceProgram);
    this.transmittanceProgram.vertexPosition = gl.getAttribLocation(this.transmittanceProgram, "vertexPosition");
    this.transmittanceTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.transmittanceTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.GL_TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.GL_TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.GL_TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.enableVertexAttribArray(this.transmittanceProgram.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.transmittanceTexture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(frameBuffer);
    return null;
  },
  createResources: function(gl) {
    var fragmentShader, vertexShader, vertices;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.shaderProgram = gl.createProgram();
    vertexShader = compileShader(gl, "fullscreenquad-vs");
    fragmentShader = compileShader(gl, "atmosphere-fs");
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    this.shaderProgram.camera = gl.getUniformLocation(this.shaderProgram, "camera");
    this.shaderProgram.sun = gl.getUniformLocation(this.shaderProgram, "sun");
    this.shaderProgram.invProjection = gl.getUniformLocation(this.shaderProgram, "invProjection");
    this.shaderProgram.invView = gl.getUniformLocation(this.shaderProgram, "invView");
    this.shaderProgram.exposure = gl.getUniformLocation(this.shaderProgram, "exposure");
    gl.useProgram(this.shaderProgram);
    this.shaderProgram.vertexPosition = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    this.createTransmittanceResources(gl);
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
  },
  render: function(gl, invView, invProjection, sun) {
    var saveState;
    saveState = {
      blend: gl.getParameter(gl.BLEND),
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    };
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    gl.depthMask(false);
    gl.useProgram(this.shaderProgram);
    gl.enableVertexAttribArray(this.shaderProgram.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform3f(this.shaderProgram.camera, 0.0, 0.0, 1.0);
    gl.uniform3f(this.shaderProgram.sun, sun);
    gl.uniformMatrix4fv(this.shaderProgram.invProjection, false, new Float32Array(invProjection));
    gl.uniformMatrix4fv(this.shaderProgram.invView, false, new Float32Array(invView));
    gl.uniform1f(this.shaderProgram.exposure, 1.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!saveState.blend) {
      gl.disable(gl.BLEND);
    }
    gl.depthMask(true);
    return null;
  }
};
/*
SceneJS listeners
*/
SceneJS._eventModule.addListener(SceneJS._eventModule.RESET, function() {
  return CloudDomeModule.destroyResources();
});
/*
Cloud dome node type
*/
Atmosphere = function() {};
Atmosphere.prototype.render = function(gl, invView, invProjection, sun) {
  if (!CloudDomeModule.vertexBuffer) {
    CloudDomeModule.createResources(gl);
  }
  CloudDomeModule.render(gl, invView, invProjection, sun);
  return null;
};
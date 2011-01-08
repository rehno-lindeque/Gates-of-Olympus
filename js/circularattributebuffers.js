var CircularAttributeBuffers;
/*
Copyright 2010-2011, Rehno Lindeque.

 * This file is Dual licensed under the MIT or GPL Version 2 licenses.
 * It is intended to be compatible with http://scenejs.org/license so that changes can be back-ported.
*/
CircularAttributeBuffers = function(size, lifeTime) {
  this.size = size;
  this.lifeTime = lifeTime;
  this.t = 0.0;
  this.vertices = new Array(this.size);
  this.vertexBuffers = null;
  this.vertexQueue = [];
  return this;
};
CircularAttributeBuffers.prototype.create = function(gl) {
  this.vertexBuffers = [gl.createBuffer()];
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers[0]);
  return gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
};
CircularAttributeBuffers.prototype.bind = function(gl) {
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(shaderProgram.vertexPosition);
  return gl.vertexAttribPointer(shaderProgram.vertexPosition, 3, gl.FLOAT, false, 0, 0);
};
CircularAttributeBuffers.prototype.destroy = function() {
  var _i, _len, _ref, vb;
  _ref = this.vertexBuffers;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    vb = _ref[_i];
    vb.destroy();
  }
  return (this.vertexBuffers = null);
};
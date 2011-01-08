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
  return this;
};
CircularAttributeBuffers.prototype.create = function(gl) {
  this.vertexBuffers = [gl.createBuffer()];
  return gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers[0]);
};
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
  this.bottomOffset = 0;
  this.topOffset = 0;
  this.attributeBuffers = [];
  this.attributeQueues = [];
  this.attributeInfos = [];
  return this;
};
CircularAttributeBuffers.prototype.create = function(gl) {
  this.attributeBuffers.push(gl.createBuffer());
  this.attributeInfos.push({
    elements: 3,
    glType: gl.FLOAT
  });
  this.attributeQueues.push([]);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.attributeBuffers[0]);
  gl.bufferData(gl.ARRAY_BUFFER, this.size * this.attributeInfos[0].elements, gl.STREAM_DRAW);
  this.attributeBuffers.push(gl.createBuffer());
  this.attributeInfos.push({
    elements: 3,
    glType: gl.FLOAT
  });
  this.attributeQueues.push([]);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.attributeBuffers[1]);
  gl.bufferData(gl.ARRAY_BUFFER, this.size * this.attributeInfos[1].elements, gl.STREAM_DRAW);
  this.attributeBuffers.push(gl.createBuffer());
  this.attributeInfos.push({
    elements: 1,
    glType: gl.FLOAT
  });
  this.attributeQueues.push([]);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.attributeBuffers[2]);
  gl.bufferData(gl.ARRAY_BUFFER, this.size * this.attributeInfos[2].elements, gl.STREAM_DRAW);
  return null;
};
CircularAttributeBuffers.prototype.push = function(elements) {
  var _ref, k;
  _ref = elements.length;
  for (k = 0; (0 <= _ref ? k < _ref : k > _ref); (0 <= _ref ? k += 1 : k -= 1)) {
    this.attributeQueues[k] = this.attributeQueues[k].concat(elements[k]);
  }
  return null;
};
CircularAttributeBuffers.prototype.getRange = function() {
  return [this.bottomOffset, this.topOffset];
};
CircularAttributeBuffers.prototype.getOffset = function() {
  return this.bottomOffset;
};
CircularAttributeBuffers.prototype.getCount = function() {
  return this.topOffset - this.bottomOffset;
};
CircularAttributeBuffers.prototype.update = function(gl, t) {
  var _ref, k, num, numVertices, queue;
  this.t = t;
  numVertices = this.attributeQueues[0].length / this.attributeInfos[0].elements;
  if (numVertices === 0) {
    return null;
  }
  for (k = 0; (0 <= numVertices ? k < numVertices : k > numVertices); (0 <= numVertices ? k += 1 : k -= 1)) {
    this.attributeQueues[this.attributeQueues.length - 1].push(t);
  }
  _ref = this.attributeQueues.length;
  for (k = 0; (0 <= _ref ? k < _ref : k > _ref); (0 <= _ref ? k += 1 : k -= 1)) {
    queue = this.attributeQueues[k];
    if ((this.topOffset < this.bottomOffset && this.topOffset + queue.length < this.bottomOffset) || ((this.topOffset >= this.bottomOffset) && this.topOffset + queue.length < this.size)) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.attributeBuffers[k]);
      gl.bufferSubData(gl.ARRAY_BUFFER, this.topOffset * this.attributeInfos[k].elements, new Float32Array(queue));
    } else {
      if (this.topOffset < this.bottomOffset) {
        num = this.bottomOffset - this.topOffset;
      } else {
        num = this.size - this.topOffset;
      }
    }
    this.attributeQueues[k] = [];
  }
  this.topOffset += numVertices;
  return null;
};
CircularAttributeBuffers.prototype.bind = function(gl, shaderLocations) {
  var _ref, k;
  _ref = this.attributeBuffers.length;
  for (k = 0; (0 <= _ref ? k < _ref : k > _ref); (0 <= _ref ? k += 1 : k -= 1)) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.attributeBuffers[k]);
    gl.enableVertexAttribArray(shaderLocations[k]);
    gl.vertexAttribPointer(shaderLocations[k], this.attributeInfos[k].elements, this.attributeInfos[k].glType, false, 0, 0);
  }
  return null;
};
CircularAttributeBuffers.prototype.destroy = function() {
  var _i, _len, _ref, buffer;
  _ref = this.attributeBuffers;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    buffer = _ref[_i];
    buffer.destroy();
  }
  this.attributeBuffers = [];
  this.attributeQueues = [[]];
  this.attributeInfos = [];
  return null;
};
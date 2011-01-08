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
  this.vertices = new Array(this.size);
  this.attributeBuffers = [];
  this.attributeQueues = [[]];
  this.attributeInfos = [];
  return this;
};
CircularAttributeBuffers.prototype.create = function(gl) {
  this.attributeBuffers = [gl.createBuffer()];
  this.attributeInfos = [
    {
      elements: 3
    }
  ];
  gl.bindBuffer(gl.ARRAY_BUFFER, this.attributeBuffers[0]);
  return gl.bufferData(gl.ARRAY_BUFFER, this.size * this.attributeInfos[0].elements, gl.STREAM_DRAW);
};
CircularAttributeBuffers.prototype.push = function(elements) {
  var _result, k;
  _result = [];
  for (k = 0; (0 <= this.attributeBuffers.length - 1 ? k <= this.attributeBuffers.length - 1 : k >= this.attributeBuffers.length - 1); (0 <= this.attributeBuffers.length - 1 ? k += 1 : k -= 1)) {
    _result.push(this.attributeQueues[k].concat(elements[k]));
  }
  return _result;
};
CircularAttributeBuffers.prototype.update = function(t) {
  var _i, _len, _ref, queue;
  this.t = t;
  _ref = this.attributeQueues;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    queue = _ref[_i];
    if (this.topOffset + queue.length < this.size) {
      gl.bufferSubData(gl.ARRAY_BUFFER, this.topOffset * this.attributeInfos[0].elements, new Float32Array(queue));
    }
  }
  return (this.attributeQueues = [[]]);
};
CircularAttributeBuffers.prototype.bind = function(gl, shaderLocations) {
  var _result, k;
  _result = [];
  for (k = 0; (0 <= this.attributeBuffers.length - 1 ? k <= this.attributeBuffers.length - 1 : k >= this.attributeBuffers.length - 1); (0 <= this.attributeBuffers.length - 1 ? k += 1 : k -= 1)) {
    _result.push((function() {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.attributeBuffers[k]);
      gl.enableVertexAttribArray(shaderLocations[k]);
      return gl.vertexAttribPointer(shaderLocations[k], 3, gl.FLOAT, false, 0, 0);
    }).call(this));
  }
  return _result;
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
  return (this.attributeInfos = []);
};
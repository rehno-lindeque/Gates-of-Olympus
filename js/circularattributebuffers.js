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
  this.attributeQueues = [[]];
  this.attributeInfos = [];
  return this;
};
CircularAttributeBuffers.prototype.create = function(gl) {
  this.attributeBuffers.push(gl.createBuffer());
  this.attributeInfos.push({
    elements: 3,
    glType: gl.FLOAT
  });
  gl.bindBuffer(gl.ARRAY_BUFFER, this.attributeBuffers[0]);
  gl.bufferData(gl.ARRAY_BUFFER, this.size * this.attributeInfos[0].elements, gl.STREAM_DRAW);
  this.attributeBuffers.push(gl.createBuffer());
  this.attributeInfos.push({
    elements: 3,
    glType: gl.FLOAT
  });
  gl.bindBuffer(gl.ARRAY_BUFFER, this.attributeBuffers[1]);
  gl.bufferData(gl.ARRAY_BUFFER, this.size * this.attributeInfos[1].elements, gl.STREAM_DRAW);
  this.attributeBuffers.push(gl.createBuffer());
  this.attributeInfos.push({
    elements: 1,
    glType: gl.FLOAT
  });
  gl.bindBuffer(gl.ARRAY_BUFFER, this.attributeBuffers[2]);
  return gl.bufferData(gl.ARRAY_BUFFER, this.size * this.attributeInfos[2].elements, gl.STREAM_DRAW);
};
CircularAttributeBuffers.prototype.push = function(elements) {
  var _result, k;
  _result = [];
  for (k = 0; (0 <= this.attributeBuffers.length - 1 ? k <= this.attributeBuffers.length - 1 : k >= this.attributeBuffers.length - 1); (0 <= this.attributeBuffers.length - 1 ? k += 1 : k -= 1)) {
    _result.push(this.attributeQueues[k].concat(elements[k]));
  }
  return _result;
};
CircularAttributeBuffers.prototype.update = function(gl, t) {
  var _i, _len, _ref, num, queue;
  this.t = t;
  _ref = this.attributeQueues;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    queue = _ref[_i];
    if ((this.topOffset < this.bottomOffset && this.topOffset + queue.length < this.bottomOffset) || ((this.topOffset >= this.bottomOffset) && this.topOffset + queue.length < this.size)) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.attributeBuffers[0]);
      gl.bufferSubData(gl.ARRAY_BUFFER, this.topOffset * this.attributeInfos[0].elements, new Float32Array(queue));
    } else {
      if (this.topOffset < this.bottomOffset) {
        num = this.bottomOffset - this.topOffset;
      } else {
        num = this.size - this.topOffset;
      }
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
      return gl.vertexAttribPointer(shaderLocations[k], this.attributeInfos[k].elements, this.attributeInfos[k].glType, false, 0, 0);
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
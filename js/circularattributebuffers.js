var CircularAttributeBuffer;
/*
Copyright 2010-2011, Rehno Lindeque.

 * This file is Dual licensed under the MIT or GPL Version 2 licenses.
 * It is intended to be compatible with http://scenejs.org/license so that changes can be back-ported.
*/
CircularAttributeBuffer = function(size, lifeTime) {
  this.size = size;
  this.lifeTime = lifeTime;
  this.t = 0.0;
  return this;
};
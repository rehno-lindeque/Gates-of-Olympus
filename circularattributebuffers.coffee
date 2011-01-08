###
Copyright 2010-2011, Rehno Lindeque.

 * This file is Dual licensed under the MIT or GPL Version 2 licenses.
 * It is intended to be compatible with http://scenejs.org/license so that changes can be back-ported.
###

class CircularAttributeBuffers
  constructor: (size, lifeTime) ->
    @size = size
    @lifeTime = lifeTime
    @t = 0.0
    @bottomOffset = 0
    @topOffset = 0
    @vertices = new Array(@size)
    @attributeBuffers = []
    @attributeQueues = [[]]
    @attributeInfos = []
  
  # Create the WebGL resources associated with this object
  create: (gl) ->
    
    # Create an attribute buffer for the vertex position
    # TODO: Not sure whether this should be STREAM_DRAW or DYNAMIC_DRAW for optimal performance...    
    @attributeBuffers = [gl.createBuffer()]
    @attributeInfos = [elements: 3]
    gl.bindBuffer(gl.ARRAY_BUFFER, @attributeBuffers[0])
    gl.bufferData(gl.ARRAY_BUFFER, @size * @attributeInfos[0].elements, gl.STREAM_DRAW)
  
  # Push one element onto the buffer (the effective time will be whatever t is when we call update(t)
  # The elements in total as well as each element itself must be boxed into arrays
  push: (elements) ->
    for k in [0..attributeBuffers.size - 1]
      @attributeQueues[k].concat(elements[k])
  
  # Update all the attribute buffers with the elements pushed onto the queue and discard expired elements
  update: (t) ->
    @t = t
    for queue in @attributeQueues
      if @topOffset + queue.size < @size
        gl.bufferSubData(gl.ARRAY_BUFFER, @topOffset * @attributeInfos[0].elements, )
    @attributeQueues = [[]]

  bind: (gl, shaderLocations) ->
    for k in @attributeBuffers.size
      gl.bindBuffer(gl.ARRAY_BUFFER, @attributeBuffers[k])
      gl.enableVertexAttribArray(shaderLocations[k])
      gl.vertexAttribPointer(shaderLocations[k], 3, gl.FLOAT, false, 0, 0)
  
  destroy: ->
    for buffer in @attributeBuffers
      buffer.destroy()
    @attributeBuffers = []
    @attributeQueues = [[]]
    @attributeInfos = []


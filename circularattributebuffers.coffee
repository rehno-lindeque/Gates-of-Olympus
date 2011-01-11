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
    @attributeBuffers = []
    @attributeQueues = []
    @attributeInfos = []
  
  # Create the WebGL resources associated with this object
  create: (gl) ->
    # Create an attribute buffer for the vertex position
    # TODO: Not sure whether this should be STREAM_DRAW or DYNAMIC_DRAW for optimal performance...    
    @attributeBuffers.push(gl.createBuffer())
    @attributeInfos.push(
      elements: 3
      glType: gl.FLOAT
    )
    @attributeQueues.push([])
    gl.bindBuffer(gl.ARRAY_BUFFER, @attributeBuffers[0])
    gl.bufferData(gl.ARRAY_BUFFER, @size * @attributeInfos[0].elements, gl.STREAM_DRAW)

    # Create an attribute buffer for the target position (this is not generic!)
    @attributeBuffers.push(gl.createBuffer())
    @attributeInfos.push(
      elements: 3
      glType: gl.FLOAT
    )
    @attributeQueues.push([])
    gl.bindBuffer(gl.ARRAY_BUFFER, @attributeBuffers[1])
    gl.bufferData(gl.ARRAY_BUFFER, @size * @attributeInfos[1].elements, gl.STREAM_DRAW)

    # Create an attribute for the t (time) parameter
    @attributeBuffers.push(gl.createBuffer())
    @attributeInfos.push(
      elements: 1
      glType: gl.FLOAT
    )
    @attributeQueues.push([])
    gl.bindBuffer(gl.ARRAY_BUFFER, @attributeBuffers[2])
    gl.bufferData(gl.ARRAY_BUFFER, @size * @attributeInfos[2].elements, gl.STREAM_DRAW)
    null
  
  # Push one element onto the buffer (the effective time will be whatever t is when we call update(t)
  # The elements in total as well as each element itself must be boxed into arrays
  push: (elements) ->
    # Pre-condition: @elements.length == @attributeQueues.length - 1 (since it should not include "t")
    for k in [0...elements.length]
      @attributeQueues[k] = @attributeQueues[k].concat(elements[k])
    null

  # Get the range of the attribute buffer
  getRange: -> [@bottomOffset, @topOffset]
  
  # Get the offset to start drawing from
  getOffset: -> @bottomOffset
  
  # Get the number of elements to draw
  getCount: -> @topOffset - @bottomOffset

  # Update all the attribute buffers with the elements pushed onto the queue and discard expired elements
  update: (gl, t) ->
    @t = t
    
    # Add t to the attributes
    numVertices = @attributeQueues[0].length/@attributeInfos[0].elements
    if numVertices == 0 then return
    for k in [0...numVertices]
      @attributeQueues[@attributeQueues.length-1].push(t)

    # TODO: For now, a cheap hack:
    if @topOffset + numVertices > @size
      @topOffset = 0
      @bottomOffset = 0
    
    # Push all the queues into the buffer objects
    for k in [0...@attributeQueues.length]
      queue = @attributeQueues[k]
      if (@topOffset < @bottomOffset && @topOffset + numVertices < @bottomOffset) || (@topOffset >= @bottomOffset && @topOffset + numVertices < @size)
        gl.bindBuffer(gl.ARRAY_BUFFER, @attributeBuffers[k])
        gl.bufferSubData(gl.ARRAY_BUFFER, @topOffset * @attributeInfos[k].elements, new Float32Array(queue))
      #else
      #  if (@topOffset < @bottomOffset)
      #    num = @bottomOffset - @topOffset
      #  else
      #    num = @size - @topOffset
      #  
      #  #TODO: more to do here....!!!
      #  
      #  # For now, a cheap hack:
      #  @topOffset = 0
      #  @bottomOffset = 0
      #  gl.bindBuffer(gl.ARRAY_BUFFER, @attributeBuffers[k])
      #  gl.bufferSubData(gl.ARRAY_BUFFER, @topOffset * @attributeInfos[k].elements, new Float32Array(queue))
      
      # Clear the queue
      @attributeQueues[k] = []
    
    # Increase the upper bound of the active vertices
    @topOffset += numVertices
    null
  
  bind: (gl, shaderLocations) ->
    for k in [0...@attributeBuffers.length]
      gl.bindBuffer(gl.ARRAY_BUFFER, @attributeBuffers[k])
      gl.enableVertexAttribArray(shaderLocations[k])
      gl.vertexAttribPointer(shaderLocations[k], @attributeInfos[k].elements, @attributeInfos[k].glType, false, 0, 0)
    null
  
  destroy: ->
    for buffer in @attributeBuffers
      buffer.destroy()
    @attributeBuffers = []
    @attributeQueues = [[]]
    @attributeInfos = []
    null

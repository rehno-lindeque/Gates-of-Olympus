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
    @vertices = new Array(@size)
    @vertexBuffers = null
    @vertexQueue = []
  
  create: (gl) ->
    @vertexBuffers = [gl.createBuffer()]
    gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffers[0])
    # TODO: Not sure whether this should be STREAM_DRAW or DYNAMIC_DRAW for optimal performance...
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW)
  
  bind: (gl) ->
    gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffer)
    gl.enableVertexAttribArray(shaderProgram.vertexPosition)
    gl.vertexAttribPointer(shaderProgram.vertexPosition, 3, gl.FLOAT, false, 0, 0)
  
  destroy: ->
    for vb in @vertexBuffers
      vb.destroy()
    @vertexBuffers = null


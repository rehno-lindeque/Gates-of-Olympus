###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
A scenejs extension that renders a cloud particles around the daises
###


###
Dias clouds node type
###

DaisClouds = SceneJS.createNodeType("dais-clouds")

DaisClouds.prototype._init = (params) ->
  #@setRadius params.radius
  null
  
#DaisClouds.prototype.setRadius = (radius) ->
#  @radius = radius || 100.0
#  @_setDirty()
#  this

#DaisClouds.prototype.getRadius = -> @radius

DaisClouds.prototype.renderClouds = ->
  gl = canvas.context
  
  # Change gl state
  saveState =
    blend:     gl.getParameter(gl.BLEND)
    depthTest: gl.getParameter(gl.DEPTH_TEST)    
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.enable(gl.BLEND)
  #gl.disable(gl.DEPTH_TEST)
  
  # Bind shaders and parameters
  gl.useProgram(shaderProgram)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.vertexAttribPointer(shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0)
  
  # Draw geometry
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  
  # Restore gl state
  if not saveState.blend then gl.disable(gl.BLEND)
  #if saveState.depthTest then gl.enable(gl.DEPTH_TEST)
  null

DaisClouds.prototype._render = (traversalContext) ->
  if SceneJS._traversalMode == SceneJS._TRAVERSAL_MODE_RENDER
    @_renderNodes traversalContext
    if not vertexBuffer then createResources()
    #@renderClouds()
  null

###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

# Create the cloud dome node
SceneJS.CloudDome = SceneJS.createNodeType("clouddome")

SceneJS.CloudDome.prototype._init = (params) ->
  @setRadius params.radius
  null

SceneJS.CloudDome.prototype.setRadius = (radius) ->
  @radius = radius || 100.0
  @_setDirty ()
  this
 
SceneJS.CloudDome.prototype.getColor = () ->
  radius: @radius

SceneJS.CloudDome.prototype._render = (traversalContext) ->
  if SceneJS._traversalMode == SceneJS._TRAVERSAL_MODE_RENDER
    @_renderNodes traversalContext
  null

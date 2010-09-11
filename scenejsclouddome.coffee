###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
A scenejs extension that renders a cloud dome using a full-screen quad and some procedural shaders.
###

###
Globals
###

canvas = null
shaderProgram = null
vertexBuffer = null

createResources = ->
  gl = canvas.context
  
  # Create the vertex buffer
  vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffer)
  vertices = [
     1.0,  1.0
    -1.0,  1.0
     1.0, -1.0
    -1.0, -1.0 ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  
  # Create shader program
  shaderProgram = gl.createProgram()
  fragmentShader = "" # TODO: Shader source input
  vertexShader = ""   # TODO: Shader source input
  #gl.attachShader(shaderProgram, vertexShader)
  #gl.attachShader(shaderProgram, fragmentShader)
  #gl.linkProgram(shaderProgram)
  #if not gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) then alert "Could not initialise shaders"
  
destroyResources = ->
  if document.getElementById(canvas.canvasId) # According to geometryModule: Context won't exist if canvas has disappeared
    if shaderProgram then shaderProgram.destroy()
    if vertexBuffer then vertexBuffer.destroy()

###
SceneJS listeners
###

SceneJS._eventModule.addListener(
  SceneJS._eventModule.SCENE_RENDERING
  () -> canvas = null
)
            
SceneJS._eventModule.addListener(
  SceneJS._eventModule.CANVAS_ACTIVATED
  (c) -> canvas = c
)

SceneJS._eventModule.addListener(
  SceneJS._eventModule.CANVAS_DEACTIVATED
  () -> canvas = null
)

SceneJS._eventModule.addListener(
  SceneJS._eventModule.RESET
  () ->
    destroyResources()
    canvas = null
)

###
Cloud dome node type
###

SceneJS.CloudDome = SceneJS.createNodeType("cloudDome")

SceneJS.CloudDome.prototype._init = (params) ->
  @setRadius params.radius
  null
  
SceneJS.CloudDome.prototype.setRadius = (radius) ->
  @radius = radius || 100.0
  @_setDirty()
  this

SceneJS.CloudDome.prototype.getColor = ->
  radius: @radius

SceneJS.CloudDome.prototype.renderClouds = ->
  gl.useProgram(shaderProgram)
  gl.bindBuffer(gl.ARRAY_BUFFER, _vertexBuffer)
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0)
  #gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, new Float32Array(pMatrix.flatten()))
  #gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, new Float32Array(mvMatrix.flatten()))
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

SceneJS.CloudDome.prototype._render = (traversalContext) ->
  if SceneJS._traversalMode == SceneJS._TRAVERSAL_MODE_RENDER
    @_renderNodes traversalContext
    if not vertexBuffer then createResources()
    #TODO: @renderClouds
  null

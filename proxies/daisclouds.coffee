#
# Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
# This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
#

###
A scenejs extension that renders a cloud particles around the daises
###

###
Dais Clouds Module
###

DaisCloudsModule =
  vertexBuffer: null
  shaderProgram: null
  numParticles: 200  

  createResources: (gl) ->
    # Create the vertex buffer
    @vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffer)
    vertices = []
    for k in [0..(@numParticles*3 - 1)]
      vertices[k] = ((Math.random() - 0.5) * 2.0) * ((Math.random() - 0.5) * 2.0)
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    
    # Create shader program
    @shaderProgram = gl.createProgram()
    vertexShader = compileShader(gl, "cloudparticle-vs")
    fragmentShader = compileShader(gl, "cloudparticle-fs")
    gl.attachShader(@shaderProgram, vertexShader)
    gl.attachShader(@shaderProgram, fragmentShader)
    gl.linkProgram(@shaderProgram)
    if not gl.getProgramParameter(@shaderProgram, gl.LINK_STATUS) then alert "Could not initialise shaders"
    
    # Create the texture
    
    #todo ... busy here
    
    # Set shader parameters
    gl.useProgram(@shaderProgram)
    @shaderProgram.vertexPosition = gl.getAttribLocation(@shaderProgram, "vertexPosition")
    gl.enableVertexAttribArray(@shaderProgram.vertexPosition)
    
    @shaderProgram.view = gl.getUniformLocation(@shaderProgram, "view")
    @shaderProgram.projection = gl.getUniformLocation(@shaderProgram, "projection")
    
    null
  
  destroyResources: ->
    if document.getElementById(canvas.canvasId) # According to geometryModule: Context won't exist if canvas has disappeared
      if @shaderProgram then @shaderProgram.destroy()
      if @vertexBuffer then @vertexBuffer.destroy()
    null
  
  render: (gl, view, projection) ->
    # Change gl state
    #saveState =
    #  blend:     gl.getParameter(gl.BLEND)
    #  depthTest: gl.getParameter(gl.DEPTH_TEST)

    gl.enable(gl.BLEND)    
    gl.blendEquation(gl.FUNC_ADD)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    #gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

    #gl.disable(gl.DEPTH_TEST)
    gl.depthMask(false)
    
    # Bind shaders and parameters
    shaderProgram = @shaderProgram
    gl.useProgram(shaderProgram)

    gl.disableVertexAttribArray(k) for k in [1..7]
    
    gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffer)
    gl.enableVertexAttribArray(shaderProgram.vertexPosition)
    gl.vertexAttribPointer(shaderProgram.vertexPosition, 3, gl.FLOAT, false, 0, 0)
    
    gl.uniformMatrix4fv(shaderProgram.view, false, new Float32Array(view))
    gl.uniformMatrix4fv(shaderProgram.projection, false, new Float32Array(projection))
    
    # Draw geometry
    gl.drawArrays(gl.POINTS, 0, @numParticles)
    
    # Restore gl state
    #if not saveState.blend then gl.disable(gl.BLEND)
    #if saveState.depthTest then gl.enable(gl.DEPTH_TEST)
    gl.disable(gl.BLEND)
    gl.depthMask(true)
    null

###
SceneJS listeners
###

SceneJS._eventModule.addListener(
  SceneJS._eventModule.RESET
  () ->
    DaisCloudsModule.destroyResources()
)

###
Dias clouds node type
###

DaisCloudsNode = SceneJS.createNodeType("dais-clouds")
DaisCloudsNode.prototype._render = (traversalContext) ->
  if SceneJS._traversalMode == SceneJS._TRAVERSAL_MODE_RENDER
    @_renderNodes traversalContext
    #@view = SceneJS._modelViewTransformModule.getTransform().matrix
    @view = mulMat4(SceneJS._viewTransformModule.getTransform().matrix, SceneJS._modelTransformModule.getTransform().matrix)

    @projection = SceneJS._projectionModule.getTransform().matrix
  null

#DaisCloudsNode.prototype.setProxy = (proxy) ->
#  @proxy = proxy
#  @_setDirty()
#  this
#
#DaisCloudsNode.prototype.getProxy = -> @proxy

DaisCloudsNode.prototype.getView = -> @view
DaisCloudsNode.prototype.getProjection = -> @projection

###
Dias clouds proxy
###

class DaisClouds  
  constructor: (index) ->
    @node =
      type: "dais-clouds"
      id: "dais" + index + "clouds"
  
  withNode: -> SceneJS.withNode @node.id
  
  render: (gl, time) ->
    nodeRef = @withNode()
    view = nodeRef.get "view"
    projection = nodeRef.get "projection"
    if not DaisCloudsModule.vertexBuffer then DaisCloudsModule.createResources(gl)
    DaisCloudsModule.render(gl, view, projection)

#DaisClouds = SceneJS.createNodeType("dais-clouds")
#
#DaisClouds.prototype._init = (params) ->
#  #@setRadius params.radius
#  null
#  
##DaisClouds.prototype.setRadius = (radius) ->
##  @radius = radius || 100.0
##  @_setDirty()
##  this
#
##DaisClouds.prototype.getRadius = -> @radius
#
#DaisClouds.prototype.renderClouds = ->
#  gl = canvas.context
#  
#  # Change gl state
#  saveState =
#    blend:     gl.getParameter(gl.BLEND)
#    depthTest: gl.getParameter(gl.DEPTH_TEST)    
#  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
#  gl.enable(gl.BLEND)
#  #gl.disable(gl.DEPTH_TEST)
#  
#  # Bind shaders and parameters
#  gl.useProgram(shaderProgram)
#  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
#  gl.vertexAttribPointer(shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0)
#  
#  # Draw geometry
#  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
#  
#  # Restore gl state
#  if not saveState.blend then gl.disable(gl.BLEND)
#  #if saveState.depthTest then gl.enable(gl.DEPTH_TEST)
#  null
#
#DaisClouds.prototype._render = (traversalContext) ->
#  if SceneJS._traversalMode == SceneJS._TRAVERSAL_MODE_RENDER
#    @_renderNodes traversalContext
#    if not vertexBuffer then createResources()
#    @renderClouds()
#  null


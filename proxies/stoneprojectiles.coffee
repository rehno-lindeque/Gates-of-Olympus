#
# Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
# This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
#

###
A scenejs extension that renders projectiles as point sprites
###

###
Projectiles Module
###

StoneProjectilesModule =
  attributeBuffers: new CircularAttributeBuffers(200, 2.0)
  shaderProgram: null
  
  createResources: (gl) ->
    # Create the attribute buffers
    attributeBuffers.create(gl)
    
    # Create shader program
    @shaderProgram = gl.createProgram()
    vertexShader = compileShader(gl, "stoneprojectile-vs")
    fragmentShader = compileShader(gl, "stoneprojectile-fs")
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
    saveState =
      blend:     gl.getParameter(gl.BLEND)
      depthTest: gl.getParameter(gl.DEPTH_TEST)

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
    if not saveState.blend then gl.disable(gl.BLEND)
    #if saveState.depthTest then gl.enable(gl.DEPTH_TEST)
    gl.depthMask(true)
    null

###
SceneJS listeners
###

SceneJS._eventModule.addListener(
  SceneJS._eventModule.RESET
  () ->
    StoneProjectilesModule.destroyResources()
)

###
Stone projectiles node type
###

StoneProjectilesNode = SceneJS.createNodeType("stone-projectiles")
StoneProjectilesNode.prototype._render = (traversalContext) ->
  if SceneJS._traversalMode == SceneJS._TRAVERSAL_MODE_RENDER
    @_renderNodes traversalContext
    @view = mulMat4(SceneJS._viewTransformModule.getTransform().matrix, SceneJS._modelTransformModule.getTransform().matrix)
    @projection = SceneJS._projectionModule.getTransform().matrix
  null

StoneProjectilesNode.prototype.getView = -> @view
StoneProjectilesNode.prototype.getProjection = -> @projection

###
Catapult projectiles proxy
###

class CatapultProjectiles  
  constructor: (index) ->
    @node =
      type: "stone-projectiles"
      id: "catapult-projectiles"
  
  withNode: -> SceneJS.withNode @node.id
  
  render: (gl, time) ->
    nodeRef = @withNode()
    view = nodeRef.get "view"
    projection = nodeRef.get "projection"
    if not DaisCloudsModule.vertexBuffer then DaisCloudsModule.createResources(gl)
    DaisCloudsModule.render(gl, view, projection)


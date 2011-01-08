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
    @attributeBuffers.create(gl)
    
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
      if @attributeBuffers then @attributeBuffers.destroy()
    null
  
  render: (gl, view, projection) ->
    # Change gl state
    saveState =
      blend:     gl.getParameter(gl.BLEND)
      depthTest: gl.getParameter(gl.DEPTH_TEST)

    gl.disable(gl.BLEND)    
    #gl.depthMask(false)
    
    # Bind shaders and parameters
    shaderProgram = @shaderProgram
    gl.useProgram(shaderProgram)
    
    gl.disableVertexAttribArray(k) for k in [1..7]
    @attributeBuffers.bind(gl, [shaderProgram.vertexPosition])
    
    gl.uniformMatrix4fv(shaderProgram.view, false, new Float32Array(view))
    gl.uniformMatrix4fv(shaderProgram.projection, false, new Float32Array(projection))
    
    # Draw geometry
    # todo
    #gl.drawArrays(gl.POINTS, 0, @numParticles)
    
    # Restore gl state
    if saveState.blend then gl.enable(gl.BLEND)
    #gl.depthMask(true)
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
      id: "catapult-projectiles" + index
  
  withNode: -> SceneJS.withNode @node.id
  
  render: (gl, time) ->
    nodeRef = @withNode()
    view = nodeRef.get "view"
    projection = nodeRef.get "projection"
    if not StoneProjectilesModule.shaderProgram then StoneProjectilesModule.createResources(gl)
    StoneProjectilesModule.attributeBuffers.update(time)
    StoneProjectilesModule.render(gl, view, projection)


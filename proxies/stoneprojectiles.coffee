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
  attributeBuffers: []
  shaderProgram: null
  
  addAttributes: (gl, index) ->
    @attributeBuffers[index] = new CircularAttributeBuffers(200, 15.0)
    @attributeBuffers[index].create(gl)
    null
  
  createResources: (gl) ->
    # Create the attribute buffers
    #@attributeBuffers.create(gl)
    
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
    @shaderProgram.targetVector = gl.getAttribLocation(@shaderProgram, "targetVector")
    @shaderProgram.t = gl.getAttribLocation(@shaderProgram, "t")
    gl.enableVertexAttribArray(@shaderProgram.vertexPosition)
    gl.enableVertexAttribArray(@shaderProgram.targetVector)
    gl.enableVertexAttribArray(@shaderProgram.t)
    
    @shaderProgram.view = gl.getUniformLocation(@shaderProgram, "view")
    @shaderProgram.projection = gl.getUniformLocation(@shaderProgram, "projection")
    @shaderProgram.currentT = gl.getUniformLocation(@shaderProgram, "currentT")
    @shaderProgram.lifeT = gl.getUniformLocation(@shaderProgram, "lifeT")
        
    null
  
  destroyResources: ->
    if document.getElementById(canvas.canvasId) # According to geometryModule: Context won't exist if canvas has disappeared
      if @shaderProgram then @shaderProgram.destroy()
      if @attributeBuffers
        buffer.destroy() for buffer in @attributeBuffers
    null
  
  render: (gl, view, projection, index) ->
    # Change gl state
    gl.disable(gl.DEPTH_TEST)
    gl.depthMask(false)
    
    # Bind shaders and parameters
    shaderProgram = @shaderProgram
    gl.useProgram(shaderProgram)
    
    buffers = @attributeBuffers[index]
    gl.uniformMatrix4fv(shaderProgram.view, false, new Float32Array(view))
    gl.uniformMatrix4fv(shaderProgram.projection, false, new Float32Array(projection))
    gl.uniform1f(shaderProgram.currentT, buffers.t)
    gl.uniform1f(shaderProgram.lifeT, buffers.lifeTime)
    
    gl.disableVertexAttribArray(k) for k in [3..7]
    buffers.bind(gl, [shaderProgram.vertexPosition, shaderProgram.targetVector, shaderProgram.t])
    
    # Draw geometry
    gl.drawArrays(gl.POINTS, buffers.getOffset(), buffers.getCount())
    
    # Restore gl state
    gl.enable(gl.DEPTH_TEST)
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
    @index = index
    @node =
      type: "stone-projectiles"
      id: "catapult-projectiles" + index
  
  withNode: -> SceneJS.withNode @node.id
  
  render: (gl, time) ->
    nodeRef = @withNode()
    view = nodeRef.get "view"
    projection = nodeRef.get "projection"
    if not StoneProjectilesModule.attributeBuffers[@index] then StoneProjectilesModule.addAttributes(gl, @index)
    if not StoneProjectilesModule.shaderProgram then StoneProjectilesModule.createResources(gl)
    StoneProjectilesModule.attributeBuffers[@index].update(gl, time)
    StoneProjectilesModule.render(gl, view, projection, @index)
  
  add: (position, targetVector) ->
    StoneProjectilesModule.attributeBuffers[@index].push([position, targetVector])


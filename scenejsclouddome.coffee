###
Copyright 2010, Rehno Lindeque.

 * This file is Dual licensed under the MIT or GPL Version 2 licenses.
 * It is intended to be compatible with http://scenejs.org/license so that changes can be back-ported.
###

###
A scenejs extension that renders a cloud dome using a full-screen quad and some procedural shaders.
###

###
Cloud Dome Module
###

CloudDomeModule =
  vertexBuffer: null
  shaderProgram: null
  
  createResources: (gl) ->
    # Create the vertex buffer
    @vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffer)
    vertices = [
       1.0,  1.0
      -1.0,  1.0
       1.0, -1.0
      -1.0, -1.0 ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    
    # Create shader program
    @shaderProgram = gl.createProgram()
    vertexShader = compileShader(gl, "clouddome-vs")
    fragmentShader = compileShader(gl, "clouddome-fs")
    gl.attachShader(@shaderProgram, vertexShader)
    gl.attachShader(@shaderProgram, fragmentShader)
    gl.linkProgram(@shaderProgram)
    if not gl.getProgramParameter(@shaderProgram, gl.LINK_STATUS) then alert "Could not initialise shaders"
    
    # Set shader parameters
    gl.useProgram(@shaderProgram)
    @shaderProgram.vertexPosition = gl.getAttribLocation(@shaderProgram, "vertexPosition")
    gl.enableVertexAttribArray(@shaderProgram.vertexPosition)
    null

  destroyResources: ->
    if document.getElementById(canvas.canvasId) # According to geometryModule: Context won't exist if canvas has disappeared
      if @shaderProgram then @shaderProgram.destroy()
      if @vertexBuffer then @vertexBuffer.destroy()
    null
  
  renderDome: (gl, invProjection, invView) ->
    # Change gl state
    saveState =
      blend:     gl.getParameter(gl.BLEND)
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    #gl.disable(gl.DEPTH_TEST)
    
    # Bind shaders and parameters
    shaderProgram = CloudDomeModule.shaderProgram
    gl.useProgram(shaderProgram)
    gl.bindBuffer(gl.ARRAY_BUFFER, CloudDomeModule.vertexBuffer)
    gl.vertexAttribPointer(shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0)
    
    # 
    #gl.uniform3f(gl.getUniformLocation(shaderProgram, "camera"), c.x, c.y, c.z);
    #gl.uniform3f(gl.getUniformLocation(shaderProgram, "sun"), s.x, s.y, s.z);
    #gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "projInverse"), 1, true, iproj.coefficients());
    #gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "viewInverse"), 1, true, iviewf.coefficients());
    #gl.uniform1f(gl.getUniformLocation(shaderProgram, "exposure"), exposure);
    
    shaderProgram.camera = gl.getUniformLocation(shaderProgram, "camera")
    shaderProgram.sun = gl.getUniformLocation(shaderProgram, "sun")
    shaderProgram.invProjection = gl.getUniformLocation(shaderProgram, "invProjection")
    shaderProgram.invView = gl.getUniformLocation(shaderProgram, "invView")
    shaderProgram.exposure = gl.getUniformLocation(shaderProgram, "exposure")
    
    gl.uniform3f(shaderProgram.camera, 0.0, 0.0, 1.0)
    gl.uniform3f(shaderProgram.sun, 0.0, 0.0, 1.0)
    #gl.uniformMatrix4fv(shaderProgram.invProjection, false, new Float32Array(pMatrix.flatten())
    #gl.uniformMatrix4fv(shaderProgram.invView, false, new Float32Array(pMatrix.flatten())
    gl.uniformMatrix4fv(shaderProgram.invProjection, false, new Float32Array(invProjection))
    gl.uniformMatrix4fv(shaderProgram.invView, false, new Float32Array(invView))
    gl.uniform1f(shaderProgram.exposure, 0.4)
    
    #varying vec2 coords;
    #varying vec3 ray;
    
    # Draw geometry
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    
    # Restore gl state
    if not saveState.blend then gl.disable(gl.BLEND)
    #if saveState.depthTest then gl.enable(gl.DEPTH_TEST)
    null

###
SceneJS listeners
###

SceneJS._eventModule.addListener(
  SceneJS._eventModule.RESET
  () ->
    CloudDomeModule.destroyResources()
)

###
Cloud dome node type
###

SceneJS.CloudDome = SceneJS.createNodeType("cloud-dome")

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
  #todo: CloudDomeModule.renderDome

SceneJS.CloudDome.prototype._render = (traversalContext) ->
  if SceneJS._traversalMode == SceneJS._TRAVERSAL_MODE_RENDER
    @_renderNodes traversalContext
    if not CloudDomeModule.vertexBuffer then CloudDomeModule.createResources(canvas.context)
    @renderClouds(canvas.context)
  null


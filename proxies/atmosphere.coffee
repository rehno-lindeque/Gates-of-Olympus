###
Copyright 2010, Rehno Lindeque.

 * This file is Dual licensed under the MIT or GPL Version 2 licenses.
 * It is intended to be compatible with http://scenejs.org/license so that changes can be back-ported.
###

###
A scenejs extension that renders the atmosphere (atmospheric scattering) using a full-screen quad and some procedural shaders.
###

###
Atmosphere Module
###

AtmosphereModule =
  vertexBuffer: null
  indexBuffer: null
  shaderProgram: null
  transmittanceProgram: null
  transmittanceTexture: null

  createTransmittanceResources: (gl) ->
    # Create shader program
    @transmittanceProgram = gl.createProgram()
    vertexShader = compileShader(gl, "fullscreenquad-vs")
    fragmentShader = compileShader(gl, "atmosphere-hi-transmittance-fs")
    gl.attachShader(@transmittanceProgram, vertexShader)
    gl.attachShader(@transmittanceProgram, fragmentShader)
    gl.linkProgram(@transmittanceProgram)
    if not gl.getProgramParameter(@transmittanceProgram, gl.LINK_STATUS) then alert "Could not initialise shaders"

    # Get uniform locations
    
    # Get attribute array locations
    gl.useProgram(@transmittanceProgram)
    @transmittanceProgram.vertexPosition = gl.getAttribLocation(@transmittanceProgram, "vertexPosition")
    
    # Create the transmittance texture
    textureWidth = 256
    textureHeight = 64
    @transmittanceTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, @transmittanceTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    #todo: gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB16F_ARB, textureWidth, textureHeight, 0, GL_RGB, GL_FLOAT, NULL)
    #      Unfortunately gl.RGB16F is not yet available to WebGL (waiting for an extension mechanism...)
    gl.bindTexture(gl.TEXTURE_2D, null)

    ## Precalculate the transmittance texture
    
    # Bind shader parameters
    gl.enableVertexAttribArray(@transmittanceProgram.vertexPosition)
    gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffer)
    gl.vertexAttribPointer(@shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0)

    # Create the frame buffer object
    frameBuffer = gl.createFramebuffer()
    #renderBuffer = gl.createRenderbuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, @transmittanceTexture, 0)
    
    # Render the transmittance data to the texture
    gl.viewport(0, 0, textureWidth, textureHeight);
    
    # Restore gl state
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.deleteFramebuffer(frameBuffer)
    #gl.deleteRenderbuffer(renderBuffer)
    null
  
  createResourcesHi: (gl) ->
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
    vertexShader = compileShader(gl, "fullscreenquad-vs")
    fragmentShader = compileShader(gl, "atmosphere-hi-fs")
    gl.attachShader(@shaderProgram, vertexShader)
    gl.attachShader(@shaderProgram, fragmentShader)
    gl.linkProgram(@shaderProgram)
    if not gl.getProgramParameter(@shaderProgram, gl.LINK_STATUS) then alert "Could not initialise shaders"

    # Get uniform locations
    @shaderProgram.camera = gl.getUniformLocation(@shaderProgram, "camera")
    @shaderProgram.sun = gl.getUniformLocation(@shaderProgram, "sun")
    @shaderProgram.invProjection = gl.getUniformLocation(@shaderProgram, "invProjection")
    @shaderProgram.invView = gl.getUniformLocation(@shaderProgram, "invView")
    @shaderProgram.exposure = gl.getUniformLocation(@shaderProgram, "exposure")
    
    # Get attribute array locations
    gl.useProgram(@shaderProgram)
    @shaderProgram.vertexPosition = gl.getAttribLocation(@shaderProgram, "vertexPosition")
    
    # Pre-calculate the lookup textures
    #todo: @createTransmittanceResources(gl)
    null
  
  renderHi: (gl, invView, invProjection, sun) ->
    # Change gl state
    saveState =
      blend:     gl.getParameter(gl.BLEND)
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    #gl.disable(gl.DEPTH_TEST)
    gl.depthMask(false)
    
    # Bind shaders and parameters
    gl.useProgram(@shaderProgram)

    gl.enableVertexAttribArray(@shaderProgram.vertexPosition)
    gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffer)
    gl.vertexAttribPointer(@shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0)
    
    #gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "projInverse"), 1, true, iproj.coefficients());
    #gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "viewInverse"), 1, true, iviewf.coefficients());
    #gl.uniform1f(gl.getUniformLocation(shaderProgram, "exposure"), exposure);
    
    gl.uniform3f(@shaderProgram.camera, 0.0, 0.0, 1.0)
    #gl.uniform3f(@shaderProgram.sun, 0.0, 0.0, 1.0)
    gl.uniform3fv(@shaderProgram.sun, sun)
    #gl.uniformMatrix4fv(@shaderProgram.invProjection, false, new Float32Array(pMatrix.flatten())
    #gl.uniformMatrix4fv(@shaderProgram.invView, false, new Float32Array(pMatrix.flatten())
    gl.uniformMatrix4fv(@shaderProgram.invProjection, false, new Float32Array(invProjection))
    gl.uniformMatrix4fv(@shaderProgram.invView, false, new Float32Array(invView))
    gl.uniform1f(@shaderProgram.exposure, 1.0)
    
    #varying vec2 coords;
    #varying vec3 ray;
    
    # Draw geometry
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    
    # Restore gl state
    if not saveState.blend then gl.disable(gl.BLEND)
    #if saveState.depthTest then gl.enable(gl.DEPTH_TEST)
    gl.depthMask(true)
    null
  
  createResourcesLo: (gl) ->
    # Create the vertex buffer
    @vertexBuffer = gl.createBuffer()
    @indexBuffer = gl.createBuffer()
    
    # Create the grid 
    # We'll assume the user has a 4:3 aspect ratio, so we'll construct the grid using the same ratio of quads
    nx = 4 * 5
    ny = 3 * 5
    #nx = 1
    #ny = 1
    vertices = new Array((ny+1) * (nx+1) * 2)
    for cy in [0..ny]    
      for cx in [0..nx]
        vertices[(cy * (nx+1) + cx) * 2 + 0] = -1.0 + (cx * 2) / nx
        vertices[(cy * (nx+1) + cx) * 2 + 1] = -1.0 + (cy * 2) / ny
    gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    
    indices = new Array(ny * nx * 6)
    for cy in [0..(ny-1)]
      for cx in [0..(nx-1)]
        indices[(cy * nx + cx) * 6 + 0] = ((cy+0) * (nx+1) + cx+0)
        indices[(cy * nx + cx) * 6 + 1] = ((cy+0) * (nx+1) + cx+1)
        indices[(cy * nx + cx) * 6 + 2] = ((cy+1) * (nx+1) + cx+0)
        indices[(cy * nx + cx) * 6 + 3] = ((cy+0) * (nx+1) + cx+1)
        indices[(cy * nx + cx) * 6 + 4] = ((cy+1) * (nx+1) + cx+1)
        indices[(cy * nx + cx) * 6 + 5] = ((cy+1) * (nx+1) + cx+0)
        #indices[(cy * nx + cx) * 6 + 0] = (cy * nx + cx) * 4 + 0
        #indices[(cy * nx + cx) * 6 + 1] = (cy * nx + cx) * 4 + 1
        #indices[(cy * nx + cx) * 6 + 2] = (cy * nx + cx) * 4 + 3
        #indices[(cy * nx + cx) * 6 + 3] = (cy * nx + cx) * 4 + 1
        #indices[(cy * nx + cx) * 6 + 4] = (cy * nx + cx) * 4 + 2
        #indices[(cy * nx + cx) * 6 + 5] = (cy * nx + cx) * 4 + 3
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, @indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
    
    # Create shader program
    @shaderProgram = gl.createProgram()
    vertexShader = compileShader(gl, "atmosphere-lo-vs")
    fragmentShader = compileShader(gl, "atmosphere-lo-fs")
    gl.attachShader(@shaderProgram, vertexShader)
    gl.attachShader(@shaderProgram, fragmentShader)
    gl.linkProgram(@shaderProgram)
    if not gl.getProgramParameter(@shaderProgram, gl.LINK_STATUS) then alert "Could not initialise shaders"

    # Get uniform locations
    @shaderProgram.camera = gl.getUniformLocation(@shaderProgram, "camera")
    @shaderProgram.sun = gl.getUniformLocation(@shaderProgram, "sun")
    @shaderProgram.g = gl.getUniformLocation(@shaderProgram, "g")
    @shaderProgram.g2 = gl.getUniformLocation(@shaderProgram, "g2")

    # Get attribute array locations
    gl.useProgram(@shaderProgram)
    @shaderProgram.vertexPosition = gl.getAttribLocation(@shaderProgram, "vertexPosition")
    null
  
  renderLo: (gl, invView, invProjection, sun) ->
    # Change gl state
    saveState =
      blend:     gl.getParameter(gl.BLEND)
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    #gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    #gl.enable(gl.BLEND)
    gl.disable(gl.BLEND)
    #gl.disable(gl.DEPTH_TEST)
    gl.depthMask(false)
    
    # Bind shaders and parameters
    gl.useProgram(@shaderProgram)

    gl.enableVertexAttribArray(@shaderProgram.vertexPosition)
    gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffer)
    gl.vertexAttribPointer(@shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0)

    
    #gl.uniform3f(@shaderProgram.camera, 0.0, 0.0, 1.0)
    #gl.uniform3fv(@shaderProgram.sun, new Float32Array(sun))
    #gl.uniform1f(@shaderProgram.g, 0.0)
    #gl.uniform1f(@shaderProgram.g2, 0.0)
    
    # Draw geometry
    nx = 4 * 5
    ny = 3 * 5
    #nx = 1
    #ny = 1
    #gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, @indexBuffer);
    gl.drawElements(gl.TRIANGLES, ny * nx * 6, gl.UNSIGNED_SHORT, 0)
    
    # Restore gl state
    if saveState.blend then gl.enable(gl.BLEND)
    #if saveState.depthTest then gl.enable(gl.DEPTH_TEST)
    gl.depthMask(true)
    null
  
  destroyResources: ->
    if document.getElementById(canvas.canvasId) # According to geometryModule: Context won't exist if canvas has disappeared
      if @shaderProgram then @shaderProgram.destroy()
      if @vertexBuffer then @vertexBuffer.destroy()
    null

###
SceneJS listeners
###

SceneJS._eventModule.addListener(
  SceneJS._eventModule.RESET
  () ->
    AtmosphereModule.destroyResources()
)

###
Cloud dome node type
###

#SceneJS.CloudDome = SceneJS.createNodeType("cloud-dome")
#
#SceneJS.CloudDome.prototype._init = (params) ->
#  @setRadius params.radius
#  null
#  
#SceneJS.CloudDome.prototype.setRadius = (radius) ->
#  @radius = radius || 100.0
#  @_setDirty()
#  this
#
#SceneJS.CloudDome.prototype.getColor = ->
#  radius: @radius 
#
#SceneJS.CloudDome.prototype._render = (traversalContext) ->
#  if SceneJS._traversalMode == SceneJS._TRAVERSAL_MODE_RENDER
#    @_renderNodes traversalContext
#    if not AtmosphereModule.vertexBuffer then AtmosphereModule.createResources(canvas.context)
#    AtmosphereModule.render(canvas.context)
#  null


class Atmosphere
  render: (gl, invView, invProjection, sun) ->
    if not AtmosphereModule.vertexBuffer then AtmosphereModule.createResourcesLo(gl)
    AtmosphereModule.renderLo(gl, invView, invProjection, sun)
    null






###
A proxy for the moon
###

###
Moon Module
###

MoonModule =
  vertexBuffer: null
  textureCoordBuffer: null
  shaderProgram: null
  texture: null
  
  createResources: (gl) ->
    # Create the texture
    tex = @texture = gl.createTexture()
    tex.image = new Image()
    tex.image.src = "textures/moon.png"
    tex.image.onload = -> configureTexture(gl, tex)

    # Create the position & texture coordinate buffers
    @vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffer)
    vertices = [
       1.0,  1.0
      -1.0,  1.0
       1.0, -1.0
      -1.0, -1.0 ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    @textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, @textureCoordBuffer);
    textureCoords = [
      1.0, 0.0
      0.0, 0.0
      1.0, 1.0
      0.0, 1.0 ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW)
    
    # Create shader program
    @shaderProgram = gl.createProgram()
    vertexShader = compileShader(gl, "moon-vs")
    fragmentShader = compileShader(gl, "moon-fs")
    gl.attachShader(@shaderProgram, vertexShader)
    gl.attachShader(@shaderProgram, fragmentShader)
    gl.linkProgram(@shaderProgram)
    if not gl.getProgramParameter(@shaderProgram, gl.LINK_STATUS) then alert "Could not initialise shaders"
    
    # Set shader parameters
    gl.useProgram(@shaderProgram)
    
    @shaderProgram.vertexPosition = gl.getAttribLocation(@shaderProgram, "vertexPosition")
    gl.enableVertexAttribArray(@shaderProgram.vertexPosition)
    
    @shaderProgram.textureCoord = gl.getAttribLocation(@shaderProgram, "textureCoord")
    gl.enableVertexAttribArray(@shaderProgram.textureCoord)

    @shaderProgram.orbit = gl.getUniformLocation(@shaderProgram, "orbit")
    @shaderProgram.view = gl.getUniformLocation(@shaderProgram, "view")
    @shaderProgram.projection = gl.getUniformLocation(@shaderProgram, "projection")
    @shaderProgram.exposure = gl.getUniformLocation(@shaderProgram, "exposure")
    @shaderProgram.colorSampler = gl.getUniformLocation(@shaderProgram, "colorSampler")
    null

  destroyResources: ->
    if document.getElementById(canvas.canvasId)
      if @shaderProgram then @shaderProgram.destroy()
      if @vertexBuffer then @vertexBuffer.destroy()
      if @textureCoordBuffer then @textureCoordBuffer.destroy()
      if @texture then @texture.destroy()
    null
  
  render: (gl, view, projection, orbit) ->
    # Change gl state
    saveState =
      blend:     gl.getParameter(gl.BLEND)
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    #gl.disable(gl.DEPTH_TEST)
    #gl.depthMask(false)
    #gl.clearDepth(10000.0)
    #gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
    
    # Bind shaders and parameters
    shaderProgram = @shaderProgram
    gl.useProgram(shaderProgram)

    gl.disableVertexAttribArray(k) for k in [2..7]
    
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, @texture)
    gl.uniform1i(shaderProgram.colorSampler, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffer)
    gl.enableVertexAttribArray(shaderProgram.vertexPosition)
    gl.vertexAttribPointer(shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, @textureCoordBuffer)
    gl.enableVertexAttribArray(shaderProgram.textureCoord)
    gl.vertexAttribPointer(shaderProgram.textureCoord, 2, gl.FLOAT, false, 0, 0)
    
    gl.uniformMatrix4fv(shaderProgram.orbit, false, new Float32Array(orbit))
    gl.uniformMatrix4fv(shaderProgram.view, false, new Float32Array(view))
    gl.uniformMatrix4fv(shaderProgram.projection, false, new Float32Array(projection))
    
    gl.uniform1f(shaderProgram.exposure, 0.4)
    
    # Draw geometry
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    
    # Restore gl state
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, null)

    if not saveState.blend then gl.disable(gl.BLEND)
    #if saveState.depthTest then gl.enable(gl.DEPTH_TEST)
    #gl.depthMask(true)
    null

###
SceneJS listeners
###

SceneJS._eventModule.addListener(
  SceneJS._eventModule.RESET
  () ->
    MoonModule.destroyResources()
)

###
Moon proxy
###

class Moon
  constructor: ->
    #@node = 
    #  type:           "material"
    #  baseColor:      { r: 0.0, g: 0.0, b: 0.0 }
    #  specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
    #  specular:       0.0
    #  shine:          0.0
    #  nodes: [
    #    type: "texture"
    #    layers: [{uri:"textures/moon.png"}]
    #    nodes: [
    #      type:       "geometry"
    #      primitive:  "triangles"
    #      positions:  [1, 1, 1,-1, 1, 1,-1,-1, 1, 1,-1, 1, 1, 1, 1, 1,-1, 1, 1,-1,-1, 1, 1,-1, 1, 1, 1, 1, 1,-1,-1, 1,-1,-1, 1, 1,-1, 1, 1,-1, 1,-1,-1,-1,-1,-1,-1, 1,-1,-1,-1, 1,-1,-1, 1,-1, 1,-1,-1, 1, 1,-1,-1,-1,-1,-1,-1, 1,-1, 1, 1,-1]
    #      uv:         [1,1,0,1,0,0,1,0,0,1,0,0,1,0,1,1,1,0,1,1,0,1,0,0,1,1,0,1,0,0,1,0,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]
    #      indices:    [0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]
    #    ]
    #  ]
    
    # Control the moon position using spherical coordinates, but leaving out radius since it is fixed 
    # (inclination, azimuth)
    @position = [0, 0]
    @velocity = [0, 0.1]
  
  render: (gl, view, projection, time) ->
    @position[0] = @velocity[0] * time
    @position[1] = @velocity[1] * time
    if not MoonModule.vertexBuffer then MoonModule.createResources(gl)
    MoonModule.render(gl, view, projection, @position)


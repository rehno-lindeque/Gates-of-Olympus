###
A proxy for the sun
###

###
Sun Module
###

SunModule =
  vertexBuffer: null
  textureCoordBuffer: null
  shaderProgram: null
  texture: null
  
  createResources: (gl) ->
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
    vertexShader = compileShader(gl, "sun-vs")
    fragmentShader = compileShader(gl, "sun-fs")
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
    
    @shaderProgram.pos = gl.getUniformLocation(@shaderProgram, "pos")
    @shaderProgram.view = gl.getUniformLocation(@shaderProgram, "view")
    @shaderProgram.projection = gl.getUniformLocation(@shaderProgram, "projection")
    @shaderProgram.exposure = gl.getUniformLocation(@shaderProgram, "exposure")
    null

  destroyResources: ->
    if document.getElementById(canvas.canvasId)
      if @shaderProgram then @shaderProgram.destroy()
      if @vertexBuffer then @vertexBuffer.destroy()
      if @textureCoordBuffer then @textureCoordBuffer.destroy()
    null
  
  render: (gl, view, projection, pos) ->
    # Change gl state
    saveState =
      blend:     gl.getParameter(gl.BLEND)
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    
    # Bind shaders and parameters
    shaderProgram = @shaderProgram
    gl.useProgram(shaderProgram)

    gl.disableVertexAttribArray(k) for k in [2..7]
    
    gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffer)
    gl.enableVertexAttribArray(shaderProgram.vertexPosition)
    gl.vertexAttribPointer(shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, @textureCoordBuffer)
    gl.enableVertexAttribArray(shaderProgram.textureCoord)
    gl.vertexAttribPointer(shaderProgram.textureCoord, 2, gl.FLOAT, false, 0, 0)

    gl.uniform3f(shaderProgram.pos, pos[0], pos[1], pos[2])
    gl.uniformMatrix4fv(shaderProgram.view, false, new Float32Array(view))
    gl.uniformMatrix4fv(shaderProgram.projection, false, new Float32Array(projection))
    
    gl.uniform1f(shaderProgram.exposure, 0.4)
    
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
    SunModule.destroyResources()
)

###
Sun proxy
###

class Sun
  constructor: ->    
    # Control the sun position using spherical coordinates, but leaving out radius since it is fixed 
    # (inclination, azimuth)
    @velocity = [0.005, 0.0]
    @position = [0.0, 0.0, 0.0]
  
  render: (gl, view, projection, time) ->
    orbit = [ Math.PI * 0.3 + @velocity[0] * time, @velocity[1] * time ]
    if not SunModule.vertexBuffer then SunModule.createResources(gl)
    
    # Since gates of olympus uses a left-handed coordinate system with
    # y as the "up" vector, the inclination starts at (0,0,1) and goes up to (0,1,0)
    cosIncl = Math.cos(orbit[0])
    sinIncl = Math.sin(orbit[0])
    cosAzim = Math.cos(orbit[1])
    sinAzim = Math.sin(orbit[1])
    @position = [cosIncl * sinAzim, cosIncl * cosAzim, sinIncl]
    
    SunModule.render(gl, view, projection, @position)


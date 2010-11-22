###
A proxy for the moon
###

###
Moon Module
###

MoonModule =
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
    null

  destroyResources: ->
    if document.getElementById(canvas.canvasId)
      if @shaderProgram then @shaderProgram.destroy()
      if @vertexBuffer then @vertexBuffer.destroy()
    null
  
  render: (gl, view) ->
    # Change gl state
    saveState =
      blend:     gl.getParameter(gl.BLEND)
      depthTest: gl.getParameter(gl.DEPTH_TEST)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    #gl.disable(gl.DEPTH_TEST)
    
    # Bind shaders and parameters
    gl.useProgram(@shaderProgram)
    gl.bindBuffer(gl.ARRAY_BUFFER, @vertexBuffer)
    gl.vertexAttribPointer(@shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0)
    
    @shaderProgram.view = gl.getUniformLocation(@shaderProgram, "view")
    @shaderProgram.exposure = gl.getUniformLocation(@shaderProgram, "exposure")
    
    gl.uniformMatrix4fv(@shaderProgram.view, false, new Float32Array(view))
    gl.uniform1f(@shaderProgram.exposure, 0.4)
    
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
    @velocity = [0, 0]
  
  render: (gl, view) ->
    MoonModule.render(gl, view)


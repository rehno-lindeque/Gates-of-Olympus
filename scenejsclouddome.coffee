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

compileShader = (gl, id) ->
  # Get the associated html script element
  scriptElement = document.getElementById(id)
  if not scriptElement then return null
  
  # Determine the type of shader
  if scriptElement.type == "x-shader/x-fragment" 
    shaderType = gl.FRAGMENT_SHADER
  else if scriptElement.type == "x-shader/x-vertex" 
    shaderType = gl.VERTEX_SHADER
  else 
    return null
  
  # Load the shader into a string
  str = ""
  if scriptElement.src
    if window.XMLHttpRequest
      httpRequest = new XMLHttpRequest()
    else # for IE 5/6
      # We could use httpRequest=new ActiveXObject("Microsoft.XMLHTTP"); but IE 5/6 won't support WebGL anyway and is broken anyway.
      return null
    httpRequest.open("GET", scriptElement.src, false)
    httpRequest.overrideMimeType('text/plain; charset=utf-8'); 
    httpRequest.send()
    str = httpRequest.responseText
  else
    child = scriptElement.firstChild
    while child
      if child.nodeType == 3
        str += child.textContent
      child = child.nextSibling

  # Create / compile the shader
  shader = gl.createShader(shaderType)
  gl.shaderSource(shader, str)
  gl.compileShader(shader)
  if not gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    alert(gl.getShaderInfoLog(shader))
    return null
  return shader

createResources = ->
  gl = canvas.context
  
  # Create the vertex buffer
  vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  vertices = [
     1.0,  1.0
    -1.0,  1.0
     1.0, -1.0
    -1.0, -1.0 ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  
  # Create shader program
  shaderProgram = gl.createProgram()
  vertexShader = compileShader(gl, "clouddome-vs")
  fragmentShader = compileShader(gl, "clouddome-fs")
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  if not gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) then alert "Could not initialise shaders"
  
  # Set shader parameters
  gl.useProgram(shaderProgram)
  shaderProgram.vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition")
  gl.enableVertexAttribArray(shaderProgram.vertexPosition)
  
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
  gl = canvas.context
  #gl.disable(gl.DEPTH_TEST)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.enable(gl.BLEND);
  gl.useProgram(shaderProgram)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.vertexAttribPointer(shaderProgram.vertexPosition, 2, gl.FLOAT, false, 0, 0)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  gl.disable(gl.BLEND);

SceneJS.CloudDome.prototype._render = (traversalContext) ->
  if SceneJS._traversalMode == SceneJS._TRAVERSAL_MODE_RENDER
    @_renderNodes traversalContext
    if not vertexBuffer then createResources()
    @renderClouds()
  null

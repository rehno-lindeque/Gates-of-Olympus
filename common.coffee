###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

# Compose SceneJS nodes using the JSON API
addChildren = (parent, children...) ->
  parent.nodes = if parent.nodes? then Array.concat(parent.nodes, children) else children
  parent

# Compile a WebGL shader
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
    httpRequest.overrideMimeType('text/plain; charset=utf-8')
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

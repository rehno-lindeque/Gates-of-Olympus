###
Gates of Olympus (A multi-layer Tower Defense game...)
Copyright 2010, Rehno Lindeque.

* Please visit http://gatesofolympus.com/.
* This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Initialization and rendering loop
###

# Camera parameters
yaw = 45
pitch = 0

gameScene
  .setData({yaw: yaw, pitch: pitch})
  .render()

canvas = document.getElementById(gameScene.getCanvasId())

###
Game logic
###

# Logical inputs
currentTowerSelection = -1

# Platforms
towers = new Array (sqrGridSize * levels)
for c in [0...(sqrGridSize * levels)]
  towers[c] = 0

towers[0] = 1
towers[1] = 1
towers[2] = 1
towers[3] = 2
towers[4] = 2
towers[5] = 2
towers[6] = 1
towers[7] = 2
towers[8] = 1
towers[9] = 1
towers[10] = 1
towers[11] = 1

towers[sqrGridSize+0] = 1
towers[sqrGridSize+1] = 2
towers[sqrGridSize+2] = 1
towers[sqrGridSize+3] = 1
towers[sqrGridSize+4] = 1
towers[sqrGridSize+5] = 2
towers[sqrGridSize+6] = 1
towers[sqrGridSize+7] = 2
towers[sqrGridSize+8] = 1
towers[sqrGridSize+9] = 1
towers[sqrGridSize+10] = 1
towers[sqrGridSize+11] = 1

towers[290] = 1
towers[291] = 1
towers[292] = 2
towers[293] = 1
towers[294] = 1
towers[295] = 1
towers[296] = 1
towers[297] = 2
towers[298] = 2
towers[299] = 1

createTowers = (towers) ->
  for cz in [0...levels]
    for cy in [0...gridSize]
      for cx in [0...gridSize]
        t = towers[cz * sqrGridSize + cy * gridSize + cx]
        if t != 0
          switch t
            when 1 
              node = SceneJS.instance  { uri: towerURI[0] }
              parentNode = level.levelNodes[cz].archerTowers
            when 2 
              node = SceneJS.instance  { uri: towerURI[1] }
              parentNode = level.levelNodes[cz].catapultTowers
            else 
              alert "" + (cz * sqrGridSize + cy * gridSize + cx) + " : " + t
          parentNode.addNode(
            SceneJS.translate(
              {x: cellScale * (cx - gridSize / 2) + cellScale * 0.5, y: cellScale * (cy - gridSize / 2) + cellScale * 0.5}
              node
            )
          )
  null

createTowers towers

###
User input 
###

# Calculate the intersection of any xy-plane 
intersectRayXYPlane = (rayOrigin, rayDirection, planeZ) ->
  if rayDirection[2] == 0
    null                  # The ray is parallel to the plane
  else
    zDist = planeZ - rayOrigin[2]
    dist = zDist / rayDirection[2]
    #alert "z " + zDist + " dist " + dist
    if dist < 0
      #alert "Plane behind camera.."
      null
    else
      addVec3(rayOrigin, mulVec3Scalar(rayDirection, dist))

# Mouse inputs
mouseLastX = 0
mouseLastY = 0
mouseDragging = false

# Update the placement of the platform according to the mouse coordinates and tower selection
updateTowerPlacement = () ->
  mouseX = mouseLastX
  mouseY = mouseLastY
  canvasElement = document.getElementById("gameCanvas");
  mouseX -= canvasElement.offsetLeft
  mouseY -= canvasElement.offsetTop
  
  # Transform ray origin into world space
  lookAtEye  = sceneLookAtNode.getEye()
  lookAtUp   = sceneLookAtNode.getUp()
  lookAtLook = sceneLookAtNode.getLook()
  rayOrigin  = [lookAtEye.x, lookAtEye.y, lookAtEye.z]
  yAxis      = [lookAtUp.x, lookAtUp.y, lookAtUp.z]
  zAxis      = [lookAtLook.x, lookAtLook.y, lookAtLook.z]
  zAxis      = subVec3(zAxis, rayOrigin)
  zAxis      = normalizeVec3(zAxis)
  xAxis      = normalizeVec3(cross3Vec3(yAxis,zAxis))
  yAxis      = cross3Vec3(zAxis,xAxis)
  screenX    = mouseX / canvasSize[0]
  screenY    = 1.0 - mouseY / canvasSize[1]
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(xAxis, lerp(screenX, cameraConfig.optics.left, cameraConfig.optics.right)))
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(yAxis, lerp(screenY, cameraConfig.optics.bottom, cameraConfig.optics.top)))

  # Find the intersection with one of the platforms
  intersection = intersectRayXYPlane(rayOrigin, zAxis, platformHeights[0])
  #alert intersection + " [" + rayOrigin + "] [" + zAxis + "] " + platformHeights[0]
  if intersection? and Math.abs(intersection[0]) < platformLengths[0] and Math.abs(intersection[1]) < platformLengths[0]
    #alert "Platform 1 intersected (" + intersection[0] + "," + intersection[1] + ")"
    towerPlacement.level  = 0
    towerPlacement.cell.x = Math.floor(intersection[0])
    towerPlacement.cell.y = Math.floor(intersection[1])
  else 
    intersection = intersectRayXYPlane(rayOrigin, zAxis, platformHeights[1])
    if intersection? and Math.abs(intersection[0]) < platformLengths[1] and Math.abs(intersection[1]) < platformLengths[1]
      #alert "Platform 2 intersected (" + intersection[0] + "," + intersection[1] + ")"
      towerPlacement.level  = 1
      towerPlacement.cell.x = Math.floor(intersection[0])
      towerPlacement.cell.y = Math.floor(intersection[1])
    else
      intersection = intersectRayXYPlane(rayOrigin, zAxis, platformHeights[2])
      if intersection? and Math.abs(intersection[0]) < platformLengths[2] and Math.abs(intersection[1]) < platformLengths[2]
        #alert "Platform 3 intersected (" + intersection[0] + "," + intersection[1] + ")"
        towerPlacement.level  = 2
        towerPlacement.cell.x = Math.floor(intersection[0])
        towerPlacement.cell.y = Math.floor(intersection[1])
      else
        towerPlacement.level  = -1
        towerPlacement.cell.x = -1
        towerPlacement.cell.y = -1
        
  # Update the placement tower node
  if towerPlacement.level != -1 and currentTowerSelection != -1
    SceneJS.fireEvent(
      "configure"
      "placementTower"
      cfg: 
        x: intersection[0]
        y: intersection[1]
        z: platformHeights[towerPlacement.level]
        "#placementTowerModel":
          selection: [currentTowerSelection]
    )
  else
    SceneJS.fireEvent(
      "configure"
      "placementTower"
      cfg: 
        "#placementTowerModel":
          selection: []
    )
  null

keyDown = (event) ->
  switch String.fromCharCode(event.keyCode)
    when "1" then currentTowerSelection =  0
    when "2" then currentTowerSelection =  1
    #when "a"
    #  lookAtEye  = sceneLookAtNode.getEye()
    else          currentTowerSelection = -1
  updateTowerPlacement()

mouseDown = (event) ->
  mouseLastX = event.clientX
  mouseLastY = event.clientY
  mouseDragging = true

mouseUp = ->
  mouseDragging = false

mouseMove = (event) ->
  if mouseDragging
    yaw += (event.clientX - mouseLastX) * 0.5
    pitch += (event.clientY - mouseLastY) * -0.5
    #alert "" + platformHeights + " " + platformLengths
  mouseLastX = event.clientX
  mouseLastY = event.clientY
  if not mouseDragging
    updateTowerPlacement()

canvas.addEventListener('mousedown', mouseDown, true)
canvas.addEventListener('mousemove', mouseMove, true)
canvas.addEventListener('mouseup', mouseUp, true)
document.onkeydown = keyDown

window.render = ->
  # Animate the gui diases
  for c in [0...numTowerTypes]
    guiDiasRotVelocity[c] += (Math.random() - 0.5) * 0.1
    guiDiasRotVelocity[c] -= 0.001 if guiDiasRotPosition[c] > 0
    guiDiasRotVelocity[c] += 0.001 if guiDiasRotPosition[c] < 0
    guiDiasRotVelocity[c] = clamp(guiDiasRotVelocity[c], -0.1, 0.1)
    guiDiasRotPosition[c] += guiDiasRotVelocity[c]
    guiDiasRotPosition[c] = clamp(guiDiasRotPosition[c], -30.0, 30.0)
  
  # Render the scene
  gameScene
    .setData({yaw: yaw, pitch: pitch})
    .render();

interval = window.setInterval("window.render()", 10);


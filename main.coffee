###
Gates of Olympus (A multi-layer Tower Defense game...)
Copyright 2010, Rehno Lindeque.

* Please visit http://gatesofolympus.com/.
* This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Initialization and rendering loop
###

canvas = document.getElementById(gameScene.getCanvasId())
canvas.width = window.innerWidth
canvas.height = window.innerHeight
gameScene.render()

###
Game logic
###

# Logical inputs
currentTowerSelection = -1

# Platforms
level.towers[0] = 0
level.towers[1] = 0
level.towers[2] = 0
level.towers[3] = 1
level.towers[4] = 1
level.towers[5] = 1
level.towers[6] = 0
level.towers[7] = 1
level.towers[8] = 0
level.towers[9] = 0
level.towers[10] = 0
level.towers[11] = 0

level.towers[sqrGridSize+0] = 0
level.towers[sqrGridSize+1] = 1
level.towers[sqrGridSize+2] = 0
level.towers[sqrGridSize+3] = 0
level.towers[sqrGridSize+4] = 0
level.towers[sqrGridSize+5] = 1
level.towers[sqrGridSize+6] = 0
level.towers[sqrGridSize+7] = 1
level.towers[sqrGridSize+8] = 0
level.towers[sqrGridSize+9] = 0
level.towers[sqrGridSize+10] = 0
level.towers[sqrGridSize+11] = 0

level.towers[290] = 0
level.towers[291] = 0
level.towers[292] = 1
level.towers[293] = 0
level.towers[294] = 0
level.towers[295] = 0
level.towers[296] = 0
level.towers[297] = 1
level.towers[298] = 1
level.towers[299] = 0

level.createTowers level.towers

# Creatures
level.creatures.addCreature(Scorpion)

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

# Calculate tower placement
calcTowerPlacement = (level, intersection) ->
  x: Math.floor(intersection[0] / (cellScale * platformScales[level]) + gridHalfSize)
  y: Math.floor(intersection[1] / (cellScale * platformScales[level]) + gridHalfSize)

# Update the placement of the platform according to the mouse coordinates and tower selection
updateTowerPlacement = () ->
  mouseX = mouseLastX
  mouseY = mouseLastY
  canvasElement = document.getElementById("gameCanvas");
  mouseX -= canvasElement.offsetLeft
  mouseY -= canvasElement.offsetTop
  
  # Transform ray origin into world space
  lookAtEye  = levelLookAt.lookAtNode.getEye()
  lookAtUp   = levelLookAt.lookAtNode.getUp()
  lookAtLook = levelLookAt.lookAtNode.getLook()
  rayOrigin  = [lookAtEye.x, lookAtEye.y, lookAtEye.z]
  yAxis      = [lookAtUp.x, lookAtUp.y, lookAtUp.z]
  zAxis      = [lookAtLook.x, lookAtLook.y, lookAtLook.z]
  zAxis      = subVec3(zAxis, rayOrigin)
  zAxis      = normalizeVec3(zAxis)
  xAxis      = normalizeVec3(cross3Vec3(zAxis,yAxis))
  yAxis      = cross3Vec3(xAxis, zAxis)
  screenX    = mouseX / canvasSize[0]
  screenY    = 1.0 - mouseY / canvasSize[1]
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(xAxis, lerp(screenX, levelCamera.config.optics.left, levelCamera.config.optics.right)))
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(yAxis, lerp(screenY, levelCamera.config.optics.bottom, levelCamera.config.optics.top)))
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(xAxis, gameSceneOffset[0]))
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(yAxis, gameSceneOffset[1]))
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(zAxis, gameSceneOffset[2]))

  # Find the intersection with one of the platforms
  intersection = intersectRayXYPlane(rayOrigin, zAxis, platformHeights[0])
  #alert intersection + " [" + rayOrigin + "] [" + zAxis + "] " + platformHeights[0]
  if intersection? and Math.abs(intersection[0]) < platformLengths[0] and Math.abs(intersection[1]) < platformLengths[0]
    #alert "Platform 1 intersected (" + intersection[0] + "," + intersection[1] + ")"
    towerPlacement.level  = 0
    towerPlacement.cell = calcTowerPlacement(towerPlacement.level, intersection)
  else 
    intersection = intersectRayXYPlane(rayOrigin, zAxis, platformHeights[1])
    if intersection? and Math.abs(intersection[0]) < platformLengths[1] and Math.abs(intersection[1]) < platformLengths[1]
      #alert "Platform 2 intersected (" + intersection[0] + "," + intersection[1] + ")"
      towerPlacement.level  = 1
      towerPlacement.cell = calcTowerPlacement(towerPlacement.level, intersection)
    else
      intersection = intersectRayXYPlane(rayOrigin, zAxis, platformHeights[2])
      if intersection? and Math.abs(intersection[0]) < platformLengths[2] and Math.abs(intersection[1]) < platformLengths[2]
        #alert "Platform 3 intersected (" + intersection[0] + "," + intersection[1] + ")"
        towerPlacement.level  = 2
        towerPlacement.cell = calcTowerPlacement(towerPlacement.level, intersection)
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
  #switch String.fromCharCode(event.keyCode)
  switch event.keyCode
    when key1   then currentTowerSelection =  0
    when key2   then currentTowerSelection =  1
    when keyESC then currentTowerSelection = -1
  updateTowerPlacement()

mouseDown = (event) ->
  mouseLastX = event.clientX
  mouseLastY = event.clientY
  mouseDragging = true
  
mouseUp = ->
  #alert "Up! " + mouseDragging + " " + towerPlacement + " " + currentTowerSelection
  if towerPlacement.level != -1 and currentTowerSelection != -1
    level.addTower(towerPlacement, currentTowerSelection)
  mouseDragging = false

mouseMove = (event) ->
  if mouseDragging
    levelLookAt.angle += (event.clientX - mouseLastX) * mouseSpeed
    levelLookAt.update()
  mouseLastX = event.clientX
  mouseLastY = event.clientY
  if not mouseDragging
    updateTowerPlacement()

canvas.addEventListener('mousedown', mouseDown, true)
canvas.addEventListener('mousemove', mouseMove, true)
canvas.addEventListener('mouseup', mouseUp, true)
document.onkeydown = keyDown
window.onresize = ->
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvasSize = [window.innerWidth, window.innerHeight]

window.render = ->
  # Animate the gui diases
  for c in [0...numTowerTypes]
    guiDiasRotVelocity[c] += (Math.random() - 0.5) * 0.1
    guiDiasRotVelocity[c] -= 0.001 if guiDiasRotPosition[c] > 0
    guiDiasRotVelocity[c] += 0.001 if guiDiasRotPosition[c] < 0
    guiDiasRotVelocity[c] = clamp(guiDiasRotVelocity[c], -0.1, 0.1)
    guiDiasRotPosition[c] += guiDiasRotVelocity[c]
    guiDiasRotPosition[c] = clamp(guiDiasRotPosition[c], -30.0, 30.0)
  
  gui.update()
  level.update()
  
  # Render the scene
  gameScene.render();

interval = window.setInterval("window.render()", 10);


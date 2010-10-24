###
Gates of Olympus (A multi-layer Tower Defense game...)
Copyright 2010, Rehno Lindeque.

* Please visit http://gatesofolympus.com/.
* This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Initialization and rendering loop
###

canvas = document.getElementById(sceneNode.canvasId)
canvas.width = window.innerWidth
canvas.height = window.innerHeight
gameScene.render()

###
Game logic
###

# Logical inputs
currentTowerSelection = -1

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
  sceneLookAt = levelLookAt.withSceneLookAt()
  lookAtEye  = sceneLookAt.get("eye")
  lookAtUp   = sceneLookAt.get("up")
  lookAtLook = sceneLookAt.get("look")
  rayOrigin  = [lookAtEye.x, lookAtEye.y, lookAtEye.z]
  yAxis      = [lookAtUp.x, lookAtUp.y, lookAtUp.z]
  zAxis      = [lookAtLook.x, lookAtLook.y, lookAtLook.z]
  zAxis      = subVec3(zAxis, rayOrigin)
  zAxis      = normalizeVec3(zAxis)
  xAxis      = normalizeVec3(cross3Vec3(zAxis,yAxis))
  yAxis      = cross3Vec3(xAxis, zAxis)
  screenX    = mouseX / canvasSize[0]
  screenY    = 1.0 - mouseY / canvasSize[1]
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(xAxis, lerp(screenX, levelCamera.optics.left, levelCamera.optics.right)))
  rayOrigin  = addVec3(rayOrigin, mulVec3Scalar(yAxis, lerp(screenY, levelCamera.optics.bottom, levelCamera.optics.top)))
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
    SceneJS.withNode("placementTower")
      .set(
        x: intersection[0]
        y: intersection[1]
        z: platformHeights[towerPlacement.level])
      .node("placementTowerModel")
      .set("selection", [currentTowerSelection])
  else
    SceneJS.withNode("placementTower").node("placementTowerModel").set("selection", [])
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
  canvasSize[0] = window.innerWidth
  canvasSize[1] = window.innerHeight
  backgroundCamera.reconfigure(canvasSize)
  levelCamera.reconfigure(canvasSize)
  guiCamera.reconfigure()

window.render = ->
  # Animate the gui daises
  for c in [0...numTowerTypes]
    guiDaisRotVelocity[c] += (Math.random() - 0.5) * 0.1
    guiDaisRotVelocity[c] -= 0.001 if guiDaisRotPosition[c] > 0
    guiDaisRotVelocity[c] += 0.001 if guiDaisRotPosition[c] < 0
    guiDaisRotVelocity[c] = clamp(guiDaisRotVelocity[c], -0.1, 0.1)
    guiDaisRotPosition[c] += guiDaisRotVelocity[c]
    guiDaisRotPosition[c] = clamp(guiDaisRotPosition[c], -30.0, 30.0)
  
  gui.update()
  level.update()
  
  # Update game events
  timeline.update (timeline.time + 0.1)
  
  # Render the scene
  gameScene.render();

interval = window.setInterval("window.render()", 10);


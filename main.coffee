###
Gates of Olympus (A multi-layer Tower Defense game...)
Copyright 2010, Rehno Lindeque.

* Please visit http://gatesofolympus.com/.
* This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Auxiliary functions
###

square = (x) -> x*x
min = (x, y) -> if x < y then x else y
max = (x, y) -> if x > y then x else y
clamp = (x, y, z) -> if (x < y) then y else (if x > z then z else x)
lerp = (t, x, y) -> x * (1.0 - t) + y * t

###
Globals
###

# Canvas
canvasSize = [1020.0, 800.0]

# Platforms
gridSize = 12                   # number of grid cells in one row/column
sqrGridSize = square(gridSize)  # total number of grid cells
levels = 3                      # number of platforms
cellScale = 0.9                 # size of a grid cell in world space

platformHeights = [
    cellScale*10 + 1.15
    1.15
    cellScale*-11 + 1.15 ]
  
platformLengths = [
    0.78 * 0.5 * cellScale * gridSize
    1.00 * 0.5 * cellScale * gridSize
    1.22 * 0.5 * cellScale * gridSize ]

# Towers
numTowerTypes = 3

# State
guiDiasRotVelocity = [
  0.0, 0.0
  0.0, 0.0
  0.0, 0.0 ]

guiDiasRotPosition = [
  0.0, 0.0
  0.0, 0.0
  0.0, 0.0 ]
  
# Input
towerPlacement = 
  level: -1
  cell: { x: -1, y: -1 }

###
Tower definitions
###

towerURI = ["../ArcherTower", "../CatapultTower", "../LightningTower"]
towerTextureURI = ["textures/archer.jpg", "textures/catapult.jpg", "textures/lightning.jpg"]

towerNode = (index, sid) -> 
  tex = SceneJS.texture({layers: [{uri: towerTextureURI[index]}]})
  SceneJS.material(
    baseColor:      { r: 1.0, g: 1.0, b: 1.0 }
    specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
    specular:       0.0
    shine:          0.0
    tex
  ) # material
  tex

###
Level definitions
###

# Scene graph group nodes
levelNodes = new Array 3
levelNodes[0] = {
  archerTowers:   towerNode(0, "archerTowers0")
  catapultTowers: towerNode(1, "catapultTowers0") }
levelNodes[1] = {
  archerTowers:   towerNode(0, "archerTowers1")
  catapultTowers: towerNode(1, "catapultTowers1") }
levelNodes[2] = {
  archerTowers:   towerNode(0, "archerTowers2")
  catapultTowers: towerNode(1, "catapultTowers2") }

# Platform nodes
platformGeometry = (type) -> 
  s = gridSize * cellScale * 0.5  # scale size of the grid in world space
  SceneJS.geometry({
    type: type
    primitive: "triangles"
    positions: [
        -s,  s,  0
         s,  s,  0
         s, -s,  0
        -s, -s,  0
      ]
    indices: [0,  1,  2, 0, 2, 3]
  })

###
The main scene definition
###

cameraConfig =
  optics:
    type:   "ortho"
    left:   -12.5 * (canvasSize[0] / canvasSize[1])
    right:   12.5 * (canvasSize[0] / canvasSize[1])
    bottom: -12.5
    top:     12.5
    near:    0.1
    far:     300.0
    
sceneLightsConfig =
  sources: [
    type:      "dir"
    color:     { r: 1.0, g: 1.0, b: 1.0 }
    diffuse:   true
    specular:  false
    dir:       { x: 1.0, y: 1.0, z: -1.0 }
  #,
  #  type:      "ambient"
  #  color:     { r: 0.5, g: 0.5, b: 0.5 }
  ]
  
towerPlacementNode = () ->
  tower1 = towerNode(0, "placementTower"+0)
  tower1.addNode(SceneJS.instance {uri: towerURI[0]})
  tower2 = towerNode(1, "placementTower"+1)
  tower2.addNode(SceneJS.instance {uri: towerURI[1]})
  SceneJS.translate(
    { id: "placementTower", z: platformHeights[1] }
    SceneJS.selector(
      { sid: "placementTowerModel", selection: [0] }
      tower1
      tower2
    ) # selector
  ) # translate
  
platformsNode = 
  SceneJS.material(
    #baseColor:      { r: 0.7, g: 0.7, b: 0.7 }
    baseColor:      { r: 0.75, g: 0.78, b: 0.85 }
    specularColor:  { r: 0.9, g: 0.9, b: 0.9 }
    specular:       0.9
    shine:          6.0
    towerPlacementNode()
    SceneJS.translate(
      { z: platformHeights[0] }
      SceneJS.scale(
        { x: 0.78, y: 0.78, z: 0.78 }
        platformGeometry("level0")
        levelNodes[0].archerTowers
        levelNodes[0].catapultTowers
      ) # scale
    ) # translate
    SceneJS.translate(
      { z: platformHeights[1] }
      platformGeometry("level1")
      levelNodes[1].archerTowers
      levelNodes[1].catapultTowers
    ) #translate
    SceneJS.translate(
      {z:platformHeights[2]}
      SceneJS.scale(
        { x: 1.22, y: 1.22, z: 1.22 }
        platformGeometry("level2")
        levelNodes[2].archerTowers
        levelNodes[2].catapultTowers
      ) # scale
    ) # translate
  ) # material  (platforms)

skyboxNode = 
  SceneJS.createNode(
    type: "scale"
    cfg:  { x: 100.0, y: 100.0, z: 100.0 },
    nodes: [
        type:           "material"
        cfg:
          baseColor:      { r: 1.0, g: 1.0, b: 1.0 }
          specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
          specular:       0.0
          shine:          0.0
        nodes: [
            type: "texture"
            cfg: { layers: [{uri:"textures/sky.png"}] }
            nodes: [
                type:       "geometry"
                cfg:
                  primitive:  "triangles"
                  positions:  [1, 1, 1,-1, 1, 1,-1,-1, 1, 1,-1, 1, 1, 1, 1, 1,-1, 1, 1,-1,-1, 1, 1,-1, 1, 1, 1, 1, 1,-1,-1, 1,-1,-1, 1, 1,-1, 1, 1,-1, 1,-1,-1,-1,-1,-1,-1, 1,-1,-1,-1, 1,-1,-1, 1,-1, 1,-1,-1, 1, 1,-1,-1,-1,-1,-1,-1, 1,-1, 1, 1,-1]
                  uv:         [1,1,0,1,0,0,1,0,0,1,0,0,1,0,1,1,1,0,1,1,0,1,0,0,1,1,0,1,0,0,1,0,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]
                  indices:    [0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]
              ]
          ]
      ]
  )

sceneLookAtURI = "SceneLookAt"
sceneLookAtConfig = 
  uri:  sceneLookAtURI
  eye:  { x: 0.0, y: 10.0, z: 7.0 }
  look: { x: 0.0, y: 0.0 }
  up:   { z: 1.0 }
  
sceneLookAtNode = 
  SceneJS.lookAt(
    sceneLookAtConfig
    SceneJS.camera(
      cameraConfig
      SceneJS.translate(
        x: 3.0
        #SceneJS.rotate((data) ->
        #    angle: data.get('pitch')
        #    x: 1.0
        #  SceneJS.rotate((data) ->
        #      angle: data.get('yaw')
        #      z: 1.0
        platformsNode
        SceneJS.stationary(skyboxNode)
        #  ) # rotate
        #) # rotate
      ) # translate
    ) # camera
  ) # lookAt

guiLightsConfig =
  sources: [
    type:      "dir"
    color:     { r: 1.0, g: 1.0, b: 1.0 }
    diffuse:   true
    specular:  false
    dir:       { x: 1.0, y: 1.0, z: -1.0 }
  #,
  #  type:      "ambient"
  #  color:     { r: 0.5, g: 0.5, b: 0.5 }
  ]
  
guiLookAtConfig = 
  eye:  { x: 0.0, y: 10.0, z: 4.0 }
  look: { x: 0.0, y: 0.0 }
  up:   { z: 1.0 }

numberedDaisNode = (index) ->
  node = towerNode(index, "selectTower"+index)
  node.addNode(SceneJS.instance {uri: towerURI[index]})
  SceneJS.translate(
    {x:index*-1.5}
    SceneJS.symbol({sid:"NumberedDais"}, BlenderExport.NumberedDais())
    SceneJS.rotate((data) ->
        angle: guiDiasRotPosition[index*2]
        z: 1.0
      SceneJS.rotate((data) ->
          angle: guiDiasRotPosition[index*2 + 1]
          x: 1.0
        SceneJS.instance  { uri: "NumberedDais" }
        node
      ) # rotate (x-axis)
    ) # rotate (z-axis)
  ) # translate
  
guiNode = 
  SceneJS.translate(
    {x:-8.0,y:-4.0}
    SceneJS.material(
      baseColor:      { r: 1.0, g: 1.0, b: 1.0 }
      specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
      specular:       0.0
      shine:          0.0
      numberedDaisNode(0)
      numberedDaisNode(1)
    ) # material
  ) # translate

gameScene = SceneJS.scene(
  canvasId: "gameCanvas"
  loggingElementId: "scenejsLog"
  SceneJS.symbol({sid:"ArcherTower"}, BlenderExport.ArcherTower())
  SceneJS.symbol({sid:"CatapultTower"}, BlenderExport.CatapultTower())
  SceneJS.renderer(
    clear:
      depth :   true
      color :   true
      stencil:  false
    clearColor: { r: 0.7, g: 0.7, b: 0.7 }
    SceneJS.lights(
      guiLightsConfig
      SceneJS.lookAt(
        guiLookAtConfig
        SceneJS.camera(
          cameraConfig
          guiNode
        ) # camera
      ) # lights
    ) # lookAt
    SceneJS.lights(
      sceneLightsConfig
      sceneLookAtNode
    ) # lights
  ) # renderer
) # scene

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
              parentNode = levelNodes[cz].archerTowers
            when 2 
              node = SceneJS.instance  { uri: towerURI[1] }
              parentNode = levelNodes[cz].catapultTowers
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


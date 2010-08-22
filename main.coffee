###
Gates of Olympus (A multi-layer Tower Defense game...)
Copyright 2010, Rehno Lindeque.

* Please visit http://gatesofolympus.com/.
* This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

#BillboardPlane = ->
#  SceneJS.Geometry.apply(this, arguments)
#  this._nodeType = "BillboardPlane"
#  if this._fixedParams
#    this._init(this._getParams())

###
Auxiliary functions
###

square = (x) -> x*x
min = (x, y) -> if x < y then x else y
max = (x, y) -> if x > y then x else y
clamp = (x, y, z) -> if (x < y) then y else (if x > z then z else x)

###
Globals
###

# Platforms
gridSize = 12
sqrGridSize = square(gridSize)
levels = 3

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
cellScale = 0.9    # size of a grid cell in world space
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
    left:   -12.5 * (1020.0 / 800.0)
    right:   12.5 * (1020.0 / 800.0)
    bottom: -12.5
    top:     12.5
    near:    0.1
    far:     300.0
    
lightConfig =
  sources: [
    type:          "dir"
    color:         { r: 1.0, g: 1.0, b: 1.0 }
    diffuse:       true
    specular:      false
    dir:           { x: 1.0, y: 1.0, z: -1.0 }
  ]

lookAtConfig = 
  eye:  { x: 0.0, y: 10.0, z: 10.0 }
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
    numberedDaisNode(0)
    numberedDaisNode(1)
  ) # translate

platformsNode = 
  SceneJS.scale(
    {x:1.0,y:1.0,z:1.0}
    SceneJS.material({
        baseColor:      { r: 0.7, g: 0.7, b: 0.7 }
        specularColor:  { r: 0.9, g: 0.9, b: 0.9 }
        specular:       0.9
        shine:          6.0
      }
      SceneJS.translate(
        {z:cellScale*10 + 1.15}
        SceneJS.scale(
          {x:0.78,y:0.78,z:0.78}
          platformGeometry("level0")
          levelNodes[0].archerTowers
          levelNodes[0].catapultTowers
        ) # scale
      ) # translate
      SceneJS.translate(
        {z:1.15}
        platformGeometry("level1")
        levelNodes[1].archerTowers
        levelNodes[1].catapultTowers
      ) #translate
      SceneJS.translate(
        {z:cellScale*-11 + 1.15}
        SceneJS.scale(
          {x:1.22,y:1.22,z:1.22}
          platformGeometry("level2")
          levelNodes[2].archerTowers
          levelNodes[2].catapultTowers
        ) # scale
      ) # translate
    ) # material  (platforms)
  ) # scale

skyboxNode = 
  SceneJS.scale(
    { x: 100.0, y: 100.0, z: 100.0 },
    SceneJS.material(
      baseColor:      { r: 1.0, g: 1.0, b: 1.0 }
      specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
      specular:       1.0
      shine:          0.1
      SceneJS.texture(
        {layers: [{uri:"textures/sky.png"}]}
        SceneJS.geometry(
          type:       "Skybox"
          primitive:  "triangles"
          positions:  [1, 1, 1,-1, 1, 1,-1,-1, 1, 1,-1, 1, 1, 1, 1, 1,-1, 1, 1,-1,-1, 1, 1,-1, 1, 1, 1, 1, 1,-1,-1, 1,-1,-1, 1, 1,-1, 1, 1,-1, 1,-1,-1,-1,-1,-1,-1, 1,-1,-1,-1, 1,-1,-1, 1,-1, 1,-1,-1, 1, 1,-1,-1,-1,-1,-1,-1, 1,-1, 1, 1,-1]
          uv:         [1,1,0,1,0,0,1,0,0,1,0,0,1,0,1,1,1,0,1,1,0,1,0,0,1,1,0,1,0,0,1,0,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]
          indices:    [0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]
        ) # geometry
      ) # texture
    ) # material
  ) # scale

gameScene = SceneJS.scene(
  {canvasId: "gameCanvas"}
  SceneJS.symbol({sid:"ArcherTower"}, BlenderExport.ArcherTower())
  SceneJS.symbol({sid:"CatapultTower"}, BlenderExport.CatapultTower())
  SceneJS.lookAt(
    lookAtConfig
    SceneJS.camera(
      cameraConfig
      guiNode
    ) # camera
  ) # lookAt
  SceneJS.lights(
    lightConfig
    SceneJS.lookAt(
      lookAtConfig
      SceneJS.camera(
        cameraConfig
        SceneJS.translate(
          x: 3.0
          SceneJS.rotate((data) ->
              angle: data.get('pitch')
              x: 1.0
            SceneJS.rotate((data) ->
                angle: data.get('yaw')
                z: 1.0
              platformsNode
              SceneJS.stationary(skyboxNode)
            ) # rotate
          ) # rotate
        ) # translate
      ) # camera
    ) # lookAt
  ) # lights
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

# Mouse inputs
lastX = 0
lastY = 0
dragging = false

handleKeyDown = (event) ->
  switch String.fromCharCode(event.keyCode)
    when 1 then currentTowerSelection =  1
    when 2 then currentTowerSelection =  2
    else        currentTowerSelection = -1

mouseDown = (event) ->
  lastX = event.clientX
  lastY = event.clientY
  dragging = true

mouseUp = ->
  dragging = false

mouseMove = (event) ->
  if dragging
    yaw += (event.clientX - lastX) * 0.5
    pitch += (event.clientY - lastY) * -0.5
    lastX = event.clientX
    lastY = event.clientY

canvas.addEventListener('mousedown', mouseDown, true)
canvas.addEventListener('mousemove', mouseMove, true)
canvas.addEventListener('mouseup', mouseUp, true)

window.render = ->
  for c in [0...numTowerTypes]
    guiDiasRotVelocity[c] += (Math.random() - 0.5) * 0.1
    guiDiasRotVelocity[c] -= 0.001 if guiDiasRotPosition[c] > 0
    guiDiasRotVelocity[c] += 0.001 if guiDiasRotPosition[c] < 0
    guiDiasRotVelocity[c] = clamp(guiDiasRotVelocity[c], -0.1, 0.1)
    guiDiasRotPosition[c] += guiDiasRotVelocity[c]
    guiDiasRotPosition[c] = clamp(guiDiasRotPosition[c], -20.0, 20.0)
  gameScene
    .setData({yaw: yaw, pitch: pitch})
    .render();

interval = window.setInterval("window.render()", 10);


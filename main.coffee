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

###
Globals
###

# Platforms
gridSize = 12
sqrGridSize = square(gridSize)
levels = 3

###
Tower definitions
###

#foo = (x,y) -> null
#boo = (z) -> null
#a = (b) -> 
#  c = 0
#  foo({
#      xxx: 0
#    }
#    boo(
#      0
#    )
#  )
#  c

archerTowersNode = (sid) -> 
  node = SceneJS.node {sid: sid}
  SceneJS.material(
    {
      baseColor:      { r: 0.37, g: 0.26, b: 0.115 }
      specularColor:  { r: 0.9, g: 0.9, b: 0.9 }
      specular:       0.0
      shine:          0.0
    }
    SceneJS.node {sid: sid}
  ) # material
  node

catapultTowersNode = (sid) -> 
  node = SceneJS.node {sid: sid}
  SceneJS.material({
      baseColor:      { r: 1.0, g: 1.0, b: 1.0 }
      specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
      specular:       0.0
      shine:          0.0
    }
    SceneJS.texture(
      { layers: [{ uri:"http://scenejs.org/library/textures/stone/BrickWall.jpg" }]}
      node
    ) # texture
  ) # material
  node


###
Level definitions
###

# Scene graph group nodes
levelNodes = new Array 3
levelNodes[0] = {
  archerTowers:   archerTowersNode "archerTowers0"
  catapultTowers: catapultTowersNode "catapultTowers0" }
levelNodes[1] = {
  archerTowers:   archerTowersNode "archerTowers1"
  catapultTowers: catapultTowersNode "catapultTowers1" }
levelNodes[2] = {
  archerTowers:   archerTowersNode "archerTowers2"
  catapultTowers: catapultTowersNode "catapultTowers2" }

# Platform nodes
cellScale = 3.0    # size of a grid cell in world space
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

gameScene = SceneJS.scene(
  {canvasId: "gameCanvas"}
  SceneJS.lights({
      sources: [{
        type:          "dir"
        color:         { r: 1.0, g: 1.0, b: 1.0 }
        diffuse:       true
        specular:      true
        dir:           { x: 1.0, y: 1.0, z: -1.0 }
      }]
    }
    SceneJS.lookAt({
        eye:  { x: 0.0, y: 10.0, z: 10.0 }
        look: { x: 0.0, y: 0.0 }
        up:   { z: 1.0 }
      }
      # Background image (TODO)
      #SceneJS.stationary(
      #  {}
      #  SceneJS.renderer(
      #    {enableTexture2D : true}
      #    SceneJS.scale(
      #      { x: 100.0, y: 100.0, z: 100.0 },
      #      SceneJS.objects.cube
      #    ) # scale
      #  ) # renderer
      #) # stationary
      SceneJS.camera({
         optics: {
          type:   "ortho"
          left:   -10.0 * (1020.0 / 600.0)
          right:   10.0 * (1020.0 / 600.0)
          bottom: -10.0
          top:     10.0
          near:    0.1
          far:     300.0
        }}
        SceneJS.rotate((data) -> {
            angle: data.get('pitch')
            x: 1.0
          }
          SceneJS.rotate((data) -> {
              angle: data.get('yaw')
              z: 1.0
            }
            SceneJS.symbol({sid:"ArcherTower"}, BlenderExport.ArcherTower())
            SceneJS.symbol({sid:"CatapultTower"}, BlenderExport.CatapultTower())
            SceneJS.scale(
              {x:0.3,y:0.3,z:0.3}
              #SceneJS.material({
              #  baseColor:      { r: 0.7, g: 0.7, b: 0.7 }
              #  specularColor:  { r: 0.9, g: 0.9, b: 0.9 }
              #  specular:       0.9
              #  shine:          6.0
              #}
              SceneJS.translate(
                {z:25}
                SceneJS.scale(
                  {x:0.75,y:0.75,z:0.75}
                  platformGeometry("level0")
                  levelNodes[0].archerTowers
                  levelNodes[0].catapultTowers
                )
                SceneJS.scale(
                  {x:0.875,y:0.875,z:0.875}
                  platformGeometry("level1")
                  levelNodes[1].archerTowers
                  levelNodes[1].catapultTowers
                ) # scale
                SceneJS.translate(
                  {z:-25}
                  platformGeometry("level2")
                  levelNodes[2].archerTowers
                  levelNodes[2].catapultTowers
                ) # translate
              #) # material  (planes)
            ) # scale
          ) # rotate
        ) # rotate
      ) # camera
    ) # lookAt
  ) # lights
) # scene

###
Initialization and rendering loop
###

# Camera parameters
yaw = 0
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
  for iz in [0...levels]
    for iy in [0...gridSize]
      for ix in [0...gridSize]
        t = towers[iz * sqrGridSize + iy * gridSize + ix]
        if t != 0
          switch t
            when 1 
              towerNode = SceneJS.instance  { uri: "../ArcherTower" }
              parentNode = levelNodes[iz].archerTowers
            when 2 
              towerNode = SceneJS.instance  { uri: "../CatapultTower" }
              parentNode = levelNodes[iz].catapultTowers
            else 
              alert "" + (iz * sqrGridSize + iy * gridSize + ix) + " : " + t
          parentNode.addNode(
            SceneJS.translate(
              {x: cellScale * (ix - gridSize / 2), y: cellScale * (iy - gridSize / 2)}
              towerNode
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
  gameScene
    .setData({yaw: yaw, pitch: pitch})
    .render();

interval = window.setInterval("window.render()", 10);


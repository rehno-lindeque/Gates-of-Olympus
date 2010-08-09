###
Olympus Tower Defence
Copyright (C) 2010, Rehno Lindeque.
###

#BillboardPlane: ->
#  SceneJS.Geometry.apply(this, arguments)
#  this._nodeType = "BillboardPlane"
#  if this._fixedParams
#    this._init(this._getParams())

###
The main scene definition
###

#SceneJS.symbol({ sid: "ArcherTower" }, BlenderExport.ArcherTower())

#towersNode: new SceneJS.Node {sid: "towers"}
levels = new Array 3
levels[0] = SceneJS.node {sid: "level0"}
levels[1] = SceneJS.node {sid: "level1"}
levels[2] = SceneJS.node {sid: "level2"}

#archerTower: new SceneJS.Material(
#  {
#    baseColor:      { r: 0.37, g: 0.26, b: 0.115 }
#    specularColor:  { r: 0.9, g: 0.9, b: 0.9 }
#    specular:       0.0
#    shine:          0.0
#  }
#  BlenderExport.ArcherTower()
#) # material (Archer tower)

gameScene: SceneJS.scene(
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
    eye : { x: 0.0, y: 10.0, z: 10.0 }
    look : { x: 0.0, y: 0.0 }
    up : { z: 1.0 }
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
    #optics: {
    #  type: "perspective"
    #  fovy : 25.0
    #  aspect : 1.0
    #  near : 0.10
    #  far : 300.0  }
     optics: {
      type:   "ortho"
      left:   -10.0
      right:   10.0
      bottom: -10.0
      top:     10.0
      near:    0.1
      far:     300.0 }
    }
  SceneJS.rotate((data) -> {
    angle: data.get('pitch'), x: 1.0
  },
  SceneJS.rotate((data) -> {
    angle: data.get('yaw'), z: 1.0
  },
  SceneJS.symbol(
    {sid:"ArcherTower"}
    SceneJS.material(
      {
        baseColor:      { r: 0.37, g: 0.26, b: 0.115 }
        specularColor:  { r: 0.9, g: 0.9, b: 0.9 }
        specular:       0.0
        shine:          0.0
      }
      BlenderExport.ArcherTower()
    ) # material (Archer tower)
  ) # symbol
  SceneJS.symbol(
    {sid:"CatapultTower"}
    SceneJS.material(
      {
        baseColor:      { r: 0.2, g: 0.2, b: 0.2 }
        specularColor:  { r: 0.9, g: 0.9, b: 0.9 }
        specular:       0.0
        shine:          0.0
      }
      BlenderExport.CatapultTower()
    ) # material (Catapult tower)
  ) # symbol  
  SceneJS.scale({x:0.4,y:0.4,z:0.4}
  SceneJS.material({
    baseColor:      { r: 0.7, g: 0.7, b: 0.7 }
    specularColor:  { r: 0.9, g: 0.9, b: 0.9 }
    specular:       0.9
    shine:          6.0
  },
  SceneJS.scale(
    {x:0.8,y:0.8,z:0.8}
    SceneJS.geometry({
      type: "plane0"
      primitive: "triangles"
      positions: 
        [
          -15,  15,  15
           15,  15,  15
           15, -15,  15
          -15, -15,  15
        ]
      indices: [0,  1,  2, 0, 2, 3]
    })
    levels[0]
  )
  SceneJS.scale(
    {x:0.9,y:0.9,z:0.9}
    SceneJS.geometry({
      type: "plane1"
      primitive: "triangles"
      positions: 
        [
          -15,  15,  0
           15,  15,  0
           15, -15,  0
          -15, -15,  0
        ]
      indices: [0,  1,  2, 0, 2, 3]
    })
    levels[1]
  )  
  SceneJS.geometry({
    type: "plane2"
    primitive: "triangles"
    positions: 
      [
        -15,  15, -15
         15,  15, -15 
         15, -15, -15
        -15, -15, -15
      ]
    indices: [0,  1,  2, 0, 2, 3]
  })
  levels[2]
  ) # material  (planes)
  ) # scale
  ) # rotate
  ) # rotate
  ) # lookAt
  ) # perspective
  ) # lights
) # scene

###
Initialization and rendering loop
###

yaw: 0
pitch: 0
lastX: 0
lastY: 0
dragging: false

gameScene
  .setData({yaw: yaw, pitch: pitch})
  .render()

canvas: document.getElementById(gameScene.getCanvasId())

mouseDown: (event) ->
  lastX: event.clientX
  lastY: event.clientY
  dragging: true

mouseUp: ->
  dragging: false

mouseMove: (event) ->
  if dragging
    yaw += (event.clientX - lastX) * 0.5
    pitch += (event.clientY - lastY) * -0.5
    gameScene
      .setData({yaw: yaw, pitch: pitch})
      .render()
    lastX: event.clientX
    lastY: event.clientY

canvas.addEventListener('mousedown', mouseDown, true)
canvas.addEventListener('mousemove', mouseMove, true)
canvas.addEventListener('mouseup', mouseUp, true)


###
Game logic
###
towers: new Array 300
for c in [0...300]
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

towers[190] = 1
towers[191] = 2
towers[192] = 1
towers[193] = 1
towers[194] = 1
towers[195] = 2
towers[196] = 1
towers[197] = 2
towers[198] = 1
towers[199] = 1

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


createTowers: (towers) ->
  for iz in [0...3]
    for iy in [0...10]
      for ix in [0...10]
        t: towers[iz * 100 + iy * 10 + ix]
        if t != 0
          switch t
            when 1 then towerNode: new SceneJS.Instance  { uri: "../ArcherTower" }
            when 2 then towerNode: new SceneJS.Instance  { uri: "../CatapultTower" }
            else 
              alert "" + (iz * 100 + iy * 10 + ix) + " : " + t
          levels[iz].addNode(
            new SceneJS.Translate(
              {x: 3.0 * (ix-5), y: 3.0 * (iy-5), z: 15.0 * (1-iz)}
              towerNode
            )
          )
  null

createTowers towers



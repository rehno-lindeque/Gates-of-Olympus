###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
A proxy for the skybox
###

class Skybox
  constructor: () ->
    @node = 
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
          ])

###
Tower scene graph nodes
###

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

towerPlacementNode = () ->
  tower1 = towerNode(0, "placementTower"+0)
  tower1.addNode(SceneJS.instance {target: towerIds[0]})
  tower2 = towerNode(1, "placementTower"+1)
  tower2.addNode(SceneJS.instance {target: towerIds[1]})
  SceneJS.translate(
    { id: "placementTower", z: platformHeights[1] }
    SceneJS.selector(
      { sid: "placementTowerModel", selection: [0] }
      tower1
      tower2
    ) # selector
  ) # translate

###
A proxy for the whole level with platforms and creatures etc.
###

class Level
  constructor: () ->
    @creatures = new Creatures
    @towerNodes = new Array 3
    @towerNodes[0] = {
      archerTowers:   towerNode(0, "archerTowers0")
      catapultTowers: towerNode(1, "catapultTowers0") }
    @towerNodes[1] = {
      archerTowers:   towerNode(0, "archerTowers1")
      catapultTowers: towerNode(1, "catapultTowers1") }
    @towerNodes[2] = {
      archerTowers:   towerNode(0, "archerTowers2")
      catapultTowers: towerNode(1, "catapultTowers2") }
    
    @towers = new Array (sqrGridSize * levels)
    for c in [0...(sqrGridSize * levels)]
      @towers[c] = -1
    
    @node =   
      SceneJS.material(
        #baseColor:      { r: 0.7, g: 0.7, b: 0.7 }
        baseColor:      { r: 0.75, g: 0.78, b: 0.85 }
        specularColor:  { r: 0.9, g: 0.9, b: 0.9 }
        specular:       0.9
        shine:          6.0
        SceneJS.translate(
          { z: platformHeights[1] }
          #todo: @creatures.node
        )
        towerPlacementNode()
        SceneJS.translate(
          { z: platformHeights[0] }
          SceneJS.scale(
            { x: 0.78, y: 0.78, z: 0.78 }
            platformGeometry("level0")
            @towerNodes[0].archerTowers
            @towerNodes[0].catapultTowers
          ) # scale
        ) # translate
        SceneJS.translate(
          { z: platformHeights[1] }
          platformGeometry("level1")
          @towerNodes[1].archerTowers
          @towerNodes[1].catapultTowers
        ) #translate
        SceneJS.translate(
          {z:platformHeights[2]}
          SceneJS.scale(
            { x: 1.22, y: 1.22, z: 1.22 }
            platformGeometry("level2")
            @towerNodes[2].archerTowers
            @towerNodes[2].catapultTowers
          ) # scale
        ) # translate
      ) # material  (platforms)
  
  getTowerRoot: (level, towerType) ->
    switch towerType
      when 0 then @towerNodes[level].archerTowers
      when 1 then @towerNodes[level].catapultTowers
      else null
  
  addTower: (towerPlacement, towerType) ->
    index = towerPlacement.level * sqrGridSize + towerPlacement.cell.y * gridSize + towerPlacement.cell.x
    #alert towerPlacement.cell.x + " " + towerPlacement.cell.y
    if @towers[index] == -1
      @towers[index] = towerType
      parentNode = @getTowerRoot(towerPlacement.level, towerType)
      node = SceneJS.instance  { target: towerIds[towerType] }
      cx = towerPlacement.cell.x
      cy = towerPlacement.cell.y
      cz = towerPlacement.level
      parentNode.addNode(
        SceneJS.translate(
          {x: cellScale * (cx - gridSize / 2) + cellScale * 0.5, y: cellScale * (cy - gridSize / 2) + cellScale * 0.5}
          node
        ) # translate
      ) # addNode
  
  createTowers: (towers) ->
    for cz in [0...levels]
      for cy in [0...gridSize]
        for cx in [0...gridSize]
          t = towers[cz * sqrGridSize + cy * gridSize + cx]
          if t != -1
            switch t
              when 0 
                node = SceneJS.instance  { target: towerIds[0] }
                parentNode = @towerNodes[cz].archerTowers
              when 1 
                node = SceneJS.instance  { target: towerIds[1] }
                parentNode = @towerNodes[cz].catapultTowers
            parentNode.addNode(
              SceneJS.translate(
                {x: cellScale * (cx - gridSize / 2) + cellScale * 0.5, y: cellScale * (cy - gridSize / 2) + cellScale * 0.5}
                node
              ) # translate
            ) # addNode
    null


###
The camera proxy
###

class SceneCamera
  constructor: (levelNode, backgroundNode) ->
    @config =
      optics:
        type:   "ortho"
        left:   -12.5 * (canvasSize[0] / canvasSize[1])
        right:   12.5 * (canvasSize[0] / canvasSize[1])
        bottom: -12.5
        top:     12.5
        near:    0.1
        far:     300.0
    @node = 
      SceneJS.camera(
        @config
        SceneJS.light(
          type:      "dir"
          color:     { r: 1.0, g: 1.0, b: 1.0 }
          diffuse:   true
          specular:  false
          dir:       { x: 1.0, y: 1.0, z: -1.0 }
        )
        #SceneJS.light(
        #  type:      "ambient"
        #  color:     { r: 0.5, g: 0.5, b: 0.5 }
        #)
        levelNode
        SceneJS.stationary backgroundNode
      ) # camera

###
The look-at proxy for the main game scene
###

class SceneLookAt
  constructor: (cameraNode) ->
    @angle = 0.0
    @radius = 10.0
    @node = 
      SceneJS.lookAt(
        id:   "SceneLookAt"
        eye:  { x: 0.0, y: -@radius, z: 7.0 }
        look: { x: 0.0, y: 0.0, z: 0.0 }
        up:   { x: 0.0, y: 0.0, z: 1.0 }
        cameraNode
      ) # lookAt
  
  update: () ->
    cosAngle = Math.cos @angle
    @node.setEye(
      x: (Math.sin @angle) * @radius
      y: cosAngle * -@radius
      z: 7.0
    ) # setEye

###
A proxy for dias tower selection gui element
###

#numberedDaisNode = (index) ->
#  node = towerNode(index, "selectTower"+index)
#  node.addNode(SceneJS.instance { target: towerIds[index] })
#  SceneJS.translate(
#    {x:index*1.5}
#    BlenderExport.NumberedDais()
#    SceneJS.rotate((data) ->
#        angle: guiDiasRotPosition[index*2]
#        z: 1.0
#      SceneJS.rotate((data) ->
#          angle: guiDiasRotPosition[index*2 + 1]
#          x: 1.0
#        SceneJS.instance  { target: "NumberedDais" }
#        node
#      ) # rotate (x-axis)
#    ) # rotate (z-axis)
#  ) # translate

guiDaisNode = (id, index) ->
  type: "translate"
  id: id
  cfg: { x: index * 1.5 }
  nodes: [
      type: "rotate"
      sid: "rotZ"
      cfg:
        angle: guiDiasRotPosition[index*2]
        z: 1.0
      nodes: [
          type: "rotate"
          sid: "rotX"
          cfg:
            angle: guiDiasRotPosition[index*2]
            x: 1.0
          nodes: [
              type: "instance"
              cfg: { target: "NumberedDais" }
            ,
              type: "texture"
              cfg: 
                layers: [{uri: towerTextureURI[index]}]
              nodes: [
                  type: "instance"
                  cfg: { target: towerIds[index] }
                ]
            ]
        ]
    ]

class GUIDais
  constructor: (index) ->
    #@node = numberedDaisNode index
    @index = index
    @id = "dais" + index
    geomNode = BlenderExport.NumberedDais()
    @node = SceneJS.createNode guiDaisNode(@id, index)
  
  update: () ->
    SceneJS.fireEvent(
      "configure"
      @id
      cfg:
        "#rotZ":
          angle: guiDiasRotPosition[@index*2]
          z: 1.0
          "#rotX":
            angle: guiDiasRotPosition[@index*2+1]
            x: 1.0
    )

###
Top level GUI container
###

class GUI
  constructor: () ->
    @daises = new Array 2
    @daises[0] = new GUIDais 0
    @daises[1] = new GUIDais 1
    @node = 
      SceneJS.translate(
        {x:8.0,y:4.0}
        SceneJS.material(
          baseColor:      { r: 1.0, g: 1.0, b: 1.0 }
          specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
          specular:       0.0
          shine:          0.0
          @daises[0].node
          @daises[1].node
        ) # material
      ) # translate
  
  update: () ->
    @daises[0].update()
    @daises[1].update()
###
Proxy instances
###

gui = new GUI
skybox = new Skybox
level = new Level
sceneCamera = new SceneCamera(level.node, skybox.node)
sceneLookAt = new SceneLookAt sceneCamera.node

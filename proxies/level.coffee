
###
Tower scene graph nodes
###

towerNode = (index, sid) -> 
  type: "material"
  baseColor:      { r: 1.0, g: 1.0, b: 1.0 }
  specularColor:  { r: 1.0, g: 1.0, b: 1.0 }
  specular:       0.0
  shine:          0.0
  nodes: [
      type: "texture"
      layers: [ uri: towerTextureURI[index] ]
    ]

towerPlacementNode = () ->
  type: "translate"
  id: "placementTower" 
  z: platformHeights[1]
  nodes: [
      type: "selector"
      sid: "placementTowerModel"
      selection: [0]
      nodes: [
          addChildren(towerNode(0, "placementTower"+0),
            type: "instance"
            target: towerIds[0]
          )
          addChildren(towerNode(1, "placementTower"+1),
            type: "instance"
            target: towerIds[1]
          )
        ]
    ]

###
A proxy for the whole level with platforms and creatures etc.
###

class Level
  constructor: () ->
    @creatures = new Creatures
    @towerNodes = [
        archerTowers:   towerNode(0, "archerTowers0")
        catapultTowers: towerNode(1, "catapultTowers0")
      ,
        archerTowers:   towerNode(0, "archerTowers1")
        catapultTowers: towerNode(1, "catapultTowers1")
      ,
        archerTowers:   towerNode(0, "archerTowers2")
        catapultTowers: towerNode(1, "catapultTowers2")
      ]
    
    @towers = new Array (sqrGridSize * levels)
    for c in [0...(sqrGridSize * levels)]
      @towers[c] = -1
    
    @node = 
      type: "material"
      #baseColor:      { r: 0.7, g: 0.7, b: 0.7 }
      baseColor:      { r: 0.75, g: 0.78, b: 0.85 }
      specularColor:  { r: 0.9, g: 0.9, b: 0.9 }
      specular:       0.9
      shine:          6.0
      nodes: [
          type: "translate"
          z: platformHeights[1]
          nodes: [ @creatures.node ]
        ,
          towerPlacementNode()
        ,
          type: "translate"
          z: platformHeights[0]
          nodes: [
              type: "scale"
              x: 0.78
              y: 0.78
              z: 0.78
              nodes: [
                  platformGeometry("level0")
                  @towerNodes[0].archerTowers
                  @towerNodes[0].catapultTowers
                ]
            ]
          ,
          type: "translate"
          z: platformHeights[1]
          nodes: [
              platformGeometry("level1")
              @towerNodes[1].archerTowers
              @towerNodes[1].catapultTowers 
            ]
          ,
          type: "translate"
          z: platformHeights[2]
          nodes: [
              type: "scale"
              x: 1.22
              y: 1.22
              z: 1.22
              nodes: [
                  platformGeometry("level2")
                  @towerNodes[2].archerTowers
                  @towerNodes[2].catapultTowers
                ]
            ]
        ]
  
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
      node = { type: "instance", target: towerIds[towerType] }
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
  
  update: () ->
    @creatures.update()



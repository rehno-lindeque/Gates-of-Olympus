###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
The main scene definition
###

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
  eye:  { x: 0.0, y: -10.0, z: 4.0 }
  look: { x: 0.0, y: 0.0 }
  up:   { z: 1.0 }

numberedDaisNode = (index) ->
  node = towerNode(index, "selectTower"+index)
  node.addNode(SceneJS.instance {uri: towerURI[index]})
  SceneJS.translate(
    {x:index*1.5}
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
    {x:8.0,y:4.0}
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
          sceneCamera.config
          guiNode
        ) # camera
      ) # lights
    ) # lookAt
    SceneJS.translate(
      { x: gameSceneOffset[0], y: gameSceneOffset[1], z: gameSceneOffset[2] }
      SceneJS.lights(
        sceneLightsConfig
        sceneLookAt.node
      ) # lights
    ) # translate
  ) # renderer
) # scene


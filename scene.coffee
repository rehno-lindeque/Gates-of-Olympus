###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
The main scene definition
###

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
  node.addNode(SceneJS.instance { target: towerIds[index] })
  SceneJS.translate(
    {x:index*1.5}
    BlenderExport.NumberedDais()
    SceneJS.rotate((data) ->
        angle: guiDiasRotPosition[index*2]
        z: 1.0
      SceneJS.rotate((data) ->
          angle: guiDiasRotPosition[index*2 + 1]
          x: 1.0
        SceneJS.instance  { target: "NumberedDais" }
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
  BlenderExport.ArcherTower()
  BlenderExport.CatapultTower()
  SceneJS.renderer(
    clear:
      depth :   true
      color :   true
      stencil:  false
    clearColor: { r: 0.7, g: 0.7, b: 0.7 }
    SceneJS.lookAt(
      guiLookAtConfig
      SceneJS.camera(
        sceneCamera.config
        SceneJS.light(guiLightsConfig)
        guiNode
      ) # camera
    ) # lookAt
    SceneJS.translate(
      { x: gameSceneOffset[0], y: gameSceneOffset[1], z: gameSceneOffset[2] }
      sceneLookAt.node
    ) # translate
  ) # renderer
) # scene


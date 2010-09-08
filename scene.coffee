###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Proxies
###

gui = new GUI
skybox = new Skybox
backgroundCamera = new BackgroundCamera skybox.node
level = new Level
levelCamera = new LevelCamera(level.node)
levelLookAt = new LevelLookAt(levelCamera.node, backgroundCamera.node)

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
        levelCamera.config
        SceneJS.light(guiLightsConfig)
        gui.node
      ) # camera
    ) # lookAt
    levelLookAt.node
    levelLookAt.backgroundLookAtNode
  ) # renderer
) # scene


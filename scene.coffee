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
guiCamera = new GUICamera(gui, levelCamera)

###
The main scene definition
###

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
      gui.lookAtConfig
      guiCamera.node
    ) # lookAt
    levelLookAt.node
    levelLookAt.backgroundLookAtNode
  ) # renderer
) # scene


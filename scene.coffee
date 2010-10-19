###
Copyright 2010, Rehno Lindeque.
This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
###

###
Proxies
###

gui = new GUI
skybox = new Skybox
backgroundCamera = new BackgroundCamera(skybox.node)
level = new Level
levelCamera = new LevelCamera(level.node)
levelLookAt = new LevelLookAt(levelCamera.node, backgroundCamera.node)
guiCamera = new GUICamera(gui, levelCamera)

###
The main scene definition
###

sceneNode =
  type: "scene"
  id: "gameScene"
  canvasId: "gameCanvas"
  loggingElementId: "scenejsLog"
  nodes: [
      BlenderExport.ArcherTower
    ,
      BlenderExport.CatapultTower
    ,
      type: "renderer"
      clear:
        depth:    true
        color:    true
        stencil:  false
      clearColor: { r: 0.7, g: 0.7, b: 0.7 }
      nodes: [
          addChildren(gui.lookAtNode, guiCamera.node)
        ,
          levelLookAt.node
        ,
          levelLookAt.backgroundLookAtNode
        ]
    ]

gameScene = SceneJS.createNode(sceneNode)




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
moon = new Moon
sun = new Sun

###
The main scene definition
###

sceneNode =
  type: "scene"
  id: "gameScene"
  canvasId: "gameCanvas"
  loggingElementId: "scenejsLog"
  nodes: [
    type: "geometry"
    resource: "tmp"
    primitive: "triangles"
    positions: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    indices: [0, 1, 2]
  ,
    type: "renderer"
    clear:
      depth:    true
      color:    true
      stencil:  false
    clearColor: { r: 0.7, g: 0.7, b: 0.7 }
    nodes: [
      graft(gui.lookAtNode, [guiCamera.node])
    ,
      levelLookAt.node
    ,
      levelLookAt.backgroundLookAtNode
    ]
  ]

gameScene = SceneJS.createNode(sceneNode)




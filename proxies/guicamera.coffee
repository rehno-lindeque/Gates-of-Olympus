#
# Copyright 2010-2011, Rehno Lindeque, Theunis Kotze.
# This game is licensed under GPL Version 2. See http://gatesofolympus.com/LICENSE for more information.
#

class GUICamera
  constructor: (gui, referenceCamera) ->
    @referenceCamera = referenceCamera
    @node =
      type: "camera"
      id:   "guiCamera"
      optics: levelCamera.optics
      nodes: [
          #gui.lightNode
          gui.node
        ] # camera
  
  withNode: -> SceneJS.withNode "guiCamera"
  
  reconfigure: -> @withNode().set("optics", @referenceCamera.optics)

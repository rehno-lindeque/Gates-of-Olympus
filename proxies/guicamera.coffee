
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


class GUICamera
  constructor: (gui, referenceCamera) ->
    @referenceCamera = referenceCamera
    @node =
      type: "camera"
      optics: levelCamera.optics
      nodes: [
          gui.lightNode
          gui.node
        ] # camera
  
  reconfigure: ->
    if @node then @node.setOptics @referenceCamera.config.optics



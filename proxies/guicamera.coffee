
class GUICamera
  constructor: (gui, referenceCamera) ->
    @referenceCamera = referenceCamera
    @node =
      SceneJS.camera(
        levelCamera.config
        SceneJS.light(gui.lightConfig)
        gui.node
      ) # camera
  
  reconfigure: ->
    if @node then @node.setOptics @referenceCamera.config.optics



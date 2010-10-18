###
Background proxies
###

class BackgroundCamera
  constructor: (backgroundNode) ->
    @reconfigure()
    @node = 
      SceneJS.camera(
        @config
        SceneJS.cloudDome(
          radius:  100.0
          SceneJS.stationary backgroundNode
        ) # cloudDome
      ) # camera
  
  reconfigure: ->
    @config =
      optics:
        type:   "perspective"
        fovy:   25.0
        aspect: canvasSize[0] / canvasSize[1]
        near:   0.10
        far:    300.0
    if @node then @node.setOptics(@config.optics)


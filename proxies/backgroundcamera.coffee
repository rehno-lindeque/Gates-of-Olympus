###
Background proxies
###

class BackgroundCamera
  constructor: (backgroundNode) ->
    @optics = 
      type:   "perspective"
      fovy:   25.0
      aspect: canvasSize[0] / canvasSize[1]
      near:   0.10
      far:    300.0
    @node = 
      type:   "camera"
      id:     "backgroundCamera"
      optics: @optics
      nodes: [
          type: "stationary"
          nodes: [ backgroundNode ]
          #type: "cloudDome"
          #radius:  100.0
          #nodes: [ 
          #    type: "stationary"
          #    nodes: [ backgroundNode ]
          #  ]
        ]
      
  withNode: -> SceneJS.withNode "backgroundCamera"
  
  reconfigure: -> @withNode().set("optics", @optics)
  

